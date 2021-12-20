const webPush = require('web-push');
function sendMessage(pushSubscription) {
    const payload = 'Here is a payload';
    const options = {
        TTL: 60
    }

    webPush.sendNotification(pushSubscription,payload,options);
}