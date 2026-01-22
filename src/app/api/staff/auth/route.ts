import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const staffAccessCode = process.env.STAFF_ACCESS_CODE;

    if (!staffAccessCode) {
      console.error('STAFF_ACCESS_CODE is not defined in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password === staffAccessCode) {
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
