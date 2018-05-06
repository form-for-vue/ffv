<template>
  <div :id="id" class="text-input" :class="{[classNames]: classNames, [`col-md-${size}`]: size}">
    <div :class="{'row mb-2 align-items-center': labelPosition === 'side'}">
      <label
        v-if="displayLabel"
        :class="{
          [`col-md-${12 / size} mb-0`]: labelPosition === 'side'
      }">
        {{ label }}
      </label>
      <div class="row mx-0" :class="{'col-md': labelPosition === 'side'}">
        <b-form-input
          class="col-md w-100 p-2"
          :value="value"
          :required="required"
          :disabled="disabled"
          :type="inputType"
          :state="invalid ? 'invalid' : 'null'"
          @input="handleInput"
          @blur.native="handleBlur"
          @focus.native="handleFocus"
        />
        <div
          v-if="icon"
          :class="`col-md-${6 / size}`"
          class="row justify-content-center align-items-center mx-0">
          <fa-icon :icon="icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import widgetMixin from '../mixins/widget-mixin'

  export default {
    name: 'text-widget',

    mixins: [widgetMixin],

    props: {
      value: [String, Number],
      inputType: String,
      placeholder: String,
      labelPosition: {
        type: String,
        default: 'side',
        validator: value => ['side', 'top'].includes(value),
      },
      icon: String,
    },

    data () {
      return {
        isFocus: false,
      }
    },

    methods: {
      handleBlur (event) {
        this.$emit('blur', { value: event.target.value })
        this.isFocus = false
      },
      handleFocus () {
        this.isFocus = true
      }
    }
  }
</script>
