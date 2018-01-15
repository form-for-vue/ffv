<template>
  <wrapper-widget :id="id" :classNames="classNames" :size="size">
    <div class="row justify-content-center pb-1" v-if="mediaSrc || previewMedia">
      <b-card :imgSrc="media !== null ? mediaSrc : previewMedia" style="max-width: 40rem;" noBody></b-card>
    </div>
    <b-form-file
      :placeholder="placeholder"
      :chooseLabel="displayLabel ? label : ''"
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

    <p
      v-if="displayLabel"
      slot="description"
      style="text-align: justify;"
      class="text-muted"
      v-html="description">
    </p>

    <template slot="feedback" v-if="displayErrors">
      <div v-for="feedback in feedbacks" :key="feedback">{{ feedback }}</div>
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </template>
  </wrapper-widget>
</template>

<script>
  import WrapperWidget from './wrapper-widget.js'
  import widgetMixin from '../mixins/widget-mixin'

  export default {
    name: 'file-widget',

    components: {
      WrapperWidget,
    },

    mixins: [widgetMixin],

    props: {
      value: String,
      placeholder: String,
      multiple: Boolean,
      handlers: Object,
    },

    data () {
      return {
        media: null,
        mediaSrc: null,
        previewMedia: null,
        progressValue: 0,
        feedbacks: null,
        status: 'success',
      }
    },

    watch: {
      media (val) {
        this.previewFile(val)
        if (this.handlers && this.handlers.onUpload) {
          this.handlers.onUpload(val, this.onProgress).then(responseData => {
            if (responseData !== false) {
              this.$emit('input', { value: responseData })
              this.$emit('blur', { value: responseData })
            }
          }).catch(errors => {
            this.status = 'danger'
            this.feedbacks = errors
          })
        }
      },
    },

    mounted () {
      if (this.handlers && this.handlers.onPreview) {
        this.handlers.onPreview().then(url => {
          this.previewMedia = url
        }).catch(errors => {
          this.status = 'danger'
          this.feedbacks = errors
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
    },
  }
</script>
