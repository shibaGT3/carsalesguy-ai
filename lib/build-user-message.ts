import { DealType, Stage, FormData } from "./types";

export function buildUserMessage(
  dealType: DealType,
  stage: Stage,
  formData: FormData
): string {
  const dealTypeLabel: Record<DealType, string> = {
    lease: "LEASE",
    finance: "FINANCE",
    cash: "CASH PURCHASE",
    inventory: "INVENTORY",
  };

  const stageLabel: Record<Stage, string> = {
    quote: "Quote Request",
    counter: "Counter Offer",
    close: "Close",
    inquiry: "Inquiry",
    order: "Factory Order",
  };

  let message = `Generate a ${stageLabel[stage]} email for a ${dealTypeLabel[dealType]} deal with these details:\n`;

  // Common fields
  if (formData.vehicle) message += `- Vehicle: ${formData.vehicle}\n`;

  // Deal-type specific fields
  if (dealType === "lease") {
    if (formData.term) message += `- Lease Term: ${formData.term} months\n`;
    if (formData.milesPerYear)
      message += `- Miles per year: ${formData.milesPerYear}\n`;
    if (formData.downPayment)
      message += `- Down payment / drive-off: ${formData.downPayment}\n`;
  }

  if (dealType === "finance") {
    if (formData.term) message += `- Loan Term: ${formData.term} months\n`;
    if (formData.downPayment)
      message += `- Down payment: ${formData.downPayment}\n`;
  }

  if (formData.zipCode) message += `- Zip code: ${formData.zipCode}\n`;

  // Contact info
  message += `- Name: ${formData.name}\n`;
  message += `- Email: ${formData.email}\n`;
  message += `- Phone: ${formData.phone || "(not provided)"}\n`;

  if (formData.timePreference)
    message += `- Time preference: ${formData.timePreference}\n`;

  // Inventory-specific
  if (dealType === "inventory" && formData.purchaseType) {
    message += `- Purchase type: ${formData.purchaseType}\n`;
  }

  // Counter-specific fields
  if (stage === "counter") {
    if (dealType === "lease") {
      if (formData.dealerQuote)
        message += `- Dealer's quoted payment: ${formData.dealerQuote}\n`;
      if (formData.desiredPayment)
        message += `- Desired payment: ${formData.desiredPayment}\n`;
    }
    if (dealType === "finance") {
      if (formData.dealerQuote)
        message += `- Dealer's quote summary: ${formData.dealerQuote}\n`;
      if (formData.negotiationMetric)
        message += `- Negotiating on: ${formData.negotiationMetric}\n`;
      if (formData.desiredNumber)
        message += `- Desired number: ${formData.desiredNumber}\n`;
    }
    if (dealType === "cash") {
      if (formData.dealerOTD)
        message += `- Dealer's quoted OTD price: ${formData.dealerOTD}\n`;
      if (formData.desiredSellingPrice)
        message += `- Desired selling price: ${formData.desiredSellingPrice}\n`;
      if (formData.desiredOTD)
        message += `- Desired OTD price: ${formData.desiredOTD}\n`;
    }
  }

  // Close-specific fields
  if (stage === "close") {
    if (formData.deliveryPreference)
      message += `- Delivery preference: ${formData.deliveryPreference}\n`;
    if (formData.deliveryTiming)
      message += `- Delivery timing: ${formData.deliveryTiming}\n`;
  }

  message += `\nGenerate the email and 2-3 short, actionable tips specific to this deal situation (vehicle type, deal type, stage, and details provided). No generic advice — make each tip relevant to THIS deal.

Format your response EXACTLY like this:
Subject: [subject line here]

[email body here]

---TIPS---
- [tip 1]
- [tip 2]
- [tip 3]`;

  return message;
}
