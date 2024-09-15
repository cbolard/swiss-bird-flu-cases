import { PopupService } from "./PopupService"; // Importer le service

export class MapInteractionService {
  private lastCantonName: string | null = null;
  private popupService: PopupService;

  constructor() {
    this.popupService = new PopupService();
  }

  addHoverInteraction(map: mapboxgl.Map, layerId: string): void {
    map.on("mousemove", layerId, (e) => {
      if (e.features && e.features.length > 0) {
        const properties = e.features[0].properties;
        const currentCantonName = properties?.kan_name?.replace(/[\[\]"]/g, "");

        if (currentCantonName && currentCantonName !== this.lastCantonName) {
          const content = `
            <div style="text-align: center;">
              <h3 style="margin: 0; font-size: 22px; color: black; font-weight:600;">${currentCantonName}</h3>
            </div>`;
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
        console.log(`Canton cliqué : ${clickedCantonName}`);
      }
    });
  }
}
