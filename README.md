# figcraft-mcp-flash

Universal [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server and harness bridge for **FigCraft**, the next-generation native vector design engine.

Enable any AI agent (Claude Desktop, Cursor, Windsurf, Cline, Roo Code, VynexCode, Hermes) to create, inspect, edit, auto-layout, prototype, and export vector design documents in real-time.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-2024--11--05-green.svg)](https://modelcontextprotocol.io/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

---

## ⚡ Highlights

- **Dual-Mode Intelligence**:
  - **Attached GUI Mode**: Automatically detects running FigCraft app (`figcraft --control 9005`) for live real-time canvas updates, pointer interactions, and app window screenshots.
  - **Headless Mode**: Falls back to headless in-process engine mode if GUI is closed. Perfect for CLI scripts, CI/CD pipelines, and automated asset generation.
- **Cross-Platform Auto-Detection**: Discovers `figcraft-cli` binaries automatically across Windows (`Program Files`, `AppData`), macOS (`/Applications`), and Linux (`/usr/bin`, `~/.local/bin`).
- **Universal Format Support**: Works natively with `.figcraft`, Figma files (`.fig`), Penpot (`.penpot`), Sketch (`.sketch`), SVG (`.svg`), and REST JSON.
- **Production-Grade Auto Layout**: Flexbox-style automatic layouts (`horizontal`, `vertical`, `grid`), hug/fill sizing, padding, gaps, and responsive constraints.
- **Full Fidelity Exporter**: Single-call export to PNG, JPG, SVG, WebP, print-ready PDF (with bleed/crop marks), and Android Vector Drawable XML.

---

## 🚀 Quick Start

### 1. Clone & Verify

```bash
git clone https://github.com/bagjasatrio/figcraft-mcp-flash.git
cd figcraft-mcp-flash
```

Run the built-in diagnostic test to verify your environment and FigCraft connection:

```bash
node scripts/test-connection.js
```

Sample output:
```text
=== FIGCRAFT MCP ENVIRONMENT DIAGNOSTIC ===
OS: Windows_NT 10.0.26200 (x64)
Node.js: v24.19.0
[✓] figcraft-cli located at: C:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe
[✓] FigCraft CLI Version: figcraft-cli 0.18.1
[✓] FigCraft GUI is RUNNING on port 9005 (Interactive Attached Mode ready)
[✓] MCP Initialize Handshake Successful! (figcraft v0.18.1)
[✓] tools/list Successful! 19 design tools available.
=== DIAGNOSTIC PASSED: Ready for all Agent Harnesses! ===
```

---

## 🔌 Setup Guide for All Harnesses

### 1. Claude Desktop

Edit your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the server:
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

### 2. Cursor IDE

#### Workspace Level
Create `.cursor/mcp.json` in your project root:
```json
{
  "mcpServers": {
    "figcraft": {
      "command": "node",
      "args": [
        "C:\\path\\to\\figcraft-mcp-flash\\bin\\figcraft-mcp-bridge.js"
      ]
    }
  }
}
```

#### Global Level
Open **Cursor Settings** (`Ctrl + ,` / `Cmd + ,`) -> **Features** -> **MCP**, click **Add New MCP Server**:
- **Name**: `figcraft`
- **Type**: `command`
- **Command**: `node <absolute-path>/bin/figcraft-mcp-bridge.js`

### 3. Windsurf (Codeium)

Edit `%USERPROFILE%\.codeium\windsurf\mcp_config.json` (or `~/.codeium/windsurf/mcp_config.json` on macOS/Linux):
```json
{
  "mcpServers": {
    "figcraft": {
      "command": "node",
      "args": [
        "/path/to/figcraft-mcp-flash/bin/figcraft-mcp-bridge.js"
      ]
    }
  }
}
```

### 4. VS Code (Cline & Roo Code)

In VS Code extension settings, open MCP settings:
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

### 5. VynexCode / Hermes Agent / Codex

In your workspace or global `.codeagent/mcp.json` or `mcp.json`:
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

## 🎨 Interactive GUI vs Headless Mode

| Feature | Interactive Attached Mode | Headless Mode |
|---|---|---|
| **How to run** | Start FigCraft GUI with `figcraft --control 9005` | Automatic fallback when GUI is not open |
| **Canvas View** | Real-time live visual sync on your screen | Headless memory engine |
| **Window Screenshot** | Yes (`window: true` captures FigCraft app) | Renders canvas page / layers |
| **Interactions** | Mouse clicks, drags, selections, typing | Programmatic API calls |
| **Performance** | Ideal for interactive visual co-design | Ultra-fast, ideal for CI/CD & batch jobs |

To launch FigCraft GUI in control mode:
```bash
# Windows
"C:\Program Files\ArtCraft\FigCraft\figcraft.exe" --control 9005

# macOS
/Applications/FigCraft.app/Contents/MacOS/figcraft --control 9005
```

---

## 🛠 Available Tools (19 Tools)

| Tool | Description |
|---|---|
| `create_node` | Create layer: frame, rectangle, text, vector, component, etc. |
| `set_properties` | Set colors, typography, auto-layout, padding, borders, shadows |
| `batch` | Run multiple commands atomically in one undo step with `$ref` binding |
| `inspect_document` | Retrieve full JSON tree of active document, hierarchy, and tokens |
| `get_node` | Deep inspect specific layer subtree with offset pagination |
| `screenshot` | Visual verification: returns PNG render of layers, canvas, or GUI |
| `export` | Export to PNG, JPG, SVG, WebP, PDF (print bleed), or Android XML |
| `open_file` | Open `.figcraft`, `.fig`, `.penpot`, `.sketch`, `.svg`, or `.json` |
| `save_file` | Save active file (`.figcraft` or `.fig`) |
| `list_commands` | List available commands with filters and parameter schemas |
| `run_command` | Execute low-level engine command directly |
| `select` | Programmatically select layers on the canvas |
| `undo` / `redo` | Traverse undo / redo history stack |
| `pointer` | Synthesize mouse gestures: click, double-click, marquee drag |
| `key` | Press keyboard shortcut, tool switch keys, or nudge arrows |
| `type_text` | Type text directly into canvas text layers |
| `inspect_ui` | Check UI status, zoom level, viewport center, and active tool |
| `wait_for_changes` | Long-poll listener for comments and design review updates |

---

## 💡 Practical Examples

### 1. Create a Complete Card via `batch`

```json
{
  "commands": [
    {
      "as": "card",
      "command": "node.create",
      "params": {
        "type": "frame",
        "name": "Feature Card",
        "width": 320,
        "height": 180,
        "props": {
          "layout": "vertical",
          "padding": 20,
          "gap": 12,
          "cornerRadius": 16,
          "fill": "#0F172A"
        }
      }
    },
    {
      "command": "node.create",
      "params": {
        "type": "text",
        "text": "Instant Analytics",
        "parent": { "$ref": "card" },
        "props": { "fontSize": 18, "fontStyle": "Bold", "fill": "#FFFFFF" }
      }
    }
  ]
}
```

### 2. Visual Verification via `screenshot`

```json
{
  "maxSize": 1200,
  "scale": 2
}
```

---

## ⚙ CLI Options & Environment Variables

```text
Usage: node bin/figcraft-mcp-bridge.js [options]

Options:
  --port <port>        Target port for FigCraft GUI socket (default: 9005)
  --cli <path>         Explicit path to figcraft-cli binary
  --headless           Force headless mode (bypass port probe)
  --attach [port]      Force attach mode (fail if port unreachable)
  --no-system-fonts    Use built-in fonts only for pixel-identical renders
  --help, -h           Show help message

Environment Variables:
  FIGCRAFT_CLI_PATH    Custom path to figcraft-cli binary
  FIGCRAFT_PORT        Default GUI control socket port (default: 9005)
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
Crafted for the global open-source AI and design community.
