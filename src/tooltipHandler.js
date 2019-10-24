const Chartist = require('chartist');

/**
 *
 *
 * @export
 * @class TooltipHandler
 */
export default class TooltipHandler {
  constructor(mxcell) {
    this.defaultColor = '#8c8980';
    this.timeFormat = 'YYYY-MM-DD HH:mm:ss';
    this.mxcell = mxcell;
    this.checked = false;
    this.metrics = new Map();
    this.lineOptions = {
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
  addMetric(name, label, value, color, direction) {
    let metric = this.findTooltipValue(name);
    this.checked = true;
    let found = (metric != null) ? true : false;
    if (!found) {
      metric = {
        graphOptions: {}
      };
    }
    metric.name = name;
    metric.label = label;
    metric.value = value;
    metric.color = color != null ? color : this.defaultColor;
    metric.direction = direction;
    if (!found) this.metrics.push(metric);
    return metric
  }

  addGraph(name, type, size, serie, low, high) {
    let metric = this.findTooltipValue(name);
    let found = metric != null ? true : false;
    if (!found) {
      metric = {
        graphOptions: {}
      };
    }
    metric.name = name;
    metric.graph = true;
    metric.graphOptions.type = type;
    metric.graphOptions.size = size;
    metric.graphOptions.serie = serie;
    metric.graphOptions.low = low;
    metric.graphOptions.high = high;
    if (!found) this.metrics.push(metric);
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

  findTooltipValue(name) {
    for (let index = 0; index < this.metrics.length; index += 1) {
      const metric = this.metrics[index];
      if (metric.name === name) return metric;
    }
    return null;
  }

  destroy() {
    if (this.mxcell.GF_tooltipHandler) delete this.mxcell.GF_tooltipHandler;
  }

  getTooltipDiv(parentDiv) {
    // if (this.div != null) return this.div;
    if (!this.checked) return null;
    if(this.div != null) {
      if (parentDiv != undefined) parentDiv.appendChild(this.div);
      return this.div;
    }
    this.div = document.createElement('div');
    let div = this.div;
    div.id = this.mxcell.mxObjectId + '_GLOBAL';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (this.metrics.length > 0) {
      this.getDateDiv(div);
      let metricsDiv = document.createElement('div');
      div.appendChild(metricsDiv);
      for (let index = 0; index < this.metrics.length; index++) {
        const metric = this.metrics[index];
        if(metric.div) {
          metricsDiv.appendChild(metric.div);
          return metric.div;
        }
        let metricDiv = document.createElement('div');
        metricDiv.className = 'tooltip-metric';
        metricsDiv.appendChild(metricDiv);
        if (metric.direction != null && metric.direction === 'h')
        metricDiv.style = 'display:inline-block;*display:inline;*zoom:1';
        this.getMetricDiv(metric, metricDiv);
        this.getChartDiv(metric, metricDiv);
      }
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

  getMetricDiv(metric, parentDiv) {
    u.log(1,`TooltipHandler[${this.mxcell.mxObjectId}].getMetricDiv()`);
    u.log(0,`TooltipHandler[${this.mxcell.mxObjectId}].getMetricDiv() metric`, metric);
    let div = document.createElement('div');
    div.id = this.mxcell.mxObjectId + '_METRIC_' + metric.name;
    let string = '';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (metric !== undefined) {
      string += `${metric.label} : `;
      string += `<span style="color:${metric.color}"><b>${metric.value}</b></span>`;
    }
    div.innerHTML = string;
    return div;
  }

  getChartDiv(metric, parentDiv) {
    let div = document.createElement('div');
    div.className = 'tooltip-graph';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (metric.graph) {
      if (metric.graphOptions.type === 'line') this.getLineChartDiv(metric, div);
    }
    return div;
  }

  getLineChartDiv(metric, parentDiv) {
    let serie = metric.graphOptions.serie;
    let coor = TooltipHandler.array2Coor(serie.flotpairs);
    let div = document.createElement('div');
    if (parentDiv != undefined) parentDiv.appendChild(div);
    let color = metric.color;
    div.className = 'ct-chart ct-golden-section';
    if (metric.graphOptions.size != null) div.style = `width:${metric.graphOptions.size};`;
    let data = {
      series: [coor]
    };
    if (metric.graphOptions.low != null) this.lineOptions.low = metric.graphOptions.low;
    if (metric.graphOptions.high != null) this.lineOptions.high = metric.graphOptions.high;
    let chart = new Chartist.Line(div, data, this.lineOptions);
    metric.graphOptions.chart = chart;
    chart.on('draw', function(data) {
      u.log(0, 'Chartis.on() data ', data);
      if (data.type === 'line' || data.type === 'area') {
        if (data.type === 'line')
          data.element.attr({
            style: `stroke: ${color}`
          });
        if (data.type === 'area')
          data.element.attr({
            style: `fill: ${color}`
          });
        data.element.animate({
          d: {
            begin: 1000 * data.index,
            dur: 1000,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      }
    });
    return div;
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

/**
 *Create a metric for tooltip
 *
 * @class MetricTooltip
 */
class MetricTooltip {
  constructor(name) {
    this.name = name;
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
    this.color = color;
    return this;
  }

  setDirection(directtion) {
    this.directtion = directtion;
    return this;
  }

  set(key,value) {
    this[key] = value;
    return this;
  }

  getMetricDiv(metric, parentDiv) {
    u.log(1,`TooltipHandler[${this.mxcell.mxObjectId}].getMetricDiv()`);
    u.log(0,`TooltipHandler[${this.mxcell.mxObjectId}].getMetricDiv() metric`, metric);
    let div = document.createElement('div');
    let string = '';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (this.label !== undefined) {
      string += `${this.label} : `;
      string += `<span style="color:${metric.color}"><b>${this.value}</b></span>`;
    }
    div.innerHTML = string;
    return div;
  }

  addGraph(type) {
    this.graphType = type; 
    if(type === "line") this.graph = new GraphTooltip();
    return this.graph;
  }

}

/**
 *Create a graph for tooltip
 *
 * @class GraphTooltip
 */
class GraphTooltip {
  constructor() {
  }
  setName(name) {
    this.name = name;
    return this;
  }

  setType(type) {
    this.type= type;
    return this;
  }

  setSize(type) {
    this.type= type;
    return this;
  }

  setSerie(serie) {
    this.serie= serie;
    return this;
  }

  setScaling(low,high) {
    this.low = low;
    this.high = high;
    return this;
  }

  set(key,value) {
    this[key] = value;
    return this;
  }

  getChartDiv(metric, parentDiv) {
    this.div = document.createElement('div');
    div.className = 'tooltip-graph';
    if (parentDiv != undefined) parentDiv.appendChild(div);
    if (metric.graph) {
      if (metric.graphOptions.type === 'line') this.getLineChartDiv(this.div);
    }
    return this.div;
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

}