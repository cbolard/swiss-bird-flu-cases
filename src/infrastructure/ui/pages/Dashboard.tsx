import React, { useEffect, useRef, useState } from 'react';
import { InitializeMap } from '@/application/useCases/Map/InitializeMap';
import { MapEntity } from '@/domain/entities/MapEntity';
import LoadingOverlay from '@/infrastructure/ui/components/LoadingOverlay';

const Dashboard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapEntity: MapEntity = {
    longitude: 8.1833,
    latitude: 46.8333,
    zoom: 8,
  };

  useEffect(() => {
    const init = async () => {
      if (mapContainerRef.current) {
        const initializeMap = new InitializeMap();
        try {
          await initializeMap.execute(mapContainerRef.current, mapEntity);
        } catch (error) {
          console.error("Failed to initialize map:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    init();
  }, []); // Empty dependency array to run only once

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div ref={mapContainerRef} className="map-container" style={{ height: '100vh' }} />
    </>
  );
};

export default Dashboard;
