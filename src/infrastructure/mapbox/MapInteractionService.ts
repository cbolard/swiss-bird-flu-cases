import { PopupService } from "./PopupService";
import { FluCases } from "@/domain/entities/FluCasesEntity";


export class MapInteractionService {
  private lastCantonName: string | null = null;
  private popupService: PopupService;
  private metricPerCanton: Record<string, FluCases>;

  constructor(metricPerCanton: Record<string, FluCases>) {
    this.popupService = new PopupService();
    this.metricPerCanton = metricPerCanton;
  }

  addHoverInteraction(map: mapboxgl.Map, layerId: string): void {
    map.on("mousemove", layerId, (e) => {
      if (e.features && e.features.length > 0) {
        const properties = e.features[0].properties;
        const currentCantonName = properties?.kan_name?.replace(/[\[\]"]/g, "");

        if (currentCantonName && currentCantonName !== this.lastCantonName) {
          const cantonFluCases = this.metricPerCanton[currentCantonName];

          if (cantonFluCases) {
            const { H5N1, H5N2, H7N2, H7N8 } = cantonFluCases;
            const totalCases = H5N1 + H5N2 + H7N2 + H7N8;

            const content = `
              <div style="text-align: center; margin-bottom:12px">
                <h3 style="margin: 0; font-size: 22px; color: black; font-weight:600;">${currentCantonName}</h3>
                 </div>
                <p style="margin: 5px 0; font-size: 14px; color: black; font-weight:600">Flu cases: ${totalCases}</p>
                <p style="margin: 5px 0; font-size: 14px; color: black;">H5N1 cases: ${H5N1}</p>
                <p style="margin: 5px 0; font-size: 14px; color: black;">H5N2 cases: ${H5N2}</p>
                <p style="margin: 5px 0; font-size: 14px; color: black;">H7N2 cases: ${H7N2}</p>
                <p style="margin: 5px 0; font-size: 14px; color: black;">H7N8 cases: ${H7N8}</p>
             `;

            this.popupService.createPopup(map, e.lngLat, content);
          } else {
            const content = `
              <div style="text-align: center;">
                <h3 style="margin: 0; font-size: 22px; color: black; font-weight:600;">${currentCantonName}</h3>
                <p style="margin: 5px 0; font-size: 14px; color: black;">No flu cases available</p>
              </div>`;

            this.popupService.createPopup(map, e.lngLat, content);
          }

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

