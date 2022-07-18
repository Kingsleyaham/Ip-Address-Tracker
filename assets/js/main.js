const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", fetchIpInfo);

function fetchIpInfo() {
  let userInput = document.querySelector("#ipaddress");

  if (isEmpty(userInput)) return;

  let inputVal = userInput.value.trim();
  let apiKey = "at_gGAEPaFZ0ZiwutDn4tML5oz8Pr2JV";
  let ipAddress = isIpAddress(inputVal) ? inputVal : "";
  let domain = isValidDomain(inputVal) ? sanitizeDomain(inputVal) : "";

  userInput.value = "";

  // fetch details using either domain or ipAddress
  async function fetchDetails(url) {
    try {
      const response = await axios.get(url);
      const data = response.data;

      // return data to DOM
      document.querySelector("#ipAdd").textContent = data.ip;
      document.querySelector(
        "#location"
      ).textContent = `${data.location.city}, ${data.location.region}`;
      document.querySelector(
        "#timezone"
      ).textContent = `UTC${data.location.timezone}`;
      document.querySelector("#isp").textContent = data.isp;

      let latitude = data.location.lat;
      let longitude = data.location.lng;

      displayMap(latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  }

  fetchDetails(
    `
https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}&domain=${domain}`
  );
}

function displayMap(latitude, longitude) {
  let container = L.DomUtil.get("map");

  if (container != null) {
    container._leaflet_id = null;
  }

  let map = L.map("map", {
    minZoom: 5,
    maxZoom: 25,
    zoomControl: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  map.setView([latitude, longitude], 13);
  let marker = L.marker([latitude, longitude]).addTo(map);
}

// input validation functions

function isEmpty(str) {
  return str.length === 0;
}

function isIpAddress(ip) {
  let regExp =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return regExp.test(ip);
}

function isValidDomain(domain) {
  let regExp =
    /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi;

  return regExp.test(domain);
}

function sanitizeDomain(domain) {
  var result;
  var match;
  if (
    (match = domain.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
  }
  return result;
}

window.addEventListener("load", fetchIpInfo);
