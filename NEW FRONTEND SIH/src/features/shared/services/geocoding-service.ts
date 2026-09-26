/**
 * Reverse Geocoding Service for SOCIAL-X
 * Resolves GPS coordinates (latitude, longitude) into human-readable street addresses and landmarks.
 */

export interface GeocodeResult {
  success: boolean;
  address: string;
  latitude: number;
  longitude: number;
  source?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<string> {
  // 1. Try our internal server-side reverse geocoding API route
  try {
    const res = await fetch(
      `/api/geocode/reverse?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`,
      {
        signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (res.ok) {
      const data: GeocodeResult = await res.json();
      if (data.success && data.address) {
        return data.address;
      }
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw err; // Propagate aborts to handle race conditions properly
    }
    // Network or server error, proceed to client-side fallback
  }

  // 2. Direct client-side fallback via BigDataCloud Reverse Geocoding (CORS-friendly)
  try {
    const fallbackRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      { signal }
    );

    if (fallbackRes.ok) {
      const bdcData = await fallbackRes.json();
      const parts: string[] = [];

      if (bdcData.locality) parts.push(bdcData.locality);
      if (bdcData.city && !parts.includes(bdcData.city)) parts.push(bdcData.city);
      if (bdcData.principalSubdivision && !parts.includes(bdcData.principalSubdivision)) {
        parts.push(bdcData.principalSubdivision);
      }
      if (bdcData.postcode) parts.push(bdcData.postcode);

      if (parts.length > 0) {
        return parts.join(", ");
      }
    }
  } catch (fallbackErr: any) {
    if (fallbackErr.name === "AbortError") {
      throw fallbackErr;
    }
  }

  // 3. Fallback to coordinate label
  return `GPS Pinpoint (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
}
