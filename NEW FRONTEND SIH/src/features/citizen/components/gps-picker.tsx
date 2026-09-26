"use client";

import * as React from "react";
import { MapPin, Navigation, Compass, Check, Loader2 } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { LeafletMap } from "@/features/shared/components/maps/leaflet-map";
import { reverseGeocode } from "@/features/shared/services/geocoding-service";
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
  const [isGeocoding, setIsGeocoding] = React.useState(false);

  // References to prevent outdated geocoding responses from overwriting the latest location
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const latestRequestIdRef = React.useRef<number>(0);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Central function to update coordinates and fetch corresponding street address
  const handleCoordinateSelect = React.useCallback(
    async (lat: number, lng: number, customSuccessMessage?: string) => {
      // 1. Immediately sync coordinates with current address
      onLocationChange(lat, lng, address);

      // 2. Abort previous in-flight geocode requests to prevent race condition
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 3. Increment request sequence ID
      const requestId = ++latestRequestIdRef.current;
      setIsGeocoding(true);

      try {
        const resolvedAddress = await reverseGeocode(lat, lng, controller.signal);
        // Only update if this is still the latest request
        if (requestId === latestRequestIdRef.current) {
          onLocationChange(lat, lng, resolvedAddress);
          setIsGeocoding(false);
          if (customSuccessMessage) {
            toast.success(t("toast.gpsCaptured", "GPS Coordinates Captured"), {
              description: customSuccessMessage || `${lat.toFixed(5)}, ${lng.toFixed(5)} linked to report.`,
            });
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setIsGeocoding(false);
        }
      }
    },
    [address, onLocationChange, t]
  );

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
        handleCoordinateSelect(
          lat,
          lng,
          t("toast.gpsCapturedDesc", `${lat.toFixed(5)}, ${lng.toFixed(5)} linked to report.`)
        );
      },
      (err) => {
        setIsLocating(false);
        toast.info(t("toast.locationDenied", "Location permission denied or unavailable. Using default ward pinpoint."));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If citizen is manually typing an address, abort any pending geocode request
    // so an in-flight response cannot overwrite the citizen's manual edits
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    latestRequestIdRef.current++;
    setIsGeocoding(false);

    onLocationChange(latitude, longitude, e.target.value);
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
        onLocationSelect={(lat, lng) => handleCoordinateSelect(lat, lng)}
        markerTitle={t("citizen.report.incidentCoordinates", "Grievance Incident Coordinates")}
        className="h-56"
      />

      {/* Address / Landmark text */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="landmarkAddress" className="text-xs font-semibold">
            {t("citizen.report.streetAddress", "Street Address / Landmark")}
          </Label>
          {isGeocoding && (
            <span className="flex items-center gap-1 text-[11px] text-primary animate-pulse font-medium">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t("citizen.report.resolvingAddress", "Detecting address...")}
            </span>
          )}
        </div>
        <Input
          id="landmarkAddress"
          value={address}
          onChange={handleManualAddressChange}
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
