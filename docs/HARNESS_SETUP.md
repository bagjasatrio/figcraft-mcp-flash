# Harness Setup Guide

`figcraft-mcp-flash` connects FigCraft to every modern AI agent and IDE harness via the standard Model Context Protocol (MCP).

---

## Prerequisites
1. **Node.js** (v16.0.0 or later installed).
2. **FigCraft** installed:
   - **Windows**: Default installed at `C:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe`.
   - **macOS / Linux**: Binary `figcraft-cli` placed in your `$PATH` or `/Applications/FigCraft.app/Contents/MacOS/figcraft-cli`.
3. *(Optional for live canvas editing)* Launch FigCraft with the control socket:
   ```bash
   # Windows Command Prompt or PowerShell:
   "C:\Program Files\ArtCraft\FigCraft\figcraft.exe" --control 9005

   # macOS:
   /Applications/FigCraft.app/Contents/MacOS/figcraft --control 9005
   ```

---

## 1. Claude Desktop (macOS & Windows)

### Config File Location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Configuration:
```json
{
  "mcpServers": {
    "figcraft": {
      "command": "node",
      "args": [
        "C:\\path\\to\\figcraft-mcp-flash\\bin\\figcraft-mcp-bridge.js"
      ],
      "env": {
        "FIGCRAFT_PORT": "9005"
      }
    }
  }
}
```
*(On macOS, replace the path with `/path/to/figcraft-mcp-flash/bin/figcraft-mcp-bridge.js`)*.

---

## 2. Cursor IDE

Cursor supports MCP servers directly in settings or workspace configurations.

### Option A: Global Configuration
1. Open Cursor Settings (`Ctrl + ,` or `Cmd + ,`).
2. Search for **MCP**.
3. Add a new server:
   - **Name**: `figcraft`
   - **Type**: `command`
   - **Command**: `node /absolute/path/to/figcraft-mcp-flash/bin/figcraft-mcp-bridge.js`

### Option B: Project Configuration
Create `.cursor/mcp.json` inside your project directory:
```json
{
  "mcpServers": {
    "figcraft": {
      "command": "node",
      "args": [
        "./node_modules/figcraft-mcp-flash/bin/figcraft-mcp-bridge.js"
      ]
    }
  }
}
```

---

## 3. Windsurf (Codeium)

### Config File Location:
- **Windows**: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`
- **macOS / Linux**: `~/.codeium/windsurf/mcp_config.json`

### Configuration:
```json
{
  "mcpServers": {
    "figcraft": {
      "command": "node",
      "args": [
        "/absolute/path/to/figcraft-mcp-flash/bin/figcraft-mcp-bridge.js"
      ]
    }
  }
}
```

---

## 4. VS Code Extensions (Cline / Roo Code)

### Config File Location:
- Accessible via Extension Settings -> MCP Servers -> **Edit MCP Settings**.

### Configuration:
```json
{
  "mcpServers": {
    "figcraft": {
      "command": "node",
      "args": [
        "C:\\path\\to\\figcraft-mcp-flash\\bin\\figcraft-mcp-bridge.js"
      ],
      "disabled": false,
      "autoApprove": [
        "inspect_document",
        "get_node",
        "screenshot",
        "inspect_ui",
        "list_commands"
      ]
    }
  }
}
```

---

## 5. VynexCode / Hermes Agent / Codex

Edit `mcp.json` or `.codeagent/mcp.json`:
```json
{
  "mcpServers": {
    "Figcraft": {
      "command": "node",
      "args": [
        "path/to/figcraft-mcp-flash/bin/figcraft-mcp-bridge.js"
      ]
    }
  }
}
```

---

## 6. Official MCP Inspector (Testing & Debugging)

To test the server interactively via the official web GUI:
```bash
npx @modelcontextprotocol/inspector node bin/figcraft-mcp-bridge.js
```
Open the browser URL provided in the terminal to inspect all available tools, execute calls, and see responses.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `FIGCRAFT_CLI_PATH` | Explicit path to `figcraft-cli` or `figcraft-cli.exe` | Auto-detected |
| `FIGCRAFT_PORT` | Port for FigCraft GUI control socket | `9005` |
| `FIGCRAFT_NO_SYSTEM_FONTS` | Restrict fonts to FigCraft built-in only | `0` |
