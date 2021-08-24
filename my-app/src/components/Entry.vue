<template>
    <div>
        <div class="entryToasted">        
            <b-toast class="ml-2" id="userStatus" :variant="toastVar" :title="toastName" static no-auto-hide>{{toastString}}</b-toast>
        </div>
        <div class = "wrapper">
            <div class='left ml-5 mr-2 pr-2'>
                <b-container fluid>
                    <span v-if="!checkSearching">
                        <b-button class="mb-0 mt-4 ml-4" size="lg" variant="warning" @click="resetSearch">Back</b-button>
                        <span v-if="SimilarEntries.length === 0">
                            <b-card class = "card mt-4 mb-1 ml-4 pt-1" border-variant="primary" bg-variant="dark" text-variant="white">
                                <b-card-title> No entries found. </b-card-title>
                            </b-card>
                        </span>
                    </span>
                    <b-card-group class="mb-0 mt-4 ml-2 " deck v-for="entry in EntryExpanded" v-bind:key="entry.DowntimeCode" style="max-width:55rem">
                        <template>
                            <keep-alive>
                                <component v-bind:is="override" v-on:indexFromChild="indexFromChildReceived" 
                                        v-on:indexFromGrandchild="indexFromGrandchildReceived"
                                        v-on:editIndexFromGrandchild="editIndexFromGrandchildReceived"
                                        v-on:addIndexFromChild="addIndexFromChildReceived" 
                                        v-on:illegalEditFromChild="illegalEditFromChildReceived"
                                        v-bind:extendable="true" :entry="entry" :addingTo="addingTo" :userStat="userStat"></component>
                            </keep-alive>
                        </template>
                    </b-card-group>

                    
                    <div v-show="expanded==null">
                    <b-card-group  deck v-for="item in itemsBefore" v-bind:key="item.name" >
                        <template>
                            <FilterCard v-on:flipFromChild="flipFromChildReceived" 
                                        v-on:bigAddFromChild="bigAddFromChildReceived"
                                        :item="item.name" :opened="chosenDTC" :adding="chosenADD"></FilterCard>
                        </template> 
                    </b-card-group>

                    <template v-if="wholeAddingTo">
                        <AddNewSubgroup v-on:dataSentFromChild="dataSentFromChildReceived" v-on:getTempWC="getTempWCReceived"
                                        :item="chosenADD" :WorkCentres="WorkCentres" ></AddNewSubgroup>
                    </template>

                
                    <b-card-group class="mt-4 mb-4 ml-2 " deck v-for="entry in SimilarEntries" v-bind:key="entry.DowntimeCode">
                        <template >
                            <component v-bind:is="cardShow" v-on:indexFromChild="indexFromChildReceived" :entry="entry"></component>
                        </template> 
                    </b-card-group>

                    <b-card-group class="mb-3 " deck v-for="item in itemsAfter" v-bind:key="item.name">
                        <template>
                            <FilterCard v-on:flipFromChild="flipFromChildReceived" :item="item.name" :opened="chosenDTC" :adding="chosenADD"></FilterCard>
                        </template> 
                    </b-card-group>
                    </div>
                </b-container>
            </div>

            <div class='right mr-2 pr-2 mt-4'>
                <b-container fluid>
                    <span v-if="!checkSearching">
                        <b-button class="mb-0 mt-4 ml-4" size="lg" style="visibility: hidden;">hello</b-button>
                    </span>
                <b-card-group  deck v-for="entry in EntriesExpandedChildren" v-bind:key="entry.DowntimeCode">
                        <template>
                            <keep-alive>
                                <component v-bind:is="cardShow" v-on:indexFromChild="indexFromChildReceived" 
                                v-on:editIndexFromGrandchild="editIndexFromGrandchildReceived"
                                v-on:indexFromGrandchild="indexFromGrandchildReceived"
                                v-bind:extendable="false"
                                :entry="entry"></component>
                            </keep-alive>
                        </template>
                    </b-card-group>

                    <b-card-group v-for="entry in EntryExpanded" v-bind:key="entry.DownTimeL3">
                        <template v-if="addingTo">
                            <AddToExisting v-on:addDataToSub="addDataToSubReceived" :entry="entry"></AddToExisting>
                        </template>
                    </b-card-group>
                </b-container>
            </div>
        </div>
    </div>
</template>

<script>

const SmallCard = () => import('./SmallCard.vue');
const BigCard = () => import('./BigCard.vue');
const FilterCard = () => import('./FilterCard.vue');
const AddToExisting = () => import('./AddToExisting.vue');
const AddNewSubgroup = () => import('./AddNewSubgroup.vue');

export default {
        props: 
            ['Entries', 'searchingFor', 'userStat', 'WorkCentres'],
        components: {
            SmallCard, 
            BigCard,
            FilterCard,
            AddToExisting,
            AddNewSubgroup
        },
        data() {
            return {
                expanded: null,
                override: 'BigCard',
                cardShow: 'SmallCard',
                chosenDTC: "N",
                chosenADD: 'N',
                items: [{name: "Downtime Codes"}, {name: "Tool Change Codes"}],
                addingTo: false,
                wholeAddingTo: false,
                extendable: Boolean,
                toastString: 'Request changes with Cell Leader',
                toastVar: 'danger',
                toastName: 'Permission denied'
            }
        },
        methods: {
            expandRow(entry) {
                if(this.expanded != null){
                    if(this.expanded === entry){
                        if(entry.DowntimeCode.includes('DT')){
                            if(this.expanded.AccessLevel > 1 ){
                                this.expanded = this.DownTimeCodes.filter(code => (code.AccessLevel === entry.AccessLevel-1)&&(code.DownTimeL4 === entry.DownTimeL3));
                                this.expanded = this.expanded[0];
                            } else {
                                this.expanded = null;
                            }
                        } else {
                            if(this.expanded.AccessLevel > 2 ){
                                this.expanded = this.ToolChanges.filter(code => (code.AccessLevel === entry.AccessLevel-1)&&(code.DownTimeL4 === entry.DownTimeL3));
                                this.expanded = this.expanded[0];
                            } else {
                                this.expanded = null;
                            }
                        }
                    } else {
                        this.expanded = entry;
                    }
                }
                else {
                    this.expanded = entry;
                }
                
                console.log(this.expanded);
            },
            indexFromChildReceived(index) {
                console.log("index recieved!!!!!!")
                this.expandRow(index)
            },
            indexFromGrandchildReceived(index, EMAIL) {
                if(this.retUserAuth){
                    console.log("delete recieved!!!!!!")
                    this.expandRow(index);
                    this.$emit('entryFromChildDelete', index, EMAIL);
                } else {
                    this.$bvToast.show('userStatus');
                }
            },
            editIndexFromGrandchildReceived(index,data, EMAIL){
                console.log("edit received!!!!!!")
                this.$emit('editIndexFromChild', index, data, EMAIL);
            },
            flipFromChildReceived(item){
                console.log("flipped!!!!!!!")
                console.log('flipped item:' + item)
                console.log('dtc: ' + this.chosenDTC)
                if(this.chosenDTC === 'D' && item === 'D'){
                    this.chosenDTC = 'N';
                    this.expanded = null;
                } else if(this.chosenDTC === 'T' && item === 'T'){
                    this.chosenDTC = 'N';
                    this.expanded = null;
                } else {
                    if(item === "D")
                    {   this.chosenDTC = "D";}
                    else if(item === "T")
                    {   this.chosenDTC = "T";}
                }
                console.log(this.chosenDTC)
            },
            addIndexFromChildReceived(){
                if(this.retUserAuth){
                    console.log("add request!!!!!")
                    this.addingTo = !this.addingTo;
                } else {
                    this.$bvToast.show('userStatus');
                }
            },
            addDataToSubReceived(index,DTL3,DESC, EMAIL){
                console.log("up!!!")
                this.$emit('addDataToSubSending',index,DTL3,DESC, EMAIL);
            },
            bigAddFromChildReceived(item){
                if(this.retUserAuth){
                    this.wholeAddingTo = !this.wholeAddingTo;
                    if(!this.wholeAddingTo){
                        this.chosenADD = 'N';
                    } else {
                        this.chosenADD = item;
                    }
                } else {
                    this.$bvToast.show('userStatus');
                }
            },
            dataSentFromChildReceived(TYP, DTL2, DTL3, FLTR, EXCL, DESC, EMAIL){
                console.log("parent recieved data!!!!!")
                this.$emit('dataSentFromGrandchild', TYP, DTL2, DTL3, FLTR, EXCL, DESC, EMAIL);
            },
            resetSearch(){
                console.log("resetting!!!!!")
                this.$emit('resetSearch');
            },
            illegalEditFromChildReceived () {
                this.$bvToast.show('userStatus');
            }
        },
        computed: {
            DownTimeCodes: function() {
                var toExpand = (this.$props.Entries).filter(entry => entry.DowntimeCode.includes("DT"));
                toExpand.sort( (a,b) => a.DownTimeL3.localeCompare(b.DownTimeL3));
                return toExpand;
            },
            ToolChanges: function() {
                var toExpand = (this.$props.Entries).filter(entry => entry.DowntimeCode.includes("TC"));
                toExpand.sort( (a,b) => a.DownTimeL4.localeCompare(b.DownTimeL4));
                return toExpand;
            },
            SimilarEntries: function () {
                var toExpand = {};
                if(!this.checkSearching){
                    toExpand = this.$props.Entries.filter(entry => (entry.DownTimeL3.toLowerCase()).includes(this.$props.searchingFor.toLowerCase()) ||
                                                                    (entry.DownTimeL4.toLowerCase()).includes(this.$props.searchingFor.toLowerCase()));
                    toExpand.sort( (a,b) => a.DownTimeL3.localeCompare(b.DownTimeL3));
                    return toExpand;
                } else { 
                    if(this.chosenDTC!='N'){
                        if(this.chosenDTC === 'D'){
                            toExpand = this.DownTimeCodes.filter(entry => entry.DownTimeL3 === entry.DownTimeL4);
                        } else {
                            toExpand = this.ToolChanges.filter(entry => entry.DownTimeL3 == "Tool Change");
                        }
                        
                        toExpand.sort( (a,b) => a.DownTimeL3.localeCompare(b.DownTimeL3));
                        return toExpand;
                    } else{ 
                        return null;
                    }
                    }
            },
            SimilarEntriesBeforeSlice: function () {
                if(this.expanded != null){
                    const index = this.SimilarEntries.findIndex(entry => entry.DowntimeCode === this.expanded.DowntimeCode);
                    const toExpand = this.SimilarEntries.slice(0, index);
                    return toExpand;
                } else return this.SimilarEntries;
            },
            EntryExpanded: function() {
                console.log("entered")
                if(this.expanded != null){
                    var toExpand;
                    if(this.expanded.DowntimeCode.includes("TC")){
                        toExpand = this.ToolChanges.filter(entry => entry.DowntimeCode === this.expanded.DowntimeCode);
                    } else {
                        toExpand = this.DownTimeCodes.filter(entry => entry.DowntimeCode === this.expanded.DowntimeCode);
                    }
                    return toExpand;
                } else return null;
            },
            EntriesExpandedChildren: function () {
                if(this.expanded != null){
                    var toExpand = {};
                    if(this.expanded.DowntimeCode.includes("TC")){
                        toExpand = (this.ToolChanges).filter(entry => (entry.AccessLevel === (this.expanded.AccessLevel+1)&&(entry.DownTimeL3 === this.expanded.DownTimeL4)));
                    } else {
                        toExpand = (this.DownTimeCodes).filter(entry => (entry.AccessLevel === (this.expanded.AccessLevel+1)&&(entry.DownTimeL3 === this.expanded.DownTimeL4)));
                    }
                    toExpand.sort( (a,b) => a.DownTimeL4.localeCompare(b.DownTimeL4));
                    return toExpand;
                } else return null;
            },
            itemsBefore: function () {
                var ret = {};
                if(!this.checkSearching)
                    return ret;
                if(this.chosenDTC === 'D'){
                    ret = this.items.filter(item => (item.name.includes("Down")));
                }
                else{
                    ret = this.items;
                }
                return ret;
            },
            itemsAfter: function () {
                var ret = {};
                if(!this.checkSearching)
                    return ret;
                if(this.chosenDTC === 'D')
                    ret = this.items.filter(item => (item.name.includes("Tool")));
                return ret;
            },
            checkExtended: function () {
                return this.expanded
            },
            checkSearching: function () {
                console.log(this.$props.searchingFor)
                return (this.$props.searchingFor === '')
            },
            retUserAuth: function() {
                return this.$props.userStat;
            }
        }
    };

</script>

<style scoped>
    .entryToasted{
        background-color: #212529;
        padding-top: 5px;
        padding-right: 5px;
    }
    .wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: minmax(20px, auto);
        background-color:#212529;
        min-height: 95vh;
        max-height: auto;
        width: 100%;
        overflow:scroll;
    }

    .left{
        grid-row:1;
        grid-column:1/2;
        align-self: left;
    }

    .right{
        grid-row:1;
        grid-column:2/3;
        align-self: left;
    }

</style>
