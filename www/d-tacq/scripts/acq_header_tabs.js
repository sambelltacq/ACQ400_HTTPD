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


$(document).ready(function(){
  //inserts ssl banner if ssl enabled and using http

  function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  const ssl_available = Boolean(getCookie('ssl_available'));
  const protocol = window.location.protocol.replace(':', '');
  
  if (ssl_available && protocol == "http"){
    console.log('Inserting ssl banner')
    const https_link = window.location.href.replace('http:', 'https:');
    const ssl_banner = `
      <div class="acqInfo" style="background-color: lightgray; padding: 10px; border: 1px solid black;margin: 5px;">
          <h2>SSL is available</h2>
          <p>
            Install <a href="https://dtacq.co.uk/dtacq.crt">Certificate</a> and go to <a href="${https_link}">https</a>
          </p>
      </div>
    `;
    const container = document.getElementById('contents');
    container.insertAdjacentHTML('beforeend', ssl_banner); 
  }
});