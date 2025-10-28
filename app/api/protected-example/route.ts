import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Example protected API endpoint
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso obrigatório' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // This is a protected endpoint - only authenticated users can access
    return NextResponse.json({
      message: 'Acesso autorizado ao endpoint protegido',
      userId: decoded.userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Protected API error:', error);
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de acesso obrigatório' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const body = await request.json();

    // Example: Save user-specific data
    return NextResponse.json({
      message: 'Dados salvos com sucesso',
      userId: decoded.userId,
      data: body,
    });
  } catch (error) {
    console.error('Protected API error:', error);
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }
}