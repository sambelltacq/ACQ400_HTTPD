//misc scripts

function add_ssl_banner(parent){
    //inserts ssl banner if ssl enabled and using http
  
    function getCookie(name) {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    }
    const ssl_available = getCookie('ssl_available');    ;
    const protocol = window.location.protocol.replace(':', '');
  
    console.log(ssl_available)
    protocol = 'http';
    ssl_available = 'true';
    
    if (ssl_available === "true" && protocol == "http"){
      console.log('Inserting ssl banner')
      const https_link = window.location.href.replace('http:', 'https:');
      const ssl_banner = `
        <div class="acqInfo" style="background-color: lightgray; padding: 10px; border: 1px solid black;margin: 5px;">
            <h2>SSL is available</h2>
            <p>
              Install <a href="LINK_PLACEHOLDER">Certificate</a> and go to <a href="${https_link}">https</a>
            </p>
        </div>
      `;
      const container = document.getElementById(parent);
      console.log(container)
      container.insertAdjacentHTML('beforeend', ssl_banner); 
    }
};