"use strict";
const common_vendor = require("../../common/vendor.js");
const store_word = require("../../store/word.js");
if (!Math) {
  WordCard();
}
const WordCard = () => "../../components/WordCard.js";
const minSwipeDistance = 50;
const _sfc_main = {
  __name: "word",
  setup(__props) {
    const store = store_word.useWordStore();
    const currentWord = common_vendor.computed(() => store.currentWord);
    const currentIndex = common_vendor.computed(() => store.currentIndex);
    const totalWords = common_vendor.computed(() => store.totalWords);
    const touchStartX = common_vendor.ref(0);
    const touchEndX = common_vendor.ref(0);
    const handleTouchStart = (event) => {
      touchStartX.value = event.touches[0].clientX;
    };
    const handleTouchEnd = (event) => {
      touchEndX.value = event.changedTouches[0].clientX;
      const swipeDistance = touchEndX.value - touchStartX.value;
      if (Math.abs(swipeDistance) >= minSwipeDistance) {
        if (swipeDistance > 0 && currentIndex.value > 0) {
          store.previousWord();
        } else if (swipeDistance < 0 && currentIndex.value < totalWords.value - 1) {
          store.nextWord();
        }
      }
    };
    common_vendor.onMounted(() => {
      store.loadWordsFromPublic();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentWord.value
      }, currentWord.value ? {} : {}, {
        b: common_vendor.o((...args) => common_vendor.unref(store).previousWord && common_vendor.unref(store).previousWord(...args)),
        c: currentIndex.value === 0,
        d: common_vendor.o((...args) => common_vendor.unref(store).nextWord && common_vendor.unref(store).nextWord(...args)),
        e: currentIndex.value === totalWords.value - 1,
        f: common_vendor.o(handleTouchStart),
        g: common_vendor.o(handleTouchEnd)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/word/word.js.map
