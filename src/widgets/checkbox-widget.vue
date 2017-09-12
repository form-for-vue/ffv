<template>
  <wrapper-widget :classNames="classNames">
    <b-form-checkbox
      :checked="value"
      :required="required"
      :disabled="disabled"
      :invalid="invalid ? 'invalid' : 'null'"
      @change="handleChange"
    >
      {{ label }}
    </b-form-checkbox>

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
      required: Boolean,
      disabled: Boolean,
      invalid: Boolean,
      value: Boolean,
      classNames: String,
      feedbacks: Array,
    },

    methods: {
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('blur', value)
      }
    }
  }
</script>
