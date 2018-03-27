<template>
  <div class="d-flex">
    <div class="col-6">
      <div class="row justify-content-center">
        <button type="button"
                class="btn btn-primary m-1"
                @click="buildBundle">
          Build Form Bundle
        </button>
      </div>
      <div class="card m-1">
        <div class="card-header bg-dark text-light">Form General Properties</div>
        <div class="column">
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
              <label for="no-validation" class="col-form-label mx-1">Disable</label>
              <input
                v-model="validationMode"
                value="no"
                type="radio"
                id="no-validation">
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
        </div>
      </div>
      <transition-group name="flip-list">
        <template v-for="(item, index) in fields">
          <group-customizer
            v-if="item.type === 'group'"
            :key="item.id"
            v-model="fields[index]['value']"
            :id="item.id"
            @move="handleGroupPop"
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
                    type: 'group',
                    id: `Group-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    value: [],
                  }
                ]">
          Add Group
        </button>
      </div>
      <div>{{generatedSchema}}</div><br/>
      <div>{{generatedUiSchema}}</div>
    </div>
    <div class="col-6">
    <v-form
      ref="preview"
      :schema="generatedSchema"
      :ui-schema="generatedUiSchema"
      :live-validate="validationMode"
      v-model="formValue">
      <div class="row mx-1 justify-content-end">
        <button type="button"
                class="btn btn-primary m-1"
                @click="submit">
          Submit
        </button>
      </div>
    </v-form>
    </div>
  </div>
</template>

<script>
  import FieldCustomizer from '../components/field-customizer'
  import GroupCustomizer from '../components/group-customizer'

  const defaultSchema = {
    "type": "object",
    "properties": {}
  }
  const defaultUiSchema = {
    "ui:options": {
      // "$id": ""
    },
  }
  const defaultWidget = {
    schema: {},
    uiSchema: {}
  }
  const propMap = {
    text: 'string',
    password: 'string',
    textarea: 'string',
    file: 'string',
    select: 'string',
    radio: 'string',
    number: 'number',
    integer: 'integer',
    boolean: 'boolean'
  }
  const widgetMap = {
    text: 'text',
    password: 'password',
    textarea: 'textarea',
    file: 'file',
    select: 'select',
    radio: 'radio',
    number: 'text',
    boolean: 'checkbox'
  }

  export default {
    components: {
      FieldCustomizer,
      GroupCustomizer,
    },
    data () {
      return {
        defaultWidget: defaultWidget,
        fields: [],
        fileUploadEndpoint: '',
        formValue: {},
        validationMode: 'lazy',
        submissionUrl: '',
      }
    },
    computed: {
      generatedSchema() {
        let schema = {
          "type": "object",
          "properties": {}
        }
        let requiredFields = []
        this.fields.forEach(item => {
          if (item.type !== 'group') {
            this.jsonMapper(item, schema, requiredFields)
          } else {
            item.value.forEach(field => this.jsonMapper(field, schema, requiredFields))
          }
        })
        schema.required = requiredFields
        return schema
      },
      generatedUiSchema() {
        let schema = {
          "ui:options": {
            "ui:groups": [ { "props": "*" } ]
          }
        }
        this.fields.forEach(item => {
          const keys = []
          if (item.type === 'group') {
            item.value.forEach(field => this.uiMapper(field, schema, keys))
          } else {
            this.uiMapper(item, schema, keys)
          }
          if (keys.length > 0) {
            schema['ui:options']['ui:groups'].push({"ui:options": {"classNames": "d-flex flex-column"}, "props": keys })
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
                }
              })
            } catch (e) {
            }
          }
        }
      },
    },
    methods: {
      async buildBundle () {
        const data = await this.$axios.$post('/api/build', {
          schema: this.generatedSchema,
          uiSchema: this.generatedUiSchema
        })
        const blob = new Blob([data], { type: 'application/javascript' } )
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
          minLength: item.minLength ? parseInt(item.minLength) : undefined,
          maxLength: item.maxLength ? parseInt(item.maxLength) : undefined,
          pattern: item.pattern,
        }
        if (item.required) {
          requiredFields.push((item.key || item.id))
        }
      },
      uiMapper (item, schema, keys=[]) {
        schema[(item.key || item.id)] = {
          "ui:options": {
            widget: widgetMap[item.type],
            size: parseInt(item.size),
            placeholder: item.placeholder,
            inputType: item.type,
            displayErrors: true,
            classNames: "mx-1",
          }
        }
        keys.push(item.key || item.id)
      },
      move (array, from, to) {
        if (array.length === 1) return array
        array.splice(to, 0, array.splice(from, 1)[0])
        return array
      },
      handleRemove({ id }){
        const from = this.fields.findIndex(item => item.id === id)
        this.fields.splice(from, 1)
      },
      handleFieldMove ({ id, dir }) {
        const from = this.fields.findIndex(item => item.type !== 'group' && item.id === id)
        const to = from + dir
        if (to < 0 || to > this.fields.length - 1) {
          return
        }
        if (this.fields[to]['type'] !== 'group') {
          this.move(this.fields, from, to)
        } else {
          const pop = this.fields.splice(from, 1)[0]
          setTimeout(()=>{
            dir < 0 ? this.fields[to]['value'].push(pop) : this.fields[to - 1]['value'].splice(0, 0, pop)
          }, 10)
        }
      },
      handleGroupPop ({ id, from, dir }) {
        const groupIndex = this.fields.findIndex(item => item.type === 'group' && item.id === id)
        const pop = this.fields[groupIndex]['value'].splice(from, 1)[0]
        this.fields.splice(dir < 0 ? groupIndex : groupIndex + dir, 0, pop)
      },
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
</style>
