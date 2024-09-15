import { MapInteractionService } from "@/infrastructure/mapbox/MapInteractionService";

export class BorderService {
  private mapInteractionService: MapInteractionService;

  constructor() {
    this.mapInteractionService = new MapInteractionService();
  }

  async loadBorders(
    geoJsonUrl: string
  ): Promise<GeoJSON.FeatureCollection<GeoJSON.Geometry>> {
    const response = await fetch(geoJsonUrl);
    if (!response.ok) {
      throw new Error(`Failed to load GeoJSON data from ${geoJsonUrl}`);
    }
    return await response.json();
  }

  addBordersSource(
    map: mapboxgl.Map,
    sourceId: string,
    geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>
  ): void {
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geoJsonData,
      });
    } else {
      console.warn(`Source '${sourceId}' already exists on the map.`);
    }
  }

  addBordersLayer(
    map: mapboxgl.Map,
    sourceId: string,
    metricPerCanton: Record<string, number>
  ): void {
    const paintValues = Object.keys(metricPerCanton).flatMap((canton) => {
      const normalizedCanton = this.normalizeCantonName(canton);
      return normalizedCanton
        ? [normalizedCanton, this.getColorForMetric(metricPerCanton[canton])]
        : [];
    });

    if (!map.getLayer("canton-borders-fill")) {
      map.addLayer({
        id: "canton-borders-fill",
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": [
            "match",
            ["downcase", ["at", 0, ["get", "kan_name"]]],
            ...paintValues,
            "rgba(204, 204, 204, 0.3)", // Default color
          ],
        },
      });

      map.addLayer({
        id: "canton-borders-line",
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "white",
          "line-width": 1,
          "line-opacity": 0.5,
        },
      });

      this.mapInteractionService.addHoverInteraction(
        map,
        "canton-borders-fill"
      );
      this.mapInteractionService.addClickInteraction(
        map,
        "canton-borders-fill"
      );
    }
  }

  private normalizeCantonName(name: any): string | null {
    if (Array.isArray(name) && name.length > 0) {
      name = name[0];
    }

    if (typeof name === "string" && name.trim() !== "") {
      return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, "");
    } else {
      console.warn(`Invalid or missing canton name: ${name}`);
      return null;
    }
  }

  private getColorForMetric(metric: number): string {
    if (metric > 500) {
      return "rgba(139, 0, 0, 0.3)"; // Dark red with 30% opacity (values > 500)
    } else if (metric > 200) {
      return "rgba(255, 0, 0, 0.3)"; // Red with 30% opacity (values between 200 and 500)
    } else if (metric > 100) {
      return "rgba(255, 165, 0, 0.3)"; // Orange with 30% opacity (values between 100 and 200)
    } else if (metric > 50) {
      return "rgba(255, 255, 0, 0.3)"; // Yellow with 30% opacity (values between 50 and 100)
    } else {
      return "rgba(0, 255, 0, 0.3)"; // Green with 30% opacity (values <= 50)
    }
  }
}
