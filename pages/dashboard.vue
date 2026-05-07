<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { MyLink, MyProfile } from '~/types/models'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard • Linkhub' })

const linksStore = useLinksStore()
const { uploadFile } = useUploads()
const confirm = useConfirm()
const toast = useToast()

// ---------- Profile ----------
const profile = ref<MyProfile | null>(null)
const bioInput = ref('')
const savingProfile = ref(false)
const profileError = ref('')

async function loadProfile() {
  profile.value = await $fetch<MyProfile>('/api/profile')
  bioInput.value = profile.value.bio ?? ''
}

async function saveProfile() {
  savingProfile.value = true
  profileError.value = ''
  try {
    profile.value = await $fetch<MyProfile>('/api/profile', {
      method: 'PATCH',
      body: { bio: bioInput.value || null },
    })
    toast.add({ severity: 'success', summary: 'Profile saved', life: 2000 })
  } catch (err: unknown) {
    profileError.value = readError(err, 'Save failed')
  } finally {
    savingProfile.value = false
  }
}

async function onAvatarUpload(event: { files: File | File[] }) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  if (!file) return
  try {
    const url = await uploadFile(file)
    profile.value = await $fetch<MyProfile>('/api/profile', {
      method: 'PATCH',
      body: { avatarUrl: url },
    })
    toast.add({ severity: 'success', summary: 'Avatar updated', life: 2000 })
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail: readError(err, ''),
      life: 3000,
    })
  }
}

// ---------- New link ----------
const newLink = reactive({
  title: '',
  url: '',
  imageUrl: null as string | null,
})
const addingLink = ref(false)
const addError = ref('')

async function onLinkImageUpload(event: { files: File | File[] }) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  if (!file) return
  try {
    newLink.imageUrl = await uploadFile(file)
    toast.add({ severity: 'success', summary: 'Image uploaded', life: 2000 })
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail: readError(err, ''),
      life: 3000,
    })
  }
}

async function addLink() {
  if (!newLink.title || !newLink.url) {
    addError.value = 'Title and URL are required.'
    return
  }
  addError.value = ''
  addingLink.value = true
  try {
    await linksStore.create({
      title: newLink.title,
      url: newLink.url,
      imageUrl: newLink.imageUrl,
    })
    newLink.title = ''
    newLink.url = ''
    newLink.imageUrl = null
    toast.add({ severity: 'success', summary: 'Link added', life: 2000 })
  } catch (err: unknown) {
    addError.value = readError(err, 'Add failed')
  } finally {
    addingLink.value = false
  }
}

// ---------- Edit link ----------
const editVisible = ref(false)
const editDraft = reactive({
  id: '',
  title: '',
  url: '',
})
const savingEdit = ref(false)

function startEdit(l: MyLink) {
  editDraft.id = l.id
  editDraft.title = l.title
  editDraft.url = l.url
  editVisible.value = true
}

async function saveEdit() {
  savingEdit.value = true
  try {
    await linksStore.update(editDraft.id, {
      title: editDraft.title,
      url: editDraft.url,
    })
    editVisible.value = false
    toast.add({ severity: 'success', summary: 'Link updated', life: 2000 })
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Update failed',
      detail: readError(err, ''),
      life: 3000,
    })
  } finally {
    savingEdit.value = false
  }
}

// ---------- Delete link ----------
function confirmDelete(l: MyLink) {
  confirm.require({
    message: `Delete "${l.title}"? This can't be undone.`,
    header: 'Confirm delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', text: true },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: async () => {
      try {
        await linksStore.remove(l.id)
        toast.add({ severity: 'success', summary: 'Link deleted', life: 2000 })
      } catch (err: unknown) {
        toast.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: readError(err, ''),
          life: 3000,
        })
      }
    },
  })
}

function readError(err: unknown, fallback: string) {
  if (typeof err === 'object' && err !== null) {
    const m = err as { message?: string; statusMessage?: string }
    return m.statusMessage ?? m.message ?? fallback
  }
  return fallback
}

// ---------- Init ----------
// Run on the client only — we use $fetch in store actions, which doesn't
// forward cookies during SSR. The dashboard is interactive anyway, so
// fetching after mount is fine.
onMounted(async () => {
  await Promise.all([loadProfile(), linksStore.fetch()])
})
</script>

<template>
  <section class="max-w-4xl mx-auto p-4 sm:p-6">
    <div class="flex items-baseline justify-between mb-6 gap-3 flex-wrap">
      <h1 class="text-3xl">Dashboard</h1>
      <NuxtLink
        v-if="profile"
        :to="`/${profile.username}`"
        class="text-sm !text-[var(--linkhub-primary)]"
        target="_blank"
      >
        View public page →
      </NuxtLink>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mb-8">
      <!-- Profile card -->
      <Card>
        <template #title>Profile</template>
        <template #content>
          <form class="flex flex-col gap-4" @submit.prevent="saveProfile">
            <div class="flex items-center gap-4">
              <Avatar
                :image="profile?.avatarUrl ?? undefined"
                :label="profile?.username?.[0]?.toUpperCase()"
                size="xlarge"
                shape="circle"
              />
              <FileUpload
                mode="basic"
                :auto="true"
                custom-upload
                accept="image/*"
                :max-file-size="5_000_000"
                choose-label="Upload avatar"
                choose-icon="pi pi-upload"
                @uploader="onAvatarUpload"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="bio" class="text-sm">Bio</label>
              <Textarea id="bio" v-model="bioInput" rows="4" auto-resize />
            </div>
            <Button label="Save profile" type="submit" :loading="savingProfile" />
            <Message v-if="profileError" severity="error" :closable="false">
              {{ profileError }}
            </Message>
          </form>
        </template>
      </Card>

      <!-- Add link card -->
      <Card>
        <template #title>Add a link</template>
        <template #content>
          <form class="flex flex-col gap-4" @submit.prevent="addLink">
            <div class="flex flex-col gap-1">
              <label for="link-title" class="text-sm">Title</label>
              <InputText id="link-title" v-model="newLink.title" required />
            </div>
            <div class="flex flex-col gap-1">
              <label for="link-url" class="text-sm">URL</label>
              <InputText id="link-url" v-model="newLink.url" type="url" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm">Image (optional)</label>
              <FileUpload
                mode="basic"
                :auto="true"
                custom-upload
                accept="image/*"
                :max-file-size="5_000_000"
                choose-label="Upload image"
                choose-icon="pi pi-upload"
                @uploader="onLinkImageUpload"
              />
              <small v-if="newLink.imageUrl" class="opacity-70">Image attached ✓</small>
            </div>
            <Button label="Add link" type="submit" :loading="addingLink" />
            <Message v-if="addError" severity="error" :closable="false">
              {{ addError }}
            </Message>
          </form>
        </template>
      </Card>
    </div>

    <!-- Links list -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>Your links</span>
          <span class="text-sm opacity-70">{{ linksStore.items.length }} total</span>
        </div>
      </template>
      <template #content>
        <div v-if="linksStore.isLoading" class="text-center py-6 opacity-70">Loading…</div>
        <div
          v-else-if="linksStore.items.length === 0"
          class="text-center py-6 opacity-70"
        >
          No links yet. Use the form above to add one.
        </div>
        <ul v-else class="flex flex-col gap-3">
          <li
            v-for="l in linksStore.items"
            :key="l.id"
            class="flex items-center gap-3 p-3 rounded border border-white/10"
          >
            <Avatar
              :image="l.imageUrl ?? undefined"
              :label="l.title[0]?.toUpperCase()"
              shape="circle"
            />
            <div class="flex-1 min-w-0">
              <div class="font-semibold truncate">{{ l.title }}</div>
              <a
                :href="l.url"
                target="_blank"
                class="text-sm !text-[var(--linkhub-primary)] truncate block"
              >
                {{ l.url }}
              </a>
            </div>
            <Button
              icon="pi pi-pencil"
              text
              severity="secondary"
              aria-label="Edit"
              @click="startEdit(l)"
            />
            <Button
              icon="pi pi-trash"
              text
              severity="danger"
              aria-label="Delete"
              @click="confirmDelete(l)"
            />
          </li>
        </ul>
      </template>
    </Card>

    <Dialog
      v-model:visible="editVisible"
      header="Edit link"
      modal
      class="w-full max-w-md mx-4"
    >
      <form class="flex flex-col gap-4 pt-2" @submit.prevent="saveEdit">
        <div class="flex flex-col gap-1">
          <label for="edit-title" class="text-sm">Title</label>
          <InputText id="edit-title" v-model="editDraft.title" required />
        </div>
        <div class="flex flex-col gap-1">
          <label for="edit-url" class="text-sm">URL</label>
          <InputText id="edit-url" v-model="editDraft.url" type="url" required />
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <Button
            label="Cancel"
            text
            severity="secondary"
            type="button"
            @click="editVisible = false"
          />
          <Button label="Save" type="submit" :loading="savingEdit" />
        </div>
      </form>
    </Dialog>
  </section>
</template>
