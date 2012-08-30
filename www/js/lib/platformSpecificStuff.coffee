ua = navigator.userAgent
platform =
  iphone: ua.match(/(iPhone|iPod|iPad)/)
  android: ua.match(/Android/)

if platform.android
  document.write "<script src=\"lib/js/cordova-2.0.0-Android.js\"></script>"
  document.write "<script src=\"lib/js/ChildBrowser-Android.js\"></script>"
else if platform.iphone
  document.write "<script src=\"lib/js/cordova-2.0.0-iOS.js\"></script>"
  document.write "<script src=\"lib/js/ChildBrowser-iOS.js\"></script>"
  ChildBrowser.install()