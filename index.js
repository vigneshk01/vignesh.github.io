(function(glob, document){
    'use strict';

    let btnNotify = document.getElementById("btnNotif");

    btnNotify.addEventListener('click', () => {
        Notification.requestPermission(function(status) {
            console.log('Notification permission status:', status);
            if (status === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                  registration.showNotification('Vibration Sample', {
                    body: 'Notification Triggered',
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
                    tag: 'vibration-sample'
                  });
                });
              }
        })
    });

    function displayNotification() {
        if (Notification.permission == 'granted') {
          navigator.serviceWorker.getRegistration().then(function(reg) {
            reg.showNotification('Hello world!');
          });
        }
    }

    let btnAdd = document.getElementById("btnAdd");
    const divInstall = document.getElementById('installContainer');

    window.addEventListener('beforeinstallprompt',(e) =>{
        console.log('beforeinstallprompt Event fired');
        e.preventDefault();
        window.deferredPrompt = e;
        divInstall.classList.toggle('hidden', false);
        console.log(window.deferredPrompt);
        //btnAdd.style.display = 'block';
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
        console.log('a2hs installed');
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
                // Display the UI to let the user toggle notifications
                console.log("test")
            }
        }
    }

    init()
    
})(window, document)    