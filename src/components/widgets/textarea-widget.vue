<template>
  <wrapper-widget :id="id" :classNames="classNames" :size="size">
    <b-form-textarea
      :placeholder="placeholder"
      :value="value"
      :required="required"
      :disabled="disabled"
      :rows="2"
      :state="invalid ? 'invalid' : 'null'"
      @input="handleInput"
      @change="handleBlur"
    >
    </b-form-textarea>

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
    name: 'textarea-widget',

    components: {
      WrapperWidget,
    },

    mixins: [widgetMixin],

    props: {
      value: [String, Number],
      placeholder: String,
    }
  }
</script>
