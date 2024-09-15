import mapboxgl from "mapbox-gl";
import { MapEntity } from "@/domain/entities/MapEntity";
import { BorderService } from '@/infrastructure/mapbox/BorderService';
import { DataService } from '@/infrastructure/mapbox/DataService';
import { MapInteractionService } from '@/infrastructure/mapbox/MapInteractionService';
import { supported } from "@mapbox/mapbox-gl-supported";

export class MapboxService {
  private map: mapboxgl.Map | null = null;
  private borderService: BorderService;
  private dataService: DataService;
  private mapInteractionService: MapInteractionService | null = null;

  constructor() {
    this.borderService = new BorderService();
    this.dataService = new DataService();
  }

  async initializeMap(container: HTMLDivElement, mapEntity: MapEntity): Promise<void> {
    if (!supported()) {
      container.innerHTML = "Your browser does not support WebGL.";
      return;
    }
  
    container.innerHTML = '';
    this.ensureAccessToken();
    this.createMapInstance(container, mapEntity);
  
    this.map?.on('load', async () => {
      try {
        const geoJsonData = await this.borderService.loadBorders('/data/swiss.geojson');
        
        if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
          throw new Error('The GeoJSON for borders could not be loaded.');
        }

        this.borderService.addBordersSource(this.map!, 'canton-borders', geoJsonData);

        this.dataService.cantonGeoJson = geoJsonData;

        await this.dataService.loadCSVData('/data/file.csv');

        const associations = this.dataService.associateCoordinatesWithCantons();
        const metricPerCanton = this.dataService.calculateAssociationsPerCanton(associations);

        if (!metricPerCanton || Object.keys(metricPerCanton).length === 0) {
          throw new Error("The canton metrics are empty or invalid.");
        }

        this.borderService.addBordersLayer(this.map!, 'canton-borders', metricPerCanton);

        console.log('Metrics per canton:', metricPerCanton);

        this.mapInteractionService = new MapInteractionService(metricPerCanton);

        this.mapInteractionService.addHoverInteraction(this.map!, "canton-borders-fill");
        this.mapInteractionService.addClickInteraction(this.map!, "canton-borders-fill");

      } catch (error) {
        console.error('Error initializing the map:', error);
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
