<template>
    <b-card no-body class = "mt-4 mb-4" border-variant="dark" bg-variant="dark" text-variant="white" >
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
                    <b-form-radio-group id="radio-group-2" v-model="FLTRSelect" :state="FLTRState" required>
                        <b-form-radio value="ALL">All</b-form-radio>
                        <b-form-radio value="PD">Point and Drill</b-form-radio>
                        <b-form-radio value="PT">Pointing</b-form-radio>
                        <b-form-radio value="GR">Grinding</b-form-radio>
                        <b-form-radio value="FR">Fillet Roll</b-form-radio>
                        <b-form-radio value="GV">Grooving</b-form-radio>
                        <b-form-radio value="TR">Thread Roll</b-form-radio>
                        <b-form-radio value="BR">Broaching</b-form-radio>
                        <b-form-invalid-feedback :state="FLTRState">Select one </b-form-invalid-feedback>
                    </b-form-radio-group>
                </b-col>
            </b-row>
            <b-row class = "mt-3 mb-3">
                <b-col class=" p-0 pl-3" md="2"><b-card-text>Excluding machines:</b-card-text></b-col>
                <b-col>
                    <b-form-checkbox-group id="checkbox-group-1" v-model="EXCLSelect">
                        <b-form-checkbox value="H0">H0</b-form-checkbox>
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
                    <b-button @click="submitDataToParent">Add code</b-button>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
    export default ({
        name: 'AddNewSubgroup',
        props: ['item'],
        data () {
            return {
                DTL2Select: '',
                DTL3String: '',
                FLTRSelect: '',
                EXCLSelect: ['start'],
                DESCString: ''
            }
        },
        methods: {
            submitDataToParent() {
                if(this.DTL3State&&this.DESCState&&this.DTL2State&&this.FLTRState){
                    console.log("submit data!!!!!")
                    var excludeString = this.EXCLSelect.toString();
                    console.log(excludeString);
                    this.$emit('dataSentFromChild', this.$props.item, this.DTL2Select, this.DTL3String, this.FLTRSelect, excludeString, this.DESCString);
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
                return Boolean(this.FLTRSelect)
            }

        }
    })
</script>

