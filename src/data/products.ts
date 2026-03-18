export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Maillots' | 'Survêtements' | 'Accessoires' | 'Lifestyle';
  images: string[];
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Maillot Domicile FC Barcelone 24/25",
    description: "Le nouveau maillot domicile officiel du FC Barcelone pour la saison 2024/2025. Tissu respirant et design emblématique Blaugrana.",
    price: 9500,
    category: "Maillots",
    images: [
      "https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: true
  },
  {
    id: "p2",
    name: "Maillot Extérieur FC Barcelone 24/25",
    description: "Maillot extérieur noir élégant avec détails blaugrana. Parfait pour les matchs à l'extérieur.",
    price: 9500,
    category: "Maillots",
    images: [
      "https://images.unsplash.com/photo-1550882415-8947b11c79e6?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: "p3",
    name: "Survêtement d'entraînement Barça",
    description: "Survêtement complet (veste + pantalon) utilisé par les joueurs lors des entraînements. Confort optimal.",
    price: 14500,
    category: "Survêtements",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Bleu", "Noir"],
    inStock: true,
    featured: true
  },
  {
    id: "p4",
    name: "Casquette FC Barcelone",
    description: "Casquette ajustable avec le logo brodé du FC Barcelone. Protégez-vous du soleil avec style.",
    price: 3500,
    category: "Accessoires",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop"
    ],
    colors: ["Bleu Marine", "Rouge"],
    inStock: true
  },
  {
    id: "p5",
    name: "Écharpe Blaugrana",
    description: "L'écharpe classique des supporters pour chanter au Camp Nou ou devant la télé.",
    price: 2500,
    category: "Accessoires",
    images: [
      "https://images.unsplash.com/photo-1608096281339-551187440478?q=80&w=800&auto=format&fit=crop"
    ],
    inStock: true
  },
  {
    id: "p6",
    name: "Veste Anthem FC Barcelone",
    description: "La veste portée par les joueurs avant le coup d'envoi. Design premium.",
    price: 12000,
    category: "Lifestyle",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "p7",
    name: "Sac à dos FC Barcelone",
    description: "Sac à dos spacieux avec compartiment pour ordinateur portable. Idéal pour l'école ou le travail.",
    price: 6500,
    category: "Accessoires",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop"
    ],
    inStock: true
  },
  {
    id: "p8",
    name: "T-shirt Culer",
    description: "T-shirt en coton doux avec l'inscription 'Culer'. Montrez votre fierté au quotidien.",
    price: 4500,
    category: "Lifestyle",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blanc", "Bleu Marine", "Noir"],
    inStock: true
  }
];
