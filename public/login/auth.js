function login() {
    var remember = document.getElementById("remeber_me").checked;
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;
    if (remember) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            // Sign-out successful.
            window.alert("Hi " + email + ",\nWelcom to The JoJo Tank World :)\nRemember me: Yes");
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            window.alert("Login Error: " + errorMessage);
        });
    } else {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function () {
                // In memory persistence will be applied to the signed in Google user
                // even though the persistence was set to 'none' and a page redirect
                // occurred.
                window.alert("Hi " + email + ",\nWelcom to The JoJo Tank World :)\nRemember me: No");
                return firebase.auth().signInWithEmailAndPassword(email, password);
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorMessage = error.message;
                window.alert("Login Error: " + errorMessage);
            });
    }

}
function register() {
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        // Sign up successful.
        window.alert("Successfully signed up\nYour Account Email is " + email);
    }).catch(function (error) {
        // Handle Errors here.
        var errorMessage = error.message;
        // ...
        window.alert("Register Error: " + errorMessage);
    });

}
function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.alert("Successfully logout");
    }).catch(function (error) {
        // An error happened.
        var errorMessage = error.message;
        // ...
        window.alert("Logout error: " + errorMessage);
    });

}

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        document.getElementById("not_signed_in").style.display = "none";
        document.getElementById("signed_in").style.display = "initial";
        document.getElementById('email_display').innerHTML="Email: "+firebaseUser.email;
    } else {
        console.log('Not logged in!');
        document.getElementById("not_signed_in").style.display = "initial";
        document.getElementById("signed_in").style.display = "none";
    }
})