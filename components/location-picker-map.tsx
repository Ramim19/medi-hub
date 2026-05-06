"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

// Dhaka coordinates
const DHAKA_CENTER = { lat: 23.8103, lng: 90.4125 }
const DEFAULT_ZOOM = 13

interface LocationPickerMapProps {
  onLocationChange?: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

export default function LocationPickerMap({
  onLocationChange,
  initialLat = DHAKA_CENTER.lat,
  initialLng = DHAKA_CENTER.lng,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({ lat: initialLat, lng: initialLng })

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window === "undefined" || !mapContainerRef.current || mapRef.current) return

      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Create map centered on Dhaka
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true,
      })

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Update location when map moves
      map.on("moveend", () => {
        const center = map.getCenter()
        setCurrentLocation({ lat: center.lat, lng: center.lng })
        onLocationChange?.(center.lat, center.lng)
      })

      mapRef.current = map
      setIsLoaded(true)

      // Trigger initial location callback
      onLocationChange?.(initialLat, initialLng)
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initialLat, initialLng, onLocationChange])

  return (
    <div className="relative w-full h-64 rounded-lg border border-border overflow-hidden">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Fixed center pin overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="relative">
          <MapPin className="h-10 w-10 text-destructive drop-shadow-lg transform -translate-y-1/2" />
          {/* Pin shadow/dot at exact center */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-destructive/30 rounded-full" />
        </div>
      </div>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}

      {/* Coordinates display */}
      {isLoaded && (
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground z-10">
          {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  )
}
