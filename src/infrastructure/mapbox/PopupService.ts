import mapboxgl from "mapbox-gl";

export class PopupService {
  private popup: mapboxgl.Popup | null = null;

  constructor() {
    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
  }

  createPopup(map: mapboxgl.Map, coordinates: mapboxgl.LngLatLike, content: string): void {
    if (this.popup) {
      this.popup
        .setLngLat(coordinates)
        .setHTML(content)
        .addTo(map); 
    }
  }

  updatePopupContent(content: string): void {
    if (this.popup) {
      this.popup.setHTML(content);
    }
  }

  movePopup(coordinates: mapboxgl.LngLatLike): void {
    if (this.popup) {
      this.popup.setLngLat(coordinates);
    }
  }

  removePopup(): void {
    this.popup?.remove();
  }

  setPopupStyle(style: string): void {
    if (this.popup) {
      const popupElement = this.popup.getElement();
      if (popupElement) {
        popupElement.setAttribute('style', style);
      }
    }
  }
}
