# Changelog

All notable changes to `figcraft-mcp-flash` are documented here.

## [1.0.0] — 2024-12-01

### Added
- Universal MCP bridge (`bin/figcraft-mcp-bridge.js`) with auto-detection of FigCraft GUI (Attached Mode) and Headless Mode fallback.
- Cross-platform `figcraft-cli` binary auto-discovery for Windows, macOS, and Linux.
- Full documentation suite:
  - `docs/ARCHITECTURE.md` — System architecture, operating modes, coordinate system, batch/undo model.
  - `docs/HARNESS_SETUP.md` — Step-by-step configuration for Claude Desktop, Cursor, Windsurf, Cline, Roo Code, VynexCode, and generic MCP clients.
  - `docs/TOOLS_REFERENCE.md` — Complete reference for all 19 tools, 3 resources, and 6 prompts.
  - `docs/PROTOCOL.md` — Low-level MCP JSON-RPC protocol specification and transport details.
  - `docs/TROUBLESHOOTING.md` — Common issues, diagnostics, and solutions.
- Ready-to-paste configuration examples for 6 harnesses in `examples/configs/`.
- Workflow example: `examples/workflows/create-mobile-screen.js` demonstrating batch layer creation with `$ref` bindings.
- Diagnostic script: `scripts/test-connection.js` for environment verification.
- CLI flags: `--port`, `--cli`, `--headless`, `--attach`, `--no-system-fonts`.
- Environment variable support: `FIGCRAFT_CLI_PATH`, `FIGCRAFT_PORT`.
