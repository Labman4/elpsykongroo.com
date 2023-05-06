<template>
    <Clock/>
    <div class="hidden-md-and-up"> 
        <Dashboard  v-if = "access.permission != undefined && access.permission.includes('admin')"/>
    </div>
</template>

<script lang="ts" setup>
import {access} from '~/assets/ts/access';

</script>
