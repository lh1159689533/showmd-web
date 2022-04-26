<script>
import { defineComponent, ref, watch } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid';

export default defineComponent({
  name: "Select",
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    SelectorIcon
  },
  props: {
    options: Array, // 下拉框选项
    type: { // 下拉框样式,目前仅支持primary
      type: String,
      default: 'primary'
    }
  },
  setup(props, { emit }) {
    const { options, type } = props;
    const selected = ref(options[0]);

    watch(selected, (newVal) => {
      emit('change', newVal?.value);
    });

    return {
      options,
      selected,
      type,
    };
  },
})
</script>

<template>
  <Listbox v-model="selected">
    <div class="relative mt-1 pr-5">
      <ListboxButton
        class="flex flex-row cursor-pointer w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
      >
        <span class="block truncate">Sort: {{selected.label}}</span>
        <span ass="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute w-full min-w-max py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="option in options"
            :key="option.value"
            :value="option"
            as="template"
          >
            <li
              :class="`option-text${active ? '__active' : ''}-${type}`"
              class="cursor-pointer select-none relative py-2 px-10"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
                >{{ option.label }}</span
              >
              <span
                v-if="selected"
                :class="`option-icon${active ? '__active' : ''}-${type}`"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <CheckIcon class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<style scoped>
.option-text-primary {
  @apply text-gray-900;
}

.option-text__active-primary {
  @apply text-white bg-indigo-600;
}

.option-icon-primary {
  @apply text-indigo-600;
}

.option-icon__active-primary {
  @apply text-white;
}
</style>
