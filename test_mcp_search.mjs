import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = 'C:\\Users\\infor\\Desktop\\Desktop payslip app';
const serverEntry = path.join(APP, 'node_modules', '@notionhq', 'notion-mcp-server', 'bin', 'cli.mjs');

const transport = new StdioClientTransport({
  command: 'node',
  args: [serverEntry],
  env: { NOTION_TOKEN: process.env.NOTION_TOKEN },
});

const client = new Client({ name: 'test', version: '1.0.0' });
await client.connect(transport, { timeout: 30000 });
console.log('CONNECTED');

try {
  const result = await client.request(
    { method: 'tools/call', params: { name: 'API-post-search', arguments: { query: 'test' } } },
    { schema: { type: 'object', properties: {} } },
    { timeout: 15000 }
  );
  console.log('SEARCH RESULT:', JSON.stringify(result).substring(0, 500));
} catch (e) {
  console.error('SEARCH FAILED:', e.message);
  console.error(e.stack?.substring(0, 500));
}

await client.close();
console.log('DONE');
