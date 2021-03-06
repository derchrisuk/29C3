// Generated by CoffeeScript 1.4.0
var Helper, helper;

Helper = (function() {

  Helper.i18nDateFormats;

  function Helper() {
    this.i18nDateFormats = this._i18nDateFormats();
  }

  Helper.prototype._i18nDateFormats = function() {
    return {
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
  };

  Helper.prototype.formatDate = function(date, mask, utc) {
    var inner, self;
    self = this;
    inner = {};
    inner.masks = {
      "default": "ddd mmm dd yyyy HH:MM:ss",
      shortDate: "m/d/yy",
      mediumDate: "mmm d, yyyy",
      longDate: "mmmm d, yyyy",
      fullDate: "dddd, mmmm d, yyyy",
      shortTime: "h:MM TT",
      mediumTime: "h:MM:ss TT",
      longTime: "h:MM:ss TT Z",
      isoDate: "yyyy-mm-dd",
      isoTime: "HH:MM:ss",
      isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    inner._dateFormat = function() {
      var D, H, L, M, d, flags, m, o, pad, s, timezone, timezoneClip, token, y, _;
      token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
      timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
      timezoneClip = /[^-+\dA-Z]/g;
      pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
          val = "0" + val;
        }
        return val;
      };
      date = (date ? new Date(date) : new Date);
      if (isNaN(date)) {
        throw SyntaxError("invalid date");
      }
      mask = String(inner.masks[mask] || mask || inner.masks["default"]);
      if (mask.slice(0, 4) === "UTC:") {
        mask = mask.slice(4);
        utc = true;
      }
      _ = (utc ? "getUTC" : "get");
      d = date[_ + "Date"]();
      D = date[_ + "Day"]();
      m = date[_ + "Month"]();
      y = date[_ + "FullYear"]();
      H = date[_ + "Hours"]();
      M = date[_ + "Minutes"]();
      s = date[_ + "Seconds"]();
      L = date[_ + "Milliseconds"]();
      o = (utc ? 0 : date.getTimezoneOffset());
      flags = {
        d: d,
        dd: pad(d),
        ddd: self.i18nDateFormats.dayNames[D],
        dddd: self.i18nDateFormats.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: self.i18nDateFormats.monthNames[m],
        mmmm: self.i18nDateFormats.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad((L > 99 ? Math.round(L / 10) : L)),
        t: (H < 12 ? "a" : "p"),
        tt: (H < 12 ? "am" : "pm"),
        T: (H < 12 ? "A" : "P"),
        TT: (H < 12 ? "AM" : "PM"),
        Z: (utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "")),
        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ["th", "st", "nd", "rd"][(d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10)]
      };
      return mask.replace(token, function($0) {
        if ($0 in flags) {
          return flags[$0];
        } else {
          return $0.slice(1, $0.length - 1);
        }
      });
    };
    return inner._dateFormat(date, mask, utc);
  };

  Helper.prototype.getObjKeys = function(obj, keys) {
    var i;
    keys = new Array();
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }
    return keys;
  };

  Helper.prototype.clone = function(obj) {
    var flags, key, newInstance;
    if (!(obj != null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = clone(obj[key]);
    }
    return newInstance;
  };

  Helper.prototype.getURLVarsFromString = function(url) {
    var hash, vars, _i, _len, _ref;
    vars = {};
    _ref = url.slice(url.indexOf('?') + 1).split('&');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hash = _ref[_i];
      hash = hash.split('=');
      vars[hash[0]] = hash[1];
    }
    return vars;
  };

  Helper.prototype.pad = function(num, size) {
    var s;
    s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  };

  return Helper;

})();

helper = new Helper();
