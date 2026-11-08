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
  { id: "clay-tile", title: "Clay Tile Roofing" },
  { id: "metal", title: "Metal Roofing" },
  { id: "ceramic", title: "Ceramic Roofing" },
  { id: "polycarbonate", title: "Polycarbonate Roofing" },
  { id: "shingles", title: "Shingles Roofing" },
  { id: "upvc", title: "UPVC Roofing" },
  { id: "stone-coated", title: "Stone Coated Roofing" },
  { id: "roofing-sheet", title: "Roofing Sheet Installation" },
  { id: "renovation", title: "Roof Renovation" },
];

export const allServices: ServiceData[] = [
  {
    id: "clay-tile",
    number: "01",
    title: "Clay Tile Roofing",
    description: "Traditional clay tile roofing that blends heritage craftsmanship with modern installation standards for lasting beauty and performance.",
    image: "/images/service_images/clay_tile_roofing.png",
  },
  {
    id: "metal",
    number: "02",
    title: "Metal Roofing",
    description: "Long-lasting metal roofing systems offering superior strength, modern aesthetics, and excellent resistance to Kerala's monsoon climate.",
    image: "/images/service_images/metal_roofing.jpg",
  },
  {
    id: "ceramic",
    number: "03",
    title: "Ceramic Roofing",
    description: "Premium ceramic roofing tiles offering refined aesthetics, natural thermal insulation, and proven durability in tropical conditions.",
    image: "/images/service_images/ceramic_roofing.png",
  },
  {
    id: "polycarbonate",
    number: "04",
    title: "Polycarbonate Roofing",
    description: "Translucent polycarbonate roofing systems bringing natural light into spaces while maintaining UV protection and weatherproofing.",
    image: "/images/service_images/polycarbonate_roofing.jpg",
  },
  {
    id: "shingles",
    number: "05",
    title: "Shingles Roofing",
    description: "Architectural shingles providing dimensional texture, multi-layer waterproofing, and superior wind resistance engineered for tropical roof slopes.",
    image: "/images/service_images/shingles_roofing.jpeg",
  },
  {
    id: "upvc",
    number: "06",
    title: "UPVC Roofing",
    description: "Lightweight, low-maintenance UPVC roofing solutions ideal for extensions, carports, and covered outdoor spaces.",
    image: "/images/service_images/upvc_roofing.jpg",
  },
  {
    id: "stone-coated",
    number: "07",
    title: "Stone Coated Roofing",
    description: "Stone-coated steel roofing combining the structural strength of aluzinc steel with the natural elegance of stone chips for extreme durability.",
    image: "/images/service_images/stone_coated_roofing.png",
  },
  {
    id: "roofing-sheet",
    number: "08",
    title: "Roofing Sheet Installation",
    description: "Professional installation of roofing sheets across residential and commercial applications with precise fitting and weatherproofing.",
    image: "/images/service_images/roofing_sheet_installation.webp",
  },
  {
    id: "renovation",
    number: "09",
    title: "Roof Renovation",
    description: "Comprehensive roof renovation services that restore, reinforce, and upgrade existing roofing systems to modern performance standards.",
    image: "/images/service_images/roof_renovation.webp",
  },
];

function createServiceSubset(ids: string[]): ServiceData[] {
  return ids
    .map((id) => allServices.find((s) => s.id === id))
    .filter((s): s is ServiceData => s !== undefined)
    .map((s, index) => ({
      ...s,
      number: String(index + 1).padStart(2, "0"),
    }));
}

export const homeServices: ServiceData[] = createServiceSubset([
  "clay-tile",
  "metal",
  "ceramic",
  "polycarbonate",
  "shingles",
  "upvc",
]);

export const servicesPageServices: ServiceData[] = createServiceSubset([
  "clay-tile",
  "metal",
  "ceramic",
  "polycarbonate",
  "shingles",
  "upvc",
  "stone-coated",
  "roofing-sheet",
  "renovation",
]);
