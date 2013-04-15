// 
// Javascript plotting a bargraph using jQuery and jqPlot.
//


// Global variables 
var currentShotNo = 0;
var seriesLabel = [];

// Constants :
var shotjsonurl = "./data/jsonShotNo.txt";
var datajson = "./data/jsonhist";
var datajsonurl = "";		// built up using datajson plus shot number


// DtacqPlot object :

var DtacqPlot = {};

// ajax GET of data for plot
DtacqPlot.ajaxDataRenderer = function(url) {
    var ret = null;
    $.ajax({
       // Have to use synchronous here, otherwise the function
       // will return before the data is fetched.
       async: false,
       type: 'GET',
       url: url,
       dataType:"json",
       cache: false,
       timeout: 3000,
       error: function() {
         alert('Error Occurred Loading :' + url);
       },
       success: function(data) {
         var barData = [];
         barData = data.histData;
         var numLevels = barData.length;
         var levelNo;
         for (var i=0; i<numLevels; i+=1) {
            levelNo = i + 1;
            seriesLabel[i] = 'Level' + levelNo;
         }
         ret = barData;
       }
    });  // end of ajax processing
    return ret;
};

// PlotOptions object
DtacqPlot.plotOptions = {
        dataRenderer: DtacqPlot.ajaxDataRenderer,
        dataRendererOptions: {
           unusedOptionalUrl: datajsonurl
        },
        noDataIndicator: {
           show: true
        },
        seriesDefaults: {
           renderer:$.jqplot.BarRenderer,
	   rendererOptions: {
              fillToZero: true,
              barMargin: 20
           },
           shadow: false,
           pointLabels: {show: true}
        },
        legend: {
           show: true,
           labels: seriesLabel,
           placement: 'outsideGrid'
        },
        axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        axes: {
           xaxis: {
              label: 'X axis',
              renderer: $.jqplot.CategoryAxisRenderer,
              rendererOptions: {
                  sortMergedLabels: true
              }
           },
           yaxis: { 
              label: 'Y axis',
              autoscale: true,
              pad: 1.05
           }
        }
};  // end of plot options

// end of DtacqPlot object

// SHOTS object
var SHOTS = {
    url: shotjsonurl,
    delay: 1000,

    load: function() {
       var _shots = this;
       $.ajax({
         type: 'GET',
         url: this.url,
         dataType:"json",
         cache: false,
         timeout: 3000,
         error: function() {
           alert('Error Occurred Loading :' + url);
         },
         success: function(data) {
           var hostId = data.hostId;
           var shotNo = data.shotNo;
           _shots.display(hostId, shotNo);
         },
         complete: function() {
            setTimeout( function() {
              _shots.load();
            }, _shots.delay);
         }
       });
    },  // load end.

    display: function(host, shot) {
       if ( shot != currentShotNo ) {
          currentShotNo = shot;
          $('title').text(host + ' Plot Shot ' + shot);
          datajsonurl = datajson + currentShotNo + ".txt";
          $('#dtacqPlot').empty();
          plot1 = $.jqplot('dtacqPlot', datajsonurl, DtacqPlot.plotOptions);
       }
    }  // display end.

};


$(document).ready(function(){

      $.jqplot.config.enablePlugins = true;

      SHOTS.load();

});

