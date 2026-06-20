export type Industry = {
  slug: string;
  pageSlug: string;
  legacyPageSlugs?: readonly string[];
  name: string;
  seoTitle: string;
  metaDescription: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  valueProps: readonly string[];
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  heroSubtext: string;
  problems: readonly string[];
  solutions: readonly string[];
  useCases: readonly {
    title: string;
    description: string;
    icon: string;
  }[];
  benefits: readonly string[];
  faqs: readonly {
    question: string;
    answer: string;
  }[];
  ctaHeadline: string;
  ctaBody: string;
  demoPlaceholderName: string;
  demoPlaceholderPhone: string;
};

export const industries = [
  {
    slug: "real-estate",
    pageSlug: "ai-receptionist-for-real-estate",
    legacyPageSlugs: ["ai-calling-agents-for-real-estate"],
    name: "Real Estate",
    seoTitle: "AI Receptionist for Real Estate Agents",
    metaDescription:
      "Connect Call AI gives real estate teams an AI receptionist that answers calls 24/7, qualifies leads, books showings, and follows up automatically.",
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
    primaryKeyword: "AI receptionist for real estate",
    secondaryKeywords: [
      "AI phone answering for real estate",
      "AI phone agent for real estate",
      "AI voice agent for real estate",
      "AI appointment booking for real estate",
      "AI calling agent for real estate",
    ],
    heroSubtext:
      "Connect Call AI gives real estate teams an AI receptionist that answers calls 24/7, qualifies buyer and seller leads, books showings, and works like a natural AI calling agent for real estate.",
    problems: [
      "Listing calls arrive while agents are in showings, on the road, or outside office hours.",
      "Unqualified callers consume time before agents know budget, location, timeline, or seller intent.",
      "Slow lead response lets another brokerage win the buyer, seller, or investor first.",
    ],
    solutions: [
      "Answer every property inquiry with an AI receptionist trained for real estate conversations.",
      "Qualify buyers, sellers, and renters before routing high-intent leads to the right agent.",
      "Book showings, confirm appointments, and trigger follow-up calls without manual chasing.",
    ],
    useCases: [
      {
        title: "Buyer and seller lead intake",
        description: "Capture budget, property type, desired area, timeline, and selling intent before handoff.",
        icon: "📋",
      },
      {
        title: "Listing question answering",
        description: "Answer common questions about price, availability, amenities, and open house timing.",
        icon: "🏠",
      },
      {
        title: "Showing appointment booking",
        description: "Turn inbound interest into confirmed tours while the caller is still engaged.",
        icon: "📅",
      },
      {
        title: "After-hours lead capture",
        description: "Keep answering calls from buyers browsing listings at night and on weekends.",
        icon: "📞",
      },
      {
        title: "Agent handoff routing",
        description: "Escalate urgent, high-value, or neighborhood-specific conversations to a human agent.",
        icon: "📈",
      },
    ],
    benefits: [
      "Capture more real estate leads without hiring extra front-desk coverage.",
      "Respond instantly to listing calls from ads, signs, portals, and Google search.",
      "Give callers a polished AI receptionist experience before an agent steps in.",
      "Keep lead follow-up consistent across open houses, new listings, and campaign spikes.",
    ],
    faqs: [
      {
        question: "What is an AI receptionist for real estate agents?",
        answer:
          "It is an AI phone answering workflow that picks up real estate calls, asks lead qualification questions, captures caller details, and routes or books the next step for your team.",
      },
      {
        question: "Can it qualify buyer and seller leads?",
        answer:
          "Yes. The AI receptionist can ask about budget, desired area, property type, timeline, financing status, selling intent, and other criteria before sending the lead to an agent.",
      },
      {
        question: "Can it book property showings?",
        answer:
          "Yes. It can collect preferred times, property interest, contact details, and availability so your team can confirm or automate showing appointments.",
      },
      {
        question: "Can it answer after-hours listing calls?",
        answer:
          "Yes. It can answer calls 24/7, capture interest from signs, ads, portals, and Google searches, then trigger follow-up when your agents are available.",
      },
      {
        question: "Can it transfer urgent calls to a human agent?",
        answer:
          "Yes. You can define handoff rules for high-value leads, active clients, urgent closing questions, or callers who need a licensed agent right away.",
      },
      {
        question: "Can it work with my existing real estate phone number?",
        answer:
          "In most setups, calls can be forwarded from your current number or routed through a dedicated campaign number while keeping the caller experience consistent.",
      },
    ],
    ctaHeadline: "See How an AI Receptionist Handles Real Estate Calls",
    ctaBody:
      "Preview a real estate AI phone answering workflow that qualifies leads, books showings, and routes serious callers to your team.",
    demoPlaceholderName: "e.g., Sarah from BlueStone Realty",
    demoPlaceholderPhone: "e.g., +1 (555) 123-4567",
  },
  {
    slug: "restaurants",
    pageSlug: "ai-receptionist-for-restaurants",
    legacyPageSlugs: ["ai-calling-agents-for-restaurants"],
    name: "Restaurants",
    seoTitle: "AI Receptionist for Restaurants",
    metaDescription:
      "Connect Call AI helps restaurants answer calls 24/7, book reservations, handle guest questions, and reduce missed calls during busy service hours.",
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
    primaryKeyword: "AI receptionist for restaurants",
    secondaryKeywords: [
      "AI phone answering for restaurants",
      "AI phone agent for restaurants",
      "AI voice agent for restaurants",
      "AI appointment booking for restaurants",
      "AI calling agent for restaurants",
    ],
    heroSubtext:
      "Connect Call AI gives restaurants an AI receptionist that answers calls during rushes and after hours, books reservations, handles takeout questions, and works like a natural AI calling agent for restaurants.",
    problems: [
      "Reservation calls get missed when hosts are seating guests, taking payments, or managing the floor.",
      "Guests hang up when nobody answers quickly during lunch, dinner, weekends, or holidays.",
      "Staff lose focus when routine calls interrupt service, takeout, and in-person hospitality.",
    ],
    solutions: [
      "Let an AI receptionist answer restaurant calls instantly during rush hours and after close.",
      "Book reservations, confirm party size, answer common questions, and collect special requests.",
      "Route catering, private event, and urgent guest issues to the right manager or staff member.",
    ],
    useCases: [
      {
        title: "Reservation booking",
        description: "Confirm date, time, party size, seating notes, and contact details in one call.",
        icon: "🍽️",
      },
      {
        title: "Menu and hours questions",
        description: "Answer routine guest questions about hours, location, parking, menu items, and policies.",
        icon: "🥡",
      },
      {
        title: "Waitlist updates",
        description: "Notify guests when tables open and reduce pressure on the host stand.",
        icon: "⏳",
      },
      {
        title: "Reservation confirmations",
        description: "Call guests before service windows to confirm attendance and reduce no-shows.",
        icon: "🔔",
      },
      {
        title: "Private event intake",
        description: "Collect group size, occasion, date, budget, and catering needs before manager follow-up.",
        icon: "🎉",
      },
    ],
    benefits: [
      "Answer more guest calls without pulling staff away from the dining room.",
      "Convert more searches and late-night calls into confirmed reservations.",
      "Protect the hospitality experience with a calm, natural AI phone agent.",
      "Scale phone coverage across rushes, holidays, promotions, and multiple locations.",
    ],
    faqs: [
      {
        question: "What is an AI receptionist for restaurants?",
        answer:
          "It is an AI phone answering system that answers guest calls, books reservations, handles common questions, and routes special requests without pulling staff away from service.",
      },
      {
        question: "Can it book reservations and collect party details?",
        answer:
          "Yes. It can collect date, time, party size, contact information, seating notes, allergies, and special requests before confirming or sending the request to staff.",
      },
      {
        question: "Can it answer calls during lunch and dinner rushes?",
        answer:
          "Yes. The AI receptionist can pick up when hosts and managers are busy, reducing missed calls and keeping guests from waiting on hold.",
      },
      {
        question: "Can it answer menu, hours, and location questions?",
        answer:
          "Yes. It can respond to routine questions about hours, address, parking, menu availability, takeout policies, and other information you provide.",
      },
      {
        question: "Can it help reduce reservation no-shows?",
        answer:
          "Yes. It can place confirmation and reminder calls so guests can confirm, update, or cancel before the reservation window.",
      },
      {
        question: "Can it route catering or private event requests?",
        answer:
          "Yes. It can collect event size, date, budget, occasion, and catering needs, then route qualified requests to the right manager.",
      },
    ],
    ctaHeadline: "See How an AI Receptionist Handles Restaurant Calls",
    ctaBody:
      "Preview restaurant AI phone answering for reservations, guest questions, waitlist updates, and manager handoffs.",
    demoPlaceholderName: "e.g., Lina from UrbanBite",
    demoPlaceholderPhone: "e.g., +1 (555) 987-6543",
  },
  {
    slug: "hospitals",
    pageSlug: "ai-phone-answering-for-hospitals",
    legacyPageSlugs: ["ai-calling-agents-for-hospitals"],
    name: "Hospitals",
    seoTitle: "AI Phone Answering for Hospitals",
    metaDescription:
      "Connect Call AI gives hospitals AI phone answering for routine patient calls, scheduling, reminders, and department routing with clear human handoff.",
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
    primaryKeyword: "AI phone answering for hospitals",
    secondaryKeywords: [
      "AI medical receptionist",
      "AI receptionist for hospitals",
      "AI phone agent for hospitals",
      "AI voice agent for hospitals",
      "AI appointment booking for hospitals",
      "AI calling agent for hospitals",
    ],
    heroSubtext:
      "Connect Call AI gives hospitals AI phone answering for routine patient calls, scheduling, reminders, and department routing while working like a calm AI calling agent for hospitals.",
    problems: [
      "Patient calls stack up around appointment desks, departments, and operator lines.",
      "Staff spend valuable time repeating scheduling, reminder, hours, and routing information.",
      "Long hold times and unclear routing can frustrate patients before they reach the right team.",
    ],
    solutions: [
      "Use AI phone answering to resolve routine hospital calls with calm, clearly scripted flows.",
      "Route department requests, appointment needs, and non-urgent questions to the right workflow.",
      "Escalate urgent, complex, or sensitive calls to human staff based on defined handoff rules.",
    ],
    useCases: [
      {
        title: "Routine appointment scheduling",
        description: "Collect patient details and help book or request non-urgent appointments faster.",
        icon: "🗓️",
      },
      {
        title: "Pre-visit reminder calls",
        description: "Confirm arrival times, preparation steps, documents, and location details.",
        icon: "📣",
      },
      {
        title: "Post-discharge check-ins",
        description: "Ask structured follow-up questions and route concerns to the appropriate care team.",
        icon: "❤️",
      },
      {
        title: "Department routing",
        description: "Guide callers toward billing, scheduling, records, visiting information, or clinical teams.",
        icon: "🧭",
      },
      {
        title: "Visitor and process FAQs",
        description: "Answer common questions about visiting hours, paperwork, parking, and general processes.",
        icon: "ℹ️",
      },
    ],
    benefits: [
      "Reduce repetitive front-desk call volume without replacing clinical judgment.",
      "Give patients a clearer first phone experience before staff handoff.",
      "Support after-hours routine calls while preserving escalation paths for urgent needs.",
      "Standardize routing and reminder workflows across departments and locations.",
    ],
    faqs: [
      {
        question: "What is AI phone answering for hospitals?",
        answer:
          "It is an AI medical receptionist workflow for routine hospital calls, including scheduling requests, reminders, department routing, visitor questions, and structured handoff to staff.",
      },
      {
        question: "Can it schedule appointments and send reminders?",
        answer:
          "Yes. It can collect appointment details, confirm visit information, place reminder calls, and route scheduling requests according to your hospital workflow.",
      },
      {
        question: "Can it replace hospital operators or clinical staff?",
        answer:
          "No. It is designed to reduce repetitive call volume and improve routing, while urgent, complex, or clinical conversations are handed to trained staff.",
      },
      {
        question: "How does it handle urgent patient calls?",
        answer:
          "You define escalation rules for urgent or sensitive intents. The AI can identify those calls early and direct callers to the appropriate emergency, department, or human handoff path.",
      },
      {
        question: "Can it route callers to the right department?",
        answer:
          "Yes. It can guide callers toward scheduling, billing, records, visiting information, department desks, or other approved routing paths.",
      },
      {
        question: "Can it answer visitor and process questions?",
        answer:
          "Yes. It can answer approved questions about visiting hours, parking, documents, location details, and general hospital processes.",
      },
    ],
    ctaHeadline: "See How AI Phone Answering Supports Hospital Calls",
    ctaBody:
      "Preview hospital AI phone answering for routine scheduling, reminders, department routing, and defined human handoffs.",
    demoPlaceholderName: "e.g., Alex from NorthCare Hospital",
    demoPlaceholderPhone: "e.g., +1 (555) 222-3344",
  },
  {
    slug: "dental-offices",
    pageSlug: "ai-receptionist-for-dental-offices",
    legacyPageSlugs: [],
    name: "Dental Offices",
    seoTitle: "AI Receptionist for Dental Offices",
    metaDescription:
      "Connect Call AI gives dental offices an AI receptionist that answers calls, books appointments, collects intake details, and routes urgent dental requests.",
    icon: "🦷",
    shortDescription:
      "Book patient appointments, answer office questions, and route urgent dental calls with 24/7 AI phone answering.",
    longDescription:
      "CCAI for dental offices helps front-desk teams capture new patient calls, manage appointment requests, and reduce routine phone workload.",
    valueProps: [
      "Book new patient and hygiene appointments",
      "Capture patient intake details before staff review",
      "Route urgent dental calls to the right team",
    ],
    primaryKeyword: "AI receptionist for dental offices",
    secondaryKeywords: [
      "AI dental receptionist",
      "AI receptionist for dentists",
      "AI phone answering for dental offices",
      "dental appointment scheduling AI",
      "AI voice agent for dental offices",
      "AI calling agent for dental offices",
    ],
    heroSubtext:
      "Connect Call AI gives dental offices an AI receptionist that answers calls 24/7, books patient appointments, collects intake details, and works like a natural AI calling agent for dental offices.",
    problems: [
      "New patient calls arrive while front-desk staff are checking patients in, processing payments, or helping providers.",
      "Routine questions about insurance, hours, pricing, and treatment prep interrupt appointment flow throughout the day.",
      "After-hours tooth pain, rescheduling, and cancellation calls can turn into lost appointments when nobody answers.",
    ],
    solutions: [
      "Let an AI receptionist answer dental office calls instantly and collect the details staff need before follow-up.",
      "Book or request appointments for new patients, hygiene visits, consultations, rescheduling, and cancellations.",
      "Identify urgent dental concerns and route callers to your approved emergency or human handoff path.",
    ],
    useCases: [
      {
        title: "New patient appointment booking",
        description: "Collect caller details, visit reason, preferred times, and basic intake before staff confirmation.",
        icon: "📅",
      },
      {
        title: "After-hours dental answering",
        description: "Answer appointment, rescheduling, and urgent dental calls when the office is closed.",
        icon: "☎️",
      },
      {
        title: "Insurance and office FAQs",
        description: "Respond to approved questions about accepted insurance, hours, location, pricing, and policies.",
        icon: "🧾",
      },
      {
        title: "Cancellation and reschedule intake",
        description: "Capture changes early so your team can protect chair time and fill openings faster.",
        icon: "🔁",
      },
      {
        title: "Urgent dental call routing",
        description: "Recognize emergency language and send callers to the right staff or approved instructions.",
        icon: "🦷",
      },
    ],
    benefits: [
      "Capture more patient calls without adding front-desk headcount.",
      "Reduce hold times for appointment requests, office questions, and rescheduling.",
      "Give callers a calm AI dental receptionist experience before staff handoff.",
      "Keep after-hours intake, reminders, and follow-up workflows consistent.",
    ],
    faqs: [
      {
        question: "What is an AI receptionist for dental offices?",
        answer:
          "It is an AI phone answering workflow that answers dental office calls, collects caller details, helps with appointment requests, answers approved FAQs, and routes calls that need staff.",
      },
      {
        question: "Can it book new patient appointments?",
        answer:
          "Yes. It can collect new patient details, visit reason, preferred appointment times, phone number, email, and other intake fields before booking or sending the request to your team.",
      },
      {
        question: "Can it handle emergency dental calls?",
        answer:
          "It should not diagnose or provide clinical advice, but it can identify urgent dental language and route callers to your approved emergency path or human staff.",
      },
      {
        question: "Can it answer after-hours dental office calls?",
        answer:
          "Yes. It can answer calls outside business hours, capture appointment requests, collect cancellation or rescheduling details, and send urgent calls through your handoff rules.",
      },
      {
        question: "Can it collect patient intake details?",
        answer:
          "Yes. It can gather structured details such as caller name, contact information, visit reason, preferred times, insurance basics, and whether the caller is a new or returning patient.",
      },
      {
        question: "Can it route complex insurance or treatment questions to staff?",
        answer:
          "Yes. You can define which questions the AI receptionist may answer and which topics should be handed to front-desk staff, billing, or clinical team members.",
      },
      {
        question: "Can it work with my existing dental office phone number?",
        answer:
          "In most setups, calls can be forwarded from your existing office number during busy, overflow, or after-hours periods while keeping the caller experience consistent.",
      },
    ],
    ctaHeadline: "See How an AI Receptionist Handles Dental Office Calls",
    ctaBody:
      "Preview dental office AI phone answering for appointment booking, patient intake, office FAQs, rescheduling, and urgent handoffs.",
    demoPlaceholderName: "e.g., Jamie from BrightSmile Dental",
    demoPlaceholderPhone: "e.g., +1 (555) 414-7788",
  },
  {
    slug: "pet-clinics",
    pageSlug: "ai-receptionist-for-pet-clinics",
    legacyPageSlugs: ["ai-calling-agents-for-pet-clinics"],
    name: "Pet Clinics",
    seoTitle: "AI Receptionist for Pet Clinics",
    metaDescription:
      "Connect Call AI gives pet clinics an AI receptionist that books visits, answers owner questions, sends reminders, and reduces front-desk call volume.",
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
    primaryKeyword: "AI receptionist for pet clinics",
    secondaryKeywords: [
      "AI phone answering for pet clinics",
      "AI phone agent for pet clinics",
      "AI voice agent for pet clinics",
      "AI appointment booking for pet clinics",
      "AI calling agent for pet clinics",
    ],
    heroSubtext:
      "Connect Call AI gives pet clinics an AI receptionist that answers owner calls 24/7, books visits, sends reminders, and works like a natural AI calling agent for pet clinics.",
    problems: [
      "Pet owners call during appointments, procedures, lunch breaks, and after-hours windows.",
      "Front-desk teams repeat answers about availability, vaccines, refills, pricing, and visit prep.",
      "Missed or delayed callbacks can turn routine questions into anxious owner experiences.",
    ],
    solutions: [
      "Give pet owners an AI receptionist that answers routine clinic calls with a warm voice.",
      "Book wellness visits, collect intake details, and send reminders before staff review.",
      "Identify urgent symptoms or complex requests and route them to the clinic team quickly.",
    ],
    useCases: [
      {
        title: "Wellness visit booking",
        description: "Schedule routine checkups, new patient visits, and follow-up appointments faster.",
        icon: "🐶",
      },
      {
        title: "Vaccine reminder calls",
        description: "Remind owners about due vaccines, boosters, and preventive care appointments.",
        icon: "💉",
      },
      {
        title: "Post-visit follow-ups",
        description: "Check basic recovery status, reinforce next steps, and route concerns to staff.",
        icon: "🩺",
      },
      {
        title: "Medication refill intake",
        description: "Capture pet, medication, and pharmacy details before staff approval.",
        icon: "💊",
      },
      {
        title: "Urgent call routing",
        description: "Recognize urgent owner concerns and hand them to the clinic according to your rules.",
        icon: "🐾",
      },
    ],
    benefits: [
      "Reduce front-desk overload without making pet owners wait on hold.",
      "Capture appointment requests from Google, referrals, and after-hours search traffic.",
      "Give routine callers a friendly AI receptionist while staff focus on in-clinic care.",
      "Keep reminders, intake, and follow-up calls consistent during seasonal demand spikes.",
    ],
    faqs: [
      {
        question: "What is an AI receptionist for pet clinics?",
        answer:
          "It is an AI phone answering workflow that answers pet owner calls, books routine visits, captures intake details, sends reminders, and routes urgent concerns to your clinic team.",
      },
      {
        question: "Can it book veterinary appointments?",
        answer:
          "Yes. It can collect pet details, reason for visit, owner contact information, preferred times, and new patient information before booking or sending the request to staff.",
      },
      {
        question: "Can it handle emergency pet calls?",
        answer:
          "It should not diagnose pets, but it can recognize urgent symptoms or emergency language and route callers to the clinic, emergency line, or instructions you approve.",
      },
      {
        question: "Can it send vaccine or follow-up reminders?",
        answer:
          "Yes. It can place reminder calls for vaccines, boosters, wellness visits, post-visit check-ins, and follow-up appointments.",
      },
      {
        question: "Can it reduce front-desk call volume?",
        answer:
          "Yes. It can answer repetitive questions, collect refill and appointment details, and handle routine intake so staff can focus on in-clinic care.",
      },
      {
        question: "Can it work with my existing pet clinic phone number?",
        answer:
          "In most setups, your existing number can forward calls to the AI receptionist during busy, after-hours, or overflow periods.",
      },
    ],
    ctaHeadline: "See How an AI Receptionist Handles Pet Clinic Calls",
    ctaBody:
      "Preview pet clinic AI phone answering for appointment booking, owner questions, reminders, refill intake, and urgent handoffs.",
    demoPlaceholderName: "e.g., Mia from PawWell Clinic",
    demoPlaceholderPhone: "e.g., +1 (555) 678-1122",
  },
] as const satisfies readonly Industry[];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

export function getIndustryPath(industry: Pick<Industry, "pageSlug">) {
  return `/industries/${industry.pageSlug}`;
}

export function getIndustryCanonicalUrl(siteOrigin: string, industry: Pick<Industry, "pageSlug">) {
  return `${siteOrigin.replace(/\/$/, "")}${getIndustryPath(industry)}`;
}

export function getIndustryByRouteSlug(routeSlug: string) {
  return industries.find((industry) => {
    const legacyPageSlugs: readonly string[] = industry.legacyPageSlugs ?? [];

    return (
      industry.pageSlug === routeSlug ||
      industry.slug === routeSlug ||
      legacyPageSlugs.includes(routeSlug)
    );
  });
}
