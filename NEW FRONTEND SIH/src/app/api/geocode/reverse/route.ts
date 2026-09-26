import { NextRequest, NextResponse } from "next/server";

// In-memory cache for recent geocoding lookups (lat_lng -> address)
const geocodeCache = new Map<string, { address: string; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_SIZE = 500;

function formatNominatimAddress(data: any): string {
  if (!data) return "";
  const a = data.address || {};

  const parts: string[] = [];

  // 1. Landmark or venue
  const landmark = a.amenity || a.building || a.leisure || a.shop || a.tourism || a.office || a.historic;
  if (landmark) parts.push(landmark);

  // 2. Road or street
  const street = a.road || a.pedestrian || a.street || a.residential || a.footway || a.path;
  if (street && !parts.includes(street)) parts.push(street);

  // 3. Area / Neighbourhood / Ward
  const area = a.suburb || a.neighbourhood || a.quarter || a.city_district || a.ward;
  if (area && !parts.includes(area)) parts.push(area);

  // 4. City or town
  const city = a.city || a.town || a.municipality || a.village || a.county;
  if (city && !parts.includes(city)) parts.push(city);

  // 5. Postal code & State
  const stateCode = a.postcode ? `${a.state || ""} ${a.postcode}`.trim() : (a.state || "");
  if (stateCode && !parts.some((p) => p.includes(stateCode))) parts.push(stateCode);

  if (parts.length >= 2) {
    return parts.join(", ");
  }

  // Fallback to display_name (truncated to first 4 segments)
  if (data.display_name && typeof data.display_name === "string") {
    const segments = data.display_name.split(",").map((s: string) => s.trim()).filter(Boolean);
    return segments.slice(0, 4).join(", ");
  }

  return "";
}

function formatBigDataCloudAddress(data: any): string {
  if (!data) return "";
  const parts: string[] = [];

  if (data.locality) parts.push(data.locality);
  if (data.city && !parts.includes(data.city)) parts.push(data.city);
  if (data.principalSubdivision && !parts.includes(data.principalSubdivision)) parts.push(data.principalSubdivision);
  if (data.postcode) parts.push(data.postcode);

  return parts.join(", ");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get("lat") || searchParams.get("latitude");
    const lngParam = searchParams.get("lng") || searchParams.get("longitude") || searchParams.get("lon");

    if (!latParam || !lngParam) {
      return NextResponse.json(
        { success: false, error: "Latitude and longitude query parameters are required." },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { success: false, error: "Invalid coordinate bounds." },
        { status: 400 }
      );
    }

    // Cache key rounded to ~11 meters precision (4 decimals)
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const cached = geocodeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        address: cached.address,
        source: "cache",
        latitude: lat,
        longitude: lng,
      });
    }

    let resolvedAddress = "";

    // 1. Primary: OpenStreetMap Nominatim
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "SocialX-CivicOS/1.0 (civic-portal@socialx.gov.in)",
          "Accept-Language": "en",
        },
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const data = await res.json();
        const formatted = formatNominatimAddress(data);
        if (formatted) {
          resolvedAddress = formatted;
        }
      }
    } catch (nomErr) {
      // Nominatim timed out or throttled, fall through to fallback
    }

    // 2. Fallback: BigDataCloud Reverse Geocode Client API
    if (!resolvedAddress) {
      try {
        const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
        const res = await fetch(bdcUrl, {
          signal: AbortSignal.timeout(3000),
        });

        if (res.ok) {
          const data = await res.json();
          const formatted = formatBigDataCloudAddress(data);
          if (formatted) {
            resolvedAddress = formatted;
          }
        }
      } catch (bdcErr) {
        // Fall through
      }
    }

    // 3. Fallback: Coordinate representation if both geocoding providers failed
    if (!resolvedAddress) {
      resolvedAddress = `GPS Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
    }

    // Update cache
    if (geocodeCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = geocodeCache.keys().next().value;
      if (oldestKey) geocodeCache.delete(oldestKey);
    }
    geocodeCache.set(cacheKey, { address: resolvedAddress, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      address: resolvedAddress,
      latitude: lat,
      longitude: lng,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reverse geocode location." },
      { status: 500 }
    );
  }
}
