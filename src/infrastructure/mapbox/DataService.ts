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

  async initializeData(csvUrl: string, geoJsonUrl: string): Promise<void> {
    try {
      await this.loadGeoJsonData(geoJsonUrl);
      await this.loadCSVData(csvUrl);

      if (!this.cantonGeoJson || !this.cantonGeoJson.features) {
        throw new Error("Le GeoJSON n'a pas été chargé correctement.");
      }

      this.associateCoordinatesWithCantons();
    } catch (error) {
      throw new Error("Erreur lors de l'initialisation des données.");
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

  async loadGeoJsonData(geoJsonUrl: string): Promise<void> {
    const response = await fetch(geoJsonUrl);
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du GeoJSON (${geoJsonUrl})`);
    }
    this.cantonGeoJson = await response.json();
  }

  associateCoordinatesWithCantons(): {
    lat: string;
    lon: string;
    canton: string | null;
  }[] {
    if (!this.cantonGeoJson) {
      return [];
    }

    return this.csvData.map((row) => this.getCantonForRow(row));
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
    associations: { lat: string; lon: string; canton: string | null }[]
  ): Record<string, number> {
    const metricPerCanton: Record<string, number> = {};

    associations.forEach((association) => {
      if (association.canton) {
        if (!metricPerCanton[association.canton]) {
          metricPerCanton[association.canton] = 0;
        }
        metricPerCanton[association.canton]++;
      }
    });

    return metricPerCanton;
  }
}
