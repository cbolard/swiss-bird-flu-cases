import { DisplayMap } from '@/application/useCases/Map/DisplayMap';
import { MapEntity } from '@/domain/entities/MapEntity';

describe('DisplayMap Use Case', () => {
  it('should return map data', () => {
    const mapEntity: MapEntity = {
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 12,
    };

    const displayMap = new DisplayMap(mapEntity);
    const mapData = displayMap.getMapData();

    expect(mapData).toEqual(mapEntity);
  });
});