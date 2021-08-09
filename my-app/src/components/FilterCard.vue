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
            if(this.$props.item === "Tool Change Codes")
                this.$emit('flipFromChild', 'T');
            else
                this.$emit('flipFromChild', 'D');
        },
        sendAddToParent() {
            this.adding = !this.adding;
            console.log('item = ' + this.$props.item)
            if(this.$props.item === "Tool Change Codes")
                this.$emit('bigAddFromChild', 'T');
            else
                this.$emit('bigAddFromChild', 'D');
        }
    },
    computed: {
        checkOpen () {
            console.log(this.type)
            return this.open;
        },
        checkAdding () {
            return this.adding;
        }
    }
})
</script>