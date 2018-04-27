import * as d3 from 'd3';

import makeDistroChart from './distrochart';

/* Simple Distro example
 * Single and multiline Distros
 */
export default function(config, helper) {

  var parseDate = d3.timeParse('%Y-%m-%d');

  var Distro = Object.create(helper);

  Distro.init = function(config){
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
  Distro.type = function(type){
    var vm = this;
    vm._config.type = type;
    return vm;
  }

  Distro.x = function(col){
    var vm = this;
    vm._config.x = col;
    return vm;
  }

  Distro.y = function(col){
    var vm = this;
    vm._config.y = col;
    return vm;
  }

  Distro.sortBy = function(opt){
    var vm = this;
    vm._config.sortBy = opt;
    return vm;
  }

  Distro.fill = function(col){
    var vm = this;
    vm._config.fill = col;
    return vm;
  }

  Distro.id = function (col) {
    var vm = this;
    vm._config.id = col;
    return vm;
  };

  Distro.colors = function(colors) {
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

  Distro.tip = function (tip) {
    var vm = this;
    vm._config.tip = tip;
    vm._tip.html(vm._config.tip);
    return vm;
  };

  //-------------------------------
  //Triggered by the chart.js;
  Distro.data = function(data){
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

  Distro.scales = function(){
    var vm = this;



    return vm;
  }


  Distro.draw = function(){
    var vm = this;
    //Call the tip
    //vm.chart.svg().call(vm._tip);

    vm.chart.fullSvg().remove()

    var chart1 = makeDistroChart({
        chart: vm.chart,
        data: vm._data,
        id: vm._config.id,
        idName: vm._config.idName,
        events: vm._config.events,
        xName:'x',
        xSort: typeof vm._config.sortBy === 'object' &&  vm._config.sortBy.x ? vm._config.sortBy.x : null, 
        yName:'y',
        axisLabels: { xAxis: vm._config.axisLabels.xAxis, yAxis: vm._config.axisLabels.yAxis },
        selector: "#distro",
        colors: ['#fff5ca', '#fbc43a', '#5cbd00', '#084c1f'],
        chartSize: { height: vm._config.size.height, width: vm._config.size.width },
        margin: { top: vm._config.size.margin.top, right: vm._config.size.margin.right, bottom: vm._config.size.margin.bottom, left: vm._config.size.margin.left },
        constrainExtremes: true});

    if (vm.chart.config.styles) {
      d3.select('#distro .tooltip')
        .style('background-color', vm.chart.style.tooltip.backgroundColor)
        .style('line-height', 1)
        .style('font-weight', vm.chart.style.tooltip.text.fontWeight)
        .style('font-size', vm.chart.style.tooltip.text.fontSize) 
        .style('color', vm.chart.style.tooltip.text.textColor)
        .style('font-family', vm.chart.style.tooltip.text.fontFamily)
        .style('background-color', vm.chart.style.tooltip.backgroundColor)
        .style('padding', vm.chart.style.tooltip.text.padding)
        .style('border', vm.chart.style.tooltip.border.width + ' solid ' + vm.chart.style.tooltip.border.color ) 
        .style('border-radius', vm.chart.style.tooltip.border.radius);
    }

    chart1.renderBoxPlot();
    chart1.renderDataPlots();
    chart1.renderNotchBoxes({showNotchBox:false});
    chart1.renderViolinPlot({showViolinPlot:false}); 
    
    chart1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false, showMean:true, showMedian:true, showBox:false});
    chart1.dataPlots.change({showPlot:true}); 
    chart1.violinPlots.show({reset:true,clamp:0, width:100});
    //Box Plot
    /* chart1.violinPlots.hide();
    chart1.boxPlots.show({reset:true});
    chart1.notchBoxes.hide();
    chart1.dataPlots.change({showPlot:false,showBeanLines:false});  */

    //Notched Box Plot
   /*  chart1.violinPlots.hide();
    chart1.notchBoxes.show({reset:true});
    chart1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true});
    chart1.dataPlots.change({showPlot:false,showBeanLines:false}); */

    //Violin Plot Unbound
    /* chart1.violinPlots.show({reset:true,clamp:0});
    chart1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555']});
    chart1.notchBoxes.hide();
    chart1.dataPlots.change({showPlot:false,showBeanLines:false})  */

    //Violin Plot Clamp to Data
    if (vm._config.type === 'violin') {
      chart1.violinPlots.show({reset:true,clamp:1, width:50});
      chart1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555']});
      chart1.notchBoxes.hide();
      chart1.dataPlots.change({showPlot:false,showBeanLines:false}); 
    }
    

    //Bean Plot
    /* chart1.violinPlots.show({reset:true, width:75, clamp:0, resolution:30, bandwidth:50});
    chart1.dataPlots.show({showBeanLines:true,beanWidth:15,showPlot:false,colors:['#555']});
    chart1.boxPlots.hide();
    chart1.notchBoxes.hide(); */

    //Beeswarm Plot
    /* chart1.violinPlots.hide();
    chart1.dataPlots.show({showPlot:true, plotType:'beeswarm',showBeanLines:false, colors:null});
    chart1.notchBoxes.hide();
    chart1.boxPlots.hide(); */
    
    //Scatter Plot
    if (vm._config.type === 'scatter') {
      chart1.violinPlots.hide();
      chart1.dataPlots.show({showPlot:true, plotType:40, showBeanLines:false,colors:null});
      chart1.notchBoxes.hide();
      //chart1.boxPlots.hide();
    }

    
    //Trend Lines
    /* if(chart1.dataPlots.options.showLines){
        chart1.dataPlots.change({showLines:false});
    } else {
        chart1.dataPlots.change({showLines:['median','quartile1','quartile3']});
    } */


    return vm;
  }

  Distro.select = function(id) {
    var vm = this;
    console.log('this distro', id, 'is selected');
    //vm.chart.svg().select('.point.distro-' + id).attr('class', 'active');
    return this;
  };

  Distro.init(config);
  return Distro;
}
