import { MapInteractionService } from '@/infrastructure/mapbox/MapInteractionService';

export class BorderService {
  private mapInteractionService: MapInteractionService;

  constructor() {
    this.mapInteractionService = new MapInteractionService();
  }

  async loadBorders(geoJsonUrl: string): Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry>> {
    const response = await fetch(geoJsonUrl);
    if (!response.ok) {
      throw new Error(`Failed to load GeoJSON data from ${geoJsonUrl}`);
    }
    return await response.json();
  }

  addBordersSource(
    map: mapboxgl.Map,
    sourceId: string,
    geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>
  ): void {
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geoJsonData,
      });
    } else {
      console.warn(`Source '${sourceId}' already exists on the map.`);
    }
  }

  addBordersLayer(map: mapboxgl.Map, sourceId: string): void {
    if (!map.getLayer('canton-borders-line')) {
      map.addLayer({
        id: 'canton-borders-fill',
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': 'rgba(200, 100, 240, 0.4)',
          'fill-outline-color': 'red',
        },
      });

      map.addLayer({
        id: 'canton-borders-line',
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': 'red',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });

      this.mapInteractionService.addHoverInteraction(map, 'canton-borders-fill');
      this.mapInteractionService.addClickInteraction(map, 'canton-borders-fill');
    } else {
      console.warn("La couche 'canton-borders-line' existe déjà.");
    }
  }
}
