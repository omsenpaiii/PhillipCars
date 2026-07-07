const wsUrl = process.env.AGY_BROWSER_WS_URL;

class CDPClient {
  constructor() {
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.eventListeners = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => this.handleMessage(event.data);
    });
  }

  handleMessage(dataStr) {
    const data = JSON.parse(dataStr);
    const id = data.id;
    if (id && this.pending.has(id)) {
      const { resolve, reject } = this.pending.get(id);
      this.pending.delete(id);
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.result);
      }
    } else if (data.method) {
      const listeners = this.eventListeners.get(data.method) || [];
      listeners.forEach(cb => cb(data.params, data.sessionId));
    }
  }

  send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const payload = { id, method, params };
      if (sessionId) {
        payload.sessionId = sessionId;
      }
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  on(method, callback) {
    if (!this.eventListeners.has(method)) {
      this.eventListeners.set(method, []);
    }
    this.eventListeners.get(method).push(callback);
  }

  async close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = CDPClient;
