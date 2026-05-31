export const brandAssetVersion = "2026-05-28-3";

export const withBrandAssetVersion = (path: string) =>
  `${path}?v=${brandAssetVersion}`;

const withVersion = withBrandAssetVersion;

const sharedBrandAssets = {
  masSanMiguelLogo: withVersion("/brand/mas.png"),
  masSMLogo: withVersion("/brand/massm.png"),
  sol: withVersion("/brand/sol.png"),
  orgulloBarrio: withVersion("/brand/orgullo.png"),
  trophyIcon: withVersion("/ico/trofeo.ico"),
  soccerBallIcon: withVersion("/ico/pelota.ico"),
} as const;

export const brandImages = {
  prode: {
    masSanMiguelLogo: sharedBrandAssets.masSanMiguelLogo,
    masSMLogo: sharedBrandAssets.masSMLogo,
    solMark: sharedBrandAssets.sol,
    orgulloBarrioWordmark: sharedBrandAssets.orgulloBarrio,
    pasionMundialWordmark: withVersion("/mas/pasionmundial.png"),
    trophyImage: withVersion("/copa.png"),    
    trophyImageIcon: sharedBrandAssets.trophyIcon,
    soccerBallIcon: sharedBrandAssets.soccerBallIcon,
    fieldBackground: withVersion("/cancha.png"),
    loginHero: withVersion("/prode2-Photoroom.png"),
    loginHeroAlt: withVersion("/prode.png"),
    pattern: withVersion("/brand/pattern.png"),
  },
  institucional: {
    orgulloBarrio: sharedBrandAssets.orgulloBarrio,
    orgulloBarrioAlt: withVersion("/mas/orgullo2.png"),
    solArgentino: sharedBrandAssets.sol,
    masSanMiguelLogo: sharedBrandAssets.masSanMiguelLogo,
    orgulloBarrioPanel: withVersion("/mas/orgullo.png"),
    barrioMundial: withVersion(
      "/mas/2026-06-21 mÃ¡s mundial _ diseÃ±o pagina 29_pages-to-jpg-0001.jpg",
    ),
  },
  mascots: {
    capi: withVersion("/mascotas/capi.png"),
    canada: withVersion("/mascotas/canada.png"),
    condor: withVersion("/mascotas/condor.png"),
    mexico: withVersion("/mascotas/mexico.png"),
    usa: withVersion("/mascotas/usa.png"),
    yaguarete: withVersion("/mascotas/yaguarete.png"),
    loading: withVersion("/mascotas/cargando.png"),
    importar: withVersion("/mascotas/importar.png"),
    selecciones: withVersion("/mascotas/selecciones.png"),
    cargaPrediccion: withVersion("/mascotas/pronosticar.png"),
    tabla: withVersion("/mascotas/posiciones.png"),
    fixture: withVersion("/mascotas/fixture.png"),
    ranking: withVersion("/mascotas/ranking.png"),
    byConfederation: {
      conmebol: withVersion("/mascotas/confederaciones/conmebol.png"),
      concacaf: withVersion("/mascotas/confederaciones/concacaf.png"),
      uefa: withVersion("/mascotas/confederaciones/uefa.png"),
      afc: withVersion("/mascotas/confederaciones/afc.png"),
      caf: withVersion("/mascotas/confederaciones/caf.png"),
      fallback: withVersion("/mascotas/selecciones.png"),
    },
  },
  celebrations: {
    kickoff: withVersion("/mascotas/festejos/comienza.png"),
    halftime: withVersion("/mascotas/festejos/entretiempo.png"),
    final: withVersion("/mascotas/festejos/finalizado.png"),
    goals: [
      withVersion("/mascotas/festejos/gol1.png"),
      withVersion("/mascotas/festejos/gol2.png"),
      withVersion("/mascotas/festejos/gol3.png"),
      withVersion("/mascotas/festejos/gol4.png"),
      withVersion("/mascotas/festejos/gol5.png"),
      withVersion("/mascotas/festejos/gol6.png"),
    ],
  },
} as const;
