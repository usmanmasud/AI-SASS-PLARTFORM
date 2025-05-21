 

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     // Validate request
//     const contentType = req.headers.get("content-type");
//     if (!contentType?.includes("application/json")) {
//       return new Response(JSON.stringify({ error: "Invalid content type" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" }
//       });
//     }

//     const body = await req.json();
    
//     // Validate message
//     if (!body?.message || typeof body.message !== "string") {
//       return new Response(JSON.stringify({ error: "Message is required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" }
//       });
//     }

//     // Initialize model - using the latest stable model
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Generate content
//     const result = await model.generateContent(body.message);
//     const response = await result.response;
//     const text = response.text();

//     return new Response(JSON.stringify({ message: text }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" }
//     });

//   } catch (error: any) {
//     console.error("[GEMINI_API_ERROR]", error);
    
//     let status = 500;
//     let errorMessage = "Internal server error";

//     if (error.message.includes("model not found")) {
//       status = 404;
//       errorMessage = "AI model is currently unavailable";
//     } else if (error.message.includes("API key")) {
//       status = 401;
//       errorMessage = "Invalid API key configuration";
//     } else if (error.message.includes("quota")) {
//       status = 429;
//       errorMessage = "Too many requests. Please try again later.";
//     }

//     return new Response(JSON.stringify({ error: errorMessage }), {
//       status,
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini instance with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Route handler
export async function POST(req: Request) {
  try {
    // Content-Type check
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract body
    const body = await req.json();

    // Input validation
    if (!body?.message || typeof body.message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optionally: prepend context (e.g., date/time or custom instructions)
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const contextPrefix = `Today is ${today}.\nYou are a helpful AI assistant answering questions concisely and clearly.\n\n`;
    const prompt = contextPrefix + body.message;

    // Load Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ message: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("[GEMINI_API_ERROR]", error);

    let status = 500;
    let errorMessage = "Internal server error";

    // Specific error messages
    if (error.message?.includes("model not found")) {
      status = 404;
      errorMessage = "AI model is currently unavailable";
    } else if (error.message?.includes("API key")) {
      status = 401;
      errorMessage = "Invalid API key configuration";
    } else if (error.message?.includes("quota")) {
      status = 429;
      errorMessage = "Too many requests. Please try again later.";
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
