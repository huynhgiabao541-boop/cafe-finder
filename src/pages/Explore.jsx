import { useState, useEffect } from "react";
import { Search, Map as MapIcon, SlidersHorizontal, List, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VenueCard from "@/components/VenueCard";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function Explore() {
  const [viewMode, setViewMode] = useState("split");
  const [selectedProv, setSelectedProv] = useState("01"); // Default: Hanoi
  const [selectedWard, setSelectedWard] = useState("");
  const [provSearch, setProvSearch] = useState("Thành phố Hà Nội");
  const [wardSearch, setWardSearch] = useState("");
  const [showProvList, setShowProvList] = useState(false);
  const [showWardList, setShowWardList] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([21.0285, 105.8542]); // Hanoi
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  // v2 = dữ liệu hành chính sau sáp nhập 07/2025 (chỉ còn 2 cấp: Tỉnh/TP -> Phường/Xã)
  const PROVINCES_API = "https://provinces.open-api.vn/api/v2";

  useEffect(() => {
    fetch(`${PROVINCES_API}/p/`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedProv) {
      fetch(`${PROVINCES_API}/p/${selectedProv}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setWards(data.wards || []);
          setSelectedWard(""); // Reset ward selection
          fetchVenues(data.name); // Search full province first
        })
        .catch(err => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProv]);

  // haversine distance in km
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  const OVERPASS_MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
  ];

  const fetchOverpassWithFallback = async (query) => {
    let lastErr;
    for (const base of OVERPASS_MIRRORS) {
      try {
        const res = await fetch(`${base}?data=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        lastErr = err;
        continue; // try next mirror
      }
    }
    throw lastErr;
  };

  const fetchVenues = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Vietnam")}&format=json&limit=1`,
        { headers: { "Accept-Language": "vi" } } // helps disambiguate Vietnamese place names
      );
      const nomData = await nomRes.json();
      if (!nomData || nomData.length === 0) {
        alert("Không tìm thấy khu vực này!");
        setLoading(false);
        return;
      }

      const { lat, lon, boundingbox } = nomData[0];
      const [s, n, w, e] = boundingbox;
      const centerLat = parseFloat(lat);
      const centerLon = parseFloat(lon);
      setMapCenter([centerLat, centerLon]);

      const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="cafe"](${s},${w},${n},${e});
  way["amenity"="cafe"](${s},${w},${n},${e});
  node["shop"="coffee"](${s},${w},${n},${e});
  node["cuisine"~"coffee_shop"](${s},${w},${n},${e});
  node["amenity"="restaurant"]["cuisine"~"coffee"](${s},${w},${n},${e});
  node["name"~"cà phê|caphe|coffee|cafe",i](${s},${w},${n},${e});
);
out center 150;
`;
      const overpassData = await fetchOverpassWithFallback(overpassQuery);

      const seen = new Set();
      const mappedVenues = overpassData.elements
        .map(el => {
          // ways only expose coords via el.center after "out center"
          const vLat = el.lat ?? el.center?.lat;
          const vLon = el.lon ?? el.center?.lon;
          return {
            id: el.id,
            name: el.tags?.name || "Không có tên",
            category: "Quán Cafe",
            rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1), // Mock
            distance: vLat && vLon ? getDistanceKm(centerLat, centerLon, vLat, vLon).toFixed(1) + " km" : "N/A",
            address: [el.tags?.["addr:housenumber"], el.tags?.["addr:street"]].filter(Boolean).join(" ") || "Việt Nam",
            lat: vLat,
            lng: vLon,
          };
        })
        .filter(v => v.name !== "Không có tên" && v.lat && v.lng)
        .filter(v => {
          if (seen.has(v.id)) return false;
          seen.add(v.id);
          return true;
        })
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      setVenues(mappedVenues);
    } catch (err) {
      console.error(err);
      alert("Không thể tải dữ liệu quán cafe. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };



  const filteredProvs = provinces.filter(p => p.name.toLowerCase().includes(provSearch.toLowerCase()));
  const filteredWards = wards.filter(w => w.name.toLowerCase().includes(wardSearch.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 max-w-7xl mx-auto">
          
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input 
               value={provSearch}
               onChange={(e) => {
                 setProvSearch(e.target.value);
                 setShowProvList(true);
               }}
               onFocus={() => setShowProvList(true)}
               onBlur={() => setTimeout(() => setShowProvList(false), 200)}
               placeholder="Tìm Tỉnh/Thành phố..."
               className="pl-9 bg-slate-100/50 dark:bg-slate-800/50 border-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded-xl h-10 w-full"
            />
            {showProvList && filteredProvs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto py-1">
                {filteredProvs.map(p => (
                  <div 
                    key={p.code} 
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setProvSearch(p.name);
                      setSelectedProv(p.code.toString());
                      setWardSearch("");
                      setShowProvList(false);
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input 
               value={wardSearch}
               onChange={(e) => {
                 setWardSearch(e.target.value);
                 setShowWardList(true);
               }}
               onFocus={() => setShowWardList(true)}
               onBlur={() => setTimeout(() => setShowWardList(false), 200)}
               placeholder="Tìm Phường/Xã..."
               className="pl-9 bg-slate-100/50 dark:bg-slate-800/50 border-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded-xl h-10 w-full"
               disabled={wards.length === 0}
            />
            {showWardList && filteredWards.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto py-1">
                {filteredWards.map(w => (
                  <div 
                    key={w.code} 
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const val = w.code.toString();
                      setWardSearch(w.name);
                      setSelectedWard(val);
                      setShowWardList(false);
                      const pName = provinces.find(p => p.code.toString() === selectedProv)?.name || "";
                      if (pName && w.name) fetchVenues(`${w.name}, ${pName}`);
                    }}
                  >
                    {w.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile View Toggle */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex lg:hidden bg-slate-900 dark:bg-slate-800 p-1 rounded-full shadow-lg border border-slate-800/50">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full px-6 h-9 ${viewMode !== 'map' ? 'bg-white/10 text-white hover:bg-white/20' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" /> List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full px-6 h-9 ${viewMode === 'map' ? 'bg-white/10 text-white hover:bg-white/20' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="w-4 h-4 mr-2" /> Map
          </Button>
        </div>

        {/* List View */}
        <div className={`w-full lg:w-5/12 xl:w-1/3 bg-slate-50 dark:bg-slate-950 overflow-y-auto ${viewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 pb-20">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-amber-500" />
              <p>Đang tìm kiếm quán cafe...</p>
            </div>
          ) : venues.length > 0 ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 pb-20">
              {venues.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 pb-20">
              <p>Không có kết quả nào. Hãy thử đổi khu vực!</p>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className={`flex-1 relative ${viewMode !== 'map' ? 'hidden lg:block' : 'block'}`}>
          <MapContainer center={mapCenter} zoom={13} className="w-full h-full z-0">
            <MapUpdater center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {venues.map((venue) => (
              <Marker key={venue.id} position={[venue.lat, venue.lng]}>
                <Popup>
                  <div className="font-semibold text-sm">{venue.name}</div>
                  <div className="text-xs text-slate-500">{venue.category}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}