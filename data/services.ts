import servicesJson from "./services.json";

export interface ServiceItem {
  id: string;
  title: string;
}

export interface ServiceData {
  id: string;
  number: string;
  title: string;
  image: string;
  description: string;
}

// Dynamically typed from services.json with consecutive number formatting
export const allServices: ServiceData[] = (servicesJson as unknown as ServiceData[]).map((s, index) => ({
  ...s,
  number: s.number || String(index + 1).padStart(2, "0"),
}));

export const services: ServiceItem[] = allServices.map((s) => ({
  id: s.id,
  title: s.title,
}));

function createServiceSubset(ids: string[]): ServiceData[] {
  return ids
    .map((id) => allServices.find((s) => s.id === id))
    .filter((s): s is ServiceData => s !== undefined)
    .map((s, index) => ({
      ...s,
      number: String(index + 1).padStart(2, "0"),
    }));
}

// If allServices has 6 or more, homeServices gets the active services
export const homeServices: ServiceData[] = allServices;

export const servicesPageServices: ServiceData[] = allServices;
