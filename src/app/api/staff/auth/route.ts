import { NextResponse } from 'next/server';

const STAFF_PASSWORD = '2018';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === STAFF_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set auth cookie - expires in 24 hours
      response.cookies.set('staff_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
