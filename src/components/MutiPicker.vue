<template>
  <van-picker :columns="columns" @change="onChange" value-key="name" show-toolbar :title="title" @cancel="onCancel" @confirm="onConfirm" />
</template>

<script>
export default {
  data() {
    return {
      valk: 'text',
      columns: fmtColums(this.c_data, [0, 0, 0], this.picker_styles)
    };
  },
  props: {
    c_data: {
      type: [Object, Array],
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    },
    defaultIndex: {
      type: Array,
      default() {
        return [];
      }
    },
    picker_styles: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  watch: {
    c_data(val) {
      this.columns = fmtColums(val, this.defaultIndex, this.picker_styles);
    },
    defaultIndex(val) {
      this.$nextTick(() => {
        this.columns = fmtColums(this.c_data, val, this.picker_styles);
      });
    }
  },
  methods: {
    onChange(picker, values, index) {
      let selectedIndexs = [];
      for (let _idx = 0; _idx <= 2; _idx++) {
        selectedIndexs.push(picker.getColumnIndex(_idx));
      }
      this.columns = fmtColums(this.c_data, selectedIndexs, this.picker_styles);
    },
    onCancel() {
      this.$emit('cancel');
    },
    onConfirm(values, indexs) {
      this.$emit('confirm', values, indexs);
    }
  }
};

function fmtColums(data, selectedIndexs = [], styles = [], columns = []) {
  selectedIndexs = selectedIndexs.slice(0);
  styles = styles.slice(0);
  let _style = styles.shift() || '';
  let _idx = selectedIndexs.shift() || 0;
  data = JSON.parse(JSON.stringify(data));
  if (Array.isArray(data)) {
    columns.push({
      values: data,
      defaultIndex: _idx,
      className: _style
    });
    return columns;
  } else {
    let keys = Object.keys(data);
    columns.push({
      values: keys,
      defaultIndex: _idx,
      className: _style
    });
    return fmtColums(data[keys[_idx]], selectedIndexs, styles, columns);
  }
}
</script>

<style>
.longer-text {
  flex: 2;
}
.longest-text {
  flex: 3;
  font-size: 0.9em;
}
</style>