import { NextResponse, NextRequest } from "next/server";
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from '@vercel/postgres';
import { Database } from '../../../db/model';

const db = createKysely<Database>();
const webpush = require('web-push');

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription.endpoint) {
      throw "Subscription must have endpoint.";
    }

    await sql`
        INSERT INTO subscriptions (endpoint, expirationTime, keys)
        VALUES (${subscription.endpoint}, ${subscription.expirationTime}, ${subscription.keys})
        ON CONFLICT (id) DO NOTHING;
      `

    return NextResponse.json({ message: "CRESTED SUBSCRIPTION", success: true, subscription });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, success: false });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const message = url?.searchParams?.get('message');
    const subscriptions = await db.selectFrom('subscriptions').selectAll().execute()

    for (let i = 0; i < subscriptions.length; i++) {
      await triggerNotification(subscriptions[i], message || 'NO MESSAGE REQUESTED')
    }

    return NextResponse.json({ success: true, recipients: subscriptions.length, message });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, success: false });
  }
}

async function triggerNotification(subscription: any, message: string) {
  return webpush.sendNotification(subscription, JSON.stringify({
    notification: {
      title: message,
      data: {
        onActionClick: {
          default: {
            operation: "openWindow",
            url: "http://localhost:3000/"
          }
        }
      }
    }
  }), {
    vapidDetails: {
      subject: 'mailto:email@example.com',
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY
    },
    TTL: 60
  })
    .catch((err: any) => {
      console.error("Error sending notification, reason: ", err);
    });
}

