(function (glob, document){
'use strict';

const divInstall = document.getElementById('installContainer');
const btnNotify = document.getElementById("btnNotif");
const btnAdd = document.getElementById("btnAdd");
const applicationServerPublicKey = 'BAK6uTavQU-rkTdIyWLUdqi4iv3givzdKQXmW1qzfUk0fzQcq9lRQJbi8TkziBONjC5gUGG8Zif8DhnorUbPYLE'



init()

function init(){
    if ('serviceWorker' in navigator){
             window.addEventListener('load',()=>{
                registerServiceWorker();
                //displayNotification();
        });
    }

    if ('Notification' in window && navigator.serviceWorker) {
            console.log("Notification allowed");  
    } 
}

function registerServiceWorker(){
    navigator.serviceWorker.register('/serviceWorker.js')
    .then(function(reg){
        console.log("service worker registered", reg);
    })
    .catch(function(err){
        console.log("error when registering service worker", err);
    })
}

function displayNotification() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        reg.showNotification('Display Test Notification');
      });
    }
}



window.addEventListener('beforeinstallprompt',(e) =>{
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();
    window.deferredPrompt = e;
    divInstall.classList.toggle('hidden', false);
    console.log(window.deferredPrompt);
});
    
window.addEventListener('appinstalled',(evt) => {
    window.deferredPrompt = null;
    console.log('App installed to Home Screen');
});

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

navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.getSubscription().then(sub => {
        if(sub == undefined){
            console.log('Not subscribed to push service!');
        }else {
            console.log('Subscription object: ', sub);
        }
    })
}) 

navigator.serviceWorker.ready.then(()=>{
    navigator.serviceWorker.getRegistration().then(reg => {
        console.log('Registering push...');
        reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerPublicKey)
        }).then(sub => {
                // var subJSObject = JSON.parse(JSON.stringify(sub));  
                // var endpoint = subJSObject.endpoint;  
                // var auth = subJSObject.keys.auth; 
                // var p256dh = subJSObject.keys.p256dh;
                console.log(JSON.stringify(sub))
                return(sub)
        }).then((sub)=>{
                console.log(JSON.stringify(sub))
                var data = fetch("https://rocky-everglades-32767.herokuapp.com/subscribe", {
                    method: "POST", mode: 'no-cors',
                    body: JSON.stringify(sub),
                    headers: { "Access-Control-Allow-Origin":"*",
                                "content-type": "application/json"  }
                })
                console.log(data)
        }).catch(function(e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for notifications was denied');
                } else {
                    console.error('Unable to subscribe to push', e);
                }
        });
    })
})



})(window, document)