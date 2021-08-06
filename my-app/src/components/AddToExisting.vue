<template>
    <b-card no-body class = "mt-4" border-variant="dark" bg-variant="dark" text-variant="white" >
        <b-card-body>
            <b-row class = "border-bottom">
                <b-col>
                    <span v-if="tool"><b-card-title>Adding code to {{entry.DownTimeL4}}</b-card-title></span>
                    <span v-else><b-card-title>Adding code to {{entry.DownTimeL4}}</b-card-title></span>
                </b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <b-card-text>Reason: </b-card-text>
                </b-col>
                <b-col md="9">
                    <b-form-input v-model="reqReason" :state="resState" required>{{reqReason}}</b-form-input>
                </b-col>
                <b-col></b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <b-card-text>Description: </b-card-text>
                </b-col>
                <b-col md="9">
                    <b-form-input v-model="reqDescription" :state="descState" required >{{reqDescription}}</b-form-input>
                </b-col>
                <b-col>
                        <b-button @click="sendAddData">Add to</b-button>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
    export default {
        name: 'AddToExisting',
        props: ['entry'],
        data() {
            return {
                required: ['Reason', 'Description'],
                reqReason:'',
                reqDescription:'',
            }
        },
        methods: {
            sendAddData () {
                if(this.resState&&this.descState){
                    console.log("I am sending!!!!!")
                    this.$emit('addDataToSub', this.$props.entry, this.reqReason,this.reqDescription);
                }
           }
        },
        computed: {
            tool: function () {
                return this.$props.entry.DowntimeCode.includes("TC");
            },
            resState: function () {
                return this.reqReason.length > 0 ? true : false
            },
            descState: function () {
                return this.reqDescription.length > 0 ? true: false
            }
        }
    }
</script>
