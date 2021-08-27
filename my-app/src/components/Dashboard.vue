<template>
  <div class = "dashboard">
      <Header v-on:searchRequest="searchRequestFromGrandchild"
              v-on:userLogOn="logOnRequest" v-on:userLogOff="logOffRequest" 
              v-on:departmentSelect="departmentSelectReceived"
              v-on:wcSelected="wcSelectReceived"
              :WorkCentres="WorkCentres"
              :userStat="userStat" :Departments="Departments"/>
      <div class="toasted">        
        <b-toast class="ml-2" id="logStatus" :variant="toastVar" :title="toastName" static no-auto-hide>{{toastString}}</b-toast>
      </div>
      <Entry v-if="Entries.length > 0" v-on:entryFromChildDelete="entryFromChildDeleteReceived" 
              v-on:editIndexFromChild="editIndexFromChildReceived" 
              v-on:addDataToSubSending="addDataToSubReceived" 
              v-on:dataSentFromGrandchild="dataSentFromGrandchildReceived"
              v-on:resetSearch="resettingSearch" :WorkCentres="WorkCentres"
              ref="entryChild"
              :Entries="Entries" :searchingFor="searchingFor" :userStat="userStat"
              :Excludes="Excludes"/>
  </div>
</template>

<script>
import Header from './Header.vue'
import Entry from './Entry.vue'
import { getAllEntries } from '../services/EntryService'
import {deleteEntry} from '../services/EntryService'
import {editEntry} from '../services/EntryService'
import {addEntry} from '../services/EntryService'
import {addSubGroup} from '../services/EntryService'
import {userStatCheck} from '../services/EntryService'
import {userLogOn} from '../services/EntryService'
import {getDepartments} from '../services/EntryService'
import {postDepartment} from '../services/EntryService'
import {getWCs} from '../services/EntryService'
import {postWC} from '../services/EntryService'

export default {
  name: 'Dashboard',
  components: {
    Header,
    Entry
  },
  data() {
      return {
          Entries: [],
          numberOfEntries: 0,
          Departments: [],
          WorkCentres: [],
          Excludes: [],
          searchingFor: '',
          userStat: Boolean,
          toastString: '',
          toastVar: '',
          toastName: '',
          emailNotif: Boolean
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
    getDepartments(){
      getDepartments().then(response => {
        console.log(response)
        this.Departments = response;
      })
    },
    departmentSelectReceived(index){
      postDepartment(index).then( response => {
        console.log(response)
        getWCs().then(response => {
          console.log(response)
          this.WorkCentres = response;
          this.$refs["entryChild"].resetAll();
        })
      })
    },
    wcSelectReceived(index){
      postWC(index).then(response => {
        console.log(response)
        this.$refs["entryChild"].resetAll();
        this.getAllEntries();
      });
    },
    entryFromChildDeleteReceived(index, EMAIL) {
      deleteEntry(index, EMAIL).then(response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    editIndexFromChildReceived(index, data, EMAIL){
      editEntry(index, data, EMAIL).then (response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    addDataToSubReceived(index, DTL3, DESC, EMAIL){
      addEntry(index, DTL3, DESC, EMAIL).then (response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    dataSentFromGrandchildReceived(TYP, DTL2, DTL3, FLTR, EXCL, DESC, EMAIL){
      addSubGroup(TYP, DTL2, DTL3, FLTR, EXCL, DESC, EMAIL).then (response => {
        console.log(response)
        this.getAllEntries();
      })
    },
    searchRequestFromGrandchild(search){
      console.log("uwu")
      this.searchingFor = search;
      console.log(this.searchingFor);
      console.log(search);
    },
    resettingSearch() {
      this.searchingFor = ''
    },
    logOnRequest(pass) {
      userLogOn(pass).then (response => {
        console.log(response);
        if(response === "true"){
          this.toastName = "Success";
          this.toastString = "Logged on successfully";
          this.toastVar = "success";
          this.$bvToast.show('logStatus');
        } else {
          this.toastName = "Incorrect password";
          this.toastString = "Could not log on";
          this.toastVar = "danger";
          this.$bvToast.show('logStatus');
        }
        this.getUserStat();
      })
    },
    logOffRequest(){
      userLogOn('out').then(response => {
        console.log(response)
        if(response === "false"){
          this.toastName = "Success";
          this.toastString = "Logged off successfully";
          this.toastVar = "success";
          this.$bvToast.show('logStatus');
        } else {
          this.toastName = "Unexpected error";
          this.toastString = "Could not log off";
          this.toastVar = "danger";
          this.$bvToast.show('logStatus');
        }
        this.getUserStat();
      })
    },
    getUserStat(){
      userStatCheck().then(response => {
        console.log(response)
        this.userStat = (response === 'true');
      })
    }
  },
  mounted () {
    this.getAllEntries();
    this.getDepartments();
    this.getUserStat();
  }
}
</script>

<style >
  .toasted{
    background-color: #212529;
    padding-top: 5px;
    padding-right: 5px;
    min-width: 300px;
    position: absolute;
    right: 0;
  }
</style>
