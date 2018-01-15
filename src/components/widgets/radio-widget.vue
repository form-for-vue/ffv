<template>
  <wrapper-widget :id="id" :classNames="classNames" :size="size">
    <b-form-radio-group
      :value="value"
      :required="required"
      :disable="disabled"
      :state="invalid ? 'invalid' : 'null'"
      @input="handleInput"
      @change="handleBlur"
    >
      <b-form-radio
        v-for="option in enumOptions"
        :key="option.value"
        :value="option.value">{{ option.label }}
      </b-form-radio>
    </b-form-radio-group>

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
    components: {
      WrapperWidget,
    },

    mixins: [widgetMixin],

    props: {
      value: {
        type: [String, Number],
        default: null,
      },
      enumOptions: Array,
    },
  }
</script>
