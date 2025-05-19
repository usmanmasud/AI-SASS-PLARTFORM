import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // Ensure JSON content-type
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Only JSON content is accepted" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate contents array
    if (!body?.contents || !Array.isArray(body.contents)) {
      return NextResponse.json(
        { error: "Contents array is required" },
        { status: 400 }
      );
    }

    // Load the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Generate content
    const result = await model.generateContent({
      contents: body.contents,
      tools: [{ codeExecution: {} }],
    });

    const response = await result.response;

    return NextResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: response.text(),
              },
            ],
          },
        },
      ],
    });
  } catch (error: any) {
    console.error("[CODE_GENERATION_ERROR]", error);

    let status = 500;
    let errorMessage = "Failed to generate code";

    if (error.message.includes("model not found")) {
      status = 404;
      errorMessage = "The AI model is currently unavailable";
    } else if (error.message.includes("API key")) {
      status = 401;
      errorMessage = "Invalid API key configuration";
    } else if (error.message.includes("quota")) {
      status = 429;
      errorMessage = "API quota exceeded. Please try again later.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
