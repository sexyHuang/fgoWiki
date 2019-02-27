<template>
  <div>
    <van-tabs
      v-model="active"
      swipeable
      sticky
      :offset-top="offsetTop"
      :line-width="winWidth"
    >
      <van-tab title="英灵">
        <van-cell
          center
          title-class="subInfo-title"
          value-class="subInfo-value"
        >
          <span
            slot="title"
            class="servant-item__subInfo"
          >
            合计:{{totals.total}}/再临:{{totals.break}}/技能:{{totals.skill}}<template v-if="totals.cloth">/灵衣:{{totals.cloth}}</template>
          </span>
          <van-button
            tag="div"
            size="mini"
            type="primary"
            @click="activeShowIdx= (activeShowIdx+1)%3"
          >{{showType[activeShowIdx]}}</van-button>
        </van-cell>
        <div :class="showTypeClass[activeShowIdx]">
          <van-cell
            v-for="(_item,index) in servant_needs"
            :key="index"
            :to="`/servantInfo/${_item.servantId}`"
            class="servant-item"
            :class="{'is-get': servant_map[_item.servantId]}"
            is-link
          >
            <div
              slot="title"
              class="servant-item_title"
            >
              <img
                :src="base+_item.imgPath"
                alt=""
                class="servant-item__avatar"
              >
              <div class="servant-item_infos">
                <span class="servant-item__name">
                  {{_item.name}}
                </span>
                <span class="servant-item__subInfo">
                  合计:{{_item.total}}/再临:{{_item.break}}/技能:{{_item.skill}}
                  <template v-if="_item.cloth">/灵衣:{{_item.cloth}}</template>
                </span>
              </div>

            </div>
          </van-cell>
        </div>

      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import MaterialApi from '@/api/imp/MaterialApi';
import { BASE_URL } from '@/library/conf/image';
import { mapState } from 'vuex';
export default {
  name: 'materialDatail',
  beforeRouteEnter(to, from, next) {
    // ...
    next(async vm => {
      let needs = await MaterialApi.needs(to.params.ID);
      vm.servant_needs = needs.map(val => {
        return vm._needs_cal(val, vm.servant_map[val.servantId]);
      });
      vm.$setTitle(
        vm.$store.getters['material/getItemById'](to.params.ID).name
      );
    });
  },
  data() {
    return {
      servant_needs: [],
      active: 0,
      base: BASE_URL,
      showType: ['全部', '已关注', '未关注'],
      showTypeClass: ['show-all', 'show-get', 'show-not-get'],
      activeShowIdx: 1,
      winWidth: window.innerWidth
    };
  },
  computed: {
    ...mapState('userData', ['servant_map']),
    offsetTop() {
      return this.$store.state.system.isWeixin
        ? 0
        : 0 | (((window.innerWidth * 37.5) / 375) * 1.2267);
    },
    /*   servant_needs_caled() {
      return this.servant_needs.map(val =>
        this._needs_cal(val, this.servant_map[val.servantId])
      );
    }, */
    totals() {
      return this.servant_needs
        .filter(val => {
          if (this.activeShowIdx == 1) {
            return this.servant_map[val.servantId];
          } else if (this.activeShowIdx == 2)
            return !this.servant_map[val.servantId];
          return true;
        })
        .reduce((prev, curr) => {
          return {
            total: (prev.total || 0) + curr.total,
            break: (prev.break || 0) + curr.break,
            skill: (prev.skill || 0) + curr.skill,
            cloth: (prev.cloth || 0) + curr.cloth
          };
        }, {});
    }
  },
  methods: {
    _needs_cal(total_need, servant_set) {
      if (!servant_set) return total_need;
      let { lvs, state, getCloth } = servant_set;
      let types = total_need.types.split(',');
      let { skill, cloth } = total_need,
        _break = total_need.break;
      types.map(val => {
        let [typeNlv, needs] = val.split('_'),
          [type, lv] = typeNlv.split('');
        switch (type) {
          case '1':
            if (state >= lv) _break = 0;
            break;
          case '2':
            lvs.map(skill_lv => {
              if (skill_lv - lv > 0) skill -= needs;
            });
            break;
          case '3':
            if (getCloth) cloth = 0;
            break;
        }
      });
      let total = skill + cloth + _break;
      return Object.assign({}, total_need, {
        total,
        skill,
        cloth,
        break: _break
      });
    }
  }
};
</script>

<style scoped lang="scss">
.servant-item {
  align-items: center;
  &_title {
    display: flex;
  }
  &_infos {
    padding-left: 0.4em;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__avatar {
    width: 3.6em;
    height: 3.96em;
  }
  &__name {
    font-size: 1.2em;
  }
  &__subInfo {
    font-size: 0.9em;
    color: var(--muted-color);
  }
}
.is-get {
  .servant-item__name {
    color: var(--select-color);
  }
}
.subInfo-title {
  flex: 2;
}
.subInfo-value {
  display: flex;
  flex-direction: row-reverse;
}

.show-get {
  >:not(.is-get) {
    display: none;
  }
}
.show-not-get {
  .is-get {
    display: none;
  }
}
</style>