function loadApplication () {
//Utility Variables
var emailCheckTimer = null,
    signup = false,
    resetPasswordEmail;
auth = firebase.auth();
db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});
//Pre-Submission Validations
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
function isEmpty(field) {
    if (!field.is('input'))
        return false;
    var value = field.val();
    return value.length === 0;
}
function formError(field, message) {
    field.parent().find('.message').html(message);
    field.addClass('is-invalid');
}
function displayLoading (element) {
    if (!element.hasClass('circle')) {
        element = element.find('.circle');
    }
    element.css('display', 'inline-block');
}
function loadingComplete (element) {
    if (!element.hasClass('circle')) {
        element = element.find('.circle');
    }
    element.hide();
}
//Check Email Functions
function checkEmail (e, form) {
    emailCheckTimer = null;
    var email = e.target.value;
    displayLoading(form.emailBox.next());
    if (isEmail(email)) {
        authenticateEmail(email, form);
    } else {
        form.submit.prop('disabled', true);
        formError(form.emailBox, 'Please enter a valid email address.');
        loadingComplete(form.emailBox.next());
    }
}
function authenticateEmail (email, form) {
    auth.fetchSignInMethodsForEmail(email).then(function (signInMethods) {
        if (signInMethods.length == 0) {
            //User does not exist
            if (form === login) {
                //Disable Submission
                form.submit.prop('disabled', true);
                formError(form.emailBox, 'No such email exists. <a href="#">Sign up!</a>');
                //Signup page shift
                form.emailBox.parent().find('.message a').click(switchLogin);
                registration.emailBox.val(email);
                emailCheckTimer = 1; //Signals modification in value
                registration.emailBox.focusout();
            } else if (form === registration) {
                //Enable Submission
                form.emailBox.removeClass('is-invalid');
                form.emailBox.addClass('is-valid');
                form.submit.prop('disabled', false);
            }
        } else {
            if (form === login) {
                //Enable Submission
                form.emailBox.removeClass('is-invalid');
                form.emailBox.addClass('is-valid');
                form.submit.prop('disabled', false);
            } else if (form === registration) {
                //Disable Submission
                form.submit.prop('disabled', true);
                formError(form.emailBox, 'Email already exists. <a href="#">Forgot Password?</a>');
                resetPasswordEmail = form.emailBox.val();
                form.emailBox.parent().find('a').click(confirmPasswordReset);
            }
        }
        loadingComplete(form.emailBox.next());
    }).catch(function (error) {
        //Bad input
        login.submit.prop('disabled', true);
        formError(login.emailBox, 'An error occured. Try again.');
        loadingComplete(form.emailBox.next());
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
}
function setEmailTimer (e, form) {
    //Set timer for checker
    if (emailCheckTimer) {
        clearTimeout(emailCheckTimer);
        emailCheckTimer = null;
    }
    emailCheckTimer = setTimeout(function () {checkEmail(e, form)}, 1000);
}
//Login
var login = {
    emailBox: $('.login-form .email'),
    passwordBox: $('.login-form .password'),
    submit: $('.login-form button')
};
//Force verification before submission
login.submit.prop('disabled', true);
//If email already saved
if (login.emailBox.val().length > 0) {
    login.emailBox.focusout();
}
//Any change in the emailBox
login.emailBox.on('paste keyup', function (e) {
    //Disable submission
    login.submit.prop('disabled', true);
    //Set a timer - else every keystroke will send a request to the server
    setEmailTimer(e, login);
});
//If user clicks out
login.emailBox.focusout(function (e) {
    //Check Email Directly without delay
    if (!login.emailBox.hasClass('is-invalid') && !login.emailBox.hasClass('is-valid')) { //If not already checked
        if (!emailCheckTimer) { //No modifications or checking in process/complete
            return;
        }
        clearTimeout(emailCheckTimer); //Else no longer needed
        emailCheckTimer = null;
        checkEmail(e, login);
    }
});
//Registration
var registration = {
    nameBox: $('.register-form .name'),
    passwordBox: $('.register-form .password'),
    emailBox: $('.register-form .email'),
    submit: $('.register-form button')
}
//Force verification before submission
registration.submit.prop('disabled', true);
//If email already saved
if (registration.emailBox.val().length > 0) {
    registration.emailBox.focusout();
}
//Any change in the emailBox
registration.emailBox.on('paste keyup', function (e) {
    //Disable submission
    registration.submit.prop('disabled', true);
    //Set a timer - else every keystroke will send a request to the server
    setEmailTimer(e, registration);
});
//If user clicks out
registration.emailBox.focusout(function (e) {
    //Check Email Directly without delay
    if (!registration.emailBox.hasClass('is-invalid') && !registration.emailBox.hasClass('is-valid')) { //If not already checked
        if (!emailCheckTimer) { //No modifications or checking in process/complete
            return;
        }
        clearTimeout(emailCheckTimer); //Else no longer needed
        emailCheckTimer = null;
        checkEmail(e, registration);
    }
});
//After Submission
$('.message a').click(switchLogin);
function switchLogin (e) {
    e.preventDefault();
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
}
//Login
$('#login').click(function (e) {
    //Check if anything is empty
    if (isEmpty(login.passwordBox)) {
        formError(login.passwordBox, "Please enter a valid password.");
        login.passwordBox.focus();
        return;
    }
    var button = $(this);
    //Already Processing
    if (button.find('span.circle').css('display') !== 'none') {
        return;
    }
    displayLoading(button);
    var email = login.emailBox.val(),
        password = login.passwordBox.val();
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        //Password
        if (errorCode === "auth/wrong-password") {
            formError(login.passwordBox, 'Invalid password. <a href="#">Forgot Password?</a>');
            resetPasswordEmail = login.emailBox.val();
            login.passwordBox.parent().find('a').click(confirmPasswordReset);
            login.passwordBox.val('');
        } else {
            showError(errorCode, errorMessage);
        }
        loadingComplete(button);
    });
});
//Register
$('#register').click(function () {
    //Check if any field is empty
    var focused = false;
    $.each(registration, function (key, field) {
        if (isEmpty(field)) {
            formError(field, "Please enter a valid value.");
            //Focus only on the first empty field
            if (!focused) {
                field.focus();
                focused = true;
            }
        }
    });
    if (focused) //Empty field exists
        return;
    //Loding
    var button = $(this);
    displayLoading(button);
    //Values
    var name = registration.nameBox.val(),
    password = registration.passwordBox.val(),
    email = registration.emailBox.val();
    //Create Email
    auth.createUserWithEmailAndPassword(email, password).then(function (user) {
        signup = true;
        //Send name to firebase
        user = firebase.auth().currentUser;
        if (user) {
            updateInformation(user, {displayName: name});
        } else {
            showError("Name Error", "There was an error while updating your name in the database.");
        }
        //DATABASE
        //Make place in firestore
        db.collection('users').doc(email).set({
            chats: []
        })
        .catch(function(error) {
            showError(error.code, error.message);
        });
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
        loadingComplete(button);
    });

});

//Logout
$('#logout').click(function () {
    auth.signOut().then(function () {

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
});

//Check Authentication
auth.onAuthStateChanged(function (user) {
    hideLoading();
    if (user) {
        user.reload().then(function () {
            //Signed In Successfully
            $('.login-page').hide();
            $('.home').fadeIn();
            $('body').addClass('white');
            $('input').val('');
            $('.verify-email .email').html(user.email);
            //Remove Extra Stuff
            loadingComplete(login.submit);
            $.each(login, removePreviousErrors);
            login.submit.prop('disabled', true);
            
            loadingComplete(registration.submit);
            $.each(registration, removePreviousErrors);
            registration.submit.prop('disabled', true);
            
            //Unverified User
            if (!user.emailVerified) {
                //If signed up just now
                if (signup) {
                    signup = false;
                    sendVerification(user);
                }
                //Please Verify Email
                $('.verify-email').fadeIn();
                $('.verify-email a').click(function (e) {
                    e.preventDefault();
                    sendVerification(user);
                    $(this).parent().html('Verification Email Resent.');
                });
            } else {
                $('.verify-email').remove();
            }
        }).then(main).catch(function () {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            showError(errorCode, errorMessage);
        })
    } else {
        //Default Page (Or signed out)
        $('.home').hide();
        $('.page').hide();
        $('.login-page').fadeIn();
        $('body').removeClass('white');
    }
});

$('form').submit(function (e) {
    e.preventDefault();
    $(this).find('button').click();
});

function removePreviousErrors (key, field) {
    field.removeClass('is-valid');
    field.removeClass('is-invalid');
}

function sendVerification(user) {
    user.sendEmailVerification().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
}

//Update any information of the user
function updateInformation (user, newInfo) {
    if (newInfo) {
        user.updateProfile(newInfo).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            showError(errorCode, errorMessage);
        });
    }
}
//TODO: Forgot Password - Login & Registration
//Login = Password
//Registration = Email
function confirmPasswordReset (e) {
    e.preventDefault();
    showConfirmation("Are you sure you want to reset your password?").then(function (confirmed) {
        if (confirmed) {
            sendResetPasswordEmail().then(function () {
                $(e.target).parent().html('Password Reset Email Sent.');
            });
        }
    }).catch(function (error) {
        showError("Response Error", error);
    });
}
function sendResetPasswordEmail() {
    var emailAddress = resetPasswordEmail;
    return auth.sendPasswordResetEmail(emailAddress);
}

}