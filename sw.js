const CACHE_NAME = "flamme-rouge"; 

self.addEventListener("install", function (event) {
    caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll([
            './', 
            'index.html', 
            'select.html', 
            'style.css', 
            'icon/icon_512x512.png',
            'icon/icon_384x384.png',
            'icon/icon_192x192.png',
            'Card.js',
            'Deck.js', 
            'manifest.webmanifest',
            'verve.ttf', 
            'custom.html'
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