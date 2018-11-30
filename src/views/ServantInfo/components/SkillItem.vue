<template>
  <div class="skill-item">
    <div class="skill-item-header">
      <img
        :src="skillIcon"
        alt=""
        class="skill-item-icon"
        @click="$emit('clickIcon',skill)"
      >
      <div class="skill-item-name">
        {{skill.skillName}}{{skill.rank?'['+skill.rank+'] ':' '}}(CD:<span style="color: #fab70d">{{cd}}</span>)

        <div
          :class="['skill-change-btn',{'un-checked': !isNew}]"
          @click="changeNew"
          v-if="data.length>1"
        ></div>
      </div>
      <div
        class="skill-item-tar"
        v-if="skill.skillsTar"
      >{{skill.skillsTar}}</div>
    </div>
    <div class="skill-item-main">
      <div
        class="skill-item-effect"
        v-for="(item, index) in skillDesc"
        :key="index"
      >
        <div class="skill-item-effect__desc">{{item}}</div>
        <ul class="skill-item-effect__data_ul">
          <template v-for="(_item, _index) in lv">
            <li
              :class="['skill-item-effect__data_li',{
              active: value === _index + 1||(_item[index] == lv[0][index]&&_item[index] == lv[9][index])
            }]"
              :key="_index"
              v-if="_index==0||!(_item[index] == lv[0][index]&&_item[index] == lv[9][index])"
              @click="clickLv(_index)"
            >
              <div :class="{'smaller-text':_item[index].length>4}">{{_item[index]}}</div>
            </li>
          </template>

        </ul>
      </div>
      <div class="slider-cout">
        技能等级
        <van-slider
          v-model="sliderVal"
          :step="10"
          :min="10"
          @change="slideChange"
        ></van-slider>{{value}}

      </div>

    </div>
  </div>
</template>

<script>
import { BASE_URL } from '@/conf/image';
export default {
  data() {
    return {
      isNew: true,
      sliderVal: 0
    };
  },
  computed: {
    skill() {
      return this.isNew ? this.data[this.data.length - 1] : this.data[0];
    },

    skillIcon() {
      return BASE_URL + this.skill.imgPath;
    },
    skillDesc() {
      return this.skill.skillDesc.split('&');
    },
    lv() {
      return JSON.parse(this.skill.lv).map(val => val.split('/'));
    },
    cd() {
      let sub = 0;
      if (this.value >= 6) {
        sub += 1;
      }
      if (this.value === 10) sub += 1;
      return this.skill.cd - sub;
    }
  },
  methods: {
    changeNew() {
      this.isNew = !this.isNew;
    },
    slideChange(val) {
      this.$emit('input', val / 10);
    },
    clickLv(idx) {
      this.$emit('input', idx + 1);
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Number,
      default: 1
    }
  },
  watch: {
    value(val) {
      this.sliderVal = val * 10;
    }
  },
  mounted() {
    this.sliderVal = this.value * 10;
  }
};
</script>

<style scoped lang="scss">
.smaller-text {
  transform: scale(0.74);
}
.skill-change-btn {
  background: url('./../../../assets/skill_up.png') center/100% no-repeat;
  width: 1.5em;
  height: 1.5em;
  margin-left: 0.5em;
  &.un-checked {
    filter: grayscale(100%);
  }
}
.skill-item {
  border: 1px solid var(--border-color);
  padding: 8px 4px;
  margin: 8px 0;
  &-header {
    position: relative;
    height: 54px;
    padding-left: 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &-name {
    display: flex;
    align-items: center;
    font-size: 16px;
    flex-grow: 1;
  }
  &-icon {
    width: 54px;
    height: 54px;
    position: absolute;
    left: 0;
    top: 0;
  }
  &-tar {
    font-size: 12px;
    display: flex;
    align-items: center;
    color: var(--muted-color);
    line-height: 1.2em;
    flex-grow: 2;
  }
  .skill-item-effect {
    font-size: 12px;
    color: var(--info-color);
    &__desc {
      line-height: 2em;
    }
    &__data_ul {
      display: flex;
      justify-content: center;
      border: 1px solid var(--border-color);
    }
    &__data_li {
      flex-grow: 1;
      text-align: center;
      cursor: pointer;
      &:not(:last-of-type) {
        border-right: 1px solid var(--border-color);
      }
      max-width: 10%;
      &:only-child {
        max-width: 100%;
      }
      &.active {
        color: #fab70d;
        pointer-events: none;
      }
    }
  }
}
.slider-cout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-right: 10px;
  .van-slider {
    flex-grow: 1;
    margin: 0 10px;
  }
}
</style>
<style lang="scss">
.van-slider__bar {
  background: #fab70d;
}
</style>