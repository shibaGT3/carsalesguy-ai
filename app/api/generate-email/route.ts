import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { buildUserMessage } from "@/lib/build-user-message";

export async function POST(request: NextRequest) {
  try {
    const { dealType, stage, formData } = await request.json();

    const userMessage = buildUserMessage(dealType, stage, formData);

    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Split response into email and tips sections
    const [emailSection, tipsSection] = responseText.split("---TIPS---");

    // Parse subject and body from email section
    const lines = (emailSection || "").split("\n");
    let subject = "";
    let bodyStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("Subject: ")) {
        subject = lines[i].replace("Subject: ", "").trim();
        bodyStartIndex = i + 1;
        break;
      }
    }

    // Skip any blank lines between subject and body
    while (bodyStartIndex < lines.length && lines[bodyStartIndex].trim() === "") {
      bodyStartIndex++;
    }

    const body = lines.slice(bodyStartIndex).join("\n").trim();

    // Parse tips from tips section
    const tips = tipsSection
      ? tipsSection
          .split("\n")
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((line) => line.length > 0)
      : ["Send this to 3-5 dealers for the best results"];

    return NextResponse.json({
      email: { subject, body },
      tips,
    });
  } catch (err) {
    console.error("Error generating email:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate email";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
