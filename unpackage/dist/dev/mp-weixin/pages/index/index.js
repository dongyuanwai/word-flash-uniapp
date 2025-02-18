"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const goToWordPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/word/word"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goToWordPage)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
