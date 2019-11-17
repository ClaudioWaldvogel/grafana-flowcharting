import XGraph from './graph_class';
import { TOnMappingObj } from './graph_class';
import StateHandler from './statesHandler';
import State from './state_class';
import Rule from './rule_class';

declare var GFP: any;
declare var mxUtils: any;
type TSourceType = 'xml' | 'csv';
type TPropType = 'id' | 'value';
export interface TFlowchartData {
  name: string;
  xml: string;
  csv: string;
  download: boolean;
  type: TSourceType;
  url: string;
  zoom: string;
  center: boolean;
  scale: boolean;
  lock: boolean;
  allowDrawio: boolean;
  tooltip: boolean;
  grid: boolean;
  bgColor: string | null;
  editorUrl: string;
  editorTheme: string;
}

/**
 * Flowchart handler
 *
 * @export
 * @class Flowchart
 */
export default class Flowchart {
  data: TFlowchartData;
  container: HTMLDivElement;
  xgraph: any;
  stateHandler: any;
  ctrl: any;
  templateSrv: any;
  width: any;
  height: any;
  states: Map<string, State> | undefined;

  constructor(name: string, xmlGraph: string, container: HTMLDivElement, ctrl: any, data: TFlowchartData) {
    GFP.log.info(`flowchart[${name}].constructor()`);
    GFP.log.debug(`flowchart[${name}].constructor() data`, data);
    this.data = data;
    this.data.name = name;
    this.data.xml = xmlGraph;
    this.data.download = false;
    this.container = container;
    this.xgraph = undefined;
    this.stateHandler = undefined;
    this.ctrl = ctrl;
    this.templateSrv = ctrl.templateSrv;
    this.import(data);
  }

  /**
   * Import data object in current flowchart
   *
   * @param {Object} obj
   * @memberof Flowchart
   */
  import(obj: any): this {
    GFP.log.info(`flowchart[${this.data.name}].import()`);
    GFP.log.debug(`flowchart[${this.data.name}].import() obj`, obj);
    this.data.download = obj.download !== undefined ? obj.download : false;
    if (obj.source) {
      this.data.type = obj.source.type;
    } else {
      this.data.type = obj.type || this.data.type || 'xml';
    }
    if (obj.source) {
      this.data.xml = obj.source.xml.value;
    } else {
      this.data.xml = obj.xml || this.data.xml || '';
    }
    if (obj.source) {
      this.data.url = obj.source.url.value;
    } else {
      this.data.url = obj.url !== undefined ? obj.url : 'http://<source>:<port>/<pathToXml>';
    }
    if (obj.options) {
      this.data.zoom = obj.options.zoom;
    } else {
      this.data.zoom = obj.zoom || '100%';
    }
    if (obj.options) {
      this.data.center = obj.options.center;
    } else {
      this.data.center = obj.center !== undefined ? obj.center : true;
    }
    if (obj.options) {
      this.data.scale = obj.options.scale;
    } else {
      this.data.scale = obj.scale !== undefined ? obj.scale : true;
    }
    if (obj.options) {
      this.data.lock = obj.options.lock;
    } else {
      this.data.lock = obj.lock !== undefined ? obj.lock : true;
    }
    if (obj.options) {
      this.data.allowDrawio = false;
    } else {
      this.data.allowDrawio = obj.allowDrawio !== undefined ? obj.allowDrawio : false;
    }
    if (obj.options) {
      this.data.tooltip = obj.options.tooltip;
    } else {
      this.data.tooltip = obj.tooltip !== undefined ? obj.tooltip : true;
    }
    if (obj.options) {
      this.data.grid = obj.options.grid;
    } else {
      this.data.grid = obj.grid !== undefined ? obj.grid : false;
    }
    if (obj.options) {
      this.data.bgColor = obj.options.bgColor;
    } else {
      this.data.bgColor = obj.bgColor;
    }
    this.data.editorUrl = obj.editorUrl !== undefined ? obj.editorUrl : 'https://www.draw.io';
    this.data.editorTheme = obj.editorTheme !== undefined ? obj.editorTheme : 'dark';
    this.init();
    return this;
  }

  static getDefaultData(): TFlowchartData {
    return {
      name: 'name',
      xml: '',
      csv: '',
      download: false,
      type: 'xml',
      url: 'http://<YourUrl>/<Your XML/drawio file/api>',
      zoom: '100%',
      center: true,
      scale: true,
      lock: true,
      allowDrawio: false,
      tooltip: false,
      grid: false,
      bgColor: null,
      editorUrl: 'https://www.draw.io',
      editorTheme: 'dark',
    };
  }

  /**
   * Return data without functions to save json in grafana
   *
   * @returns {Object} Data object
   * @memberof Flowchart
   */
  getData(): TFlowchartData {
    return this.data;
  }

  /**
   * Update states of flowchart/graph
   *
   * @param {*} rules
   * @memberof Flowchart
   */
  updateStates(rules: Rule[]) {
    // if (this.stateHandler !== undefined) this.stateHandler.updateStates(rules);
    // this.stateHandler.prepare();
    rules.forEach(rule => {
      rule.states = this.stateHandler.getStatesForRule(rule);
      if (rule.states) {
        rule.states.forEach((state: any) => {
          state.unsetState();
        });
      } else {
        GFP.log.warn('States not defined for this rule');
      }
    });
  }

  /**
   * Initialisation of flowchart class
   *
   * @memberof Flowchart
   */
  init() {
    GFP.log.info(`flowchart[${this.data.name}].init()`);
    if (this.xgraph === undefined) {
      this.xgraph = new XGraph(this.container, this.data.type, this.getContent());
    }
    if (this.data.xml !== undefined && this.data.xml !== null) {
      if (this.data.download) {
        this.xgraph.setXmlGraph(this.getContent());
      }
      if (this.data.allowDrawio) {
        this.xgraph.allowDrawio(true);
      } else {
        this.xgraph.allowDrawio(false);
      }
      this.setOptions();
      this.xgraph.drawGraph();
      if (this.data.tooltip) {
        this.xgraph.tooltipGraph(true);
      }
      if (this.data.scale) {
        this.xgraph.scaleGraph(true);
      } else {
        this.xgraph.zoomGraph(this.data.zoom);
      }
      if (this.data.center) {
        this.xgraph.centerGraph(true);
      }
      if (this.data.lock) {
        this.xgraph.lockGraph(true);
      }
      this.stateHandler = new StateHandler(this.xgraph);
    } else {
      GFP.log.error('XML Graph not defined');
    }
  }

  /**
   * Get states handler
   *
   * @returns
   * @memberof Flowchart
   */
  getStateHandler() {
    return this.stateHandler;
  }

  /**
   * Get XGraph
   *
   * @returns
   * @memberof Flowchart
   */
  getXGraph() {
    return this.xgraph;
  }

  /**
   * Init states with rules and series
   *
   * @param {*} rules
   * @param {*} series
   * @memberof Flowchart
   */
  setStates(rules: Rule[], series: any): this {
    GFP.log.info(`flowchart[${this.data.name}].setStates()`);
    // GFP.log.debug( `flowchart[${this.data.name}].setStates() rules`, rules);
    // GFP.log.debug( `flowchart[${this.data.name}].setStates() series`, series);
    if (rules === undefined) {
      GFP.log.error("Rules shoudn't be null");
    }
    if (series === undefined) {
      GFP.log.error("Series shoudn't be null");
    }
    this.stateHandler.setStates(rules, series);
    return this;
  }

  /**
   * Init options of graph
   *
   * @memberof Flowchart
   */
  setOptions(): this {
    this.setScale(this.data.scale);
    this.setCenter(this.data.center);
    this.setGrid(this.data.grid);
    this.setTooltip(this.data.tooltip);
    this.setLock(this.data.lock);
    this.setZoom(this.data.zoom);
    this.setBgColor(this.data.bgColor);
    return this;
  }

  /**
   * Apply new states (colors,text ...)
   *
   * @memberof Flowchart
   */
  applyStates(): this {
    GFP.log.info(`flowchart[${this.data.name}].applyStates()`);
    this.stateHandler.applyStates();
    return this;
  }

  /**
   * Apply options
   *
   * @memberof Flowchart
   */
  applyOptions() {
    GFP.log.info(`flowchart[${this.data.name}].refresh()`);
    this.xgraph.applyGraph(this.width, this.height);
  }

  /**
   * Refresh graph
   *
   * @memberof Flowchart
   */
  refresh() {
    this.xgraph.refresh();
  }

  /**
   * Reset and redraw graph when source changed
   *
   * @param {*} xmlGraph
   * @memberof Flowchart
   */
  redraw(xmlGraph?: string) {
    GFP.log.info(`flowchart[${this.data.name}].redraw()`);
    if (xmlGraph !== undefined) {
      this.data.xml = xmlGraph;
      this.xgraph.setXmlGraph(this.getXml(true));
    } else {
      GFP.log.warn('XML Content not defined');
      this.xgraph.setXmlGraph(this.getXml(true));
    }
    this.applyOptions();
  }

  /**
   * Reload source of graph
   *
   * @memberof Flowchart
   */
  reload() {
    GFP.log.info(`flowchart[${this.data.name}].reload()`);
    if (this.xgraph !== undefined && this.xgraph !== null) {
      this.xgraph.destroyGraph();
      this.xgraph = undefined;
      this.init();
    } else {
      this.init();
    }
  }

  setLock(bool: boolean): this {
    this.data.lock = bool;
    this.xgraph.lock = bool;
    return this;
  }

  lock(bool: boolean): this {
    if (bool !== undefined) {
      this.data.lock = bool;
    }
    this.xgraph.lockGraph(this.data.lock);
    return this;
  }

  setTooltip(bool: boolean): this {
    this.data.tooltip = bool;
    this.xgraph.tooltip = bool;
    return this;
  }

  tooltip(bool: boolean): this {
    if (bool !== undefined) {
      this.data.tooltip = bool;
    }
    this.xgraph.tooltipGraph(this.data.tooltip);
    return this;
  }

  setScale(bool: boolean): this {
    this.data.scale = bool;
    this.xgraph.scale = bool;
    return this;
  }

  setBgColor(bgColor: string): this {
    this.data.bgColor = bgColor;
    this.xgraph.bgColor = bgColor;
    return this;
  }

  bgColor(bgColor: string): this {
    this.data.bgColor = bgColor;
    if (bgColor) {
      this.xgraph.bgGraph(bgColor);
    }
    return this;
  }

  scale(bool: boolean): this {
    GFP.log.info('Flowchart.scale()');
    if (bool !== undefined) {
      this.data.scale = bool;
    }
    this.xgraph.scaleGraph(this.data.scale);
    return this;
  }

  setCenter(bool: boolean) {
    this.data.center = bool;
    this.xgraph.center = bool;
    return this;
  }

  getNamesByProp(prop: TPropType) {
    return this.xgraph.getOrignalCells(prop);
  }

  getXml(replaceVarBool: boolean): string {
    GFP.log.info(`flowchart[${this.data.name}].getXml()`);
    if (!replaceVarBool) {
      return this.data.xml;
    }
    return this.templateSrv.replaceWithText(this.data.xml);
  }

  getCsv(replaceVarBool: boolean): string {
    GFP.log.info(`flowchart[${this.data.name}].getXml()`);
    if (!replaceVarBool) {
      return this.data.csv;
    }
    return this.templateSrv.replaceWithText(this.data.csv);
  }

  getUrlEditor(): string {
    return this.data.editorUrl;
  }

  getThemeEditor(): string {
    return this.data.editorTheme;
  }

  /**
   * Get Source of graph (csv|xml) or get content from url
   *
   * @returns
   * @memberof Flowchart
   */
  getContent(): string {
    GFP.log.info(`flowchart[${this.data.name}].getContent()`);
    if (this.data.download) {
      const url = this.templateSrv.replaceWithText(this.data.url);
      const content = this.loadContent(url);
      if (content !== null) {
        return content;
      } else {
        return '';
      }
    } else {
      if (this.data.type === 'xml') {
        return this.getXml(true);
      }
      if (this.data.type === 'csv') {
        return this.getCsv(true);
      }
    }
    GFP.log.error('type unknow', this.data.type);
    return '';
  }

  /**
   * Load source from url
   *
   * @param {*} url
   * @returns
   * @memberof Flowchart
   */
  loadContent(url: string): string | null {
    GFP.log.info(`flowchart[${this.data.name}].loadContent()`);
    const req: any = mxUtils.load(url);
    if (req.getStatus() === 200) {
      return req.getText();
    } else {
      GFP.log.error('Cannot load ' + url, req.getStatus());
      return `Error when loading ${url}`;
    }
  }

  renameId(oldId: string, newId: string): this {
    this.xgraph.renameId(oldId, newId);
    return this;
  }

  applyModel(): this {
    this.data.xml = this.xgraph.getXmlModel();
    this.redraw(this.data.xml);
    return this;
  }

  center(bool: boolean): this {
    if (bool !== undefined) {
      this.data.center = bool;
    }
    this.xgraph.centerGraph(this.data.center);
    return this;
  }

  setZoom(percent: string): this {
    this.data.zoom = percent;
    this.xgraph.zoomPercent = percent;
    return this;
  }

  zoom(percent: string): this {
    if (percent !== undefined) {
      this.data.zoom = percent;
    }
    this.xgraph.zoomGraph(this.data.zoom);
    return this;
  }

  setGrid(bool: boolean): this {
    this.data.grid = bool;
    this.xgraph.grid = bool;
    return this;
  }

  grid(bool: boolean): this {
    if (bool !== undefined) {
      this.data.grid = bool;
    }
    this.xgraph.gridGraph(this.data.grid);
    return this;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  setXml(xml: string): this {
    this.data.xml = xml;
    return this;
  }

  minify() {
    this.data.xml = GFP.utils.minify(this.data.xml);
  }

  prettify() {
    this.data.xml = GFP.utils.prettify(this.data.xml);
  }

  decode() {
    if (GFP.utils.isencoded(this.data.xml)) {
      this.data.xml = GFP.utils.decode(this.data.xml, true, true, true);
    }
  }

  encode() {
    if (!GFP.utils.isencoded(this.data.xml)) {
      this.data.xml = GFP.utils.encode(this.data.xml, true, true, true);
    }
  }

  getContainer(): HTMLDivElement {
    return this.container;
  }

  setMap(onMappingObj: TOnMappingObj) {
    GFP.log.info(`flowchart[${this.data.name}].setMap()`);
    const container = this.getContainer();
    this.xgraph.setMap(onMappingObj);
    container.scrollIntoView();
    container.focus();
  }

  unsetMap() {
    this.xgraph.unsetMap();
  }
}