

var STATIC_CACHE_CONTAINER = "static_v1"
var STATIC_FILES = [
    "/",
    "/index.js",
    "/index.css",
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
})


self.addEventListener('activate', function(event){
    console.log("service worker activated", event)
    event.waitUntil((async () => {
        if ('navigationPreload' in self.registration) {
          await self.registration.navigationPreload.enable();
        }
      })());
    
    self.clients.claim();
})


self.addEventListener('fetch', function(event){
    event.respondWith( caches.match(event.request)
        .then(response =>{
                return response || fetch(event.request)
        })
    )
})

self.addEventListener('push',event => {
    const title = 'Yay a msg';
    const body = 'We hav a push msg';
    const icon = '/images/app_icon96x96.png';
    const tag = 'simple-push-example-tag';
    event.waitUntil(
        self.registration.showNotification(title,{
            body: body,
            icon: icon,
            tag: tag
        })
    )
})

self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    var primaryKey = notification.data.primaryKey;
    
    if (!notification.data.hasOwnProperty('options'))
        return;
    var options = notification.data.options;

    if (options.close){
        event.notification.close();
    }else {
        clients.openWindow('http://www.example.com');
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