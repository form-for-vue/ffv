<template>
  <div :id="id" :class="{[classNames]: classNames, [`col-md-${size}`]: size}">
    <div :class="{'row align-items-center': labelPosition === 'side'}">
      <label
        v-if="displayLabel"
        class="text-secondary"
        :class="{
          [`col-md-${12 / size} mb-0`]: labelPosition === 'side'
      }">
        {{ label }}
      </label>
      <div :class="{'col-md': labelPosition === 'side'}">
        <multiselect
          :value="value"
          :options="optionList"
          :optionsLimit="5"
          v-bind="selectOptions"
          :loading="isLoading === 1"
          :disabled="disabled"
          @input="handleInput"
          @search-change="handleSearch"
        />
      </div>
    </div>
    <div v-if="displayLabel" class="text-muted small">{{ description }}</div>
    <div v-if="displayErrors" class="text-danger small">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
  import { arrayMixin, widgetMixin } from '../mixins'
  import Multiselect from 'vue-multiselect'
  import _ from 'lodash'

  export default {
    components: {
      Multiselect,
    },

    mixins: [arrayMixin, widgetMixin],

    props: {
      selectOptions: Object,
      optionsPath: String,
      fetchQuery: String,
      labelPosition: {
        type: String,
        default: 'side',
        validator: value => ['side', 'top'].includes(value),
      },
      icon: String,
      enumOptions: Array,
    },

    data () {
      return {
        searchText: this.selectOptions && this.selectOptions.multiple === false && this.value ? this.value : '',
        isLoading: 0,
        skipQuery: !this.fetchQuery && this.enumOptions.length > 0,
      }
    },

    computed: {
      optionList () {
        if (this.fetchQuery) {
          if (this.options) {
            if (this.optionsPath) {
              return _.get(this.options, this.optionsPath)
            } else {
              return this.options
            }
          } else {
            return []
          }
        } else {
          return this.enumOptions
        }
      }
    },

    methods: {
      handleSearch: _.debounce(function (query) {
        this.searchText = query
      }, 500),
      handleInput (value) {
        this.$emit('input', { value })
        this.$emit('blur', { value })
      },
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">

  .multiselect__option--highlight {
    background: #28a745 !important;
    &:after {
      background: #28a745 !important;
    }
  }

  .multiselect__tags {
    border: 0;
    border-radius: 0;
    /*TODO change it to sass variable after style refactor*/
    background: #f8f9fa;
    & > * {
      background: #f8f9fa;
    }
  }

  .multiselect__tag {
    background: #28a745;
  }

  .multiselect__tag-icon {
    color: white;
    &:after {
      color: white;
    }
  }

  /* TODO add font awesome chevron down */
  .multiselect__select:before {

  }
</style>
