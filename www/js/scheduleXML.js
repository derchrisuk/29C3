// Generated by CoffeeScript 1.4.0
var ScheduleXMLLoader;

ScheduleXMLLoader = (function() {

  function ScheduleXMLLoader() {}

  ScheduleXMLLoader.prototype.loadFromServer = function(programmXMLUrl, doneCallback) {
    return $.ajax({
      url: programmXMLUrl,
      dataType: 'text',
      async: false,
      timeout: 2000
    }).done(function(responseXML) {
      return doneCallback(responseXML);
    }).error(function() {
      throw 'Unable to load from server';
    });
  };

  ScheduleXMLLoader.prototype.appStartUpLoad = function() {
    var currentTimestamp, lastUpdateTimestamp;
    currentTimestamp = Math.round((new Date()).getTime() / 1000);
    lastUpdateTimestamp = userconfig.getItem('scheduleXMLLastUpdate');
    if (!lastUpdateTimestamp || (currentTimestamp - lastUpdateTimestamp > 10800)) {
      try {
        return this.loadFromServer(config.programXMLUrl, function(programXML) {
          userconfig.setItem('programXML', programXML);
          userconfig.setItem('scheduleXMLLastUpdate', currentTimestamp);
          return alert('Successfully updated schedule.xml from ' + config.programXMLUrl);
        });
      } catch (e) {

      }
    }
  };

  ScheduleXMLLoader.prototype.getXMLTree = function() {
    var xmlTree;
    xmlTree = void 0;
    try {
      xmlTree = $($.parseXML(userconfig.getItem('programXML', 'invalid')));
    } catch (e) {
      this.loadFromServer('schedule.xml', function(programXML) {
        return xmlTree = $($.parseXML(programXML));
      });
    }
    return xmlTree;
  };

  return ScheduleXMLLoader;

})();
