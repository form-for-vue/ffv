<template>
  <wrapper-widget :classNames="classNames">
    <div class="row justify-content-center pb-1" v-if="mediaSrc || previewMedia">
      <b-card :imgSrc="media !== null ? mediaSrc : previewMedia" style="max-width: 40rem;" noBody></b-card>
    </div>
    <b-form-file
      :placeholder="placeholder"
      :chooseLabel="label"
      :required="required"
      :disabled="disabled"
      :type="type"
      :state="invalid ? 'invalid' : 'null'"
      :multiple="multiple"
      v-model="media"
    >
    </b-form-file>
    <div>
      <b-progress :value="progressValue" :variant="status" class="mt-1"></b-progress>
    </div>

    <template slot="feedback">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.vue'

  export default {
    name: 'file-widget',

    components: {
      WrapperWidget,
    },

    props: {
      value: String,
      label: String,
      type: String,
      placeholder: String,
      required: Boolean,
      disabled: Boolean,
      invalid: Boolean,
      classNames: String,
      multiple: Boolean,
      onUpload: Function,
      onPreview: Function,
    },

    data () {
      return {
        media: null,
        mediaSrc: null,
        previewMedia: null,
        progressValue: 0,
        errors: null,
        status: 'success',
      }
    },

    watch: {
      media (val) {
        this.previewFile(val)
        if (this.onUpload) {
          this.onUpload(val, this.onProgress).then(responseData => {
            if (responseData !== false) {
              this.$emit('input', responseData)
              this.$emit('change', responseData)
            }
          }).catch(errors => {
            this.status = 'danger'
            this.errors = errors
          })
        }
      },
    },

    mounted () {
      if (this.onPreview) {
        this.onPreview().then(url => {
          this.previewMedia = url
        }).catch(errors => {
          this.status = 'danger'
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
