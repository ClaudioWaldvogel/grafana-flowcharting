const FlowChartingPlugin = {}
FlowChartingPlugin.defaultContextRoot = '/public/plugins/agenty-flowcharting-panel/';
FlowChartingPlugin.contextRoot = FlowChartingPlugin.defaultContextRoot;
FlowChartingPlugin.logLevel = 3;
FlowChartingPlugin.logDisplay = true;
FlowChartingPlugin.perf = true;
FlowChartingPlugin.marky = null;

FlowChartingPlugin.initUtils = function () {
  const u = require('./utils');
  window.u = window.u || u;
}

FlowChartingPlugin.init = function ($scope, $injector, $rootScope, templateSrv) {
  FlowChartingPlugin.initUtils();
  let plugin, contextRoot;
  if ($scope == undefined) {
    console.warn("$scope is undefined, use __dirname instead");
    contextRoot = __dirname;
    if (contextRoot.length > 0) plugin = new FlowChartingPlugin(contextRoot);
    else {
      contextRoot = FlowChartingPlugin.defaultContextRoot;
      console.warn("__dirname is empty, user default", contextRoot);
    }
  }
  else {
    contextRoot = $scope.$root.appSubUrl + FlowChartingPlugin.defaultContextRoot;
    console.info("Context-root for plugin is", contextRoot);
    // this.$rootScope = $rootScope;
    // this.$scope = $scope;
    // this.$injector = $injector;
    // this.templateSrv = templateSrv;
  }
  FlowChartingPlugin.data = FlowChartingPlugin.loadJson();
  FlowChartingPlugin.repo = FlowChartingPlugin.getRepo();
  window.GF_PLUGIN = FlowChartingPlugin;
  return FlowChartingPlugin;
}

FlowChartingPlugin.setPerf = function (bool) {
  FlowChartingPlugin.perf = bool;
}

FlowChartingPlugin.getLevel = function () {
  return FlowChartingPlugin.logLevel;
}

FlowChartingPlugin.setLevel = function (level) {
  FlowChartingPlugin.logLevel = level;
}

FlowChartingPlugin.getTemplateSrv = function () {
  return FlowChartingPlugin.templateSrv;
}

FlowChartingPlugin.isLogEnable = function () {
  return FlowChartingPlugin.logDisplay;
}

FlowChartingPlugin.setLog = function (enable) {
  FlowChartingPlugin.logDisplay = enable;
}

FlowChartingPlugin.getRepo = function () {
  let url = null;
  FlowChartingPlugin.data.info.links.forEach(link => {
    if (link.name === 'Documentation') url = link.url;
  });
  return url;
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

FlowChartingPlugin.getRootPath = function () {
  return FlowChartingPlugin.contextRoot;
}

FlowChartingPlugin.getVersion = function () {
  return FlowChartingPlugin.data.info.version;
}

FlowChartingPlugin.getLibsPath = function () {
  return `${FlowChartingPlugin.getRootPath()}libs`;
}

FlowChartingPlugin.getShapesPath = function () {
  return `${FlowChartingPlugin.getLibsPath()}libs/shapes`;
}

FlowChartingPlugin.getMxBasePath = function () {
  return `${FlowChartingPlugin.getLibsPath()}/mxgraph/javascript/dist/`;
}

FlowChartingPlugin.getMxImagePath = function () {
  return `${FlowChartingPlugin.getMxBasePath()}images/`;
}

FlowChartingPlugin.getName = function () {
  return FlowChartingPlugin.data.id;
}

FlowChartingPlugin.getPartialPath = function () {
  return `${FlowChartingPlugin.getRootPath}/partials/`;
}

FlowChartingPlugin.popover = function (text, tagBook, tagImage) {
  const url = plugin.repository;
  const images = `${FlowChartingPlugin.repo}images/`;
  const textEncoded = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const desc = `${textEncoded}`;
  let book = '';
  let image = '';
  if (tagBook)
    book = `<a href="${url}${tagBook}" target="_blank"><i class="fa fa-book fa-fw"></i>Help</a>`;
  if (tagImage)
    image = `<a href="${images}${tagImage}.png" target="_blank"><i class="fa fa-image fa-fw"></i>Example</a>`;
  return `
    <div id="popover" style="display:flex;flex-wrap:wrap;width: 100%;">
      <div style="flex:1;height:100px;margin-bottom: 20px;">${desc}</div>
      <div style="flex:1;height:100px;margin-bottom: 20px;">${book}</div>
      <div style="flex-basis: 100%;height:100px;margin-bottom:20px;">${image}</div>
    </div>`;
}

FlowChartingPlugin.startPerf = function (name) {
  if (FlowChartingPlugin.perf) {
    if (FlowChartingPlugin.marky == null) FlowChartingPlugin.marky = u.getMarky();
    if (name == null) name = "Flowcharting";
    return FlowChartingPlugin.marky.mark(name);
  }
}

FlowChartingPlugin.stopPerf = function (name) {
  if (FlowChartingPlugin.perf) {
    if (name == null) name = "Flowcharting";
    let entry = FlowChartingPlugin.marky.stop(name);
    console.log("Perfomance of " + name, entry);
  }
}

FlowChartingPlugin.log = function (level, title, obj) {
  // 0 : DEBUG
  // 1 : INFO
  // 2 : WARN
  // 3 : ERROR
  // eslint-disable-next-line no-undef
  if (FlowChartingPlugin.logDisplay !== undefined && FlowChartingPlugin.logDisplay === true) {
    // eslint-disable-next-line no-undef
    if (FlowChartingPlugin.logLevel !== undefined && level >= FlowChartingPlugin.logLevel) {
      if (level === 3) {
        console.error(`ERROR : ${title}`, obj);
      }
      if (level === 2) {
        console.warn(` WARN : ${title}`, obj);
        return;
      }
      if (level === 1) {
        console.info(` INFO : ${title}`, obj);
        return;
      }
      if (level === 0) {
        console.debug(`DEBUG : ${title}`, obj);
        return;
      }
    }
  }
}

export default FlowChartingPlugin;