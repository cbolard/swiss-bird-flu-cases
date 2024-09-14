// infrastructure/mapbox/ZoneService.ts
export class ZoneService {
  private readonly ZONE_SOURCE_ID = 'canton-zones';
  private readonly ZONE_LAYER_ID = 'canton-zones-layer';

  constructor(private map: mapboxgl.Map) {}

  addCantonZones(geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>): void {
    // Vérifier si la source existe déjà pour éviter les erreurs
    if (this.map.getSource(this.ZONE_SOURCE_ID)) {
      console.warn(`Source with ID "${this.ZONE_SOURCE_ID}" already exists.`);
      return;
    }

    // Ajouter la source GeoJSON
    this.map.addSource(this.ZONE_SOURCE_ID, {
      type: 'geojson',
      data: geoJsonData,
    });

    // Vérifier si le calque existe déjà pour éviter les doublons
    if (this.map.getLayer(this.ZONE_LAYER_ID)) {
      console.warn(`Layer with ID "${this.ZONE_LAYER_ID}" already exists.`);
      return;
    }

    // Ajouter un calque pour afficher les zones des cantons
    this.map.addLayer({
      id: this.ZONE_LAYER_ID,
      type: 'fill',
      source: this.ZONE_SOURCE_ID,
      paint: {
        // Colorer toutes les zones en bleu par exemple
        'fill-color': '#1E90FF',  // Bleu
        'fill-opacity': 0.5,
        'fill-outline-color': '#000000', // Bordure noire des cantons
      },
    });
  }
}
