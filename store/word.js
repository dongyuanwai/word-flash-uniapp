/*
 * @Author: dongyuanwai yuanwaidong@gmail.com
 * @Date: 2025-02-16 22:12:38
 * @LastEditors: dongyuanwai yuanwaidong@gmail.com
 * @LastEditTime: 2025-02-18 22:08:08
 * @FilePath: \words-flash-uniapp\store\word.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'

/**
 * @typedef {Object} Word
 * @property {string} initial
 * @property {string} mean
 * @property {string} phonetic_symbol
 * @property {string} word
 * @property {string[]} word_syllable_list
 */

export const useWordStore = defineStore('word', {
  state: () => ({
    /** @type {Word[]} */
    words: [],
    currentIndex: 0,
    isShowingChinese: false,
    audioContext: null // 添加音频上下文实例
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
      this.words = words
      // 从本地存储获取上次的进度
      const savedIndex = uni.getStorageSync('currentWordIndex')
      this.currentIndex = savedIndex ? parseInt(savedIndex) : 0
    },

    /**
     * 保存当前进度到本地存储
     */
    saveProgress() {
      uni.setStorageSync('currentWordIndex', this.currentIndex.toString())
    },

    toggleChinese() {
      this.isShowingChinese = !this.isShowingChinese
    },

    nextWord() {
      if (this.currentIndex < this.words.length - 1) {
        this.currentIndex++
        this.isShowingChinese = false
        this.saveProgress() // 保存进度
      }
    },

    previousWord() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.isShowingChinese = false
        this.saveProgress() // 保存进度
      }
    },

    markCurrentWordAsLearned() {
      if (this.currentWord) {
        this.currentWord.learned = true
      }
    },

    resetProgress() {
      this.words.forEach(word => word.learned = false)
      this.currentIndex = 0
      this.isShowingChinese = false
      this.saveProgress() // 保存进度
    },

    /**
     * 播放当前单词的音频
     */
    playCurrentWordAudio() {
      if (this.currentWord) {
        // 如果已经存在音频实例且正在播放，先停止
        if (this.audioContext) {
          this.audioContext.stop()
          this.audioContext.destroy()
          this.audioContext = null
        }

        // 创建新的音频实例
        this.audioContext = uni.createInnerAudioContext()
        this.audioContext.src = `https://dict.youdao.com/dictvoice?audio=${this.currentWord.word}&type=2`
        
        // 监听播放错误
        this.audioContext.onError((res) => {
          console.error('音频播放失败：', res.errMsg)
          uni.showToast({
            title: '音频播放失败',
            icon: 'none'
          })
          // 清理错误的音频实例
          if (this.audioContext) {
            this.audioContext.destroy()
            this.audioContext = null
          }
        })

        // 开始播放
        this.audioContext.play()
      }
    },

    // 组件卸载时清理音频实例
    cleanupAudio() {
      if (this.audioContext) {
        this.audioContext.stop()
        this.audioContext.destroy()
        this.audioContext = null
      }
    },

    /**
     * 从本地加载单词列表
     */
    async loadWordsFromPublic() {
      try {
        const data = await import('@/static/A.json')
        this.initializeWords(data.default)
      } catch (error) {
        console.error('加载单词列表失败：', error)
        uni.showToast({
          title: '加载单词列表失败',
          icon: 'none'
        })
        
        // 出错时使用默认数据
        const defaultWords = [{
          initial: "A",
          mean: "vt.丢弃;放弃，抛弃",
          phonetic_symbol: "/ə'bændən/",
          word: "abandon",
          word_syllable_list: ["a", "ban", "don"]
        }]
        this.initializeWords(defaultWords)
      }
    }
  }
}) 