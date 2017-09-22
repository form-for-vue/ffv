<template>
  <wrapper-widget :id="id" :classNames="classNames">
    <b-form-checkbox
      :checked="value"
      :required="required"
      :disabled="disabled"
      :invalid="invalid ? 'invalid' : 'null'"
      @change="handleChange"
    >
      <template v-if="displayLabel">
        {{ label }}
      </template>
    </b-form-checkbox>

    <p
      v-if="displayLabel"
      slot="description"
      style="text-align: justify;"
      class="text-muted">
      {{ description }}
    </p>

    <template slot="feedback">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.vue'

  export default {
    name: 'checkbox-widget',

    components: {
      WrapperWidget,
    },

    props: {
      id: String,
      errors: Array,
      value: Boolean,
      required: Boolean,
      invalid: Boolean,
      label: String,
      description: String,
      // uiOptions
      disabled: Boolean,
      classNames: String,
      displayLabel: Boolean,
    },

    methods: {
      handleChange (value) {
        this.$emit('input', value)
        this.$emit('blur', value)
      }
    }
  }
</script>
