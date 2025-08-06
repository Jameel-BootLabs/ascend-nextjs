import { NextRequest, NextResponse } from 'next/server';
import { getSession, getCurrentUser, isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const user = await getCurrentUser();
    const adminAccess = await isAdmin();
    
    return NextResponse.json({
      success: true,
      session: !!session,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image
      } : null,
      isAdmin: adminAccess,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}