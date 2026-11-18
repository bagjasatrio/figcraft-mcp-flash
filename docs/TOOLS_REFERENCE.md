# FigCraft MCP Tools Reference

The FigCraft MCP server exposes 19 specialized tools, 3 resources, and 6 workflow prompts.

---

## Tool Summary

| Tool Name | Title | Primary Purpose |
|---|---|---|
| `list_commands` | List commands | Discover command IDs, parameters, and keyboard shortcuts |
| `run_command` | Run command | Execute any atomic engine command by ID |
| `batch` | Batch execution | Run multiple commands atomically in a single undo step |
| `create_node` | Create layer | Instantiate frames, shapes, text, components, lines |
| `set_properties` | Set properties | Adjust layout, geometry, fills, strokes, fonts, constraints |
| `inspect_document` | Inspect document | Full JSON document tree, hierarchy, styles, selection |
| `get_node` | Get layer | Inspect single node subtree with depth and offset control |
| `select` | Select layers | Update canvas selection set |
| `export` | Export asset | Export layers to PNG, JPG, SVG, WebP, PDF, or Android XML |
| `screenshot` | Screenshot | Visual verification render (PNG) of page, layers, or UI window |
| `open_file` | Open file | Open `.figcraft`, `.fig`, `.penpot`, `.sketch`, `.json`, `.svg` |
| `save_file` | Save file | Save active document as `.figcraft` or experimental `.fig` |
| `undo` | Undo | Step backward in document history |
| `redo` | Redo | Step forward in document history |
| `pointer` | Pointer gesture | Canvas mouse events: click, double, drag, marquee, tool drawing |
| `key` | Press key | Canvas keystrokes, shortcuts, nudge arrows, text editing keys |
| `type_text` | Type text | Direct text input into focused or referenced text layers |
| `inspect_ui` | Inspect UI | UI viewport zoom, center, panels, active tool, window list |
| `wait_for_changes` | Wait for changes | Long-poll listener for comments and collaboration events |

---

## Detailed Tool Specifications

### 1. `list_commands`
Lists commands registered in the FigCraft engine.
- **Parameters**:
  - `filter` *(string, optional)*: Substring matched against ID, label, menu path, or docs.
- **Example**:
  ```json
  { "filter": "layout" }
  ```

### 2. `run_command`
Executes an engine command by ID.
- **Parameters**:
  - `command` *(string, required)*: Command ID (e.g., `align.left`, `layout.add`, `style.create`).
  - `params` *(object, optional)*: JSON payload specific to the command.
  - `document` *(integer or string, optional)*: Target document ID or path.

### 3. `batch`
Bundles multiple commands into one atomic undo step.
- **Parameters**:
  - `commands` *(array, required)*: Sequence of command objects `{ as?, command, params }`.
  - `label` *(string, optional)*: History label (default: `"Batch"`).
  - `onError` *(string, optional)*: `"abort"` (rollback all on failure) or `"continue"`.
- **References**:
  - Subsequent commands reference earlier outputs: `{"$ref": "step_alias"}` or `{"$ref": "step_alias", "field": "ids/0"}`.

### 4. `create_node`
Creates a layer and returns its ID and properties.
- **Parameters**:
  - `type` *(string, required)*: `"frame"`, `"rectangle"`, `"ellipse"`, `"polygon"`, `"star"`, `"line"`, `"arrow"`, `"text"`, `"vector"`, `"section"`, `"component"`, `"slice"`.
  - `name` *(string, optional)*: Layer label.
  - `parent` *(integer, optional)*: Parent frame or component ID (default: current page).
  - `x`, `y` *(number, optional)*: Relative coordinates to parent.
  - `width`, `height` *(number, optional)*: Dimensions (pixels).
  - `text` *(string, optional)*: Content for `type: "text"`.
  - `props` *(object, optional)*: Initial properties (fill, stroke, layout, padding, etc.).
  - `select` *(boolean, optional)*: Select new layer (default: `true`).

### 5. `set_properties`
Updates properties on layers.
- **Parameters**:
  - `ids` *(array of integers, optional)*: Target layer IDs (default: current selection).
  - `props` *(object, required)*:
    - Fills: `fill: "#RRGGBB"` or array of paint objects.
    - Strokes: `stroke`, `strokeWeight`, `strokeAlign` (`"inside"` | `"center"` | `"outside"`).
    - Corner Radius: `cornerRadius` (scalar or `[tl, tr, br, bl]`).
    - Auto Layout: `layout` (`"horizontal"` | `"vertical"` | `"grid"`), `gap`, `padding` (`n` or `[t, r, b, l]`), `mainAlign`, `crossAlign`, `wrap`.
    - Sizing: `sizingH` / `sizingV` (`"fixed"` | `"hug"` | `"fill"`).
    - Text: `fontFamily`, `fontStyle`, `fontSize`, `lineHeight`, `letterSpacing`, `textAlign`.

### 6. `inspect_document`
Retrieves document state as JSON.
- **Parameters**:
  - `depth` *(integer, optional)*: Tree depth (default: 4).
  - `outline` *(boolean, optional)*: Returns compact representation.
  - `allPages` *(boolean, optional)*: Expand all pages.

### 7. `screenshot`
Renders layers or the entire canvas to PNG.
- **Parameters**:
  - `ids` *(array of integers, optional)*: Layers to render.
  - `scale` *(number, optional)*: Pixel scale factor.
  - `maxSize` *(integer, optional)*: Max dimension boundary (default: 1600).
  - `window` *(boolean, optional)*: Capture host application window UI (attached mode only).

### 8. `export`
Exports layers or the whole document.
- **Supported Formats**: `png`, `jpg`, `svg`, `webp`, `pdf`, `xml` (Android Vector Drawable), `fig`.
- **Parameters**:
  - `path` *(string, optional)*: Destination file path.
  - `scale` *(number, optional)*: Pixel scale (e.g. 1, 2, 3).
  - `format` *(string, optional)*.

---

## Built-In Resources

- `figcraft://document`: Live active document JSON representation.
- `figcraft://commands`: Full catalog of engine commands and specifications.
- `figcraft://comments`: Real-time feedback threads and review comments.

---

## Built-In Prompts

- `mobile_screen`: Generates responsive mobile app screens.
- `design_system`: Sets up design tokens, color styles, and components.
- `landing_page`: Constructs modern marketing pages in auto layout.
- `prototype_flow`: Wires screen transitions and prototype interactions.
- `fix_comments`: Reads and addresses design review feedback threads.
- `watch_comments`: Continuously monitors review feedback in attached sessions.
