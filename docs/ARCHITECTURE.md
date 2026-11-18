# FigCraft MCP Architecture

FigCraft is a high-performance vector design engine supporting Figma files (`.fig`), Penpot (`.penpot`), Sketch (`.sketch`), and native `.figcraft` documents with deep auto-layout, vector manipulation, component systems, and design tokens.

The FigCraft MCP server acts as an AI interface enabling Large Language Models (Claude, GPT, Gemini, Llama) to interact with designs programmatically.

---

## 1. Operating Modes

```
+-------------------------------------------------------+
|                    AI Agent Harness                   |
|       (Claude Desktop / Cursor / Windsurf / Cline)     |
+-------------------------------------------------------+
                           |
                     stdio (JSON-RPC)
                           |
                           v
        +--------------------------------------+
        |      figcraft-mcp-flash Bridge       |
        |      (auto-probes port 9005)         |
        +--------------------------------------+
                 /                   \
      Port 9005 Open               Port 9005 Closed
               /                       \
              v                         v
+---------------------------+  +---------------------------+
|      Interactive GUI      |  |         Headless          |
|  (figcraft.exe --control) |  |   (figcraft-cli mcp)      |
|                           |  |                           |
| - Live canvas rendering   |  | - Standalone engine       |
| - Window screenshots      |  | - File imports / exports  |
| - Real-time visual view   |  | - Batch modifications     |
| - Mouse / pointer drive   |  | - CI / CLI automations    |
+---------------------------+  +---------------------------+
```

### A. Headless Mode
- **Executable**: `figcraft-cli mcp`
- **Use case**: Background automations, CI/CD pipelines, headless containerized environments, script-driven file conversions.
- **Characteristics**: Fast, lightweight, zero window overhead, pure memory/filesystem operations.

### B. Attached Mode (Interactive GUI)
- **Host App**: `figcraft.exe --control 9005 [optional-file.figcraft]`
- **CLI Connection**: `figcraft-cli mcp --attach 9005`
- **Use case**: Interactive co-designing with user.
- **Key Features**:
  - Direct canvas reflection: Changes made by the AI immediately appear in the user's FigCraft window.
  - Pointer & Keyboard gestures: Can click, marquee select, drag, nudge, and type directly into the canvas.
  - UI Window Screenshot: AI can inspect the actual GUI application window and verify rendering.
  - Collaboration & Comments: Supports thread inspection and comment resolution.

---

## 2. Coordinate System & Auto-Layout Rules

1. **Units**: 1 page unit = 1 pixel at 100% zoom.
2. **Axis**: $X$ increases to the right; $Y$ increases **downwards**.
3. **Relative Coordinates**: `create_node` and `set_properties` use coordinates relative to the **parent frame**.
4. **Auto Layout Frames**:
   - Setting `layout: 'vertical'` or `layout: 'horizontal'` disables manual $x, y$ positioning for children.
   - Sizing controlled via `sizingH` / `sizingV`: `'fixed'`, `'hug'`, or `'fill'`.
   - Alignment governed by `mainAlign` and `crossAlign`.
   - Spacing governed by `gap` and `padding` (supports scalar or `[top, right, bottom, left]`).

---

## 3. Atomic Batches and Undo System

- Any command mutating the document is an undo step.
- `batch` bundles multiple creation and layout operations into a single atomic undo unit (`command.batch`).
- References (`$ref` and `$step`) allow subsequent batch actions to target layers created earlier in the same batch.
- Rollback options:
  - `onError: 'abort'` (default): entire batch reverts on any error.
  - `onError: 'continue'`: isolates individual step failures without canceling subsequent independent operations.
