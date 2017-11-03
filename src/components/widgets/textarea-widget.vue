<template>
  <wrapper-widget :id="id" :classNames="`col-md-${size} ${classNames || ''}`">
    <b-form-textarea
      :placeholder="placeholder"
      :value="value"
      :required="required"
      :disabled="disabled"
      :rows="2"
      :state="invalid ? 'invalid' : 'null'"
      @input="value => $emit('input', value)"
      @change="value => $emit('blur', value)"
    >
    </b-form-textarea>

    <div v-if="displayLabel" slot="label">{{ label }}</div>

    <p
      v-if="displayLabel"
      slot="description"
      style="text-align: justify;"
      class="text-muted">
      {{ description }}
    </p>

    <template slot="feedback" v-if="displayErrors">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.js'

  export default {
    name: 'textarea-widget',

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
      displayErrors: Boolean,
      placeholder: String,
      size: {
        type: Number,
        default: 12,
      },
    }
  }
</script>
