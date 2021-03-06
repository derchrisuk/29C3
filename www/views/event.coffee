class Event
  @page

  _setField: (targetElement, value) ->
    targetElement.append(value)

  _resetLayout: ->
    # check for tpls within our event elements
    # if there exists a tpl element, don't remove it
    $('[data-is-event-field=true]', @page).each ->
      eventElement = $(@)
      if eventElement.find('.tpl').length
        eventElement.children(':not(.tpl)').remove()
        # there is no tpl found, simple set html to ''
      else
        eventElement.html('')

    $('.event-attend-button').unbind('click')

  initialize: (eventNode, options) ->
    event = @

    @page = $('#event')
    @_resetLayout()

    eventID = eventNode.attr('id')

    # calculate end time
    start_time = eventNode.find('start:first').text()
    start_splitted = start_time.split(':')
    duration_splitted = eventNode.find('duration:first').text().split(':')
    end_minute = parseInt(start_splitted[1]) + parseInt(duration_splitted[1])
    end_hour = 0
    if end_minute >= 60
      end_hour = 1
      end_minute = end_minute - 60
    end_hour = parseInt(start_splitted[0]) + parseInt(duration_splitted[0]) + end_hour
    if end_hour >= 24
      end_hour = end_hour - 24
    end_time = helper.pad(end_hour, 2) + ':' + helper.pad(end_minute, 2)
    @_setField($('#event-start-end'), 'Day ' + eventNode.parent().parent().attr('index') + ' | ' + start_time + ' - ' + end_time)

    for eventField in eventNode.children()
      fieldName = eventField.tagName
      eventField = $(eventField)

      targetElement = $("#event-#{fieldName}", @page)
      eventText = ''
      children = eventField.children()

      # <links> need special handling
      if fieldName != 'links'
        if children.length > 1
          childFieldRound = 0
          for childField in eventField.children()
            childFieldRound++
            eventText += ', ' if childFieldRound > 1
            eventText += $(childField).text()
        else
          eventText = eventField.text()

      # <links> handling
      else
        # if there is a <ul> element defined within the target element,
        # fill it by li elements
        liTpl = targetElement.find('li:first').clone().show()
        for childField in eventField.children()
          childField = $(childField)
          _liTpl = liTpl.clone()
          _liTpl.removeClass('tpl')
          _liTplLink = _liTpl.find('a:first')
          _liTplLink.html(childField.text())
          _liTplLink.attr('href', childField.attr('href'))
          eventText += $('<div/>').append(_liTpl).html()

      @_setField(targetElement, eventText)

    $('.event-attend-button').click ->
      self = $(@)
      if self.attr('id') == 'event-attend-yes'
        $("#event-#{eventID}").removeClass('event-attend')
        $('#event-attend-no').css('display', 'block')
        $('#event-attend-yes').css('display', 'none')
        personalSchedule.db.remove(eventID)
      else
        $("#event-#{eventID}").addClass('event-attend')
        $('#event-attend-yes').css('display', 'block')
        $('#event-attend-no').css('display', 'none')
        personalSchedule.db.push(eventID)
      false

    if personalSchedule.db.contains(eventID)
      $('#event-attend-yes').css('display', 'block')
      $('#event-attend-no').css('display', 'none')
    else
      $('#event-attend-no').css('display', 'block')
      $('#event-attend-yes').css('display', 'none')

    $.mobile.changePage(@page)

eventView = new Event()