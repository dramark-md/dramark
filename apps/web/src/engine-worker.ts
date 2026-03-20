import { DocumentEngine } from '../../../packages/app-core/index.js';
import type { EngineMessage } from '../../../packages/app-core/index.js';

const engine = new DocumentEngine({ debounceMs: 180 });

engine.subscribe((snapshot) => {
  const msg: EngineMessage = { type: 'snapshot/push', snapshot };
  self.postMessage(msg);
});

self.onmessage = (event: MessageEvent<EngineMessage>) => {
  const msg = event.data;

  switch (msg.type) {
    case 'document/open':
      engine.openDocument(msg.uri, msg.sourceText);
      break;
    case 'document/update':
      engine.updateDocument(msg.uri, msg.sourceText, msg.version);
      break;
    case 'document/close':
      engine.closeDocument(msg.uri);
      break;
  }
};
