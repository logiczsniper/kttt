<script setup lang="ts">
import type { KTTPost } from "@/types/Post";
import { deleteOldPosts } from "@/utils/deleteOldPosts";
import { deletePosts } from "@/utils/deletePosts";
import { gatherPosts } from "@/utils/gatherPosts";
import { BrushOutline, CopyOutline, CreateOutline, DownloadOutline, TrashBinOutline } from "@vicons/ionicons5";
import { computed, ref } from "@vue/reactivity";
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { NBackTop, NButton, NCard, NCheckbox, NCode, NDataTable, NDynamicTags, NForm, NFormItem, NGradientText, NIcon, useMessage, type DataTableColumn, type DataTableRowKey, type FormInst, type FormRules } from "naive-ui";
import { format } from 'timeago.js';
import { h, reactive } from 'vue';
import { db } from "../utils/db";

const searchQuery = ref<Array<string>>([])
const searchMatchAll = ref(false)

const posts = useObservable<KTTPost[], KTTPost[]>(
  liveQuery(
    () => db.posts.toArray()
  ) as any
)

const filteredPosts = computed(() => {
  return searchQuery.value.length
    ? posts.value?.filter(post => {
      const contentBlob = post.contentFormatted?.toLowerCase()
      const searchQueryWords = searchQuery.value?.map(word => word.toLowerCase())

      const contentBlobIncludes = searchQueryWords.map(word => contentBlob?.includes(word))

      return searchMatchAll.value
        ? contentBlobIncludes.every(Boolean)
        : contentBlobIncludes.some(Boolean)
    })
    : posts.value
})

const data = computed(() => filteredPosts.value)

const columns: DataTableColumn[] = [
  {
    type: 'selection'
  },
  {
    title: 'ID',
    key: 'id',
    width: 88
  },
  {
    title: 'Content',
    key: 'contentFormatted',
    render: (rowData) => {
      const value = rowData.contentFormatted as string
      return h('div', { innerHTML: value, style: { 'max-height': '200px', overflow: 'clip' } }, [])
    }
  },
  {
    title: '🕑',
    key: 'createdAt',
    width: 120,
    render: (rowData) => {
      const value = rowData.createdAt as string
      return h('div', { innerHTML: format(value, 'en_US') }, [])
    },
    defaultSortOrder: 'descend',
    sorter: 'default'
  }
]

const paginationReactive = reactive({
  page: 1,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [5, 10, 20, 50, 100],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})

const gatheringPosts = ref(false)
const startGatheringPosts = async () => {
  gatheringPosts.value = true
  await gatherPosts()
  gatheringPosts.value = false
}

const emptyingDb = ref(false)
const startEmptyingDb = async () => {
  emptyingDb.value = true
  await deletePosts()
  emptyingDb.value = false
}

const cleaningDb = ref(false)
const startCleaningDb = async () => {
  cleaningDb.value = true
  await deleteOldPosts()
  cleaningDb.value = false
}

const loading = computed(() => gatheringPosts.value || emptyingDb.value)

const generatedComment = ref('')

const copyComment = () => {
  navigator.clipboard.writeText(generatedComment.value).catch(function (err) {
    console.error('Failed to copy generated post: ', err);
  });
}

const formRef = ref<FormInst | null>(null)
const message = useMessage()

const formValue = ref({
  postIds: <DataTableRowKey[]>[]
})

const rules = {
  postIds: {
    required: true,
    type: 'array',
    message: 'Please select at least one post.',
    trigger: 'change',
  }
} as FormRules

const getRowKey = (row: any) => row.id
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  formValue.value.postIds = rowKeys
}

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      message.success('Valid')

      const userTagToPostIdsMap: Record<string, string[]> = {}

      await Promise.all(formValue.value.postIds.map(async postId => {
        const post = await db.posts.get(postId)

        if (!post) return ''

        userTagToPostIdsMap[`@${post?.userId}`] = [...(userTagToPostIdsMap[`@${post?.userId}`] ?? []), `https://kitsu.io/posts/${postId}`]
      }))

      generatedComment.value = Object.entries(userTagToPostIdsMap).reduce((acc, [userTag, postIds]) => {
        return `${acc}
${userTag} ${postIds.join(' ')}`
      }, "")
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}
</script>

<template>
  <div>
    <n-back-top :right="12" />
    <h2>1. Request and Select Posts</h2>
    <section class="queryPosts">
      <div class="postInputs">
        <div>
          <n-dynamic-tags v-model:value="searchQuery" />
          <n-checkbox
            v-model:checked="searchMatchAll"
            style="margin-top: 8px"
          >
            Match All
          </n-checkbox>
          <p>Hit the <kbd>+</kbd> to enter search terms. If <b>Match All</b> is ticked, then all search terms must
            be found in the content of the post. Otherwise, one or more of the search terms must be found. Tip: putting
            multiple words in a single search term enforces word order. This search is
            <b>not</b>
            case-sensitive.
          </p>
        </div>
        <div>
          <n-button
            type="primary"
            icon-placement="right"
            :loading="loading"
            @click="() => startGatheringPosts()"
          >
            <template #icon>
              <n-icon :component="DownloadOutline" />
            </template>
            Download Missing Posts
          </n-button>
          <p>This will attempt to only download posts not already stored in your local posts database. If you haven't run
            this recently, should take about 15 minutes to download the last 10,000 posts, or about 2 months worth of
            posts.
            <n-gradient-text gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)">
              We chat a loottttt of shit on Kitsu.
            </n-gradient-text>
            Have a look at the JS
            console for more insight into the progress (I'm lazy dont wanna build a progress bar). Also
            btw, after each batch it
            saves the last offset that it was on, so it will save it's progress as
            it goes.
          </p>
        </div>

        <div>
          <n-button
            type="primary"
            secondary
            icon-placement="right"
            @click="() => startEmptyingDb()"
          >
            <template #icon>
              <n-icon :component="TrashBinOutline" />
            </template>
            Empty Posts DB
          </n-button>
          <p>This will empty your local posts database. Doing so will also reset the data that tries to track which posts
            you have already
            requested, so then hitting 'Download' afterwards will fallback to the default of around 2 months (10,000
            posts). So if your
            local db is fucked for some reason, empty it and re-download.</p>
        </div>
        <div>
          <n-button
            type="primary"
            secondary
            icon-placement="right"
            @click="() => startCleaningDb()"
          >
            <template #icon>
              <n-icon :component="BrushOutline" />
            </template>
            Clean Posts DB
          </n-button>
          <p>This will delete posts in your local posts database that are older than 2 months. I don't think you'll need
            to do this, but maybe once in a while.</p>
        </div>
      </div>

      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item
          :label="`${filteredPosts?.length ?? '??'} Trend post(s)`"
          path="postIds"
        >
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="paginationReactive"
            :loading="loading"
            :row-key="getRowKey"
            @update:checked-row-keys="handleCheck"
          />
        </n-form-item>
        {{ formValue.postIds.length }} selected posts.
        <n-form-item>
          <n-button
            @click="handleValidateClick"
            icon-placement="right"
          >
            <template #icon>
              <n-icon :component="CreateOutline" />
            </template>
            Generate Comment
          </n-button>
        </n-form-item>
      </n-form>
    </section>
    <h2>2. Copy Comment</h2>
    <n-card>
      <n-code
        v-if="generatedComment"
        :code="generatedComment"
      ></n-code>
      <div v-else>Select posts above and hit 'Generate Comment'.</div>
      <template #action>
        <n-button
          type="primary"
          icon-placement="right"
          :disabled="!generatedComment"
          @click="() => copyComment()"
        >
          <template #icon>
            <n-icon :component="CopyOutline" />
          </template>
          Copy
        </n-button>
      </template>
    </n-card>
  </div>
</template>

<style scoped>
.queryPosts {
  display: grid;
  grid-template-columns: 1fr 3.5fr;
  gap: 20px;
}

.postInputs {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
</style>

