import React, { useEffect, useRef } from 'react';
import { InitializeMap } from '@/application/useCases/Map/InitializeMap'; 
import { MapEntity } from '@/domain/entities/MapEntity';

const Dashboard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapEntity: MapEntity = {
    longitude: 8.1833,
    latitude: 46.8333,
    zoom: 8,
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      const initializeMap = new InitializeMap();
      initializeMap.execute(mapContainerRef.current, mapEntity);
    }
  }, [mapEntity]);

  return <div ref={mapContainerRef} className="map-container" style={{ height: '100vh' }} />;
};

export default Dashboard;
