<template>
  <wrapper-widget :id="id" :classNames="classNames" :size="size">
    <b-form-checkbox
      :checked="value"
      :required="required"
      :disabled="disabled"
      :invalid="invalid ? 'invalid' : 'null'"
      @change="handleChange"
    >
    </b-form-checkbox>

    <div v-if="displayLabel" slot="label" v-html="label"></div>

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
  import widgetMixin from '../mixins/widget-mixin'

  export default {
    name: 'checkbox-widget',

    components: {
      WrapperWidget,
    },

    mixins: [widgetMixin],

    props: {
      value: Boolean,
    },

    methods: {
      handleChange (value) {
        this.handleInput(value)
        this.handleBlur(value)
      },
    },
  }
</script>
