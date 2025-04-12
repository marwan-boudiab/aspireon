'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, initialLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const defaultLocation = {
    lat: 33.66648961047091,
    lng: 35.59977149910993,
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');

      // Use initialLocation if provided, otherwise use default
      const startLocation = initialLocation || defaultLocation;

      // Initialize map only if it hasn't been initialized yet
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([startLocation.lat, startLocation.lng], 13);

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
      Loading map...
    </div>
  );
};

export default MapComponent;

// 'use client'; // Ensure this runs only on the client

// import React, { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';

// interface MapComponentProps {
//   onLocationSelect: (location: { lat: number; lng: number }) => void;
// }

// const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const [marker, setMarker] = useState<L.Marker | null>(null); // Track the marker state

//   useEffect(() => {
//     if (typeof window === 'undefined') return; // Ensure this runs only in the browser

//     if (mapContainerRef.current) {
//       import('leaflet').then((L) => {
//         // Initialize map
//         const map = L.map(mapContainerRef.current as HTMLElement).setView([37.7749, -122.4194], 13); // Default to

//         // Set tile layer
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; OpenStreetMap contributors',
//         }).addTo(map);

//         // Define custom marker icon (you can replace this with a custom URL to an image)
//         const customIcon = L.icon({
//           iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default Leaflet icon URL
//           iconSize: [25, 41], // Size of the icon
//           iconAnchor: [12, 41], // Point of the icon that will correspond to marker's location
//           popupAnchor: [1, -34], // Position of the popup relative to the icon
//           //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Default shadow
//           //   shadowSize: [41, 41],
//         });

//         // Add marker with custom icon at default location
//         const initialMarker = L.marker([37.7749, -122.4194], { draggable: true, icon: customIcon }).addTo(map);

//         // Update the marker state and call the onLocationSelect prop when the marker is dragged
//         initialMarker.on('dragend', () => {
//           const { lat, lng } = initialMarker.getLatLng();
//           onLocationSelect({ lat, lng });
//         });

//         // Listen for map clicks to add a marker at the clicked position
//         map.on('click', (e) => {
//           const { lat, lng } = e.latlng;
//           // Remove existing marker if any
//           if (marker) {
//             marker.remove();
//           }
//           // Add a new marker at clicked position with custom icon
//           const newMarker = L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map);
//           setMarker(newMarker);

//           // Call the onLocationSelect function to update the form
//           onLocationSelect({ lat, lng });

//           // Update the marker drag event to also update the location
//           newMarker.on('dragend', () => {
//             const { lat, lng } = newMarker.getLatLng();
//             onLocationSelect({ lat, lng });
//           });
//         });
//       });
//     }
//   }, [onLocationSelect, marker]); // Add marker to the dependency array to update state on marker change

//   return (
//     <div ref={mapContainerRef} style={{ height: '300px', width: '100%', border: '2px solid #ddd' }}>
//       Loading map...
//     </div>
//   );
// };

// export default MapComponent;
