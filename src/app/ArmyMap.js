"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Component to update map center dynamically
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

function ArmyMapComponent({ allCamps }) {
  const [position, setPosition] = useState([23.8041, 90.4152]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCamps, setNearestCamps] = useState([]);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false); // 🆕 loading state

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestCamps = (lat, lon) => {
    const sorted = allCamps
      .map((camp) => ({
        ...camp,
        distance: calculateDistance(lat, lon, camp.lat, camp.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
    setNearestCamps(sorted);
  };

  const handleFindLocation = async () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation.");
      return;
    }

    setLoading(true); // 🧭 start loading

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserLocation([lat, lon]);
        setPosition([lat, lon]);
        findNearestCamps(lat, lon);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          setLocationName(data.display_name || "Unknown Location");
        } catch (err) {
          console.error("Error fetching location name:", err);
          setLocationName("Unable to retrieve location name");
        } finally {
          setLoading(false); // ✅ stop loading after all done
        }
      },
      (err) => {
        console.error(err);
        alert("Unable to retrieve your location.");
        setLoading(false); // ❌ stop loading on error too
      },
      { enableHighAccuracy: true }
    );
  };

  const handleCampClick = (camp) => {
    setSelectedCamp([camp.lat, camp.lng]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-[#00674C] w-full md:w-[25%] flex flex-col items-center border-b-2 md:border-r-4 border-white">
        <section className="bg-[#00674C] px-2 py-2 font-semibold text-lg md:text-xl lg:text-lg uppercase text-center border-b-2 border-white text-white w-full mb-3">
          <h1>বাংলাদেশ সেনাবাহিনী ক্যাম্প এর লোকেশান এবং কন্টাক্ট নাম্বার</h1>
        </section>
        <div className="px-2 font-semibold text-lg md:text-xl lg:text-lg uppercase text-center w-full ">
          <button
            onClick={handleFindLocation}
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white hover:scale-102"
            } px-4 py-1 inline-block rounded-md font-semibold mb-3 transition-all cursor-pointer w-full`}
          >
            {loading ? "লোকেশান পাওয়া যাচ্ছে..." : "আমার অবস্থান খুঁজুন"}
          </button>
        </div>

        <h3 className="uppercase font-semibold border-b-2 text-white text-center w-full">
          আমার লোকেশান
        </h3>
        <div className="px-2 py-2 font-semibold text-lg md:text-xl lg:text-lg uppercase text-center  w-full mb-2">
          {loading && (
            <p className="text-white text-sm mt-2">⏳ লোকেশান লোড হচ্ছে...</p>
          )}
          {!loading && locationName && (
            <div className="bg-gray-200 rounded-md text-black p-1 cursor-pointer hover:bg-gray-300 text-center text-xs">
              {locationName}
            </div>
          )}
        </div>

        <h3 className="font-semibold border-b-2 text-white text-center w-full">
          নিকটস্থ ৫ টি সেনা ক্যাম্প:
        </h3>

        <div className="px-2 py-2 text-lg md:text-xl lg:text-lg uppercase text-center  w-full">
          <div className="text-center mt-2 text-white w-full grid grid-cols-2 md:grid-cols-1 gap-2 text-xs">
            {loading ? (
              <p className="text-sm">⏳ লোকেশান লোড হচ্ছে...</p>
            ) : nearestCamps.length === 0 ? (
              <p>
                নিকটস্থ ৫ টি সেনা ক্যাম্প লোকেশান পেতে <br />
                <span className="font-semibold">আমার অবস্থান খুঁজুন</span> বাটনে
                ক্লিক করুন!
              </p>
            ) : (
              nearestCamps.map((camp, i) => (
                <div
                  key={i}
                  onClick={() => handleCampClick(camp)}
                  className="bg-gray-200 rounded-md text-black p-2 mb-1 cursor-pointer hover:bg-gray-300 transition"
                >
                  <div className="font-semibold">{camp.name}</div>
                  <div className="text-xs">
                    দূরত্ব: {camp.distance.toFixed(2)} কিলোমিটার
                  </div>
                  <div className="text-xs">
                    যোগাযোগ: {camp.contacts?.join(", ")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom
        className="min-h-[60vh] md:min-h-screen w-full"
      >
        <ChangeView center={selectedCamp || position} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Circle
            center={userLocation}
            radius={1000}
            pathOptions={{ fillColor: "blue", color: "blue" }}
          />
        )}

        {allCamps.map((camp, idx) => (
          <Marker key={idx} position={[camp.lat, camp.lng]}>
            <Popup>
              <ul>
                <li>
                  ক্যাম্প: <b>{camp.name}</b>
                </li>
                যোগাযোগ:{" "}
                {camp.contacts.map((cont) => {
                  return (
                    <li>
                      <Link href={`tel:${cont}`}>{cont}</Link>
                    </li>
                  );
                })}
              </ul>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// ✅ Export dynamic version for Next.js compatibility
export default dynamic(() => Promise.resolve(ArmyMapComponent), { ssr: false });
