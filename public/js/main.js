//ERRORS
$('.error-box button').click(function () {
    $('.error-cover').fadeOut();
});
function showError(code, message) {
    $('error-cover').css('display', 'flex');
    var error = "Code: " + code + "\n" + message;
    $('#error').val(error);
}

//SignIn/Registration
$('.message a').click(function(e){
    e.preventDefault();
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });
//Register
$('#register').click(function (e) {
    e.preventDefault();
    var form = $('.register-form');
    var name = form.find('.name').val(),
        password = form.find('.password').val(),
        email = form.find('.email').val();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
    //console.log(`Name: ${name}; Password: ${password}; Email: ${email}`);
});
//Login
 $('#login').click(function (e) {
    e.preventDefault();
    var form = $('.login-form');
    var email = form.find('.email').val(),
        password = form.find('.password').val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        showError(errorCode, errorMessage);
    });
    //console.log(`Email: ${email}; Password: ${password};`);
});