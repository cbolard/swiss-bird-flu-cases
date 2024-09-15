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
      const geoJsonData = await this.borderService.loadBorders('/data/swiss.geojson');
      this.borderService.addBordersSource(this.map!, 'canton-borders', geoJsonData);
      this.borderService.addBordersLayer(this.map!, 'canton-borders');

      await this.dataService.loadCSVData('/data/file.csv');

      const metricPerCanton = this.dataService.calculateMetricPerCanton();
      console.log("Metric par canton :", metricPerCanton); // Diagnostique les données

      this.applyCantonColors(metricPerCanton);
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

  private applyCantonColors(metricPerCanton: Record<string, number>): void {
    this.map?.setPaintProperty('canton-borders-fill', 'fill-color', [
      'match',
      ['get', 'name'],
      ...Object.keys(metricPerCanton).flatMap(canton => {
        console.log("Canton traité :", canton, "Metric:", metricPerCanton[canton]);
        return [canton, this.getColorForMetric(metricPerCanton[canton])];
      }),
      '#CCCCCC'
    ]);
  }

  private getColorForMetric(metric: number): string {
    if (metric > 1) {
      return '#FF0000';
    } else if (metric > 0.5) {
      return '#FFA500';
    } else {
      return '#00FF00';
    }
  }
}
