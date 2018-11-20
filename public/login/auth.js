function login() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        // Sign-out successful.
        window.alert("Hi " + email + ",\nWelcom to The JoJo Tank World :)");
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        window.alert("Login Error: " + errorMessage);
    });
}
function register() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        // Sign-out successful.
        window.alert("Successfully signed up\nYour Account Email is " + email);
    }).catch(function (error) {
        // Handle Errors here.
        var errorMessage = error.message;
        // ...
        window.alert("Register Error: " + errorMessage);
    });

}

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('Not logged in!');
    }
})