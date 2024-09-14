import React, { useState, useEffect } from 'react';
import MapComponent from '@/infrastructure/ui/components/MapComponent';
import { MapEntity } from '@/domain/entities/MapEntity';
import { DisplayMap } from '@/application/useCases/Map/DisplayMap';

const Dashboard: React.FC = () => {
  const [mapData, setMapData] = useState<MapEntity | null>(null);

  useEffect(() => {
    const mapEntity: MapEntity = {
      longitude: 8.1833, 
      latitude: 46.8333,
      zoom: 8,   
      markers: [],
    };

    const displayMap = new DisplayMap(mapEntity);

    displayMap.loadMarkersFromCSV('../../../../data/file.csv', () => {
      const loadedMapData = displayMap.getMapData();
      setMapData(loadedMapData);
    });
  }, []);

  return (
    <div className="h-full">
      {mapData && (mapData.markers?.length ?? 0) > 0 ? (
        <MapComponent mapEntity={mapData} />
      ) : (
        <p>Loading map data...</p>
      )}
    </div>
  );
};

export default Dashboard;
