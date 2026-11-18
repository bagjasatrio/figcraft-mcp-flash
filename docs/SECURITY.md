# Security Considerations

## File Access Confinement

The FigCraft MCP server supports automation roots that restrict which directories the engine can read from and write to:

```bash
figcraft-cli mcp \
  --automation-read-root /path/to/designs \
  --automation-write-root /path/to/output
```

In attached mode, the confinement is set when starting the FigCraft GUI:
```bash
figcraft --control 9005 \
  --automation-read-root /path/to/designs \
  --automation-write-root /path/to/output
```

## MCP Tool Permissions

All FigCraft MCP tools require user approval by default in most harnesses. This is intentional — design tools can:
- Read and write files on disk (open_file, save_file, export).
- Modify document state (create_node, set_properties, batch).
- Interact with the GUI canvas (pointer, key, type_text).

In full-access or auto-approve mode, read-only tools are safe to whitelist:
- `inspect_document`
- `get_node`
- `screenshot`
- `inspect_ui`
- `list_commands`

## Transport Security

The MCP server communicates over **local stdio only**. No network sockets are opened by the bridge. The GUI control socket (`--control PORT`) binds to `127.0.0.1` and is not exposed externally.

## Workspace Trust

When used inside agent harnesses that support workspace trust (e.g., VynexCode), the MCP configuration from untrusted workspaces is ignored. Only the user's global MCP configuration is loaded until the workspace is explicitly trusted.
