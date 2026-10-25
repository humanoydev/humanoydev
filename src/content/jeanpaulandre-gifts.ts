// Lista de regalos del baby shower de Jean Paul André. Es un borrador para ir refinando: se
// puede editar aquí y publicar (npm run deploy), sin tocar la base de datos.
//
// - `id` identifica el regalo en lo que eligió cada invitado (tabla gift_picks de D1): no lo
//   cambies si alguien ya lo eligió. Para renombrar un regalo, cambia solo `name`.
// - `max` son las unidades que se pueden apartar entre todos.
// - `tag`: "indispensable" o "favorito" (opcional).
// - `covered`: unidades que ya están cubiertas por fuera de la invitación (ya lo tenemos o alguien
//   nos avisó). Cuentan como tomadas: con covered igual a max, el regalo sale "¡Ya está cubierto!".
// - Si quitas un regalo que alguien ya eligió, en el admin aparece como "fuera de la lista".
//
// La lee el Worker (worker/babyshower.ts), que le suma lo ya elegido y la manda a la invitación.

export type Gift = {
  id: string;
  name: string;
  url: string;
  max: number;
  tag?: "indispensable" | "favorito";
  covered?: number;
};
export type GiftCategory = { category: string; gifts: Gift[] };

export const GIFT_LIST: GiftCategory[] = [
  {
    category: "Higiene y pañales",
    gifts: [
      {
        id: "termometro-para-bebe",
        name: "Termómetro para bebé",
        url: "https://todobebe.pe/product/omron-termometro-flexible-digital-mc-343f/",
        max: 1,
        tag: "indispensable",
      },
      {
        id: "set-de-manicure-para-bebe",
        name: "Set de manicure para bebé",
        url: "https://protegetubebe.pe/producto/set-manicure-para-bebe-cortaunas-limas-higiene-infantil-cuidado-infantil/",
        max: 1,
      },
      {
        id: "banera-con-termometro-y-cojin",
        name: "Bañera con termómetro y cojín",
        url: "https://www.tottus.com.pe/tottus-pe/articulo/152258486/banera-para-bebe-con-termometro-y-cojin/152258488",
        max: 1,
        tag: "favorito",
      },
      {
        id: "toalla-de-bano-para-bebe",
        name: "Toalla de baño de algodón para bebé",
        url: "https://babyology.com.pe/product/abu-tiny-toalla-rn-osito/",
        max: 2,
      },
      {
        id: "cambiador-portatil",
        name: "Cambiador portátil",
        url: "https://buypal.com.pe/producto/cambiador-de-panales-color-negro",
        max: 1,
      },
      { id: "organizador-de-panales", name: "Organizador de pañales", url: "https://babyparadisehs.com/", max: 1 },
    ],
  },
  {
    category: "Ropa y accesorios",
    gifts: [
      {
        id: "pack-de-bodies-de-algodon-0-3-meses",
        name: "Pack de bodies de algodón 0-3 meses",
        url: "https://www.falabella.com.pe/falabella-pe/product/21462100/body-pack-x3-unisex-bebe-algodon",
        max: 2,
        tag: "indispensable",
      },
      {
        id: "pack-de-bodies-de-algodon-3-6-meses",
        name: "Pack de bodies de algodón 3-6 meses",
        url: "https://www.falabella.com.pe/falabella-pe/product/21462100/body-pack-x3-unisex-bebe-algodon",
        max: 2,
      },
      {
        id: "pijama-enterizo-0-3-meses",
        name: "Pijama enterizo 0-3 meses",
        url: "https://www.falabella.com.pe/falabella-pe/product/21370266/pijama-bebe-unisex",
        max: 2,
      },
      {
        id: "pijama-enterizo-3-6-meses",
        name: "Pijama enterizo 3-6 meses",
        url: "https://www.falabella.com.pe/falabella-pe/product/21370266/pijama-bebe-unisex",
        max: 2,
        tag: "favorito",
      },
      {
        id: "conjunto-de-ropa-para-bebe",
        name: "Conjunto de ropa para bebé",
        url: "https://www.falabella.com.pe/falabella-pe/product/21461235/conjunto-3-piezas-bebe-nino-algodon",
        max: 2,
      },
      {
        id: "pack-de-medias-para-bebe",
        name: "Pack de medias para bebé",
        url: "https://www.falabella.com.pe/falabella-pe/product/21501632/media-bebe-nino-nia-pack-x3-algodon-carters",
        max: 2,
      },
      {
        id: "gorritos-de-algodon",
        name: "Gorritos de algodón",
        url: "https://www.falabella.com.pe/falabella-pe/product/21500957/gorro-bebe-nino-pack-x2-algodon-carters",
        max: 1,
      },
      {
        id: "baberos-de-bebe",
        name: "Baberos de bebé",
        url: "https://www.falabella.com.pe/falabella-pe/product/21500971/babero-bebe-nino-pack-x4-algodon-carters",
        max: 2,
        tag: "favorito",
      },
      {
        id: "mantita-de-algodon",
        name: "Mantita de algodón",
        url: "https://www.falabella.com.pe/falabella-pe/product/883760157/manta-bebe-algodon-yamp",
        max: 2,
      },
      {
        id: "manta-para-envolver-al-bebe",
        name: "Manta para envolver al bebé",
        url: "https://babyology.com.pe/product/lulujo-manta-de-muselina-de-algodon-koala/",
        max: 1,
      },
      {
        id: "saco-de-dormir-para-bebe",
        name: "Saco de dormir para bebé",
        url: "https://babyology.com.pe/product/saco-de-dormir-invierno-bunny-skyblue-winter-0-a-6-meses/",
        max: 1,
      },
    ],
  },
  {
    category: "Lactancia y alimentación",
    gifts: [
      {
        id: "cojin-de-lactancia",
        name: "Cojín de lactancia",
        url: "https://babyology.com.pe/product/maternelle-almohada-de-lactancia-y-estimulacion-5-en-1-celeste-espacial/",
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
        url: "https://babyology.com.pe/product/lansinoh-bolsa-de-almacenamiento-de-leche-materna-50unid/",
        max: 2,
      },
      {
        id: "biberon-anticolicos",
        name: "Biberón anticólicos",
        url: "https://todobebe.pe/product/tommee-tippee-biberon-anticolicos-avanzado-5oz/",
        max: 2,
      },
      {
        id: "esterilizador-de-biberones",
        name: "Esterilizador de biberones",
        url: "https://babyology.com.pe/product/tommee-tippe-esterilizador-para-microondas/",
        max: 1,
        tag: "favorito",
      },
      {
        id: "cepillo-limpiabiberones",
        name: "Cepillo limpiabiberones",
        url: "https://babyology.com.pe/product/babymoov-cepillo-para-lavar-biberones-2-en-1/",
        max: 1,
      },
      {
        id: "calentador-de-biberones",
        name: "Calentador de biberones",
        url: "https://babyology.com.pe/product/babymoov-calentador-de-biberones/",
        max: 1,
      },
      {
        id: "recolector-de-leche-de-silicona",
        name: "Recolector de leche de silicona",
        url: "https://babyology.com.pe/product/medela-recolector-de-leche-materna-de-silicona/",
        max: 1,
      },
      {
        id: "set-de-platos-y-cucharitas-para-6-meses",
        name: "Set de platos y cucharitas para 6 meses+",
        url: "https://babyology.com.pe/product/tommee-tippee-2bowls-1cuchara/",
        max: 1,
      },
      {
        id: "vaso-de-aprendizaje-para-6-meses",
        name: "Vaso de aprendizaje para 6 meses+",
        url: "https://babyology.com.pe/product/parentise-vasito-de-entrenamiento-150ml-shifting-sand/",
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
        url: "https://www.falabella.com.pe/falabella-pe/product/883093297/cuna-colecho-bebe-golf-con-mosquitero-yamp",
        max: 1,
        tag: "indispensable",
      },
      {
        id: "colchon-firme-para-cuna",
        name: "Colchón firme para cuna",
        url: "https://www.falabella.com.pe/falabella-pe/product/12712872/colchon-baby-royal-azul",
        max: 1,
        tag: "indispensable",
      },
      {
        id: "sabanas-ajustables-para-cuna",
        name: "Sábanas ajustables para cuna",
        url: "https://www.falabella.com.pe/falabella-pe/product/148159454/Sabanas-bajeras-de-cuna-130-x-70-En-algodon",
        max: 3,
        tag: "indispensable",
      },
      {
        id: "protector-impermeable-para-colchon",
        name: "Protector impermeable para colchón",
        url: "https://www.falabella.com.pe/falabella-pe/product/125780439/Protector-De-Colchon-Amoldable-Impermeable-Cuna",
        max: 2,
      },
      {
        id: "movil-musical-para-cuna",
        name: "Móvil musical para cuna",
        url: "https://todobebe.pe/product/fisher-price-movil-musical-loro-3-en-1/",
        max: 1,
        tag: "favorito",
      },
      {
        id: "luz-nocturna",
        name: "Luz nocturna",
        url: "https://www.falabella.com.pe/falabella-pe/product/15757664/luz-nocturna-de-pared-babymoov",
        max: 1,
      },
      {
        id: "organizador-de-ropa",
        name: "Organizador de ropa",
        url: "https://www.falabella.com.pe/falabella-pe/product/133426016/Organizador-Ropa-Plegable-Inspira-X6-Gris-Con-Asas",
        max: 1,
      },
      {
        id: "monitor-para-bebe",
        name: "Monitor para bebé",
        url: "https://www.amazon.com/dp/B0D161PYFW",
        max: 1,
        tag: "favorito",
        covered: 1,
      },
    ],
  },
  {
    category: "Paseo y seguridad",
    gifts: [
      {
        id: "silla-de-auto-homologada",
        name: "Silla de auto homologada",
        url: "https://www.falabella.com.pe/falabella-pe/product/146705518/Silla-de-Auto-Portabebe-Joie-Sprint-Eclipse",
        max: 1,
        tag: "indispensable",
      },
      {
        id: "coche-para-bebe",
        name: "Coche para bebé",
        url: "https://www.falabella.com.pe/falabella-pe/product/prod18290439/Coche-Paseo-Bebe-Trento-Infanti",
        max: 1,
        tag: "favorito",
      },
      {
        id: "bolso-panalero-con-cambiador",
        name: "Bolso pañalero con cambiador",
        url: "https://www.falabella.com.pe/falabella-pe/product/21199627/panalero-together-infanti",
        max: 1,
      },
      {
        id: "portabebe-ergonomico",
        name: "Portabebé ergonómico",
        url: "https://babyology.com.pe/product/aimama-fular-prearmado-color-gris/",
        max: 1,
      },
      {
        id: "canguro-ergonomico",
        name: "Canguro ergonómico",
        url: "https://www.falabella.com.pe/falabella-pe/product/20907846/canguro-ergonomico-4-en-1-plomo-dinosaurio",
        max: 1,
      },
      {
        id: "cuna-corral-portatil",
        name: "Cuna corral portátil",
        url: "https://www.falabella.com.pe/falabella-pe/product/155110878/cuna-corral-5-en-1-portatil-con-mosquitero-y-cambiador",
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
        url: "https://todobebe.pe/product/fisher-price-gimnasio-deluxe-pataditas-musical/",
        max: 1,
        tag: "favorito",
      },
      {
        id: "manta-de-juegos",
        name: "Manta de juegos",
        url: "https://babyology.com.pe/product/parentise-alfombra-gris-little-stars/",
        max: 1,
      },
      {
        id: "sonajero-suave",
        name: "Sonajero suave",
        url: "https://babyology.com.pe/product/lamaze-juguete-de-estimulacion-sensorial-gardenbug-foot-finder-wrist-rattle-set/",
        max: 2,
      },
      {
        id: "libro-de-tela-para-bebe",
        name: "Libro de tela para bebé",
        url: "https://babyology.com.pe/product/parentise-librito-de-tela-sensorial-y-educativo-doggie-green-0meses/",
        max: 1,
      },
      {
        id: "tarjetas-de-alto-contraste",
        name: "Tarjetas de alto contraste",
        url: "https://www.falabella.com.pe/falabella-pe/product/142797496/Tarjetas-en-Alto-contraste-la-Tiendita-de-Ale-Blanco-y-negro-0-a-3-meses",
        max: 1,
      },
      {
        id: "mordedor-apto-para-bebes",
        name: "Mordedor apto para bebés",
        url: "https://todobebe.pe/product/dr-browns-mordedor-de-silicona-conejo-celeste/",
        max: 2,
      },
      {
        id: "espejo-irrompible-de-estimulacion",
        name: "Espejo irrompible de estimulación",
        url: "https://www.falabella.com.pe/falabella-pe/product/158638996/espejo-de-estimulacion-temprana-para-bebes-diseno-mar",
        max: 1,
      },
      {
        id: "juguete-sensorial-suave",
        name: "Juguete sensorial suave",
        url: "https://babyology.com.pe/product/lamaze-juguete-de-estimulacion-sensorial-mariposa-fifi-0-meses-4-anos/",
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
        url: "https://babyology.com.pe/product/momcozy-brasier-de-lactancia-talla-m-color-negro/",
        max: 3,
        tag: "favorito",
      },
      {
        id: "camison-de-lactancia",
        name: "Camisón de lactancia",
        url: "https://www.falabella.com.pe/falabella-pe/product/147051063/CAMISON-MATERNAL-Y-LACTANCIA",
        max: 1,
      },
      {
        id: "discos-absorbentes-de-lactancia",
        name: "Discos absorbentes de lactancia",
        url: "https://tottus.falabella.com.pe/tottus-pe/product/113930684/protector-mamario-neopan-caja-60-und/113930685",
        max: 2,
      },
      {
        id: "kit-de-cuidado-posparto",
        name: "Kit de cuidado posparto",
        url: "https://www.amazon.com/dp/B0CZSD8YZV",
        max: 1,
      },
    ],
  },
];
