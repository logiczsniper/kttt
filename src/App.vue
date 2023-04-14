<script setup lang="ts">
import { darkTheme, NConfigProvider, NMessageProvider, NPageHeader, NTabPane, NTabs, type GlobalThemeOverrides } from 'naive-ui';
import CreateComment from "./components/CreateComment.vue";
import CreatePost from "./components/CreatePost.vue";

import Home from "./components/Home.vue";


const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#e75e45',
  }
}
</script>

<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <n-page-header
      title="KTTT"
      subtitle="Kitsu Trend Timeline Tool"
    >
      <template #avatar>
        <img
          class="avatar"
          src="./assets/KTT.png"
        />
      </template>
      <n-tabs
        type="line"
        default-value="home"
        animated
      >
        <n-tab-pane
          name="home"
          tab="Home"
        >
          <Home />
        </n-tab-pane>
        <n-tab-pane
          name="visualize"
          tab="Visualize KTT"
        >
          ----|-----|-----LOL coming soonish maybe well see----|--->
        </n-tab-pane>
        <n-tab-pane
          name="posts"
          tab="Generate KTT Post"
        >
          <n-message-provider>
            <CreatePost />
          </n-message-provider>
        </n-tab-pane>
        <n-tab-pane
          name="generate"
          tab="Generate KTT Comment"
        >
          <n-message-provider>
            <CreateComment />
          </n-message-provider>
        </n-tab-pane>
      </n-tabs>
    </n-page-header>
    <footer class="mee">
      Made with ❤️ by <a href="https://kitsu.io/users/lczernel">@lczernel</a>
    </footer>
  </n-config-provider>
</template>

<style scoped>
.avatar {
  height: 40px;
  width: 40px;
  border-radius: 4px;
  box-shadow: 0px 0px 8px #e75d4514;
}

.mee {
  margin-top: 100px;
  color: #e3e7e8;
}
</style>
