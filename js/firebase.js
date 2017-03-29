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

document.addEventListener("DOMContentLoaded", attemptAutoSignIn);
//window.onload = checkSignedIn();

function attemptAutoSignIn() {
  if (localStorage.getItem(`firebase:authUser:${config.apiKey}:[DEFAULT]`)) {
    console.log("Login data found in local storage, attempting auto signin...");
    signIn();
  }
}

function updateProfileInfo() {
  if (!firebase.auth().currentUser) {
    return;
  }
  document.getElementById("navbar-image").style.visibility = "visible";
  firebase.database().ref("users/" + firebase.auth().currentUser.uid).once("value").then(function(snapshot) {
    if (!snapshot.val()) {
      firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
        name: firebase.auth().currentUser.providerData[0].displayName,
        image: firebase.auth().currentUser.providerData[0].photoURL
      });
    }
    document.getElementById("navbar-image").src = firebase.auth().currentUser.providerData[0].photoURL;
    document.getElementById("navbar-username").innerHTML = firebase.auth().currentUser.providerData[0].displayName;
  });
}

function signIn() {
   firebase.auth().signInWithPopup(provider).then(function(result) {
      let token = result.credential.accessToken;
      let user = result.user;
      updateProfileInfo();
      console.log("Signed in successfully!");
   }).catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(error.code)
      console.log(error.message)
   });
}

function signOut() {
  firebase.auth().signOut().then(function() {
    document.getElementById("navbar-image").src = "";
    document.getElementById("navbar-image").style.visibility = "hidden";
    document.getElementById("navbar-username").innerHTML = "";
    console.log("Signed out.");
  });
}
