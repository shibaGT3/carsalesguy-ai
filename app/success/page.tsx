import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-gray-400">
          Your negotiation email has been generated.
        </p>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-sm text-gray-500">
            This page is not yet active. Payment integration is coming soon.
          </p>
        </div>

        <Link
          href="/generate"
          className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Back to Email Generator
        </Link>
      </div>
    </div>
  );
}
