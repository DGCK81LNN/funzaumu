<script setup lang="ts">
useHead({
  titleTemplate: (s) => (s ? `${s} - ` : "") + t("shidinn-letter-database"),
})
const { t, locales, locale, localeProperties, setLocale } = useI18n({
  useScope: "local",
})
const localePath = useLocalePath()
const colorMode = useColorMode()
const colorModes = [
  { value: "light", label: "light", icon: "sun-fill" },
  { value: "dark", label: "dark", icon: "moon-stars-fill" },
  { value: "system", label: "auto", icon: "circle-half" },
]
</script>

<template>
  <BNavbar toggleable="lg" class="border-bottom">
    <BNavbarBrand :to="localePath('/')">
      {{ t("shidinn-letter-database") }}
    </BNavbarBrand>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
        <BNavItemDropdown>
          <template #button-content>
            <i
              :class="
                colorMode.value === 'light'
                  ? 'bi-sun-fill'
                  : colorMode.value === 'dark'
                    ? 'bi-moon-stars-fill'
                    : 'bi-circle-half'
              "
              aria-hidden="true"
            ></i>
            <span class="visually-hidden">{{ t("dark-mode") }}</span>
          </template>
          <BDropdownItem
            v-for="{ value, label, icon } in colorModes"
            href="#"
            @click.prevent.stop="colorMode.preference = value"
            :active="colorMode.preference === value"
          >
            <i :class="[`bi-${icon}`, 'me-2']" aria-hidden="true"></i>{{ t(label) }}
          </BDropdownItem>
        </BNavItemDropdown>
        <BNavItemDropdown>
          <template #button-content>
            <i class="bi-globe me-1"></i>{{ localeProperties.name }}
          </template>
          <BDropdownItem
            v-for="loc in locales"
            link="#"
            @click.prevent.stop="setLocale(loc.code)"
            :lang="loc.iso"
            :active="loc.code === locale"
          >
            {{ loc.name }}
          </BDropdownItem>
        </BNavItemDropdown>
        <BNavItem disabled>
          <s>{{ t("login") }}</s>
        </BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
  <div class="m-2">
    <slot />
  </div>
</template>

<i18n lang="yaml">
cmn-Hans:
  shidinn-letter-database: 希顶字母数据库
  login: 登录
  dark-mode: 暗色模式
  light: 亮色
  dark: 暗色
  auto: 自动
en:
  shidinn-letter-database: Shidinn Letter Database
  login: Login
  dark-mode: Dark mode
  light: Light
  dark: Dark
  auto: Auto
</i18n>

<style scoped>
.navbar {
  background-color: var(--bs-tertiary-bg);
}
</style>
