<script setup lang="ts">
import { NCard } from 'naive-ui';

</script>

<template>
  <div>
    <h2>Welcome to the KTT<i>T</i></h2>
    <h3>What is this?</h3>
    This is a tool that assists in the documentation of trends on Kitsu via the KTT. What does it do?
    <ol>
      <li>Manages a locally stored collection of posts (using IndexedDB API for those wondering).</li>
      <li>Facilitates the viewing/filtering/selecting of these posts based on the trend criteria.</li>
      <li>Generates KTT content based on selected posts.</li>
    </ol>
    <h3>Hold on, what is the KTT?</h3>
    It is a group on Kitsu that, if you're reading this, YOU'RE MISSING OUT!
    <ul>
      <li><a href="https://kitsu.io/posts/9689560">Read about the group in the introduction post.</a></li>
      <li><a href="https://kitsu.io/groups/kitsu-trend-timeline">Join our group!</a></li>
    </ul>
    <h3>KTT leaders &lt;3</h3>
    <div class="leaders">
      <n-card
        size="small"
        hoverable
        title="@Reina"
      >
        <template #cover>
          <a
            class="leader"
            href="https://kitsu.io/users/Reinachan"
          >
            <img
              class=""
              src="https://media.kitsu.io/users/avatars/171606/large.jpeg"
            />
          </a>
        </template>
      </n-card>
      <n-card
        size="small"
        hoverable
        title="@feethebunny"
      >
        <template #cover>
          <a
            class="leader"
            href="https://kitsu.io/users/feethebunny"
          >
            <img
              class=""
              src="https://media.kitsu.io/users/avatars/30787/large.png"
            />
          </a>
        </template>
      </n-card>
      <n-card
        size="small"
        hoverable
        title="@Just Sanne"
      >
        <template #cover>
          <a
            class="leader"
            href="https://kitsu.io/users/JustSanne"
          >
            <img
              class=""
              src="https://media.kitsu.io/user/1290957/avatar/large-8750292eba625709d9ce3cd25fee11ea.jpeg"
            />
          </a>
        </template>
      </n-card>
      <n-card
        size="small"
        hoverable
        title="@Mia Kitsu"
      >
        <template #cover>
          <a
            class="leader"
            href="https://kitsu.io/users/Mia_Kitsu"
          >
            <img
              class=""
              src="https://media.kitsu.io/user/1043843/avatar/large-9f2707b2fb16dce072287e2fd9799a3b.jpeg"
            />
          </a>
        </template>
      </n-card>
      <n-card
        size="small"
        hoverable
        title="@AngMang"
      >
        <template #cover>
          <a
            class="leader"
            href="https://kitsu.io/users/AngMang"
          >
            <img
              class=""
              src="https://media.kitsu.io/user/222764/avatar/large-929359e0f31591a6a65e57e1a2d00fd6.jpeg"
            />
          </a>
        </template>
      </n-card>
      <n-card
        size="small"
        hoverable
        title="@lczernel"
      >
        <template #cover>
          <a
            class="leader"
            href="https://kitsu.io/users/lczernel"
          >
            <img
              class=""
              src="https://media.kitsu.io/users/avatars/347158/large.jpeg"
            />
          </a>
        </template>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.leaders {
  display: flex;
  gap: 8px;
}

.leader {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
