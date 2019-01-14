//Pre-Submission Validations
//Login
var login = {
    emailBox: $('.login-form .email'),
    passwordBox: $('.login-form .password'),
    submit: $('.login-form button')
};
//Force verification before submission
login.submit.prop('disabled', true);
login.emailBox.focusout(authenticateEmail);
//Check entered mail first
function authenticateEmail (e) {
    var email = e.target.value;
    firebase.auth().fetchSignInMethodsForEmail(email).then(function (signInMethods) {
        if (signInMethods.length == 0) {
            //User does not exist
            login.emailBox.addClass('is-invalid');
            login.submit.prop('disabled', true);
        } else {
            //Enable Password
            login.emailBox.removeClass('is-invalid');
            login.emailBox.addClass('is-valid');
            login.submit.prop('disabled', false);
        }
    }).catch(e => {
        //Bad input
        login.emailBox.addClass('is-invalid');
        login.submit.prop('disabled', true);
    });
}
//Registration
var registration = {
    emailBox: $('.register-form .email'),
    passwordBox: $('.register-form .password'),
    nameBox: $('.register-form .name'),
    submit: $('.register-form button')
}


//After Submission
$('.message a').click(function(e){
    e.preventDefault();
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
//Login
$('#login').click(function (e) {
    var email = login.emailBox.val(),
        password = login.passwordBox.val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
    //console.log(`Email: ${email}; Password: ${password};`);
});
//Register
function register () {
    var name = registration.nameBox.val(),
        password = registration.passwordBox.val(),
        email = registration.emailBox.val();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
    //console.log(`Name: ${name}; Password: ${password}; Email: ${email}`);
}


//Logout
function logout () {
    firebase.auth().signOut().catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
}

//Check Authentication
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //Signed In Successfully
        console.log(user);
        $('.login-page').hide();
        $('.home').fadeIn();
        $('.home .user').val(user.email);
    } else {
        //Default Page (Or signed out)
        console.log('no');
        $('.home').hide();
        $('.login-page').fadeIn();
    }
});