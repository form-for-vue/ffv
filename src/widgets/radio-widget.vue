<template>
  <wrapper-widget :classNames="classNames" :description="description">
    <b-form-radio
      :value="value"
      :required="required"
      :disabled="disabled"
      :options="options"
      :invalid="invalid ? 'invalid' : 'null'"
      @change="handleChange"
    >
    </b-form-radio>

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
      description: String,
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
