import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContentType =
  | "summary"
  | "objective"
  | "job-description"
  | "skills-description"
  | "project-description"
  | "cover-letter"
  | "work-experience";

interface GenerateBody {
  type: ContentType;
  prompt: string;
  context?: Record<string, unknown>;
}

const SYSTEM_PROMPTS: Record<ContentType, string> = {
  summary:
    "You write concise, impactful professional resume summaries (2-3 sentences, 40-60 words). Use strong action verbs, no first-person pronouns, ATS-friendly language. Output ONLY the summary text.",
  objective:
    "You write clear, focused career objectives for resumes (1-2 sentences, 25-40 words). Tailor to the target role. No first-person pronouns. Output ONLY the objective text.",
  "job-description":
    "You write professional job/responsibility descriptions for a role on a resume. Use 3-5 bullet points starting with •, action verbs, and quantify impact where possible. Output ONLY the bullet lines separated by newlines.",
  "skills-description":
    "You write a short skills summary paragraph (2-3 sentences) that contextualises the candidate's technical and soft skills for a target role. Output ONLY the paragraph text.",
  "project-description":
    "You write compelling project descriptions for resumes (2-3 sentences). Mention what was built, technologies used, and impact. ATS-friendly. Output ONLY the description text.",
  "cover-letter":
    "You write professional, personalized cover letters (3 short paragraphs). Address the hiring manager, highlight relevant experience, and close with a call to action. Output ONLY the cover letter text with paragraph breaks.",
  "work-experience":
    "You write professional work experience bullet points for a resume role. 3-5 bullets starting with •, action verbs, quantified achievements. Output ONLY the bullet lines separated by newlines.",
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;
    const type = body.type;
    const userPrompt = body.prompt?.trim();

    if (!type || !SYSTEM_PROMPTS[type]) {
      return NextResponse.json({ error: "Unknown content type." }, { status: 400 });
    }
    if (!userPrompt) {
      return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
    }

    const contextStr = body.context
      ? `\n\nCandidate context (use what is relevant, ignore what is missing):\n${JSON.stringify(body.context)}`
      : "";

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPTS[type] },
        {
          role: "user",
          content: `${userPrompt}${contextStr}`,
        },
      ],
      thinking: { type: "disabled" },
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ error: "No content generated." }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
