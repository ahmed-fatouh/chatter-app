console.log('App is alive');

function switchChannel(channelName){
    console.log('Tuning into channel "' + channelName + '".');
    document.getElementById('current-channel-name').innerHTML = channelName;
    document.getElementById('channel-owner-location').innerHTML = 'upgrading.never.helps';
    document.getElementById('channel-owner-location').href = 'https://map.what3words.com/upgrading.never.helps';
    document.getElementById('current-channel-star').src = 'img/star-o.png';
}

function fillStar(){
    $('#current-channel-star').attr('src', 'img/star.png');
}

function selectTab(tabId){
    $('.tab-bar button').removeClass('selected');
    $('#' + tabId).addClass('selected')
}

function toggleEmojiBox(){
    $('#emojis').toggle();
}