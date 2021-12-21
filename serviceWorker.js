var STATIC_CACHE_CONTAINER = "static_v1"
var STATIC_FILES = [
    "/",
    "/index.js",
    "/css/index.css",
    "https://fonts.googleapis.com/css2?family=Ranchers&display=swap",
    "https://fonts.gstatic.com/s/ranchers/v8/zrfm0H3Lx-P2Xvs2ArDfBi8.woff2",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
]


self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(STATIC_CACHE_CONTAINER)
        .then(function(cache){
            return cache.addAll(STATIC_FILES)
        })
    )
});


self.addEventListener('activate', function(event){
    console.log("service worker activated", event)
    event.waitUntil((async () => {
        if ('navigationPreload' in self.registration) {
          await self.registration.navigationPreload.enable();
        }
      })());
    self.clients.claim();
});


self.addEventListener('fetch', function(event){
    event.respondWith( caches.match(event.request)
        .then(response =>{
                return response || fetch(event.request)
        })
    )
});


self.addEventListener('push', function(e) {
    var body;
  
    if (e.data) { 
      body = e.data.text();
    } else { 
      body = 'Push message has no payload';
    }
  
    var options = {
      body: body,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {action: 'explore', title: 'Explore this new world'},
        {action: 'close', title: 'I don\'t want any of this'},
      ]
    };
    e.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
});


self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('Subscription expired');
    event.waitUntil(
      self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(subscription) {
        console.log('Subscribed after expiration', subscription.endpoint);
        return fetch('register', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      })
    );
});


self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    var primaryKey = notification.data.primaryKey;
    
    if (!notification.data.hasOwnProperty('options'))
        return;
    var options = notification.data.options;

    if (options.close){
        event.notification.close();
    }else {
        clients.openWindow('http://www.kotish.com');
        notification.close();
    }
    
    var promise = Promise.resolve();
    event.waitUntil(promise);
})


self.addEventListener('notificationclose',event => {
    const notification = event.notification;
    var options = notification.data.options;

    if (!options.notificationCloseEvent)
        return;

    const primaryKey = notification.data.primaryKey;
    console.log('Closed notification:'+ primaryKey)
})