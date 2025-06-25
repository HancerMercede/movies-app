import { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import PropTypes from "prop-types";
import styles from "./NearbyTheaters.module.css";
import { LoaderComponent } from "../utils/loaderComponent.jsx";
import "animate.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
// This is needed because of how bundlers handle assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons for markers
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const theaterIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Default center (fallback if geolocation fails)
const defaultCenter = {
  lat: 18.4861, // Santo Domingo coordinates (as default)
  lng: -69.9312,
};

// Component to recenter map when location changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const NearbyTheaters = () => {
  // State variables
  const [location, setLocation] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          setLoading(false);
          setMapReady(true);
        },
        (err) => {
          setError(`Error getting your location: ${err.message}`);
          setLoading(false);
          // Fallback to default location
          setLocation(defaultCenter);
          setMapReady(true);
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      // Fallback to default location
      setLocation(defaultCenter);
      setMapReady(true);
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }, []);

  // Find nearby theaters using Overpass API
  useEffect(() => {
    if (!location || !mapReady) return;

    setLoading(true);
    setTheaters([]);

    // Overpass API query to find cinemas/theaters within 10km
    const radius = 10000; // 10km in meters
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="cinema"](around:${radius},${location.lat},${location.lng});
        way["amenity"="cinema"](around:${radius},${location.lat},${location.lng});
        relation["amenity"="cinema"](around:${radius},${location.lat},${location.lng});
        node["leisure"="cinema"](around:${radius},${location.lat},${location.lng});
        way["leisure"="cinema"](around:${radius},${location.lat},${location.lng});
        relation["leisure"="cinema"](around:${radius},${location.lat},${location.lng});
      );
      out center;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      overpassQuery
    )}`;

    fetch(overpassUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Process results
        if (data.elements && data.elements.length > 0) {
          const theatersList = data.elements.map((element, index) => {
            // Get center coordinates for ways and relations
            let lat, lng;
            if (element.type === "node") {
              lat = element.lat;
              lng = element.lon;
            } else {
              // way or relation
              lat = element.center.lat;
              lng = element.center.lon;
            }

            const theaterLocation = { lat, lng };

            const distance = calculateDistance(
              location.lat,
              location.lng,
              lat,
              lng
            );
            console.log(distance);
            // Extract theater information
            const name =
              element.tags && element.tags.name
                ? element.tags.name
                : `Theater ${index + 1}`;

            const address =
              element.tags && element.tags.address
                ? element.tags.address
                : element.tags && element.tags["addr:street"]
                ? `${element.tags["addr:street"]} ${
                    element.tags["addr:housenumber"] || ""
                  }`
                : "Address not available";

            return {
              id: element.id.toString(),
              name: name,
              address: address,
              position: theaterLocation,
              distance: (distance ?? 0).toFixed(2),
            };
          });

          // Sort by distance
          theatersList.sort(
            (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
          );

          setTheaters(theatersList);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error finding nearby theaters: ${err.message}`);
        setLoading(false);

        // Fallback with some dummy data for testing if no theaters found
        if (import.meta.env.DEV) {
          // Create dummy theaters in dev mode for testing
          const dummyTheaters = [
            {
              id: "dummy1",
              name: "Cinema City",
              address: "123 Main St",
              position: {
                lat: location.lat + 0.01,
                lng: location.lng + 0.01,
              },
              distance: "1.5",
            },
            {
              id: "dummy2",
              name: "MoviePlex",
              address: "456 Broadway",
              position: {
                lat: location.lat - 0.01,
                lng: location.lng - 0.01,
              },
              distance: "2.3",
            },
            {
              id: "dummy3",
              name: "FilmHouse",
              address: "789 Park Ave",
              position: {
                lat: location.lat + 0.02,
                lng: location.lng - 0.02,
              },
              distance: "3.1",
            },
          ];
          setTheaters(dummyTheaters);
        }
      });
  }, [location, mapReady]);

  // Convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Handle theater selection from the list
  const handleSelectTheater = (theater) => {
    setSelectedTheater(theater);
  };

  return (
    <section
      className={`${styles.container} animate__animated animate__fadeIn`}
    >
      <h2 className={styles.title}>Find Movie Theaters Nearby</h2>

      {!location && (
        <button
          className={styles.button}
          onClick={getUserLocation}
          disabled={loading}
        >
          {loading ? "Getting your location..." : "Find Theaters Near Me"}
        </button>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {location && (
        <div className={styles.content}>
          <div className={styles.mapWrapper}>
            <MapContainer
              center={location}
              zoom={12}
              className={styles.map}
              scrollWheelZoom={false}
            >
              <ChangeView center={location} zoom={12} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location marker */}
              <Marker position={location} icon={userIcon}>
                <Popup>
                  <div>
                    <h3>Your location</h3>
                  </div>
                </Popup>
              </Marker>

              {/* Theater markers */}
              {theaters.map((theater) => (
                <Marker
                  key={theater.id}
                  position={theater.position}
                  icon={theaterIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedTheater(theater);
                    },
                  }}
                >
                  <Popup>
                    <div className={styles.infoWindow}>
                      <h3>{theater.name}</h3>
                      <p>{theater.address}</p>
                      <p>{theater.distance} km away</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className={styles.list}>
            <h3>Nearby Theaters</h3>

            {loading && <LoaderComponent />}

            {!loading && theaters.length === 0 && location && (
              <p className={styles.noResults}>
                No theaters found within 10 km.
              </p>
            )}

            {theaters.map((theater) => (
              <div
                key={theater.id}
                className={`${styles.theaterItem} ${
                  selectedTheater && selectedTheater.id === theater.id
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleSelectTheater(theater)}
              >
                <h4>{theater.name}</h4>
                <p>{theater.address}</p>
                <p className={styles.distance}>{theater.distance} km away</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

ChangeView.propTypes = {
  center: PropTypes.any,
  zoom: PropTypes.any,
};
