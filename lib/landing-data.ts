export const navLinks = [
  { label: "Industries", href: "/industries" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Features", href: "/#features" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Price estimator", href: "/price-estimator" },
] as const;

export const trustLogos = [
  "BlueStone Realty",
  "UrbanBite",
  "NorthCare",
  "PawWell",
  "ScaleGrid",
] as const;

export const steps = [
  {
    title: "Pick a ready-made agent",
    description:
      "Choose a prebuilt agent for booking, support, follow-ups, or lead qualification based on your business needs.",
  },
  {
    title: "Connect your number",
    description:
      "Connect your existing business number so the AI agent can answer real customer calls right away.",
  },
  {
    title: "Start taking calls",
    description:
      "Go live in minutes and let your ready-made agent handle calls 24/7 from day one.",
  },
] as const;

export const useCases = [
  {
    name: "Real Estate",
    outcome: "Qualify leads instantly and auto-book property tours.",
    metric: "+43% tour bookings",
  },
  {
    name: "Restaurants",
    outcome: "Answer peak-hour calls and fill more tables automatically.",
    metric: "+31% reservation conversions",
  },
  {
    name: "Hospitals",
    outcome: "Handle patient scheduling and reminder calls with empathy.",
    metric: "-92% missed appointments",
  },
  {
    name: "Pet Clinics",
    outcome: "Book visits, triage requests, and reduce front-desk overload.",
    metric: "2.4x faster response time",
  },
] as const;

export const features = [
  {
    title: "Pre-built voice agents",
    detail: "Industry-specific templates ready to launch.",
  },
  {
    title: "Zero model training",
    detail: "Configure intent, rules, and handoff in one dashboard.",
  },
  {
    title: "Instant deployment",
    detail: "Connect number providers and publish in minutes.",
  },
  {
    title: "Human-like voice",
    detail: "Natural pacing, emotion-aware turns, and clear pronunciation.",
  },
  {
    title: "24/7 availability",
    detail: "Never miss a lead, booking, or critical callback.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "We replaced overflow voicemail with CCAI and doubled booked consultations in under three weeks.",
    name: "Maya Chen",
    role: "Operations Director, BlueStone Realty",
    image: "/customers/maya-chen.svg",
  },
  {
    quote:
      "Our team stopped juggling missed calls. The agent books, confirms, and escalates complex requests perfectly.",
    name: "Arjun Patel",
    role: "Owner, UrbanBite Group",
    image: "/customers/arjun-patel.svg",
  },
  {
    quote:
      "Patients love the response speed and tone. It feels truly conversational, not robotic.",
    name: "Dr. Sofia Lane",
    role: "Chief Admin, NorthCare Clinics",
    image: "/customers/sofia-lane.svg",
  },
] as const;

export const faqs = [
  {
    question: "How quickly can we go live with an AI receptionist?",
    answer:
      "Our USP is simple: we provide pre-built agents that are ready to launch fast, and if you need something specific, we can create custom agents on request for your exact workflow.",
  },
  {
    question: "Do you offer custom agents if pre-built ones do not fit?",
    answer:
      "Yes. If your use case is unique, our team can build a custom AI agent tailored to your industry, call flow, and escalation rules.",
  },
  {
    question: "Do we need a technical team to set everything up?",
    answer:
      "No technical team is required on your side. We handle the full setup, integrations, call logic, and deployment so you can focus on operations.",
  },
  {
    question: "What technical work do you handle for us?",
    answer:
      "We handle all technicalities end-to-end, including agent configuration, number setup, workflow integration, testing, and launch support.",
  },
] as const;
