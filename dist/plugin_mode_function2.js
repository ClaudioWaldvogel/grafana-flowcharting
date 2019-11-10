"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var FlowChartingPlugin = {};
FlowChartingPlugin.defaultContextRoot = '/public/plugins/agenty-flowcharting-panel/';
FlowChartingPlugin.contextRoot = FlowChartingPlugin.defaultContextRoot;
FlowChartingPlugin.logLevel = 3;
FlowChartingPlugin.logDisplay = true;
FlowChartingPlugin.perf = true;
FlowChartingPlugin.marky = null;

FlowChartingPlugin.initUtils = function () {
  var u = require('./utils');

  window.u = window.u || u;
};

FlowChartingPlugin.init = function ($scope, $injector, $rootScope, templateSrv) {
  FlowChartingPlugin.initUtils();
  var plugin, contextRoot;

  if ($scope == undefined) {
    console.warn("$scope is undefined, use __dirname instead");
    contextRoot = __dirname;
    if (contextRoot.length > 0) plugin = new FlowChartingPlugin(contextRoot);else {
      contextRoot = FlowChartingPlugin.defaultContextRoot;
      console.warn("__dirname is empty, user default", contextRoot);
    }
  } else {
    contextRoot = $scope.$root.appSubUrl + FlowChartingPlugin.defaultContextRoot;
    console.info("Context-root for plugin is", contextRoot);
  }

  FlowChartingPlugin.data = FlowChartingPlugin.loadJson();
  FlowChartingPlugin.repo = FlowChartingPlugin.getRepo();
  window.GF_PLUGIN = FlowChartingPlugin;
  return FlowChartingPlugin;
};

FlowChartingPlugin.setPerf = function (bool) {
  FlowChartingPlugin.perf = bool;
};

FlowChartingPlugin.getLevel = function () {
  return FlowChartingPlugin.logLevel;
};

FlowChartingPlugin.setLevel = function (level) {
  FlowChartingPlugin.logLevel = level;
};

FlowChartingPlugin.getTemplateSrv = function () {
  return FlowChartingPlugin.templateSrv;
};

FlowChartingPlugin.isLogEnable = function () {
  return FlowChartingPlugin.logDisplay;
};

FlowChartingPlugin.setLog = function (enable) {
  FlowChartingPlugin.logDisplay = enable;
};

FlowChartingPlugin.getRepo = function () {
  var url = null;
  FlowChartingPlugin.data.info.links.forEach(function (link) {
    if (link.name === 'Documentation') url = link.url;
  });
  return url;
};

FlowChartingPlugin.loadJson = function () {
  var data;
  $.ajaxSetup({
    async: false
  });
  $.getJSON("".concat(FlowChartingPlugin.contextRoot, "/plugin.json"), function (obj) {
    data = obj;
  });
  return data;
};

FlowChartingPlugin.getRootPath = function () {
  return FlowChartingPlugin.contextRoot;
};

FlowChartingPlugin.getVersion = function () {
  return FlowChartingPlugin.data.info.version;
};

FlowChartingPlugin.getLibsPath = function () {
  return "".concat(FlowChartingPlugin.getRootPath(), "libs");
};

FlowChartingPlugin.getShapesPath = function () {
  return "".concat(FlowChartingPlugin.getLibsPath(), "libs/shapes");
};

FlowChartingPlugin.getMxBasePath = function () {
  return "".concat(FlowChartingPlugin.getLibsPath(), "/mxgraph/javascript/dist/");
};

FlowChartingPlugin.getMxImagePath = function () {
  return "".concat(FlowChartingPlugin.getMxBasePath(), "images/");
};

FlowChartingPlugin.getName = function () {
  return FlowChartingPlugin.data.id;
};

FlowChartingPlugin.getPartialPath = function () {
  return "".concat(FlowChartingPlugin.getRootPath, "/partials/");
};

FlowChartingPlugin.popover = function (text, tagBook, tagImage) {
  var url = plugin.repository;
  var images = "".concat(FlowChartingPlugin.repo, "images/");
  var textEncoded = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  var desc = "".concat(textEncoded);
  var book = '';
  var image = '';
  if (tagBook) book = "<a href=\"".concat(url).concat(tagBook, "\" target=\"_blank\"><i class=\"fa fa-book fa-fw\"></i>Help</a>");
  if (tagImage) image = "<a href=\"".concat(images).concat(tagImage, ".png\" target=\"_blank\"><i class=\"fa fa-image fa-fw\"></i>Example</a>");
  return "\n    <div id=\"popover\" style=\"display:flex;flex-wrap:wrap;width: 100%;\">\n      <div style=\"flex:1;height:100px;margin-bottom: 20px;\">".concat(desc, "</div>\n      <div style=\"flex:1;height:100px;margin-bottom: 20px;\">").concat(book, "</div>\n      <div style=\"flex-basis: 100%;height:100px;margin-bottom:20px;\">").concat(image, "</div>\n    </div>");
};

FlowChartingPlugin.startPerf = function (name) {
  if (FlowChartingPlugin.perf) {
    if (FlowChartingPlugin.marky == null) FlowChartingPlugin.marky = u.getMarky();
    if (name == null) name = "Flowcharting";
    return FlowChartingPlugin.marky.mark(name);
  }
};

FlowChartingPlugin.stopPerf = function (name) {
  if (FlowChartingPlugin.perf) {
    if (name == null) name = "Flowcharting";
    var entry = FlowChartingPlugin.marky.stop(name);
    console.log("Perfomance of " + name, entry);
  }
};

FlowChartingPlugin.log = function (level, title, obj) {
  if (FlowChartingPlugin.logDisplay !== undefined && FlowChartingPlugin.logDisplay === true) {
    if (FlowChartingPlugin.logLevel !== undefined && level >= FlowChartingPlugin.logLevel) {
      if (level === 3) {
        console.error("ERROR : ".concat(title), obj);
      }

      if (level === 2) {
        console.warn(" WARN : ".concat(title), obj);
        return;
      }

      if (level === 1) {
        console.info(" INFO : ".concat(title), obj);
        return;
      }

      if (level === 0) {
        console.debug("DEBUG : ".concat(title), obj);
        return;
      }
    }
  }
};

var _default = FlowChartingPlugin;
exports["default"] = _default;
