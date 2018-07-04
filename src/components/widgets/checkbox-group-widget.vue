<template>
  <wrapper-widget :id="id" :classNames="classNames" :size="size">
    <div class="col-md-12">
      <b-form-checkbox-group
        :value="parsedValue"
        :required="required"
        :disable="disabled"
        :state="invalid ? 'invalid' : 'null'"
        @input="customHandleInput"
      >
        <b-form-checkbox
          style="overflow-wrap: break-word;"
          v-for="option in enumOptions"
          :key="option.value"
          :value="option.value">{{ option.label }}
        </b-form-checkbox>
      </b-form-checkbox-group>
    </div>

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
      value: String,
      enumOptions: Array,
    },

    data () {
      return {
        parsedValue: this.value ? JSON.parse(this.value) : ''
      }
    },

    methods: {
      customHandleInput (value) {
        this.handleInput(JSON.stringify(value))
      }
    }
  }
</script>
