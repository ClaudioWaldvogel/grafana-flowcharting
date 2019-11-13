const FlowChartingPlugin = {};
FlowChartingPlugin.logLevel = 3;
FlowChartingPlugin.logDisplay = true;
FlowChartingPlugin.defaultContextRoot = '/public/plugins/agenty-flowcharting-panel/';
FlowChartingPlugin.contextRoot = `${__dirname}/`;
FlowChartingPlugin.repository = 'https://algenty.github.io/flowcharting-repository/';
// FlowChartingPlugin.mxBasePath = `${FlowChartingPlugin.contextRoot}libs/mxgraph/javascript/dist/`;
// FlowChartingPlugin.mxImagePath = `${FlowChartingPlugin.mxBasePath}images/`;
// FlowChartingPlugin.partialPath = `${FlowChartingPlugin.contextRoot}/partials/`;
FlowChartingPlugin.data = {};
FlowChartingPlugin.perf = true;
FlowChartingPlugin.marky = null;


FlowChartingPlugin.initUtils = function () {
  const u = require('./utils');
  window.u = window.u || u;
}

FlowChartingPlugin.loadJson = function () {
  let data;
  $.ajaxSetup({
    async: false
  });

  $.getJSON(`${FlowChartingPlugin.contextRoot}/plugin.json`, obj => {
    data = obj;
  });
  return data;
}

FlowChartingPlugin.getRepo = function () {
  let url = null;
  FlowChartingPlugin.data.info.links.forEach(link => {
    if (link.name === 'Documentation') url = link.url;
  });
  return url;
}

FlowChartingPlugin.init = function ($scope, templateSrv) {
  FlowChartingPlugin.initUtils();
  let contextRoot;
  if ($scope == undefined) {
    console.warn("$scope is undefined, use __dirname instead");
    contextRoot = __dirname;
    if (contextRoot.length == 0) {
      contextRoot = FlowChartingPlugin.defaultContextRoot;
      console.warn("__dirname is empty, user default", contextRoot);
    }
  }
  else {
    contextRoot = $scope.$root.appSubUrl + FlowChartingPlugin.defaultContextRoot;
    console.info("Context-root for plugin is", contextRoot);
  }
  this.contextRoot = contextRoot;
  FlowChartingPlugin.data = FlowChartingPlugin.loadJson();
  FlowChartingPlugin.repo = FlowChartingPlugin.getRepo();
  window.GF_PLUGIN = FlowChartingPlugin;
}


FlowChartingPlugin.getVersion = function () {
  return this.data.info.version;
};

FlowChartingPlugin.setPerf = function (bool) {
  FlowChartingPlugin.perf = bool;
}

FlowChartingPlugin.getLevel = function () {
  return FlowChartingPlugin.logLevel;
}

FlowChartingPlugin.setLevel = function (level) {
  FlowChartingPlugin.logLevel = level;
}

FlowChartingPlugin.getRootPath = function () {
  return this.contextRoot;
};

FlowChartingPlugin.getPartialPath = function () {
  return `${this.getRootPath()}/partials/`;;
};

FlowChartingPlugin.getLibsPath = function () {
  return `${this.getRootPath()}/libs`;
};

FlowChartingPlugin.getShapesPath = function () {
  return `${this.getRootPath()}libs/shapes`;
};

FlowChartingPlugin.getMxBasePath = function () {
  // return this.mxBasePath;
  return `${this.contextRoot}libs/mxgraph/javascript/dist/`;
};

FlowChartingPlugin.getMxImagePath = function () {
  // return this.mxImagePath;
  return `${this.getMxBasePath()}images/`;
};

FlowChartingPlugin.getName = function () {
  return this.data.id;
};

FlowChartingPlugin.log = function () {
};

FlowChartingPlugin.startPerf = function () {
};

FlowChartingPlugin.stopPerf = function () {
};

// eslint-disable-next-line func-names
FlowChartingPlugin.popover = function (text, tagBook, tagImage) {
  const url = this.repository;
  const images = `${this.repository}images/`;
  const textEncoded = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const desc = `${textEncoded}`;
  let book = '';
  let image = '';
  if (tagBook) book = `<a href="${url}${tagBook}" target="_blank"><i class="fa fa-book fa-fw"></i>Help</a>`;
  if (tagImage) image = `<a href="${images}${tagImage}.png" target="_blank"><i class="fa fa-image fa-fw"></i>Example</a>`;
  return `
  <div id="popover" style="display:flex;flex-wrap:wrap;width: 100%;">
    <div style="flex:1;height:100px;margin-bottom: 20px;">${desc}</div>
    <div style="flex:1;height:100px;margin-bottom: 20px;">${book}</div>
    <div style="flex-basis: 100%;height:100px;margin-bottom:20px;">${image}</div>
  </div>`;
};

// plugin.initUtils();
// plugin.loadJson();
// plugin.getRepo();
// window.GF_PLUGIN = window.GF_PLUGIN || plugin;
export default FlowChartingPlugin;
