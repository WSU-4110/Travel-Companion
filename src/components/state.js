import { ref, computed} from 'vue'

//Handling sidebarWidth based on state of collapsed
export const collapsed = ref(true)
export const toggleSidebar = () => (collapsed.value = !collapsed.value)

export const SIDEBAR_WIDTH = 275
export const SIDEBAR_WIDTH_COLLAPSED = 80
export const sidebarWidth = computed(
    () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`
)
