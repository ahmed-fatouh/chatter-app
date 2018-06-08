console.log('App is alive');

function switchChannel(channelName){
    console.log('Tuning into channel "' + channelName + '".');
    document.getElementById('current-channel-name').innerHTML = channelName;
    document.getElementById('channel-owner-location').innerHTML = 'upgrading.never.helps';
    document.getElementById('channel-owner-location').href = 'https://map.what3words.com/upgrading.never.helps';
    $('#current-channel-star').removeClass().addClass('far fa-star');
    $('li').removeClass('selected');
    $('li:contains(' + channelName + ')').addClass('selected');
}

function toggleStar(){
    $('#current-channel-star').toggleClass('far fas');
}

function selectTab(tabId){
    $('.tab-bar button').removeClass('selected');
    $('#' + tabId).addClass('selected')
}

function toggleEmojiBox(){
    $('#emojis').toggle();
}