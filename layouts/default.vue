<template>
  <BNavbar
    toggleable="lg"
    variant="light"
    v-b-color-mode="'light'"
    class="border-bottom"
  >
    <BNavbarBrand to="/">希顶字母数据库</BNavbarBrand>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
        <BNavItem disabled><s>登录</s></BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
  <div class="m-2">
    <slot />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: s => (s ? `${s} - ` : "") + "希顶字母数据库"
})
</script>
