import { MapEntity } from '@/domain/entities/MapEntity';
import { IMapboxService } from '@/application/interfaces/IMapboxService';

export class InitializeMapUseCase {
  constructor(private mapboxService: IMapboxService) {}

  execute(container: HTMLDivElement, mapEntity: MapEntity): void {
    this.mapboxService.initializeMap(container, mapEntity);
  }
}