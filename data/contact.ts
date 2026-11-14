import companyData from "./company-info.json";

export const contactInfo = {
  address: companyData.address || "2nd Mile, Mepparambu, Palakkad",
  city: companyData.city || "Palakkad",
  district: companyData.district || "Palakkad",
  state: companyData.state || "Kerala",
  pincode: companyData.pincode || "678006",
  phone: companyData.phone || "+91 81369 83928",
  phoneSecondary: companyData.phoneSecondary || "+91 97475 06015",
  phones: [companyData.phone, companyData.phoneSecondary].filter(Boolean),
  whatsapp: companyData.whatsapp || "+91 81369 83928",
  whatsappNumber: companyData.whatsappNumber || "918136983928",
  whatsappDefaultMessage: companyData.whatsappDefaultMessage || "Hello WELTRIQ Team, I would like to enquire about your roofing solutions.",
  workingHours: companyData.workingHours || "Mon – Sat: 8:30 AM – 6:30 PM",
  email: companyData.email || "weltriq@gmail.com",
  website: companyData.website || "www.weltriq.in",
  mapEmbedUrl: companyData.mapEmbedUrl || "",
  mapDirectionsUrl: companyData.mapDirectionsUrl || "https://maps.google.com/?q=Weltriq+Roofing+Palakkad+Kerala",
};
