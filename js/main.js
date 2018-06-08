console.log('App is alive');

var currentChannel = weatherChannel;
var currentLocation = {
    longitude: 32.77427,
    latitude: 4.526062,
    what3words: 'array.tempting.curable'
};

function switchChannel(channel){
    console.log('Tuning into channel "' + channel.name + '".');
    document.getElementById('current-channel-name').innerHTML = '#' + channel.name;
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