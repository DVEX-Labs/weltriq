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

export const services: ServiceItem[] = [
  { id: "residential", title: "Residential Roofing" },
  { id: "commercial", title: "Commercial Roofing" },
  { id: "industrial", title: "Industrial Roofing" },
  { id: "metal", title: "Metal Roofing" },
  { id: "clay-tile", title: "Clay Tile Roofing" },
  { id: "ceramic", title: "Ceramic Roofing" },
  { id: "upvc", title: "UPVC Roofing" },
  { id: "polycarbonate", title: "Polycarbonate Roofing" },
  { id: "roofing-sheet", title: "Roofing Sheet Installation" },
  { id: "renovation", title: "Roof Renovation" }
];

export const allServices: ServiceData[] = [
  {
    id: "residential",
    number: "01",
    title: "Residential Roofing",
    description: "Durable, weatherproof roofing systems designed for Kerala homes — combining local climate expertise with premium materials.",
    image: "/images/refined/residential_roofing_card_new.png",
  },
  {
    id: "commercial",
    number: "02",
    title: "Commercial Roofing",
    description: "High-performance roofing solutions for offices, retail spaces, and commercial buildings with minimal disruption to operations.",
    image: "/images/refined/commercial_roofing_card_new.jpg",
  },
  {
    id: "industrial",
    number: "03",
    title: "Industrial Roofing",
    description: "Heavy-duty industrial roofing engineered for factories, warehouses, and large-span structures requiring maximum structural integrity.",
    image: "/images/refined/industrial_roofing_card.webp",
  },
  {
    id: "metal",
    number: "04",
    title: "Metal Roofing",
    description: "Long-lasting metal roofing systems offering superior strength, modern aesthetics, and excellent resistance to Kerala's monsoon climate.",
    image: "/images/refined/metal_roofing_card_real.webp",
  },
  {
    id: "clay-tile",
    number: "05",
    title: "Clay Tile Roofing",
    description: "Traditional clay tile roofing that blends heritage craftsmanship with modern installation standards for lasting beauty and performance.",
    image: "/images/refined/clay_tile_roofing_card.webp",
  },
  {
    id: "ceramic",
    number: "06",
    title: "Ceramic Roofing",
    description: "Premium ceramic roofing tiles offering refined aesthetics, natural thermal insulation, and proven durability in tropical conditions.",
    image: "/images/refined/ceramic_roofing_card.webp",
  },
  {
    id: "upvc",
    number: "07",
    title: "UPVC Roofing",
    description: "Lightweight, low-maintenance UPVC roofing solutions ideal for extensions, carports, and covered outdoor spaces.",
    image: "/images/refined/upvc_roofing_card.webp",
  },
  {
    id: "polycarbonate",
    number: "08",
    title: "Polycarbonate Roofing",
    description: "Translucent polycarbonate roofing systems bringing natural light into spaces while maintaining UV protection and weatherproofing.",
    image: "/images/refined/polycarbonate_roofing_card.webp",
  },
  {
    id: "roofing-sheet",
    number: "09",
    title: "Roofing Sheet Installation",
    description: "Professional installation of roofing sheets across residential and commercial applications with precise fitting and weatherproofing.",
    image: "/images/refined/roofing_sheet_installation_card.webp",
  },
  {
    id: "renovation",
    number: "10",
    title: "Roof Renovation",
    description: "Comprehensive roof renovation services that restore, reinforce, and upgrade existing roofing systems to modern performance standards.",
    image: "/images/refined/roof_renovation_card_real.webp",
  },
];

function createServiceSubset(ids: string[]): ServiceData[] {
  return ids
    .map(id => allServices.find(s => s.id === id))
    .filter((s): s is ServiceData => s !== undefined)
    .map((s, index) => ({
      ...s,
      number: String(index + 1).padStart(2, "0")
    }));
}

export const homeServices: ServiceData[] = createServiceSubset([
  "metal",
  "clay-tile",
  "ceramic",
  "upvc",
  "polycarbonate"
]);

export const servicesPageServices: ServiceData[] = createServiceSubset([
  "metal",
  "clay-tile",
  "ceramic",
  "upvc",
  "polycarbonate",
  "roofing-sheet",
  "renovation"
]);
