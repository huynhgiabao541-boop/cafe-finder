import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fix Leaflet marker icon issue in React
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

// Component to handle map view updates
function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function App() {
  const [city, setCity] = useState("Hà Nội");
  const [place, setPlace] = useState("");
  const [cafes, setCafes] = useState([]);
  const [center, setCenter] = useState([14.0583, 108.2772]); // Vietnam center
  const [loading, setLoading] = useState(false);

  const findCafes = async () => {
    if (!city) return;
    setLoading(true);
    
    try {
      const query = place ? `${place}, ${city}` : city;
      
      // Step 1: Geocode
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn`
      );
      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        alert("Không tìm thấy địa điểm này!");
        setLoading(false);
        return;
      }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      setCenter([lat, lon]);

      // Step 2: Query cafes
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="cafe"](around:2000,${lat},${lon});out;`;
      const cafeRes = await fetch(overpassUrl);
      const cafeData = await cafeRes.json();
      
      setCafes(cafeData.elements || []);
      
      if (!cafeData.elements || cafeData.elements.length === 0) {
        alert("Không tìm thấy quán cafe nào gần đây!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tìm kiếm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 p-4 font-sans">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <Coffee className="w-8 h-8 text-amber-600" />
            Cafe Finder VN
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tìm quán cafe gần bạn trên toàn quốc</p>
        </header>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
              <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
              <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
              <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Địa điểm cụ thể (VD: Quận 1)..."
              className="pl-9 w-full"
              onKeyDown={(e) => e.key === 'Enter' && findCafes()}
            />
          </div>

          <Button onClick={findCafes} disabled={loading} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Đang tìm..." : "Tìm Quán"}
          </Button>
        </div>

        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative z-0">
          <MapContainer center={center} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            
            {cafes.map((cafe) => (
              <Marker key={cafe.id} position={[cafe.lat, cafe.lon]}>
                <Popup>
                  <div className="font-semibold text-slate-900">{cafe.tags.name || "Quán Cafe Không Tên"}</div>
                  {cafe.tags['addr:street'] && (
                    <div className="text-xs text-slate-500 mt-1">{cafe.tags['addr:street']}</div>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
