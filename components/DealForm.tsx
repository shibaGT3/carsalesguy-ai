"use client";

import React, { useState } from "react";

interface DealFormProps {
  dealType: string;
  stage: string;
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea";
  required: boolean;
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean;
}

export default function DealForm({
  dealType,
  stage,
  onSubmit,
  isLoading,
}: DealFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function getFields(): FieldConfig[] {
    const dt = dealType.toLowerCase();
    const st = stage.toLowerCase();

    // ---------- LEASE ----------
    if (dt === "lease") {
      const quoteFields: FieldConfig[] = [
        {
          name: "vehicle",
          label: "Vehicle",
          type: "text",
          required: true,
          placeholder: "Stock #, VIN, or Year Make Model Trim",
        },
        {
          name: "term",
          label: "Term",
          type: "select",
          required: true,
          options: ["24 months", "27 months", "30 months", "33 months", "36 months", "39 months", "42 months", "48 months"],
          halfWidth: true,
        },
        {
          name: "milesPerYear",
          label: "Miles Per Year",
          type: "select",
          required: true,
          options: ["7,500", "10,000", "12,000", "15,000"],
          halfWidth: true,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "text",
          required: true,
          placeholder: "$0, $1,000, $2,000, etc.",
          halfWidth: true,
        },
        {
          name: "zipCode",
          label: "Zip Code",
          type: "text",
          required: true,
          placeholder: "90210",
          halfWidth: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "First Last",
          halfWidth: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "you@email.com",
          halfWidth: true,
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
          required: false,
          placeholder: "Optional",
          halfWidth: true,
        },
        {
          name: "timePreference",
          label: "Time Preference",
          type: "select",
          required: true,
          options: ["Today", "ASAP", "This week", "Soon"],
          halfWidth: true,
        },
      ];

      if (st === "quote") {
        return quoteFields;
      }

      if (st === "counter") {
        return [
          ...quoteFields,
          {
            name: "dealerQuote",
            label: "Dealer Quote",
            type: "text",
            required: true,
            placeholder: "What did they quote you? e.g. $650/mo",
          },
          {
            name: "desiredPayment",
            label: "Desired Payment",
            type: "text",
            required: true,
            placeholder: "What payment works for you? e.g. $550/mo including tax",
          },
        ];
      }

      if (st === "close") {
        return [
          { name: "name", label: "Name", type: "text", required: true, halfWidth: true },
          { name: "email", label: "Email", type: "email", required: true, halfWidth: true },
          {
            name: "phone",
            label: "Phone",
            type: "text",
            required: true,
            placeholder: "Required for close stage",
            halfWidth: true,
          },
          {
            name: "deliveryPreference",
            label: "Delivery Preference",
            type: "select",
            required: true,
            options: ["Pick up at dealership", "Home delivery"],
            halfWidth: true,
          },
          {
            name: "deliveryTiming",
            label: "Delivery Timing",
            type: "select",
            required: true,
            options: ["Today", "Tomorrow", "This week"],
            halfWidth: true,
          },
        ];
      }
    }

    // ---------- FINANCE ----------
    if (dt === "finance") {
      const quoteFields: FieldConfig[] = [
        {
          name: "vehicle",
          label: "Vehicle",
          type: "text",
          required: true,
          placeholder: "Stock #, VIN, or Year Make Model Trim",
        },
        {
          name: "term",
          label: "Term",
          type: "select",
          required: true,
          options: ["36 months", "48 months", "60 months", "72 months", "84 months"],
          halfWidth: true,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "text",
          required: true,
          placeholder: "$0, $2,000, $5,000, etc.",
          halfWidth: true,
        },
        {
          name: "zipCode",
          label: "Zip Code",
          type: "text",
          required: true,
          placeholder: "90210",
          halfWidth: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "First Last",
          halfWidth: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "you@email.com",
          halfWidth: true,
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
          required: false,
          placeholder: "Optional",
          halfWidth: true,
        },
        {
          name: "timePreference",
          label: "Time Preference",
          type: "select",
          required: true,
          options: ["Today", "ASAP", "This week", "Soon"],
          halfWidth: true,
        },
      ];

      if (st === "quote") {
        return quoteFields;
      }

      if (st === "counter") {
        return [
          ...quoteFields,
          {
            name: "dealerQuote",
            label: "Dealer Quote",
            type: "textarea",
            required: true,
            placeholder: "Paste or summarize what the dealer quoted you",
          },
          {
            name: "negotiationMetric",
            label: "Negotiation Metric",
            type: "select",
            required: true,
            options: ["Selling Price", "Monthly Payment", "OTD Price", "APR"],
            halfWidth: true,
          },
          {
            name: "desiredNumber",
            label: "Desired Number",
            type: "text",
            required: true,
            placeholder: "Enter your target for the selected metric",
            halfWidth: true,
          },
        ];
      }

      if (st === "close") {
        return [
          { name: "name", label: "Name", type: "text", required: true, halfWidth: true },
          { name: "email", label: "Email", type: "email", required: true, halfWidth: true },
          {
            name: "phone",
            label: "Phone",
            type: "text",
            required: true,
            placeholder: "Required for close stage",
            halfWidth: true,
          },
          {
            name: "deliveryPreference",
            label: "Delivery Preference",
            type: "select",
            required: true,
            options: ["Pick up at dealership", "Home delivery"],
            halfWidth: true,
          },
          {
            name: "deliveryTiming",
            label: "Delivery Timing",
            type: "select",
            required: true,
            options: ["Today", "Tomorrow", "This week"],
            halfWidth: true,
          },
        ];
      }
    }

    // ---------- CASH ----------
    if (dt === "cash") {
      const quoteFields: FieldConfig[] = [
        {
          name: "vehicle",
          label: "Vehicle",
          type: "text",
          required: true,
          placeholder: "Stock #, VIN, or Year Make Model Trim",
        },
        {
          name: "zipCode",
          label: "Zip Code",
          type: "text",
          required: true,
          placeholder: "90210",
          halfWidth: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "First Last",
          halfWidth: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "you@email.com",
          halfWidth: true,
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
          required: false,
          placeholder: "Optional",
          halfWidth: true,
        },
        {
          name: "timePreference",
          label: "Time Preference",
          type: "select",
          required: true,
          options: ["Today", "ASAP", "This week", "Soon"],
          halfWidth: true,
        },
      ];

      if (st === "quote") {
        return quoteFields;
      }

      if (st === "counter") {
        return [
          ...quoteFields,
          {
            name: "dealerOTD",
            label: "Dealer OTD Quote",
            type: "text",
            required: true,
            placeholder: "What OTD price did they quote?",
          },
          {
            name: "desiredSellingPrice",
            label: "Desired Selling Price",
            type: "text",
            required: false,
            placeholder: "Target selling price",
            halfWidth: true,
          },
          {
            name: "desiredOTD",
            label: "Desired OTD Price",
            type: "text",
            required: false,
            placeholder: "Target out-the-door price",
            halfWidth: true,
          },
        ];
      }

      if (st === "close") {
        return [
          { name: "name", label: "Name", type: "text", required: true, halfWidth: true },
          { name: "email", label: "Email", type: "email", required: true, halfWidth: true },
          {
            name: "phone",
            label: "Phone",
            type: "text",
            required: true,
            placeholder: "Required for close stage",
            halfWidth: true,
          },
          {
            name: "deliveryPreference",
            label: "Delivery Preference",
            type: "select",
            required: true,
            options: ["Pick up at dealership", "Home delivery"],
            halfWidth: true,
          },
          {
            name: "deliveryTiming",
            label: "Delivery Timing",
            type: "select",
            required: true,
            options: ["Today", "Tomorrow", "This week"],
            halfWidth: true,
          },
        ];
      }
    }

    // ---------- INVENTORY ----------
    if (dt === "inventory") {
      const inquiryFields: FieldConfig[] = [
        {
          name: "vehicle",
          label: "Vehicle",
          type: "text",
          required: true,
          placeholder: "Year Make Model (e.g. 2026 Toyota Camry)",
        },
        {
          name: "purchaseType",
          label: "Purchase Type",
          type: "select",
          required: true,
          options: ["Lease", "Finance", "Cash"],
          halfWidth: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "First Last",
          halfWidth: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "you@email.com",
          halfWidth: true,
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
          required: true,
          placeholder: "Required",
          halfWidth: true,
        },
        {
          name: "timePreference",
          label: "Time Preference",
          type: "select",
          required: true,
          options: ["Today", "ASAP", "This week", "Soon"],
          halfWidth: true,
        },
      ];

      if (st === "inquiry" || st === "order") {
        return inquiryFields;
      }
    }

    return [];
  }

  const fields = getFields();

  function handleChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = true;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  }

  function renderField(field: FieldConfig) {
    const hasError = errors[field.name];
    const baseInputClasses =
      "w-full rounded-lg bg-[#111827] text-white placeholder-gray-500 px-4 py-3 outline-none border transition-colors " +
      (hasError
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "border-gray-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]");

    return (
      <div
        key={field.name}
        className={field.halfWidth ? "" : "col-span-1 sm:col-span-2"}
      >
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>

        {field.type === "select" ? (
          <select
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={baseInputClasses + " appearance-none cursor-pointer"}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={baseInputClasses + " resize-none"}
          />
        ) : (
          <input
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        )}

        {hasError && (
          <p className="text-red-400 text-xs mt-1">
            {field.label} is required
          </p>
        )}
      </div>
    );
  }

  if (fields.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1f2937] rounded-2xl p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {fields.map(renderField)}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={
          "mt-6 w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-base font-semibold text-white transition-colors " +
          (isLoading
            ? "bg-[#3b82f6]/60 cursor-not-allowed"
            : "bg-[#3b82f6] hover:bg-[#2563eb] active:bg-[#1d4ed8]")
        }
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {isLoading ? "Generating..." : "Generate My Email"}
      </button>
    </form>
  );
}
