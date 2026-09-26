"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";
import { Skeleton } from "../feedback/loading-skeleton";

export interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  markerTitle?: string;
  className?: string;
}

export function LeafletMap({
  latitude,
  longitude,
  zoom = 14,
  interactive = true,
  onLocationSelect,
  markerTitle = "Selected Location",
  className,
}: LeafletMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<unknown>(null);
  const markerRef = React.useRef<unknown>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    let isSubscribed = true;

    // Dynamically import Leaflet strictly on client
    import("leaflet").then((L) => {
      if (!isSubscribed || !mapContainerRef.current) return;

      // Fix default marker icon paths in Leaflet bundler environments
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive ? "center" : false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([latitude, longitude], {
          draggable: interactive && !!onLocationSelect,
        }).addTo(map);

        if (markerTitle) {
          marker.bindPopup(markerTitle);
        }

        if (interactive && onLocationSelect) {
          marker.on("dragend", () => {
            const position = marker.getLatLng();
            onLocationSelect(position.lat, position.lng);
          });

          map.on("click", (e) => {
            marker.setLatLng(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          });
        }

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setIsLoaded(true);
      } else {
        const map = mapInstanceRef.current as L.Map;
        const marker = markerRef.current as L.Marker;
        map.setView([latitude, longitude], zoom);
        if (marker) {
          marker.setLatLng([latitude, longitude]);
        }
      }
    });

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, latitude, longitude, zoom, interactive, onLocationSelect, markerTitle]);

  if (!isMounted) {
    return (
      <div className={cn("relative h-64 w-full rounded-2xl overflow-hidden", className)}>
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-64 w-full rounded-2xl overflow-hidden border border-border shadow-xs",
        className
      )}
    >
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/50 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Navigation className="h-4 w-4 animate-spin text-primary" />
            Loading Geo-intelligence Map...
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 z-10 rounded-lg bg-background/90 px-2 py-1 text-[11px] font-mono shadow-xs backdrop-blur-xs text-foreground flex items-center gap-1 border border-border/60">
        <MapPin className="h-3 w-3 text-primary shrink-0" />
        <span>
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
      </div>
    </div>
  );
}
