const Chartist = require('chartist');

/**
 *
 *
 * @export
 * @class TooltipHandler
 */
export default class TooltipHandler {
  constructor(mxcell) {
    this.timeFormat = 'YYYY-MM-DD HH:mm:ss';
    this.mxcell = mxcell;
    this.checked = false;
    this.metrics = new Set();
  }

  isChecked() {
    return this.checked;
  }

  /**
   *
   *
   * @param {*} name
   * @param {*} label
   * @param {*} value
   * @param {*} color
   * @param {*} direction
   * @returns
   * @memberof TooltipHandler
   */
  addMetric() {
    this.checked = true;
    let metric = new MetricTooltip();
    this.metrics.add(metric);
    return metric;
  }

  updateDate() {
    let current_datetime = new Date();
    this.lastChange =
      current_datetime.getFullYear() +
      '-' +
      (current_datetime.getMonth() + 1) +
      '-' +
      current_datetime.getDate() +
      ' ' +
      current_datetime.getHours() +
      ':' +
      current_datetime.getMinutes() +
      ':' +
      current_datetime.getSeconds();
  }

  destroy() {
    this.metrics.clear();
    if (this.mxcell.GF_tooltipHandler) delete this.mxcell.GF_tooltipHandler;
  }

  getDiv(parentDiv) {
    // if (this.div != null) return this.div;
    if (!this.checked) return null;
    let div = document.createElement('div');
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (this.metrics.size > 0) {
      this.getDateDiv(div);
      this.metrics.forEach(metric => {
        metric.getDiv(div);
      });
    }
    return div;
  }

  getDateDiv(parentDiv) {
    let div = document.createElement('div');
    div.id = this.mxcell.mxObjectId + '_DATE';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    div.className = 'graph-tooltip-time tooltip-date';
    div.innerHTML = `${this.lastChange}`;
    return div;
  }

}

/**
 *Create a metric for tooltip
 *
 * @class MetricTooltip
 */
class MetricTooltip {
  constructor(name) {
    this.name = name;
    this.color = '#8c8980';
    this.graphs = new Set();
  }
  //name, label, value, color, direction
  setName(name) {
    this.name = name;
    return this
  }

  setLabel(label) {
    this.label = label;
    return this
  }

  setValue(value) {
    this.value = value;
    return this;
  }

  setColor(color) {
    if(color != null ) this.color = color;
    return this;
  }

  setDirection(directtion) {
    this.directtion = directtion;
    return this;
  }

  set(key, value) {
    this[key] = value;
    return this;
  }

  getDiv(parentDiv) {
    let div = document.createElement('div');
    if (parentDiv != undefined) parentDiv.appendChild(div);
    this.div = div;
    this.getTextDiv(div);
    this.getGraphsDiv(div);
    return div;
  }

  getTextDiv(parentDiv) {
    let div = document.createElement('div');
    div.classname='tooltip-text'
    let string = '';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (this.label !== undefined) {
      string += `${this.label} : `;
      string += `<span style="color:${this.color}"><b>${this.value}</b></span>`;
    }
    div.innerHTML = string;
    return div;
  }

  getGraphsDiv(parentDiv) {
    let div = document.createElement('div');
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (this.graphs.size > 0)
    this.graphs.forEach(graph => {
      graph.getDiv(div);
    });
    return div;
  }


  addGraph(type) {
    this.graphType = type;
    let graph = null;
    if (type === "line") graph = new LineGraphTooltip();
    this.graphs.add(graph);
    return graph;
  }

}

/**
 *Create a graph for tooltip
 *
 * @class GraphTooltip
 */
class GraphTooltip {
  constructor() {
    this.color = '#8c8980';
    this.type = 'unknow';
  }
  setName(name) {
    this.name = name;
    return this;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setSize(type) {
    this.type = type;
    return this;
  }

  setSerie(serie) {
    this.serie = serie;
    return this;
  }

  setScaling(low, high) {
    this.low = low;
    this.high = high;
    return this;
  }

  setColor(color) {
    if(color != null ) this.color = color;
    return this;
  }

  set(key, value) {
    this[key] = value;
    return this;
  }


  setParentDiv(div) {
    this.parentDiv = div;
    return this;
  }

  static array2Coor(arr) {
    let result = [];
    for (let index = 0; index < arr.length; index++) {
      result.push({
        x: arr[index][0],
        y: arr[index][1]
      });
    }
    return result;
  }

}

class LineGraphTooltip extends GraphTooltip {
  constructor() {
    super();
    this.type = 'line';
    this.chartistOptions = {
      showPoint: false,
      showLine: true,
      showArea: true,
      fullWidth: true,
      showLabel: false,
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      axisY: {
        showGrid: false,
        showLabel: false,
        offset: 0
      },
      chartPadding: 0,
    };
  }

  getDiv(parentDiv) {
    let coor = GraphTooltip.array2Coor(this.serie.flotpairs);
    let div = document.createElement('div');
    let color = this.color;
    this.div = div;
    if (parentDiv != undefined) parentDiv.appendChild(div);
    div.className = 'ct-chart ct-golden-section';
    if (this.size != null) div.style = `width:${metric.graphOptions.size};`;
    this.data = {
      series: [coor]
    };
    if (this.low != null) this.chartistOptions.low = metric.graphOptions.low;
    if (this.high != null) this.chartistOptions.high = metric.graphOptions.high;
    this.chart = new Chartist.Line(div, this.data, this.chartistOptions);
    this.chart.on('draw', function (context) {
      u.log(0, 'Chartis.on() context ', context);
      if (context.type === 'line' || context.type === 'area') {
        if (context.type === 'line')
          context.element.attr({
            style: `stroke: ${color}`
          });
        if (context.type === 'area')
          context.element.attr({
            style: `fill: ${color}`
          });
        context.element.animate({
          d: {
            begin: 1000 * context.index,
            dur: 1000,
            from: context.path
              .clone()
              .scale(1, 0)
              .translate(0, context.chartRect.height())
              .stringify(),
            to: context.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      }
    });
    return div;
  }
}