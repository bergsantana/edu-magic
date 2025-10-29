import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { status: 200 }
    );
    
    // Clear the auth token cookie
    response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });
    
    
    const cookieStore  = await cookies()
    cookieStore.delete('edu-magic-auth-token')
    
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}