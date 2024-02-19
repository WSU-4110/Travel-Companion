<!-- Sidebar component -->
<!-- Creates sidebar and adds navigation links for site traversal -->
<!-- Uses SidebarLink component to format links and add icons -->
<script>
import {collapsed, toggleSidebar, sidebarWidth} from './state'
import SidebarLink from './SidebarLink.vue'
import { signCurrentUserOut } from '@/api/userVerification'

export default{
    props: {},
    components: {SidebarLink}, // Getting SidebarLink Component
    setup() {
        return {collapsed,toggleSidebar,sidebarWidth} // Returning status of collapsed, toggleSidebar value, and sidebarWidth value
    },
    computed: {
      username() {
        return this.$store.getters.getUsername;
      }
    },
    methods: {
      signUserOut() {
        signCurrentUserOut();
      }
    }
}</script>

<template>
    <!-- Add Sidebar Class -->
    <div class="sidebar" :style="{width:sidebarWidth}">
        <h2>
            <span v-if="collapsed">
            <div class="wrapper">TC</div>
            </span>
            <span v-else><div class="wrapper">Travel Companion</div></span>
        </h2>
        <h5>
        <!-- Sidebar Links -->
        <SidebarLink v-if="username" to="/" icon="fas fa-home">Home</SidebarLink>
        <SidebarLink v-if="username" to="/aboutUs" icon="fas fa-people-group">About Us</SidebarLink>
        <SidebarLink v-if="username" to="/UserLocation" icon="fas fa-map-location-dot">Map Tool</SidebarLink>
        <SidebarLink v-if="username" to="/tripManager" icon="fas fa-plane">Trip Manager</SidebarLink>
        <SidebarLink v-if="!username" to="/signIn" icon="fas fa-right-to-bracket">Sign In</SidebarLink>
        <SidebarLink v-if="username" icon="fas fa-sign-out" @click="signUserOut">Sign Out</SidebarLink>

        <!-- Only displaying icon when sidebar collapsed -->
        </h5>
        <span
            class="collapse-icon"
             :class="{'rotate-180' : collapsed}"
            @click="toggleSidebar">
        <i class="fas fa-angle-double-left" />
        </span>
    </div>
</template>

<style>
.wrapper{
    text-align: center;
}
:root{
    --sidebar-bg-color: #3393b9;
    --sidebar-item-hover:#357f9c;
    --sidebar-item-active:#357f9c;
}
</style>

<style scoped>
.sidebar{
    color:white;
    background-color: var(--sidebar-bg-color);

    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0.5em;

    transition: 0.3s ease;

    display: flex;
    flex-direction: column;
}

.collapse-icon{
    position: absolute;
    bottom: 0;
    padding: 0.75em;

    color: rgba(255,255,255,0.7);
    transition: 0.2s linear;
}
.rotate-180{
    transform: rotate(180deg);
    transition: 0.2s linear;
}
.sign-out {
    position: absolute;
    bottom: 0;
    padding: 0.75em;
}
</style>
