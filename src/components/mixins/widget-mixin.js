export default {
  props: {
    id: String,
    errors: Array,
    value: null,
    // -- uiOptions --
    // schema prop
    required: Boolean,
    invalid: Boolean,
    // json schema
    label: String,
    description: String,
    // ui schema
    disabled: Boolean,
    classNames: String,
    displayLabel: Boolean,
    displayErrors: Boolean,
    size: {
      type: Number,
      default: 12,
    },
  },

  methods: {
    handleInput (value) {
      this.$emit('input', value)
    },
    handleBlur (value) {
      this.$emit('blur', value)
    },
  },
}
