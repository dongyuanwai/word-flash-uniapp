<template>
  <view class="container">
    <view class="button-container">
      <button class="start-button" @click="goToWordPage">去背单词</button>
    </view>
  </view>
</template>

<script setup>
// 不需要引入 ref，因为这里没有用到响应式数据
const goToWordPage = () => {
  uni.navigateTo({
    url: '/pages/word/word'
  })
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.button-container {
  text-align: center;
}

.start-button {
  background-color: #007aff;
  color: #ffffff;
  padding: 30rpx 60rpx;
  border-radius: 50rpx;
  font-size: 36rpx;
  border: none;
}

/* 小程序中不支持 :hover，可以使用 :active 代替 */
.start-button:active {
  opacity: 0.8;
}
</style>