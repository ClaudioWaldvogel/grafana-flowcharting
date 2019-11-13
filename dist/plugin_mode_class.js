"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FlowChartingPlugin = function () {
  function FlowChartingPlugin(context_root) {
    _classCallCheck(this, FlowChartingPlugin);

    this.contextRoot = context_root;
    this.data = this.loadJson();
    this.repo = this.getRepo();
    this.logLevel = 3;
    this.logDisplay = true;
    this.perf = true;
    this.marky = null;
  }

  _createClass(FlowChartingPlugin, [{
    key: "setPerf",
    value: function setPerf(bool) {
      this.perf = bool;
    }
  }, {
    key: "getLevel",
    value: function getLevel() {
      return this.logLevel;
    }
  }, {
    key: "setLevel",
    value: function setLevel(level) {
      this.logLevel = level;
    }
  }, {
    key: "getTemplateSrv",
    value: function getTemplateSrv() {
      return this.templateSrv;
    }
  }, {
    key: "isLogEnable",
    value: function isLogEnable() {
      return this.logDisplay;
    }
  }, {
    key: "setLog",
    value: function setLog(enable) {
      this.logDisplay = enable;
    }
  }, {
    key: "getRepo",
    value: function getRepo() {
      var url = null;
      this.data.info.links.forEach(function (link) {
        if (link.name === 'Documentation') url = link.url;
      });
      return url;
    }
  }, {
    key: "loadJson",
    value: function loadJson() {
      var data;
      $.ajaxSetup({
        async: false
      });
      $.getJSON("".concat(this.contextRoot, "/plugin.json"), function (obj) {
        data = obj;
      });
      return data;
    }
  }, {
    key: "getRootPath",
    value: function getRootPath() {
      return this.contextRoot;
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return this.data.info.version;
    }
  }, {
    key: "getLibsPath",
    value: function getLibsPath() {
      return "".concat(this.getRootPath(), "libs");
    }
  }, {
    key: "getShapesPath",
    value: function getShapesPath() {
      return "".concat(this.getLibsPath(), "libs/shapes");
    }
  }, {
    key: "getMxBasePath",
    value: function getMxBasePath() {
      return "".concat(this.getLibsPath(), "/mxgraph/javascript/dist/");
    }
  }, {
    key: "getMxImagePath",
    value: function getMxImagePath() {
      return "".concat(this.getMxBasePath(), "images/");
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.data.id;
    }
  }, {
    key: "getPartialPath",
    value: function getPartialPath() {
      return "".concat(this.getRootPath(), "/partials/");
    }
  }, {
    key: "popover",
    value: function popover(text, tagBook, tagImage) {
      var url = this.repo;
      var images = "".concat(this.repo, "images/");
      var textEncoded = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      var desc = "".concat(textEncoded);
      var book = '';
      var image = '';
      if (tagBook) book = "<a href=\"".concat(url).concat(tagBook, "\" target=\"_blank\"><i class=\"fa fa-book fa-fw\"></i>Help</a>");
      if (tagImage) image = "<a href=\"".concat(images).concat(tagImage, ".png\" target=\"_blank\"><i class=\"fa fa-image fa-fw\"></i>Example</a>");
      return "\n    <div id=\"popover\" style=\"display:flex;flex-wrap:wrap;width: 100%;\">\n      <div style=\"flex:1;height:100px;margin-bottom: 20px;\">".concat(desc, "</div>\n      <div style=\"flex:1;height:100px;margin-bottom: 20px;\">").concat(book, "</div>\n      <div style=\"flex-basis: 100%;height:100px;margin-bottom:20px;\">").concat(image, "</div>\n    </div>");
    }
  }, {
    key: "startPerf",
    value: function startPerf(name) {
      if (this.perf) {
        if (this.marky == null) this.marky = u.getMarky();
        if (name == null) name = "Flowcharting";
        return this.marky.mark(name);
      }
    }
  }, {
    key: "stopPerf",
    value: function stopPerf(name) {
      if (this.perf) {
        if (name == null) name = "Flowcharting";
        var entry = this.marky.stop(name);
        console.log("Perfomance of " + name, entry);
      }
    }
  }, {
    key: "log",
    value: function log(level, title, obj) {
      if (this.logDisplay !== undefined && this.logDisplay === true) {
        if (this.logLevel !== undefined && level >= this.logLevel) {
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
    }
  }], [{
    key: "initUtils",
    value: function initUtils() {
      var u = require('./utils');

      window.u = window.u || u;
    }
  }, {
    key: "init",
    value: function init($scope, $injector, $rootScope, templateSrv) {
      FlowChartingPlugin.initUtils();
      var plugin, contextRoot;

      if ($scope == undefined) {
        console.warn("$scope is undefined, use __dirname instead");
        contextRoot = __dirname;
        if (contextRoot.length > 0) plugin = new FlowChartingPlugin(contextRoot);else {
          contextRoot = FlowChartingPlugin.defaultContextRoot;
          console.warn("__dirname is empty, user default", contextRoot);
          plugin = new FlowChartingPlugin(contextRoot);
        }
      } else {
        contextRoot = $scope.$root.appSubUrl + FlowChartingPlugin.defaultContextRoot;
        console.info("Context-root for plugin is", contextRoot);
        plugin = new FlowChartingPlugin(contextRoot);
        plugin.$rootScope = $rootScope;
        plugin.$scope = $scope;
        plugin.$injector = $injector;
        plugin.templateSrv = templateSrv;
      }

      window.GF_PLUGIN = plugin;
      return plugin;
    }
  }]);

  return FlowChartingPlugin;
}();

exports["default"] = FlowChartingPlugin;
FlowChartingPlugin.defaultContextRoot = '/public/plugins/agenty-flowcharting-panel/';
