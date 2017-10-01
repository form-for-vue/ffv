<template>
  <string-prop
    :name="name"
    :label="label"
    :description="description"
    :schema="schema"
    :uiSchema="uiSchema"
    :required="required"
    :disabled="disabled"
    :invalid="invalid"
    :value="value ? value : defaultValue"
    :classNames="classNames"
    :feedbacks="feedbacks"
    :registry="registry"
    @input="handleInput"
    @blur="handleBlur"
  ></string-prop>
</template>

<script>
  import StringProp from '@/props/string-prop'
  import { asNumber } from '@/utils'

  export default {
    components: {
      StringProp
    },

    props: {
      name: String,
      label: String,
      description: String,
      schema: Object,
      uiSchema: Object,
      required: Boolean,
      disabled: Boolean,
      invalid: Boolean,
      value: Number,
      defaultValue: Number,
      classNames: String,
      feedbacks: Array,
      registry: Object,
    },

    methods: {
      handleInput (value) {
        this.$emit('input', asNumber(value))
      },
      handleBlur (value) {
        this.$emit('blur', asNumber(value))
      },
    }
  }
</script>
