var map = L.map("map").setView([51.505, -0.09], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 25,
  zoomControl: true,
  attribution: "© OpenStreetMap",
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);
