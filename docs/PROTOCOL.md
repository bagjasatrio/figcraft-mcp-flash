# MCP Protocol Specification

This document covers the low-level JSON-RPC transport and protocol details for the FigCraft MCP server.

---

## Transport

- **Protocol**: JSON-RPC 2.0 over **stdio** (stdin/stdout).
- **Encoding**: UTF-8, newline-delimited JSON (one JSON object per line).
- **Direction**: Bidirectional — the client writes requests to the server's stdin, the server writes responses to stdout. Diagnostic messages go to stderr.
- **MCP Version**: `2024-11-05`

---

## Connection Lifecycle

### 1. Initialize Handshake

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "my-agent",
      "version": "1.0.0"
    }
  }
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "serverInfo": {
      "name": "figcraft",
      "title": "FigCraft",
      "version": "0.18.1"
    },
    "capabilities": {
      "tools": { "listChanged": false },
      "resources": { "listChanged": false, "subscribe": false },
      "prompts": { "listChanged": false }
    },
    "instructions": "FigCraft is an interface design tool..."
  }
}
```

### 2. Discover Tools

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "create_node",
        "title": "Create layer",
        "description": "Create a layer and return its id...",
        "inputSchema": { "type": "object", "properties": {...}, "required": ["type"] },
        "annotations": {
          "readOnlyHint": false,
          "destructiveHint": false,
          "openWorldHint": false
        }
      }
    ]
  }
}
```

### 3. Call a Tool

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "create_node",
    "arguments": {
      "type": "frame",
      "name": "Hero Section",
      "width": 1440,
      "height": 800,
      "props": {
        "layout": "vertical",
        "padding": 64,
        "gap": 32,
        "fill": "#0F172A"
      }
    }
  }
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"id\": 42, \"name\": \"Hero Section\", \"type\": \"frame\", ...}"
      }
    ]
  }
}
```

### 4. List Resources

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/list",
  "params": {}
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "resources": [
      {
        "uri": "figcraft://document",
        "name": "document",
        "title": "Active document",
        "description": "The active document as JSON...",
        "mimeType": "application/json"
      },
      {
        "uri": "figcraft://commands",
        "name": "commands",
        "title": "Command catalog",
        "description": "Every FigCraft command with label, menu, shortcut and parameter docs.",
        "mimeType": "application/json"
      },
      {
        "uri": "figcraft://comments",
        "name": "comments",
        "title": "Open comments",
        "description": "Every open comment thread on every page, as JSON.",
        "mimeType": "application/json"
      }
    ]
  }
}
```

### 5. List Prompts

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "prompts/list",
  "params": {}
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "prompts": [
      {
        "name": "mobile_screen",
        "title": "Design a mobile screen",
        "description": "Build one mobile app screen in a phone frame with auto layout, real text and a clear hierarchy.",
        "arguments": [
          { "name": "screen", "description": "What the screen shows", "required": true },
          { "name": "device", "description": "Device frame size", "required": false },
          { "name": "brand_color", "description": "Primary brand hex color", "required": false }
        ]
      },
      {
        "name": "design_system",
        "title": "Start a design system",
        "description": "Create colour and text styles, Light/Dark colour variables, and a button component with variants.",
        "arguments": [
          { "name": "name", "description": "Design system name", "required": true },
          { "name": "primary", "description": "Primary color hex", "required": false }
        ]
      },
      {
        "name": "landing_page",
        "title": "Design a landing page",
        "description": "A desktop marketing page: nav, hero, feature grid, call to action and footer, all in auto layout.",
        "arguments": [
          { "name": "product", "description": "Product name", "required": true },
          { "name": "width", "description": "Page width in pixels", "required": false },
          { "name": "accent", "description": "Accent color hex", "required": false }
        ]
      },
      {
        "name": "prototype_flow",
        "title": "Wire a prototype flow",
        "description": "Connect screens with click interactions, add a flow starting point and check it.",
        "arguments": [
          { "name": "screens", "description": "Comma-separated screen names", "required": true },
          { "name": "transition", "description": "Transition type", "required": false }
        ]
      },
      {
        "name": "fix_comments",
        "title": "Fix comments",
        "description": "Read the open comment threads and fix each one, replying and resolving it after verifying.",
        "arguments": [
          { "name": "page", "description": "Page name filter", "required": false },
          { "name": "auto_resolve", "description": "Auto-resolve after fixing", "required": false },
          { "name": "author", "description": "Filter by comment author", "required": false }
        ]
      },
      {
        "name": "watch_comments",
        "title": "Watch comments",
        "description": "Watch the open comments and fix new feedback as it arrives.",
        "arguments": [
          { "name": "minutes", "description": "How long to watch", "required": false }
        ]
      }
    ]
  }
}
```

---

## Server Capabilities Summary

| Capability | Supported | Details |
|---|---|---|
| `tools` | ✅ | 19 tools, `listChanged: false` |
| `resources` | ✅ | 3 resources (`document`, `commands`, `comments`) |
| `prompts` | ✅ | 6 workflow prompts |
| `subscribe` | ❌ | Resource subscription not supported |
| `listChanged` | ❌ | Tool/resource/prompt lists are static per session |

---

## Timeouts & Limits

| Boundary | Value | Notes |
|---|---|---|
| Initialize + `tools/list` handshake | 20 seconds | Prevents hung server from blocking agent startup |
| Single tool invocation | 120 seconds | Matches typical agent harness timeout |
| Response payload | 8,000 characters | Truncated with `…[result truncated]` marker |
| Image content blocks | Supported | Screenshots and exports return `image` content type |

---

## Error Handling

Tool errors return standard JSON-RPC error responses:
```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "error": {
    "code": -32602,
    "message": "Unknown property key: invalidProp"
  }
}
```

The server process stays alive after errors. Individual tool failures do not crash the session.
