// 
// Javascript plotting using jQuery and jqPlot.
//


// Global variables 
var currentShotNo = 0;
var channelId = [];
var numChannels, numPoints;

// Constants :
var shotjsonurl = "./data/jsonShotNo.txt";
var datajson = "./data/jsondata";
var datajsonurl = "";		// built up using datejson plus shot number


// DtacqPlot object :

var DtacqPlot = {};

// Function to "cook" y values
// cooked y = yCalMin + ( (y - yRawMin) * ( (yCalMax - yCalMin) / (yRawMax - yRawMin) ) )
DtacqPlot.cookYValues = function(yData, yRaw, yCal) {
   var calcScale = 0;
   var yCalc = 0;
   var yCalMin = 0;
   var yCalMax = 0;
   var yRawMin = yRaw[0];
   var yRawMax = yRaw[1];

   for (var chIndx=0; chIndx<numChannels; chIndx++) {
      yCalMin = yCal[chIndx][0];
      yCalMax = yCal[chIndx][1];
      calcScale = ( ( yCalMax - yCalMin ) / ( yRawMax - yRawMin ) );
      for (var indx=0; indx<numPoints; indx++) {
         yCalc = yCalMin + ( ( yData[chIndx][indx] - yRawMin ) * calcScale );
         yData[chIndx][indx] = yCalc;
      }
   }
   return yData;
};

// ajax GET of channel data for plot
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
         channelId = data.channels;			// Array of channel Ids
         numChannels = channelId.length;		// Number of channels in data set
         numPoints = data.channelData[0].length;	// Number of points in data set
         // "cook" channel data :
         var xVal = 0;
         var yData = [];
         var yRaw = [];
         var yCal = [];
         yData = data.channelData;
         yRaw = data.yRaw;
         yCal = data.yCal;
         yData = DtacqPlot.cookYValues(yData, yRaw, yCal);
         var dataChannels = [];
         for (var chIndx=0; chIndx<numChannels; chIndx++) {
            var dataPoints = [];
            for (var indx=0; indx<numPoints; indx++) {
               var dataXY = [];
               xVal = indx * data.dt;		// calculate time = index * dt time
               dataXY[0] = xVal;
               dataXY[1] = yData[chIndx][indx];
               dataPoints[indx] = dataXY;
            }
            dataChannels[chIndx] = dataPoints;
         }
         ret = dataChannels;
       }
    });  // end of ajax processing
    return ret;
};

DtacqPlot.clickHandler = function(ev, gridpos, datapos, neighbor, plot) {
    if (neighbor) {
       var channelNo = neighbor.seriesIndex;
       if ( channelNo <= numChannels ) {
          channelNo = channelId[channelNo];
       }
       var formatStr;
       formatStr = $.jqplot.sprintf('%2s', channelNo);
       $('#chInfo').text(formatStr);
       $('#chInfo').css('color', 'blue');
       formatStr = $.jqplot.sprintf('%.6f', neighbor.data[0]);
       $('#xInfo').text(formatStr);
       $('#xInfo').css('color', 'blue');
       formatStr = $.jqplot.sprintf('%6.3f', neighbor.data[1]);
       $('#yInfo').text(formatStr);
       $('#yInfo').css('color', 'blue');
    }
};

DtacqPlot.moveHandler = function(ev, gridpos, datapos, neighbor, plot) {
       $('#chInfo').css('color', 'grey');
       $('#xInfo').css('color', 'grey');
       $('#yInfo').css('color', 'grey');
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
           showMarker: false,
           lineWidth: 1.5,
           shadow: false
        },
        axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        axes: {
           xaxis: {
              label: 'Time [s]',
              autoscale: true,
              pad: 1.0,
              renderer: $.jqplot.LinearAxisRenderer,
              tickOptions: { formatString: '%.6f' }
           },
           yaxis: { 
             label: 'Volts',
             autoscale: true,
             pad: 1.2,
             tickOptions: { formatString: '%6.3f' }
           }
        },
        highlighter: {
           show: false,
        },
        cursor:{
           show: true,
           zoom: true,
           looseZoom: true,
           dblClickReset: true,
           showVerticalLine: true,
           showHorizontalLine: true,
           showTooltip: true,
           showTooltipUnitPosition: true,
           showTooltipOutsideZoom: true
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
          $('#chNo').text(numChannels);
       }
    }  // display end.

};


$(document).ready(function(){

      $.jqplot.config.enablePlugins = true;

      SHOTS.load();

      $.jqplot.eventListenerHooks.push(['jqplotClick',DtacqPlot.clickHandler]);
      $.jqplot.eventListenerHooks.push(['jqplotMouseMove',DtacqPlot.moveHandler]);

});

