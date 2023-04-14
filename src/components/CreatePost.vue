<script setup lang="ts">
import { CopyOutline, CreateOutline } from '@vicons/ionicons5';
import { NButton, NCard, NCode, NForm, NFormItem, NIcon, NInput, useMessage, type FormInst } from 'naive-ui';
import { ref } from 'vue';

const generatedPost = ref('')

const formRef = ref<FormInst | null>(null)
const message = useMessage()

const formValue = ref({
  name: '',
  description: ''
})

const rules = {
  name: {
    required: true,
    message: 'Please input a name for the trend.',
    trigger: ['input', 'blur']
  }
}

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Valid')

      const header = `**${formValue.value.name} Trend**`
      const bodyAndHeader = formValue.value.description
        ? `${header}
${formValue.value.description}`
        : header

      generatedPost.value = `${bodyAndHeader}

_Comment links to your participating posts!_`
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}

const copyPost = () => {
  navigator.clipboard.writeText(generatedPost.value).catch(function (err) {
    console.error('Failed to copy generated post: ', err);
  });
}
</script>

<template>
  <div>
    <h2>1. Input Data</h2>
    <n-form
      ref="formRef"
      :label-width="80"
      :model="formValue"
      :rules="rules"
    >
      <n-form-item
        label="Trend name"
        path="name"
      >
        <n-input v-model:value="formValue.name" />
      </n-form-item>
      <n-form-item
        label="Trend description or other notes"
        path="description"
      >
        <n-input v-model:value="formValue.description" />
      </n-form-item>
      <n-form-item>
        <n-button
          @click="handleValidateClick"
          icon-placement="right"
        >
          <template #icon>
            <n-icon :component="CreateOutline" />
          </template>
          Generate Post
        </n-button>
      </n-form-item>
    </n-form>
    <h2>2. Copy Post</h2>
    <n-card>
      <n-code
        v-if="generatedPost"
        :code="generatedPost"
      ></n-code>
      <div v-else>Fill out the above form and hit 'Generate Post'.</div>
      <template #action>
        <n-button
          type="primary"
          icon-placement="right"
          :disabled="!generatedPost"
          @click="() => copyPost()"
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

<style scoped></style>
