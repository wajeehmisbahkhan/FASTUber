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
    // showLoading();
    //MapInit is automatically called after loading map
    //TODO: Hide API Key-->
    // $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBgnlRhU2n5lYuENs-E2dxc9tsAufQZp0g&callback=initMap')
    //     .done(hideLoading)
    //     .fail(showInternetStatus);
    
    //To open and close a page
    $('.nav-item').click(openPage);
    $('.page button').click(closePage);

    $('.nav-item:nth-child(2)').click();

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

function openPage (e) {
    e.preventDefault();
    var target = $(e.target);
    //TODO: Logout
    if (target.css('id') === 'logout') {
        return;
    }
    //Open page div
    $('.page').show('slide', {direction: 'down', complete: function () {
        $('.home').hide();
    }}, 'fast');

    //The specific kind of page to be opened
    var title = target.text();
    $('.page-title').text(title);
    //Load Content According to Page
    //if (title === "Messages") {
        loadMessages();
    //}

    //Press back to close
    document.addEventListener("backbutton", closePage);
}

function closePage (e) {
    e.stopImmediatePropagation();
    $('.home').show();
    $('.page').hide('slide', {direction: 'down', complete: function () {
        //Empty Content
        $('.page .content').html('');
    }}, 'fast')
    //Prevent from happening twice
    document.removeEventListener('backbutton', closePage);
}

function loadMessages () {
    showLoading();
    var db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
    });

    var email = firebase.auth().currentUser.email;
    db.collection('users').doc(email).get().then(function (doc) {
        var inbox = $('<div class="inbox"></div>');
        var chats = doc.data().chats;
        if (chats.length === 0) {
            inbox.append(foreverAlone());
            return;
        }
        //There are chat boxes
        chats.forEach(function (chatId) {
            //Get every message from individual chat
            db.collection('chats').doc(chatId).get().then(function (doc) {
                var messages = doc.data().messages,
                    participants = doc.data().participants;
                var messageSample = createMessageSample(messages[messages.length-1], participants); //Pass in the last message object
                
                messageSample.click(function (e) {
                    //Open chat message
                    e.preventDefault();
                    var navBar = $('.page nav');
                    var height = $('.page').height()-navBar.height()-parseInt(navBar.css('padding-top'))-parseInt(navBar.css('padding-bottom'));
                    $('.page .content').css('height', height);

                    var _this = $(this);
                    _this.addClass('active_chat');
                    var msgs = $('<div class="msgs"></div>');
                    var msg_history = $('<div class="msg_history"></div>');
                    messages.forEach(function (message) {
                        var msg;
                        //Someone else
                        if (message.sender !== email) {
                            msg = $('<div class="incoming_msg">' +
                            '<div class="received_msg">' +
                                '<div class="received_withd_msg">' +
                                '<p>'+message.content+'</p>' +
                                '<span class="time_date">'+message.status+'</span></div>' +
                            '</div>' +
                            '</div>');
                        } else { //Self message
                            msg = $('<div class="outgoing_msg">' +
                            '<div class="sent_msg">' +
                                '<p>'+message.content+'</p>' +
                                '<span class="time_date">'+message.status+'</span>' +
                            '</div>' +
                            '</div>');
                        }
                        msg_history.append(msg);
                    });
                    msgs.append(msg_history);
                    //Type box
                    var typeBox = $('<div class="type_msg">' +
                                        '<div class="input_msg_write">' +
                                        '<textarea maxlength="256" class="write_msg" placeholder="Type a message"></textarea>' +
                                        '<button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>' +
                                        '</div>' +
                                    '</div>');
                    msgs.append(typeBox);
                    $('.page .content').append(msgs);
                    //Give delay for click effect
                    setTimeout(function () {
                        $('.page .content .inbox').hide();
                        msgs.show();
                    }, 100);
                });
                inbox.append(messageSample);
            });
            $('.content').append(inbox);
            hideLoading();
        });
    });

    
}
//TODO: Move to messages.js
function createMessageSample (message, participants) {
    //Create the chat sample
    var sender = message.sender,
        content = message.content;
    
    //If sender is the user
    var user = firebase.auth().currentUser.email;
    if (sender === user) {
        sender = 'You';
    } else {
        //Convert email into name
        participants.forEach(function (participant) {
            if (participant.email === sender) {
                sender = participant.name;
            }
        });
    }
    var messageSample = $('<div class="chat_list">' +
        '<div class="chat_people">' +
        '<div class="chat_ib">' +
            '<h5>'+sender+'<span class="chat_date">Dec 25</span></h5>' +
            '<p>'+content+'</p>' +
        '</div>' +
        '</div>' +
    '</div>');
    return messageSample;
}
function foreverAlone () {
    //TODO: Add styling
    return $('<img src="./img/forever_alone.png" alt="Forever Alone">');
}
function sendMessage (message) {
    var data = {
        id: '',
        messages: []
    }
    return data;
}