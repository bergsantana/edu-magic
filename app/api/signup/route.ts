 
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name,  email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  //const existingUser = await prisma.user.findUnique({ where: { email } })
  //if (existingUser)
//  return NextResponse.json({ error: "User already exists" }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
     
    const API_URL = process.env.API_URL || 'http://localhost:3333';
    
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Signup failed' }, { status: response.status });
    }
  
    const data = await response.json();
    const { message } = data;
    return NextResponse.json({ message }, { status: 201 });
  
 
  } catch (err ) {
    console.log("[SIGNUP_ERROR]", err)    
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

}
