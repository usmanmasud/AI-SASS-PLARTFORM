import * as z from "zod";

// Define the Zod schema for form validation
export const formSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required" }) // Validate that prompt is not empty
});
