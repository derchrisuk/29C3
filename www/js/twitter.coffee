class Twitter
  @callbackURL

  authenticate: ->
    accessor =
      consumerKey: config.twitter.consumerKey
      consumerSecret: config.twitter.consumerSecret
      serviceProvider:
        signatureMethod: 'HMAC-SHA1'
        requestTokenURL: 'http://api.twitter.com/oauth/request_token'
        userAuthorizationURL: 'https://api.twitter.com/oauth/authorize'
        accessTokenURL: 'https://api.twitter.com/oauth/access_token'
        echoURL: 'http://localhost/oauth-provider/echo'

    message =
      method: 'post'
      action: accessor.serviceProvider.requestTokenURL
      parameters: [['scope', 'http://www.google.com/m8/feeds/']]

    requestBody = OAuth.formEncode(message.parameters)
    OAuth.completeRequest message, accessor
    authorizationHeader = OAuth.getAuthorizationHeader('', message.parameters)
    requestToken = new XMLHttpRequest()

    requestToken.onreadystatechange = receiveRequestToken = ->
      if requestToken.readyState is 4
        results = OAuth.decodeForm(requestToken.responseText)
        oauth_token = OAuth.getParameter(results, 'oauth_token')
        authorize_url = 'http://api.twitter.com/oauth/authorize?oauth_token=' + oauth_token

        window.plugins.childBrowser.onLocationChange = (loc) ->
          if loc.indexOf(config.twitter.successCallbackUrl) > -1
            window.plugins.childBrowser.close()
            results = OAuth.decodeForm(requestToken.responseText)
            message =
              method: 'post'
              action: accessor.serviceProvider.accessTokenURL

            OAuth.completeRequest message,
              consumerKey: accessor.consumerKey
              consumerSecret: accessor.consumerSecret
              token: OAuth.getParameter(results, 'oauth_token')
              tokenSecret: OAuth.getParameter(results, 'oauth_token_secret')

            requestAccess = new XMLHttpRequest()
            requestAccess.onreadystatechange = receiveAccessToken = ->
              if requestAccess.readyState is 4
                params = helper.get_url_vars_from_string requestAccess.responseText
                userconfig.setItem 'twitter_token', params['oauth_token']
                userconfig.setItem 'twitter_secret_token', params['oauth_token_secret']
                userconfig.setItem 'twitter_user_name', params['screen_name']
                userconfig.setItem 'twitter_user_id', params['user_id']

            requestAccess.open message.method, message.action, true
            requestAccess.setRequestHeader 'Authorization', OAuth.getAuthorizationHeader('', message.parameters)
            requestAccess.send()

        window.plugins.childBrowser.showWebPage authorize_url

    requestToken.open message.method, message.action, true
    requestToken.setRequestHeader 'Authorization', authorizationHeader
    requestToken.setRequestHeader 'Content-Type', 'application/x-www-form-urlencoded'
    requestToken.send requestBody

  is_authenticated: ->
    userconfig.getItem('twitter_token') && userconfig.getItem('twitter_secret_token')

twitter = new Twitter()