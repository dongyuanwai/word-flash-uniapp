"use strict";
const common_vendor = require("../common/vendor.js");
const useWordStore = common_vendor.defineStore("word", {
  state: () => ({
    /** @type {Word[]} */
    words: [],
    currentIndex: 0,
    isShowingChinese: false,
    audioContext: null
    // 添加音频上下文实例
  }),
  getters: {
    currentWord: (state) => state.words[state.currentIndex] || null,
    totalWords: (state) => state.words.length
  },
  actions: {
    /**
     * @param {Word[]} words
     */
    initializeWords(words) {
      this.words = words;
      const savedIndex = common_vendor.index.getStorageSync("currentWordIndex");
      this.currentIndex = savedIndex ? parseInt(savedIndex) : 0;
    },
    /**
     * 保存当前进度到本地存储
     */
    saveProgress() {
      common_vendor.index.setStorageSync("currentWordIndex", this.currentIndex.toString());
    },
    toggleChinese() {
      this.isShowingChinese = !this.isShowingChinese;
    },
    nextWord() {
      if (this.currentIndex < this.words.length - 1) {
        this.currentIndex++;
        this.isShowingChinese = false;
        this.saveProgress();
      }
    },
    previousWord() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.isShowingChinese = false;
        this.saveProgress();
      }
    },
    markCurrentWordAsLearned() {
      if (this.currentWord) {
        this.currentWord.learned = true;
      }
    },
    resetProgress() {
      this.words.forEach((word) => word.learned = false);
      this.currentIndex = 0;
      this.isShowingChinese = false;
      this.saveProgress();
    },
    /**
     * 播放当前单词的音频
     */
    playCurrentWordAudio() {
      if (this.currentWord) {
        if (this.audioContext) {
          this.audioContext.stop();
          this.audioContext.destroy();
          this.audioContext = null;
        }
        this.audioContext = common_vendor.index.createInnerAudioContext();
        this.audioContext.src = `https://dict.youdao.com/dictvoice?audio=${this.currentWord.word}&type=2`;
        this.audioContext.onError((res) => {
          common_vendor.index.__f__("error", "at store/word.js:103", "音频播放失败：", res.errMsg);
          common_vendor.index.showToast({
            title: "音频播放失败",
            icon: "none"
          });
          if (this.audioContext) {
            this.audioContext.destroy();
            this.audioContext = null;
          }
        });
        this.audioContext.play();
      }
    },
    // 组件卸载时清理音频实例
    cleanupAudio() {
      if (this.audioContext) {
        this.audioContext.stop();
        this.audioContext.destroy();
        this.audioContext = null;
      }
    },
    /**
     * 从本地加载单词列表
     */
    async loadWordsFromPublic() {
      try {
        const data = await Promise.resolve(require("../static/A.js"));
        this.initializeWords(data.default);
      } catch (error) {
        common_vendor.index.__f__("error", "at store/word.js:137", "加载单词列表失败：", error);
        common_vendor.index.showToast({
          title: "加载单词列表失败",
          icon: "none"
        });
        const defaultWords = [{
          initial: "A",
          mean: "vt.丢弃;放弃，抛弃",
          phonetic_symbol: "/ə'bændən/",
          word: "abandon",
          word_syllable_list: ["a", "ban", "don"]
        }];
        this.initializeWords(defaultWords);
      }
    }
  }
});
exports.useWordStore = useWordStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/word.js.map
