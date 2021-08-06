<template>
  <div class="hello">
    <Header />
    <div class="container ml-5 mt-3 pl-5" >
          <div class="row">
            <div class="col">
                <DisplayBoard :numberOfEntries="numberOfEntries" @getAllEntries="getAllEntries()" />
            </div>
          </div>
    </div>
    <div class="row mrgnbtm">
        <Entry v-if="Entries.length > 0" v-on:entryFromChildDelete="entryFromChildDeleteReceived" 
               v-on:editIndexFromChild="editIndexFromChildReceived" 
               v-on:addDataToSubSending="addDataToSubReceived" 
               v-on:dataSentFromGrandchild="dataSentFromGrandchildReceived"
               :Entries="Entries"/>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import DisplayBoard from './DisplayBoard.vue'
import Entry from './Entry.vue'
import { getAllEntries } from '../services/EntryService'
import {deleteEntry} from '../services/EntryService'
import {editEntry} from '../services/EntryService'
import {addEntry} from '../services/EntryService'
import {addSubGroup} from '../services/EntryService'

export default {
  name: 'Dashboard',
  components: {
    Header,
    DisplayBoard,
    Entry,
   // SmallCard,
    //BigCard
  },
  data() {
      return {
          Entries: [],
          numberOfEntries: 0
      }
  },
  methods: {
    getAllEntries() {
      getAllEntries().then(response => {
        console.log(response)
        this.Entries = response
        this.numberOfEntries = this.Entries.length
      })
    },
    entryFromChildDeleteReceived(index) {
      deleteEntry(index).then(response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    editIndexFromChildReceived(index, data){
      editEntry(index, data).then (response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    addDataToSubReceived(index, DTL3, DESC){
      addEntry(index, DTL3, DESC).then (response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    dataSentFromGrandchildReceived(TYP, DTL2, DTL3, FLTR, EXCL, DESC){
      addSubGroup(TYP, DTL2, DTL3, FLTR, EXCL, DESC).then (response => {
        console.log(response)
        this.getAllEntries();
      })
    }
  },
  mounted () {
    this.getAllEntries();
  }
}
</script>