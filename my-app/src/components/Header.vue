<template >
<div class="header">
    <b-navbar type="dark" variant="primary">
        <img src="../assets/logo_new.svg" width="110" height="40">
        <b-dropdown id="depDD" class="ml-2 dropdown" :text="depString" variant="success">
        <b-dropdown-item v-for="department in Departments" v-bind:key="department.Department" @click="depSelect(department.Department)">
                        {{department.Department}}<b-dropdown-divider></b-dropdown-divider></b-dropdown-item>
        </b-dropdown>
        <b-dropdown id="wcDD" class="ml-1 dropdown" :text="wcString" variant="success">
        <b-dropdown-item v-for="wc in changeWorkCentre" v-bind:key="wc.WCCode" @click="wcSelect(wc.WCCode)">{{wc.Description}}<b-dropdown-divider></b-dropdown-divider></b-dropdown-item>
        </b-dropdown>
            <b-nav-form class="ml-auto">
                <b-form-input class="mr-1" v-model="searchVal" placeholder="Search...">{{searchVal}}</b-form-input>
                <b-button class="mr-1" variant="success" @click="sendSearchRequest">🔎</b-button>
                <b-button variant="success" v-b-modal.signInModal>👤</b-button>
            </b-nav-form >
    </b-navbar>
    <b-modal id="signInModal" title="Sign In" centered class="modal" 
    header-bg-variant="dark" body-bg-variant="dark" footer-bg-variant="dark"
    header-border-variant="light" footer-border-variant="light" body-text-variant="light"
    header-text-variant="light" content-class="border-primary" @ok="logging">
        <b-container fluid>
            <b-row>
                <h5>You are currently logged in as {{retUserStat}}</h5>
            </b-row>
            <span v-if="retUserStat!='Admin'">
                <b-row>
                    <b-col class="pl-0 " md="2">
                        <label for="passInput" style="display:inline-block; vertical-align:middle;">Password: </label>
                    </b-col>
                    <b-col>
                        <b-form-input id="passInput" v-model="userPass" type="password">{{userPass}}</b-form-input>
                    </b-col>
                </b-row>
            </span>
            <span v-else>
                <b-row>
                    <h6> Do you want to log out? </h6>
                </b-row>
            </span>
        </b-container>
    </b-modal>
</div>
</template>

<script>
    export default ({
        props: ['userStat', 'Departments', 'WorkCentres'],
        name: 'Header',
        methods: {
            changeUpWorkCentres(){
                this.upWorkCentres = [];
                if(this.$props.WorkCentres != undefined){
                    console.log(this.$props.WorkCentres)
                    this.upWorkCentres.push({Description: 'ALL', WCCode: 'ALL'});
                    this.$props.WorkCentres.forEach(element => {
                        this.upWorkCentres.push({Description: element.Description, WCCode: element.WCCode});
                    });
                }
            },
            depSelect(index) {
                this.selectedDepartment = index;
                console.log("department selected!!!!!");
                this.$emit("departmentSelect", index);
                this.wcSelect("ALL");
            },
            wcSelect(index){
                this.selectedWC = index;
                console.log("work centre selected!!!!");
                this.$emit("wcSelected", index);
            },
            sendSearchRequest() {
                console.log("searching!!!!!")
                this.$emit('searchRequest', this.searchVal);
            },
            logging() {
                if(!this.$props.userStat){
                    console.log("logging on!!!!!")
                    this.userPass = this.hashString(this.userPass);
                    console.log(this.userPass)
                    this.$emit('userLogOn', this.userPass);
                    this.userPass = '';
                } else {
                    console.log("logging off!!!!!")
                    this.$emit('userLogOff');
                }
            },
            hashString(s) {
                /******https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0 *******/
                var h = 0, l = s.length, i = 0;
                if ( l > 0 )
                    while (i < l)
                    h = (h << 5) - h + s.charCodeAt(i++) | 0;
                return h;
            }
        },
        data () {
            return {
                searchVal:'',
                userPass: '',
                upWorkCentres: [],
                selectedDepartment: '',
                selectedWC: ''
            }
        },
        computed: {
            retUserStat: function () {
                if(this.$props.userStat)
                    return 'Admin';
                else return 'Guest';
            },
            depString: function () {
                if(this.selectedDepartment === '')
                    return "Department"
                else
                    return this.selectedDepartment
            },
            wcString: function () {
                if(this.selectedWC === '')
                    return 'Work Centres'
                else return this.selectedWC
            },
            changeWorkCentre: function () {
                this.changeUpWorkCentres();
                console.log(this.upWorkCentres)
                return this.upWorkCentres;
            }
        }
    });
</script>

