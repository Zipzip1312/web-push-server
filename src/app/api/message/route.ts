import { NextRequest, NextResponse } from "next/server";
import { createKysely } from '@vercel/postgres-kysely';
import { Database } from '../../../../db/model';

const webpush = require('web-push');
const db = createKysely<Database>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || 'NO MESSAGE';
    const subscriptions = await db.selectFrom('subscriptions').selectAll().execute()

    for (let i = 0; i < subscriptions.length; i++) {
      await triggerNotification(subscriptions[i], message)
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
