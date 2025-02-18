<template>
  <!-- 整体容器 -->
  <view class="container">
    <!-- 单词卡片主体 -->
    <view 
      class="word-card"
      :class="[
        'slide-' + slideDirection,
        { 'sliding': isSliding }
      ]"
    >
      <view class="word-content">
        <!-- 英文单词展示区域，带动画效果 -->
        <view class="word">
          <text
            v-for="(letter, index) in wordLetters"
            :key="index"
            :class="['letter', `animate-${currentAnimation}`]"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >{{ letter }}</text>
        </view>
        
        <!-- 音标和喇叭图标 -->
        <view class="phonetic-container">
          <text class="phonetic">{{ word?.phonetic_symbol }}</text>
          <text class="speaker-icon" @tap="playAudio">🔊</text>
        </view>
        
        <!-- 中文释义 -->
        <view class="mean">{{ word?.mean }}</view>
      </view>
    </view>
    
    <!-- 动画控制按钮组 -->
    <view class="animation-controls">
      <button 
        v-for="type in animationTypes" 
        :key="type"
        class="animation-btn"
        :class="{ active: currentAnimation === type }"
        @tap="changeAnimation(type)"
      >
        {{ type }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
import { useWordStore } from '@/store/word'

// 获取状态管理实例
const store = useWordStore()

// 获取当前单词数据
const word = computed(() => store.currentWord)
// 将单词拆分为字母数组，用于动画显示
const wordLetters = computed(() => word.value ? word.value.word.split('') : [])

// 定义可用的动画类型
const animationTypes = ['pop', 'jump', 'flip', 'blink', 'all']
// 当前选中的动画类型
const currentAnimation = ref('pop')

// 动画相关状态
const slideDirection = ref('none')
const isSliding = ref(false)

// 监听单词索引变化
watch(() => store.currentIndex, (newIndex, oldIndex) => {
  if (newIndex > oldIndex) {
    // 向左滑动
    slideDirection.value = 'left'
  } else if (newIndex < oldIndex) {
    // 向右滑动
    slideDirection.value = 'right'
  }
  
  // 触发滑动动画
  isSliding.value = true
  setTimeout(() => {
    isSliding.value = false
    slideDirection.value = 'none'
  }, 300) // 动画持续时间
})

// 切换动画效果
const changeAnimation = (type) => {
  currentAnimation.value = type
}

// 播放音频
const playAudio = () => {
  store.playCurrentWordAudio()
}

// 组件卸载时清理音频
onUnmounted(() => {
  store.cleanupAudio()
})
</script>

<style>
/* 整体容器样式 */
.container {
  width: 90%;
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 实现绝对居中 */
}

/* 单词卡片样式 */
.word-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  padding: 60rpx 40rpx;
  width: 100%;
  position: relative;
  transition: all 0.3s ease-out;
  transform: translateX(0);
  opacity: 1;
}

/* 卡片内容布局 */
.word-content {
  min-height: 500rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 50rpx;
}

/* 单词区域样式 */
.word {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4rpx;
  width: 100%;
  text-align: center;
  margin: 40rpx 0;
}

/* 字母样式 */
.letter {
  font-size: 96rpx;
  font-weight: bold;
  color: #333;
  display: inline-block;
}

/* 动画控制按钮组样式 */
.animation-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  justify-content: center;
  width: 100%;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 动画按钮样式 */
.animation-btn {
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8rpx;
  min-width: 120rpx;
}

/* 激活状态的按钮样式 */
.animation-btn.active {
  background-color: #4CAF50;
  color: white;
}

/* 动画关键帧定义 */
/* 弹出动画 */
@keyframes pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.4); }
}

/* 跳跃动画 */
@keyframes jump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

/* 翻转动画 */
@keyframes flip {
  0%, 100% { transform: rotateY(0); }
  50% { transform: rotateY(90deg); }
}

/* 闪烁动画 */
@keyframes blink {
  0%, 100% { opacity: 1; color: #333; }
  50% { opacity: 0.5; color: #FFD700; }
}

/* 组合动画 */
@keyframes all {
  0%, 100% {
    transform: scale(1) translateY(0) rotateY(0);
    color: #333;
  }
  50% {
    transform: scale(1.2) translateY(-10rpx) rotateY(180deg);
    color: #FFD700;
  }
}

/* 为每个动画类型添加动画属性 */
.letter.animate-pop { animation: pop 0.5s ease-in-out infinite; }
.letter.animate-jump { animation: jump 0.5s ease-in-out infinite; }
.letter.animate-flip { animation: flip 0.5s ease-in-out infinite; }
.letter.animate-blink { animation: blink 0.5s ease-in-out infinite; }
.letter.animate-all { animation: all 0.5s ease-in-out infinite; }

/* 音标和喇叭容器 */
.phonetic-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

/* 音标样式 */
.phonetic {
  font-size: 36rpx;
  color: #666;
  text-align: center;
}

/* 喇叭图标样式 */
.speaker-icon {
  font-size: 36rpx;
  padding: 10rpx;
  cursor: pointer;
  opacity: 0.7;
}

.speaker-icon:active {
  opacity: 1;
  transform: scale(1.1);
}

/* 释义样式 */
.mean {
  font-size: 32rpx;
  color: #666;
  text-align: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee; /* 添加顶部分隔线 */
}

/* 滑动动画相关样式 */
.word-card {
  position: relative;
  transition: all 0.3s ease-out;
  transform: translateX(0);
  opacity: 1;
}

/* 向左滑动 */
.word-card.slide-left.sliding {
  animation: slideLeft 0.3s ease-out;
}

/* 向右滑动 */
.word-card.slide-right.sliding {
  animation: slideRight 0.3s ease-out;
}

@keyframes slideLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%);
    opacity: 0;
  }
  51% {
    transform: translateX(50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(50%);
    opacity: 0;
  }
  51% {
    transform: translateX(-50%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 优化卡片样式 */
.word-card {
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
  margin: 0 auto;
  transform-origin: center center;
  will-change: transform, opacity;
}
</style>