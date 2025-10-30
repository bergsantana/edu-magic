 
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password  } = await req.json()


  if (!email || !password  )
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const API_URL = process.env.API_URL || 'http://localhost:3333';

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.error || 'Login failed' }, { status: response.status });
  }

  const data = await response.json();
  const { token, user } = data;
  // const user = await prisma.user.findUnique({ where: { email } })
  // if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  // const valid = await bcrypt.compare(password, user.password)
  // if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  // const token = jwt.sign(
  //   { userId: user.id, email: user.email },
  //   process.env.JWT_SECRET!,
  //   { expiresIn: "1d" }
  // )
  // console.log('token?', token)
  // console.log('user?', user )

  const cookieStore = await cookies()
  cookieStore.set('edu-magic-auth-token', token, { path: '/', maxAge: 7 * 24 * 60 * 60, sameSite: 'strict' });

  return NextResponse.json({ 
    token,
    user: {
      id: user.id,
      name: user.name,
      //name: user.email.split('@')[0], // Use email username as name for now
      email: user.email,
    }
  })
}
