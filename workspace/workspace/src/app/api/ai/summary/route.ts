import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SummaryBody {
  name?: string;
  jobTitle?: string;
  skills?: string[];
  experience?: { company?: string; position?: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SummaryBody;
    const title = body.jobTitle?.trim() || "Professional";
    const skills = (body.skills || []).slice(0, 6).join(", ") || "modern technologies";
    const expCount = body.experience?.filter((e) => e.company).length ?? 0;
    const yearsHint = expCount > 0 ? `with ${expCount} role(s) of experience` : "eager to grow";

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "You are an expert resume writer and career coach. You write concise, impactful professional summaries (2-3 sentences, about 40-60 words) for resumes. Use strong action verbs, avoid first-person pronouns, and tailor the tone to the target role. Output ONLY the summary text — no headings, no quotes, no markdown.",
        },
        {
          role: "user",
          content: `Write a professional resume summary for a ${title} ${yearsHint}. Key skills: ${skills}. Name: ${body.name || "the candidate"}. Make it compelling, ATS-friendly, and results-focused.`,
        },
      ],
      thinking: { type: "disabled" },
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
      return NextResponse.json({ error: "No summary generated" }, { status: 502 });
    }
    return NextResponse.json({ summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
