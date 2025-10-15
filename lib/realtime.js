// Simple Server-Sent Events (SSE) broadcaster for real-time updates
const clients = new Set();

function addClient(res) {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();
    res.write(': connected\n\n');
    clients.add(res);
    res.on('close', () => { clients.delete(res); });
  } catch (_) {}
}

function broadcast(type, data) {
  const payload = `event: ${type}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch (_) {}
  }
}

module.exports = { addClient, broadcast };