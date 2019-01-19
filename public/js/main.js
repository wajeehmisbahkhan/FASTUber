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

showInternetStatus();

window.addEventListener('offline', showInternetStatus);

function showInternetStatus () {
    if (!isOnline) {
        showError(604, "This application does not function properly without an Internet connection.");
    }
}

//CONNECTION
function isOnline() {
    var xhr = new XMLHttpRequest();
    var file = "https://www.kirupa.com/blank.png";
    var randomNum = Math.round(Math.random() * 10000);
 
    xhr.open('HEAD', file + "?rand=" + randomNum, true);
    xhr.send();
     
    xhr.addEventListener("readystatechange", processRequest, false);
 
    function processRequest(e) {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 304) {
            return true;
        } else {
            return false;
        }
      }
    }
}

