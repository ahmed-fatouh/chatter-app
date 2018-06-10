console.log('App is alive');

var currentChannel = weatherChannel;
var currentLocation = {
    longitude: 32.77427,
    latitude: 4.526062,
    what3words: 'array.tempting.curable'
};

function switchChannel(channel){
    console.log('Tuning into channel "' + channel.name + '".');
    document.getElementById('current-channel-name').innerHTML = channel.name;
    document.getElementById('channel-owner-location').innerHTML = channel.createdBy;
    document.getElementById('channel-owner-location').href = 'https://map.what3words.com/' + channel.createdBy;
    $('#current-channel-star').removeClass('far fas').addClass(channel.starred ? 'fas' : 'far');
    $('li').removeClass('selected');
    $('li:contains(' + channel.name + ')').addClass('selected');
    currentChannel = channel;
}

function toggleStar(){
    $('#current-channel-star').toggleClass('far fas');
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
    this.expiresOn = new Date(Date.now() + 15 * 60000);
    this.text = text;
    this.own = true;
}

function sendMessage(){
    message = new Message($('textarea').val())
    console.log(message);
    $('#message-list').append(createMessageElement(message));
    $('#message-list').scrollTop($('#message-list')[0].scrollHeight);
    $('textarea').val('');
}

function createMessageElement(messageObject){
    htmlString = `
        <div class="message ${currentLocation.what3words === messageObject.createdBy ? 'own' : ''}">
            <h4><a href="https://map.what3words.com/${messageObject.createdBy}" target="_blank" 
            class="location">${messageObject.createdBy}</a>
            <span>${messageObject.createdOn.toUTCString()}</span> 
            <em>${Math.round((messageObject.expiresOn - messageObject.createdOn)/(60*1000))} min. left</em></h4>
            <p>${ messageObject.text}</p>
            <button>+5 min.</button>
        </div>
    `;
    return htmlString;
}

function createChannelElement(channelObject){
    $('ul').append(`
    <li ${channelObject.name === currentChannel.name ? 'class="selected"' : ''}
        onclick="switchChannel(${channelObject.name});">#<span class="channel">${channelObject.name}</span>
    <span class="star-chevron">
            <i class="${channelObject.starred ? 'fas' : 'far'} fa-star"></i>
            <span>${channelObject.expiresIn} min.</span>
            <span>${channelObject.messageCount} new</span>
            <i class="fas fa-chevron-right"></i>
    </span>
</li>
    `);
}

function listChannels(){
    createChannelElement(yummy);
    createChannelElement(uniChannel);
    createChannelElement(oneWorld);
    createChannelElement(weatherChannel);
    createChannelElement(bestQuotes);
    createChannelElement(placesToVisit);
}