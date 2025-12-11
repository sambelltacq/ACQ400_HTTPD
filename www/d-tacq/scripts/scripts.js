//misc scripts

function add_ssl_banner(parent){
    //inserts ssl banner if ssl enabled and using http
  
    function getCookie(name) {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    }
    const ssl_available = getCookie('ssl_available');    ;
    const protocol = window.location.protocol.replace(':', '');
    
    if (ssl_available === "true" && protocol == "http"){
      console.log('Inserting ssl banner')
      const https_link = window.location.href.replace('http:', 'https:');
      const ssl_banner = `
        <div class="sslBanner">
            <h2>SSL is available</h2>
            <p>
              Install <a href="CA_LINK_PLACEHOLDER">Certificate</a> and go to <a href="${https_link}">https</a>
            </p>
        </div>
      `;
      const container = document.getElementById(parent);
      container.insertAdjacentHTML('beforeend', ssl_banner); 
    }
};

function downloadDiagnostics(){
  //Fetch diagnostic files and then zip for download

  const zip = new JSZip();
  const hostname = window.location.hostname
  const timestamp = Math.floor(Date.now() / 1000);
  const archivename = `${hostname}.${timestamp}.zip`
  const max_attempts = 3;

  const diagnosticFiles = [
      '/mnt/local/rc.user',
      '/mnt/local/acq420_custom',
      '/mnt/local/sysconfig/acq400.sh',
      '/mnt/local/sysconfig/epics.sh',
      '/mnt/local/sysconfig/bos.sh',
      '/mnt/local/sysconfig/transient.init',
      '/mnt/local/network',
      '/mnt/local/sysconfig/wr.sh',
      '/mnt/local/sysconfig/site-1-peers',
      '/mnt/VERSION',
      '/d-tacq/data/acq4000.xml',
      '/d-tacq/data/acq4001.xml',
      '/d-tacq/data/acq4002.xml',
      '/d-tacq/data/acq4003.xml',
      '/d-tacq/data/acq4004.xml',
      '/d-tacq/data/acq4005.xml',
      '/d-tacq/data/acq4006.xml',
      '/d-tacq/data/adma0.xml',
      '/d-tacq/data/adma1.xml',
      '/d-tacq/data/interrupts.xml',
      '/d-tacq/data/mgt400A.xml',
      '/d-tacq/data/mgt400B.xml',
      '/d-tacq/data/sfp.xml',
      '/d-tacq/data/status.xml',
      '/d-tacq/data/temp.xml',
      '/d-tacq/data/top.xml',
      '/d-tacq/data/volts.xml',
      '/d-tacq/data/transient',
      '/d-tacq/cal/site.1.xml',
      '/d-tacq/cal/site.2.xml',
      '/d-tacq/cal/site.3.xml',
      '/d-tacq/cal/site.4.xml',
      '/d-tacq/cal/site.5.xml',
      '/d-tacq/cal/site.6.xml',
      '/d-tacq/data/acq4651.xml',
      '/d-tacq/data/acq4801.xml',
      '/d-tacq/data/acq4802.xml',
      '/tmp/fpga_status',
      '/tmp/records.dbl',
      '/tmp/dhcp.env',
      '/tmp/current.md5',
      '/tmp/esw_status',
      '/tmp/fpga_status',
      '/tmp/sys_id',
      '/tmp/resolv.conf',
      '/tmp/u-boot_env',
      //'/tmp/epics.log', //TODO: handle character files
      //'/tmp/run.transient.log',
  ];

  const fetchFile = (url, attempt, callback) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  if (xhr.responseText.trim() === '') {
                      if (attempt < max_attempts){
                          console.log(`${url} empty retying ${attempt + 1}/${max_attempts}`)
                          fetchFile(url, attempt + 1, callback);
                      } else{
                          console.error(`${url} empty retries exhausted ${attempt}/${max_attempts}`)
                          callback('ERROR: FILE EMPTY');
                      }
                  } else {
                      console.log(`${url} fetched`)
                      callback(xhr.responseText);
                  }
              } else {
                  callback("ERROR: FILE NOT FOUND");
              }
          }
      };
      xhr.send();
  }

  var completed = 0;
  for (const filepath of diagnosticFiles) {
      console.log(`Fetching ${filepath}`)
      fetchFile(filepath, 0, function(data){
          completed += 1
          const filename = filepath.split('/').pop()
          zip.file(filename, data);
          if (completed == diagnosticFiles.length){
              console.log(`Done downloading ${archivename}`);
              zip.generateAsync({ type: 'blob' }).then((content) => {
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(content);
                  a.download = archivename;
                  a.click();
                  URL.revokeObjectURL(a.href);
              });
          }
      });
  }
}


window.onload = () => {
  document.getElementById('diagnostics-button').addEventListener('click', downloadDiagnostics);
  console.log('misc scripts loaded')
};