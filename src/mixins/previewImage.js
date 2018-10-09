import { ImagePreview } from 'vant';
let _not_goBack = false,
  instance = null;

const mixin = {
  methods: {
    showPreview(picList) {
      this.$router.push({
        query: {
          open: 1
        }
      });
      instance = ImagePreview({
        images: picList,
        startPosition: 0,
        onClose: () => {
          if (!_not_goBack) this.$router.go(-1);
          else _not_goBack = false;
        }
      });
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        _not_goBack = false;
        if (!val.query.open) {
          _not_goBack = true;
          try {
            instance.close();
          } catch (e) {}
        }
      }
    }
  }
};
export default mixin;
