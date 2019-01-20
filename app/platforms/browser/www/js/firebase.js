// Initialize Firebase
function firebaseInit () {
    var config = {
        apiKey: "AIzaSyDJMheWdB2qxBfDB1cze706pfubVbC2vGk",
        authDomain: "uber-dfd1c.firebaseapp.com",
        databaseURL: "https://uber-dfd1c.firebaseio.com",
        projectId: "uber-dfd1c",
        storageBucket: "uber-dfd1c.appspot.com",
        messagingSenderId: "206144307579"
    };
    firebase.initializeApp(config);
    loadApplication(); //TODO: Display loading screen
}