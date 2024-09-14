import { MapEntity } from '@/domain/entities/MapEntity';

export interface IMapboxService {
  initializeMap(container: HTMLDivElement, mapEntity: MapEntity): void;
}
