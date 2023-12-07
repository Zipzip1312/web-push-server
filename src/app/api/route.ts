import { NextResponse, NextRequest } from "next/server";
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from '@vercel/postgres';
import { Database } from '../../../db/model';

interface IMessageRecipient {
  userid: number
  username: string
  message: string
}

const db = createKysely<Database>();
const webpush = require('web-push');

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    const message = subscription?.message;
    const unsubscribe = subscription?.unsubscribe || false;

    if (!subscription && !message) {
      throw "No Subscription or message.";
    }

    if (subscription && message) {
      await sendNotification(subscription, message);
      return NextResponse.json({ success: true, subscription, message });
    }

    if (!subscription?.endpoint) {
      throw "Subscription must have endpoint.";
    }

    if (!subscription?.userid || !subscription?.username) {
      throw "No User Data provided!";
    }

    // check if already subscribed
    const subscriber = await db
      .selectFrom('subscriptions')
      .selectAll()
      .where('subscriptions.userid', '=', subscription?.userid)
      .executeTakeFirst();

    if (subscriber) {
      if (unsubscribe) {
        await db.deleteFrom('subscriptions').where('subscriptions.userid', '=', subscription?.userid).execute();
        return NextResponse.json({ message: `${subscriber.username} has been unsubscribed!`, success: true });
      }
      return NextResponse.json({ message: "Already subscribed!", success: true });
    }

    const { userid, username, endpoint, expirationTime, keys } = subscription;

    await sql`
        INSERT INTO subscriptions (userid, username, endpoint, expirationTime, keys)
        VALUES (${userid}, ${username}, ${endpoint}, ${expirationTime}, ${keys})
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
    const subscriptions = await db.selectFrom('subscriptions').selectAll().execute()

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

