<script lang='ts'>
import { defineComponent, ref, watch } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid';
import Icon from '@components/Icon.vue';

export default defineComponent({
  name: 'Select',
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    SelectorIcon,
    TransitionRoot,
    Icon,
  },
  props: {
    options: Array, // 下拉框选项
    prefix: {
      // 下拉框选中项显示的前缀, icon为图标类型(必须是组件Icon支持的类型) text前缀文本
      type: Object,
      default: {},
    },
    type: {
      // 下拉框样式,目前仅支持primary
      type: String,
      default: 'primary',
    },
    modelValue: String,
  },
  setup(props, { emit }) {
    const { options, modelValue } = props;
    const selected = ref();

    if (options) {
      selected.value = options.find(o => (o as any).value === modelValue);
    }

    watch(selected, (newVal) => {
      emit('update:modelValue', (newVal as any)?.value);
      emit('change', (newVal as any)?.value);
    });

    return {
      options,
      selected,
    };
  },
});
</script>

<template>
  <Listbox v-model='selected'>
    <div class='relative mt-1 pr-5' v-bind='$attrs'>
      <ListboxButton
        class='flex flex-row border-gray-300 border cursor-pointer w-full py-2 px-3 text-left bg-white rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'
      >
        <span class='block truncate flex-1'>
          <Icon v-if='prefix?.icon' :type='prefix?.icon' class='w-5 h-5 mr-1 inline text-gray-400' />
          {{prefix.text}}{{selected?.label}}
        </span>
        <span ass='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
          <SelectorIcon class='w-5 h-5 text-gray-400' aria-hidden='true' />
        </span>
      </ListboxButton>

      <TransitionRoot leave='transition duration-200 ease-in' leave-from='opacity-100' leave-to='opacity-0'>
        <ListboxOptions
          class='options absolute w-full min-w-max py-1 mt-1 overflow-auto text-base bg-white rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
        >
          <ListboxOption
            v-slot='{ selected }'
            v-for='option in options'
            :key='option.value'
            :value='option'
            as='template'
          >
            <li :class='`option-text-${type}`' class='cursor-pointer select-none relative py-2 px-10'>
              <span
                :class='[
                  selected ? "font-medium" : "font-normal",
                  "block truncate",
                ]'
              >{{ option.label }}</span>
              <span
                v-if='selected'
                :class='`option-icon-${type}`'
                class='absolute inset-y-0 left-0 flex items-center pl-3'
              >
                <CheckIcon class='w-5 h-5' aria-hidden='true' />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </TransitionRoot>
    </div>
  </Listbox>
</template>

<style scoped>
.option-text-primary {
  @apply text-gray-900;
}

.option-text-primary:hover {
  @apply text-white bg-indigo-600;
}

.option-icon-primary {
  @apply text-indigo-600;
}

.option-text-primary:hover .option-icon-primary {
  @apply text-white;
}

.option-icon__active-primary {
  @apply text-white;
}

.options {
  box-shadow: 0px 2px 10px -2px #6b7280;
}
</style>
