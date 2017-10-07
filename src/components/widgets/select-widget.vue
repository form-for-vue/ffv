<template>
  <wrapper-widget :id="id" :classNames="classNames">
    <b-form-select
      :value="value"
      :required="required"
      :disable="disabled"
      :options="[]"
      :state="invalid ? 'invalid' : 'null'"
      @input="value => $emit('input', value)"
      @change="value => $emit('blur', value)"
    >
      <option v-if="displayLabel" :value="null" v-html="placeholder"></option>
      <option
        v-for="option in enumOptions"
        :key="option.value"
        :value="option.value"
        v-html="option.label"></option>
    </b-form-select>

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
    name: 'select-widget',

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
      inputType: String,
      placeholder: String,
      enumOptions: Array,
    },
  }
</script>
