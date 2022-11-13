

self.addEventListener("install", function (event) {
    caches.open('clock').then(function(cache) {
        return cache.addAll([
            './'
        ]);
    });
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request)
                    .then(cachedResponse => {
                        return cachedResponse; 
                    }); 
            })
    )
})