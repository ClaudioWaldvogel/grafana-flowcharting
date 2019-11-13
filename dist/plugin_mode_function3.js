"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var FlowChartingPlugin = {};
FlowChartingPlugin.logLevel = 3;
FlowChartingPlugin.logDisplay = true;
FlowChartingPlugin.defaultContextRoot = '/public/plugins/agenty-flowcharting-panel/';
FlowChartingPlugin.contextRoot = "".concat(__dirname, "/");
FlowChartingPlugin.repository = 'https://algenty.github.io/flowcharting-repository/';
FlowChartingPlugin.data = {};
FlowChartingPlugin.perf = true;
FlowChartingPlugin.marky = null;

FlowChartingPlugin.initUtils = function () {
  var u = require('./utils');

  window.u = window.u || u;
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

FlowChartingPlugin.getRepo = function () {
  var url = null;
  FlowChartingPlugin.data.info.links.forEach(function (link) {
    if (link.name === 'Documentation') url = link.url;
  });
  return url;
};

FlowChartingPlugin.init = function ($scope, templateSrv) {
  FlowChartingPlugin.initUtils();
  var contextRoot;

  if ($scope == undefined) {
    console.warn("$scope is undefined, use __dirname instead");
    contextRoot = __dirname;

    if (contextRoot.length == 0) {
      contextRoot = FlowChartingPlugin.defaultContextRoot;
      console.warn("__dirname is empty, user default", contextRoot);
    }
  } else {
    contextRoot = $scope.$root.appSubUrl + FlowChartingPlugin.defaultContextRoot;
    console.info("Context-root for plugin is", contextRoot);
  }

  this.contextRoot = contextRoot;
  FlowChartingPlugin.data = FlowChartingPlugin.loadJson();
  FlowChartingPlugin.repo = FlowChartingPlugin.getRepo();
  window.GF_PLUGIN = FlowChartingPlugin;
};

FlowChartingPlugin.getVersion = function () {
  return this.data.info.version;
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

FlowChartingPlugin.getRootPath = function () {
  return this.contextRoot;
};

FlowChartingPlugin.getPartialPath = function () {
  return "".concat(this.getRootPath(), "/partials/");
  ;
};

FlowChartingPlugin.getLibsPath = function () {
  return "".concat(this.getRootPath(), "/libs");
};

FlowChartingPlugin.getShapesPath = function () {
  return "".concat(this.getRootPath(), "libs/shapes");
};

FlowChartingPlugin.getMxBasePath = function () {
  return "".concat(this.contextRoot, "libs/mxgraph/javascript/dist/");
};

FlowChartingPlugin.getMxImagePath = function () {
  return "".concat(this.getMxBasePath(), "images/");
};

FlowChartingPlugin.getName = function () {
  return this.data.id;
};

FlowChartingPlugin.log = function () {};

FlowChartingPlugin.startPerf = function () {};

FlowChartingPlugin.stopPerf = function () {};

FlowChartingPlugin.popover = function (text, tagBook, tagImage) {
  var url = this.repository;
  var images = "".concat(this.repository, "images/");
  var textEncoded = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  var desc = "".concat(textEncoded);
  var book = '';
  var image = '';
  if (tagBook) book = "<a href=\"".concat(url).concat(tagBook, "\" target=\"_blank\"><i class=\"fa fa-book fa-fw\"></i>Help</a>");
  if (tagImage) image = "<a href=\"".concat(images).concat(tagImage, ".png\" target=\"_blank\"><i class=\"fa fa-image fa-fw\"></i>Example</a>");
  return "\n  <div id=\"popover\" style=\"display:flex;flex-wrap:wrap;width: 100%;\">\n    <div style=\"flex:1;height:100px;margin-bottom: 20px;\">".concat(desc, "</div>\n    <div style=\"flex:1;height:100px;margin-bottom: 20px;\">").concat(book, "</div>\n    <div style=\"flex-basis: 100%;height:100px;margin-bottom:20px;\">").concat(image, "</div>\n  </div>");
};

var _default = FlowChartingPlugin;
exports["default"] = _default;
