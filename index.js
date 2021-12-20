(function(glob, document){
    'use strict';
    const applicationServerPublicKey = 'BOh0JrvksMFCrj1Ah7dWQIh5jLt0FXWSPM0FUUb4eXOS38bLKzXBXswhYBOnS6BopHBhZvLEZT7UQkrDLdXH-Do'

    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
    
        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);
    
        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function displayNotification() {
        if (Notification.permission == 'granted') {
          navigator.serviceWorker.getRegistration().then(function(reg) {
            reg.showNotification('Test Notification');
          });
        }
    }

    navigator.serviceWorker.getRegistration().then(reg => {
        const applicationServerKey = urlBase64ToUint8Array(applicationServerPublicKey);
        reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        }).then(sub => {
            var subJSObject = JSON.parse(JSON.stringify(sub));  
            var endpoint = subJSObject.endpoint;  
            var auth = subJSObject.keys.auth; 
            var p256dh = subJSObject.keys.p256dh;
            console.log(endpoint,auth,p256dh)
        }).catch(function(e) {
            if (Notification.permission === 'denied') {
              console.warn('Permission for notifications was denied');
            } else {
              console.error('Unable to subscribe to push', e);
            }
          });
    })

    navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
            if(sub == undefined){
                console.log('Not subscribed to push service!');
            }else {
                console.log('Subscription object: ', sub);
            }
        })
    })

    let btnNotify = document.getElementById("btnNotif");

    btnNotify.addEventListener('click', () => {
        Notification.requestPermission(function(status) {
            console.log('Notification permission status:', status);
            if (status === 'granted') {
                navigator.serviceWorker.ready.then(function(reg) {
                  reg.showNotification('Vibration Sample', {
                    body: 'Notification Triggered',
                    vibrate: [200, 100, 200],
                    data: {primaryKey: 1},
                    tag: 'vibration-sample'
                  });
                });
              }
        })
    });

  
    let btnAdd = document.getElementById("btnAdd");
    const divInstall = document.getElementById('installContainer');

    window.addEventListener('beforeinstallprompt',(e) =>{
        console.log('beforeinstallprompt Event fired');
        e.preventDefault();
        window.deferredPrompt = e;
        divInstall.classList.toggle('hidden', false);
        console.log(window.deferredPrompt);
        
    })

    btnAdd.addEventListener('click',async() =>{
        
        console.log('butInstall-clicked');
        const promptEvent = window.deferredPrompt;
        console.log(promptEvent);
        if(!promptEvent){
            return;
        }

        promptEvent.prompt();
        const result = await promptEvent.userChoice;
        console.log('userChoice', result);
        window.deferredPrompt = null;
        divInstall.classList.toggle('hidden', true);
    })

    window.addEventListener('appinstalled',(evt) => {
        window.deferredPrompt = null;
        console.log('App installed to Home Screen');
    })

    function registerServiceWorker(){
        navigator.serviceWorker.register('/serviceWorker.js')
        .then(function(reg){
            console.log("service worker registered", reg);
        })
        .catch(function(err){
            console.log("error when registering service worker", err);
        })
    }

    function init(){
        if ('serviceWorker' in navigator){
            window.addEventListener('load',()=>{
                registerServiceWorker();
                displayNotification();
            })

        if ('Notification' in window && navigator.serviceWorker) {
                console.log("Notification allowed")
            }
        }
    }

    init()
    
})(window, document)    