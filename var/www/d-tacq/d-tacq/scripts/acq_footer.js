//
//    Acq Info footer built up from XML file
//

// Constants
var footer_load_delay = 1000;
var footer_url_dir = "./data/";
var footer_url_ext = ".xml";

var AcqFooter = {};

AcqFooter.checkCurrUrl = function(data_url) {
// Check whether the current tab (curr_url) matches the data (data_url) to be loaded

   var curr_url = $.url();
   var curr_pageId = curr_url.attr('anchor');
   var curr_data_url = footer_url_dir + curr_pageId + footer_url_ext;

   if ( curr_data_url == data_url ) {
      return true;
   } else {
      return false;
   }
};

AcqFooter.displayData = function(dataItem){

   $('title').text(dataItem.host);

   $('#acqUptime').text(dataItem.uptime);
   $('#acqHost').text(dataItem.host);
   $('#acqDate').text(dataItem.date);

};

// End of AcqFooter


var AcqFooterXML = {

   delay: footer_load_delay,
   
   load: function(data_url) {
      // Load XML data
      var _acqFooter = this;
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
           var curr_url = AcqFooter.checkCurrUrl(data_url);
           if ( curr_url ){  // Display xml error if data_url is for current tab
              $('#acqStatus').text('XML ' + status + ' : ' + exception + ', url : ' + data_url)
                             .addClass('errMessage');
           }
        },
        success: function(data) {
           var curr_url = AcqFooter.checkCurrUrl(data_url);
           if ( curr_url ) {  // Display data if xml is for current tab
              // <acqInfo> :
              var host = $(data).find('acqInfo').children('host').text();
              var uptime = $(data).find('acqInfo').children('uptime').text();
              var date = $(data).find('acqInfo').children('date').text();
              AcqFooter.displayData({'host': host, 'uptime': uptime, 'date': date});
           }
        },
        complete: function() {
           $('#ajaxInProgress').text('Done')
                               .removeClass('progress');
           var curr_url = AcqFooter.checkCurrUrl(data_url);
           if ( curr_url ){  // Reload xml if data_url is for current tab
              if ( $(':checkbox[name=refresh]').is(':checked') ) {
                 setTimeout( function() {
                   _acqFooter.load(data_url);
                 }, _acqFooter.delay);
              }
           }
        }
      });  // end of ajax
   }  // load end

};  // end of AcqFooterXML


$(document).ready(function(){

  var url = $.url();
  // Get the #string from url
  var pageId = url.attr('anchor');

  var data_url = footer_url_dir + pageId + footer_url_ext;
  
  // Ensure Refresh is always ticked on page load
  $(':checkbox[name=refresh]').attr('checked', true);

  AcqFooterXML.load(data_url);

  $(':checkbox[name=refresh]').change( function() {
     if ( $(this).is(':checked') ) {
       AcqFooterXML.load(data_url);
     }
  });

});
