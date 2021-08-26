<template>
    <div class="card">
        <b-modal id="emailCheck" title="Email Request" centered class="modal" 
        header-bg-variant="dark" body-bg-variant="dark" footer-bg-variant="dark"
        header-border-variant="light" footer-border-variant="light" body-text-variant="light"
        header-text-variant="light" content-class="border-primary" :hide-header-close="true"
        @ok="yesEmail" @cancel="noEmail">
            <b-container fluid>
            <h6> Would you like to send an email notification for this update? </h6>
            </b-container>
        </b-modal>
        <b-card no-body class = "mt-2 mb-2" border-variant="primary" bg-variant="dark" text-variant="white" >
        <b-card-body>
            <b-row class = "border-bottom" >
                <b-col class="pr-0">  
                    <span v-if="toolChecker"> <b-card-title>{{entry.DownTimeL4}} -</b-card-title></span>
                    <span v-else ><b-card-title> {{entry.DownTimeL3}} - </b-card-title> </span>
                </b-col>
                <b-col no-body md = "8" >
                    <b-card-title v-if="entry.DownTimeL3 != entry.DownTimeL4 && !toolChecker"> {{entry.DownTimeL4}} </b-card-title>
                </b-col>
            </b-row>
            <b-row class="mb-2 mt-1">
                <b-col md = "2">
                    <b-card-text> Process: </b-card-text>
                </b-col>
                <b-col md = "2">
                    <b-card-text> {{entry.Filter}} </b-card-text>
                </b-col>
                <b-col md = "7"> 
                    <span v-if="entry.DowntimeCode===editIndex">
                        <b-form-input v-model="text" v-bind:placeholder="entry.Description"></b-form-input>{{text}}</span>
                    <span v-else>
                        <b-card-text> {{entry.Description}} </b-card-text> </span>
                </b-col>
            </b-row>
            <b-row class="text-left">
                <b-col md = "2">
                    <b-card-text>Code: </b-card-text>
                </b-col>
                <b-col md = "2">
                    <b-card-text>{{entry.DowntimeCode}}</b-card-text>
                </b-col>
                <span v-if="checkExtendable == false">
                <b-col md = "4"></b-col>
                </span>
                <b-col class="text-right">
                        <span v-if="checkAdd">
                            <b-button class="mr-2" variant="success" @click="toggleAdd">Add to</b-button>
                        </span>
                        <span v-else>
                            <b-button class="mr-2" variant="warning" @click="toggleAdd">Close</b-button>
                        </span>
                        <span v-if="entry.DowntimeCode!=editIndex">
                            <b-button class="mr-2" variant="success" @click="editDesc()">Edit</b-button>
                        </span>
                        <span v-else>
                            <b-button class="mr-2" variant="warning" @click="sender">Close</b-button>
                        </span>
                    <b-button class="mr-2" variant="success" @click="sender"> Delete</b-button>
                    <span v-if="checkExtendable">
                        <b-button class="mr-2" variant="warning" @click="sendIndexToParent">Close</b-button>
                    </span>
                </b-col>
            </b-row>
        </b-card-body>
        </b-card>
    </div>
</template>

<script>
export default ({
    name: 'BigCard',
    props : ['entry', 'addingTo', 'extendable', 'userStat'],
    components: {
    },
    data () {
        return {
            editIndex: '',
            text: "",
            btnAddVar: '',
            btnEditVar: '',
            btnDelVar: '',
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
                if(this.editIndex != '')
                    this.editDesc();
                else
                    this.sendIndexToParentDelete();
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
        sendIndexToParent() {
            this.$emit('indexFromChild', this.$props.entry);
        },
        sendIndexToParentDelete() {
            this.$emit('indexFromGrandchild', this.$props.entry, this.sendEmail);
        },
        editDesc() {
            if(this.editIndex != ''){
                this.saveChanges(this.text);
                this.editIndex = '';
                this.text = '';
                this.readyToSend = false;
            }
            else{
                if(this.retUserAuth)
                    this.editIndex = this.$props.entry.DowntimeCode;
                else
                    this.$emit('illegalEditFromChild');
            }
        },
        saveChanges(data) {
            this.$emit('editIndexFromGrandchild', this.$props.entry.DowntimeCode, data, this.sendEmail);
            
        },
        toggleAdd() {
            this.$emit('addIndexFromChild');
        }
    },
    computed: {
        toolChecker: function() {
            return (this.$props.entry.DowntimeCode.includes("TC")&&this.$props.entry.DownTimeL3 == "Tool Change");
        },
        checkAdd: function() {
            return !(this.$props.addingTo);
        },
        checkExtendable: function() {
            return this.$props.extendable;
        },
        retUserAuth: function() {
            return this.$props.userStat;
        }
    },
})
</script>

<style scoped>
    .card{
        width: 90%;
        padding:0;
        margin:0;
        background-color: #212529;
    }
</style>
