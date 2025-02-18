<!--
 * @Author: dongyuanwai yuanwaidong@gmail.com
 * @Date: 2025-02-16 22:28:58
 * @LastEditors: dongyuanwai yuanwaidong@gmail.com
 * @LastEditTime: 2025-02-18 22:32:11
 * @FilePath: \words-flash-uniapp\pages\word\word.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <view 
    class="word-learning"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <word-card v-if="currentWord" />
    
    <!-- 添加导航按钮 -->
    <view class="navigation-buttons">
      <button 
        class="nav-btn"
        @tap="store.previousWord"
        :disabled="currentIndex === 0"
      >上一个</button>
      
      <button 
        class="nav-btn"
        @tap="store.nextWord"
        :disabled="currentIndex === totalWords - 1"
      >下一个</button>
    </view>
  </view>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import WordCard from '@/components/WordCard.vue'
import { useWordStore } from '@/store/word'

const store = useWordStore()
const currentWord = computed(() => store.currentWord)
const currentIndex = computed(() => store.currentIndex)
const totalWords = computed(() => store.totalWords)

// 触摸相关状态
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50 // 最小滑动距离

// 处理触摸开始
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX
}

// 处理触摸结束
const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].clientX
  const swipeDistance = touchEndX.value - touchStartX.value

  // 判断滑动方向和距离
  if (Math.abs(swipeDistance) >= minSwipeDistance) {
    if (swipeDistance > 0 && currentIndex.value > 0) {
      // 向右滑动，显示上一个
      store.previousWord()
    } else if (swipeDistance < 0 && currentIndex.value < totalWords.value - 1) {
      // 向左滑动，显示下一个
      store.nextWord()
    }
  }
}

// 加载单词列表
onMounted(() => {
  store.loadWordsFromPublic()
})
</script>

<style>
.word-learning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  touch-action: pan-x; /* 优化触摸体验 */
}

.navigation-buttons {
  margin-top: 40rpx;
  display: flex;
  gap: 20rpx;
}

.nav-btn {
  font-size: 28rpx;
  padding: 16rpx 32rpx;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8rpx;
  color: #333;
}

.nav-btn:disabled {
  opacity: 0.5;
  background-color: #ccc;
}

.nav-btn:active:not(:disabled) {
  background-color: #e0e0e0;
}
</style>