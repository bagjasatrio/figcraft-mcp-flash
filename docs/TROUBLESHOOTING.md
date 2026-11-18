# Troubleshooting

Common issues and solutions when setting up `figcraft-mcp-flash`.

---

## 1. `figcraft-cli` Not Found

**Symptom**: Bridge exits with `Failed to spawn 'figcraft-cli.exe'`.

**Solutions**:
- Verify FigCraft is installed. Default paths:
  - **Windows**: `C:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe`
  - **macOS**: `/Applications/FigCraft.app/Contents/MacOS/figcraft-cli`
  - **Linux**: `/usr/bin/figcraft-cli` or `/usr/local/bin/figcraft-cli`
- Set the explicit path via environment variable:
  ```bash
  export FIGCRAFT_CLI_PATH="/custom/path/to/figcraft-cli"
  ```
  Or via CLI flag:
  ```bash
  node bin/figcraft-mcp-bridge.js --cli "/custom/path/to/figcraft-cli"
  ```
- Run the diagnostic:
  ```bash
  node scripts/test-connection.js
  ```

---

## 2. Port 9005 Connection Refused (Attached Mode Fails)

**Symptom**: Bridge falls back to headless mode when you expected attached mode.

**Solutions**:
- Start FigCraft GUI with the control socket **before** launching the bridge:
  ```bash
  # Windows
  "C:\Program Files\ArtCraft\FigCraft\figcraft.exe" --control 9005

  # macOS
  /Applications/FigCraft.app/Contents/MacOS/figcraft --control 9005
  ```
- Verify the port is open:
  ```bash
  # Windows PowerShell
  Test-NetConnection -ComputerName 127.0.0.1 -Port 9005

  # macOS / Linux
  nc -zv 127.0.0.1 9005
  ```
- If using a custom port, pass it explicitly:
  ```bash
  node bin/figcraft-mcp-bridge.js --port 9010
  ```

---

## 3. Harness Shows "MCP Server Failed to Load"

**Symptom**: Claude Desktop, Cursor, or Cline reports the MCP server failed during initialization.

**Solutions**:
- Check that `node` is in your system PATH:
  ```bash
  node --version
  ```
- Verify the path in your MCP config is **absolute**, not relative:
  ```json
  {
    "command": "node",
    "args": ["C:\\Users\\you\\figcraft-mcp-flash\\bin\\figcraft-mcp-bridge.js"]
  }
  ```
- On Windows, use double backslashes `\\` in JSON paths.
- Check stderr output by running the bridge manually:
  ```bash
  node bin/figcraft-mcp-bridge.js
  ```

---

## 4. Tools Not Appearing in Agent

**Symptom**: Agent connects but shows 0 tools.

**Solutions**:
- Restart the harness application after editing MCP config.
- Verify the server name matches exactly (case-sensitive in some harnesses).
- Test with MCP Inspector:
  ```bash
  npx @modelcontextprotocol/inspector node bin/figcraft-mcp-bridge.js
  ```

---

## 5. Timeout During Tool Calls

**Symptom**: Tool calls hang or timeout after 120 seconds.

**Solutions**:
- For attached mode, increase the timeout:
  ```bash
  # The bridge passes through to figcraft-cli
  node bin/figcraft-mcp-bridge.js --attach -- --timeout 300
  ```
- Large file operations (opening `.fig` files with many pages) may take longer. Consider headless mode for batch processing.

---

## 6. Font Rendering Differences

**Symptom**: Text renders differently across machines.

**Solution**: Use `--no-system-fonts` to restrict rendering to FigCraft's built-in font set:
```bash
node bin/figcraft-mcp-bridge.js --no-system-fonts
```
Or set the environment variable:
```bash
export FIGCRAFT_NO_SYSTEM_FONTS=1
```

---

## 7. Windows: Node.js Inline `-e` Fails

**Symptom**: Running `node -e "..."` on Windows produces `Unterminated string constant`.

**Cause**: Windows `cmd.exe` does not handle double quotes inside `-e` properly with newer Node.js versions.

**Solution**: Write scripts to files instead of using inline `-e`. The bridge and diagnostic scripts are already file-based and work correctly.

---

## Diagnostic Command

Always start troubleshooting with:
```bash
node scripts/test-connection.js
```

This checks:
1. `figcraft-cli` binary discovery
2. CLI version
3. GUI control socket availability
4. MCP JSON-RPC handshake
5. Tool listing
