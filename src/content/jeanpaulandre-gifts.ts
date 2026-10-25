// Lista de regalos del baby shower de Jean Paul André. Es un borrador para ir refinando: se
// puede editar aquí y publicar (npm run deploy), sin tocar la base de datos.
//
// - `id` identifica el regalo en lo que eligió cada invitado (tabla gift_picks de D1): no lo
//   cambies si alguien ya lo eligió. Para renombrar un regalo, cambia solo `name`.
// - `max` son las unidades que se pueden apartar entre todos.
// - `tag`: "indispensable" o "favorito" (opcional).
// - Si quitas un regalo que alguien ya eligió, en el admin aparece como "fuera de la lista".
//
// La lee el Worker (worker/babyshower.ts), que le suma lo ya elegido y la manda a la invitación.

export type Gift = { id: string; name: string; url: string; max: number; tag?: "indispensable" | "favorito" };
export type GiftCategory = { category: string; gifts: Gift[] };

export const GIFT_LIST: GiftCategory[] = [
  {
    category: "Higiene y pañales",
    gifts: [
      {
        id: "panales-talla-p-paquete",
        name: "Pañales talla P (paquete)",
        url: "https://www.tottus.com.pe/tottus-pe/lista/CATG16073/Bebes-y-Ninos",
        max: 2,
        tag: "indispensable",
      },
      {
        id: "panales-talla-m-paquete",
        name: "Pañales talla M (paquete)",
        url: "https://www.tottus.com.pe/tottus-pe/lista/CATG16073/Bebes-y-Ninos",
        max: 3,
        tag: "indispensable",
      },
      {
        id: "panales-talla-g-paquete",
        name: "Pañales talla G (paquete)",
        url: "https://www.tottus.com.pe/tottus-pe/lista/CATG16073/Bebes-y-Ninos",
        max: 2,
      },
      {
        id: "toallitas-humedas",
        name: "Toallitas húmedas",
        url: "https://www.tottus.com.pe/tottus-pe/lista/CATG16073/Bebes-y-Ninos",
        max: 3,
        tag: "indispensable",
      },
      {
        id: "crema-para-escaldaduras",
        name: "Crema para escaldaduras",
        url: "https://www.babyplaza.com.pe/categoria/salud-del-bebe",
        max: 2,
        tag: "indispensable",
      },
      {
        id: "jabon-liquido-para-bebe",
        name: "Jabón líquido para bebé",
        url: "https://www.tottus.com.pe/tottus-pe/lista/CATG16073/Bebes-y-Ninos",
        max: 1,
      },
      {
        id: "shampoo-para-bebe",
        name: "Shampoo para bebé",
        url: "https://www.tottus.com.pe/tottus-pe/lista/CATG16073/Bebes-y-Ninos",
        max: 1,
      },
      {
        id: "kit-de-higiene-para-bebe",
        name: "Kit de higiene para bebé",
        url: "https://protegetubebe.pe/",
        max: 1,
        tag: "favorito",
      },
      {
        id: "termometro-para-bebe",
        name: "Termómetro para bebé",
        url: "https://babyology.com.pe/product-category/bano-y-cuidado/termometros/",
        max: 1,
        tag: "indispensable",
      },
      { id: "set-de-manicure-para-bebe", name: "Set de manicure para bebé", url: "https://protegetubebe.pe/", max: 1 },
      {
        id: "banera-con-termometro-y-cojin",
        name: "Bañera con termómetro y cojín",
        url: "https://www.tottus.com.pe/tottus-pe/articulo/152258486/banera-para-bebe-con-termometro-y-cojin/152258488",
        max: 1,
        tag: "favorito",
      },
      {
        id: "toalla-de-bano-para-bebe",
        name: "Toalla de baño para bebé",
        url: "https://buypal.com.pe/linea/babypal",
        max: 2,
      },
      { id: "cambiador-portatil", name: "Cambiador portátil", url: "https://buypal.com.pe/linea/babypal", max: 1 },
      { id: "organizador-de-panales", name: "Organizador de pañales", url: "https://babyparadisehs.com/", max: 1 },
    ],
  },
  {
    category: "Ropa y accesorios",
    gifts: [
      {
        id: "pack-de-bodies-de-algodon-0-3-meses",
        name: "Pack de bodies de algodón 0-3 meses",
        url: "https://babyology.com.pe/",
        max: 2,
        tag: "indispensable",
      },
      {
        id: "pack-de-bodies-de-algodon-3-6-meses",
        name: "Pack de bodies de algodón 3-6 meses",
        url: "https://babyology.com.pe/",
        max: 2,
      },
      { id: "pijama-enterizo-0-3-meses", name: "Pijama enterizo 0-3 meses", url: "https://babyology.com.pe/", max: 2 },
      {
        id: "pijama-enterizo-3-6-meses",
        name: "Pijama enterizo 3-6 meses",
        url: "https://babyology.com.pe/",
        max: 2,
        tag: "favorito",
      },
      {
        id: "conjunto-de-ropa-para-bebe",
        name: "Conjunto de ropa para bebé",
        url: "https://babyparadisehs.com/",
        max: 2,
      },
      { id: "pack-de-medias-para-bebe", name: "Pack de medias para bebé", url: "https://todobebe.pe/tienda/", max: 2 },
      { id: "gorritos-de-algodon", name: "Gorritos de algodón", url: "https://babyology.com.pe/", max: 1 },
      {
        id: "baberos-de-bebe",
        name: "Baberos de bebé",
        url: "https://babyology.com.pe/product-category/alimentacion/baberos/",
        max: 2,
        tag: "favorito",
      },
      { id: "mantita-de-algodon", name: "Mantita de algodón", url: "https://babyology.com.pe/", max: 2 },
      {
        id: "manta-para-envolver-al-bebe",
        name: "Manta para envolver al bebé",
        url: "https://babyology.com.pe/",
        max: 1,
      },
      { id: "saco-de-dormir-para-bebe", name: "Saco de dormir para bebé", url: "https://babyparadisehs.com/", max: 1 },
    ],
  },
  {
    category: "Lactancia y alimentación",
    gifts: [
      {
        id: "cojin-de-lactancia",
        name: "Cojín de lactancia",
        url: "https://babyology.com.pe/",
        max: 1,
        tag: "favorito",
      },
      {
        id: "extractor-de-leche-manual",
        name: "Extractor de leche manual",
        url: "https://buypal.com.pe/producto/extractor-de-leche-manual-buypal",
        max: 1,
      },
      {
        id: "extractor-de-leche-manos-libres",
        name: "Extractor de leche manos libres",
        url: "https://buypal.com.pe/producto/extractor-my373",
        max: 1,
      },
      {
        id: "bolsas-para-almacenar-leche-materna",
        name: "Bolsas para almacenar leche materna",
        url: "https://buypal.com.pe/linea/babypal",
        max: 2,
      },
      {
        id: "biberon-anticolicos",
        name: "Biberón anticólicos",
        url: "https://babyology.com.pe/product-category/biberones/",
        max: 2,
      },
      {
        id: "esterilizador-de-biberones",
        name: "Esterilizador de biberones",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
        tag: "favorito",
      },
      {
        id: "cepillo-limpiabiberones",
        name: "Cepillo limpiabiberones",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
      },
      { id: "calentador-de-biberones", name: "Calentador de biberones", url: "https://todobebe.pe/tienda/", max: 1 },
      {
        id: "recolector-de-leche-de-silicona",
        name: "Recolector de leche de silicona",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
      },
      {
        id: "set-de-platos-y-cucharitas-para-6-meses",
        name: "Set de platos y cucharitas para 6 meses+",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
      },
      {
        id: "vaso-de-aprendizaje-para-6-meses",
        name: "Vaso de aprendizaje para 6 meses+",
        url: "https://todobebe.pe/tienda/",
        max: 1,
      },
    ],
  },
  {
    category: "Dormitorio y descanso",
    gifts: [
      {
        id: "cuna-o-minicuna",
        name: "Cuna o minicuna",
        url: "https://todobebe.pe/tienda/",
        max: 1,
        tag: "indispensable",
      },
      {
        id: "colchon-firme-para-cuna",
        name: "Colchón firme para cuna",
        url: "https://todobebe.pe/tienda/",
        max: 1,
        tag: "indispensable",
      },
      {
        id: "sabanas-ajustables-para-cuna",
        name: "Sábanas ajustables para cuna",
        url: "https://babyology.com.pe/",
        max: 3,
        tag: "indispensable",
      },
      {
        id: "protector-impermeable-para-colchon",
        name: "Protector impermeable para colchón",
        url: "https://babyology.com.pe/",
        max: 2,
      },
      {
        id: "movil-musical-para-cuna",
        name: "Móvil musical para cuna",
        url: "https://todobebe.pe/tienda/",
        max: 1,
        tag: "favorito",
      },
      { id: "luz-nocturna", name: "Luz nocturna", url: "https://babyparadisehs.com/", max: 1 },
      { id: "organizador-de-ropa", name: "Organizador de ropa", url: "https://babyparadisehs.com/", max: 1 },
      {
        id: "monitor-para-bebe",
        name: "Monitor para bebé",
        url: "https://todobebe.pe/tienda/",
        max: 1,
        tag: "favorito",
      },
    ],
  },
  {
    category: "Paseo y seguridad",
    gifts: [
      {
        id: "silla-de-auto-homologada",
        name: "Silla de auto homologada",
        url: "https://babyparadisehs.com/",
        max: 1,
        tag: "indispensable",
      },
      { id: "coche-para-bebe", name: "Coche para bebé", url: "https://todobebe.pe/tienda/", max: 1, tag: "favorito" },
      {
        id: "bolso-panalero-con-cambiador",
        name: "Bolso pañalero con cambiador",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
      },
      { id: "portabebe-ergonomico", name: "Portabebé ergonómico", url: "https://buypal.com.pe/linea/babypal", max: 1 },
      { id: "canguro-ergonomico", name: "Canguro ergonómico", url: "https://todobebe.pe/tienda/", max: 1 },
      { id: "mosquitero-para-coche", name: "Mosquitero para coche", url: "https://todobebe.pe/tienda/", max: 1 },
      {
        id: "cuna-corral-portatil",
        name: "Cuna corral portátil",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
        tag: "favorito",
      },
    ],
  },
  {
    category: "Estimulación y juguetes",
    gifts: [
      {
        id: "gimnasio-de-actividades",
        name: "Gimnasio de actividades",
        url: "https://todobebe.pe/tienda/",
        max: 1,
        tag: "favorito",
      },
      { id: "manta-de-juegos", name: "Manta de juegos", url: "https://babyparadisehs.com/", max: 1 },
      { id: "sonajero-suave", name: "Sonajero suave", url: "https://todobebe.pe/tienda/", max: 2 },
      { id: "libro-de-tela-para-bebe", name: "Libro de tela para bebé", url: "https://babyparadisehs.com/", max: 1 },
      {
        id: "tarjetas-de-alto-contraste",
        name: "Tarjetas de alto contraste",
        url: "https://babyparadisehs.com/",
        max: 1,
      },
      { id: "mordedor-apto-para-bebes", name: "Mordedor apto para bebés", url: "https://protegetubebe.pe/", max: 2 },
      {
        id: "espejo-irrompible-de-estimulacion",
        name: "Espejo irrompible de estimulación",
        url: "https://todobebe.pe/tienda/",
        max: 1,
      },
      {
        id: "juguete-sensorial-suave",
        name: "Juguete sensorial suave",
        url: "https://babyparadisehs.com/",
        max: 1,
        tag: "favorito",
      },
    ],
  },
  {
    category: "Regalos para mamá",
    gifts: [
      {
        id: "brasier-de-lactancia",
        name: "Brasier de lactancia",
        url: "https://buypal.com.pe/linea/babypal",
        max: 3,
        tag: "favorito",
      },
      { id: "camison-de-lactancia", name: "Camisón de lactancia", url: "https://babyology.com.pe/", max: 1 },
      {
        id: "discos-absorbentes-de-lactancia",
        name: "Discos absorbentes de lactancia",
        url: "https://buypal.com.pe/linea/babypal",
        max: 2,
      },
      {
        id: "kit-de-cuidado-posparto",
        name: "Kit de cuidado posparto",
        url: "https://buypal.com.pe/linea/babypal",
        max: 1,
      },
    ],
  },
];
