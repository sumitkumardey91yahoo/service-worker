var cacheName = 'altpwa-v100';
var filesToCache = [
  '/',
  '/home.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
        console.log(cacheNames)
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== cacheName;
        }).map((name) => {
          return caches.delete(name);
        })
      )
    })
  )
});

self.addEventListener('fetch', (e) => {
    console.log(e)
  if (e.request.method === 'GET') {
    let urlObject = new URL(e.request.url);
    let urlPath = urlObject.pathname;
    //  console.log("urlPath:",urlPath);

    if(urlPath.startsWith('/accounts') == false && urlPath.startsWith('/player') == false) {
        e.respondWith(
          caches.open(cacheName).then(function(cache) {
            return cache.match(e.request).then(function(response) {
              var fetchPromise = fetch(e.request).then(function(networkResponse) {
                console.log("sw.js || e.request.url ||  ",e.request.url,">>> status code",networkResponse.status);
                if (networkResponse.status == 200 || networkResponse.status == 201) {
                  cache.put(e.request, networkResponse.clone());
                }
                return networkResponse;
              }).catch((error) => {
                console.log('[sw | fetch | error ]', error);
              })
              return response || fetchPromise;
            });
          })
        );
    }
  }
});
