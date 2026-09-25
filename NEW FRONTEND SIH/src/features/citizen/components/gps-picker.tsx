"use client";

import * as React from "react";
import { MapPin, Navigation, Compass, Check } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { LeafletMap } from "@/features/shared/components/maps/leaflet-map";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface GpsPickerProps {
  latitude: number;
  longitude: number;
  address: string;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}

export function GpsPicker({
  latitude,
  longitude,
  address,
  onLocationChange,
}: GpsPickerProps) {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = React.useState(false);

  const fetchDeviceGps = () => {
    if (!navigator.geolocation) {
      toast.error(t("common.validation.locationRequired", "Geolocation is not supported by your browser."));
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onLocationChange(lat, lng, address || t("citizen.report.currentDetectedLocation", "Current Detected Location"));
        toast.success(t("toast.gpsCaptured", "GPS Coordinates Captured"), {
          description: t("toast.gpsCapturedDesc", `${lat.toFixed(5)}, ${lng.toFixed(5)} linked to report.`),
        });
      },
      (err) => {
        setIsLocating(false);
        // Fallback default coordinates (e.g. Bangalore center)
        toast.info(t("toast.locationDenied", "Location permission denied or unavailable. Using default ward pinpoint."));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t("citizen.report.incidentLocation", "GPS Location Pinpoint")}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchDeviceGps}
          isLoading={isLocating}
          className="rounded-xl gap-1.5 text-xs font-semibold hover:border-primary"
        >
          <Navigation className="h-3.5 w-3.5 text-primary" />
          <span>{t("citizen.report.useCurrentGps", "Use Current GPS")}</span>
        </Button>
      </div>

      {/* Interactive Map Component */}
      <LeafletMap
        latitude={latitude}
        longitude={longitude}
        zoom={15}
        interactive={true}
        onLocationSelect={(lat, lng) => onLocationChange(lat, lng)}
        markerTitle={t("citizen.report.incidentCoordinates", "Grievance Incident Coordinates")}
        className="h-56"
      />

      {/* Address / Landmark text */}
      <div className="space-y-1.5">
        <Label htmlFor="landmarkAddress" className="text-xs font-semibold">
          {t("citizen.report.streetAddress", "Street Address / Landmark")}
        </Label>
        <Input
          id="landmarkAddress"
          value={address}
          onChange={(e) => onLocationChange(latitude, longitude, e.target.value)}
          placeholder={t("citizen.report.addressPlaceholder", "e.g. 14th Main Rd, Near Indira Gandhi Circle")}
          className="h-10 text-xs rounded-xl"
        />
        <p className="text-[11px] text-muted-foreground">
          {t("citizen.report.mapTip", "Tip: You can click anywhere on the map or drag the pin to adjust exact coordinates.")}
        </p>
      </div>
    </div>
  );
}
