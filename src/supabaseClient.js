import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const DEFAULT_CONTENT = {
  brand: {
    name: "AOK",
    nameSecond: "METAL CO.",
    logoUrl: null,
  },
  colors: {
    primary: "#dc2626",
    primaryHover: "#b91c1c",
    secondary: "#111113",
    accent: "#ffffff",
  },
  hero: {
    image:
      "https://images.pexels.com/photos/36397935/pexels-photo-36397935.jpeg?auto=compress&cs=tinysrgb&w=1600",
    eyebrow: "Industrial Metal Suppliers",
    titleLine1: "Steel, Aluminum & Copper",
    titleLine2: "Delivered to Your Door",
    description:
      "For over three decades, AOK Metal Co. has supplied fabricators, builders, and manufacturers with premium-grade metal — cut to spec, delivered on time, every time.",
    button1Text: "Request a Quote",
    button2Text: "About Us",
    stats: [
      { value: "30+", label: "Years in Business" },
      { value: "500+", label: "Active Clients" },
      { value: "24h", label: "Delivery Window" },
    ],
  },
  about: {
    image:
      "https://images.pexels.com/photos/37598393/pexels-photo-37598393.png?auto=compress&cs=tinysrgb&w=1200",
    badge: "Est. 1992",
    badgeLabel: "Family Owned",
    eyebrow: "About AOK",
    title: "Built on Strength,",
    titleAccent: "Forged by Trust",
    paragraph1:
      "AOK Metal Co. started as a single warehouse on the east side of town with a truck and a simple promise: quality metal, fair prices, no excuses. Three decades later we operate a 40,000 sq ft facility, serve hundreds of active clients, and still honor that same promise every single day.",
    paragraph2:
      "Our team knows metal. Whether you need a single sheet of aluminum or a truckload of structural steel, we source it, cut it, and get it to your shop floor — fast.",
    tags: ["ISO 9001 Certified", "Same-Day Pickup"],
    cards: [
      {
        name: "Steel",
        desc: "Hot-rolled, cold-rolled, and galvanized sheet, bar, and tube.",
      },
      {
        name: "Aluminum",
        desc: "Lightweight grades for fabrication, aerospace, and architectural use.",
      },
      {
        name: "Copper",
        desc: "Pure copper rod, sheet, and bar for electrical and plumbing trades.",
      },
      {
        name: "Custom Cutting",
        desc: "Precision plasma and waterjet cutting to your exact specifications.",
      },
    ],
  },
  products: {
    eyebrow: "Our Products",
    title: "Metal Products",
    titleAccent: "for Every Project",
    description:
      "From structural steel to precision-cut alloys, we stock and supply the full range of metal products your project demands.",
    items: [
      {
        name: "TMT Rebars / Iron Rods",
        desc: "High-strength thermo-mechanically treated rebars for concrete reinforcement in buildings, bridges, and dams.",
        image:
          "https://images.pexels.com/photos/46167/iron-rods-reinforcing-bars-rods-steel-bars-46167.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "MS Strips & Pipes",
        desc: "Mild steel strips, tubes, and pipes for structural, plumbing, and industrial fabrication applications.",
        image:
          "https://images.pexels.com/photos/15508178/pexels-photo-15508178.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Wire Rods & Allied",
        desc: "Quality wire rods for fencing, fasteners, nail manufacturing, and wire mesh production.",
        image:
          "https://images.pexels.com/photos/36397790/pexels-photo-36397790.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        name: "Flat Sheets & Plates",
        desc: "Hot-rolled and cold-rolled flat steel sheets and plates in various thicknesses and grades.",
        image:
          "https://images.pexels.com/photos/7790106/pexels-photo-7790106.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  specs: {
    eyebrow: "Technical Specifications",
    title: "TMT Rebar",
    titleAccent: "Size Guide & Specs",
    description:
      "Our TMT rebars are manufactured to international standards. Below are the available sizes, their typical applications, and technical composition data.",
    sizes: [
      { size: "6mm", use: "Used in slabs and stairs as load-bearing members in residential homes." },
      { size: "8mm", use: "Used in slabs and stairs as load-bearing members in residential homes." },
      { size: "10mm", use: "Used in slabs and stairs as load-bearing members in residential homes." },
      { size: "12mm", use: "Used in beams and columns to withstand external loads." },
      { size: "16mm", use: "Used in beams and columns to withstand external loads." },
      { size: "20mm", use: "Used in beams and columns to withstand external loads." },
      { size: "25mm", use: "Used in beams and columns for heavy load-bearing structures." },
      { size: "32mm", use: "Used in complex projects such as dams, bridges, tunnels, and airports." },
      { size: "40mm", use: "Used in complex projects such as dams, bridges, tunnels, and airports." },
    ],
    chemical: [
      { property: "Standard", value: "BS4449 500B" },
      { property: "% Carbon", value: "0.24 Max" },
      { property: "% Silicon", value: "0.35 Max" },
      { property: "% Manganese", value: "0.50 Min" },
      { property: "% Sulphur", value: "0.05 Max" },
      { property: "% Phosphorus", value: "0.055 Max" },
      { property: "Sulphur + Phosphorus", value: "0.100 Max" },
      { property: "Carbon Equivalent", value: "0.50 Max" },
    ],
    mechanical: [
      { property: "Yield Stress (N/mm²)", value: "500 Min" },
      { property: "Tensile Strength (N/mm²)", value: "575 Min" },
      { property: "% Elongation (at fracture)", value: "13.5% Min" },
      { property: "Weight Tolerance %", value: "As per Standard" },
    ],
  },
  certifications: {
    eyebrow: "Certified Excellence",
    title: "Quality You",
    titleAccent: "Can Trust",
    description:
      "Our products meet the highest national and international standards for quality and safety.",
    badges: [
      { label: "ISO 9001", desc: "Certified Quality Management" },
      { label: "SON", desc: "Standards Organisation of Nigeria Approved" },
      { label: "MAN", desc: "Manufacturers Association Member" },
    ],
  },
  clients: {
    eyebrow: "Our Clients",
    title: "Trusted by",
    titleAccent: "Industry Leaders",
    description:
      "We have supplied metal products to construction firms, fabricators, and manufacturers for decades.",
    logos: [],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What Our",
    titleAccent: "Customers Say",
    items: [
      {
        name: "Wanpona Nig. Ltd.",
        location: "Nigeria",
        rating: 5,
        text: "They provide cost-effective quality products, clubbed with innovative marketing initiatives. It helps my business to grow.",
      },
      {
        name: "Sana Global Projects",
        location: "Nigeria",
        rating: 5,
        text: "Not only do they provide international quality iron rods, but also products with remarkable strength. Their level of service is truly exceptional.",
      },
      {
        name: "Construction Engineer",
        location: "Lagos",
        rating: 5,
        text: "Their TMT rebars have consistently been the top choice for builders and civil engineers. Unmatched quality and reliability — the benchmark for excellence.",
      },
    ],
  },
  whatsapp: {
    phoneNumber: "08075071693",
    message: "Hello, I'd like to enquire about your metal products.",
  },
  contact: {
    eyebrow: "Get in Touch",
    title: "Request a Quote",
    description:
      "Tell us what you need — grade, dimensions, quantity — and we will get back to you within one business day with a competitive quote.",
    phone: "08075071693",
    email: "samsonadeoba17@gmail.com",
    address: "1842 Foundry Road, Eastgate Industrial Park",
    hours: "Mon–Fri 6:00 AM – 5:00 PM · Sat 7:00 AM – 12:00 PM",
    buttonText: "Send Request",
    backgroundColor: "#111113",
    receiveEmail: "samsonadeoba17@gmail.com",
  },
  footer: {
    description: "Premium industrial metal suppliers. Family owned since 1992.",
    copyright: "AOK Metal Co. All rights reserved.",
  },
};
