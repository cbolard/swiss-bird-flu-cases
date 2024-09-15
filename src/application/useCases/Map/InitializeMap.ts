import { MapEntity } from '@/domain/entities/MapEntity';
import { MapboxService } from '@/infrastructure/mapbox/MapboxService';

export class InitializeMap {
  private mapboxService: MapboxService;

  constructor() {
    this.mapboxService = new MapboxService();
  }

  execute(container: HTMLDivElement, mapEntity: MapEntity): void {
    this.mapboxService.initializeMap(container, mapEntity);
  }
}
