async function submitLead(formEl, extra) {
  var fd = new FormData(formEl);
  var d = {}; fd.forEach(function(v, k) { d[k] = v; });
  if (extra) for (var k in extra) d[k] = extra[k];
  d.consent = fd.get('consent') ? 1 : 0;
  var fields = formEl.querySelector('.form-fields');
  var ok = formEl.querySelector('.form-ok');
  var fb = formEl.querySelector('.form-fallback');
  try {
    var r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) });
    var j = await r.json();
    fields.style.display = 'none';
    (j.ok ? ok : fb).style.display = 'block';
  } catch (e) { fields.style.display = 'none'; fb.style.display = 'block'; }
  return false;
}
