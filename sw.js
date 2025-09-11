// Service Worker for ADSMANAT
const CACHE_NAME = 'adsmanat-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/biletcoin.html',
    '/events.html',
    '/tasks.html',
    '/withdraw.html',
    '/rules.html',
    '/settings.html',
    '/verification.html',
    '/styles.css',
    '/script.js',
    '/biletcoin.js',
    '/events.js',
    '/tasks.js',
    '/withdraw.js',
    '/rules.js',
    '/settings.js',
    '/verification.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(function(response) {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Activate event
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Background sync function
function doBackgroundSync() {
    // Sync offline data when connection is restored
    return new Promise(function(resolve) {
        // Get offline data from IndexedDB
        // Send to server
        // Clear offline data
        resolve();
    });
}

// Push notification
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'Yeni bildiriş!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Bax',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Bağla',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('ADSMANAT', options)
    );
});

// Notification click
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Update available
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        // Notify user about update
        self.registration.showNotification('Yeniləmə mövcuddur', {
            body: 'Yeni versiya yüklənib. Yeniləmək üçün klikləyin.',
            icon: '/icon-192x192.png',
            tag: 'update-available'
        });
    }
});