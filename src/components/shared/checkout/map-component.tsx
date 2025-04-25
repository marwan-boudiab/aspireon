'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Skeleton } from '@/components/ui/skeleton';

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, initialLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultLocation = {
    lat: 0,
    lng: 0,
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');

      // Use initialLocation if provided, otherwise use default
      const startLocation = initialLocation || defaultLocation;

      // Initialize map only if it hasn't been initialized yet
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([startLocation.lat, startLocation.lng], 5);

        // Set tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          //   attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);

        // Define custom marker icon
        const customIcon = L.icon({
          iconUrl: '/assets/icons/location.png', // Default Leaflet icon URL
          iconSize: [48, 48], // Size of the icon
          iconAnchor: [24, 48], // Point of the icon that will correspond to marker's location
          popupAnchor: [1, -34], // Position of the popup relative to the icon
          //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Default shadow
          //   shadowSize: [41, 41],
        });

        // Add marker with custom icon at default location
        markerRef.current = L.marker([startLocation.lat, startLocation.lng], {
          draggable: true,
          icon: customIcon,
        }).addTo(mapRef.current);

        // Update the marker state and call the onLocationSelect prop when the marker is dragged
        markerRef.current.on('dragend', () => {
          if (markerRef.current) {
            const { lat, lng } = markerRef.current.getLatLng();
            onLocationSelect({ lat, lng });
          }
        });

        // Handle map clicks
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;

          // Remove existing marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Add new marker
          markerRef.current = L.marker([lat, lng], {
            draggable: true,
            icon: customIcon,
          }).addTo(mapRef.current!);

          // Update location
          onLocationSelect({ lat, lng });

          // Handle new marker drag
          markerRef.current.on('dragend', () => {
            if (markerRef.current) {
              const { lat, lng } = markerRef.current.getLatLng();
              onLocationSelect({ lat, lng });
            }
          });
        });
        
        // Set loading to false once map is ready
        mapRef.current.on('load', () => {
          setIsLoading(false);
        });
        
        // Fallback in case the load event doesn't fire
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array since we manage state with refs

  return (
    <div ref={mapContainerRef} style={{ height: '300px', width: '100%', border: '2px solid #ddd', borderRadius: '1.5rem' }}>
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton className="h-full w-full rounded-[1.5rem]" />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
