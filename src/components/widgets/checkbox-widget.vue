<template>
  <wrapper-widget :id="id" :classNames="`col-md-${size} ${classNames || ''}`">
    <b-form-checkbox
      :checked="value"
      :required="required"
      :disabled="disabled"
      :invalid="invalid ? 'invalid' : 'null'"
      @change="handleChange"
    >
      <div v-if="displayLabel" v-html="label"></div>
    </b-form-checkbox>

    <p
      v-if="displayLabel"
      slot="description"
      style="text-align: justify;"
      class="text-muted"
      v-html="description">
    </p>

    <template slot="feedback" v-if="displayErrors">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.js'

  export default {
    name: 'checkbox-widget',

    components: {
      WrapperWidget,
    },

    props: {
      id: String,
      errors: Array,
      value: Boolean,
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
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('blur', value)
      }
    }
  }
</script>
