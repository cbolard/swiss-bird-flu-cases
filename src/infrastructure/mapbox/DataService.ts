import Papa from "papaparse";
import * as turf from "@turf/turf";
import { Feature, Point, Polygon, MultiPolygon } from "geojson";

interface CsvRow {
  latitude: string;
  longitude: string;
  [key: string]: any;
}

export class DataService {
  private csvData: CsvRow[] = [];
  public cantonGeoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> | null =
    null;
    loadGeoJsonData: any;

  async initializeData(csvUrl: string, geoJsonUrl: string): Promise<void> {
    try {
      await this.loadGeoJsonData(geoJsonUrl);
      await this.loadCSVData(csvUrl);

      if (!this.cantonGeoJson || !this.cantonGeoJson.features) {
        throw new Error("GeoJSON was not loaded correctly.");
      }

      this.associateCoordinatesWithCantons();
    } catch (error) {
      throw new Error("Error initializing data.");
    }
  }

  async loadCSVData(csvUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results: Papa.ParseResult<CsvRow>) => {
          this.csvData = this.filterValidCoordinates(results.data);
          resolve();
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  associateCoordinatesWithCantons(): {
    lat: string;
    lon: string;
    canton: string | null;
    H5N1: number;
    H5N2: number;
    H7N2: number;
    H7N8: number;
  }[] {
    if (!this.cantonGeoJson) {
      return [];
    }
  
    return this.csvData.map((row) => {
      const canton = this.getCantonForRow(row).canton;
  
      return {
        lat: row.latitude,
        lon: row.longitude,
        canton: canton,
        H5N1: parseFloat(row.H5N1) || 0,
        H5N2: parseFloat(row.H5N2) || 0,
        H7N2: parseFloat(row.H7N2) || 0,
        H7N8: parseFloat(row.H7N8) || 0,
      };
    });
  }
  
  private filterValidCoordinates(data: CsvRow[]): CsvRow[] {
    return data.filter((row) =>
      this.areCoordinatesValid(row.latitude, row.longitude)
    );
  }

  private areCoordinatesValid(lat: any, lon: any): boolean {
    return (
      lat !== undefined &&
      lat !== "" &&
      !isNaN(parseFloat(lat)) &&
      lon !== undefined &&
      lon !== "" &&
      !isNaN(parseFloat(lon))
    );
  }

  private getCantonForRow(row: CsvRow): {
    lat: string;
    lon: string;
    canton: string | null;
  } {
    const lat = parseFloat(row.latitude);
    const lon = parseFloat(row.longitude);
    const point = turf.point([lon, lat]);

    const canton = this.findCantonForPoint(point);
    return { lat: row.latitude, lon: row.longitude, canton };
  }

  private findCantonForPoint(point: Feature<Point>): string | null {
    if (!this.cantonGeoJson) {
      return null;
    }

    for (const feature of this.cantonGeoJson.features) {
      if (this.isFeatureAPolygon(feature)) {
        if (
          turf.booleanPointInPolygon(
            point,
            feature as Feature<Polygon | MultiPolygon>
          )
        ) {
          return feature.properties?.kan_name || null;
        }
      }
    }

    return null;
  }

  private isFeatureAPolygon(feature: Feature): boolean {
    return (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    );
  }

  calculateAssociationsPerCanton(
    associations: { lat: string; lon: string; canton: string | null, H5N1: number, H5N2: number, H7N2: number, H7N8: number }[]
  ): Record<string, { H5N1: number; H5N2: number; H7N2: number; H7N8: number }> {
    const metricPerCanton: Record<string, { H5N1: number; H5N2: number; H7N2: number; H7N8: number }> = {};
  
    associations.forEach((association) => {
      if (association.canton) {
        if (!metricPerCanton[association.canton]) {
          metricPerCanton[association.canton] = { H5N1: 0, H5N2: 0, H7N2: 0, H7N8: 0 };
        }
        metricPerCanton[association.canton].H5N1 += association.H5N1 || 0;
        metricPerCanton[association.canton].H5N2 += association.H5N2 || 0;
        metricPerCanton[association.canton].H7N2 += association.H7N2 || 0;
        metricPerCanton[association.canton].H7N8 += association.H7N8 || 0;
      }
    });
  
    return metricPerCanton;
  }
}
