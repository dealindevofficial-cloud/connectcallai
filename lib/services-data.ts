export type ServicePage = {
  slug: string;
  label: string;
  navLabel: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  shortDescription: string;
  heroSubtext: string;
  painPoints: readonly string[];
  howItWorks: readonly string[];
  useCases: readonly {
    title: string;
    description: string;
  }[];
  industriesServed: readonly {
    label: string;
    href: string;
  }[];
  sampleCallFlow: readonly string[];
  integrations: readonly string[];
  pricingAngle: string;
  proofPoints: readonly string[];
  faqs: readonly {
    question: string;
    answer: string;
  }[];
  relatedServices: readonly string[];
  ctaHeadline: string;
  ctaBody: string;
};

export const services = [
  {
    slug: "ai-receptionist",
    label: "AI Receptionist",
    navLabel: "AI Receptionist",
    seoTitle: "AI Receptionist for Business Calls",
    metaDescription:
      "Connect Call AI provides AI receptionist services that answer calls, qualify leads, book appointments, and route urgent requests 24/7.",
    primaryKeyword: "AI receptionist",
    secondaryKeywords: [
      "AI receptionist service",
      "AI virtual receptionist",
      "AI phone receptionist",
      "automated receptionist",
    ],
    shortDescription:
      "Answer every inbound call with a natural voice agent that books, qualifies, and routes.",
    heroSubtext:
      "Give callers an instant, polished first response with an AI receptionist that captures intent, answers routine questions, books next steps, and escalates to your team when needed.",
    painPoints: [
      "Calls arrive when your front desk is busy, closed, or handling in-person customers.",
      "Leads leave voicemails or hang up before your team can respond.",
      "Reception coverage is expensive to staff across nights, weekends, and spikes.",
    ],
    howItWorks: [
      "The AI receptionist answers with your approved greeting and disclosure.",
      "It identifies caller intent, asks intake questions, and confirms contact details.",
      "It books, routes, summarizes, or escalates based on your handoff rules.",
    ],
    useCases: [
      {
        title: "New lead intake",
        description: "Capture caller name, need, timing, budget, and preferred follow-up path.",
      },
      {
        title: "Appointment requests",
        description: "Collect scheduling preferences and move qualified callers toward a booked slot.",
      },
      {
        title: "Routine question handling",
        description: "Answer common questions about hours, services, locations, and policies.",
      },
      {
        title: "Human escalation",
        description: "Transfer urgent, sensitive, or high-value conversations to the right person.",
      },
    ],
    industriesServed: [
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
    ],
    sampleCallFlow: [
      "Caller asks for help or availability.",
      "AI confirms the request, collects details, and checks the configured workflow.",
      "AI books, routes, or creates a follow-up summary for the team.",
    ],
    integrations: ["Calendars", "CRMs", "Phone systems", "Webhooks", "Email notifications"],
    pricingAngle:
      "Use AI receptionist coverage to reduce missed calls and extend front-desk capacity without hiring for every hour of phone demand.",
    proofPoints: [
      "Always-on pickup for inbound calls",
      "Consistent intake questions across every caller",
      "Clear summaries for human follow-up",
    ],
    faqs: [
      {
        question: "What is an AI receptionist?",
        answer:
          "An AI receptionist is a voice agent that answers business calls, understands caller intent, collects details, books or routes next steps, and escalates when a human should take over.",
      },
      {
        question: "Can an AI receptionist transfer calls?",
        answer:
          "Yes. You can define transfer and escalation rules for urgent requests, VIP callers, sensitive topics, or conversations that need a human.",
      },
      {
        question: "Can it use our script?",
        answer:
          "Yes. The workflow can be configured around your greeting, intake questions, qualification criteria, booking process, and handoff rules.",
      },
    ],
    relatedServices: ["ai-phone-answering-service", "ai-appointment-booking", "ai-lead-qualification"],
    ctaHeadline: "See an AI Receptionist Answer Your Next Call",
    ctaBody:
      "Book a demo to preview the greeting, intake, booking, and escalation flow for your business.",
  },
  {
    slug: "ai-phone-answering-service",
    label: "AI Phone Answering Service",
    navLabel: "AI Phone Answering",
    seoTitle: "AI Phone Answering Service for Businesses",
    metaDescription:
      "Use Connect Call AI as an AI phone answering service for overflow, after-hours calls, customer questions, appointment requests, and lead capture.",
    primaryKeyword: "AI phone answering service",
    secondaryKeywords: [
      "AI answering service",
      "automated phone answering service",
      "AI call answering",
      "24/7 phone answering service",
    ],
    shortDescription:
      "Cover overflow, after-hours, and routine customer calls without adding front-desk headcount.",
    heroSubtext:
      "Route routine inbound calls to an AI phone answering service that picks up quickly, captures the reason for the call, and moves each caller toward the right outcome.",
    painPoints: [
      "Inbound calls stack up during busy hours or seasonal demand.",
      "Voicemail creates slow follow-up and incomplete caller details.",
      "Traditional answering services may not qualify, book, or sync outcomes the way your team needs.",
    ],
    howItWorks: [
      "Forward calls or route overflow into the AI answering workflow.",
      "The AI identifies the caller's need and follows the approved script.",
      "Each call ends with a booking, message, transfer, or structured follow-up task.",
    ],
    useCases: [
      {
        title: "Overflow call coverage",
        description: "Answer calls when the team is busy, understaffed, or in appointments.",
      },
      {
        title: "After-hours answering",
        description: "Capture calls outside business hours and prioritize next-day follow-up.",
      },
      {
        title: "Customer message intake",
        description: "Collect structured messages instead of generic voicemail transcripts.",
      },
      {
        title: "Appointment and lead routing",
        description: "Send sales, support, booking, and urgent calls down different paths.",
      },
    ],
    industriesServed: [
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
    ],
    sampleCallFlow: [
      "Caller reaches the AI answering workflow.",
      "AI asks why they are calling and gathers required details.",
      "AI sends the message, books the next step, or routes urgent calls immediately.",
    ],
    integrations: ["Call forwarding", "CRMs", "Calendars", "Support inboxes", "Webhook alerts"],
    pricingAngle:
      "Compare AI answering costs against missed-call revenue, overtime coverage, and live-answering fees for routine calls.",
    proofPoints: [
      "Fast pickup when call volume spikes",
      "Structured outcomes instead of raw voicemails",
      "Coverage that scales across locations and hours",
    ],
    faqs: [
      {
        question: "How is AI phone answering different from voicemail?",
        answer:
          "The AI has a live conversation, asks follow-up questions, captures structured details, and can trigger booking or routing workflows instead of leaving your team a passive recording.",
      },
      {
        question: "Can it answer only when we are busy?",
        answer:
          "Yes. Many teams route overflow, after-hours, or specific campaigns to the AI while keeping normal staff pickup during core hours.",
      },
      {
        question: "Can we review call summaries?",
        answer:
          "Yes. Calls can produce summaries, caller details, intent, and recommended next steps for follow-up.",
      },
    ],
    relatedServices: ["ai-receptionist", "after-hours-ai-answering", "ai-call-center-automation"],
    ctaHeadline: "Upgrade Your Phone Answering Coverage",
    ctaBody:
      "See how an AI answering workflow handles overflow, messages, appointments, and urgent routing.",
  },
  {
    slug: "ai-appointment-booking",
    label: "AI Appointment Booking",
    navLabel: "AI Appointment Booking",
    seoTitle: "AI Appointment Booking for Phone Calls",
    metaDescription:
      "Connect Call AI books appointments from inbound calls using AI voice agents that collect caller details, match scheduling rules, and reduce missed bookings.",
    primaryKeyword: "AI appointment booking",
    secondaryKeywords: [
      "AI appointment scheduler",
      "AI booking assistant",
      "automated appointment booking",
      "phone appointment booking",
    ],
    shortDescription:
      "Collect caller details, match availability, and turn phone interest into scheduled appointments.",
    heroSubtext:
      "Convert phone interest into appointments with an AI booking agent that confirms caller details, follows scheduling rules, and sends each request to the right calendar path.",
    painPoints: [
      "Callers want to book while your team is unavailable or on another call.",
      "Manual scheduling creates back-and-forth, errors, and abandoned leads.",
      "No-shows rise when appointments are not confirmed or captured clearly.",
    ],
    howItWorks: [
      "The AI collects service type, timing, contact details, and scheduling constraints.",
      "It follows your calendar, location, staff, and eligibility rules.",
      "The workflow confirms the appointment request or routes it for human approval.",
    ],
    useCases: [
      {
        title: "New appointment requests",
        description: "Capture requested date, time, service, location, and caller details.",
      },
      {
        title: "Consultation booking",
        description: "Qualify the caller before scheduling a sales or service consultation.",
      },
      {
        title: "Confirmation calls",
        description: "Confirm attendance and capture reschedule requests before the appointment.",
      },
      {
        title: "Reschedule intake",
        description: "Gather new preferred windows without tying up your front desk.",
      },
    ],
    industriesServed: [
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
    ],
    sampleCallFlow: [
      "Caller asks to schedule an appointment.",
      "AI confirms service type, preferred time, and contact details.",
      "AI books, requests approval, or sends a confirmation workflow.",
    ],
    integrations: ["Google Calendar", "Outlook calendars", "Calendly", "CRMs", "Reminder workflows"],
    pricingAngle:
      "Appointment automation pays back when more call traffic becomes booked consultations, visits, reservations, or service appointments.",
    proofPoints: [
      "Clear scheduling intake on every call",
      "Fewer missed booking opportunities",
      "Built-in confirmation and handoff paths",
    ],
    faqs: [
      {
        question: "Can AI book directly on our calendar?",
        answer:
          "Depending on your workflow, the AI can collect appointment details for confirmation or integrate with calendar systems to create booking requests.",
      },
      {
        question: "Can it qualify callers before booking?",
        answer:
          "Yes. The AI can ask eligibility, service, location, budget, or timing questions before a caller reaches the scheduling step.",
      },
      {
        question: "Can it handle rescheduling?",
        answer:
          "Yes. It can collect reschedule requests and route them into your calendar or staff approval process.",
      },
    ],
    relatedServices: ["ai-receptionist", "ai-lead-qualification", "ai-outbound-calling"],
    ctaHeadline: "Turn More Phone Calls Into Booked Appointments",
    ctaBody:
      "Preview an AI booking flow tailored to your calendar rules, intake questions, and confirmation process.",
  },
  {
    slug: "ai-lead-qualification",
    label: "AI Lead Qualification",
    navLabel: "AI Lead Qualification",
    seoTitle: "AI Lead Qualification for Inbound Calls",
    metaDescription:
      "Qualify phone leads with Connect Call AI. AI voice agents ask intake questions, score intent, capture details, and route high-value callers.",
    primaryKeyword: "AI lead qualification",
    secondaryKeywords: [
      "AI lead qualifier",
      "phone lead qualification",
      "AI sales qualification",
      "inbound lead qualification",
    ],
    shortDescription: "Ask the right intake questions before routing high-intent leads to your team.",
    heroSubtext:
      "Give every inbound lead a consistent qualification conversation before your sales or operations team spends time on follow-up.",
    painPoints: [
      "Teams waste time returning calls without knowing fit, urgency, or budget.",
      "High-intent leads get buried with routine questions and low-fit callers.",
      "Qualification quality varies by rep, shift, location, or call volume.",
    ],
    howItWorks: [
      "The AI asks your required intake and qualification questions.",
      "It identifies urgency, service fit, budget, location, and timeline signals.",
      "Qualified leads are routed with structured summaries and recommended next steps.",
    ],
    useCases: [
      {
        title: "Sales intake",
        description: "Capture buyer need, budget, decision timeline, and contact details.",
      },
      {
        title: "Service eligibility",
        description: "Check location, service type, urgency, and required information before handoff.",
      },
      {
        title: "Campaign call routing",
        description: "Separate paid-ad, website, and referral callers by intent and priority.",
      },
      {
        title: "Follow-up prioritization",
        description: "Help teams call back the strongest opportunities first.",
      },
    ],
    industriesServed: [
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
    ],
    sampleCallFlow: [
      "Caller describes what they need.",
      "AI asks qualification questions based on your lead criteria.",
      "AI routes the lead, creates a summary, or schedules the next step.",
    ],
    integrations: ["CRMs", "Lead forms", "Sales inboxes", "Webhook routing", "Notification tools"],
    pricingAngle:
      "Lead qualification helps teams spend human time on the best opportunities while still capturing every inbound caller.",
    proofPoints: [
      "Consistent intake criteria",
      "Priority routing for high-intent leads",
      "Structured lead summaries for faster follow-up",
    ],
    faqs: [
      {
        question: "Can AI qualify leads on the phone?",
        answer:
          "Yes. The AI can ask your qualification questions, capture answers, identify intent, and send qualified callers to the right follow-up path.",
      },
      {
        question: "Can qualification questions vary by service?",
        answer:
          "Yes. Questions can change by campaign, service type, caller intent, industry, or routing path.",
      },
      {
        question: "Does the AI replace sales reps?",
        answer:
          "No. It handles first-pass intake and prioritization so your reps can focus on conversations that need human expertise.",
      },
    ],
    relatedServices: ["ai-receptionist", "ai-appointment-booking", "ai-outbound-calling"],
    ctaHeadline: "Qualify Phone Leads Before They Reach Your Team",
    ctaBody:
      "Map your qualification questions and see how AI can route the strongest callers faster.",
  },
  {
    slug: "after-hours-ai-answering",
    label: "After-Hours AI Answering",
    navLabel: "After-Hours AI Answering",
    seoTitle: "After-Hours AI Answering Service",
    metaDescription:
      "Capture calls after close with Connect Call AI. After-hours AI answering collects details, books requests, routes urgent calls, and reduces missed opportunities.",
    primaryKeyword: "after-hours AI answering",
    secondaryKeywords: [
      "after hours answering service",
      "24/7 AI answering",
      "AI answering after hours",
      "night and weekend call answering",
    ],
    shortDescription: "Capture urgent requests, bookings, and lead details when your office is closed.",
    heroSubtext:
      "Keep phone coverage active after close with an AI answering workflow that captures leads, appointment requests, urgent issues, and next-day follow-up details.",
    painPoints: [
      "Evening and weekend callers may choose a competitor before morning.",
      "Voicemail often misses key details your team needs to respond.",
      "Urgent calls need clear escalation rules, not a generic inbox.",
    ],
    howItWorks: [
      "After-hours calls forward to the AI workflow.",
      "The AI triages urgency, gathers details, and explains next steps.",
      "Urgent calls escalate immediately while routine requests queue for follow-up.",
    ],
    useCases: [
      {
        title: "Night and weekend lead capture",
        description: "Keep converting callers who search or respond to ads outside office hours.",
      },
      {
        title: "Urgency triage",
        description: "Separate emergency, high-priority, and routine requests with clear instructions.",
      },
      {
        title: "Appointment requests",
        description: "Collect preferred windows before staff return.",
      },
      {
        title: "Next-day summaries",
        description: "Send structured call details to the team for fast follow-up.",
      },
    ],
    industriesServed: [
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
    ],
    sampleCallFlow: [
      "Caller reaches the after-hours greeting.",
      "AI determines whether the matter is urgent, bookable, or routine.",
      "AI escalates, records the request, or queues a follow-up summary.",
    ],
    integrations: ["Call forwarding schedules", "On-call alerts", "CRMs", "Calendars", "Email summaries"],
    pricingAngle:
      "After-hours AI coverage lets teams extend pickup windows without staffing every evening, weekend, or holiday shift.",
    proofPoints: [
      "24/7 caller intake",
      "Escalation rules for urgent situations",
      "Next-day summaries your team can act on",
    ],
    faqs: [
      {
        question: "Can AI answer calls after business hours only?",
        answer:
          "Yes. Calls can be routed to the AI based on business hours, holidays, overflow settings, or specific campaign numbers.",
      },
      {
        question: "Can urgent calls reach a human?",
        answer:
          "Yes. You can define escalation rules for urgent categories and route those calls to an on-call contact or priority workflow.",
      },
      {
        question: "Will callers know what happens next?",
        answer:
          "Yes. The AI can explain expected response windows, emergency disclaimers, booking steps, or follow-up instructions.",
      },
    ],
    relatedServices: ["ai-phone-answering-service", "ai-receptionist", "ai-outbound-calling"],
    ctaHeadline: "Stop Losing Calls After Close",
    ctaBody:
      "Preview an after-hours answering workflow with intake, triage, and escalation rules for your business.",
  },
  {
    slug: "ai-call-center-automation",
    label: "AI Call Center Automation",
    navLabel: "AI Call Center Automation",
    seoTitle: "AI Call Center Automation for Repetitive Phone Workflows",
    metaDescription:
      "Automate repetitive call center workflows with Connect Call AI, including intake, routing, confirmations, status questions, and human handoffs.",
    primaryKeyword: "AI call center automation",
    secondaryKeywords: [
      "call center automation",
      "AI call center agent",
      "automated call center",
      "AI customer service calls",
    ],
    shortDescription: "Automate repetitive call center workflows while preserving escalation paths.",
    heroSubtext:
      "Use AI voice agents to handle repetitive call center conversations, route complex cases, and give operators cleaner summaries for follow-up.",
    painPoints: [
      "Agents spend too much time on repetitive questions, intake, and confirmations.",
      "Call queues grow when volume spikes or staffing is uneven.",
      "Customers need faster responses without losing access to human help.",
    ],
    howItWorks: [
      "Identify repeatable call types and define the automation boundaries.",
      "The AI handles approved intake, status, routing, and confirmation workflows.",
      "Calls escalate with context when sentiment, complexity, or policy requires a human.",
    ],
    useCases: [
      {
        title: "Tier-one intake",
        description: "Collect reason for call, account context, preferred outcome, and urgency.",
      },
      {
        title: "Status and FAQ calls",
        description: "Handle approved routine questions while routing exceptions to humans.",
      },
      {
        title: "Appointment and confirmation flows",
        description: "Confirm, remind, reschedule, or route appointment-related calls.",
      },
      {
        title: "Queue relief",
        description: "Deflect repetitive conversations during peaks without closing the human path.",
      },
    ],
    industriesServed: [
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
    ],
    sampleCallFlow: [
      "Caller selects or states the reason for calling.",
      "AI completes the approved workflow or gathers required context.",
      "AI resolves, routes, or transfers with a summary for the next agent.",
    ],
    integrations: ["CRMs", "Ticketing systems", "Knowledge bases", "Phone providers", "Webhook workflows"],
    pricingAngle:
      "Call center automation is strongest when high-volume, repeatable calls consume human time that could be reserved for complex conversations.",
    proofPoints: [
      "Lower repetitive call load",
      "Shorter intake before human handoff",
      "Consistent routing and summary quality",
    ],
    faqs: [
      {
        question: "What call center workflows can AI automate?",
        answer:
          "Good candidates include intake, routing, appointment confirmations, routine questions, status requests, reminders, and structured follow-up calls.",
      },
      {
        question: "Can callers still reach a person?",
        answer:
          "Yes. Human handoff rules can be based on caller request, urgency, topic, sentiment, or policy boundaries.",
      },
      {
        question: "Do we need to automate every call type?",
        answer:
          "No. The best starting point is usually a narrow set of high-volume, repetitive workflows with clear success criteria.",
      },
    ],
    relatedServices: ["ai-phone-answering-service", "custom-ai-voice-agents", "ai-outbound-calling"],
    ctaHeadline: "Automate Repetitive Call Center Work",
    ctaBody:
      "Identify the highest-volume workflows and see how AI can handle them with clean human handoffs.",
  },
  {
    slug: "custom-ai-voice-agents",
    label: "Custom AI Voice Agents",
    navLabel: "Custom AI Voice Agents",
    seoTitle: "Custom AI Voice Agents for Business Phone Workflows",
    metaDescription:
      "Build custom AI voice agents with Connect Call AI for scripts, routing rules, integrations, compliance needs, and industry-specific call flows.",
    primaryKeyword: "custom AI voice agents",
    secondaryKeywords: [
      "custom AI phone agent",
      "AI voice agent development",
      "custom voice automation",
      "AI calling workflow",
    ],
    shortDescription:
      "Build voice agents around your scripts, integrations, compliance needs, and routing rules.",
    heroSubtext:
      "Design a custom AI voice agent around your callers, scripts, tools, escalation rules, compliance needs, and business outcomes.",
    painPoints: [
      "Generic phone bots do not match your terminology, intake flow, or customer expectations.",
      "Business rules vary by service, location, campaign, and caller type.",
      "Integrations and escalation paths need to reflect how your team actually works.",
    ],
    howItWorks: [
      "Map caller intents, business rules, scripts, and handoff boundaries.",
      "Build the voice workflow around your tools, data capture needs, and routing logic.",
      "Test sample calls, refine prompts, and launch with monitoring and iteration.",
    ],
    useCases: [
      {
        title: "Industry-specific reception",
        description: "Create call flows for healthcare, real estate, restaurants, clinics, and local services.",
      },
      {
        title: "Multi-step intake",
        description: "Capture complex details before routing, booking, or creating records.",
      },
      {
        title: "Custom escalation rules",
        description: "Define what AI should handle, avoid, transfer, or flag for review.",
      },
      {
        title: "Integrated workflows",
        description: "Connect call outcomes to calendars, CRMs, emails, webhooks, and internal systems.",
      },
    ],
    industriesServed: [
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
    ],
    sampleCallFlow: [
      "Caller states a need in natural language.",
      "AI follows your custom decision tree and captures required fields.",
      "AI completes the workflow, routes the caller, or triggers a connected system.",
    ],
    integrations: ["Calendars", "CRMs", "Phone providers", "Internal APIs", "Webhooks"],
    pricingAngle:
      "Custom voice agents are priced around call volume, workflow complexity, integrations, and how much human work the agent can absorb.",
    proofPoints: [
      "Workflows shaped around your scripts",
      "Configured handoff and compliance boundaries",
      "Integration-ready call outcomes",
    ],
    faqs: [
      {
        question: "What makes an AI voice agent custom?",
        answer:
          "A custom agent uses your scripts, caller intents, intake fields, routing rules, integrations, escalation boundaries, and brand voice instead of a generic phone tree.",
      },
      {
        question: "Can it support multiple workflows?",
        answer:
          "Yes. A voice agent can branch by caller intent, location, service type, urgency, campaign source, or account status.",
      },
      {
        question: "How do we know what the AI should not handle?",
        answer:
          "During setup, you define guardrails and escalation rules for sensitive, urgent, regulated, or high-risk conversations.",
      },
    ],
    relatedServices: ["ai-receptionist", "ai-call-center-automation", "ai-outbound-calling"],
    ctaHeadline: "Build a Voice Agent Around Your Call Flow",
    ctaBody:
      "Map your scripts, handoff rules, and integrations with a custom AI voice workflow demo.",
  },
  {
    slug: "ai-outbound-calling",
    label: "AI Outbound Calling",
    navLabel: "AI Outbound Calling",
    seoTitle: "AI Outbound Calling for Follow-Ups and Reminders",
    metaDescription:
      "Use Connect Call AI for approved AI outbound calling workflows, including reminders, confirmations, follow-ups, reactivation, and post-call updates.",
    primaryKeyword: "AI outbound calling",
    secondaryKeywords: [
      "AI outbound calls",
      "automated outbound calling",
      "AI follow up calls",
      "AI reminder calls",
    ],
    shortDescription:
      "Run reminders, follow-ups, confirmations, and reactivation calls with approved workflows.",
    heroSubtext:
      "Automate approved outbound calls for reminders, confirmations, reactivation, and follow-up while keeping consent, escalation, and opt-out rules clear.",
    painPoints: [
      "Teams fall behind on reminders, confirmations, and follow-up calls.",
      "Manual outbound calling is inconsistent and hard to scale.",
      "Outbound workflows need clear consent, opt-out, and escalation handling.",
    ],
    howItWorks: [
      "Define approved call purposes, audience, timing, script, and consent requirements.",
      "The AI places outbound calls, confirms identity or intent, and captures outcomes.",
      "Results sync back for staff follow-up, booking updates, or campaign reporting.",
    ],
    useCases: [
      {
        title: "Appointment reminders",
        description: "Confirm attendance, collect reschedule requests, and reduce no-shows.",
      },
      {
        title: "Lead follow-up",
        description: "Reconnect with interested callers who requested information or missed a call.",
      },
      {
        title: "Customer reactivation",
        description: "Contact inactive customers with approved offers or service reminders.",
      },
      {
        title: "Post-call updates",
        description: "Share approved status updates and collect simple confirmations.",
      },
    ],
    industriesServed: [
      { label: "Real estate", href: "/industries/ai-receptionist-for-real-estate" },
      { label: "Restaurants", href: "/industries/ai-receptionist-for-restaurants" },
      { label: "Hospitals", href: "/industries/ai-phone-answering-for-hospitals" },
      { label: "Pet clinics", href: "/industries/ai-receptionist-for-pet-clinics" },
    ],
    sampleCallFlow: [
      "AI calls an approved contact for a defined purpose.",
      "AI verifies the next step, answer, or scheduling preference.",
      "AI records the outcome, opt-out request, transfer need, or follow-up task.",
    ],
    integrations: ["CRMs", "Calendars", "Campaign lists", "Opt-out records", "Webhook reporting"],
    pricingAngle:
      "Outbound AI calling is most valuable when routine reminders and follow-ups recover revenue or reduce no-shows without manual dialing.",
    proofPoints: [
      "Consistent follow-up at scale",
      "Outcome tracking for each call",
      "Consent, opt-out, and escalation rules built into the workflow",
    ],
    faqs: [
      {
        question: "What can AI outbound calling be used for?",
        answer:
          "Common uses include reminders, confirmations, follow-ups, reactivation, post-call updates, and approved outreach workflows.",
      },
      {
        question: "Can callers opt out?",
        answer:
          "Yes. Outbound workflows should include opt-out handling and respect your consent, compliance, and suppression rules.",
      },
      {
        question: "Can outbound calls transfer to a person?",
        answer:
          "Yes. If the caller requests a human or hits an escalation condition, the workflow can route the conversation to your team.",
      },
    ],
    relatedServices: ["ai-appointment-booking", "ai-lead-qualification", "custom-ai-voice-agents"],
    ctaHeadline: "Automate Follow-Up Calls Without Manual Dialing",
    ctaBody:
      "See how approved outbound workflows can confirm, remind, reactivate, and route callers.",
  },
] as const satisfies readonly ServicePage[];

export function getServicePath(service: Pick<ServicePage, "slug">): string {
  return `/services/${service.slug}`;
}

export function getServiceBySlug(slug: string): ServicePage | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceCanonicalUrl(base: string, service: Pick<ServicePage, "slug">): string {
  return `${base}${getServicePath(service)}`;
}

export function getServiceLinks() {
  return services.map((service) => ({
    label: service.label,
    href: getServicePath(service),
    description: service.shortDescription,
  }));
}
