export interface Marker {
  longitude: number;
  latitude: number;
  species: string;
  H5N1: number;
  H5N2: number;
  H7N2: number;
  H7N8: number;
}

export interface MapEntity {
  longitude: number;
  latitude: number;
  zoom: number;
  markers: Marker[];
}
