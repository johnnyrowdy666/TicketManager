// Client-side scanning & realtime updates
(function(){
  const resultsEl = document.getElementById('results');
  const manualInput = document.getElementById('manual-code');
  const manualBtn = document.getElementById('manual-submit');
  const cameraStatusEl = document.getElementById('camera-status');
  const cameraEl = document.getElementById('camera');

  function addResult({ orderId, status, usedAt, source }) {
    const row = document.createElement('div');
    row.className = 'tm-card';
    const body = document.createElement('div');
    body.className = 'tm-card-body';
    const badgeClass = status === 'used' ? 'tm-badge-success' : (status === 'already_used' ? 'tm-badge-warning' : 'tm-badge-danger');
    body.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <div>
          <strong>Order:</strong> ${orderId || '-'}
          · <span class="tm-badge ${badgeClass}">${status}</span>
          ${usedAt ? `<span class="tm-muted" style="margin-left:6px">(${new Date(usedAt).toLocaleString('th-TH')})</span>` : ''}
        </div>
        <div class="tm-muted">${source || ''}</div>
      </div>
    `;
    row.appendChild(body);
    resultsEl.prepend(row);
  }

  async function verifyCode(code) {
    if (!code) return;
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(code)}/use`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      const json = await res.json();
      if (!json.ok) {
        addResult({ orderId: code, status: json.error || 'error', source: 'manual' });
      } else {
        addResult({ orderId: code, status: json.status, usedAt: json.usedAt, source: 'manual' });
      }
    } catch (e) {
      addResult({ orderId: code, status: 'error', source: 'manual' });
    }
  }

  manualBtn && manualBtn.addEventListener('click', () => {
    const code = (manualInput.value || '').trim();
    verifyCode(code);
    manualInput.value = '';
  });

  // Setup SSE to reflect external updates
  try {
    const es = new EventSource('/realtime/orders');
    es.addEventListener('ticket_used', (ev) => {
      const data = JSON.parse(ev.data);
      addResult({ orderId: data.orderId, status: 'used', usedAt: data.usedAt, source: 'SSE' });
    });
  } catch (e) {}

  // Setup camera scanner via html5-qrcode if available
  async function startCamera() {
    if (window.Html5Qrcode) {
      cameraStatusEl.textContent = 'เริ่มกล้องแล้ว';
      try {
        const scanner = new Html5Qrcode('camera');
        const config = { fps: 10, qrbox: { width: 240, height: 240 } };
        await scanner.start({ facingMode: 'environment' }, config, (decodedText) => {
          if (decodedText) {
            // Expect decodedText includes order verify URL or ID
            try {
              const url = new URL(decodedText);
              const parts = url.pathname.split('/');
              const idx = parts.indexOf('tickets');
              const id = (idx !== -1 && parts[idx+2]) ? parts[idx+2] : decodedText;
              verifyCode(id);
            } catch (_) {
              verifyCode(decodedText);
            }
          }
        }, (errorMsg) => {/* ignore frame errors */});
      } catch (err) {
        cameraStatusEl.textContent = 'ไม่สามารถเปิดกล้องได้';
      }
    } else {
      cameraStatusEl.textContent = 'ไม่รองรับการสแกนด้วยกล้องบนอุปกรณ์นี้';
    }
  }

  startCamera();
})();