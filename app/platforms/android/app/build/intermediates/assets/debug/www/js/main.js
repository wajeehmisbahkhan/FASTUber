//ERRORS
function showConfirmation(message) {
    $('.confirmation-cover').css('display', 'flex');
    if (message) {
        $('#confirmation').html(message);
    }
    return new Promise(function (resolve, reject) {
        $('.confirmation-box button').on('click', function (e) {
            var response = $(e.target).text();
            if (response === "Yes") {
                resolve(true);
            } else if (response === "No") {
                resolve(false);
            }
            reject(new Error("Unspecified response"));
        });
    });
}
function showError(code, message) {
    $('.error-cover').css('display', 'flex');
    var error = "Code: " + code + "<br>" + message;
    $('#error').html(error);
}
function showLoading() {
    $('.load-cover').css('display', 'flex');
}
function hideLoading() {
    $('.load-cover').css('display', 'none');
}
$('.error-box a').click(sendBugMail);
function sendBugMail() {
    var mail = $(this).attr('href');
    var message = $('#error').val();
    mail += '?subject=Registration Error&body='+message;
    mail = encodeURIComponent(mail);
    $(this).attr('href', mail);
}
$('.screen-cover button').click(function () {
    $('.screen-cover').fadeOut();
});
//CONNECTION
//Cordova documentation says document.addEventListener
document.addEventListener('offline', showInternetStatus);

//TODO: Improve checking
function showInternetStatus () {
    
    showError("Connection Error", "This application does not function properly without an Internet connection.");
    
}

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
//MAIN
//Executes after user logs in
function main () {
    //Load Map
    showLoading();
    //MapInit is automatically called after loading map
    //TODO: Hide API Key-->
    $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBgnlRhU2n5lYuENs-E2dxc9tsAufQZp0g&callback=initMap')
        .done(hideLoading)
        .fail(showInternetStatus);
    //Home Page
    // var user = firebase.auth().currentUser;
    // if (user) {
    //     if (user.displayName) {
    //         $('.home .user').html(user.displayName);
    //     }
    // }
}

//Navbar
$('button.navbar-toggler').click(function (e) {
    $('.navbar-collapse').show('slide');
    e.stopImmediatePropagation();
    $('html').click(hideNav);
});
$('.navbar-nav').click(hideNav);
function hideNav (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    $('.navbar-collapse').hide('slide');
    $('html').off('click');
}