<script lang='ts'>
import { defineComponent, toRefs } from 'vue';
import { TransitionRoot } from '@headlessui/vue';
import Icon from '@components/Icon.vue';

export default defineComponent({
  name: 'Drawer',
  props: {
    size: [String, Number],
    footer: Boolean,
    title: {
      type: String,
      required: true,
    },
    placement: {
      type: String,
      default: 'right',
    },
    visible: Boolean,
  },
  emits: ['close'],
  components: { Icon, TransitionRoot },
  setup(props) {
    let { size } = props;

    if (typeof size === 'number') {
      size = `${size}px`;
    }

    return {
      size,
    };
  },
});
</script>

<template>
  <teleport to='#showmd-drawers'>
    <transition
      :enter-active-class='`animate__animated ${placement === "right" ? "animate__fadeInRight" : ""} ${placement === "down" ? "animate__fadeInUp" : ""}`'
      :leave-active-class='`animate__animated ${placement === "right" ? "animate__fadeOutRight" : ""} ${placement === "down" ? "animate__fadeOutDown" : ""}`'
    >
      <div
        id='drawer'
        v-if='visible'
        :style='[placement === "right" ? `width:${size}` : `height:${size}`]'
        :class='placement'
        class='absolute bg-white z-10 flex flex-col'
        style='top:48px;height:calc(100% - 48px)'
      >
        <div class='header border-b flex justify-between items-center p-6' style='height: 50px'>
          <h1 class='font-bold'>{{title}}</h1>
          <span class='close cursor-pointer' @click='$emit("close")'>
            <Icon class='w-4 h-4' type='close' />
          </span>
        </div>
        <section class='flex-1'>
          <slot name='section'></slot>
        </section>
        <footer v-if='footer' class='border-t flex items-center h-20 p-10'>
          <slot name='footer'></slot>
        </footer>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.animate__animated.animate__fadeInRight,
.animate__animated.animate__fadeOutRight,
.animate__animated.animate__fadeInUp,
.animate__animated.animate__fadeOutDown {
  --animate-duration: 400ms;
}
.right {
  @apply h-full right-0 bottom-0 w-2/5 border-l-2 shadow-xl;
}
.down {
  @apply w-full left-0 bottom-0 h-3/6 border-t;
  box-shadow: 0px 3px 6px 0px #9ca3af;
}
</style>
