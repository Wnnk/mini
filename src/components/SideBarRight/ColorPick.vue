<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import InputGroup from "./InputGroup.vue";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
const toggle = computed(() => appStore.rightSideToggle[1]);
import { hsvToRgb, hsvToHex } from "../../utils/color";
import { t } from "../../language/index"

onMounted(() => {
  /* 
  hexToRgb   √ rgbToHex    √
  hsvToRgb √ rgbToHsv √
  hexToRgb   √ 
  hslToRgb   × rgbToHsl    ×
  hsvToHsl 
  */
});

const buttonGroup = ref([true, false, true]);
/**
 * @description： 显示/隐藏功能板
 * @param index: number 功能板索引
 **/
const toggleColorPicker = (index: number) => {
  buttonGroup.value[index] = !buttonGroup.value[index];
};

/**
 * @description: 初始化记色板
 */
const initSwatches = () => {
  const swatches = [];
  for (let i = 0; i < 21; i++) {
    swatches.push({
      color: "grb(255, 255, 255)",
    });
  }
  swatches[0].color = "rgb(0, 0, 0)";
  return swatches;
};
const swatches = ref(initSwatches());
const swatchActive = ref(0);

watch(
  () => appStore.hsv,
  (newVal) => {
    swatches.value[swatchActive.value].color = `${hsvToHex(
      newVal.h,
      newVal.s,
      newVal.v
    )}`;
    console.log("swatches");
  },
  { deep: true }
);

const secondaryPickHandle = ref({
  left: "0%",
  top: "100%",
});

const barStyle = ref({
  height: "100%",
});

const secondaryPickStyle = ref({
  background: "rgb(255, 0, 0)",
});
const primaryRange = ref(0);
const setHsv = ({ h, s, v }: { h: number; s: number; v: number }) => {
  appStore.hsv.h = Math.max(0, Math.min(1, h));
  appStore.hsv.s = Math.max(0, Math.min(1, s));
  appStore.hsv.v = Math.max(0, Math.min(1, v));
  /* 色相条数值 */
  primaryRange.value = (1 - appStore.hsv.h) * 360;
  /* 改变主色条 */
  secondaryPickStyle.value.background = `${hsvToHex(h, 1, 1)}`;
  /* 次色块选中位置改变 */
  secondaryPickHandle.value.left = `${appStore.hsv.s * 100}%`;
  secondaryPickHandle.value.top = `${(1 - appStore.hsv.v) * 100}%`;
};

const colorPick = (event: MouseEvent) => {
  const picker = document.getElementsByClassName("secondary_pick");
  const rect = picker[0]!.getBoundingClientRect();
  const offsetX = (event.clientX - rect.left) / (rect.right - rect.left);
  const offsetY = (event.clientY - rect.top) / (rect.bottom - rect.top);
  setHsv({
    h: appStore.hsv.h,
    s: offsetX,
    v: 1 - offsetY,
  });
};

/**
 * @description: 调整色相柱
 */
const adjustHue = (event: MouseEvent) => {
  const picker = document.getElementsByClassName("primary_pick");
  const rect = picker[0]!.getBoundingClientRect();
  const range = rect.top - rect.bottom;
  const inRange = event.clientY - rect.bottom;
  const ratio = Math.max(0, Math.min(1, inRange / range));
  primaryRange.value = ratio * 360;
  barStyle.value.height = `${ratio * 100}%`;
  setHsv({
    h: 1 - primaryRange.value / 360,
    s: appStore.hsv.s,
    v: appStore.hsv.v,
  });
};
</script>

<template>
  <div class="colors block">
    <h2
      :class="['trn', 'toggle', { toggled: !toggle }]"
      @click="appStore.rightSideToggle[1] = !toggle"
    >
      {{$t("colorPick")}}
    </h2>
    <div class="content" id="toggle_colors" v-show="toggle">
      <div class="ui_flex_group justify_content_space_between stacked">
        <div
          id="selected_color_sample"
          class="ui_color_sample"
          title="Current Color Preview"
          :style="`background-color: ${hsvToHex(
            appStore.hsv.h,
            appStore.hsv.s,
            appStore.hsv.v
          )};`"
        ></div>
        <div class="ui_button_group">
          <!-- Color Picker -->
          <button
            id="toggle_color_picker_section_button"
            :title="t('toggle_color_picker')"
            :aria-pressed="buttonGroup[0]"
            @click="toggleColorPicker(0)"
          >
            <span class="sr_only">{{ $t('toggle_color_picker') }}</span>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" opacity="0"></rect>
              <path
                d="M19.54 5.08A10.61 10.61 0 0 0 11.91 2a10 10 0 0 0-.05 20 2.58 2.58 0 0 0 2.53-1.89 2.52 2.52 0 0 0-.57-2.28.5.5 0 0 1 .37-.83h1.65A6.15 6.15 0 0 0 22 11.33a8.48 8.48 0 0 0-2.46-6.25zM15.88 15h-1.65a2.49 2.49 0 0 0-1.87 4.15.49.49 0 0 1 .12.49c-.05.21-.28.34-.59.36a8 8 0 0 1-7.82-9.11A8.1 8.1 0 0 1 11.92 4H12a8.47 8.47 0 0 1 6.1 2.48 6.5 6.5 0 0 1 1.9 4.77A4.17 4.17 0 0 1 15.88 15z"
              ></path>
              <circle cx="12" cy="6.5" r="1.5"></circle>
              <path
                d="M15.25 7.2a1.5 1.5 0 1 0 2.05.55 1.5 1.5 0 0 0-2.05-.55z"
              ></path>
              <path
                d="M8.75 7.2a1.5 1.5 0 1 0 .55 2.05 1.5 1.5 0 0 0-.55-2.05z"
              ></path>
              <path
                d="M6.16 11.26a1.5 1.5 0 1 0 2.08.4 1.49 1.49 0 0 0-2.08-.4z"
              ></path>
            </svg>
          </button>
          <!-- Color Channels -->
          <button
            id="toggle_color_channels_section_button"
            :aria-pressed="buttonGroup[1]"
            class="ui_icon_button"
            :title="t('toggle_color_channels')"
            @click="toggleColorPicker(1)"
          >
            <span class="sr_only">{{ $t('toggle_color_channels') }}</span>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-card-list"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M14.5 3h-13a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"
              ></path>
              <path
                fill-rule="evenodd"
                d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"
              ></path>
              <circle cx="3.5" cy="5.5" r=".5"></circle>
              <circle cx="3.5" cy="8" r=".5"></circle>
              <circle cx="3.5" cy="10.5" r=".5"></circle>
            </svg>
          </button>

          <!-- Swatches -->
          <button
            id="toggle_color_swatches_section_button"
            :aria-pressed="buttonGroup[2]"
            class="ui_icon_button"
            :title="t('toggle_swatches')"
            @click="toggleColorPicker(2)"
          >
            <span class="sr_only">{{ $t('toggle_swatches') }}</span>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-grid-3x2"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5v-8zM1.5 3a.5.5 0 0 0-.5.5V7h4V3H1.5zM5 8H1v3.5a.5.5 0 0 0 .5.5H5V8zm1 0h4v4H6V8zm4-1H6V3h4v4zm1 1v4h3.5a.5.5 0 0 0 .5-.5V8h-4zm0-1V3h3.5a.5.5 0 0 1 .5.5V7h-4z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        id="color_section_swatches"
        class="block_section"
        v-show="buttonGroup[2]"
      >
        <div class="ui_swatches" id="color_swatches">
          <div class="swatch_group cols_7 rows_3" tabindex="0">
            <div
              :class="['swatch', { active: swatchActive === index }]"
              v-for="(swatch, index) in swatches"
              :key="index"
              :style="`background-color: ${swatch.color};`"
              @click="swatchActive = index"
            ></div>
          </div>
        </div>
      </div>

      <div
        id="color_section_picker"
        class="block_section"
        v-show="buttonGroup[0]"
      >
        <div class="ui_color_picker_gradient" id="color_picker_gradient">
          <div
            class="secondary_pick"
            @click="colorPick"
            :style="secondaryPickStyle"
          >
            <div class="saturation_gradient"></div>
            <div class="value_gradient"></div>
            <div class="handle" :style="secondaryPickHandle"></div>
          </div>
          <div class="primary_pick" @click="adjustHue">
            <div
              class="ui_range color_picker_thin vertical"
              tabindex="0"
              role="slider"
              aria-valuemin="0"
              aria-valuemax="360"
              :aria-valuenow="appStore.hsv.h * 360"
            >
              <div
                class="padded_track"
                style="
                  background: linear-gradient(
                    rgb(255, 0, 0) 0%,
                    rgb(255, 255, 0) 17%,
                    rgb(0, 255, 0) 33%,
                    rgb(0, 255, 255) 50%,
                    rgb(0, 0, 255) 67%,
                    rgb(255, 0, 255) 83%,
                    rgb(255, 0, 0) 100%
                  );
                "
              ></div>
              <div class="bar" :style="barStyle">
                <div class="handle"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="ui_input_group stacked">
          <label id="color_hex_label" title="Hex" class="label_width_small trn"
            >Hex</label
          >
          <input
            id="color_hex"
            :value="hsvToHex(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v)"
            maxlength="7"
            type="text"
          />
        </div>
      </div>

      <div
        id="color_section_channels"
        class="block_section color_section_channels"
        v-show="buttonGroup[1]"
      >
        <div class="ui_input_grid stacked">
          <InputGroup label="rgb_r_label" title="Red"
          className="label_width_character text_red"
          :value="hsvToRgb(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v).r"
          id:="rgb_r" /> <InputGroup label="rgb_g_label" title="Green"
          className="label_width_character text_green"
          :value="hsvToRgb(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v).g"
          id:="rgb_g" /> <InputGroup label="rgb_b_label" title="Blue"
          className="label_width_character text_blue"
          :value="hsvToRgb(appStore.hsv.h, appStore.hsv.s, appStore.hsv.v).b"
          id:="rgb_b" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
