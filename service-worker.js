const CACHE_NAME = "carbon-footprint-v1";

//files to be cached for offline usage
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
];

//install events
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME) //open/create the cache
      .then((cache) => cache.addAll(urlsToCache)) //add all specified files to cache
  );
});

//fetch events
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

//activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME)
            return caches.delete(key); //delete outdated cache
      }))
    )
  );
});
