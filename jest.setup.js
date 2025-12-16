// jest.setup.js
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (!global.Response) {
  global.Response = class Response {
      constructor(body, init) {
          this.body = body;
          this.status = init?.status || 200;
          this.headers = new Headers(init?.headers);
      }
      
      // --- ADD THIS STATIC METHOD ---
      static json(data, init) {
          return new Response(JSON.stringify(data), {
              ...init,
              headers: {
                  ...init?.headers,
                  'content-type': 'application/json',
              },
          });
      }
      // ------------------------------

      async json() {
          return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
  };
}

if (!global.Headers) {
    global.Headers = class Headers {
        constructor(init) {
            this.map = new Map(Object.entries(init || {}));
        }
        get(key) { return this.map.get(key.toLowerCase()) || null; }
        set(key, value) { this.map.set(key.toLowerCase(), value); }
        forEach(callback) { this.map.forEach(callback); } // Add forEach just in case
    };
}