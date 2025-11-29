export class BorderService {
  constructor() { }

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

    geoJsonData.features.forEach(feature => {
      console.log('GeoJSON Feature kan_name:', feature.properties?.kan_name);
    });
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
    metricPerCanton: Record<string, { H5N1: number; H5N2: number; H7N2: number; H7N8: number }>
  ): void {
    const paintValues = Object.keys(metricPerCanton).flatMap((canton) => {
      const normalizedCanton = this.normalizeCantonName(canton);
      const totalCases =
        metricPerCanton[canton].H5N1 +
        metricPerCanton[canton].H5N2 +
        metricPerCanton[canton].H7N2 +
        metricPerCanton[canton].H7N8;

      return normalizedCanton
        ? [normalizedCanton, this.getColorForMetric(totalCases)]
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
    }
  }


  private normalizeCantonName(name: any): string | null {
    if (Array.isArray(name) && name.length > 0) {
      name = name[0];
    }

    if (typeof name === "string" && name.trim() !== "") {
      return name
        .toLowerCase()
    } else {
      console.warn(`Invalid or missing canton name: ${name}`);
      return null;
    }
  }


  private getColorForMetric(metric: number): string {
    if (metric > 500) {
      return "rgba(139, 0, 0, 0.3)";
    } else if (metric > 200) {
      return "rgba(255, 0, 0, 0.3)";
    } else if (metric > 100) {
      return "rgba(255, 165, 0, 0.3)";
    } else if (metric > 50) {
      return "rgba(255, 255, 0, 0.3)";
    } else {
      return "rgba(0, 255, 0, 0.3)";
    }
  }
}
