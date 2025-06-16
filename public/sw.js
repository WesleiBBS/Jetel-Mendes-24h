const CACHE_NAME = 'jetel-mendes-survey-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/jetelicon-192.png',
  '/icons/jetelicon-192.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline survey submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-survey') {
    event.waitUntil(syncSurveyData());
  }
});

// Function to sync survey data when back online
async function syncSurveyData() {
  try {
    // Get pending surveys from IndexedDB
    const pendingSurveys = await getPendingSurveys();
    
    for (const survey of pendingSurveys) {
      try {
        // Attempt to submit survey
        const response = await fetch('/api/surveys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(survey.data)
        });
        
        if (response.ok) {
          // Remove from pending if successful
          await removePendingSurvey(survey.id);
        }
      } catch (error) {
        console.error('Failed to sync survey:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SurveyDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSurveys')) {
        db.createObjectStore('pendingSurveys', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getPendingSurveys() {
  const db = await openDB();
  const transaction = db.transaction(['pendingSurveys'], 'readonly');
  const store = transaction.objectStore('pendingSurveys');
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function removePendingSurvey(id) {
  const db = await openDB();
  const transaction = db.transaction(['pendingSurveys'], 'readwrite');
  const store = transaction.objectStore('pendingSurveys');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icons/jetelicon-192.png',
    badge: '/icons/jetelicon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/icons/jetelicon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/jetelicon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Jetel Mendes', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

