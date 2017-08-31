<template>
  <div>
    <b-form-file
      :placeholder="placeholder"
      :choose-label="label"
      :required="required"
      :disabled="disabled"
      :type="type"
      :state="invalid ? 'invalid' : 'null'"
      :multiple="multiple"
      v-model="media"
      class="col-12"
    >
    </b-form-file>
    <div style="direction: ltr">
      <b-progress :value="progressValue" variant="success" class="mt-1"></b-progress>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: String,
      placeholder: String,
      value: String,
      required: Boolean,
      disabled: Boolean,
      type: String,
      invalid: Boolean,
      url: String,
      multiple: Boolean,
      onUpload: Function,
    },

    data () {
      return {
        media: null,
        progressValue: null,
      }
    },

    watch: {
      media (val) {
        this.onUpload(val, this.onProgress).then((responseData) => {
          if (responseData !== false) {
            this.$emit('input', responseData)
            this.$emit('change', responseData)
          }
        })
      },
    },

    methods: {
      onProgress (progressEvent) {
        this.progressValue = (progressEvent.loaded / progressEvent.total) * 100
      },
    }
  }
</script>
