<template>
    <div class = "wrapper">
        <div class='left ml-5 mr-2 pr-2'>
            <b-container fluid>
                 <b-card-group class="mb-0 mt-4 ml-2 " deck v-for="entry in EntryExpanded" v-bind:key="entry.DowntimeCode" style="max-width:55rem">
                    <template>
                        <keep-alive>
                            <component v-bind:is="override" v-on:indexFromChild="indexFromChildReceived" 
                                    v-on:indexFromGrandchild="indexFromGrandchildReceived"
                                    v-on:editIndexFromGrandchild="editIndexFromGrandchildReceived"
                                    v-on:addIndexFromChild="addIndexFromChildReceived" v-bind:extendable="true"
                                    :entry="entry" :addingTo="addingTo"></component>
                        </keep-alive>
                    </template>
                </b-card-group>

                
                <div v-show="expanded==null">
                <b-card-group  deck v-for="item in itemsBefore" v-bind:key="item.name">
                    <template>
                        <FilterCard v-on:flipFromChild="flipFromChildReceived" 
                                    v-on:bigAddFromChild="bigAddFromChildReceived"
                                    :item="item.name"></FilterCard>
                    </template> 
                </b-card-group>

                <template v-if="wholeAddingTo">
                    <AddNewSubgroup v-on:dataSentFromChild="dataSentFromChildReceived" :item="chosenADD"></AddNewSubgroup>
                </template>

               
                    <b-card-group class="mt-4 mb-4 ml-2 " deck v-for="entry in SimilarEntries" v-bind:key="entry.DowntimeCode">
                        <template >
                            <component v-bind:is="cardShow" v-on:indexFromChild="indexFromChildReceived" :entry="entry"></component>
                        </template> 
                    </b-card-group>

                <b-card-group class="mb-3 " deck v-for="item in itemsAfter" v-bind:key="item.name">
                    <template>
                        <FilterCard v-on:flipFromChild="flipFromChildReceived" :item="item.name"></FilterCard>
                    </template> 
                </b-card-group>
                </div>
            </b-container>
        </div>

        <div class='right mr-2 pr-2 mt-5 pt-5'>
            <b-container fluid>
            <b-card-group class="mt-1 " deck v-for="entry in EntriesExpandedChildren" v-bind:key="entry.DowntimeCode">
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

                <b-card-group class="mt-1 " deck v-for="entry in EntryExpanded" v-bind:key="entry.DownTimeL3">
                    <template v-if="addingTo">
                        <AddToExisting v-on:addDataToSub="addDataToSubReceived" :entry="entry"></AddToExisting>
                    </template>
                </b-card-group>
            </b-container>
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
            ['Entries'],
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
                chosenADD: 'D',
                items: [{name: "Downtime Codes "}, {name: "Tool Change Codes"}],
                addingTo: false,
                wholeAddingTo: false,
                extendable: Boolean
            }
        },
        methods: {
            expandRow(entry) {
                if(this.expanded != null){
                    this.expanded = (this.expanded === entry) ? null : entry;
                }
                else{
                    this.expanded = entry;
                }
                
                console.log(this.expanded);
            },
            indexFromChildReceived(index) {
                console.log("index recieved!!!!!!")
                this.expandRow(index)
            },
            indexFromGrandchildReceived(index) {
                console.log("delete recieved!!!!!!")
                if(index===this.expanded)
                    this.expanded = null;

                this.$emit('entryFromChildDelete', index);
            },
            editIndexFromGrandchildReceived(index,data){
                console.log("edit received!!!!!!")
                this.$emit('editIndexFromChild', index, data);
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
                console.log("changing add to!!!!!")
                this.addingTo = !this.addingTo;
            },
            addDataToSubReceived(index,DTL3,DESC){
                console.log("up!!!")
                console.log(index)
                this.$emit('addDataToSubSending',index,DTL3,DESC);
            },
            bigAddFromChildReceived(item){
                console.log(item)
                this.wholeAddingTo = !this.wholeAddingTo;
                this.chosenADD = item;
            },
            dataSentFromChildReceived(TYP, DTL2, DTL3, FLTR, EXCL, DESC){
                console.log("parent recieved data!!!!!")
                this.$emit('dataSentFromGrandchild', TYP, DTL2, DTL3, FLTR, EXCL, DESC);
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
                if(this.chosenDTC!='N'){
                    if(this.chosenDTC === 'D'){
                        toExpand = this.DownTimeCodes.filter(entry => entry.DownTimeL3 === entry.DownTimeL4);
                    } else {
                        toExpand = this.ToolChanges.filter(entry => {
                            const sub = entry.DowntimeCode.substring(7);
                            if(sub === "00")
                                return true;
                        });
                    }
                    
                    toExpand.sort( (a,b) => a.DownTimeL3.localeCompare(b.DownTimeL3));
                    return toExpand;
                } else{ 
                    return null;
                }
            },
            SimilarEntriesBeforeSlice: function () {
                if(this.expanded != null){
                    const index = this.SimilarEntries.findIndex(entry => entry.DowntimeCode === this.expanded.DowntimeCode);
                    const toExpand = this.SimilarEntries.slice(0, index);
                    return toExpand;
                } else return this.SimilarEntries;
            },
            SimilarEntriesAfterSlice: function () {
                if(this.expanded != null){
                    const index = this.SimilarEntries.findIndex(entry => entry.DowntimeCode === this.expanded.DowntimeCode);
                    const toExpand = this.SimilarEntries.slice(index+1);
                    return toExpand;
                } else return null;
            },
            EntryExpanded: function() {
                console.log("entered")
                if(this.expanded != null){
                    const toExpand = this.SimilarEntries.filter(entry => entry.DowntimeCode === this.expanded.DowntimeCode);
                    console.log(toExpand);
                    return toExpand;
                } else return null;
            },
            EntriesExpandedChildren: function () {
                if(this.expanded != null){
                    var toExpand = {};
                    if(this.expanded.DowntimeCode.includes("TC"))
                        toExpand = (this.ToolChanges).filter(entry => (entry.DownTimeL3.includes( this.expanded.DownTimeL4))&&!(entry.DowntimeCode === this.expanded.DowntimeCode));
                    else toExpand = (this.DownTimeCodes).filter(entry => (entry.DownTimeL3.includes( this.expanded.DownTimeL3))&&!(entry.DowntimeCode === this.expanded.DowntimeCode));
                    toExpand.sort( (a,b) => a.DownTimeL4.localeCompare(b.DownTimeL4));
                    return toExpand;
                } else return null;
            },
            itemsBefore: function () {
                var ret = {};
                console.log("chosen: " + this.chosenDTC)
                if(this.chosenDTC === 'D'){
                    ret = this.items.filter(item => (item.name.includes("Down")));
                    console.log("the same")
                    console.log(this.items.length)
                }
                else{
                    ret = this.items;
                    console.log("nope")
                }
                console.log('items before: ' + ret.name)
                return ret;
            },
            itemsAfter: function () {
                var ret = {};
                if(this.chosenDTC === 'D')
                    ret = this.items.filter(item => (item.name.includes("Tool")));
                return ret;
            },
            checkExtended: function () {
                return this.expanded
            }
        }
    };

</script>

<style scoped>
    .wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: minmax(20px, auto);
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
