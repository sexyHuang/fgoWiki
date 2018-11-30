<template>
  <div class="treasure-tab">
    <div class="treasure-main">
      <div :class="'icon-'+treasure.tType" :data-text="treasure.treaHit|hits"></div>
      <div class="treasure-name">
        <div class="treasure-name_cn">{{treasure.tName}}</div>
        <div class="treasure-name_en">{{treasure.tName_en}}</div>
      </div>
      <div :class="['treasure-change-btn',{'un-checked': !isNew}]" @click="changeNew" v-if="data.length>1"></div>
    </div>
    <div class="treasure-effects">
      <div class="treasure-effects-item" v-for="(item, index) in effects" :key="index">
        <div class="treasure-effects-item__desc">{{item.desc}}</div>
        <ul class="treasure-effects-item__data_ul">
          <template v-for="(_item, _index) in item.lvs">
            <li class="treasure-effects-item__data_li" :key="_index">
              <div>{{_item}}</div>
            </li>
          </template>
        </ul>
      </div>
      <div class="treasure-sub">
        <div v-if="treasure.treasureUpdate">
          {{treasure.treasureUpdate}}
        </div>
        <div class="attack-details">
          <div :class="'icon-'+item.card" :data-text="item.hit|hits" v-for="(item, index) in attackDetail" :key="index"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isNew: true
    };
  },
  computed: {
    treasure() {
      return this.isNew ? this.data[this.data.length - 1] : this.data[0];
    },
    effects() {
      let treasure = this.treasure;
      let _tDesc = treasure.tDesc.split('-');
      let _tLv = treasure.tLv.split('-').map(val => val.split('|'));
      let output = [];
      for (let i = 0; i < _tDesc.length; i++) {
        output.push({
          desc: _tDesc[i],
          lvs: _tLv[i]
        });
      }
      return output;
    },
    attackDetail() {
      let detail = JSON.parse(this.data[0].attackDetail);
      let output = [];
      let keys = {
        q: {
          card: 'Quick',
          hit: 'qHIt'
        },
        a: {
          card: 'Arts',
          hit: 'aHIt'
        },
        b: {
          card: 'Buster',
          hit: 'bHit'
        },
        exHit: {
          number: 1,
          card: 'Extra',
          hit: 'exHit'
        },
        npGet: {
          number: 1,
          card: 'NpGet',
          hit: 'npGet'
        }
      };
      for (let _key of Object.keys(keys)) {
        let _item = {
          card: keys[_key].card,
          hit: detail[_key]
        };
        let _number = keys[_key].number || detail[_key];
        output.push(
          ...new Array(_number).fill(JSON.parse(JSON.stringify(_item)))
        );
      }
      return output;
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  filters: {
    hits(val) {
      if (val * 1) return val > 1 ? `${val}Hits` : `${val}Hit`;
      else return val;
    }
  },
  methods: {
    changeNew() {
      this.isNew = !this.isNew;
    }
  }
};
</script>

<style scoped lang="scss">
/* %icon-card {
  width: 54px;
  height: 54px;
  background: center/100% no-repeat;
  position: relative;
  &::after {
    content: attr(data-text);
    font-size: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    line-height: 1;
    color: white;
    text-shadow: 1px 1px 1px black;
    font-weight: 600;
    -webkit-text-stroke: 0.2px #03a9f4;
  }
} */
.icon-Buster {
  @extend %icon-card;
  background-image: url('./../../../assets/Buster.png');
}
.icon-Arts {
  @extend %icon-card;

  background-image: url('./../../../assets/Arts.png');
}
.icon-Quick {
  @extend %icon-card;

  background-image: url('./../../../assets/Quick.png');
}
.icon-Extra {
  @extend %icon-card;

  background-image: url('./../../../assets/Extra.png');
}
.icon-NpGet {
  background: center/85% no-repeat;
  @extend %icon-card;

  background-image: url('./../../../assets/NP_Get.png');
}
.treasure-change-btn {
  background: url('./../../../assets/treasure_up.png') center/100% no-repeat;
  width: 2.5em;
  height: 2.5em;
  margin-left: 0.5em;
  &.un-checked {
    filter: grayscale(100%);
  }
}
.treasure-tab {
  margin-top: 10px;
}
.treasure-main {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
}
.treasure-name {
  flex-grow: 1;
  font-size: 1.2em;
  padding-left: 0.6em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &_en {
    font-size: 0.8em;
    color: var(--info-color);
  }
}

.treasure-effects-item {
  font-size: 12px;
  color: var(--info-color);
  &__desc {
    line-height: 2em;
    text-align: center;
  }
  &__data_ul {
    display: flex;
    justify-content: center;
    border: 1px solid var(--border-color);
  }
  &__data_li {
    flex-grow: 1;
    text-align: center;
    &:not(:last-of-type) {
      border-right: 1px solid var(--border-color);
    }
  }
}
.treasure-sub {
  font-size: 12px;
  color: var(--info-color);
  text-align: center;
  line-height: 2em;
}
.attack-details {
  display: flex;
  margin: 1em 0 4em;
}
</style>