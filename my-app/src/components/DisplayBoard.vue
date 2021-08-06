<template>
    <div class="display-board">
        <div class="number">
        {{numberOfEntries}}
        </div>
    </div>
</template>
<script>
    export default {
        name: 'DisplayBoard',
        props: ['numberOfEntries'],
        methods: {
            getAllEntries() {
                this.$emit('getAllEntries')
            }
        }
    }
</script>