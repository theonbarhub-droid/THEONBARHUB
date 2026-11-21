import type { Mock } from "@/lib/exam";

// A free starter mock written by The OnBar Hub to demonstrate the engine.
// These test well-settled fundamentals and exam approach, not fiddly statutory
// detail. They are placeholders: our full vetted mocks replace and expand this.
export const solicitorStarter: Mock = {
  id: "solicitor-starter",
  title: "Solicitor Starter Mock",
  exam: "solicitor",
  description:
    "Ten warm-up questions across the solicitor subjects. Free sample to show how the engine works.",
  timeLimitMinutes: 20,
  isSample: true,
  questions: [
    {
      id: "sol-pr-001",
      subject: "Professional Responsibility",
      stem: "A lawyer acting for a buyer on a purchase is asked by the seller, who is unrepresented, to 'also just handle my side since it is the same deal.' What is the most appropriate response under the Rules of Professional Conduct?",
      options: [
        "Agree, because acting for both saves everyone money",
        "Decline joint retainer where the parties' interests conflict, and recommend the seller obtain independent legal advice",
        "Act for both but keep each party's information secret from the other",
        "Act for the seller only and drop the buyer",
      ],
      answer: 1,
      explanation:
        "Buyer and seller on a purchase have directly conflicting interests. A joint retainer is not appropriate where there is a conflict the lawyer cannot properly manage, and the unrepresented party should be told to get independent legal advice.",
      reference: "Professional Responsibility — conflicts and joint retainers",
    },
    {
      id: "sol-re-001",
      subject: "Real Estate",
      stem: "On a residential purchase, what is the primary purpose of the statement of adjustments prepared for closing?",
      options: [
        "To record the purchaser's mortgage interest rate",
        "To allocate prepaid or arrears items (such as realty taxes) between seller and buyer as of the closing date, producing the balance due on closing",
        "To register the transfer on title",
        "To confirm the buyer's identity for the land registry",
      ],
      answer: 1,
      explanation:
        "The statement of adjustments apportions items like realty taxes, utilities and similar costs between the parties as of closing, and arrives at the balance the buyer must pay to complete.",
      reference: "Real Estate — closing and adjustments",
    },
    {
      id: "sol-re-002",
      subject: "Real Estate",
      stem: "A title search reveals an old mortgage that was paid off years ago but never discharged on title. What is the usual way to deal with this before closing?",
      options: [
        "Ignore it, because an old mortgage cannot affect the buyer",
        "Submit a requisition requiring the seller to obtain and register a discharge so the buyer takes clear title",
        "Register a new mortgage over top of it",
        "Ask the buyer to assume the old mortgage",
      ],
      answer: 1,
      explanation:
        "A defect or cloud on title that the seller must clear is raised by way of a requisition. Here the seller is required to obtain and register a discharge of the paid-off mortgage so the buyer receives clear title.",
      reference: "Real Estate — searching title and requisitions",
    },
    {
      id: "sol-bl-001",
      subject: "Business Law",
      stem: "A client wants to start a small business and is most concerned about limiting personal exposure to business debts. Which structure best addresses that single concern?",
      options: [
        "Sole proprietorship",
        "General partnership",
        "Corporation, which is a separate legal entity giving shareholders limited liability",
        "Joint venture by handshake",
      ],
      answer: 2,
      explanation:
        "A corporation is a separate legal person. Shareholders generally are not personally liable for the corporation's debts beyond their investment, which directly addresses the client's concern about personal exposure.",
      reference: "Business Law — choice of business vehicle",
    },
    {
      id: "sol-bl-002",
      subject: "Business Law",
      stem: "Which of the following is a core duty a director owes to the corporation?",
      options: [
        "A duty to maximise the share price every quarter",
        "A fiduciary duty to act honestly and in good faith with a view to the best interests of the corporation",
        "A duty to personally guarantee all corporate loans",
        "A duty to vote the way the largest shareholder instructs",
      ],
      answer: 1,
      explanation:
        "Directors owe a fiduciary duty to act honestly and in good faith with a view to the best interests of the corporation, and a duty of care. It is owed to the corporation, not to any one shareholder.",
      reference: "Business Law — directors' duties",
    },
    {
      id: "sol-ep-001",
      subject: "Estate Planning",
      stem: "What are the basic formal requirements for a valid formal (non-holograph) will in Ontario?",
      options: [
        "Signed by the testator only, no witnesses",
        "In writing, signed by the testator at the end, in the presence of two witnesses who also sign, the testator being of age and capacity",
        "Typed and notarised by a lawyer",
        "Spoken aloud before three witnesses",
      ],
      answer: 1,
      explanation:
        "A formal will must be in writing and signed by the testator (or by someone in the testator's presence and direction) at its end, made in the presence of two witnesses present at the same time, who then sign in the testator's presence. The testator must have capacity.",
      reference: "Estate Planning — execution of wills",
    },
    {
      id: "sol-ep-002",
      subject: "Estate Planning",
      stem: "A testator leaves a gift in a will to a person who also acts as one of the two witnesses to the will. What is the typical consequence?",
      options: [
        "The entire will is void",
        "The gift to the witness is presumptively void, but the will itself remains valid",
        "The witness must pay the estate",
        "Nothing, witnesses may always take gifts freely",
      ],
      answer: 1,
      explanation:
        "A gift to a witness (or the witness's spouse) is presumptively void to avoid undue influence concerns, but this does not invalidate the rest of the will. A court may relieve against the presumption in limited circumstances.",
      reference: "Estate Planning — witnesses and beneficiaries",
    },
    {
      id: "sol-ea-001",
      subject: "Estate Administration",
      stem: "What is the practical function of a Certificate of Appointment of Estate Trustee (commonly called probate)?",
      options: [
        "It transfers ownership of all estate property to the government",
        "It is a court confirmation of the estate trustee's authority, often required by third parties such as banks and the land registry before they will deal with the trustee",
        "It cancels the deceased's debts",
        "It is only needed when there is no will",
      ],
      answer: 1,
      explanation:
        "The certificate is the court's confirmation of the estate trustee's authority to administer the estate. Third parties like financial institutions and the land registry commonly require it before transferring assets, whether or not there is a will.",
      reference: "Estate Administration — certificate of appointment",
    },
    {
      id: "sol-tax-001",
      subject: "Taxation",
      stem: "A client sells the home they have lived in for the whole period of ownership. Which concept is most relevant to whether tax is owed on the gain?",
      options: [
        "The principal residence exemption, which can shelter the gain on a qualifying principal residence",
        "The small business deduction",
        "Harmonised sales tax on the sale price",
        "Land transfer tax paid by the seller",
      ],
      answer: 0,
      explanation:
        "Gains on a qualifying principal residence can be sheltered by the principal residence exemption for the years it is designated as such. The exact calculation depends on the facts, but the exemption is the key concept here.",
      reference: "Taxation — principal residence exemption",
    },
    {
      id: "sol-re-003",
      subject: "Real Estate",
      stem: "In a typical residential transaction, when does the purchaser's lawyer usually register the transfer and advance mortgage funds?",
      options: [
        "The day the agreement of purchase and sale is signed",
        "On the closing date, after final searches and once funds and documents are in order",
        "Thirty days after the buyer moves in",
        "Only after the first mortgage payment is made",
      ],
      answer: 1,
      explanation:
        "Registration of the transfer and release of funds happen on closing, once the lawyer has completed final (sub)searches, satisfied closing conditions, and has the funds and executed documents ready to complete.",
      reference: "Real Estate — closing mechanics",
    },
  ],
};
