import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, remaining } = checkRateLimit(ip, "refine", 30);
    if (!allowed) {
      return NextResponse.json(
        { error: "You've hit the limit — try again in an hour. (30 requests/hour)" },
        { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
      );
    }

    const { currentEmail, userRequest, conversationHistory } = await request.json();

    const client = new Anthropic();

    // Build messages array with conversation context
    const messages: { role: "user" | "assistant"; content: string }[] = [];

    // First message: the original email generation context
    messages.push({
      role: "user",
      content: `Here is the negotiation email I generated:\n\nSubject: ${currentEmail.subject}\n\n${currentEmail.body}`,
    });

    messages.push({
      role: "assistant",
      content: `I've generated that email for you. Let me know if you'd like any changes.`,
    });

    // Add any prior refinement conversation
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add the current user request
    messages.push({
      role: "user",
      content: userRequest,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `${SYSTEM_PROMPT}

ADDITIONAL CONTEXT: You previously generated a negotiation email for this user. They are now asking you to refine or adjust it, or they have a question about the email or their deal.

If they ask you to modify the email, output the FULL updated email in this format:
Subject: [subject line]

[full email body]

If they ask a question or want advice (not a modification), just respond conversationally — no special format needed. Be direct and helpful.`,
      messages,
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Check if the response contains a new email (has "Subject: " line)
    const hasNewEmail = responseText.includes("Subject: ");

    if (hasNewEmail) {
      const lines = responseText.split("\n");
      let subject = "";
      let bodyStartIndex = 0;
      let preText = "";

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("Subject: ")) {
          subject = lines[i].replace("Subject: ", "").trim();
          bodyStartIndex = i + 1;
          // Capture any conversational text before the email
          preText = lines.slice(0, i).join("\n").trim();
          break;
        }
      }

      while (bodyStartIndex < lines.length && lines[bodyStartIndex].trim() === "") {
        bodyStartIndex++;
      }

      const body = lines.slice(bodyStartIndex).join("\n").trim();

      return NextResponse.json({
        type: "email",
        message: preText || null,
        email: { subject, body },
      });
    }

    // It's a conversational response (advice, answer, etc.)
    return NextResponse.json({
      type: "text",
      message: responseText,
    });
  } catch (err) {
    console.error("Error refining email:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to refine email";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
