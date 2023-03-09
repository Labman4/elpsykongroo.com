<template>
    <Clock/>
    <div class="hidden-md-and-up"> 
        <Dashboard  v-if = "access.expires_in > 0"/>
    </div>
</template>

<script lang="ts" setup>
import {access} from '~/assets/ts/access';

</script>
