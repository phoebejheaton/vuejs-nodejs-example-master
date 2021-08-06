<template>
    <b-card no-body class = "mt-4" border-variant="dark" bg-variant="dark" text-variant="white" style="max-width: 35rem">
        <b-card-body >
            <b-row class = "border-bottom" >
                <b-col >   
                    <b-card-title> {{item}} - </b-card-title>
                </b-col>
                <b-col no-body md = "6"></b-col>
            </b-row>
            <b-row class = "mt-2">
                <b-col class="text-right">
                    <b-button class = "mr-2" @click="sendAddToParent">
                        <span v-if="checkAdding">Add to</span>
                        <span v-else>Close</span>
                    </b-button>
                    <b-button @click="sendFlipToParent">
                        <span v-if="checkOpen">Expand</span>
                        <span v-else>Close</span>
                    </b-button>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card> 
</template>

<script>
export default ({
    name: 'FilterCard',
    props : ['item'],
    data () {
        return {
            open: true,
            adding: true
        }
    },
    methods: {
        sendFlipToParent() {
            this.open = !this.open;
            this.$emit('flipFromChild', (this.$props.item));
        },
        sendAddToParent() {
            this.adding = !this.adding;
            if(this.$props.item == "Downtime Codes")
                this.$emit('bigAddFromChild', 'D');
            else
                this.$emit('bigAddFromChild', 'T');
        }
    },
    computed: {
        checkOpen () {
            console.log(this.$props.item)
            return this.open;
        },
        checkAdding () {
            return this.adding;
        }
    }
})
</script>