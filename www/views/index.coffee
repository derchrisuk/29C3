class App
  constructor: ->
    document.addEventListener('deviceready', @deviceready(), false)

  deviceready: ->
    # init info elements
    if not platform.ios
      $('#event-use-tweetbot').remove()

    else
      if userconfig.getItem('use-tweetbot') == false
        $('#event-use-tweetbot-checkbox').removeAttr('checked').checkboxradio('refresh')

    # build day tabs
    dayTabLoaded = false
    for dayNode in programXML.find('day')
      dayNode = $(dayNode)
      date = dayNode.attr('date')

      # 2012-12-27 => 27. Dec
      dateSplitted = date.split('-')
      dayNode.dayForUI = parseInt(dateSplitted[2]) + '. ' + helper.i18nDateFormats.monthNames[parseInt(dateSplitted[1]) - 1]

      dayTab = $('.tabs li:first').clone()
      dayIndex = dayNode.attr('index')
      dayTab.attr(
        'data-day-index': dayIndex
      )

      pageHref = "#schedule##{dayIndex}"

      # add schedule link to tab button
      a = dayTab.find('a:first')
      a.attr('href', pageHref)
      a.html(dayNode.dayForUI)
      a.removeClass('ui-btn-active')
      a.removeClass('ui-state-persist')

      $('.tabs').append($('<div />').append(dayTab.show()).html())

      # set active tab if current day is available event day
      if helper.formatDate(new Date(), 'yyyy-mm-dd') is date
        dayTabLoaded = true
        # i don't know why $.mobile.changePage does not work here...
        document.location.href = pageHref

    $('#event-back').attr('href', '#personalSchedule')
    personalScheduleView.initialize() if not dayTabLoaded


# prepare schedule xml
xmlLoader = new ScheduleXMLLoader()
xmlLoader.appStartUpLoad()
programXML = xmlLoader.getXMLTree()

# dynamic page content
$(document).bind 'pagebeforechange', (e, data) ->
  return if typeof data.toPage != 'string'

  parsedUrl = $.mobile.path.parseUrl(data.toPage)
  return if not parsedUrl.filename == 'index.html'

  $('body').addClass('ui-loading')

  if /^#schedule#/.test(parsedUrl.hash)
    $('li[data-day-index] .link').removeClass('ui-btn-active')

    # determine corresponding dayNode
    dayNode = $(programXML.find('day[index=' + parsedUrl.hash.split('#')[2] + ']:first'))
    scheduleView.initialize(dayNode, data.option)

    # set back link for event
    $('#event-back').attr('href', parsedUrl.href)
    e.preventDefault()

  else if /^#personalSchedule$/.test(parsedUrl.hash)
    $('li[data-day-index] .link').removeClass('ui-btn-active')

    # set back link for event
    $('#event-back').attr('href', parsedUrl.href)
    personalScheduleView.initialize()
    e.preventDefault()

  # #event# <day-index> # <room-name> # <event-id>
  # 0  1         2            3            4
  else if /^#event#[0-9]+#.*#[0-9]+$/.test(parsedUrl.hash)
    # determine corresponding event
    parsedUrlHash = parsedUrl.hash.split('#')

    dayNode   = $(programXML.find('day[index=' + unescape(parsedUrlHash[2]) + ']:first'))
    roomNode  = $(dayNode.find('room[name="' + unescape(parsedUrlHash[3]) + '"]:first'))
    eventNode = $(roomNode.find('event[id=' + unescape(parsedUrlHash[4]) + ']:first'))

    eventView.initialize(eventNode, data.option)
    e.preventDefault()

  $('body').removeClass('ui-loading')

# open external links in child browser
$(document).on 'click', '.external-link', ->
  cordova.exec('ChildBrowserCommand.showWebPage', $(@).attr('href'))
  false

# fix: https://github.com/jquery/jquery-mobile/issues/3956
$(window).resize ->
  $('.ui-header').width $(window).width()
  $('.ui-footer').width $(window).width()

app = new App()