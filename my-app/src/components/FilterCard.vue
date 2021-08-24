<template>
    <b-card no-body class = "mt-3 mb-3" border-variant="primary" bg-variant="dark" text-variant="white" style="max-width: 35rem">
        <b-card-body >
            <b-row class = "border-bottom" >
                <b-col >   
                    <b-card-title> {{item}} - </b-card-title>
                </b-col>
                <b-col no-body md = "6"></b-col>
            </b-row>
            <b-row class = "mt-2">
                <b-col class="text-right">
                        <span v-if="checkAdding">
                            <b-button variant="warning" class = "mr-2" @click="sendAddToParent">Close</b-button>
                        </span>
                        <span v-else>
                            <b-button variant="success" class = "mr-2" @click="sendAddToParent">Add to</b-button>
                        </span>
                        <span v-if="checkOpen">
                            <b-button variant="warning" @click="sendFlipToParent">Close</b-button>
                        </span>
                        <span v-else>
                            <b-button variant="success" @click="sendFlipToParent">Expand</b-button>
                        </span>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card> 
</template>

<script>
export default ({
    name: 'FilterCard',
    props : ['item', 'opened', 'adding'],
    methods: {
        sendFlipToParent() {
            console.log(this.$props.item)
            if(this.$props.item === "Tool Change Codes")
                this.$emit('flipFromChild', 'T');
            else
                this.$emit('flipFromChild', 'D');
        },
        sendAddToParent() {
            if(this.$props.item === "Tool Change Codes")
                this.$emit('bigAddFromChild', 'T');
            else
                this.$emit('bigAddFromChild', 'D');
        }
    },
    computed: {
        checkOpen () {
            console.log(this.$props.opened == 'D')
            console.log(this.$props.item)
            console.log(this.$props.item == 'Downtime Codes')
            if((this.$props.opened == 'T' && this.$props.item == "Tool Change Codes") ||
                (this.$props.opened == 'D' && this.$props.item == "Downtime Codes")){
                    console.log(true)
                return true;
            } else {
                console.log(false)
                return false
            }
        },
        checkAdding () {
            if((this.$props.adding === 'T' && this.$props.item === "Tool Change Codes") ||
                (this.$props.adding === 'D' && this.$props.item === "Downtime Codes")){
                return true;
            } else return false;
        }
    }
})
</script>