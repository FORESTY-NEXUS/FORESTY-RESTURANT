import { NextResponse } from 'next/server';

export async function POST(req) {
  // We'll generate a reset token and email it (placeholder response for now)
  return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
}
