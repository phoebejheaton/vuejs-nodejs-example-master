<template>
    <div>
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
        <b-toast class = "mt-3 mb-2" id="addingStatus" :variant="toastVar" :title="toastName" static no-auto-hide>{{toastString}}</b-toast>
        <b-card no-body class = "mt-4 mb-4 card" border-variant="primary" bg-variant="dark" text-variant="white" >
            <b-card-body>
                <b-row class = "border-bottom">
                    <b-col>
                        <span v-if="tool"><b-card-title>Adding code to Tool Changes</b-card-title></span>
                        <span v-else><b-card-title>Adding code to Downtime Codes</b-card-title></span>
                    </b-col>
                </b-row>
                <b-row class = "mt-3 mb-3">
                    <b-col class=" p-0 pl-3" md="2">Type of stop: </b-col>
                    <b-col>
                        <span v-if="tool">
                            <b-form-radio-group id="radio-group-1" v-model="DTL2Select" :state="DTL2State" required>
                                <b-form-radio value="Unplanned Stoppage">Unplanned stoppage</b-form-radio>
                                <b-form-radio value="Unsatisfactory Quality">Unsatisfactory Quality</b-form-radio>
                                <b-form-invalid-feedback :state="DTL2State">Select one </b-form-invalid-feedback>
                            </b-form-radio-group>
                        </span>
                        <span v-else>
                            <b-form-radio-group id="radio-group-1" v-model="DTL2Select" :state="DTL2State" required>
                                <b-form-radio value="Shutdown">Shutdown</b-form-radio>
                                <b-form-radio value="Planned Stoppage">Planned Stoppage</b-form-radio>
                                <b-form-radio value="Unplanned Stoppage">Unplanned Stoppage</b-form-radio>
                                <b-form-radio value="Waiting Time">Waiting Time</b-form-radio>
                                <b-form-radio value="Production Rate Deviation">Production Rate Deviation</b-form-radio>
                                <b-form-radio value="Unsatisfactory Quality">Unsatisfactory Quality</b-form-radio>
                                <b-form-invalid-feedback :state="DTL2State">Select one </b-form-invalid-feedback>
                            </b-form-radio-group>
                        </span>
                    </b-col>
                </b-row>
                <b-row class = "mt-3 mb-3" >
                    <b-col class=" p-0 pl-3">
                        <b-card-text> Code group: </b-card-text>
                    </b-col>
                    <b-col md="10">
                        <b-form-input v-model="DTL3String" :state="DTL3State" required>{{DTL3String}}</b-form-input>
                    </b-col>
                </b-row>
                <b-row class = "mt-3 mb-3">
                    <b-col class=" p-0 pl-3" md="2">
                        <b-card-text>Belongs to process: </b-card-text>
                    </b-col>
                    <b-col>
                        <b-form-checkbox-group id="radio-group-2" v-model="FLTRSelect" :stacked="true" :state="FLTRState" 
                                                :options="upWorkCentres" @change="reqExcludes" required>
                            <b-form-invalid-feedback :state="FLTRState">Select one </b-form-invalid-feedback>
                        </b-form-checkbox-group>
                    </b-col>
                </b-row>
                <b-row class = "mt-3 mb-3">
                    <b-col class=" p-0 pl-3" md="2"><b-card-text>Excluding machines:</b-card-text></b-col>
                    <b-col>
                        <b-form-checkbox-group id="checkbox-group-1" v-model="EXCLSelect" :stacked="true" :options="excludingWC">
                        </b-form-checkbox-group>
                    </b-col>
                </b-row>
                <b-row class = "mt-3 mb-3">
                    <b-col class=" p-0 pl-3">
                        <b-card-text> Description: </b-card-text>
                    </b-col>
                    <b-col md="10">
                        <b-form-input v-model="DESCString" :state="DESCState" required>{{DESCString}}</b-form-input>
                    </b-col>
                </b-row>
                <b-row class = "mt-4 ">
                    <b-col class="text-right">
                        <b-button @click="makeToast">Add code</b-button>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card>
    </div>
    </div>
</template>

<script>
    export default ({
        
        name: 'AddNewSubgroup',
        props: ['item', 'WorkCentres'],
        data () {
            return {
                DTL2Select: '',
                DTL3String: '',
                FLTRSelect: ['start'],
                EXCLSelect: ['start'],
                DESCString: '',
                toastString: '',
                toastVar: 'danger',
                toastName: '',
                sendEmail: Boolean,
                readyToSend: false,
                upWorkCentres: []
            }
        },
        methods: {
            sender(){
                this.$bvModal.show('emailCheck');
                this.checkRes();
            },
            appendedWC(){
                this.upWorkCentres.push({text: 'ALL', value: 'ALL'})
                this.$props.WorkCentres.forEach(wc => {
                    if(wc.Code != '  ')
                        this.upWorkCentres.push( {text: wc.Description, value: wc.WCCode});
                });
                console.log(this.upWorkCentres)
            },
            checkRes(){
                if(this.readyToSend){
                    this.submitDataToParent();
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
            submitDataToParent() {
                if(this.DTL3State&&this.DESCState&&this.DTL2State&&this.FLTRState){
                    console.log("submit data!!!!!")
                    var excludeString = this.EXCLSelect.toString();
                    var filters = this.FLTRSelect.toString();
                    console.log(excludeString);
                    this.readyToSend = false;
                    this.$emit('dataSentFromChild', this.$props.item, this.DTL2Select, this.DTL3String, filters, excludeString, this.DESCString, this.sendEmail);
                    setTimeout(function(){console.log("next one")},1000);
                }
            },
            makeToast() {
                console.log("toasting")
                if(this.DTL3State&&this.DESCState&&this.DTL2State&&this.FLTRState){
                    this.toastName = 'Success'
                    this.toastString = "Added code to database successfully";
                    this.toastVar = 'success';
                    this.sender();
                    this.readyToSend = false;
                    this.$bvToast.show('addingStatus');
                }
                else{
                    this.toastString = "Check all input fields";
                    this.toastVar = 'danger';
                    this.toastName = 'Error'
                    this.$bvToast.show('addingStatus');
                    console.log("bagels");
                    this.readyToSend = false;
                    console.log(this.toastVar)
                } 
            }
        },
        computed: {
            tool: function () {
                console.log(this.$props.item)
                return this.$props.item === 'T';
            },
            DTL3State: function () {
                return this.DTL3String.length > 0 ? true : false
            },
            DESCState: function () {
                return this.DESCString.length > 0 ? true : false
            },
            DTL2State: function () {
                return Boolean(this.DTL2Select)
            },
            FLTRState: function () {
                return (this.FLTRSelect.length > 1)
            },
            excludingWC: function () {
                const ret = this.upWorkCentres.filter(wc => wc.text!="ALL");
                return ret;
            }
        },
        mounted() {
            this.appendedWC();
        }
    })
</script>

<style scoped>
    .card{
        width: 100%;
        background-color: #212529;
    }
</style>

