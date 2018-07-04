<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-xl-6 mb-5">
        <div class="row justify-content-center">
          <button type="button"
                  class="btn btn-primary m-1"
                  @click="buildBundle">
            Build Form Bundle
          </button>
          <button type="button"
                  class="btn btn-primary m-1"
                  @click="download('schema', JSON.stringify(generatedSchema))">
            Export JSON-schema
          </button>
          <button type="button"
                  class="btn btn-primary m-1"
                  @click="download('ui-schema', JSON.stringify(generatedUiSchema))">
            Export UI-schema
          </button>
        </div>
        <div class="card m-1">
          <div class="card-header bg-dark text-light">Form General Properties</div>
          <div class="column p-2">
            <div class="form-group row justify-content-around">
              <label class="col-3 col-form-label">Validation Mode</label>
              <div class="col">
                <label for="online-validation" class="col-form-label mx-1">Online Mode</label>
                <input
                  v-model="validationMode"
                  value="eager"
                  type="radio"
                  id="online-validation">
                <label for="lazy-validation" class="col-form-label mx-1">Lazy Mode</label>
                <input
                  v-model="validationMode"
                  value="lazy"
                  type="radio"
                  id="lazy-validation">
                <!--<label for="no-validation" class="col-form-label mx-1">Disable</label>-->
                <!--<input-->
                  <!--v-model="validationMode"-->
                  <!--value="no"-->
                  <!--type="radio"-->
                  <!--id="no-validation">-->
              </div>
            </div>
            <div class="form-group row justify-content-around">
              <label class="col-3 col-form-label">Input Label Position</label>
              <div class="col">
                <label for="label-top" class="col-form-label mx-1">Top</label>
                <input
                  v-model="labelPosition"
                  value="top"
                  type="radio"
                  id="label-top">
                <label for="label-side" class="col-form-label mx-1">Side</label>
                <input
                  v-model="labelPosition"
                  value="side"
                  type="radio"
                  id="label-side">
              </div>
            </div>
            <div class="form-group row justify-content-around">
              <label for="field-submission-url" class="col-3 col-form-label">Submission Url</label>
              <div class="col">
                <input
                  class="form-control"
                  type="text"
                  v-model="submissionUrl"
                  :placeholder="`Enter submission url for form`"
                  id="field-submission-url">
              </div>
            </div>
            <div class="form-group row justify-content-around">
              <label for="file-upload-url" class="col-3 col-form-label">File Upload Url</label>
              <div class="col">
                <input
                  class="form-control"
                  type="text"
                  v-model="uploadUrl"
                  :placeholder="`Enter file upload url for form`"
                  id="file-upload-url">
              </div>
            </div>
          </div>
        </div>
        <transition-group name="flip-list">
          <template v-for="(item, index) in fields">
            <object-customizer
              v-if="item.type === 'object' || item.type === 'array'"
              :key="item.id"
              v-model="fields[index]['value']"
              @array="changeType"
              :id="item.id"
              @move="handleObjectPop"
              @remove="handleRemove"/>
            <field-customizer
              v-else
              v-model="fields[index]"
              :key="item.id"
              @move="handleFieldMove"
              @remove="handleRemove"/>
          </template>
        </transition-group>
        <div class="row col-12 justify-content-center">
          <button type="button"
                  class="btn btn-primary m-1"
                  @click="fields.push({
                    id: `Field-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    type: 'text',
                    size: 12,
                  })">
            Add Field
          </button>
          <button type="button"
                  class="btn btn-primary m-1"
                  @click="fields = [...fields, {
                      type: 'object',
                      id: `Object-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                      value: [],
                    }
                  ]">
            Add Object
          </button>
        </div>
      </div>
      <div class="col-12 col-xl-6 mt-2">
        <v-form
          v-if="fields.length"
          ref="preview"
          :schema="generatedSchema"
          :ui-schema="generatedUiSchema"
          :live-validate="validationMode"
          v-model="formValue">
          <div class="row">
            <div class="row col-md-12 mt-2 justify-content-end">
              <button type="button"
                      class="btn btn-primary"
                      @click="submit">
                Submit
              </button>
            </div>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
  import FieldCustomizer from '../components/field-customizer'
  import ObjectCustomizer from '../components/object-customizer'

  const defaultWidget = {
    schema: {},
    uiSchema: {},
  }
  const propMap = {
    text: 'string',
    password: 'string',
    file: 'string',
    select: 'string',
    searchSelect: 'string',
    radio: 'string',
    checkbox: 'string',
    number: 'number',
    integer: 'integer',
    boolean: 'boolean',
  }
  const widgetMap = {
    text: 'text',
    password: 'password',
    file: 'file',
    select: 'select',
    searchSelect: 'searchselect',
    radio: 'radio',
    checkbox: 'checkboxgroup',
    number: 'text',
    boolean: 'checkbox',
  }

  export default {
    components: {
      FieldCustomizer,
      ObjectCustomizer,
    },
    data () {
      return {
        defaultWidget: defaultWidget,
        fields: [],
        fileUploadEndpoint: '',
        formValue: {},
        validationMode: 'lazy',
        labelPosition: 'top',
        submissionUrl: '',
        uploadUrl: '',
      }
    },
    computed: {
      generatedSchema () {
        let schema = {
          'type': 'object',
          'properties': {},
        }
        let requiredFields = []
        this.fields.forEach(item => {
          if (item.type === 'object') {
            schema.properties[(item.key || item.id)] = {
              'type': 'object',
              'properties': {},
            }
            item.value.forEach(field => this.jsonMapper(field, schema.properties[(item.key || item.id)], null))
          } else if (item.type === 'array') {
            schema.properties[(item.key || item.id)] = {
              'type': 'array',
              'title': '',
              'minItems': 1,
              'uniqueItems': true,
              'items': {
                'type': 'object',
                'properties': {},
              }
            }
            item.value.forEach(field => this.jsonMapper(field, schema.properties[(item.key || item.id)].items, null))
          } else {
            this.jsonMapper(item, schema, requiredFields)
          }
        })
        schema.required = requiredFields
        return schema
      },
      generatedUiSchema () {
        let schema = {
          'ui:options': {},
        }
        this.fields.forEach(item => {
          if (item.type === 'object') {
            schema[(item.key || item.id)] = {
              'ui:options': {
                'label': '',
              },
            }
            item.value.forEach(field => this.uiMapper(field, schema[(item.key || item.id)]))
          } else if (item.type === 'array'){
            schema[(item.key || item.id)] = {
              'ui:options': {
                'label': '',
                'prop': 'TableProp',
                'classNames': 'mx-auto btn-success rounded-0 text-white',
                'flattener': {},
              },
              'items': {
                'ui:options': {
                  'horizontal': true,
                },
              }
            }
            item.value.forEach(field => this.uiMapper(field, schema[(item.key || item.id)].items))
          } else {
            this.uiMapper(item, schema)
          }
        })
        return schema
      },
      handlers () {
        return {
          async onUpload (val, progress) {
            const formData = new FormData()
            formData.append('media', val)
            try {
              const responseData = await this.$axios.$post(this.fileUploadEndpoint, formData, {
                onUploadProgress (progressEvent) {
                  if (progress) {
                    progress(progressEvent)
                  }
                },
              })
            } catch (e) {
            }
          },
        }
      },
    },
    methods: {
      download(filename, text) {
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      },
      async buildBundle () {
        const data = await this.$axios.$post('/api/build', {
          schema: this.generatedSchema,
          uiSchema: this.generatedUiSchema,
        })
        const blob = new Blob([data], {type: 'application/javascript'})
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'bundle.js'
        link.click()
      },
      async submit () {
        this.$refs.preview.validateAll()
        await this.$axios.$post(this.submissionUrl, this.formValue)
      },
      jsonMapper (item, schema, requiredFields) {
        schema.properties[(item.key || item.id)] = {
          type: propMap[item.type],
          title: item.label,
          description: item.description,
          enum: item.enum,
          enumOptions: item.enum,
          minLength: item.minLength ? parseInt(item.minLength) : undefined,
          maxLength: item.maxLength ? parseInt(item.maxLength) : undefined,
        }
        if (item.required) {
          if (!requiredFields) {
            if (!schema.required) {
              schema.required = []
            }
            schema.required.push((item.key || item.id))
          } else {
            requiredFields.push((item.key || item.id))
          }
        }
      },
      uiMapper (item, schema) {
        schema[(item.key || item.id)] = {
          'ui:options': {
            widget: widgetMap[item.type],
            size: parseInt(item.size),
            placeholder: item.placeholder,
            inputType: item.type,
            displayErrors: true,
            classNames: item.classNames,
            labelPosition: this.labelPosition,
          },
        }
        if (item.type === 'searchSelect') {
          schema[(item.key || item.id)]['ui:options']['selectOptions'] = {
            'label': 'label',
            'trackBy': 'value',
            'showLabels': false,
          }
        }
      },
      move (array, from, to) {
        if (array.length === 1) return array
        array.splice(to, 0, array.splice(from, 1)[0])
        return array
      },
      handleRemove ({id}) {
        const from = this.fields.findIndex(item => item.id === id)
        this.fields.splice(from, 1)
      },
      handleFieldMove ({id, dir}) {
        const from = this.fields.findIndex(item => item.type !== 'object' && item.type !== 'array' && item.id === id)
        const to = from + dir
        if (to < 0 || to > this.fields.length - 1) {
          return
        }
        if (this.fields[to]['type'] !== 'object' && this.fields[to]['type'] !== 'array') {
          this.move(this.fields, from, to)
        } else {
          const pop = this.fields.splice(from, 1)[0]
          setTimeout(() => {
            dir < 0 ? this.fields[to]['value'].push(pop) : this.fields[to - 1]['value'].splice(0, 0, pop)
          }, 10)
        }
      },
      handleObjectPop ({id, from, dir}) {
        const objectIndex = this.fields.findIndex(item => item.id === id)
        const pop = this.fields[objectIndex]['value'].splice(from, 1)[0]
        this.fields.splice(dir < 0 ? objectIndex : objectIndex + dir, 0, pop)
      },
      changeType ({id, checked}) {
        const objectIndex = this.fields.findIndex(item => item.id === id)
        if (objectIndex >= 0) {
          this.$set(this.fields[objectIndex], 'type', checked ? 'array' : 'object')
        }
      }
    },
  }
</script>

<style>
  .flip-list-move {
    transition: transform 0.5s;
  }

  .form-control:focus {
    box-shadow: 0 0 0;
  }

  @media (min-width: 1200px){
    .container{
      max-width:100%;
    }
  }
</style>
