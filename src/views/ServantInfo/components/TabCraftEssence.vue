<template>
  <div class="craft-essence">
    <div class="craft-essence_title">{{data.name}}</div>
    <div class="craft-essence_header">
      <img :src="base+data.imgPath" alt="" class="craft-essence_avatar"/>
      <div class="row">
        <div class="col" data-title="画师">
          {{data.illust}}
        </div>

      </div>
      <div class="row">
        <div class="col" data-title="稀有度">
          {{data.star}}星
        </div>
        <div class="col" data-title="COST">
          {{data.cost}}
        </div>
      </div>
      <div class="row">
        <div class="col" data-title="ATK">
          {{data.lv1Atk}}/{{data.lvmaxAtk}}
        </div>
        <div class="col" data-title="HP">
          {{data.lv1Hp}}/{{data.lvmaxHp}}
        </div>
      </div>
    </div>
    <div class="craft-essence_main">
      <div class="row">
        <div class="col" data-title="技能">
          <div class="row">{{data.skillE}}</div>
          <div class="row">{{data.skillMaxE}}</div>
        </div>
      </div>
      <div class="row">
        <div class="col content" v-html="introFormate(data.intro)">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from '@/conf/image';
export default {
  data() {
    return {
      base: BASE_URL
    };
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    introFormate(val) {
      return val.replace(/^\s/,'').replace(/\s/g, '<br>');
    }
  }
};
</script>

<style scoped lang="scss">
.craft-essence {
  margin-top: 10px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  & > div {
    border-bottom: 1px solid var(--border-color);
  }
  &_title {
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    font-size: 1.2em;
    font-weight: 600;
    line-height: 2;
  }
  &_header {
    //height: 80px;
    position: relative;
    padding-left: 72px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  &_avatar {
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(0.8);
  }
  &_main {
    border-right: 1px solid var(--border-color);
  }
}
.row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  &:not(:last-of-type) {
    border-bottom: 1px solid var(--border-color);
  }
  .col {
    flex-grow: 1;
    width: 50%;

    line-height: 25.6px;
    position: relative;
    .row {
      padding: 4px 8px;
    }
    &::before {
      position: absolute;
      content: '';
      left: 0;
      top: 0;
      height: 100%;
      border-left: 1px solid var(--border-color);
    }
    &[data-title] {
      padding-left: 72px;
      &::before {
        content: attr(data-title);

        width: 72px;

        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
      }
    }
  }
}
.content {
  padding: 0.6em 1em;
  text-align: left;
}
</style>