import { MapEntity } from '@/domain/entities/MapEntity';
import Papa from 'papaparse';

export class DisplayMap {
  constructor(private mapEntity: MapEntity) {}

  loadMarkersFromCSV(csvFilePath: string, onMarkersLoaded?: () => void): void {
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        this.mapEntity.markers = this.parseMarkers(results.data);
        onMarkersLoaded?.();
      },
    });
  }

  private parseMarkers(data: any[]): MapEntity['markers'] {
    return data.map((row) => ({
      longitude: this.parseCoordinate(row.longitude),
      latitude: this.parseCoordinate(row.latitude),
      species: row.species,
      H5N1: this.parseValue(row.H5N1),
      H5N2: this.parseValue(row.H5N2),
      H7N2: this.parseValue(row.H7N2),
      H7N8: this.parseValue(row.H7N8),
    }));
  }

  private parseCoordinate(coordinate: string): number {
    return parseFloat(coordinate);
  }

  private parseValue(value: string): number {
    return parseFloat(value) || 0;
  }

  getMapData(): MapEntity {
    return this.mapEntity;
  }
}


