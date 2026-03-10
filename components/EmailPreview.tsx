"use client";

import CopyButton from "./CopyButton";

interface EmailPreviewProps {
  subject: string;
  body: string;
  tips: string[];
}

export default function EmailPreview({ subject, body, tips }: EmailPreviewProps) {
  const fullEmailText = `Subject: ${subject}\n\n${body}`;

  return (
    <div className="space-y-6">
      {/* Email Content */}
      <div className="rounded-xl border border-gray-700 bg-[#1f2937] overflow-hidden">
        {/* Subject Line */}
        <div className="px-6 py-4 border-b border-gray-700">
          <p className="text-white">
            <span className="font-bold">Subject:</span> {subject}
          </p>
        </div>

        {/* Email Body */}
        <div className="px-6 py-4 bg-[#111827]">
          <pre className="text-[#9ca3af] font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {body}
          </pre>
        </div>

        {/* Copy Button */}
        <div className="px-6 py-3 border-t border-gray-700 flex justify-end">
          <CopyButton text={fullEmailText} />
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#1f2937] p-6">
          <h3 className="text-white font-bold text-lg mb-3">Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-[#9ca3af] text-sm flex items-start gap-2">
                <span className="text-[#3b82f6] mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reminders */}
      <div className="space-y-2 text-center">
        <p className="text-[#3b82f6] text-sm font-medium">
          Send this to 3-5 dealers for best results
        </p>
        <p className="text-[#9ca3af] text-xs">
          Need to counter or close? Select the next stage above
        </p>
      </div>
    </div>
  );
}
