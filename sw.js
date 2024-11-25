self.addEventListener('install', event => {
    event.waitUntil(caches.open('offline-cache').then(cache => {
        return cache.addAll(['/static/offline.html']);
    }));
});

// self.addEventListener('fetch', event => {
//     event.respondWith(
//         fetch(event.request).catch(() => {
//             return caches.match('/static/offline.html');
//         })
//     );
// });
