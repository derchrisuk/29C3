// Generated by CoffeeScript 1.3.3
var schedule;

schedule = {
  initialize: function(dayNode, options) {
    var dayIndex, duration, durationHours, durationMinutes, durationSplitted, eventNode, name, page, roomNode, rowspan, td, th, theadRow, _i, _j, _len, _len1, _ref, _ref1;
    dayIndex = dayNode.attr('index');
    page = $('#schedule');
    theadRow = page.find('thead tr');
    theadRow.find('th[data-is-room-column=1]').remove();
    page.find('td[data-is-event-cell=1]').remove();
    _ref = dayNode.find('room');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      roomNode = _ref[_i];
      roomNode = $(roomNode);
      name = roomNode.attr('name');
      if (!name) {
        continue;
      }
      th = $("<th style='width=100%'>" + name + "</th>").attr('data-is-room-column', 1);
      theadRow.append(th);
      _ref1 = roomNode.find('event');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        eventNode = _ref1[_j];
        eventNode = $(eventNode);
        duration = eventNode.find('duration:first').text();
        durationSplitted = duration.split(':');
        durationHours = durationSplitted[0];
        durationMinutes = durationSplitted[1];
        rowspan = durationHours * 4 + durationMinutes / 15;
        td = $(("<td style='background-color: #d3d3d3;' rowspan='" + rowspan + "'>") + eventNode.find('title:first').text() + '</td>').attr('data-is-event-cell', 1);
        $('#timeslot-' + eventNode.find('start:first').text().replace(':', '')).append(td);
      }
    }
    $.mobile.changePage(page);
    return $("li[data-day-index=" + dayIndex + "] .link").addClass('ui-btn-active');
  }
};
