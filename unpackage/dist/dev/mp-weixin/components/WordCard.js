"use strict";
const common_vendor = require("../common/vendor.js");
const store_word = require("../store/word.js");
const _sfc_main = {
  __name: "WordCard",
  setup(__props) {
    const store = store_word.useWordStore();
    const word = common_vendor.computed(() => store.currentWord);
    const wordLetters = common_vendor.computed(() => word.value ? word.value.word.split("") : []);
    const animationTypes = ["pop", "jump", "flip", "blink", "all"];
    const currentAnimation = common_vendor.ref("pop");
    const slideDirection = common_vendor.ref("none");
    const isSliding = common_vendor.ref(false);
    common_vendor.watch(() => store.currentIndex, (newIndex, oldIndex) => {
      if (newIndex > oldIndex) {
        slideDirection.value = "left";
      } else if (newIndex < oldIndex) {
        slideDirection.value = "right";
      }
      isSliding.value = true;
      setTimeout(() => {
        isSliding.value = false;
        slideDirection.value = "none";
      }, 300);
    });
    const changeAnimation = (type) => {
      currentAnimation.value = type;
    };
    const playAudio = () => {
      store.playCurrentWordAudio();
    };
    common_vendor.onUnmounted(() => {
      store.cleanupAudio();
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return {
        a: common_vendor.f(wordLetters.value, (letter, index, i0) => {
          return {
            a: common_vendor.t(letter),
            b: index,
            c: `${index * 0.1}s`
          };
        }),
        b: common_vendor.n(`animate-${currentAnimation.value}`),
        c: common_vendor.t((_a = word.value) == null ? void 0 : _a.phonetic_symbol),
        d: common_vendor.o(playAudio),
        e: common_vendor.t((_b = word.value) == null ? void 0 : _b.mean),
        f: common_vendor.n("slide-" + slideDirection.value),
        g: common_vendor.n({
          "sliding": isSliding.value
        }),
        h: common_vendor.f(animationTypes, (type, k0, i0) => {
          return {
            a: common_vendor.t(type),
            b: type,
            c: currentAnimation.value === type ? 1 : "",
            d: common_vendor.o(($event) => changeAnimation(type), type)
          };
        })
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/WordCard.js.map
