"use strict";

console.log('App is alive');

var currentChannel = weatherChannel;
var currentLocation = {
    longitude: 32.77427,
    latitude: 4.526062,
    what3words: 'array.tempting.curable'
};
var channelsDict = {'yummy': yummy, 'uniChannel': uniChannel, 'oneWorld': oneWorld,
                'weatherChannel': weatherChannel, 'bestQuotes': bestQuotes, 'placesToVisit': placesToVisit};

function showMessages(channelObject){
    $("#message-list").empty();
    channelObject.messages.forEach(function(message, index) {
        $("#message-list").append(createMessageElement(message, index));
    });
}

function switchChannel(channelObject){
    console.log('Tuning into channel "' + channelObject.name + '".');
    $('textarea').val('');
    $('.chat-area h1').empty().append(`
        <span>#<span id="current-channel-name" class="channel">${channelObject.name}</span>&nbsp;
        <small>by <a id="channel-owner-location" href="https://map.what3words.com/${channelObject.createdBy}"
        target="_blank">${channelObject.createdBy}</a></small></span>
        <button id="current-channel-star" class="primary"><i class="${channelObject.starred ? 'fas' : 'far'}
         fa-star" onclick="toggleStar();"></i></button>
    `);
    $('li').removeClass('selected');
    $('li:contains(' + channelObject.name + ')').addClass('selected');
    currentChannel = channelObject;
    showMessages(currentChannel);
    $("#create-btn").remove();
    $("#send-button").remove();
    $('#chat-bar').append('<button id="send-button" class="accent" onclick="sendMessage()"><i class="fas fa-arrow-right"></i></button>');
}

function toggleStar(){
    $('#current-channel-star i').toggleClass('far fas');
    currentChannel.starred = !currentChannel.starred;
    $('li:contains('+currentChannel.name+') i.fa-star').toggleClass('far fas');
}

function selectTab(tabId){
    $('.tab-bar button').removeClass('selected');
    $('#' + tabId).addClass('selected')
}

function toggleEmojiBox(){
    $('#emojis').toggle();
}

/* Message */

function Message(text){
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    this.createdOn = new Date(Date.now());
    this.expiresOn = new Date(Date.now() + 0.5 * 60000);
    this.text = text;
    this.own = true;
}

function sendMessage(){
    var messageText = $('textarea').val();
    if (messageText.length == 0){
        return;
    };
    var message = new Message(messageText);
    console.log(message);
    currentChannel.messages.push(message);
    currentChannel.messageCount += 1;
    showMessages(currentChannel);
    $('#message-list').scrollTop($('#message-list')[0].scrollHeight);
    $('textarea').val('');
}

function createMessageElement(messageObject, index){
    var remainingTime = (messageObject.expiresOn - new Date(Date.now()))/(60*1000);
    if (remainingTime <= 0){
        currentChannel.messages.splice(index, 1);
        currentChannel.messageCount -= 1;
        return;
    };
    var htmlString = `
        <div id=${index} class="message ${currentLocation.what3words === messageObject.createdBy ? 'own' : ''}">
            <h4><a href="https://map.what3words.com/${messageObject.createdBy}" target="_blank" 
            class="location">${messageObject.createdBy}</a>
            <span>${messageObject.createdOn.toUTCString()}</span> 
            <em ${remainingTime <= 5 ? 'style="color: #3F51B5;"' : ''}>
                ${Math.round(remainingTime * 10) / 10} min. left
            </em></h4>
            <div>
                <p>${ messageObject.text}</p>
                <button class="accent" onclick="extendMessageLifetime(${index});">+5 min.</button>
            </div>
        </div>
    `;
    return htmlString;
}

function extendMessageLifetime(messageIndex){
    console.log(currentChannel);
    console.log(currentChannel.messages);
    console.log(currentChannel.messages[messageIndex].expiresOn);
    currentChannel.messages[messageIndex].expiresOn =  
        new Date(currentChannel.messages[messageIndex].expiresOn.getTime() + 0.5 * 60 * 1000);
    showMessages(currentChannel);
}

function createChannelElement(channelObject){
    $('ul').append(`
    <li ${channelObject.name === currentChannel.name ? 'class="selected"' : ''}
        onclick="switchChannel(channelsDict['${channelObject.name}']);">#<span class="channel">${channelObject.name}</span>
    <span class="star-chevron">
            <i class="${channelObject.starred ? 'fas' : 'far'} fa-star"></i>
            <span class="primary">${channelObject.expiresIn} min.</span>
            <span class="primary">${channelObject.messageCount} new</span>
            <i class="fas fa-chevron-right"></i>
    </span>
</li>
    `);
}

function compareNew(channel1, channel2){
    return channel2.createdOn - channel1.createdOn;
}

function compareTrending(channel1, channel2){
    return channel2.messageCount - channel1.messageCount;
}

function compareFavorite(channel1, channel2){
    return channel2.starred - channel1.starred;
}

function listChannels(mode){
    var channels = [];
    for (var key in channelsDict){
        channels.push(channelsDict[key]);
    };
    var sortedChannels;
    switch (mode){
        case 'new':
            sortedChannels = channels.sort(compareNew);
            break;
        case 'trending':
            sortedChannels = channels.sort(compareTrending);
            break;
        case 'favorites':
            sortedChannels = channels.sort(compareTrending).sort(compareFavorite);
    }
    $('ul').empty();
    for (var i=0; i<sortedChannels.length; i++){
        createChannelElement(sortedChannels[i]);
    }
}

function addNewChannel(){
    $('li').removeClass('selected');
    $('.message').remove();
    $('.chat-area h1').empty().append(`
        <input type="text" placeholder="Enter a #ChannelName" />
        <button onclick="switchChannel(currentChannel)"><i class="fas fa-times"></i> Abort</button>
    `);
    $("#send-button").remove();
    $("#create-btn").remove();
    $('#chat-bar').append('<button id="create-btn" class="accent" onclick="createChannel()">CREATE</button>');
}

function Channel(channelName){
    this.name = channelName;
    this.createdOn = new Date(Date.now());
    this.createdBy = currentLocation.what3words;
    this.starred = true;
    this.expiresIn = 100;
    this.messageCount = 0;
    this.messages = [];
}

function createChannel(){
    var newChannelName = $('h1 input').val();
    var message = $('textarea').val();
    if (newChannelName.length > 0 && message.length > 0 &&
        newChannelName.indexOf(' ') === -1 && newChannelName.indexOf('#') === 0){
        var newChannelObject = new Channel(newChannelName.slice(1));
        channelsDict[`${newChannelObject.name}`] = newChannelObject;
        currentChannel = newChannelObject;
        sendMessage();
        selectTab('new-channels');
        listChannels('new');
        switchChannel(newChannelObject);
    }
}

setInterval(function(){
    console.log('Updating current channel messages...');
    showMessages(currentChannel);
}, 1000000)