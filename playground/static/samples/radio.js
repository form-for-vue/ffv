export default {
  schema: {
    title: 'A simple radio widget form',
    type: 'object',
    properties: {
      items: {
        type: 'string',
        enum: [
          'a',
          'b',
          'c',
          'd',
        ],
        enumNames: [
          'A',
          'B',
          'C',
          'D',
        ]
      }
    }
  },
  uiSchema: {
    items: {
      'ui:options': {
        widget: 'radio',
      },
    }
  },
  value: {},
}
