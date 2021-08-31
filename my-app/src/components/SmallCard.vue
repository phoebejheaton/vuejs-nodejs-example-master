<template>
    <b-card no-body class = "card mt-2 mb-1" border-variant="primary" bg-variant="dark" text-variant="white">
            <b-card-body >
                <b-row class = "border-bottom" >
                    <b-col>
                        <span v-if="firstOrLater">
                            <b-card-title> {{entry.DownTimeL4}} -</b-card-title>
                        </span>
                        <span v-else>
                            <b-card-title> {{entry.DownTimeL3}} -</b-card-title>
                        </span>
                    </b-col>
                    <b-col md="7">
                        <span v-if="!firstOrLater">
                            <b-card-title> {{entry.DownTimeL4}} </b-card-title>
                        </span>
                    </b-col>
                </b-row>
                <b-row class = "text-left mt-2">
                    <b-col md = "10">
                        <b-card-text> {{entry.Description}} </b-card-text>
                    </b-col>
                    <b-col>
                        <b-button variant="success" @click="sendIndexToParent">Expand</b-button>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card> 
</template>

<script>

export default ({
    name: 'SmallCard',
    props : ['entry'],
    methods: {
        sendIndexToParent() {
            this.$emit('indexFromChild', this.$props.entry);
        }
    },
    computed: {
        toolChecker: function () {
            return this.$props.entry.DowntimeCode.includes("TC");
        },
        firstOrLater: function () {
            //is code a subgroup or not
            return (this.$props.entry.DownTimeL3 === this.$props.entry.DownTimeL4)||(this.$props.entry.DownTimeL3==='Tool Change')
        }
    }
})
</script>

<style scoped>
    .card{
        width: 100%;
    }
</style>
