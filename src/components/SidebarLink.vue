<!-- SidebarLink.vue is meant to handle formatting links in the sidebar -->
<!-- Allows for creating links to navigate page and assigning them an icon -->
<script>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import { collapsed } from './state';

export default {
    props: {
        to: {type: String, required: false},
        icon: { type: String, required: true}
    },
    setup(props){
        const route = useRoute()
        const isActive = computed(() => route.path === props.to)
        return {isActive, collapsed}

    }
}
</script>

<template>
    <router-link :to="to ? to : ''" class="link" :class="{active: isActive}">
        <i class="icon" :class="icon" />
        <transition name="fade">
        <span v-if="!collapsed">
        <div class="wrapper">
        <slot />
        </div>
        </span>
        </transition>
    </router-link>
</template>

<style scoped>
.wrapper{
    padding:25px;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to{
    opacity: 0;
}
.link{
    display: flex;
    align-items: center;

    cursor: pointer;
    position: relative;
    font-weight: 400;
    user-select: none;

    margin: 0.1em 0;
    padding: 1.0em;
    border-radius: 0.25em;
    height: 1.5em;

    color: white;
    text-decoration: none;
}

.link:hover{
    background-color: var(--sidebar-item-active);
}
.link.active{
    background-color: var(--sidebar-item-active);
}

.link.icon{
    flex-shrink: 0;
    width: 25px;
    margin-right: 10px;
}
</style>
