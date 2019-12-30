importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js')

firebase.initializeApp({
    // production
    messagingSenderId: "213810697791"
})
const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.'
    };


    self.addEventListener('notificationclick', function(event) {
        event.notification.close();
        event.waitUntil(self.clients.openWindow('https://altbalaji.com'));
    });

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});