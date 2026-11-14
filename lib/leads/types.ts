export interface LeadEnquiry {
  id: string;
  name: string;
  phone: string;
  district?: string;
  service?: string;
  message?: string;
  source: "Contact Form" | "Inspection Modal" | "Direct Enquiry";
  createdAt: string;
  status: "new" | "contacted" | "inspection_scheduled" | "completed";
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  district?: string;
  service?: string;
  message?: string;
  source?: "Contact Form" | "Inspection Modal" | "Direct Enquiry";
}

