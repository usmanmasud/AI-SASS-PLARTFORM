import Replicate from "replicate";
import { NextResponse } from "next/server";

// Initialize Replicate client with the API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "", // Make sure your Replicate API key is set in the environment variables
});

export async function POST(req: Request) {
  try {
    // Check if the content type is JSON
    const contentType = req.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json({ error: "Only JSON content is accepted" }, { status: 400 });
    }

    // Parse the incoming request body
    const body = await req.json();
    const prompt = body?.prompt || body?.messages?.[0]?.content;

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call Replicate API to generate music
    const output: { audio?: string } | Array<{ audio?: string }> = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", 
      { input: { prompt_b: prompt } }
    );

    // Return the audio URL in the response
    return NextResponse.json({
      audio: Array.isArray(output) ? output[0]?.audio : output?.audio || null, // Safely accessing the audio property
    });

  } catch (error: any) {
    // Handle errors and return an appropriate message
    console.error("[REPLICATE_MUSIC_ERROR]", error);
    return NextResponse.json({ error: error?.message || "Music generation failed" }, { status: 500 });
  }
}
