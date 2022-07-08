<script lang='ts'>
import { defineComponent } from 'vue';
import Icon from '@components/Icon.vue';

export default defineComponent({
  name: 'Message',
  components: { Icon },
  props: {
    content: String,
    type: {
      // info success error warn
      type: String,
      default: 'info',
    },
    isShow: Boolean,
    close: Function,
  },
  setup() {
    const iconType = {
      warn: 'text-yellow-500',
      success: 'text-green-500',
      error: 'text-red-500',
      info: 'text-gray-500',
    };

    return {
      iconType,
    };
  },
});
</script>

<template>
  <div
    v-bind='$attrs'
    style='transition: all 300ms'
    class='message bounceInRight border-gray-300 bg-white min-w-min text-sm px-3 py-2 rounded-sm mt-4 mr-2 inline-block relative'
  >
    <Icon :type='type' circle :class='iconType[type]' class='mr-2 -mt-1 inline-block' />
    <span>{{content}}</span>
    <Icon
      v-if='typeof close === "function"'
      @click='close'
      type='close'
      class='inline-block text-gray-400 ml-3.5 w-3.5 h-4 -mt-1 cursor-pointer'
    />
  </div>
</template>

<style scoped>
.message {
  box-shadow: 0 0 20px -5px #9ca3af;
}

.bounceInRight {
  animation-name: bounce-in-right;
  animation-duration: 300ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
}

.bounceOutRight {
  animation-name: bounce-out-right;
  animation-duration: 300ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
}

@keyframes bounce-in-right {
  from {
    right: -300px;
    opacity: 0;
  }
  to {
    right: 0;
    opacity: 1;
  }
}

@keyframes bounce-out-right {
  from {
    right: 0;
    opacity: 1;
  }
  to {
    right: -160px;
    opacity: 0;
  }
}
</style>
