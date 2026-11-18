/**
 * Example Workflow: Create a design system foundation
 * Demonstrates: batch with color styles, text styles, and a button component
 *
 * This uses the built-in prompt "design_system" or manual batch commands.
 */

const designSystemBatch = {
  label: 'Create Design System Foundation',
  onError: 'continue',
  commands: [
    // Create color styles
    {
      as: 'primary_swatch',
      command: 'node.create',
      params: {
        type: 'rectangle',
        name: 'Primary Swatch',
        width: 80,
        height: 80,
        x: 0,
        y: 0,
        props: {
          fill: '#3B82F6',
          cornerRadius: 8
        }
      }
    },
    {
      command: 'style.create',
      params: {
        type: 'paint',
        name: 'Brand/Primary',
        from: { $ref: 'primary_swatch' }
      }
    },
    {
      as: 'secondary_swatch',
      command: 'node.create',
      params: {
        type: 'rectangle',
        name: 'Secondary Swatch',
        width: 80,
        height: 80,
        x: 100,
        y: 0,
        props: {
          fill: '#10B981',
          cornerRadius: 8
        }
      }
    },
    {
      command: 'style.create',
      params: {
        type: 'paint',
        name: 'Brand/Secondary',
        from: { $ref: 'secondary_swatch' }
      }
    },
    // Create a heading text style
    {
      as: 'heading_sample',
      command: 'node.create',
      params: {
        type: 'text',
        name: 'Heading Sample',
        text: 'Heading 1',
        x: 0,
        y: 120,
        props: {
          fontFamily: 'Inter',
          fontStyle: 'Bold',
          fontSize: 32,
          fill: '#0F172A'
        }
      }
    },
    {
      command: 'style.create',
      params: {
        type: 'text',
        name: 'Typography/Heading 1',
        from: { $ref: 'heading_sample' }
      }
    },
    // Create a button component
    {
      as: 'btn_frame',
      command: 'node.create',
      params: {
        type: 'component',
        name: 'Button/Primary',
        props: {
          layout: 'horizontal',
          padding: [12, 24, 12, 24],
          cornerRadius: 8,
          fill: '#3B82F6',
          mainAlign: 'center',
          crossAlign: 'center',
          sizingH: 'hug',
          sizingV: 'hug'
        }
      }
    },
    {
      command: 'node.create',
      params: {
        type: 'text',
        text: 'Button Label',
        parent: { $ref: 'btn_frame' },
        props: {
          fontFamily: 'Inter',
          fontStyle: 'SemiBold',
          fontSize: 14,
          fill: '#FFFFFF'
        }
      }
    }
  ]
};

console.log('Design System Batch Payload:');
console.log(JSON.stringify(designSystemBatch, null, 2));
