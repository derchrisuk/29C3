// Generated by CoffeeScript 1.3.3
(function() {

  $('#info-reset-twitter-auth-link').click(function() {
    twitter.resetAuthData();
    alert('Successfully removed twitter auth data');
    return false;
  });

  $('#event-use-tweetbot-checkbox').bind('change', function(event, ui) {
    if ($(this).attr('checked')) {
      return userconfig.setItem('use-tweetbot', true);
    } else {
      return userconfig.setItem('use-tweetbot', false);
    }
  });

}).call(this);
