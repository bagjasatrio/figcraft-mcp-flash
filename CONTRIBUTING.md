# Contributing to figcraft-mcp-flash

Contributions are welcome. This document covers the basics.

## Getting Started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/figcraft-mcp-flash.git
   cd figcraft-mcp-flash
   ```
3. Verify your FigCraft installation:
   ```bash
   node scripts/test-connection.js
   ```

## Development

The bridge is a single-file Node.js script with zero npm dependencies. No build step required.

- **Entry point**: `bin/figcraft-mcp-bridge.js`
- **Diagnostic**: `scripts/test-connection.js`

### Testing Changes

1. Start FigCraft GUI in control mode (optional, for attached mode testing):
   ```bash
   figcraft --control 9005
   ```
2. Run the bridge directly:
   ```bash
   node bin/figcraft-mcp-bridge.js
   ```
3. Or test via the MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector node bin/figcraft-mcp-bridge.js
   ```

## Pull Request Guidelines

- Keep PRs focused on a single change.
- Update documentation if behavior changes.
- Test with at least one harness (Claude Desktop, Cursor, or MCP Inspector).
- No new npm dependencies unless absolutely necessary. The zero-dependency design is intentional.

## Reporting Issues

Open an issue on GitHub with:
- Your OS and Node.js version.
- FigCraft version (`figcraft-cli --version`).
- Output of `node scripts/test-connection.js`.
- Steps to reproduce the problem.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
