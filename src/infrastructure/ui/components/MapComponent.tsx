import React, { useRef, useEffect } from 'react';
import { MapboxService } from '@/infrastructure/mapbox/MapboxService';
import { MapEntity } from '@/domain/entities/MapEntity';

interface MapComponentProps {
  mapEntity: MapEntity;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapEntity }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapboxService = useRef<MapboxService | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxService.current) {
      mapboxService.current = new MapboxService();
    }

    mapboxService.current.initializeMap(mapContainer.current, mapEntity);
  }, [mapEntity]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapComponent;
