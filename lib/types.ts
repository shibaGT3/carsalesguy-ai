export type DealType = "lease" | "finance" | "cash" | "inventory";

export type Stage = "quote" | "counter" | "close" | "inquiry" | "order";

export interface FormData {
  vehicle: string;
  term?: string;
  milesPerYear?: string;
  downPayment?: string;
  zipCode?: string;
  name: string;
  email: string;
  phone?: string;
  timePreference: string;
  // Counter-specific fields
  dealerQuote?: string;
  desiredPayment?: string;
  negotiationMetric?: string;
  desiredNumber?: string;
  dealerOTD?: string;
  desiredSellingPrice?: string;
  desiredOTD?: string;
  // Close-specific fields
  deliveryPreference?: string;
  deliveryTiming?: string;
  // Inventory-specific fields
  purchaseType?: string;
}

export interface GenerateRequest {
  dealType: DealType;
  stage: Stage;
  formData: FormData;
}

export interface GenerateResponse {
  email: {
    subject: string;
    body: string;
  };
  tips: string[];
}
