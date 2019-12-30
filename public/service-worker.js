console.log("i am service-worker");
var cacheName = "v1.0.5"
var dafaulfValue = [
    '/',
    './home.html',
    './webenage.jpg'
]
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log("success")
            cache.addAll(dafaulfValue);
        }, (error) => {
            console.log("error", error)
        })
    );
})


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cache) => {
            console.log(cache)
            cache.filter((single) => {
                return single !== cacheName
            }).map((data) => {
                return caches.delete(data);
            })
        })
    );
    console.log("done")
})



self.addEventListener('fetch', (event) => {
    var data = event.request.url;
    console.log(data)
    var url = new URL(data);
    console.log("url", url)



    if ((url.pathname).startsWith('/api')) {
        event.respondWith(
            caches.open(cacheName).then((cache) => {
                return cache.match(event.request).then((network) => {
                    console.log("network", network)
                    var fetchData = fetch(event.request).then((res) => {
                        if (res.status === 200) {
                            cache.put(data, res.clone())
                        }
                        return network;
                    });
                    return network;
                })

            })
        );
    }
});

importScripts('./firebase-messaging-sw.js')