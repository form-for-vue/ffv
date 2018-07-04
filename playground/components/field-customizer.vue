<template>
  <div class="card m-1">
    <div class="card-header" @click="$store.commit('changeEditingField', value.id)">
      <div class="row align-items-center">
        <div class="col">{{ key }}</div>
        <button
          type="button"
          class="btn btn-info m-1"
          @click.stop="$emit('move', {id: value.id, dir: -1})">⮝</button>
        <button
          type="button"
          class="btn btn-info m-1"
          @click.stop="$emit('move', {id: value.id, dir: 1})">⮟</button>
        <button
          type="button"
          class="btn btn-danger m-1"
          @click.stop="$emit('remove', {id: value.id})">🗙</button>
      </div>
    </div>
    <transition name="slide">
      <div v-show="$store.getters.shouldShow(value.id)" class="p-2">
        <div class="form-group row justify-content-around">
          <label for="field-key" class="col-2 col-form-label">key</label>
          <div class="col">
            <input
              class="form-control"
              type="text"
              v-model="value.key"
              @input="emitChange($event, 'key')"
              :placeholder="`Enter a key for field`"
              id="field-key">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-label" class="col-2 col-form-label">Label</label>
          <div class="col">
            <input
              class="form-control"
              type="text"
              v-model="value.label"
              @input="emitChange($event, 'label')"
              :placeholder="`Enter a label for ${key}`"
              id="field-label">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-placeholder" class="col-2 col-form-label">Placeholder</label>
          <div class="col">
            <input
              class="form-control"
              type="text"
              v-model="value.placeholder"
              @input="emitChange($event, 'placeholder')"
              :placeholder="`Enter a placeholder for ${key}`"
              id="field-placeholder">
          </div>
        </div>
        <div class="form-group row justify-content-around">
          <label for="field-type" class="col-2 col-form-label">Type</label>
          <div class="col">
            <select class="form-control" id="field-type" v-model="value.type" @input="emitChange($event, 'type')">
              <option value="text">Text</option>
              <option value="password">Password</option>
              <!--<option value="textarea">Text Area</option>-->
              <option value="file">File</option>
              <option value="select">Select</option>
              <option value="searchSelect">Searchable Select</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="boolean">Boolean</option>
              <option value="number">Number</option>
            </select>
          </div>
        </div>
        <div v-if="value.enum" class="form-group row justify-content-around mx-2 px-2 border">
          <label for="field-type" class="col-2 col-form-label">Options</label>
          <div class="col">
            <input
              v-for="(item, index) in value.enum"
              :key="index"
              class="form-control my-2"
              type="text"
              v-model="value['enum'][index]"
              @input="emitChange($event, 'enum', index)"
              :id="`option-${index}`">
            <button type="button"
                    class="btn btn-primary my-2"
                    @click="value['enum'].push('')">
              Add Option
            </button>
          </div>
        </div>
        <template v-if="moreOptions">
          <div class="form-group row justify-content-start">
            <label for="field-required" class="col-2 col-form-label">Required</label>
            <div class="row col-1 align-items-center">
              <input
                class="form-control"
                type="checkbox"
                v-model="value.required"
                @change="emitChange($event, 'required')"
                id="field-required">
            </div>
          </div>
          <div class="form-group row justify-content-around">
            <label for="field-description" class="col-2 col-form-label">Description</label>
            <div class="col">
              <input
                class="form-control"
                type="text"
                v-model="value.description"
                @input="emitChange($event, 'description')"
                :placeholder="`Enter a description for ${key}`"
                id="field-description">
            </div>
          </div>
          <div class="form-group row justify-content-around">
            <label for="field-placeholder" class="col-2 col-form-label">Class Names</label>
            <div class="col">
              <input
                class="form-control"
                type="text"
                v-model="value.classNames"
                @input="emitChange($event, 'classNames')"
                :placeholder="`Enter class names for ${key}`"
                id="field-classnames">
            </div>
          </div>
          <template v-if="['text', 'textarea'].includes(value.type)">
            <div class="form-group row justify-content-around">
              <label for="field-min-length" class="col-2 col-form-label">Minimum Length</label>
              <div class="col">
                <input
                  class="form-control"
                  type="number"
                  min="0"
                  v-model="value.minLength"
                  @input="emitChange($event, 'minLength')"
                  :placeholder="`Enter minimum number of characters for ${key}`"
                  id="field-min-length">
              </div>
            </div>
            <div class="form-group row justify-content-around">
              <label for="field-max-length" class="col-2 col-form-label">Maximum Length</label>
              <div class="col">
                <input
                  class="form-control"
                  type="number"
                  min="0"
                  v-model="value.maxLength"
                  @input="emitChange($event, 'maxLength')"
                  :placeholder="`Enter maximum number of characters for ${key}`"
                  id="field-max-length">
              </div>
            </div>
            <!--<div class="form-group row justify-content-around">-->
              <!--<label for="field-pattern" class="col-2 col-form-label">Pattern</label>-->
              <!--<div class="col">-->
                <!--<select class="form-control" id="field-pattern" v-model="value.pattern" @input="emitChange($event, 'pattern')">-->
                  <!--<option v-for="pattern in patterns" :value="pattern.value">{{ pattern.name }}</option>-->
                <!--</select>-->
              <!--</div>-->
            <!--</div>-->
          </template>
          <div class="form-group row justify-content-around">
            <label for="field-size" class="col-2 col-form-label">Size</label>
            <div class="col">
              <input
                class="form-control"
                type="number"
                min="1"
                max="12"
                v-model="value.size"
                @input="emitChange($event, 'size')"
                :placeholder="`Enter number of bootstrap columns for ${key}`"
                id="field-size">
            </div>
          </div>
        </template>
        <button type="button" class="btn btn-link" @click="moreOptions = !moreOptions">
            {{ moreOptions ? '- less' : '+ more' }} options
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
      }
    },
    data () {
      return {
        key: (this.value.key || this.value.id).slice(),
        patterns: [
          { 'name': 'email', 'value': '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$' },
        ],
        show: true,
        moreOptions: false,
      }
    },
    methods: {
      emitChange(e, field, enumIndex) {
        if (field === 'key') {
          this.key = (this.value.key || this.value.id).slice()
        } else if (field === 'type') {
          const type = e.target.value
          if (type === 'select' || type === 'radio' || type === 'checkbox' || type === 'searchSelect') {
            this.value['enum'] = []
            this.$emit('input', this.value)
          } else {
            delete this.value['enum']
            this.$emit('input', this.value)
          }
        }
        if (field === 'enum') {
          this.value['enum'][enumIndex] = e.target.value
          this.$emit('input', this.value)
        } else {
          this.$emit('input',
            Object.assign({}, this.value, {[field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}))
        }
      },
    }
  }
</script>

<style>
  .slide-enter-active,
  .slide-leave-active {
    max-height: 200px;
  }

  .slide-enter,
  .slide-leave-to /* .slide-leave-active below version 2.1.8 */ {
    max-height: 0;
    overflow-y: hidden;
    -webkit-transition: max-height 0.3s ease-in-out;
    -moz-transition: max-height 0.3s ease-in-out;
    -o-transition: max-height 0.3s ease-in-out;
    transition: max-height 0.3s ease-in-out;
  }

</style>
