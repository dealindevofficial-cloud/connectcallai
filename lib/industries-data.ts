export type Industry = {
  slug: string;
  name: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  valueProps: readonly string[];
  seoKeywords: readonly string[];
  heroSubtext: string;
  problems: readonly string[];
  solutions: readonly string[];
  useCases: readonly {
    title: string;
    description: string;
    icon: string;
  }[];
  benefits: readonly string[];
  ctaHeadline: string;
  demoPlaceholderName: string;
  demoPlaceholderPhone: string;
};

export const industries = [
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: "🏙️",
    shortDescription:
      "Qualify property leads, answer listing questions, and schedule tours around the clock.",
    longDescription:
      "CCAI for real estate handles inbound listing inquiries and outbound lead follow-ups while syncing outcomes to your sales workflow.",
    valueProps: [
      "Capture and qualify every inbound call",
      "Auto-book showing appointments",
      "Recover leads with smart follow-up calls",
    ],
    seoKeywords: [
      "AI calling for real estate",
      "AI phone agent for real estate",
      "real estate AI lead qualification",
    ],
    heroSubtext:
      "Automate listing inquiries, tour scheduling, and lead follow-ups with ready-to-use AI calling agents for real estate teams.",
    problems: [
      "Missed listing calls mean lost buyer and seller opportunities.",
      "Agents lose hours answering repetitive property questions.",
      "Slow callback times reduce showing conversion rates.",
    ],
    solutions: [
      "Answer inbound property inquiries instantly with a natural AI voice.",
      "Stay available 24/7 for buyers browsing after business hours.",
      "Automate tour bookings, confirmations, and lead follow-up calls.",
    ],
    useCases: [
      {
        title: "Lead qualification calls",
        description: "Identify serious buyers and collect budget, location, and timeline before handoff.",
        icon: "📋",
      },
      {
        title: "Property inquiry handling",
        description: "Answer listing details, amenities, and availability in real time.",
        icon: "🏠",
      },
      {
        title: "Showing appointment scheduling",
        description: "Book property tours instantly and sync confirmed times to your workflow.",
        icon: "📅",
      },
      {
        title: "Post-showing follow-ups",
        description: "Call prospects automatically to capture feedback and next-step intent.",
        icon: "📞",
      },
      {
        title: "Seller lead intake",
        description: "Capture valuation requests and route high-intent sellers to agents faster.",
        icon: "📈",
      },
    ],
    benefits: [
      "No agent training or scripting needed to go live.",
      "Plug-and-play setup with your current business number.",
      "Human-like conversations that feel professional and natural.",
      "Scales instantly during campaign spikes or new launches.",
    ],
    ctaHeadline: "Start Automating Calls in Real Estate Today",
    demoPlaceholderName: "e.g., Sarah from BlueStone Realty",
    demoPlaceholderPhone: "e.g., +1 (555) 123-4567",
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    icon: "🍽️",
    shortDescription:
      "Handle reservations, takeout requests, and peak-hour call overflow with a natural voice agent.",
    longDescription:
      "CCAI for restaurants keeps your lines available during rush hours and converts more callers into confirmed bookings.",
    valueProps: [
      "Automate reservation and waitlist calls",
      "Reduce missed calls during busy shifts",
      "Confirm and remind guests automatically",
    ],
    seoKeywords: [
      "AI calling for restaurants",
      "AI phone agent for restaurants",
      "restaurant reservation AI assistant",
    ],
    heroSubtext:
      "Automate reservations, takeout calls, and guest follow-ups with ready-to-use AI calling agents for restaurant teams.",
    problems: [
      "Peak-hour missed calls translate directly to empty tables.",
      "Front-desk teams get overloaded during lunch and dinner rushes.",
      "Slow responses hurt guest experience and repeat bookings.",
    ],
    solutions: [
      "Handle reservation and takeout calls instantly, even during rush hours.",
      "Stay available 24/7 for late-night bookings and inquiries.",
      "Automate confirmations, waitlist updates, and follow-up calls.",
    ],
    useCases: [
      {
        title: "Reservation booking calls",
        description: "Book tables on the first call and reduce booking friction.",
        icon: "🍽️",
      },
      {
        title: "Takeout and delivery inquiries",
        description: "Answer menu and order status questions without tying up staff.",
        icon: "🥡",
      },
      {
        title: "Waitlist management updates",
        description: "Call guests automatically when tables open up.",
        icon: "⏳",
      },
      {
        title: "No-show prevention reminders",
        description: "Send confirmation and reminder calls before service windows.",
        icon: "🔔",
      },
      {
        title: "Event and group booking intake",
        description: "Capture large-party requirements and route details to managers.",
        icon: "🎉",
      },
    ],
    benefits: [
      "No complex setup or training for busy restaurant teams.",
      "Plug-and-play rollout across one or multiple locations.",
      "Natural voice experience that reflects your hospitality brand.",
      "Scales instantly for weekends, holidays, and promotions.",
    ],
    ctaHeadline: "Start Automating Calls in Restaurants Today",
    demoPlaceholderName: "e.g., Lina from UrbanBite",
    demoPlaceholderPhone: "e.g., +1 (555) 987-6543",
  },
  {
    slug: "hospitals",
    name: "Hospitals",
    icon: "🏥",
    shortDescription:
      "Support patient scheduling, reminders, and routine inquiries with empathy-first call flows.",
    longDescription:
      "CCAI for hospitals helps care teams stay focused by automating repetitive call tasks while preserving a calm, clear patient experience.",
    valueProps: [
      "Automate appointment scheduling calls",
      "Send reminder and follow-up calls at scale",
      "Escalate urgent intents to human staff",
    ],
    seoKeywords: [
      "AI calling for hospitals",
      "AI phone agent for hospitals",
      "hospital patient scheduling AI",
    ],
    heroSubtext:
      "Automate patient scheduling, reminders, and routine inquiries with ready-to-use AI calling agents for hospital teams.",
    problems: [
      "High call volume causes long patient wait times.",
      "Staff spend valuable time on repetitive scheduling calls.",
      "Delayed responses can impact patient satisfaction and care continuity.",
    ],
    solutions: [
      "Handle routine patient calls instantly with empathetic conversation flows.",
      "Maintain 24/7 phone availability for non-urgent patient needs.",
      "Automate appointment booking, reminders, and care follow-up calls.",
    ],
    useCases: [
      {
        title: "Patient appointment scheduling",
        description: "Book non-urgent appointments quickly and reduce call queues.",
        icon: "🗓️",
      },
      {
        title: "Pre-visit reminders",
        description: "Call patients with preparation steps and time confirmations.",
        icon: "📣",
      },
      {
        title: "Post-discharge follow-ups",
        description: "Check in on recovery instructions and route concerns to care teams.",
        icon: "❤️",
      },
      {
        title: "Department routing assistance",
        description: "Guide callers to the right department without operator bottlenecks.",
        icon: "🧭",
      },
      {
        title: "Routine inquiry support",
        description: "Answer visiting hours, documentation, and process-related questions.",
        icon: "ℹ️",
      },
    ],
    benefits: [
      "No training burden for already stretched care teams.",
      "Plug-and-play implementation with existing contact points.",
      "Calm, human-like voice interactions for better patient trust.",
      "Scales instantly across departments and time windows.",
    ],
    ctaHeadline: "Start Automating Calls in Hospitals Today",
    demoPlaceholderName: "e.g., Alex from NorthCare Hospital",
    demoPlaceholderPhone: "e.g., +1 (555) 222-3344",
  },
  {
    slug: "pet-clinics",
    name: "Pet Clinics",
    icon: "🐾",
    shortDescription:
      "Book visits, answer common owner questions, and triage incoming calls without front-desk overload.",
    longDescription:
      "CCAI for pet clinics balances care and speed, helping teams handle high call volume and keep pet owners informed.",
    valueProps: [
      "Auto-book routine checkup visits",
      "Triage non-emergency call intents",
      "Send vaccine and follow-up reminders",
    ],
    seoKeywords: [
      "AI calling for pet clinics",
      "AI phone agent for pet clinics",
      "veterinary appointment AI calls",
    ],
    heroSubtext:
      "Automate visit scheduling, owner inquiries, and reminder calls with ready-to-use AI calling agents for pet clinics.",
    problems: [
      "Missed calls lead to lost appointments and delayed pet care.",
      "Front-desk teams get overwhelmed by repetitive owner questions.",
      "Slow response times create anxiety for pet owners.",
    ],
    solutions: [
      "Handle incoming pet owner calls instantly with warm, clear conversations.",
      "Stay available 24/7 for routine inquiries and booking requests.",
      "Automate visit scheduling, vaccine reminders, and follow-up outreach.",
    ],
    useCases: [
      {
        title: "Routine checkup booking",
        description: "Schedule wellness visits quickly without front-desk bottlenecks.",
        icon: "🐶",
      },
      {
        title: "Vaccination reminder calls",
        description: "Proactively notify owners about due vaccines and boosters.",
        icon: "💉",
      },
      {
        title: "Post-visit follow-ups",
        description: "Check recovery status and guide owners on next steps.",
        icon: "🩺",
      },
      {
        title: "Medication refill requests",
        description: "Capture refill needs and route approvals to clinic staff.",
        icon: "💊",
      },
      {
        title: "New patient intake calls",
        description: "Collect pet profile details before first appointments.",
        icon: "🐾",
      },
    ],
    benefits: [
      "No special training required for clinic teams.",
      "Plug-and-play setup for solo and multi-location practices.",
      "Friendly, human-like voice that reassures pet owners.",
      "Scales instantly during seasonal demand surges.",
    ],
    ctaHeadline: "Start Automating Calls in Pet Clinics Today",
    demoPlaceholderName: "e.g., Mia from PawWell Clinic",
    demoPlaceholderPhone: "e.g., +1 (555) 678-1122",
  },
] as const satisfies readonly Industry[];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}
