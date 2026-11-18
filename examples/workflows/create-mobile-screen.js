/**
 * Example Workflow: Create a modern fintech mobile card using FigCraft Batch API
 * Demonstrates:
 * 1. Root Frame creation (Auto-layout vertical, rounded corners, dark theme)
 * 2. Balance card with nested elements
 * 3. Action button with primary color
 */

const sampleBatchPayload = {
  commands: [
    {
      as: 'root_frame',
      command: 'node.create',
      params: {
        type: 'frame',
        name: 'Fintech Card',
        width: 380,
        height: 240,
        props: {
          layout: 'vertical',
          padding: 24,
          gap: 16,
          cornerRadius: 20,
          fill: '#0F172A', // Slate 900
          strokes: ['#1E293B'],
          strokeWeight: 1
        }
      }
    },
    {
      as: 'title_text',
      command: 'node.create',
      params: {
        type: 'text',
        name: 'Account Balance Label',
        text: 'TOTAL BALANCE',
        parent: { $ref: 'root_frame' },
        props: {
          fontSize: 12,
          fill: '#94A3B8', // Slate 400
          letterSpacing: 1.2
        }
      }
    },
    {
      as: 'balance_text',
      command: 'node.create',
      params: {
        type: 'text',
        name: 'Balance Amount',
        text: '$124,580.00',
        parent: { $ref: 'root_frame' },
        props: {
          fontSize: 32,
          fontStyle: 'Bold',
          fill: '#F8FAFC' // Slate 50
        }
      }
    },
    {
      as: 'action_btn',
      command: 'node.create',
      params: {
        type: 'frame',
        name: 'Send Money Button',
        parent: { $ref: 'root_frame' },
        props: {
          layout: 'horizontal',
          padding: [12, 20, 12, 20],
          cornerRadius: 12,
          fill: '#3B82F6', // Blue 500
          mainAlign: 'center',
          crossAlign: 'center',
          sizingH: 'fill'
        }
      }
    },
    {
      command: 'node.create',
      params: {
        type: 'text',
        name: 'Button Text',
        text: 'Send Transfer',
        parent: { $ref: 'action_btn' },
        props: {
          fontSize: 14,
          fontStyle: 'SemiBold',
          fill: '#FFFFFF'
        }
      }
    }
  ],
  label: 'Build Modern Fintech Card',
  onError: 'abort'
};

console.log('Sample FigCraft Batch payload ready:');
console.log(JSON.stringify(sampleBatchPayload, null, 2));
