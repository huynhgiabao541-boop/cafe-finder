// Initialize map centered on India
let map = L.map("map").setView([20.5937, 78.9629], 5);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let markers = [];

// Function to find cafes near a given location
async function findCafes() {
  const query = document.getElementById("place-input").value;
  if (!query) {
    alert("Enter a location");
    return;
  }

  // Step 1: Geocode with Nominatim
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  const geoData = await geoRes.json();

  if (geoData.length === 0) {
    alert("Location not found");
    return;
  }

  const lat = parseFloat(geoData[0].lat);
  const lon = parseFloat(geoData[0].lon);

  map.setView([lat, lon], 15);

  // Step 2: Query cafes from Overpass API (within 2km radius)
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="cafe"](around:2000,${lat},${lon});out;`;

  const cafeRes = await fetch(overpassUrl);
  const cafeData = await cafeRes.json();

  // Clear old markers
  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  // Step 3: Add markers for cafes
  cafeData.elements.forEach((cafe) => {
    const marker = L.marker([cafe.lat, cafe.lon])
      .addTo(map)
      .bindPopup(`<strong>${cafe.tags.name || "Unnamed Cafe"}</strong>`);
    markers.push(marker);
  });

  if (cafeData.elements.length === 0) {
    alert("No cafes found nearby!");
  }
}
