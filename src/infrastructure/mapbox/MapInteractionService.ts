import { PopupService } from "./PopupService"; // Importer le service

export class MapInteractionService {
  private lastCantonName: string | null = null;
  private popupService: PopupService;
  private metricPerCanton: Record<string, number>;

  constructor(metricPerCanton: Record<string, number>) {
    this.popupService = new PopupService();
    this.metricPerCanton = metricPerCanton; // Total des cas par canton
  }

  addHoverInteraction(map: mapboxgl.Map, layerId: string): void {
    map.on("mousemove", layerId, (e) => {
      if (e.features && e.features.length > 0) {
        const properties = e.features[0].properties;
        const currentCantonName = properties?.kan_name?.replace(/[\[\]"]/g, "");

        if (currentCantonName && currentCantonName !== this.lastCantonName) {
          // Récupérer le total des cas pour le canton
          const totalCases = this.metricPerCanton[currentCantonName] || 0;

          const content = `
            <div style="text-align: center;">
              <h3 style="margin: 0; font-size: 22px; color: black; font-weight:600;">${currentCantonName}</h3>
              <p style="margin: 5px 0; font-size: 14px; color: black;">Total cases: ${totalCases}</p>
            </div>`;

          // Créer le popup avec le nom du canton et le nombre total de cas
          this.popupService.createPopup(map, e.lngLat, content);
          this.lastCantonName = currentCantonName;
        }

        this.popupService.movePopup(e.lngLat);
      }
    });

    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
      this.lastCantonName = null;
      this.popupService.removePopup();
    });
  }

  addClickInteraction(map: mapboxgl.Map, layerId: string): void {
    map.on("click", layerId, (e) => {
      e.preventDefault();

      if (e.features && e.features.length > 0) {
        const properties = e.features[0].properties;
        const clickedCantonName = properties?.kan_name?.replace(/[\[\]"]/g, "");

        console.log(`Canton clicked: ${clickedCantonName}`);
      }
    });
  }
}
