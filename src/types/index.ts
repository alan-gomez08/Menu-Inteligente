export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  imagePath: string;
  category: string;
  badge?: string;
  isSoldOut?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  id?: string;
  name: string;
  rating?: number;
  text?: string;
  imagePath?: string;
}

export interface Palette {
  fondoPrincipal: string;
  fondoSecundario: string;
  fondoCajas: string;
  colorPrimario: string;
  fondoBoton: string;
  textoBoton: string;
  textoPrimario: string;
  textoSecundario: string;
}

export interface DeliveryZone {
  name: string;
  price: number;
}

export interface ClientData {
  templateId?: string;
  businessName: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
  identidad?: {
    colorPrincipal?: string;
    logo?: string;
    logoSplash?: string;
    logoNavbar?: string;
    [key: string]: any;
  };
  config?: {
    ecommerceMode?: boolean;
    mostrarPrecios?: boolean;
    deliveryMethod?: 'delivery' | 'takeaway' | 'ambos' | string;
    deliveryZones?: (string | DeliveryZone)[];
    [key: string]: any;
  };
  nav?: {
    links?: { name: string; href: string }[];
    buttonText?: string;
  };
  hero: {
    title: string;
    titleTablet?: string;
    subtitle: string;
    buttonText: string;
    buttonType?: string;
    buttonUrl?: string;
    images: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    buttonText?: string;
    buttonType?: string;
    buttonUrl?: string;
    images: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  };
  menu: {
    title: string;
    categories: string[];
    items: MenuItem[];
  };
  stats: {
    title: string;
    items: StatItem[];
  };
  events?: {
    title: string;
    description: string;
    buttonText: string;
    buttonType?: string;
    buttonUrl?: string;
    images?: string[];
  };
  testimonials: {
    title: string;
    items: TestimonialItem[];
  };
  location: {
    title: string;
    description: string;
    buttonText: string;
    buttonType?: string;
    buttonUrl?: string;
    mapEmbedUrl: string;
  };
  contact: {
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
}