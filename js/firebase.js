// Initialize Firebase
let config = {
  apiKey: "AIzaSyBLnl8O7qvyWZfidBNIbvj9xPwtVTyoBmM",
  authDomain: "jackdidbrexit-cc64d.firebaseapp.com",
  databaseURL: "https://jackdidbrexit-cc64d.firebaseio.com",
  storageBucket: "jackdidbrexit-cc64d.appspot.com",
  messagingSenderId: "947328579588"
};
firebase.initializeApp(config);
let provider = new firebase.auth.GoogleAuthProvider();

window.onbeforeunload = signOut();

function signIn() {
   firebase.auth().signInWithPopup(provider).then(function(result) {
      let token = result.credential.accessToken;
      let user = result.user;

      console.log(token)
      console.log(user)

      firebase.database().ref("users/" + firebase.auth().currentUser.uid).once("value").then(function(snapshot) {
        if (!snapshot.val()) {
          firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
            name: firebase.auth().currentUser.providerData[0].displayName,
            image: firebase.auth().currentUser.providerData[0].photoURL
          });
        }
      });

      document.getElementById("navbar-image").src = firebase.auth().currentUser.providerData[0].photoURL;
      document.getElementById("navbar-username").innerHTML = firebase.auth().currentUser.providerData[0].displayName;
   }).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(error.code)
      console.log(error.message)
   });
}

function signOut() {
  firebase.auth().signOut().then(function() {
    console.log("Signed out.");
    document.getElementById("navbar-username").innerHTML = "";
    document.getElementById("navbar-image").src= "";
  });
}
