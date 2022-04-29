<script lang='ts'>
import { defineComponent, toRefs } from 'vue';
import { TransitionRoot } from '@headlessui/vue';
import { XIcon } from '@heroicons/vue/solid';

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
  components: { XIcon, TransitionRoot },
  setup(props, { emit }) {
    let { size } = props;
    let { visible } = toRefs(props);

    if (typeof size === 'number') {
      size = `${size}px`;
    }

    const close = () => {
      emit('close');
    };

    return {
      size,
      close,
      visible,
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
        v-show='visible'
        :style='[placement === "right" ? `width:${size}` : `height:${size}`]'
        :class='placement'
        class='absolute bg-white z-50 flex flex-col'
        style="top:48px;hieght:calc(100% - 48px)"
      >
        <div class='header h-12 border-b flex justify-between items-center p-6'>
          <h1 class='font-bold'>{{title}}</h1>
          <span class='close cursor-pointer' @click='close'>
            <XIcon class='w-4 h-4' aria-hidden='true' />
          </span>
        </div>
        <section class='flex-1'>
          <slot name='section'></slot>
        </section>
        <footer v-if='footer' class='h-12 border-t'>
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
  @apply h-full right-0 bottom-0 w-3/12 border-l-2 shadow-xl;
}
.down {
  @apply w-full left-0 bottom-0 h-3/6 border-t;
  box-shadow: 0px 3px 6px 0px #9ca3af;
}
</style>
