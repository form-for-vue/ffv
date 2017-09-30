<template>
  <wrapper-widget :id="id" :classNames="classNames">
    <b-form-input
      :placeholder="placeholder"
      :value="value"
      :required="required"
      :disabled="disabled"
      :type="inputType"
      :state="invalid ? 'invalid' : 'null'"
      @input="value => $emit('input', value)"
      @change="value => $emit('blur', value)"
    >
    </b-form-input>

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
  import WrapperWidget from './wrapper-widget.vue'

  export default {
    name: 'input-widget',

    components: {
      WrapperWidget,
    },

    props: {
      id: String,
      errors: Array,
      value: [String, Number],
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
    },
  }
</script>
