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

  // Initializes data from CSV and GeoJSON files
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

  // Loads CSV data and filters out invalid coordinates
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

  // Loads GeoJSON data from the provided URL
  async loadGeoJsonData(geoJsonUrl: string): Promise<void> {
    const response = await fetch(geoJsonUrl);
    if (!response.ok) {
      throw new Error(`Error loading GeoJSON data from ${geoJsonUrl}`);
    }
    this.cantonGeoJson = await response.json();
  }

  // Associates coordinates from CSV rows with corresponding cantons
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

  // Filters out rows with invalid latitude and longitude values
  private filterValidCoordinates(data: CsvRow[]): CsvRow[] {
    return data.filter((row) =>
      this.areCoordinatesValid(row.latitude, row.longitude)
    );
  }

  // Checks if latitude and longitude are valid
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

  // Maps a CSV row to its corresponding canton based on latitude and longitude
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

  // Finds the canton for a specific geographical point
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

  // Checks if the GeoJSON feature is a Polygon or MultiPolygon
  private isFeatureAPolygon(feature: Feature): boolean {
    return (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    );
  }

  // Calculates the number of associations per canton
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
