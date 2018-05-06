<template>
  <div :class="`col-md-${size}`">
    <div class="row justify-content-center">
      <schema-prop
        :schema="schema.items"
        :uiSchema="uiSchema.items"
        :errorSchema="errorSchema"
        :value="itemValue"
        :registry="registry"
        @input="handleInput"
        @blur="handleBlur"
      />
    </div>

    <div class="row justify-content-center mt-4 mb-5">
      <b-btn
        class="table-prop__add-btn-text px-3"
        @click="add"
        variant="success"
        :disabled="isInternalValueEmpty()">
        <span>+</span>
        {{ uiOptions.addBtnText || 'Add' }}
      </b-btn>
    </div>

    <b-table
      id="table-prop__table"
      v-show="flattenValue && flattenValue.length > 0"
      :fields="fields"
      :items="flattenValue"
      bordered
      fixed
      striped
      hover
    >
      <!--<template slot="HEAD_index"/>-->
      <!--<template slot="HEAD_reorder"/>-->

      <template
        v-for="field in fields"
        v-if="!['reorder', 'remove'].includes(field.key)"
        :slot="field.key"
        scope="data"
      >
        <span
          :key="`${field.key}-${data.index}`"
          :title="data.value"
          v-b-tooltip.hover.right
        >
          {{ data.value }}
        </span>
      </template>
      <template slot="index" scope="data">
        <div class="d-flex flex-column justify-content-center align-items-center">
          {{ data.index }}
        </div>
      </template>
      <template slot="reorder" scope="data">
        <div class="d-flex flex-column justify-content-center align-items-center">
          <fa-icon
            icon="chevron-up"
            @click="reorderUp(data.index)"
            style="cursor: pointer;"
            size="lg"/>
          <fa-icon
            icon="chevron-down"
            @click="reorderDown(data.index)"
            style="cursor: pointer;"
            size="lg"/>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { arrayMixin, objectMixin } from '../mixins'

  export default {
    mixins: [arrayMixin, objectMixin],

    props: {
      name: String,
      schema: Object,
      uiSchema: Object,
      errorSchema: [Object, Boolean],
      idSchema: Object,
      value: Array,
      registry: Object,
      uiOptions: Object,
    },

    data () {
      return {
        itemValue: null,
        internalValue: this.value || [],
        index: Array.isArray(this.value) ? this.value.length : 0,
        itemsProps: this.schema && this.schema.items ? this.schema.items.properties : [],
        itemsUiOptions: this.uiSchema.items && this.uiSchema.items['ui:options'] ? this.uiSchema.items['ui:options'] : {},
        size: 12,
      }
    },

    computed: {
      fields () {
        const fields = this.orderProperties(Object.keys(this.itemsProps), this.itemsUiOptions.order).filter(propName => {
          return propName !== '_id'
        }).map(propName => {
          return {
            key: propName,
            label: this.itemsProps[propName].title || propName,
            thClass: 'table-prop__table__header',
            tdClass: 'table-prop__table__col',
            sortable: true,
          }
        })

        return [
          {
            key: 'index',
            thClass: 'table-prop__table__action-head',
            tdClass: 'table-prop__table__action-col',
          },
          ...fields,
          {
            key: 'reorder',
            thClass: 'table-prop__table__action-head',
            tdClass: 'table-prop__table__action-col',
          },
        ]
      },
      flattenValue () {
        return (this.value || []).map(item => {
          if (typeof item === 'object') {
            return Object.keys(item).reduce((flattenedItem, propName) => {
              flattenedItem[propName] = this.flattenProp(propName, item[propName])
              return flattenedItem
            }, {})
          }
        })
      },
    },

    methods: {
      add () {
        if (!this.isInternalValueEmpty()) {
          this.onAddClick()
          this.internalValue.splice(this.index, 1, this.itemValue)
          this.$emit('input', { value: this.internalValue })
          this.index = this.internalValue.length
          // TODO set itemValue to null is not working
          this.itemValue = null
        }
      },
      remove (index) {
        this.onDropIndexClick(index)
        this.index = this.internalValue.length
      },
      reorderUp (index) {
        if (index > 0) {
          this.onReorderClick(index, index - 1)
        }
      },
      reorderDown (index) {
        if (index < this.internalValue.length - 1) {
          this.onReorderClick(index, index + 1)
        }
      },
      handleInput ({ value }) {
        this.itemValue = value
      },
      handleBlur ({ value }) {
        this.itemValue = value
      },
      flattenProp (name, value) {
        function flatten (prop) {
          if (Array.isArray(prop)) {
            return prop.map(child => {
              return flatten.call(this, child)
            }).join(',')
          } else if (typeof prop === 'object') {
            if (this.uiOptions.flattener) {
              return prop[this.uiOptions.flattener[name]]
            } else {
              throw new Error('[ffv] ui:options flattener not available! provide flattener object when value array contains complex objects')
            }
          } else {
            return prop
          }
        }

        if (value) {
          return flatten.call(this, value)
        }
      },
      // TODO checking if all values are not null, empty string ('')
      isInternalValueEmpty () {
        if (this.itemValue) {
          return Object.keys(this.itemValue).every(prop => {
            return !this.itemValue[prop] || this.itemValue[prop] === '' || (Array.isArray(this.itemValue[prop]) && !this.itemValue[prop].length)
          })
        } else {
          return true
        }
      },
    }
  }
</script>

<style lang="scss">
  /*@import '~assets/sass/variables';*/
  /*@import "~bootstrap/scss/mixins/_breakpoints";*/

  .table-prop__add-btn-text {
    color: white;
    border: 0;
    border-radius: 0;
  }

  .table-prop__table__header {
    /*color: $primary;*/
  }

  .table-prop__table__action-head {
    width: 6%;
    visibility: hidden;

    /*@include media-breakpoint-down(lg) {
      width: 10%;
    }*/
  }

  .table-prop__table__col {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .table-prop__table__action-col {
    /*color: $secondary;*/
  }

  #table-prop__table.table {
    th, td {
      vertical-align: middle;
    }

    td {
      border-top: none;
      border-bottom: none;
    }
  }

  #table-prop__table.table-hover {
    tbody tr {
      &:hover {
        color: black;
        /*background-color: lighten($primary, 40%);*/
        transition: 0.2s;
        transition-timing-function: linear;

        .table-prop__table__action-col {
          color: white;
          /*background-color: $primary-light;*/
        }
      }
    }
  }
</style>
