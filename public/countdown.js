// Countdown timer script: updates elements with [data-countdown-ts]
(function(){
  function formatDuration(ms){
    if (ms <= 0) return 'งานเริ่มแล้ว';
    var totalSeconds = Math.floor(ms / 1000);
    var days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds - minutes * 60;

    var parts = [];
    if (days > 0) parts.push(days + ' วัน');
    parts.push(String(hours).padStart(2, '0') + ' ชม.');
    parts.push(String(minutes).padStart(2, '0') + ' นาที');
    parts.push(String(seconds).padStart(2, '0') + ' วินาที');
    return parts.join(' ');
  }

  function update(node){
    try {
      var ts = Number(node.getAttribute('data-countdown-ts'));
      if (!ts || Number.isNaN(ts)) { node.style.display = 'none'; return; }
      var now = Date.now();
      var diff = ts - now;
      var textEl = node.querySelector('.countdown-text') || node;
      var text = formatDuration(diff);
      textEl.textContent = text;
      node.setAttribute('aria-live','polite');
      node.setAttribute('role','status');
      node.classList.toggle('tm-countdown-started', diff <= 0);
    } catch (_) { /* noop */ }
  }

  var nodes = [];
  function tick(){ nodes.forEach(update); }

  function init(){
    nodes = Array.prototype.slice.call(document.querySelectorAll('[data-countdown-ts]'));
    if (nodes.length === 0) return;
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();