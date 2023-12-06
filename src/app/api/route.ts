import { NextResponse, NextRequest } from "next/server";
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from '@vercel/postgres';
import { Database } from '../../../db/model';

const db = createKysely<Database>();
const webpush = require('web-push');

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription?.endpoint) {
      throw "Subscription must have endpoint.";
    }

    if (!subscription?.userId || !subscription?.userName) {
      throw "No User Data provided!";
    }

    const { userId, userName, endpoint, expirationTime, keys } = subscription;

    await sql`
        INSERT INTO subscriptions (userId, userName, endpoint, expirationTime, keys)
        VALUES (${userId}, ${userName}, ${endpoint}, ${expirationTime}, ${keys})
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

    if (message) {
      for (let i = 0; i < subscriptions.length; i++) {
        await sendNotification(subscriptions[i], message)
      }

      return NextResponse.json({ success: true, recipients: subscriptions.length, message });
    }

    return NextResponse.json({ success: true, subscriptions });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, success: false });
  }
}

async function sendNotification(subscription: any, message: string) {
  return webpush.sendNotification(subscription, JSON.stringify({
    notification: {
      title: message,
      message: 'Натисніть, щоб перейти в Табель',
      icon: 'https://epicentrk.ua/upload/medialibrary/659/apple_touch_icon.png',
      data: {
        onActionClick: {
          default: {
            operation: "openWindow",
            url: "https://portal-qa4.epicentrk.ua/unit-timesheet/table?unitId=48&period=2023-11&customUserListId=-1&customUserGroupId=-1&includeServiceCard=false&tableType=plan&search=&departmentId=2&subDepartmentId=0"
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

