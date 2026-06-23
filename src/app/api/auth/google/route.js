import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { idToken } = body;
  // Stub for Google logic: Normally decode idToken, find/create user, return standard JWT
  return NextResponse.json({ message: 'Google OAuth integration pending Client ID' });
}
