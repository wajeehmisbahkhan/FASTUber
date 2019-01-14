//ERRORS
$('.error-box button').click(function () {
    $('.error-cover').fadeOut();
});
function showError(code, message) {
    $('error-cover').css('display', 'flex');
    var error = "Code: " + code + "\n" + message;
    $('#error').val(error);
}
function sendBugMail() {
    var mail = $(this).attr('href');
    var message = $('#error').val();
    mail += '?subject=Registration Error&body='+message;
    mail = encodeURIComponent(mail);
    $(this).attr('href', mail);
}
function hideError() {
    $('error-cover').fadeOut();
}