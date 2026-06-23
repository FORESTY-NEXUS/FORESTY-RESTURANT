import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Google login is disabled' }, { status: 404 });
}
