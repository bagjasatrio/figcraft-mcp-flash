#!/usr/bin/env node

/**
 * Diagnostic utility to test FigCraft environment & MCP readiness.
 */

const net = require('net');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('=== FIGCRAFT MCP ENVIRONMENT DIAGNOSTIC ===');
console.log(`OS: ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`Node.js: ${process.version}`);

function findCli() {
  const envPath = process.env.FIGCRAFT_CLI_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const platform = os.platform();
  const candidates = [];
  if (platform === 'win32') {
    candidates.push(
      'C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe',
      'C:\\Program Files (x86)\\ArtCraft\\FigCraft\\figcraft-cli.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Programs\\FigCraft\\figcraft-cli.exe')
    );
  } else if (platform === 'darwin') {
    candidates.push(
      '/Applications/FigCraft.app/Contents/MacOS/figcraft-cli',
      path.join(os.homedir(), 'Applications/FigCraft.app/Contents/MacOS/figcraft-cli'),
      '/usr/local/bin/figcraft-cli'
    );
  } else {
    candidates.push('/usr/bin/figcraft-cli', '/usr/local/bin/figcraft-cli');
  }

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const cliPath = findCli();
if (!cliPath) {
  console.error('\n[x] figcraft-cli binary NOT found in standard paths.');
  console.error('    Please install FigCraft or set FIGCRAFT_CLI_PATH environment variable.');
  process.exit(1);
}

console.log(`[✓] figcraft-cli located at: ${cliPath}`);

try {
  const versionOut = execSync(`"${cliPath}" --version`, { encoding: 'utf8' }).trim();
  console.log(`[✓] FigCraft CLI Version: ${versionOut}`);
} catch (e) {
  console.warn(`[!] Unable to get version: ${e.message}`);
}

const port = parseInt(process.env.FIGCRAFT_PORT, 10) || 9005;
console.log(`Checking GUI socket on port ${port}...`);

const socket = new net.Socket();
socket.setTimeout(500);

socket.on('connect', () => {
  console.log(`[✓] FigCraft GUI is RUNNING on port ${port} (Interactive Attached Mode ready)`);
  socket.destroy();
  testMcpSession(true);
});

socket.on('timeout', () => {
  console.log(`[-] Port ${port} closed: FigCraft GUI is not running (Headless Mode will be used)`);
  socket.destroy();
  testMcpSession(false);
});

socket.on('error', () => {
  console.log(`[-] Port ${port} closed: FigCraft GUI is not running (Headless Mode will be used)`);
  socket.destroy();
  testMcpSession(false);
});

socket.connect(port, '127.0.0.1');

function testMcpSession(attached) {
  console.log('\nTesting MCP JSON-RPC handshake over stdio...');
  const args = attached ? ['mcp', '--attach', String(port)] : ['mcp'];
  const proc = spawn(cliPath, args, { stdio: ['pipe', 'pipe', 'inherit'] });

  let buffer = '';
  let passed = false;

  const timer = setTimeout(() => {
    if (!passed) {
      console.error('[x] MCP handshake timeout after 5 seconds.');
      proc.kill();
      process.exit(1);
    }
  }, 5000);

  proc.stdout.on('data', (d) => {
    buffer += d.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id === 1 && msg.result) {
          console.log('[✓] MCP Initialize Handshake Successful!');
          console.log(`    Server Info: ${msg.result.serverInfo.name} v${msg.result.serverInfo.version}`);
          // Request tools
          proc.stdin.write(JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list',
            params: {}
          }) + '\n');
        } else if (msg.id === 2 && msg.result) {
          console.log(`[✓] tools/list Successful! ${msg.result.tools.length} design tools available.`);
          passed = true;
          clearTimeout(timer);
          proc.kill();
          console.log('\n=== DIAGNOSTIC PASSED: Ready for all Agent Harnesses! ===');
          process.exit(0);
        }
      } catch (err) {
        // ignore parse errors for partial lines
      }
    }
  });

  proc.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'diagnostic', version: '1.0' }
    }
  }) + '\n');
}
