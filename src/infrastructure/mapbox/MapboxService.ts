// infrastructure/mapbox/MapboxService.ts
import mapboxgl from 'mapbox-gl';
import { MapEntity } from '@/domain/entities/MapEntity';
import { ZoneService } from './ZoneService';

export class MapboxService {
  private static readonly MAPBOX_STYLE_URL = 'mapbox://styles/mapbox/dark-v10';
  private map: mapboxgl.Map | null = null;

  initializeMap(container: HTMLDivElement, mapEntity: MapEntity): void {
    if (!mapboxgl.accessToken) {
      this.setMapboxAccessToken();
    }

    this.createMapInstance(container, mapEntity);

    this.map?.on('load', () => {
      fetch('/data/swiss.geojson')
        .then(response => response.json())
        .then(geoJsonData => {
          this.addZonesToMap(geoJsonData);
        });
    });
  }

  private createMapInstance(container: HTMLDivElement, mapEntity: MapEntity): void {
    this.map = new mapboxgl.Map({
      container,
      style: MapboxService.MAPBOX_STYLE_URL,
      center: [mapEntity.longitude, mapEntity.latitude],
      zoom: mapEntity.zoom,
    });
  }

  private addZonesToMap(geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>): void {
    const zoneService = new ZoneService(this.map!);
    zoneService.addCantonZones(geoJsonData);

    this.addZoneBorders(geoJsonData); // Ajoute les frontières des zones
  }

  private addZoneBorders(geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>): void {
    this.map!.addLayer({
      id: 'zone-borders',
      type: 'line',
      source: {
        type: 'geojson',
        data: geoJsonData,
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 2,
      },
    });
  }

  private setMapboxAccessToken(): void {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is missing.');
    }
    mapboxgl.accessToken = accessToken;
  }
}
