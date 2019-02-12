//Global
var senderMail, receiverMail;
function loadMessages () {
    showLoading();
    //TODO: Make a different screen for displaying messages independantly to send new messages
    var email = firebase.auth().currentUser.email;
    db.collection('users').doc(email).get().then(function (doc) {
        var inbox = $('<div class="inbox"></div>');
        var chats = doc.data().chats;
        if (chats.length === 0) {
            hideLoading();
            inbox.append(foreverAlone());
            $('.content').append(inbox);
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
function sendMessage (chatId, content) {
    var message = {
        content: content,
        sender: email,
        status: 'sending'
    }
    db.collection('chats').doc(chatId).update({
        messages: firebase.firestore.FieldValue.arrayUnion(message)
    });
}
//First Message
function sendMessage (content) {
    var message = {
        conent: content,
        sender: email,
        status: 'sending'
    }
    // Add a new document with a generated id.
    db.collection('chats').add(message)
    .then(function(docRef) {
        db.collection('users').doc(senderMail).update({
            chats: firebase.firestore.FieldValue.arrayUnion(docRef)
        })
    })
    .catch(function(error) {
        showError(error.code, error.message);
    });
}

function createChat (senderMail, receiverMail, content) {
    

}