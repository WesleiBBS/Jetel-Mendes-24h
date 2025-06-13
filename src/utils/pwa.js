// PWA utilities
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showInstallPrompt = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      
      installButton.addEventListener('click', () => {
        // Hide the install button
        installButton.style.display = 'none';
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      });
    }
  });
};

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

export const saveOfflineSurvey = async (surveyData) => {
  if ('indexedDB' in window) {
    try {
      const db = await openDB();
      const transaction = db.transaction(['pendingSurveys'], 'readwrite');
      const store = transaction.objectStore('pendingSurveys');
      
      await new Promise((resolve, reject) => {
        const request = store.add({
          data: surveyData,
          timestamp: Date.now()
        });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
      
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-survey');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save offline survey:', error);
      return false;
    }
  }
  return false;
};

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

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const addOnlineStatusListener = (callback) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};

