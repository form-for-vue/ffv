<template>
  <div style="direction: ltr">
    <div v-if="errors && errors.length > 0">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </div>
    <div class="row justify-content-center pb-1" v-if="mediaSrc || previewMedia">
      <b-card :img-src="media !== null ? mediaSrc : previewMedia" style="max-width: 40rem;" no-body></b-card>
    </div>
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
    <div>
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
      onPreview: Function,
    },

    data () {
      return {
        media: null,
        mediaSrc: null,
        previewMedia: null,
        progressValue: null,
        errors: null,
      }
    },

    watch: {
      media (val) {
        this.previewFile(val)
        if(this.onUpload) {
          this.onUpload(val, this.onProgress).then(responseData => {
            if (responseData !== false) {
              this.$emit('input', responseData)
              this.$emit('change', responseData)
            }
          })
        }
      },
    },

    mounted () {
      if(this.onPreview) {
        this.onPreview().then(url => {
          this.previewMedia = url
        }).catch(errors => {
          this.errors = errors
        })
      }
    },

    methods: {
      onProgress (progressEvent) {
        this.progressValue = (progressEvent.loaded / progressEvent.total) * 100
      },
      previewFile (media) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          this.mediaSrc = reader.result
        }, false)

        if (media) {
          reader.readAsDataURL(media)
        }
      },
    }
  }
</script>
