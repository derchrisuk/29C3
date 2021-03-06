// Generated by CoffeeScript 1.3.3
var UserConfig, userconfig;

UserConfig = (function() {

  UserConfig._storageHandle;

  UserConfig._keyPrefix;

  function UserConfig() {
    this._keyPrefix = '_userconfig_';
    this._storageHandle = window.localStorage;
  }

  UserConfig.prototype._buildKey = function(key) {
    return this._keyPrefix + key;
  };

  UserConfig.prototype.setItem = function(key, value) {
    return this._storageHandle.setItem(this._buildKey(key), JSON.stringify(value));
  };

  UserConfig.prototype.getItem = function(key, defaultValue) {
    var item;
    item = this._storageHandle.getItem(this._buildKey(key));
    if (item != null) {
      return JSON.parse(item);
    } else if (defaultValue) {
      return defaultValue;
    }
  };

  return UserConfig;

})();

userconfig = new UserConfig();
