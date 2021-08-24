<template>
    <div class = "card mt-2 mb-4">
    <b-modal id="emailCheck" title="Email Request" centered class="modal" 
    header-bg-variant="dark" body-bg-variant="dark" footer-bg-variant="dark"
    header-border-variant="light" footer-border-variant="light" body-text-variant="light"
    header-text-variant="light" content-class="border-primary" :hide-header-close="true"
    @ok="yesEmail" @cancel="noEmail">
        <b-container fluid>
        <h6> Would you like to send an email notification for this update? </h6>
        </b-container>
    </b-modal>
    <b-toast class = "mt-3 " id="addingStatus" :variant="toastVar" :title="toastName" static no-auto-hide>{{toastString}}</b-toast>
    <b-card no-body border-variant="primary" bg-variant="dark" text-variant="white">
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
                <b-col md="8">
                    <b-form-input v-model="reqReason" :state="resState" required>{{reqReason}}</b-form-input>
                </b-col>
                <b-col></b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <b-card-text>Description: </b-card-text>
                </b-col>
                <b-col md="8">
                    <b-form-input v-model="reqDescription" :state="descState" required >{{reqDescription}}</b-form-input>
                </b-col>
                <b-col>
                        <b-button @click="sender">Add to</b-button>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
    </div>
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
                toastString: '',
                toastVar: 'danger',
                toastName: '',
                sendEmail: Boolean,
                readyToSend: false
            }
        },
        methods: {
            sender(){
                this.$bvModal.show('emailCheck');
                this.checkRes();
            },
            checkRes(){
                if(this.readyToSend){
                    this.sendAddData();
                }
                else
                    setTimeout(this.checkRes,300);
            },
            yesEmail(){
                this.sendEmail = true;
                this.readyToSend = true;
            },
            noEmail(){
                this.sendEmail = false;
                this.readyToSend = true;
            },
            sendAddData () {
                if(this.resState&&this.descState){
                    this.toastName = 'Success'
                    this.toastString = "Added code to database successfully";
                    this.toastVar = 'success';
                    this.$bvToast.show('addingStatus');
                    console.log("I am sending!!!!!")
                    this.readyToSend = false;
                    this.$emit('addDataToSub', this.$props.entry, this.reqReason,this.reqDescription, this.sendEmail);
                } else {
                    this.toastString = "Check all input fields";
                    this.toastVar = 'danger';
                    this.toastName = 'Error'
                    this.$bvToast.show('addingStatus');
                    this.readyToSend = false;
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
<style scoped>
    .card{
        background-color: #212529;
    }
</style>