<template>
  <wrapper-widget :id="id" :classNames="classNames">
    <b-form-radio-group
      :value="value"
      :required="required"
      :disable="disabled"
      :state="invalid ? 'invalid' : 'null'"
      @input="value => $emit('input', value)"
      @change="value => $emit('blur', value)"
    >
      <b-form-radio
        v-for="option in enumOptions"
        :key="option.value"
        :value="option.value"
        v-html="option.label"></b-form-radio>
    </b-form-radio-group>

    <div v-if="displayLabel" slot="label" v-html="label"></div>

    <p
      v-if="displayLabel"
      slot="description"
      style="text-align: justify;"
      class="text-muted"
      v-html="description">
    </p>

    <template slot="feedback">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.js'

  export default {
    components: {
      WrapperWidget,
    },

    props: {
      id: String,
      errors: Array,
      value: {
        type: [String, Number],
        default: null
      },
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
      placeholder: String,
      enumOptions: Array,
    },

    methods: {
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('blur', value)
      }
    }
  }
</script>
