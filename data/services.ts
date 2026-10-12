export interface ServiceItem {
  id: string;
  title: string;
}

export interface ServiceData {
  id: string;
  number: string;
  title: string;
  image: string;
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
    image: "/images/refined/residential_roofing_card_new.png",
  },
  {
    id: "commercial",
    number: "02",
    title: "Commercial Roofing",
    image: "/images/refined/commercial_roofing_card_new.jpg",
  },
  {
    id: "industrial",
    number: "03",
    title: "Industrial Roofing",
    image: "/images/refined/industrial_roofing_card.webp",
  },
  {
    id: "metal",
    number: "04",
    title: "Metal Roofing",
    image: "/images/refined/metal_roofing_card_real.webp",
  },
  {
    id: "clay-tile",
    number: "05",
    title: "Clay Tile Roofing",
    image: "/images/refined/clay_tile_roofing_card.webp",
  },
  {
    id: "ceramic",
    number: "06",
    title: "Ceramic Roofing",
    image: "/images/refined/ceramic_roofing_card.webp",
  },
  {
    id: "upvc",
    number: "07",
    title: "UPVC Roofing",
    image: "/images/refined/upvc_roofing_card.webp",
  },
  {
    id: "polycarbonate",
    number: "08",
    title: "Polycarbonate Roofing",
    image: "/images/refined/polycarbonate_roofing_card.webp",
  },
  {
    id: "roofing-sheet",
    number: "09",
    title: "Roofing Sheet Installation",
    image: "/images/refined/roofing_sheet_installation_card.webp",
  },
  {
    id: "renovation",
    number: "10",
    title: "Roof Renovation",
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
