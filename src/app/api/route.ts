import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
  // return NextResponse.json({ message: "GET This Worked", success: true });
}

export async function POST(request: Request) {
  try {
    return NextResponse.json({ message: "POST This Worked", success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err, success: false });
  }
}
