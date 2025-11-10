import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  //  const { email, password  } = await req.json()

  const LLM_URL = process.env.LLM_URL || "http://localhost:5000";
  //const LLM_API_KEY = process.env.LLM_API_KEY || "your-llm-api-key";
  // console.log("Generating content with prompt:", prompt);
  // console.log("Using LLM URL:", LLM_URL);

  const ai = new GoogleGenAI({});

  
  //console.log("LLM generation response:", res);
  
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("LLM generation response:", res.text);
    if (!res?.text) throw new Error("No text returned from API");

    

    return NextResponse.json({
      generatedText: res?.text,
      error: null 
    })
  } catch (error) {
    console.log("Error during LLM generation:", error);
    return NextResponse.json({
      error: "Failed to parse generated text:",
      generatedText: ''
    }, { status: 500 });
  }

   
}
