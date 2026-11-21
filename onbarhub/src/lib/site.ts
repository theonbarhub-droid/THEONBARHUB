export const site = {
  name: "The OnBar Hub",
  shortName: "OnBar Hub",
  url: "https://theonbarhub.com",
  tagline: "Ontario bar exam prep, built on what candidates actually face.",
  description:
    "Free tools, plain-English guides and smart practice for the Law Society of Ontario Barrister and Solicitor licensing exams.",
  author: {
    name: "Kartik",
    role: "Founder, The OnBar Hub and The NCA Hub",
    bio: "Internationally trained lawyer based in Brampton, Ontario. Completed the full NCA journey, passed the LSO Barrister exam, and founded The NCA Hub.",
  },
  // Set NEXT_PUBLIC_WAITLIST_ENDPOINT (for example a Formspree form URL) to switch the waitlist on.
  waitlistEndpoint: process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT ?? "",
  disclaimer:
    "The OnBar Hub is an independent study resource. It is not affiliated with, endorsed by, or connected to the Law Society of Ontario. Always confirm dates and rules on lso.ca.",
};
