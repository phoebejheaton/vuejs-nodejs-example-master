<template>
    <b-card no-body class = "mt-2 mb-2" border-variant="dark" bg-variant="dark" text-variant="white" >
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
                    <b-card-text> Machine Model: </b-card-text>
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
                    <b-button class="mr-2" @click="toggleAdd">
                        <span v-if="checkAdd">Add to</span>
                        <span v-else>Close</span>
                    </b-button>
                    <b-button class="mr-2" @click="editDesc">
                        <span v-if="entry.DowntimeCode!=editIndex">Edit</span>
                        <span v-else>Save changes</span>
                    </b-button>
                    <b-button class="mr-2" @click="sendIndexToParentDelete"> Delete</b-button>
                    <span v-if="checkExtendable">
                        <b-button class="mr-2" @click="sendIndexToParent">Close</b-button>
                    </span>
                </b-col>
            </b-row>
        </b-card-body>
        </b-card>
</template>

<script>
export default ({
    name: 'BigCard',
    props : ['entry', 'addingTo', 'extendable'],
    components: {
    },
    data () {
        return {
            editIndex: '',
            text: ""
        }
    },
    methods: {
        sendIndexToParent() {
            this.$emit('indexFromChild', this.$props.entry);
        },
        sendIndexToParentDelete() {
            this.$emit('indexFromGrandchild', this.$props.entry);
        },
        editDesc() {
            if(this.editIndex != ''){
                //this.saveChanges(data);
                this.saveChanges(this.text);
                this.editIndex = '';
                this.text = '';
            }
            else{
                this.editIndex = this.$props.entry.DowntimeCode;
            }
        },
        saveChanges(data) {
            this.$emit('editIndexFromGrandchild', this.$props.entry.DowntimeCode, data) 
        },
        toggleAdd() {
            this.$emit('addIndexFromChild');
        }
    },
    computed: {
        toolChecker: function() {
            return (this.$props.entry.DowntimeCode.includes("TC")&&this.$props.entry.DowntimeCode.includes("-00"));
        },
        checkAdd: function() {
            return !(this.$props.addingTo);
        },
        checkExtendable: function() {
            return this.$props.extendable;
        }
    }
})
</script>
