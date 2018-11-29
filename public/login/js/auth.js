var login_method;
var game_state;
function login() {
    var remember = document.getElementById("remeber_me").checked;
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("pass_field").value;
    if (remember) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            // Sign-out successful.
            login_method = "email";
            game_state = "start";
            window.alert("Hi " + email + ",\nWelcome to The JoJo Tank World :)\nRemember me: Yes");
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
                game_state = "start";
                // In memory persistence will be applied to the signed in Google user
                // even though the persistence was set to 'none' and a page redirect
                // occurred.
                //window.alert("Hi " + email + ",\nWelcome to The JoJo Tank World :)\nRemember me: No");
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
        game_state = "start";
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
        game_state = "start";
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
function gmail() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        login_method = "gmail";
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        game_state = "start";
        // ...
    }).catch(function (error) {
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
function github() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        login_method = "github";
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        game_state = "start";
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


function logout() {
    game_state = "over";
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.alert("Successfully logout");
        location.reload();
    }).catch(function (error) {
        // An error happened.
        var errorMessage = error.message;
        // ...
        window.alert("Logout error: " + errorMessage);
    });

}
function newGame() {
    game_state = "start";
    location.reload();
}

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser && game_state == "start") {
        var user = firebase.auth().currentUser;
        if (user != null) {
            user.providerData.forEach(function (profile) {
                console.log("Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
            });
        }
        //console.log(firebaseUser);
        document.getElementById("ldb").innerHTML = "";
        document.getElementById("html_body").style.backgroundImage = "url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543127665290&di=aa9ee51272ef443ae92d27b4e0ef6b24&imgtype=0&src=http%3A%2F%2Fpic4.zhimg.com%2F50%2F132394aa9c7d3ab479175e91cb51558b_r.jpg)";
        document.title = "Welcome to this awesome game!"
        document.getElementById("not_signed_in").style.display = "none";
        document.getElementById("signed_in").style.display = "initial";
        document.getElementById("game_over").style.display = "none";

    } else if (firebaseUser && game_state == "over") {
        document.getElementById("ldb").innerHTML = "";
        document.getElementById("html_body").style.backgroundImage = "url(http://www.gamesta.com/wp-content/uploads/2014/08/destiny3.jpg)";
        document.getElementById("not_signed_in").style.display = "none";
        document.getElementById("signed_in").style.display = "none";
        document.getElementById("game_over").style.display = "initial";

    }
    else {
        game_state = "over";
        console.log('Not logged in!');
        document.getElementById("ldb").innerHTML = "";
        document.getElementById("html_body").style.backgroundImage = "url(http://www.gamesta.com/wp-content/uploads/2014/08/destiny3.jpg)";
        document.title = "Login to this awesome game!"
        document.getElementById("not_signed_in").style.display = "initial";
        document.getElementById("signed_in").style.display = "none";
        document.getElementById("game_over").style.display = "none";
    }
})