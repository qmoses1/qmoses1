(function () {
  var ID = 'G-XXXXXXXXXX'; // set real GA4 Measurement ID to activate
  if (ID.indexOf('X') > -1) return;
  var s = document.createElement('script'); s.async = 1;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag; gtag('js', new Date()); gtag('config', ID);
})();
