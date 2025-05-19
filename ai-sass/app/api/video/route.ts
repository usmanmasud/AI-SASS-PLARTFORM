import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Step 1: Try generating a description from prompt using Gemini
async function generateDescription(prompt: string): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(`Describe a video of: ${prompt}`);
        const response = await result.response;
        return await response.text();
      } catch (error: any) {
        if (error.message?.includes("429")) {
          console.warn(`Rate limited. Retrying attempt ${attempt + 1}...`);
          await new Promise((res) => setTimeout(res, 5000));
        } else {
          throw error;
        }
      }
    }

    return null;
  } catch (err) {
    console.error("Description generation failed:", err);
    return null;
  }
}

// Step 2: Match prompt keywords to dummy videos
function selectVideoUrl(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  const videoMap: { [key: string]: string } = {
    nature: "https://www.w3schools.com/html/mov_bbb.mp4",
    space: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    technology: "https://media.w3.org/2010/05/bunny/movie.mp4",
    ocean: "https://media.w3.org/2010/05/video/movie_300.mp4",
    city: "https://www.w3schools.com/html/movie.mp4",
    animals: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    sports: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    education: "https://media.w3.org/2010/05/bunny/movie.mp4"
  };

  // Try to match a keyword in prompt
  for (const keyword in videoMap) {
    if (lowerPrompt.includes(keyword)) {
      return videoMap[keyword];
    }
  }

  // Fallback: return a random dummy video from the list
  const dummyVideos = Object.values(videoMap);
  return dummyVideos[Math.floor(Math.random() * dummyVideos.length)];
}

// Step 3: POST handler
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Only JSON content is accepted" }, { status: 400 });
    }

    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const description = await generateDescription(prompt);
    const videoUrl = selectVideoUrl(prompt);

    return NextResponse.json({
      message: `Video request received for: ${prompt}`,
      videoUrl,
      description: description || "Description not available due to rate limits",
    });

  } catch (error: any) {
    console.error("[VIDEO_GENERATION_ERROR]", error);

    let status = 500;
    let errorMessage = "Failed to generate video";

    if (error.message?.includes("429")) {
      status = 429;
      errorMessage = "Rate limit exceeded. Try again in a few minutes.";
    } else if (error.message?.includes("API key")) {
      status = 401;
      errorMessage = "Invalid or missing API key.";
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
