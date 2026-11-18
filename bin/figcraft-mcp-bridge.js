#!/usr/bin/env node

/**
 * figcraft-mcp-flash
 * Universal MCP bridge for FigCraft design engine.
 * Automatically switches between Interactive GUI mode (--attach) and Headless mode.
 */

const net = require('net');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Parse CLI arguments
const argv = process.argv.slice(2);
let customPort = null;
let customCli = null;
let forceHeadless = false;
let forceAttach = false;
let noSystemFonts = false;
const passthroughArgs = [];

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === '--port' && argv[i + 1]) {
    customPort = parseInt(argv[++i], 10);
  } else if (arg === '--cli' && argv[i + 1]) {
    customCli = argv[++i];
  } else if (arg === '--headless') {
    forceHeadless = true;
  } else if (arg === '--attach') {
    forceAttach = true;
    if (argv[i + 1] && !argv[i + 1].startsWith('-')) {
      customPort = parseInt(argv[++i], 10);
    }
  } else if (arg === '--no-system-fonts') {
    noSystemFonts = true;
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else {
    passthroughArgs.push(arg);
  }
}

const targetPort = customPort || parseInt(process.env.FIGCRAFT_PORT, 10) || 9005;

function resolveCliPath() {
  if (customCli && fs.existsSync(customCli)) {
    return customCli;
  }
  if (process.env.FIGCRAFT_CLI_PATH && fs.existsSync(process.env.FIGCRAFT_CLI_PATH)) {
    return process.env.FIGCRAFT_CLI_PATH;
  }

  const platform = os.platform();
  const candidates = [];

  if (platform === 'win32') {
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env['LOCALAPPDATA'] || path.join(os.homedir(), 'AppData', 'Local');

    candidates.push(
      path.join(programFiles, 'ArtCraft', 'FigCraft', 'figcraft-cli.exe'),
      path.join(programFilesX86, 'ArtCraft', 'FigCraft', 'figcraft-cli.exe'),
      path.join(localAppData, 'Programs', 'FigCraft', 'figcraft-cli.exe'),
      path.join(programFiles, 'FigCraft', 'figcraft-cli.exe'),
      'figcraft-cli.exe'
    );
  } else if (platform === 'darwin') {
    candidates.push(
      '/Applications/FigCraft.app/Contents/MacOS/figcraft-cli',
      path.join(os.homedir(), 'Applications/FigCraft.app/Contents/MacOS/figcraft-cli'),
      '/usr/local/bin/figcraft-cli',
      '/opt/homebrew/bin/figcraft-cli',
      'figcraft-cli'
    );
  } else {
    candidates.push(
      '/usr/bin/figcraft-cli',
      '/usr/local/bin/figcraft-cli',
      path.join(os.homedir(), '.local/bin/figcraft-cli'),
      'figcraft-cli'
    );
  }

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return p;
      }
    } catch (_) {}
  }

  return platform === 'win32' ? 'figcraft-cli.exe' : 'figcraft-cli';
}

function probePort(port, timeoutMs = 400) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(true);
      }
    });

    socket.on('timeout', () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.on('error', () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });

    socket.connect(port, '127.0.0.1');
  });
}

function printHelp() {
  process.stderr.write(`
figcraft-mcp-flash — Universal Model Context Protocol (MCP) Bridge for FigCraft

Usage:
  node bin/figcraft-mcp-bridge.js [options]

Options:
  --port <port>        Target port for FigCraft GUI control socket (default: 9005 or FIGCRAFT_PORT)
  --cli <path>         Explicit path to figcraft-cli executable
  --headless           Force headless mode (do not attempt to attach to running GUI)
  --attach [port]      Force attach mode (fail if GUI socket is unreachable)
  --no-system-fonts    Render using FigCraft built-in fonts only
  --help, -h           Show this help message

Environment Variables:
  FIGCRAFT_CLI_PATH    Custom path to figcraft-cli binary
  FIGCRAFT_PORT        Default GUI control socket port (default: 9005)
\n`);
}

async function main() {
  const cliPath = resolveCliPath();

  let isLive = false;
  if (!forceHeadless) {
    if (forceAttach) {
      isLive = await probePort(targetPort);
      if (!isLive) {
        process.stderr.write(`[figcraft-mcp] ERROR: Force attach enabled, but FigCraft GUI is not running on port ${targetPort}.\n`);
        process.stderr.write(`[figcraft-mcp] Start FigCraft first using: figcraft --control ${targetPort}\n`);
        process.exit(1);
      }
    } else {
      isLive = await probePort(targetPort);
    }
  }

  const args = ['mcp'];
  if (isLive) {
    args.push('--attach', String(targetPort));
    process.stderr.write(`[figcraft-mcp] Attached to FigCraft GUI running on 127.0.0.1:${targetPort}\n`);
  } else {
    process.stderr.write(`[figcraft-mcp] Started FigCraft MCP in standalone Headless mode\n`);
  }

  if (noSystemFonts) {
    args.push('--no-system-fonts');
  }

  if (passthroughArgs.length > 0) {
    args.push(...passthroughArgs);
  }

  // Spawn CLI with stdio inheritance for seamless JSON-RPC transport
  const child = spawn(cliPath, args, {
    stdio: ['inherit', 'inherit', 'inherit'],
    windowsHide: true,
  });

  child.on('error', (err) => {
    process.stderr.write(`[figcraft-mcp] Failed to spawn '${cliPath}': ${err.message}\n`);
    process.stderr.write(`[figcraft-mcp] Verify FigCraft is installed or provide --cli path.\n`);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(1);
    }
    process.exit(code || 0);
  });

  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });
}

main().catch((err) => {
  process.stderr.write(`[figcraft-mcp] Fatal error: ${err.message}\n`);
  process.exit(1);
});
