 
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name,  email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      })
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      )

      return NextResponse.json({ 
        token,
        user: {
          id: user.id,
         name: name, // Use the provided name even though it's not in DB yet
          email: user.email,
        }
      })

  } catch (err ) {
    console.log("[SIGNUP_ERROR]", err)    
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

}
