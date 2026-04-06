export const CATEGORY_SEED: Array<{
  name: string;
  slug: string;
  description: string;
  parentSlug?: string;
}> = [
  {
    name: 'Electrónica',
    slug: 'electronica',
    description: 'Celulares, computadores, accesorios y gadgets',
  },
  {
    name: 'Ropa y Moda',
    slug: 'ropa-moda',
    description: 'Ropa, calzado y accesorios para hombre, mujer y niños',
  },
  {
    name: 'Deportes y Aire Libre',
    slug: 'deportes-aire-libre',
    description:
      'Equipos, ropa deportiva y artículos para actividades al aire libre',
  },
  {
    name: 'Hogar y Muebles',
    slug: 'hogar-muebles',
    description:
      'Muebles, decoración, cocina y electrodomésticos para el hogar',
  },
  {
    name: 'Belleza y Cuidado Personal',
    slug: 'belleza-cuidado-personal',
    description: 'Maquillaje, cuidado de la piel, cabello y perfumería',
  },
  {
    name: 'Mercado y Alimentos',
    slug: 'mercado-alimentos',
    description: 'Despensa, bebidas, snacks y productos de la canasta familiar',
  },
  {
    name: 'Celulares y Smartphones',
    slug: 'celulares-smartphones',
    description: 'Celulares Android, iPhone y teléfonos básicos',
    parentSlug: 'electronica',
  },
  {
    name: 'Computadores y Portátiles',
    slug: 'computadores-portatiles',
    description: 'Portátiles, de escritorio y todo en uno',
    parentSlug: 'electronica',
  },
  {
    name: 'Audífonos y Audio',
    slug: 'audifonos-audio',
    description: 'Audífonos inalámbricos, bocinas y equipos de sonido',
    parentSlug: 'electronica',
  },
  {
    name: 'Televisores',
    slug: 'televisores',
    description: 'Smart TV, OLED, QLED y televisores 4K',
    parentSlug: 'electronica',
  },
  {
    name: 'Accesorios Tecnológicos',
    slug: 'accesorios-tecnologicos',
    description: 'Cables, cargadores, fundas y periféricos',
    parentSlug: 'electronica',
  },
  {
    name: 'Ropa para Hombre',
    slug: 'ropa-hombre',
    description: 'Camisetas, pantalones, chaquetas y ropa interior masculina',
    parentSlug: 'ropa-moda',
  },
  {
    name: 'Ropa para Mujer',
    slug: 'ropa-mujer',
    description: 'Vestidos, blusas, pantalones y ropa interior femenina',
    parentSlug: 'ropa-moda',
  },
  {
    name: 'Tenis y Calzado',
    slug: 'tenis-calzado',
    description: 'Tenis deportivos, zapatos casuales y sandalias',
    parentSlug: 'ropa-moda',
  },
  {
    name: 'Fútbol',
    slug: 'futbol',
    description: 'Balones, guayos, uniformes y accesorios de fútbol',
    parentSlug: 'deportes-aire-libre',
  },
  {
    name: 'Gimnasio y Fitness',
    slug: 'gimnasio-fitness',
    description: 'Mancuernas, bandas elásticas, ropa deportiva y suplementos',
    parentSlug: 'deportes-aire-libre',
  },
];
