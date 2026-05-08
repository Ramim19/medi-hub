"use client"

import { useEffect, useRef, useState } from "react"

// Dhaka coordinates as fallback
const DHAKA_CENTER = { lat: 23.8103, lng: 90.4125 }
const DEFAULT_ZOOM = 15

interface LocationPickerMapProps {
  onLocationChange?: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
  interactive?: boolean
}

export default function LocationPickerMap({
  onLocationChange,
  initialLat,
  initialLng,
  interactive = false,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const initializedRef = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({ 
    lat: initialLat ?? DHAKA_CENTER.lat, 
    lng: initialLng ?? DHAKA_CENTER.lng 
  })

  useEffect(() => {
    const initMap = async () => {
      if (typeof window === "undefined" || !mapContainerRef.current) return
      if (initializedRef.current) return

      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Start with fallback location
      let startLat = initialLat ?? DHAKA_CENTER.lat
      let startLng = initialLng ?? DHAKA_CENTER.lng

      // Create map with conditional interaction settings
      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true,
        // Disable dragging/panning when not interactive
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: true,
        boxZoom: interactive,
        keyboard: interactive,
      })

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Update location when map moves (only relevant in interactive mode)
      if (interactive) {
        map.on("moveend", () => {
          const center = map.getCenter()
          setCurrentLocation({ lat: center.lat, lng: center.lng })
          onLocationChange?.(center.lat, center.lng)
        })
      }

      mapRef.current = map
      initializedRef.current = true
      setIsLoaded(true)

      // Try to get user's current location (only in interactive mode without initial coords)
      if (interactive && !initialLat && !initialLng && navigator.geolocation) {
        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            map.setView([latitude, longitude], DEFAULT_ZOOM)
            setCurrentLocation({ lat: latitude, lng: longitude })
            onLocationChange?.(latitude, longitude)
            setIsLocating(false)
          },
          () => {
            // Geolocation failed, keep Dhaka as default
            setIsLocating(false)
            onLocationChange?.(startLat, startLng)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      } else if (interactive) {
        onLocationChange?.(startLat, startLng)
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        initializedRef.current = false
      }
    }
  }, [initialLat, initialLng, onLocationChange, interactive])

  return (
    <div className="flex justify-center w-full">
      <div className="relative w-full max-w-md aspect-[4/3] rounded-xl border border-border overflow-hidden shadow-sm bg-muted">
        {/* Map container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Fixed center pin overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="relative flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PqwAEuUmCChcy4fkF45zpJVDhXTOXI.png"
              alt="Location pin"
              width={40}
              height={48}
              className="drop-shadow-lg"
              style={{ transform: "translateY(-24px)" }}
            />
            {/* Ground shadow */}
            <div 
              className="absolute w-3 h-1.5 bg-black/20 rounded-full blur-[1px]"
              style={{ bottom: "24px" }}
            />
          </div>
        </div>

        {/* Loading overlay */}
        {(!isLoaded || isLocating) && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                {isLocating ? "Getting your location..." : "Loading map..."}
              </span>
            </div>
          </div>
        )}

        {/* Coordinates display */}
        {isLoaded && !isLocating && (
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground z-10 shadow-sm">
            {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  )
}
