import { NextResponse } from "next/server";
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from '@vercel/postgres';
import { Database } from '../../../../db/model';

const db = createKysely<Database>();

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription.endpoint) {
      throw "Subscription must have the endpoint!";
    }

    await sql`
        INSERT INTO subscriptions (endpoint, expirationTime, keys)
        VALUES (${subscription.endpoint}, ${subscription.expirationTime}, ${subscription.keys})
        ON CONFLICT (id) DO NOTHING;
      `

    // return NextResponse.json({ message: "CRESTED SUBSCRIPTION", success: true, subscription });
    return new Response(JSON.stringify({ message: "CRESTED SUBSCRIPTION", success: true, subscription }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, success: false });
  }
}

export async function GET() {
  const subscriptions = await db
    .selectFrom('subscriptions')
    .selectAll()
    .execute()

  return NextResponse.json({ success: true, subscriptions: subscriptions.length });
}
