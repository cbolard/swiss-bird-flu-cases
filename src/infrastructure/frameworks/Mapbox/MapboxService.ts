import mapboxgl from 'mapbox-gl';
import { MapEntity } from '@/domain/entities/MapEntity';

export class MapboxService {
  private map: mapboxgl.Map | null = null;

  initializeMap(container: HTMLDivElement, mapEntity: MapEntity): void {
    if (this.map) return;

    if (!mapboxgl.accessToken) {
      this.setMapboxAccessToken();
    }

    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [mapEntity.longitude, mapEntity.latitude],
      zoom: mapEntity.zoom,
    });

    if (!mapEntity.markers || mapEntity.markers.length === 0) {
      console.error('No markers found in mapEntity!');
      return;
    }

    const geoJsonData = this.createGeoJsonData(mapEntity);

    this.map.on('load', () => {
      this.addClusterLayer(geoJsonData);
      this.addUnclusteredPointsLayer();
      this.addClusterCountLayer();
      this.addLegend();
      this.addPopupOnClick(); 
    });
  }

  private setMapboxAccessToken(): void {
    const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token is missing. Please set VITE_MAPBOX_TOKEN in your environment variables.');
    }
    mapboxgl.accessToken = accessToken;
  }

  private createGeoJsonData(mapEntity: MapEntity): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    return {
      type: 'FeatureCollection',
      features: (mapEntity.markers || []).map(marker => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude],
        },
        properties: {
          species: marker.species,
          H5N1: marker.H5N1,
          H5N2: marker.H5N2,
          H7N2: marker.H7N2,
          H7N8: marker.H7N8,
        },
      })),
    };
  }

  private addClusterLayer(geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>): void {
    if (!this.map) return;

    this.map.addSource('birds', {
      type: 'geojson',
      data: geoJsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'birds',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100, '#f28cb1',
          750, '#f1f075',
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          15,
          100, 20,
          750, 25,
        ],
        'circle-opacity': 0.6,
      },
    });
  }

  private addUnclusteredPointsLayer(): void {
    if (!this.map) return;
  
    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'birds',
      filter: ['!', ['has', 'point_count']],
      paint: {
        // Taille du cercle en fonction du nombre total de cas (tous virus confondus)
        'circle-radius': [
          'interpolate',
          ['linear'],
          [
            '+',
            ['get', 'H5N1'],
            ['get', 'H5N2'],
            ['get', 'H7N2'],
            ['get', 'H7N8']
          ],
          0, 5,   // Moins de cas : petit cercle
          50, 20,  // Beaucoup de cas : grand cercle
          100, 30
        ],
        // Couleur en fonction du type de virus le plus dominant
        'circle-color': [
          'case',
          ['>', ['get', 'H5N1'], ['max', ['get', 'H5N2'], ['get', 'H7N2'], ['get', 'H7N8']]], 'rgba(255, 0, 0, 0.6)',  // Rouge : H5N1 dominant
          ['>', ['get', 'H5N2'], ['max', ['get', 'H5N1'], ['get', 'H7N2'], ['get', 'H7N8']]], 'rgba(255, 165, 0, 0.6)',  // Orange : H5N2 dominant
          ['>', ['get', 'H7N2'], ['max', ['get', 'H5N1'], ['get', 'H5N2'], ['get', 'H7N8']]], 'rgba(255, 255, 0, 0.6)',  // Jaune : H7N2 dominant
          ['>', ['get', 'H7N8'], ['max', ['get', 'H5N1'], ['get', 'H5N2'], ['get', 'H7N2']]], 'rgba(0, 255, 0, 0.6)',  // Vert : H7N8 dominant
          'rgba(0, 0, 0, 0.4)',  // Noir pour aucun cas
        ],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
      },
    });
  }
  
  

  private addClusterCountLayer(): void {
    if (!this.map) return;
  
    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'birds',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',  // Afficher le nombre de points
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-offset': [0, 0],  // Décalage du texte par rapport au centre du cercle
        'text-anchor': 'top',
      },
      paint: {
        'text-color': '#ffffff', 
      },
    });
  }

  private addPopupOnClick(): void {
    if (!this.map) return;
  
    this.map.on('click', 'unclustered-point', (e) => {
      const coordinates: [number, number] = (e.features?.[0]?.geometry as GeoJSON.Point)?.coordinates.slice() as [number, number];
      const properties = e.features?.[0]?.properties;
  
      if (!coordinates || !properties) return;
  
      const totalCases = properties.H5N1 + properties.H5N2 + properties.H7N2 + properties.H7N8;
  
      const popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div style="color: black;">
            <strong>Species:</strong> ${properties.species || 'Unknown'}<br>
            <strong>Total Cases:</strong> ${totalCases}<br>
            <strong>H5N1 Cases:</strong> ${properties.H5N1 || 0}<br>
            <strong>H5N2 Cases:</strong> ${properties.H5N2 || 0}<br>
            <strong>H7N2 Cases:</strong> ${properties.H7N2 || 0}<br>
            <strong>H7N8 Cases:</strong> ${properties.H7N8 || 0}<br>
            <strong>Date:</strong> ${properties.timestamp || 'N/A'}
          </div>
        `)
        .addTo(this.map!);
  
      // Corriger l'accessibilité du bouton de fermeture
      const closeButton = popup.getElement()?.querySelector('.mapboxgl-popup-close-button');
      if (closeButton) {
        closeButton.removeAttribute('aria-hidden'); // Retirer l'attribut aria-hidden
      }
    });
  
    this.map.on('mouseenter', 'unclustered-point', () => {
      this.map!.getCanvas().style.cursor = 'pointer';
    });
  
    this.map.on('mouseleave', 'unclustered-point', () => {
      this.map!.getCanvas().style.cursor = '';
    });
  }
  
  

  private addLegend(): void {
    if (!this.map) return;
  
    const legendContainer = document.createElement('div');
    legendContainer.className = 'map-legend';
    legendContainer.style.position = 'absolute';
    legendContainer.style.bottom = '10px';
    legendContainer.style.left = '10px';
    legendContainer.style.padding = '10px';
    legendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    legendContainer.style.borderRadius = '5px';
    legendContainer.style.fontSize = '12px';
    legendContainer.style.color = '#000';
  
    legendContainer.innerHTML = `
      <strong>Legend</strong><br>
      <span style="background-color: rgba(255, 0, 0, 0.6); width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></span> H5N1<br>
      <span style="background-color: rgba(255, 165, 0, 0.6); width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></span> H5N2<br>
      <span style="background-color: rgba(255, 255, 0, 0.6); width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></span> H7N2<br>
      <span style="background-color: rgba(0, 255, 0, 0.6); width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></span> H7N8<br>
      <span style="background-color: rgba(0, 0, 0, 0.4); width: 12px; height: 12px; display: inline-block; margin-right: 5px;"></span> No Cases<br>
      <br>
      <strong>Circle Size:</strong> Indicates the total number of cases
    `;
  
    document.body.appendChild(legendContainer);
  }
  
  
}
