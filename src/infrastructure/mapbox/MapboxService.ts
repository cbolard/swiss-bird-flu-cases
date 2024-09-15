import mapboxgl from "mapbox-gl";
import { MapEntity } from "@/domain/entities/MapEntity";
import { BorderService } from '@/infrastructure/mapbox/BorderService';
import { DataService } from '@/infrastructure/mapbox/DataService';
import { supported } from "@mapbox/mapbox-gl-supported";

export class MapboxService {
  private map: mapboxgl.Map | null = null;
  private borderService: BorderService;
  private dataService: DataService;

  constructor() {
    this.borderService = new BorderService();
    this.dataService = new DataService();
  }

  async initializeMap(container: HTMLDivElement, mapEntity: MapEntity): Promise<void> {
    if (!supported()) {
      container.innerHTML = "Votre navigateur ne supporte pas WebGL.";
      return;
    }
  
    container.innerHTML = '';
    this.ensureAccessToken();
    this.createMapInstance(container, mapEntity);
  
    this.map?.on('load', async () => {
      try {
        const geoJsonData = await this.borderService.loadBorders('/data/swiss.geojson');

        geoJsonData.features.forEach(feature => {
          console.log('GeoJSON Feature Properties:', feature.properties?.kan_name);
        });
        
        if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
          throw new Error('Le GeoJSON des frontières n\'a pas pu être chargé.');
        }

        this.borderService.addBordersSource(this.map!, 'canton-borders', geoJsonData);

        this.dataService.cantonGeoJson = geoJsonData;

        await this.dataService.loadCSVData('/data/file.csv');

        const associations = this.dataService.associateCoordinatesWithCantons();
        const metricPerCanton = this.dataService.calculateAssociationsPerCanton(associations);

        if (!metricPerCanton || Object.keys(metricPerCanton).length === 0) {
          throw new Error("Les métriques des cantons sont vides ou non valides.");
        }

        this.borderService.addBordersLayer(this.map!, 'canton-borders', metricPerCanton);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte :', error);
      }
    });
  }

  private ensureAccessToken(): void {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is missing.');
    }
    mapboxgl.accessToken = accessToken;
  }

  private createMapInstance(container: HTMLDivElement, mapEntity: MapEntity): void {
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [mapEntity.longitude, mapEntity.latitude],
      zoom: mapEntity.zoom,
    });
  }
}
