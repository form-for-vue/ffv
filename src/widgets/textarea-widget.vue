<template>
  <wrapper-widget :classNames="classNames" :label="label">
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

    <template slot="feedback">
      <div v-for="feedback in feedbacks" :key="feedback">{{ feedback }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.vue'

  export default {
    components: {
      WrapperWidget,
    },

    props: {
      label: String,
      placeholder: String,
      required: Boolean,
      disabled: Boolean,
      invalid: Boolean,
      value: String,
      classNames: String,
      feedbacks: Array,
    }
  }
</script>
