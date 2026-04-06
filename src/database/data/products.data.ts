export interface ProductImageSeed {
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariantSeed {
  name: string;
  sku: string;
  price?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  sku: string;
  stock: number;
  isActive: boolean;
  categorySlug: string;
  brandSlug: string;
  tagSlugs: string[];
  images: ProductImageSeed[];
  variants: ProductVariantSeed[];
}

export const PRODUCT_SEED: ProductSeed[] = [
  {
    name: 'Samsung Galaxy A55 5G',
    slug: 'samsung-galaxy-a55-5g',
    description:
      'El Samsung Galaxy A55 5G llega a Colombia con pantalla Super AMOLED de 6.6", procesador Exynos 1480, cámara principal de 50 MP con OIS y batería de 5.000 mAh con carga rápida de 25W. Compatible con redes 5G de Claro, Movistar y Tigo.',
    basePrice: 1699000,
    sku: 'SAMS-A55-5G',
    stock: 150,
    isActive: true,
    categorySlug: 'celulares-smartphones',
    brandSlug: 'samsung',
    tagSlugs: ['nuevo-ingreso', 'mas-vendido', 'carga-rapida'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
        altText: 'Samsung Galaxy A55 5G — Azul Marino vista frontal',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
        altText: 'Samsung Galaxy A55 5G — cámaras traseras',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: '128 GB — Azul Marino',
        sku: 'SAMS-A55-128-AM',
        price: 1699000,
        stock: 40,
        attributes: { almacenamiento: '128 GB', color: 'Azul Marino' },
      },
      {
        name: '128 GB — Negro Asombroso',
        sku: 'SAMS-A55-128-NA',
        price: 1699000,
        stock: 35,
        attributes: { almacenamiento: '128 GB', color: 'Negro Asombroso' },
      },
      {
        name: '256 GB — Azul Marino',
        sku: 'SAMS-A55-256-AM',
        price: 1899000,
        stock: 40,
        attributes: { almacenamiento: '256 GB', color: 'Azul Marino' },
      },
      {
        name: '256 GB — Lila Increíble',
        sku: 'SAMS-A55-256-LI',
        price: 1899000,
        stock: 35,
        attributes: { almacenamiento: '256 GB', color: 'Lila Increíble' },
      },
    ],
  },
  {
    name: 'Motorola Edge 50 Pro',
    slug: 'motorola-edge-50-pro',
    description:
      'Motorola Edge 50 Pro trae a Colombia pantalla pOLED de 6.7" a 144 Hz, Snapdragon 7 Gen 3, cámara de 50 MP con telefoto 10x, y carga inalámbrica de 15W. Diseño vegan leather disponible en Almacenes Éxito y Falabella.',
    basePrice: 2199000,
    sku: 'MOTO-EDGE50PRO',
    stock: 80,
    isActive: true,
    categorySlug: 'celulares-smartphones',
    brandSlug: 'motorola',
    tagSlugs: ['nuevo-ingreso', 'inalambrico', 'carga-rapida'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        altText: 'Motorola Edge 50 Pro — Negro Madera vista frontal',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
        altText: 'Motorola Edge 50 Pro — detalle cámara trasera',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: '256 GB — Negro Madera',
        sku: 'MOTO-E50P-256-NM',
        price: 2199000,
        stock: 30,
        attributes: { almacenamiento: '256 GB', color: 'Negro Madera' },
      },
      {
        name: '256 GB — Azul Zafiro',
        sku: 'MOTO-E50P-256-AZ',
        price: 2199000,
        stock: 25,
        attributes: { almacenamiento: '256 GB', color: 'Azul Zafiro' },
      },
      {
        name: '512 GB — Negro Madera',
        sku: 'MOTO-E50P-512-NM',
        price: 2499000,
        stock: 25,
        attributes: { almacenamiento: '512 GB', color: 'Negro Madera' },
      },
    ],
  },
  {
    name: 'iPhone 15 128 GB',
    slug: 'iphone-15-128gb',
    description:
      'El iPhone 15 con chip A16 Bionic, cámara principal de 48 MP con zoom óptico 2x, Dynamic Island y conector USB‑C llega a Colombia. Disponible en iShop, Claro, Movistar y Tigo con planes de financiación a 36 meses.',
    basePrice: 3999000,
    sku: 'APPL-IP15-128',
    stock: 90,
    isActive: true,
    categorySlug: 'celulares-smartphones',
    brandSlug: 'apple',
    tagSlugs: ['premium', 'mas-vendido', 'carga-rapida'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        altText: 'iPhone 15 — Negro vista frontal Dynamic Island',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1695048065856-1fd1a2e74ee4?w=800&q=80',
        altText: 'iPhone 15 — conector USB-C detalle',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: '128 GB — Negro',
        sku: 'APPL-IP15-128-NK',
        price: 3999000,
        stock: 25,
        attributes: { almacenamiento: '128 GB', color: 'Negro' },
      },
      {
        name: '128 GB — Rosa',
        sku: 'APPL-IP15-128-RO',
        price: 3999000,
        stock: 20,
        attributes: { almacenamiento: '128 GB', color: 'Rosa' },
      },
      {
        name: '128 GB — Amarillo',
        sku: 'APPL-IP15-128-AM',
        price: 3999000,
        stock: 15,
        attributes: { almacenamiento: '128 GB', color: 'Amarillo' },
      },
      {
        name: '256 GB — Negro',
        sku: 'APPL-IP15-256-NK',
        price: 4499000,
        stock: 20,
        attributes: { almacenamiento: '256 GB', color: 'Negro' },
      },
      {
        name: '256 GB — Rosa',
        sku: 'APPL-IP15-256-RO',
        price: 4499000,
        stock: 10,
        attributes: { almacenamiento: '256 GB', color: 'Rosa' },
      },
    ],
  },
  {
    name: 'Portátil Samsung Galaxy Book4 15.6"',
    slug: 'samsung-galaxy-book4-156',
    description:
      'Portátil ultradelgado con pantalla Full HD de 15.6", procesador Intel Core 5 120U, 16 GB RAM y 512 GB SSD. Batería de hasta 17 horas. Conectividad perfecta con el ecosistema Galaxy. Disponible en Falabella, Alkosto y Ktronix.',
    basePrice: 2899000,
    sku: 'SAMS-GB4-156',
    stock: 45,
    isActive: true,
    categorySlug: 'computadores-portatiles',
    brandSlug: 'samsung',
    tagSlugs: ['nuevo-ingreso', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
        altText: 'Samsung Galaxy Book4 15.6" abierto mostrando pantalla',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
        altText: 'Samsung Galaxy Book4 — teclado retroiluminado detalle',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: '16 GB RAM / 512 GB SSD — Gris Plateado',
        sku: 'SAMS-GB4-16-512-GP',
        price: 2899000,
        stock: 25,
        attributes: {
          ram: '16 GB',
          almacenamiento: '512 GB SSD',
          color: 'Gris Plateado',
        },
      },
      {
        name: '16 GB RAM / 512 GB SSD — Negro Cielo',
        sku: 'SAMS-GB4-16-512-NC',
        price: 2899000,
        stock: 20,
        attributes: {
          ram: '16 GB',
          almacenamiento: '512 GB SSD',
          color: 'Negro Cielo',
        },
      },
    ],
  },
  {
    name: 'Portátil Motorola Moto Book 14"',
    slug: 'motorola-moto-book-14',
    description:
      'Primer portátil de Motorola disponible en Colombia. Pantalla IPS 2.8K a 120 Hz, AMD Ryzen 5 7535U, 16 GB RAM, 512 GB SSD y una batería que dura todo el día. Diseño delgado y ligero de 1.49 kg. Precio exclusivo en Ktronix y Éxito.',
    basePrice: 2499000,
    sku: 'MOTO-BOOK14',
    stock: 30,
    isActive: true,
    categorySlug: 'computadores-portatiles',
    brandSlug: 'motorola',
    tagSlugs: ['nuevo-ingreso'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        altText: 'Motorola Moto Book 14" — gris espacial vista lateral',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '16 GB / 512 GB — Gris Espacial',
        sku: 'MOTO-BOOK14-16-512',
        price: 2499000,
        stock: 30,
        attributes: {
          ram: '16 GB',
          almacenamiento: '512 GB',
          color: 'Gris Espacial',
        },
      },
    ],
  },
  {
    name: 'Samsung Galaxy Buds3 Pro',
    slug: 'samsung-galaxy-buds3-pro',
    description:
      'Audífonos inalámbricos premium con cancelación activa de ruido inteligente, audio de alta resolución 24-bit, ajuste ergonómico con ventilación y hasta 30 horas de batería total. Compatibles con Samsung y dispositivos Android.',
    basePrice: 899000,
    sku: 'SAMS-BUDS3PRO',
    stock: 200,
    isActive: true,
    categorySlug: 'audifonos-audio',
    brandSlug: 'samsung',
    tagSlugs: ['nuevo-ingreso', 'inalambrico', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        altText: 'Samsung Galaxy Buds3 Pro — Blanco sobre fondo blanco',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80',
        altText: 'Samsung Galaxy Buds3 Pro — estuche de carga abierto',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: 'Blanco',
        sku: 'SAMS-BUDS3PRO-WH',
        price: 899000,
        stock: 100,
        attributes: { color: 'Blanco' },
      },
      {
        name: 'Negro',
        sku: 'SAMS-BUDS3PRO-BK',
        price: 899000,
        stock: 100,
        attributes: { color: 'Negro' },
      },
    ],
  },
  {
    name: 'Sony WH-1000XM5 Audífonos Over-Ear',
    slug: 'sony-wh1000xm5',
    description:
      'Los audífonos inalámbricos con la mejor cancelación de ruido de su categoría. 8 micrófonos y 2 procesadores de audio, hasta 30 horas de batería, recarga rápida (3 min = 3 horas), multiconexión y llamadas en alta definición. Disponibles en Media Commerce y Éxito.',
    basePrice: 1299000,
    sku: 'SONY-WH1000XM5',
    stock: 120,
    isActive: true,
    categorySlug: 'audifonos-audio',
    brandSlug: 'sony',
    tagSlugs: ['mas-vendido', 'inalambrico', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
        altText: 'Sony WH-1000XM5 — Negro Medianoche sobre fondo limpio',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        altText: 'Sony WH-1000XM5 — puesto en la oreja vista lateral',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: 'Negro Medianoche',
        sku: 'SONY-WH1000XM5-NK',
        price: 1299000,
        stock: 70,
        attributes: { color: 'Negro Medianoche' },
      },
      {
        name: 'Plata Platino',
        sku: 'SONY-WH1000XM5-PL',
        price: 1299000,
        stock: 50,
        attributes: { color: 'Plata Platino' },
      },
    ],
  },
  {
    name: 'Samsung Neo QLED 4K 55" QN85D',
    slug: 'samsung-neo-qled-4k-55-qn85d',
    description:
      'Smart TV Samsung Neo QLED 4K de 55" con Matrix Mini LED de 8x, procesador NQ4 AI Gen2, Dolby Atmos, HDR10+, Gaming Hub y modo 144 Hz para consolas. Tizen OS con acceso a Netflix, Disney+ y Prime Video. Uno de los TV más vendidos en Colombia 2024.',
    basePrice: 4299000,
    sku: 'SAMS-QLED55-QN85D',
    stock: 35,
    isActive: true,
    categorySlug: 'televisores',
    brandSlug: 'samsung',
    tagSlugs: ['4k-ultra-hd', 'gaming', 'premium', 'mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80',
        altText: 'Samsung Neo QLED 55" QN85D — pantalla encendida sala moderna',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=800&q=80',
        altText: 'Samsung Neo QLED — detalle del panel y biseles delgados',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: '55 pulgadas',
        sku: 'SAMS-QLED-QN85D-55',
        price: 4299000,
        stock: 20,
        attributes: { tamaño: '55"' },
      },
      {
        name: '65 pulgadas',
        sku: 'SAMS-QLED-QN85D-65',
        price: 5999000,
        stock: 15,
        attributes: { tamaño: '65"' },
      },
    ],
  },
  {
    name: 'LG OLED evo 55" C4',
    slug: 'lg-oled-evo-55-c4',
    description:
      'El LG OLED C4 ofrece negros perfectos, colores infinitos y el mejor panel para cine en casa disponible en Colombia. Procesador α9 Gen7 AI, Dolby Vision IQ, Dolby Atmos, 4K 120Hz, compatible con PS5 y Xbox Series X. Disponible en LG Store, Alkosto y Carrefour.',
    basePrice: 6499000,
    sku: 'LG-OLED55-C4',
    stock: 20,
    isActive: true,
    categorySlug: 'televisores',
    brandSlug: 'lg',
    tagSlugs: ['4k-ultra-hd', 'gaming', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&q=80',
        altText: 'LG OLED C4 55" — imagen cinematográfica panel OLED',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '55 pulgadas',
        sku: 'LG-OLEDC4-55',
        price: 6499000,
        stock: 12,
        attributes: { tamaño: '55"' },
      },
      {
        name: '65 pulgadas',
        sku: 'LG-OLEDC4-65',
        price: 8999000,
        stock: 8,
        attributes: { tamaño: '65"' },
      },
    ],
  },
  {
    name: 'Nike Air Max 270 React',
    slug: 'nike-air-max-270-react',
    description:
      'Tenis lifestyle con la unidad de aire más grande de Nike en el talón combinada con espuma React para máxima amortiguación. Ideal para uso diario en ciudad. Disponible en tiendas Nike Colombia, Marathón Sports y Éxito.',
    basePrice: 459000,
    sku: 'NIKE-AM270R',
    stock: 350,
    isActive: true,
    categorySlug: 'tenis-calzado',
    brandSlug: 'nike',
    tagSlugs: ['mas-vendido', 'nuevo-ingreso'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        altText: 'Nike Air Max 270 React — Rojo Negro vista lateral',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
        altText: 'Nike Air Max 270 React — suela con unidad Air visible',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: 'Talla 38 — Negro/Blanco',
        sku: 'NIKE-AM270R-38-NK',
        price: 459000,
        stock: 30,
        attributes: { talla: '38', color: 'Negro/Blanco' },
      },
      {
        name: 'Talla 39 — Negro/Blanco',
        sku: 'NIKE-AM270R-39-NK',
        price: 459000,
        stock: 35,
        attributes: { talla: '39', color: 'Negro/Blanco' },
      },
      {
        name: 'Talla 40 — Negro/Blanco',
        sku: 'NIKE-AM270R-40-NK',
        price: 459000,
        stock: 35,
        attributes: { talla: '40', color: 'Negro/Blanco' },
      },
      {
        name: 'Talla 41 — Negro/Blanco',
        sku: 'NIKE-AM270R-41-NK',
        price: 459000,
        stock: 30,
        attributes: { talla: '41', color: 'Negro/Blanco' },
      },
      {
        name: 'Talla 42 — Negro/Blanco',
        sku: 'NIKE-AM270R-42-NK',
        price: 459000,
        stock: 25,
        attributes: { talla: '42', color: 'Negro/Blanco' },
      },
      {
        name: 'Talla 40 — Rojo Universi.',
        sku: 'NIKE-AM270R-40-RD',
        price: 459000,
        stock: 25,
        attributes: { talla: '40', color: 'Rojo Universidad' },
      },
      {
        name: 'Talla 41 — Rojo Universi.',
        sku: 'NIKE-AM270R-41-RD',
        price: 459000,
        stock: 25,
        attributes: { talla: '41', color: 'Rojo Universidad' },
      },
      {
        name: 'Talla 42 — Rojo Universi.',
        sku: 'NIKE-AM270R-42-RD',
        price: 459000,
        stock: 20,
        attributes: { talla: '42', color: 'Rojo Universidad' },
      },
      {
        name: 'Talla 40 — Blanco Total',
        sku: 'NIKE-AM270R-40-WH',
        price: 459000,
        stock: 20,
        attributes: { talla: '40', color: 'Blanco Total' },
      },
      {
        name: 'Talla 41 — Blanco Total',
        sku: 'NIKE-AM270R-41-WH',
        price: 459000,
        stock: 25,
        attributes: { talla: '41', color: 'Blanco Total' },
      },
    ],
  },
  {
    name: 'Adidas Ultraboost 24',
    slug: 'adidas-ultraboost-24',
    description:
      'El tenis de running más popular de Adidas con tecnología BOOST y LEP (Linear Energy Push) para mayor retorno de energía. Parte superior Primeknit+ tejida en 50% de materiales reciclados. Disponible en tiendas Adidas, Marathón y Alkosto.',
    basePrice: 549000,
    sku: 'ADID-UB24',
    stock: 280,
    isActive: true,
    categorySlug: 'tenis-calzado',
    brandSlug: 'adidas',
    tagSlugs: ['nuevo-ingreso', 'eco-amigable'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
        altText: 'Adidas Ultraboost 24 — Negro Central vista lateral',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&q=80',
        altText: 'Adidas Ultraboost 24 — detalle suela BOOST',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: 'Talla 38 — Negro Central',
        sku: 'ADID-UB24-38-NK',
        price: 549000,
        stock: 25,
        attributes: { talla: '38', color: 'Negro Central' },
      },
      {
        name: 'Talla 39 — Negro Central',
        sku: 'ADID-UB24-39-NK',
        price: 549000,
        stock: 30,
        attributes: { talla: '39', color: 'Negro Central' },
      },
      {
        name: 'Talla 40 — Negro Central',
        sku: 'ADID-UB24-40-NK',
        price: 549000,
        stock: 35,
        attributes: { talla: '40', color: 'Negro Central' },
      },
      {
        name: 'Talla 41 — Negro Central',
        sku: 'ADID-UB24-41-NK',
        price: 549000,
        stock: 30,
        attributes: { talla: '41', color: 'Negro Central' },
      },
      {
        name: 'Talla 40 — Blanco Nube',
        sku: 'ADID-UB24-40-WH',
        price: 549000,
        stock: 25,
        attributes: { talla: '40', color: 'Blanco Nube' },
      },
      {
        name: 'Talla 41 — Blanco Nube',
        sku: 'ADID-UB24-41-WH',
        price: 549000,
        stock: 25,
        attributes: { talla: '41', color: 'Blanco Nube' },
      },
      {
        name: 'Talla 42 — Blanco Nube',
        sku: 'ADID-UB24-42-WH',
        price: 549000,
        stock: 20,
        attributes: { talla: '42', color: 'Blanco Nube' },
      },
    ],
  },
  {
    name: 'Camiseta Nike Dri-FIT de Entrenamiento',
    slug: 'camiseta-nike-dri-fit-entrenamiento',
    description:
      'Camiseta deportiva con tecnología Nike Dri-FIT que aleja la humedad de la piel para mantenerte fresco y seco durante el entrenamiento. Tela ligera de jersey con ajuste holgado. Ideal para gimnasio, fútbol y actividades al aire libre.',
    basePrice: 119000,
    sku: 'NIKE-DFIT-CAM-H',
    stock: 700,
    isActive: true,
    categorySlug: 'ropa-hombre',
    brandSlug: 'nike',
    tagSlugs: ['mas-vendido', 'eco-amigable'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
        altText: 'Camiseta Nike Dri-FIT — Negro hombre frente',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'XS — Negro',
        sku: 'NIKE-DFIT-H-XS-NK',
        price: 119000,
        stock: 50,
        attributes: { talla: 'XS', color: 'Negro' },
      },
      {
        name: 'S  — Negro',
        sku: 'NIKE-DFIT-H-S-NK',
        price: 119000,
        stock: 80,
        attributes: { talla: 'S', color: 'Negro' },
      },
      {
        name: 'M  — Negro',
        sku: 'NIKE-DFIT-H-M-NK',
        price: 119000,
        stock: 100,
        attributes: { talla: 'M', color: 'Negro' },
      },
      {
        name: 'L  — Negro',
        sku: 'NIKE-DFIT-H-L-NK',
        price: 119000,
        stock: 100,
        attributes: { talla: 'L', color: 'Negro' },
      },
      {
        name: 'XL — Negro',
        sku: 'NIKE-DFIT-H-XL-NK',
        price: 119000,
        stock: 80,
        attributes: { talla: 'XL', color: 'Negro' },
      },
      {
        name: 'S  — Blanco',
        sku: 'NIKE-DFIT-H-S-WH',
        price: 119000,
        stock: 50,
        attributes: { talla: 'S', color: 'Blanco' },
      },
      {
        name: 'M  — Blanco',
        sku: 'NIKE-DFIT-H-M-WH',
        price: 119000,
        stock: 70,
        attributes: { talla: 'M', color: 'Blanco' },
      },
      {
        name: 'L  — Blanco',
        sku: 'NIKE-DFIT-H-L-WH',
        price: 119000,
        stock: 70,
        attributes: { talla: 'L', color: 'Blanco' },
      },
    ],
  },
  {
    name: 'Balón Adidas Conext25 FIFA Quality Pro',
    slug: 'balon-adidas-conext25-fifa-quality-pro',
    description:
      'Balón oficial de los torneos de la CONMEBOL y partidos de La Liga BetPlay. Cápsulas de butilo de alta calidad, textura termolaminada de 20 paneles y certificación FIFA Quality Pro. El mismo balón que se usa en los partidos de la Selección Colombia.',
    basePrice: 349000,
    sku: 'ADID-CONEXT25-PRO',
    stock: 200,
    isActive: true,
    categorySlug: 'futbol',
    brandSlug: 'adidas',
    tagSlugs: ['nuevo-ingreso', 'mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800&q=80',
        altText:
          'Balón Adidas Conext25 FIFA Quality Pro — blanco y negro césped',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
        altText: 'Balón Adidas Conext25 — detalle textura termolaminada',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: 'Talla 4 — Blanco/Negro',
        sku: 'ADID-CNX25-T4-BN',
        price: 299000,
        stock: 70,
        attributes: { talla: '4', color: 'Blanco/Negro' },
      },
      {
        name: 'Talla 5 — Blanco/Negro',
        sku: 'ADID-CNX25-T5-BN',
        price: 349000,
        stock: 80,
        attributes: { talla: '5', color: 'Blanco/Negro' },
      },
      {
        name: 'Talla 5 — Amarillo/Negro',
        sku: 'ADID-CNX25-T5-YN',
        price: 349000,
        stock: 50,
        attributes: { talla: '5', color: 'Amarillo/Negro' },
      },
    ],
  },
  {
    name: 'Nevera Haceb Centrales No Frost 356 L',
    slug: 'nevera-haceb-centrales-no-frost-356l',
    description:
      'Nevera No Frost fabricada en Medellín, Colombia. Doble puerta con dispensador de agua, congelador arriba, tecnología inverter para mayor eficiencia energética y garantía de 5 años. La preferida de los colombianos por su durabilidad y servicio técnico nacional.',
    basePrice: 2199000,
    sku: 'HACEB-NF356',
    stock: 40,
    isActive: true,
    categorySlug: 'hogar-muebles',
    brandSlug: 'haceb',
    tagSlugs: ['hecho-colombia', 'mas-vendido', 'eco-amigable'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
        altText:
          'Nevera Haceb Centrales No Frost 356 L — blanca cocina moderna',
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80',
        altText: 'Nevera Haceb — interior con iluminación LED y estantes',
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        name: '356 L — Blanca',
        sku: 'HACEB-NF356-WH',
        price: 2199000,
        stock: 20,
        attributes: { capacidad: '356 L', color: 'Blanca' },
      },
      {
        name: '356 L — Gris Inox',
        sku: 'HACEB-NF356-IX',
        price: 2399000,
        stock: 20,
        attributes: { capacidad: '356 L', color: 'Gris Inox' },
      },
    ],
  },
  {
    name: 'Televisor Challenger 43" Full HD Smart TV',
    slug: 'challenger-43-full-hd-smart-tv',
    description:
      'Smart TV colombiano de 43" con resolución Full HD 1080p, sistema Android TV, acceso a Netflix, YouTube, Prime Video y más de 500.000 aplicaciones. Control por voz con Google Assistant integrado. Garantía y servicio técnico en todo el país.',
    basePrice: 849000,
    sku: 'CHALL-TV43-FHD',
    stock: 60,
    isActive: true,
    categorySlug: 'televisores',
    brandSlug: 'challenger',
    tagSlugs: ['hecho-colombia', 'mas-vendido', 'en-oferta'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800&q=80',
        altText: 'Challenger Smart TV 43" — sala familiar colombiana',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '43 pulgadas Full HD',
        sku: 'CHALL-TV43-FHD-BK',
        price: 849000,
        stock: 40,
        attributes: { tamaño: '43"', resolución: 'Full HD' },
      },
      {
        name: '50 pulgadas 4K',
        sku: 'CHALL-TV50-4K-BK',
        price: 1299000,
        stock: 20,
        attributes: { tamaño: '50"', resolución: '4K UHD' },
      },
    ],
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro 5G',
    slug: 'xiaomi-redmi-note-13-pro-5g',
    description:
      'Smartphone con cámara de 200 MP, pantalla AMOLED 120 Hz, Snapdragon 7s Gen 2 y batería de 5100 mAh.',
    basePrice: 1799000,
    sku: 'XIA-REDMI-N13P',
    stock: 120,
    isActive: true,
    categorySlug: 'celulares-smartphones',
    brandSlug: 'xiaomi',
    tagSlugs: ['mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
        altText: 'Redmi Note 13 Pro frontal',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '256 GB — Negro',
        sku: 'XIA-N13P-256-NK',
        price: 1799000,
        stock: 60,
        attributes: { almacenamiento: '256 GB', color: 'Negro' },
      },
      {
        name: '256 GB — Verde',
        sku: 'XIA-N13P-256-VD',
        price: 1799000,
        stock: 60,
        attributes: { almacenamiento: '256 GB', color: 'Verde' },
      },
    ],
  },

  {
    name: 'Huawei Watch GT 4',
    slug: 'huawei-watch-gt4',
    description:
      'Smartwatch con monitoreo de salud avanzado, GPS y hasta 14 días de batería.',
    basePrice: 899000,
    sku: 'HUA-GT4',
    stock: 100,
    isActive: true,
    categorySlug: 'wearables',
    brandSlug: 'huawei',
    tagSlugs: ['nuevo-ingreso'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80',
        altText: 'Huawei Watch GT4',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Negro',
        sku: 'HUA-GT4-NK',
        price: 899000,
        stock: 50,
        attributes: { color: 'Negro' },
      },
      {
        name: 'Plateado',
        sku: 'HUA-GT4-PL',
        price: 899000,
        stock: 50,
        attributes: { color: 'Plateado' },
      },
    ],
  },

  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description:
      'Reloj inteligente con chip S9, pantalla Always-On Retina y funciones avanzadas de salud.',
    basePrice: 1999000,
    sku: 'APPL-WATCH9',
    stock: 70,
    isActive: true,
    categorySlug: 'wearables',
    brandSlug: 'apple',
    tagSlugs: ['premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80',
        altText: 'Apple Watch Series 9',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '45mm — Negro',
        sku: 'APPL-W9-45-NK',
        price: 1999000,
        stock: 35,
        attributes: { tamaño: '45mm', color: 'Negro' },
      },
      {
        name: '41mm — Blanco',
        sku: 'APPL-W9-41-WH',
        price: 1899000,
        stock: 35,
        attributes: { tamaño: '41mm', color: 'Blanco' },
      },
    ],
  },

  {
    name: 'Tablet Samsung Galaxy Tab S9 FE',
    slug: 'samsung-galaxy-tab-s9-fe',
    description:
      'Tablet con pantalla de 10.9", resistente al agua IP68 y S-Pen incluido.',
    basePrice: 2299000,
    sku: 'SAMS-TABS9FE',
    stock: 60,
    isActive: true,
    categorySlug: 'tablets',
    brandSlug: 'samsung',
    tagSlugs: ['nuevo-ingreso'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80',
        altText: 'Galaxy Tab S9 FE',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '128 GB — Gris',
        sku: 'SAMS-TABS9FE-128-GR',
        price: 2299000,
        stock: 30,
        attributes: { almacenamiento: '128 GB' },
      },
      {
        name: '256 GB — Verde',
        sku: 'SAMS-TABS9FE-256-VD',
        price: 2599000,
        stock: 30,
        attributes: { almacenamiento: '256 GB' },
      },
    ],
  },

  {
    name: 'JBL Flip 6',
    slug: 'jbl-flip-6',
    description:
      'Parlante portátil resistente al agua IP67 con sonido potente y batería de 12 horas.',
    basePrice: 499000,
    sku: 'JBL-FLIP6',
    stock: 150,
    isActive: true,
    categorySlug: 'audifonos-audio',
    brandSlug: 'jbl',
    tagSlugs: ['inalambrico'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80',
        altText: 'JBL Flip 6',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Negro',
        sku: 'JBL-F6-NK',
        price: 499000,
        stock: 75,
        attributes: { color: 'Negro' },
      },
      {
        name: 'Rojo',
        sku: 'JBL-F6-RD',
        price: 499000,
        stock: 75,
        attributes: { color: 'Rojo' },
      },
    ],
  },

  {
    name: 'PlayStation 5 Slim',
    slug: 'playstation-5-slim',
    description:
      'Consola de última generación con SSD ultrarrápido y soporte para juegos en 4K.',
    basePrice: 2599000,
    sku: 'SONY-PS5-SLIM',
    stock: 40,
    isActive: true,
    categorySlug: 'videojuegos',
    brandSlug: 'sony',
    tagSlugs: ['gaming', 'premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
        altText: 'PS5 Slim',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Standard',
        sku: 'PS5-SLIM-ST',
        price: 2599000,
        stock: 20,
        attributes: {},
      },
      {
        name: 'Digital',
        sku: 'PS5-SLIM-DG',
        price: 2299000,
        stock: 20,
        attributes: {},
      },
    ],
  },

  {
    name: 'Xbox Series S',
    slug: 'xbox-series-s',
    description:
      'Consola compacta de nueva generación con soporte para juegos digitales en 1440p.',
    basePrice: 1599000,
    sku: 'XBOX-SS',
    stock: 50,
    isActive: true,
    categorySlug: 'videojuegos',
    brandSlug: 'microsoft',
    tagSlugs: ['gaming'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
        altText: 'Xbox Series S',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '512 GB',
        sku: 'XBOX-SS-512',
        price: 1599000,
        stock: 50,
        attributes: { almacenamiento: '512 GB' },
      },
    ],
  },

  {
    name: 'Mouse Logitech G502 Hero',
    slug: 'logitech-g502-hero',
    description: 'Mouse gamer con sensor HERO 25K y 11 botones programables.',
    basePrice: 249000,
    sku: 'LOG-G502',
    stock: 200,
    isActive: true,
    categorySlug: 'accesorios-computo',
    brandSlug: 'logitech',
    tagSlugs: ['gaming'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
        altText: 'Logitech G502',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Negro',
        sku: 'LOG-G502-NK',
        price: 249000,
        stock: 200,
        attributes: { color: 'Negro' },
      },
    ],
  },

  {
    name: 'Teclado Mecánico Redragon Kumara',
    slug: 'redragon-kumara',
    description:
      'Teclado mecánico compacto con switches Outemu y retroiluminación RGB.',
    basePrice: 179000,
    sku: 'RED-KUMARA',
    stock: 180,
    isActive: true,
    categorySlug: 'accesorios-computo',
    brandSlug: 'redragon',
    tagSlugs: ['gaming'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        altText: 'Teclado mecánico',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'RGB',
        sku: 'RED-KUMARA-RGB',
        price: 179000,
        stock: 180,
        attributes: { iluminación: 'RGB' },
      },
    ],
  },

  {
    name: 'Freidora de Aire Oster 4L',
    slug: 'freidora-aire-oster-4l',
    description: 'Air fryer con capacidad de 4 litros y control digital.',
    basePrice: 399000,
    sku: 'OST-AF4L',
    stock: 90,
    isActive: true,
    categorySlug: 'hogar-muebles',
    brandSlug: 'oster',
    tagSlugs: ['mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
        altText: 'Freidora de aire',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '4L — Negro',
        sku: 'OST-AF4L-NK',
        price: 399000,
        stock: 90,
        attributes: { capacidad: '4L' },
      },
    ],
  },

  {
    name: 'Lavadora LG 18 Kg',
    slug: 'lavadora-lg-18kg',
    description:
      'Lavadora automática con tecnología inverter y sistema Smart Diagnosis.',
    basePrice: 1899000,
    sku: 'LG-LAV18',
    stock: 25,
    isActive: true,
    categorySlug: 'hogar-muebles',
    brandSlug: 'lg',
    tagSlugs: ['premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        altText: 'Lavadora LG',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '18 Kg',
        sku: 'LG-LAV18-ST',
        price: 1899000,
        stock: 25,
        attributes: { capacidad: '18 Kg' },
      },
    ],
  },

  {
    name: 'Bicicleta GW Panther',
    slug: 'bicicleta-gw-panther',
    description: 'Bicicleta MTB con marco en aluminio y frenos de disco.',
    basePrice: 1299000,
    sku: 'GW-PANTHER',
    stock: 40,
    isActive: true,
    categorySlug: 'deportes',
    brandSlug: 'gw',
    tagSlugs: ['mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=800&q=80',
        altText: 'Bicicleta MTB',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Talla M',
        sku: 'GW-PANTHER-M',
        price: 1299000,
        stock: 20,
        attributes: { talla: 'M' },
      },
      {
        name: 'Talla L',
        sku: 'GW-PANTHER-L',
        price: 1299000,
        stock: 20,
        attributes: { talla: 'L' },
      },
    ],
  },

  {
    name: 'Gorra Adidas Originals',
    slug: 'gorra-adidas-originals',
    description: 'Gorra clásica con logo bordado.',
    basePrice: 99000,
    sku: 'ADID-GORRA',
    stock: 300,
    isActive: true,
    categorySlug: 'ropa-hombre',
    brandSlug: 'adidas',
    tagSlugs: ['mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
        altText: 'Gorra Adidas',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Negro',
        sku: 'ADID-GORRA-NK',
        price: 99000,
        stock: 150,
        attributes: { color: 'Negro' },
      },
      {
        name: 'Blanco',
        sku: 'ADID-GORRA-WH',
        price: 99000,
        stock: 150,
        attributes: { color: 'Blanco' },
      },
    ],
  },

  {
    name: 'Perfume Versace Eros 100ml',
    slug: 'versace-eros-100ml',
    description: 'Fragancia masculina intensa y fresca.',
    basePrice: 429000,
    sku: 'VERS-EROS',
    stock: 70,
    isActive: true,
    categorySlug: 'belleza',
    brandSlug: 'versace',
    tagSlugs: ['premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585386959984-a41552231658?w=800&q=80',
        altText: 'Perfume Versace',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '100 ml',
        sku: 'VERS-EROS-100',
        price: 429000,
        stock: 70,
        attributes: { volumen: '100 ml' },
      },
    ],
  },
  {
    name: 'iPhone 15 Pro Max 256 GB',
    slug: 'iphone-15-pro-max-256',
    description: 'iPhone premium con chip A17 Pro, cámara avanzada y titanio.',
    basePrice: 6599000,
    sku: 'APPL-IP15PM-256',
    stock: 40,
    isActive: true,
    categorySlug: 'celulares-smartphones',
    brandSlug: 'apple',
    tagSlugs: ['premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        altText: 'iPhone Pro Max',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '256 GB — Titanio Natural',
        sku: 'IP15PM-256-TN',
        price: 6599000,
        stock: 20,
        attributes: { almacenamiento: '256 GB' },
      },
      {
        name: '512 GB — Titanio Azul',
        sku: 'IP15PM-512-TA',
        price: 7399000,
        stock: 20,
        attributes: { almacenamiento: '512 GB' },
      },
    ],
  },

  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Flagship con IA, cámara 200 MP y S-Pen.',
    basePrice: 5999000,
    sku: 'SAMS-S24U',
    stock: 50,
    isActive: true,
    categorySlug: 'celulares-smartphones',
    brandSlug: 'samsung',
    tagSlugs: ['premium'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
        altText: 'Galaxy S24 Ultra',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '256 GB',
        sku: 'S24U-256',
        price: 5999000,
        stock: 25,
        attributes: {},
      },
      {
        name: '512 GB',
        sku: 'S24U-512',
        price: 6599000,
        stock: 25,
        attributes: {},
      },
    ],
  },
  {
    name: 'Monitor LG UltraGear 27" 144Hz',
    slug: 'lg-ultragear-27-144hz',
    description: 'Monitor gamer Full HD 144Hz con 1ms.',
    basePrice: 1199000,
    sku: 'LG-UG27',
    stock: 70,
    isActive: true,
    categorySlug: 'accesorios-computo',
    brandSlug: 'lg',
    tagSlugs: ['gaming'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
        altText: 'Monitor gamer',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '27 pulgadas',
        sku: 'LG-UG27-144',
        price: 1199000,
        stock: 70,
        attributes: { hz: '144Hz' },
      },
    ],
  },
  {
    name: 'SSD Kingston NV2 1TB',
    slug: 'ssd-kingston-nv2-1tb',
    description: 'SSD NVMe rápido para gaming y trabajo.',
    basePrice: 349000,
    sku: 'KING-NV2-1TB',
    stock: 150,
    isActive: true,
    categorySlug: 'accesorios-computo',
    brandSlug: 'kingston',
    tagSlugs: ['mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
        altText: 'SSD NVMe',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: '1TB',
        sku: 'NV2-1TB',
        price: 349000,
        stock: 150,
        attributes: {},
      },
    ],
  },
  {
    name: 'Microondas Samsung 23L',
    slug: 'microondas-samsung-23l',
    description: 'Microondas digital con múltiples funciones.',
    basePrice: 499000,
    sku: 'SAMS-MIC23',
    stock: 80,
    isActive: true,
    categorySlug: 'hogar-muebles',
    brandSlug: 'samsung',
    tagSlugs: ['mas-vendido'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
        altText: 'Microondas',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      { name: '23L', sku: 'MIC23', price: 499000, stock: 80, attributes: {} },
    ],
  },
  {
    name: 'Licuadora Oster Reversible',
    slug: 'licuadora-oster-reversible',
    description: 'Motor potente con vaso de vidrio.',
    basePrice: 279000,
    sku: 'OST-LIC',
    stock: 100,
    isActive: true,
    categorySlug: 'hogar-muebles',
    brandSlug: 'oster',
    tagSlugs: [],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
        altText: 'Licuadora',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      {
        name: 'Estándar',
        sku: 'LIC-STD',
        price: 279000,
        stock: 100,
        attributes: {},
      },
    ],
  },
  {
    name: 'Sudadera Adidas Essentials',
    slug: 'sudadera-adidas-essentials',
    description: 'Sudadera cómoda para uso diario.',
    basePrice: 199000,
    sku: 'ADID-SUD',
    stock: 200,
    isActive: true,
    categorySlug: 'ropa-hombre',
    brandSlug: 'adidas',
    tagSlugs: [],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520975922284-9e0f79d1a3dc?w=800&q=80',
        altText: 'Sudadera',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      { name: 'M', sku: 'SUD-M', price: 199000, stock: 70, attributes: {} },
      { name: 'L', sku: 'SUD-L', price: 199000, stock: 70, attributes: {} },
    ],
  },
  {
    name: 'Guayos Nike Mercurial',
    slug: 'guayos-nike-mercurial',
    description: 'Guayos profesionales para fútbol.',
    basePrice: 599000,
    sku: 'NIKE-MERC',
    stock: 120,
    isActive: true,
    categorySlug: 'futbol',
    brandSlug: 'nike',
    tagSlugs: ['gaming'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80',
        altText: 'Guayos',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    variants: [
      { name: '40', sku: 'MERC-40', price: 599000, stock: 40, attributes: {} },
      { name: '41', sku: 'MERC-41', price: 599000, stock: 40, attributes: {} },
    ],
  },
];
