import { loadPluginCss } from 'app/plugins/sdk';
import { FlowchartCtrl } from './flowchart_ctrl';

console.log("FlowCharting init begin Time : ", Date.now());

loadPluginCss({
  dark: 'plugins/agenty-flowcharting-panel/css/flowchart.dark.css',
  light: 'plugins/agenty-flowcharting-panel/css/flowchart.light.css',
});

export { FlowchartCtrl as PanelCtrl };