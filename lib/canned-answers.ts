interface CannedAnswer {
  patterns: RegExp[];
  answer: string;
}

const cannedAnswers: CannedAnswer[] = [
  // ── Convincing spouse / partner ──
  {
    patterns: [
      /convince.*(wife|husband|spouse|partner)/i,
      /(wife|husband|spouse|partner).*(on board|agree|approve|let me|okay with|cool with)/i,
      /(wife|husband|spouse|partner).*(doesn.t want|not sure|against|hesitant|worried)/i,
      /how do i get.*(wife|husband|spouse|partner)/i,
      /(wife|husband|spouse|partner).*(buy|purchase|lease)/i,
      /my (wife|husband|spouse|partner)/i,
    ],
    answer:
      "This comes up on almost every deal — you're not alone. Here's how to handle it like a pro:\n\n1. **Get aligned on budget first, not the car.** If you and your spouse agree on what you can afford monthly or total, the specific vehicle becomes a much easier conversation.\n\n2. **Bring them into the process early.** Don't go pick the car alone and then try to sell them on it. Browse together online, test drive together. When they feel included in the decision, they're far more likely to say yes.\n\n3. **Let the numbers do the talking.** Once you have quotes from 3-5 dealers, show your spouse the real numbers — not a guess, not a hope, the actual market price. That removes the \"what if we're overpaying\" anxiety.\n\n4. **Frame it around their priorities.** Safety features, reliability, total cost of ownership, whatever matters to them — lead with that, not horsepower or the color.\n\n5. **Don't rush it.** A dealer will always have another car. If your spouse needs a week to think it over, take the week. A good deal done right beats a great deal that causes a fight.\n\nBottom line: the best car deals happen when both people are on the same page before you ever talk to a dealer.",
  },

  // ── How many dealers should I send this to? ──
  {
    patterns: [
      /how many dealer/i,
      /how many should i send/i,
      /how many emails/i,
      /who do i send/i,
      /where do i send/i,
      /which dealer/i,
    ],
    answer:
      "Send your quote request to 3-5 dealers in your area. This creates natural competition — you'll get a range of prices and can use the best quote as leverage. Don't overthink which dealers. Cast a wide net, let them compete, and the market will tell you what the car is actually selling for.",
  },

  // ── Should I lease or finance? ──
  {
    patterns: [
      /should i lease or finance/i,
      /lease or finance/i,
      /lease vs\.? finance/i,
      /finance vs\.? lease/i,
      /better to lease/i,
      /better to finance/i,
      /is leasing better/i,
      /is financing better/i,
    ],
    answer:
      "It depends on the vehicle and your situation. Lean toward leasing for new vehicles over $50K with steep depreciation — leasing caps your risk because the bank guarantees the residual value. Lean toward financing if the vehicle holds value well (trucks, certain SUVs), it's under $50K, or you plan to keep it 5+ years. If it's an EV, lease it — EV depreciation can be brutal (50%+), and leasing protects you entirely.",
  },

  // ── Should I pay cash? / Cash better? ──
  {
    patterns: [
      /should i pay cash/i,
      /is cash better/i,
      /cash buyer/i,
      /paying cash/i,
      /pay in cash/i,
      /cash offer/i,
      /cash deal/i,
    ],
    answer:
      "Contrary to popular belief, leading with \"I'm paying cash\" can actually work against you. Dealers make money on financing — a cash buyer removes that profit, which can make them less motivated to discount the car. The smarter play: finance through the dealer (they may give you a better price), then pay off the loan later if you want to own it outright. If you still want to pay cash, that's totally fine — just don't lead with it as a negotiation tactic.",
  },

  // ── When is the best time to buy? ──
  {
    patterns: [
      /best time to buy/i,
      /when should i buy/i,
      /best time to lease/i,
      /when is the best time/i,
      /end of month/i,
      /month end/i,
      /end of year/i,
      /year end/i,
      /best month/i,
    ],
    answer:
      "Month end is reliably the best window — salespeople and managers are pushing to hit their monthly targets. Quarter end (March, June, September, December) adds extra pressure from manufacturer bonuses. Year end (December) is the strongest — month + quarter + year targets all stacking. That said, supply and demand matters more than timing. If the car you want has 90+ days of inventory, you have leverage anytime. If it's in short supply with waitlists, timing won't help much — getting MSRP with no markup is the win.",
  },

  // ── Should I counter or accept? ──
  {
    patterns: [
      /should i counter/i,
      /should i accept/i,
      /is this a good deal/i,
      /is this a fair/i,
      /should i negotiate/i,
      /should i take (this|the) deal/i,
      /good price/i,
      /fair price/i,
    ],
    answer:
      "That depends on what other dealers quoted you. If you sent the email to 3-5 dealers, compare the responses. The quotes create a natural price range — if yours is in the middle or lower end and fits your budget, it's fair. Take it. Counter when the quote is significantly above budget, or when competing quotes prove a better price exists. Don't grind for every last dollar when the deal is already fair — optimize for convenience at that point.",
  },

  // ── What is OTD / out the door price? ──
  {
    patterns: [
      /what is otd/i,
      /what does otd mean/i,
      /out the door/i,
      /out-the-door/i,
      /what.s otd/i,
    ],
    answer:
      "OTD stands for Out-the-Door price. It's the total amount you pay — the vehicle price plus ALL taxes, fees, registration, and any dealer add-ons. This is the only number that matters. If a dealer quotes you a selling price but won't tell you the OTD price, that's a red flag. Always ask for OTD so there are no surprises.",
  },

  // ── Credit pull / credit check ──
  {
    patterns: [
      /credit (pull|check|score|run)/i,
      /run my credit/i,
      /hard pull/i,
      /need.* credit/i,
      /they want to run/i,
    ],
    answer:
      "If a dealer says they need to run your credit just to give you a quote, the answer is no. They can estimate payments based on general rate assumptions without a hard pull. Do not allow a credit inquiry until you've agreed on deal terms and are ready to move forward. A hard pull hits your credit score — don't let them do it as a fishing expedition.",
  },

  // ── What about extended warranties / F&I products? ──
  {
    patterns: [
      /extended warranty/i,
      /paint protection/i,
      /gap insurance/i,
      /finance office/i,
      /f&i/i,
      /dealer add.?on/i,
      /should i get warranty/i,
      /tire and wheel/i,
    ],
    answer:
      "The finance office is where dealers make their real margin. They'll offer extended warranties, paint protection, gap insurance, and other products — most at significant markup. Decline most of these. The one exception: tire and wheel protection is often worth it, especially on cars with large wheels and low-profile tires. Those tires and wheels are expensive to replace.",
  },

  // ── Should I trade in or sell privately? ──
  {
    patterns: [
      /trade.?in/i,
      /sell (my|the) car/i,
      /private (party|sale|sell)/i,
      /sell privately/i,
    ],
    answer:
      "Trade it to a dealer. The extra $2K or so you might get selling privately isn't worth the risk and hassle. Dealerships spend millions on legal protections, systems, and insurance for vehicle transactions. The average person isn't equipped to handle the potential issues. That \"extra money\" you'd get from a private sale is really just the cost of peace of mind.",
  },

  // ── Pay over MSRP / markup ──
  {
    patterns: [
      /over msrp/i,
      /above msrp/i,
      /markup/i,
      /market adjustment/i,
      /dealer markup/i,
      /pay over sticker/i,
    ],
    answer:
      "Do not pay over MSRP. Period. The people who paid $10K-$150K over sticker in 2021-2022 deeply regret it. Markets normalize. Patience wins. If a dealer is charging a markup, walk away and find one that isn't. If the car is in such short supply that every dealer has a markup, wait — the market will come back to you.",
  },

  // ── How long at the dealership? ──
  {
    patterns: [
      /how long.*(dealership|dealer)/i,
      /spend.*(dealership|dealer)/i,
      /at the dealership/i,
      /going to the dealer/i,
      /visit the dealer/i,
    ],
    answer:
      "Don't spend more than 90 minutes at the dealership. If you've done the work by email — agreed on terms, know what you're paying — the visit should be paperwork and delivery only. In and out. Separate browsing from buying: test drive on a different day, negotiate by email, then show up to sign and take delivery.",
  },

  // ── What's a money factor? ──
  {
    patterns: [
      /money factor/i,
      /what.s a money factor/i,
      /mf.*lease/i,
    ],
    answer:
      "The money factor is how interest is expressed on a lease. It's a small decimal number like .00235. To convert it to an APR you can compare to loan rates, multiply by 2,400 — so .00235 x 2,400 = 5.64% APR. Lease interest is usually slightly higher than purchase rates because the bank is taking on residual value risk. You don't need to worry about the money factor in your initial quote request — that's for the counter-offer stage.",
  },

  // ── Insurance ──
  {
    patterns: [
      /insurance/i,
      /how much.* insur/i,
    ],
    answer:
      "Factor insurance into your total cost of ownership before committing. Premiums have more than doubled recently, and some vehicles (especially luxury and performance cars) cost significantly more to insure. Get insurance quotes before you finalize the deal so the monthly payment doesn't surprise you.",
  },
];

/**
 * Check if user input matches a canned answer.
 * Returns the answer string if matched, null otherwise.
 */
export function getCannedAnswer(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.length < 5) return null; // Too short to match meaningfully

  for (const entry of cannedAnswers) {
    for (const pattern of entry.patterns) {
      if (pattern.test(trimmed)) {
        return entry.answer;
      }
    }
  }

  return null;
}
