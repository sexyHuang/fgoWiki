<template>
  <div>
    <van-popup v-model="show" position="top">
      <van-collapse v-model="activeName">

        <slot name="before-add">

        </slot>
        <template v-for="(item, index) in searchObj">
          <van-collapse-item :key="index*1+1" :title="item.title" :name="index" v-if="item.key !== 'search'">
            <van-radio-group v-model="output[item.key].match_type" class="radio-group" v-if="item.match_type">
              <van-radio name="or">任意匹配</van-radio>
              <van-radio name="and">同时匹配</van-radio>
            </van-radio-group>
            <template v-for="(_item, _idx) in item.lists">

              <van-checkbox-group v-model="output[item.key].list[_idx]" :key="_idx">
                <template v-for="(__item, __idx) in _item">
                  <!-- 简单模式 -->
                  <van-checkbox v-if="typeof __item === 'string'" :key="__item" :name="__item">
                    {{ __item }}
                  </van-checkbox>
                  <!-- 对象模式 -->
                  <van-checkbox v-else :key="__item.name" :name="__item.name" :style="'--select-color:'+ __item['select-color']">
                    {{__item.title||__item.name}}
                  </van-checkbox>
                </template>
                <div class="controllers-hr" v-if="_idx+1<item.lists.length" :key="'h'+_idx"> </div>
              </van-checkbox-group>
            </template>
          </van-collapse-item>
        </template>

        <template slot="before-after">

        </template>
      </van-collapse>
      <van-button type="primary" block @click="onSearch">确定</van-button>
    </van-popup>
    <div :class="['controllers',{hasTitle}]">
      <form action="/" class="form">
        <slot name="controller-left"></slot>
        <van-search v-model="searchValue" placeholder="请输入搜索关键词" background="transparent" @search="onSearch" />
         <slot name="controller-right"></slot>
        <div class="btn-menu" @click="openMenu">
          <van-icon name="wap-nav" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const MATCH_TYPE = {
  OR: 'or',
  AND: 'and'
};
const MATCH_MODE = {
  EQUAL: 'equal',
  LIKE: 'like'
};
export default {
  props: {
    searchObj: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      show: false,
      activeName: ['0'],
      searchValue: '',
      output: {}
    };
  },
  computed: {
    hasTitle() {
      return (
        !this.$store.state.system.isWeixin && this.$store.state.system.showTitle
      );
    }
  },
  methods: {
    openMenu() {
      this.show = true;
    },
    onSearch() {
      let _output = {};
      if (this.searchValue.trim()) {
        _output.search = this.searchValue.trim();
      }
      for (let _key of Object.keys(this.output)) {
        let _obj = this.output[_key];
        let match_mode = _obj.match_mode || MATCH_MODE.EQUAL;
        if (_key === 'search' && this.searchValue.trim()) {
          _output.search = {
            querys: [this.searchValue.trim()]
          };
        } else {
          let _item = [];

          let _mType = _obj.match_type;
          _obj.list.map(__item => {
            if (__item.join('|'))
              switch (_mType) {
                case MATCH_TYPE.OR: {
                  _item.push(__item.join('|'));
                  break;
                }
                case MATCH_TYPE.AND: {
                  _item.push(...__item);
                  break;
                }
              }
          });
          if (_item.length > 0) _output[_key] = { querys: _item };
        }
        if (_output[_key]) {
          _output[_key].match_mode = match_mode;
          _output[_key].match_keys = _obj.match_keys;
        }
      }

      this.$emit('search', _output);
      this.show = false;
    }
  },
  created() {
    let _output = {};

    this.searchObj.map(item => {
      _output[item.key] = {
        match_type: item.match_type || MATCH_TYPE.OR,
        list: new Array(item.lists ? item.lists.length : 1).fill([]),
        match_keys: item.match_keys || [item.key],
        match_mode: item.match_mode || MATCH_MODE.EQUAL
      };
    });
    this.output = _output;
  },
  watch: {
    searchValue(val, oVal) {
      if (!val.trim() && oVal.trim() != val.trim()) this.onSearch();
    }
  }
};
</script>

<style scoped lang='scss'>
.btn-menu {
  font-size: 1.4em;
  width: 1.2em;
  height: 1.2em;

  display: flex;
  margin-right: 0.4rem;

  justify-content: center;
  align-items: center;
  border-radius: 0.2em;
  opacity: 0.8;
}
.controllers {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  flex-shrink: 0;
  z-index: 10;
  background: var(--border-color);
  &.hasTitle {
    top: 1.22667rem;
  }
  .form {
    display: flex;
    align-items: center;
  }
  .van-search {
    flex-grow: 1;
  }
  &-hr {
    width: 100%;
    flex-shrink: 0;
    height: 1px;
    margin: 0 0 0 0.6em;
    background: var(--border-color);
  }
}

.radio-group {
  display: flex;
  height: 2.4em;
  padding: 0.2em 0.8em;
  color: var(--info-color);
}
.van-radio {
  margin-right: 1em;
  line-height: 1;
  display: flex;
  align-items: center;
}
</style>