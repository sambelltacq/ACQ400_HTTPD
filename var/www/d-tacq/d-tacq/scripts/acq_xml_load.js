//
//    Acq Info page built up from XML file
//

// Constants
var xml_load_delay = 1000;
var data_url_dir = "./data/";
var data_url_ext = ".xml";
var oneColMax = 10;    // Max number for one column display

// Global variables
var tableId;
var loadNo;

var AcqInfoPage = {};

AcqInfoPage.setupTable = function(pageId){

   // Append a new pageId <div> to the pageId tab,
   var tabId = '#' + pageId;
   $('<div id="div' + pageId + '">').appendTo(tabId)
                                    .addClass('acqInfo');

   // Append a pageId <table> to this.
   var divId = '#div' + pageId;
   $('<table id="acq' + pageId + '">').appendTo(divId);

   // Add the templates to the new table
   var newRow = $('#acqTable .template1').clone()
                                         .appendTo(tableId);
   newRow = $('#acqTable .template2').clone()
                                     .appendTo(tableId);
   newRow = $('#acqTable .template3').clone()
                                     .appendTo(tableId);
   newRow = $('#acqTable .template4').clone()
                                     .appendTo(tableId);

   // Remove templates after use
   $('#acqTable').remove();
};

AcqInfoPage.fillTemplate = function(row, dataItem){
  
   row.find('.item_name').text(dataItem.name);

   row.find('.item_value').attr('id', dataItem.id)
                          .text(dataItem.value);

   return row;
};

AcqInfoPage.addData = function(tpNo, dataItem){
// template1 => 1 column
// template2 => 2 columns
// template3 => 3 columns
// template4 => 4 columns

   var newRow = $(tableId + ' .template' + tpNo).clone().removeClass('template' + tpNo);
   AcqInfoPage.fillTemplate(newRow, dataItem)
     .addClass('dataRow')
     .appendTo(tableId)
     .fadeIn();
};

AcqInfoPage.modifyData = function(dataItem){

   var tableData = $(tableId + ' td.tdData');
   var old_data = tableData.find('#' + dataItem.id).text();
   if ( old_data == "" ) {
      tableData = $(tableId + ' td.tdDataMin');
      old_data = tableData.find('#' + dataItem.id).text();
   }
       
   if ( old_data == dataItem.value ) {
      tableData.find('#' + dataItem.id).text(dataItem.value)
                                       .removeClass('dataMod');
   } else {
      var newValue = "";
      var newData = [];
      var oldData = [];
      newData = dataItem.value;
      oldData = old_data;
      var newLen = newData.length;
      var oldLen = oldData.length;
      if ( newLen < oldLen ) {  // new value smaller than original, simply mark as changed
         tableData.find('#' + dataItem.id).text(dataItem.value)
                                          .addClass('dataMod');
      } else {
         for (var i=0; i < newLen; i++) {
           if ( i < oldLen ) {
              if ( newData[i] == oldData[i] ) {
                newValue = newValue + newData[i];
              } else {
                newValue = newValue + '<span class="dataMod">' + newData[i] + '</span>';
              }
           } else {  // new value longer than original, mark extra characters as changed
              newValue = newValue + '<span class="dataMod">' + newData[i] + '</span>';
           }
         }
         tableData.find('#' + dataItem.id).html(newValue);
      }
   }
};

AcqInfoPage.displayItem = function(loadNo, dataItem) {

     if ( loadNo == 1 ) {
        AcqInfoPage.addData(1, dataItem);
     } else {
        AcqInfoPage.modifyData(dataItem);
     }
};

AcqInfoPage.displayColumns = function(noCols, colItems, currItem, dataItem) {

// NB. All numbering runs from zero upwards.

     if ( currItem < colItems ) {
        AcqInfoPage.addData(noCols, dataItem);
     }  else {
        var tableData = $(tableId + ' tr.dataRow');
        var currCol = Math.floor( currItem / colItems );
        var rowNo = ( currItem - ( colItems * currCol ));
        if ( currCol == 1 ) {  // Second column
           tableData.eq(rowNo).find('.item_name2').text(dataItem.name);
           tableData.eq(rowNo).find('.item_value2').attr('id', dataItem.id)
                                                   .text(dataItem.value);
        }
        if ( currCol == 2 ) {  // Third column
           tableData.eq(rowNo).find('.item_name3').text(dataItem.name);
           tableData.eq(rowNo).find('.item_value3').attr('id', dataItem.id)
                                                   .text(dataItem.value);
        }
        if ( currCol == 3 ) {  // Fourth column
           tableData.eq(rowNo).find('.item_name4').text(dataItem.name);
           tableData.eq(rowNo).find('.item_value4').attr('id', dataItem.id)
                                                   .text(dataItem.value);
        }
     }
};

AcqInfoPage.checkCurrUrl = function(data_url) {
// Check whether the current tab (curr_url) matches the data (data_url) to be loaded

   var curr_url = $.url();
   var curr_pageId = curr_url.attr('anchor');
   var curr_data_url = data_url_dir + curr_pageId + data_url_ext;

   if ( curr_data_url == data_url ) {
      return true;
   } else {
      return false;
   }
};

AcqInfoPage.displayFooter = function(dataItem){

   $('title').text(dataItem.host);

   $('#acqUptime').text(dataItem.uptime);
   $('#acqHost').text(dataItem.host);
   $('#acqDate').text(dataItem.date);

};

// End of AcqInfoPage


var AcqInfoXML = {

   delay: xml_load_delay,
   
   load: function(data_url, loadNo) {
      // Load XML data
      var _acqInfo = this;
      $('#acqStatus').text(' ')
		     .removeClass('errMessage');
      $.ajax({
        type: "GET",
        timeout: 3000,		// 30 seconds
        url: data_url,
        dataType: "xml",
        cache: false,
        beforeSend: function() {
           $('#ajaxInProgress').text('Busy')
                               .addClass('progress');
        },
        error: function(xhr, status, exception) {
           var curr_url = AcqInfoPage.checkCurrUrl(data_url);
           if ( curr_url ){  // Display xml error if data_url is for current tab
              $('#acqStatus').text('XML ' + status + ' : ' + exception + ', url : ' + data_url)
                             .addClass('errMessage');
           }
        },
        success: function(data) {
           var curr_url = AcqInfoPage.checkCurrUrl(data_url);
           if ( curr_url ) {  // Display data if xml is for current tab
              if ( loadNo == 1 ) { 
                 _acqInfo.displayXML(loadNo, data);
                 loadNo++;
                 // Remove templates after use
                 $(tableId + ' .template1').remove();
                 $(tableId + ' .template2').remove();
                 $(tableId + ' .template3').remove();
                 $(tableId + ' .template4').remove();
              } else {
                 _acqInfo.displayXML(loadNo, data);
              }
           }
        },
        complete: function() {
           $('#ajaxInProgress').text('Done')
                               .removeClass('progress');
           var curr_url = AcqInfoPage.checkCurrUrl(data_url);
           if ( curr_url ){  // Reload xml if data_url is for current tab
              if ( $(':checkbox[name=refresh]').is(':checked') ) {
                 setTimeout( function() {
                   _acqInfo.load(data_url, loadNo);
                 }, _acqInfo.delay);
              }
           }
        }
      });  // end of ajax
   },  // load end

   displayXML: function(loadNo, data) {
     
     // <acqInfo> : Footer details
     var host = $(data).find('acqInfo').children('host').text();
     var uptime = $(data).find('acqInfo').children('uptime').text();
     var date = $(data).find('acqInfo').children('date').text();
     AcqInfoPage.displayFooter({'host': host, 'uptime': uptime, 'date': date});

     // <acqData> : Page content
     if ( loadNo == 1 ) {  // First load of page
        var noCols = Number($(data).find('pageFormat').children('noCols').text());
        var colItems = Number($(data).find('pageFormat').children('colItems').text());
        var len = $(data).find('acqDataXML').children('acqData').length;
        if ( noCols == undefined || colItems == undefined ) { noCols = 0 };
        if ( noCols < 1 || noCols > 4 ) { noCols = 0 };
        if ( colItems == 0 ) { noCols = 0 };
        if ( noCols == 0 ) {   // Set to default one/two columns
           if ( len > oneColMax ) {
              noCols = 2;
              colItems = Math.round(len / 2);
           } else {
              noCols = 1;
              colItems = len;
           }
        }
        var maxItems = noCols * colItems;
        if ( len > maxItems ) { 
           $('#acqStatus').text('Error in XML Specified Page Format')
                          .addClass('errMessage');
        }
     } // end of first load processing

     var currItem = 0;
     $(data)
        .find('acqDataXML')
        .children('acqData')
        .each( function() {
           var node = $(this);
           var id = node.attr('id');
           var name = node.attr('n');
           var value = node.attr('v');
           if ( value == undefined ) {
             value = node.find('v').text();
           }
           if ( loadNo > 1 || noCols == 1 ) {
              AcqInfoPage.displayItem(loadNo, {'id': id, 'name': name, 'value': value});
           } else {
              AcqInfoPage.displayColumns(noCols, colItems, currItem, {'id': id, 'name': name, 'value': value});
              currItem++;
           }
        });
   }

};  // end of AcqInfoXML


$(document).ready(function(){

  var url = $.url();
  // Get the #string from url
  var pageId = url.attr('anchor');

  var data_url = data_url_dir + pageId + data_url_ext;

  tableId = '#acq' + pageId;
  AcqInfoPage.setupTable(pageId);

  // Ensure Refresh is always ticked on page load
  $(':checkbox[name=refresh]').attr('checked', true);

  loadNo = 1;
  AcqInfoXML.load(data_url, loadNo);

  $(':checkbox[name=refresh]').change( function() {
     if ( $(this).is(':checked') ) {
       AcqInfoXML.load(data_url, loadNo);
     }
  });

});
