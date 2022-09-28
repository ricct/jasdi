<script async src="https://www.googletagmanager.com/gtag/js?id=AW-716934375"></script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-716934375');
 
 function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-716934375/GLdICPTFzeADEOeZ7tUC',
      'transaction_id': '',
      'event_callback': callback
  });
  return false;
}
