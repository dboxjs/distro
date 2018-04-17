import * as d3 from 'd3';

import makeDistroChart from './distrochart';

/* Simple Violin example
 * Single and multiline Violins
 */
export default function(config, helper) {

  var parseDate = d3.timeParse('%Y-%m-%d');

  var Violin = Object.create(helper);

  Violin.init = function(config){
    var vm = this;
    vm._config = config ? config : {};
    vm._data = [];
    vm._scales ={};
    vm._axes = {};

    
    vm._tip = vm.utils.d3.tip().attr('class', 'd3-tip')
      .html(vm._config.tip ? vm._config.tip : function(d) {
        console.log(d);
        var html ='';
        //html += d.x ? ('<span>' + (Number.isNaN(+d.x) ? d.x : vm.utils.format(d.x)) + '</span></br>') : '';
        html += d.y ? ('<span>' + (Number.isNaN(+d.y) ? d.y : vm.utils.format(d.y)) + '</span></br>') : '';
        /* html += d.magnitude ? ('<span>' + (Number.isNaN(+d.magnitude) ? d.magnitude : vm.utils.format(d.magnitude)) + '</span></br>') : '';
        html += d.color ? ('<span>' + (Number.isNaN(+d.color) ? d.color : vm.utils.format(d.color)) + '</span>') : ''; */
        return html;
      });

  }

  //-------------------------------
  //User config functions
  Violin.x = function(col){
    var vm = this;
    vm._config.x = col;
    return vm;
  }

  Violin.y = function(col){
    var vm = this;
    vm._config.y = col;
    return vm;
  }


  Violin.fill = function(col){
    var vm = this;
    vm._config.fill = col;
    return vm;
  }

  Violin.colors = function(colors) {
    var vm = this;
    if(Array.isArray(colors)) {
      //Using an array of colors for the range 
      vm._config.colors = colors;
    } else {
      //Using a preconfigured d3.scale
      vm._scales.color = colors;
    }
    return vm;
  }

  Violin.tip = function (tip) {
    var vm = this;
    vm._config.tip = tip;
    vm._tip.html(vm._config.tip);
    return vm;
  };

  //-------------------------------
  //Triggered by the chart.js;
  Violin.data = function(data){
    var vm = this;
    
    vm._data = [];
    data.forEach(function(d){
      d.x = d[vm._config.x];
      d.y = +d[vm._config.y];
      d.color = vm._config.fill ? d[vm._config.fill] : 'red';
      delete(d[vm._config.x]);
      delete(d[vm._config.y]);
      if(vm._config.fill) delete(d[vm._config.x]); 

      vm._data.push(d);
    });

    return vm;
  }

  Violin.scales = function(){
    var vm = this;



    return vm;
  }


  Violin.draw = function(){
    var vm = this;
    //Call the tip
    //vm.chart.svg().call(vm._tip);
    
    var chart1 = makeDistroChart({
        helper: vm.helper,
        data:vm._data,
        xName:'x',
        yName:'y',
        //axisLabels: {xAxis: null, yAxis: null},
        //selector:"#chart-distro1",
        //chartSize:{height:460, width:960},
        constrainExtremes:true});
    chart1.renderBoxPlot();
    chart1.renderDataPlots();
    /* 
    chart1.renderNotchBoxes({showNotchBox:false});
    chart1.renderViolinPlot({showViolinPlot:false});

    chart1.violinPlots.show({reset:true,clamp:0});
    chart1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555']});
    chart1.notchBoxes.hide();
    chart1.dataPlots.change({showPlot:false,showBeanLines:false}) */

    return vm;
  }

  Violin.init(config);
  return Violin;
}
