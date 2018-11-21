var login_method;
function login() {
    var remember = document.getElementById("remeber_me").checked;
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;
    if (remember) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            // Sign-out successful.
            login_method = "email";
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
                login_method = "email";
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
        login_method = "email";
        window.alert("Successfully signed up\nYour Account Email is " + email);
    }).catch(function (error) {
        // Handle Errors here.
        var errorMessage = error.message;
        // ...
        window.alert("Register Error: " + errorMessage);
    });
}
function facebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        login_method = "facebook";
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        window.alert("Login Error: " + errorMessage);
    });
}
function gmail(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        login_method = "gmail";
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        window.alert("Login Error: " + errorMessage);
        // ...
      });
}
function github(){
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        login_method = "github";
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        window.alert("Login Error: " + errorMessage);
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
        if(login_method == "facebook"){
            document.getElementById('email_display').innerHTML = firebaseUser.displayName;
            document.getElementById('cred_display').innerHTML = "Through Facebook";
        }else if(login_method == "email"){
            document.getElementById('email_display').innerHTML = "Email: " + firebaseUser.email;
            document.getElementById('cred_display').innerHTML = "Through Email";
        }else if(login_method == "gmail"){
            document.getElementById('email_display').innerHTML = "Email: " + firebaseUser.email;
            document.getElementById('cred_display').innerHTML = "Through Gmail";
        }else if(login_method == "github"){
            document.getElementById('email_display').innerHTML = "Email: " + firebaseUser.email;
            document.getElementById('cred_display').innerHTML = "Through github";
        }else{
            document.getElementById('email_display').innerHTML = "Email: " + firebaseUser.email;
        }
        console.log(login_method);
        
    } else {
        console.log('Not logged in!');
        document.getElementById("not_signed_in").style.display = "initial";
        document.getElementById("signed_in").style.display = "none";
    }
})