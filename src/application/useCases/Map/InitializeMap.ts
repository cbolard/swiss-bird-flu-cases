import { MapEntity } from '@/domain/entities/MapEntity';
import { MapboxService } from '@/infrastructure/mapbox/MapboxService';

export class InitializeMap {
  private mapboxService: MapboxService;

  constructor() {
    this.mapboxService = new MapboxService();
  }

  async execute(container: HTMLDivElement, mapEntity: MapEntity): Promise<void> {
    await this.mapboxService.initializeMap(container, mapEntity);
  }
}
