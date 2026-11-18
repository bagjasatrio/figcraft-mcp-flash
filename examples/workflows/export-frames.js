/**
 * Example Workflow: Export all top-level frames from a .fig file to PNG
 * Demonstrates: open_file → inspect_document → export
 *
 * Usage with MCP Inspector or any harness:
 * 1. Call open_file with path to your .fig file
 * 2. Call inspect_document to get frame IDs
 * 3. Call export for each frame
 */

const exportWorkflow = {
  steps: [
    {
      tool: 'open_file',
      arguments: {
        path: 'C:/designs/my-project.fig'
      },
      description: 'Open a Figma file in the FigCraft engine'
    },
    {
      tool: 'inspect_document',
      arguments: {
        depth: 1,
        outline: true
      },
      description: 'Get the top-level layer tree to find frame IDs'
    },
    {
      tool: 'export',
      arguments: {
        ids: [2, 3, 4],
        path: 'C:/output/frame-export.png',
        scale: 2
      },
      description: 'Export specific frames at 2x resolution'
    }
  ]
};

console.log('Export Workflow Steps:');
exportWorkflow.steps.forEach((step, i) => {
  console.log(`\nStep ${i + 1}: ${step.description}`);
  console.log(`  Tool: ${step.tool}`);
  console.log(`  Arguments: ${JSON.stringify(step.arguments, null, 4)}`);
});
