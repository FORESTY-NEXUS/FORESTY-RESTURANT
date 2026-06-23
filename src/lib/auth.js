import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from './models/User';
import connectDB from './db';

export function generateToken(id) {
  if (!process.env.JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

/**
 * Gets the authenticated user from the Request headers
 * Will return { user } if valid, { errorResponse } if invalid
 */
export async function getSession(req) {
  await connectDB();
  
  const authHeader = req.headers.get('authorization');
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return { errorResponse: NextResponse.json({ message: 'Not authorized, no token' }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return { errorResponse: NextResponse.json({ message: 'Not authorized, user not found' }, { status: 401 }) };
    }
    
    return { user };
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return { errorResponse: NextResponse.json({ message: 'Not authorized, token failed' }, { status: 401 }) };
  }
}

/**
 * Checks if the user is in the authorized roles
 */
export function requireRoles(user, ...roles) {
  if (!user || (!roles.includes(user.role))) {
    return NextResponse.json({ 
      message: `User role ${user?.role || 'unknown'} is not authorized to access this route` 
    }, { status: 403 });
  }
  return null;
}
