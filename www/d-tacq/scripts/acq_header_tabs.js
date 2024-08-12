// Tab processing ....

var AcqTabs = {};

AcqTabs.setUrlHash = function(event, ui) {
    // Set the url location.# to tab's identifier/title.
    // This #id will be used in later functionality to determine
    // which 'page' has been selected via the tab.
    document.location.hash = ui.panel.id;
};

AcqTabs.tabOptions = {
     spinner: 'Loading...',
     show: AcqTabs.setUrlHash,
     select: AcqTabs.setUrlHash,
     ajaxOptions: {
            timeout: 3000,	// 30 seconds
            error: function(xhr, status, index, anchor) {
                     $(anchor.hash).html("Could not load Tab.");
            }
     }
};  // end of tabOptions


$(document).ready(function(){

  $('#acqHeaderTabs').tabs(AcqTabs.tabOptions);

});