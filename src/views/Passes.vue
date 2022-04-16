<template>
    <div id="passHome" style="height:100%;">
        <v-app-bar app color="#6f5e5c">
            <v-app-bar-nav-icon @click="selectedItem=0"><v-icon large color="#c6caed">mdi-home</v-icon></v-app-bar-nav-icon>
            <v-layout justify-center>
                <v-toolbar-title class="text-h3" style="color:#c6caed"> Resident Hub </v-toolbar-title>
            </v-layout>
        </v-app-bar>
        <v-layout fill-height wrap>
            <v-navigation-drawer color="#4a5240" dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Passes
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            For {{name.first}} {{name.last}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list nav>
                    <v-list-item-group v-model="selectedItem">
                        <v-list-item link>
                            <v-list-item-content>
                                <v-list-item-title>Resident</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item link>
                            <v-list-item-content>
                                <v-list-item-title>Guest</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-navigation-drawer>
            <v-container v-if=!activePass>
                <v-card>
                    <v-card-title class="text-h3">No Pass Found</v-card-title>
                    <v-card-actions>
                        <v-btn icon @click="registerPass" color="success">
                            <v-icon large>mdi-plus-circle</v-icon>
                        </v-btn>
                        <div class="text-h6">Add Pass</div>
                    </v-card-actions>
                </v-card>
            </v-container>
            <v-container v-else id="passHomeField">
                <v-alert text outlined dense :type="expiration ? 'warning' : 'error'" v-if="expiration">Your pass expiration is almost up, please renew if you are planning on parking past the listed expiration date</v-alert>
                <v-banner class="text-h5">
                    Pass Information
                </v-banner>
                    <v-card>
                        <v-card-text v-for="(item, value) in activePass" :key="item">
                            <strong>{{value}}: </strong>{{item}}
                        </v-card-text>
                    </v-card>
            </v-container>
        </v-layout>
        <v-footer fixed dark height="50%">
            <v-layout v-if=activePass justify-end>
                <v-dialog v-model=deleteDialog width="28%">
                    <template v-slot:activator="{ on }">
                        <v-btn color="error" v-on="on">Delete</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="text-h3">Delete Pass</v-card-title>
                        <v-card-text class="text-h6"> Are you sure you want to delete this pass? </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="secondary" @click="deleteDialog = false">Cancel</v-btn>
                            <v-btn color="error" @click="deletePass">Delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog width="50%" v-if=expiration v-model=renewDialog>
                    <template v-slot:activator="{ on }">
                        <div class="ml-1">
                            <v-btn color="success" v-on="on" > Renew </v-btn>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title class="text-h3">Pass Renewal</v-card-title>
                        <v-card-text class="text-h5">Thank you for renewing your parking pass with Apartment Pal!</v-card-text>
                        <v-card-text>Would you like to register your pass with a new vehicle or keep the same vehicle information from your previous pass?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="success" @click="goToForm"> Register a new vehicle </v-btn>
                            <v-btn color="primary" @click="renewPass"> Keep current vehicle info </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-footer>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data: function(){
        return{
            selectedItem:0,
            expiration: null,
            residentPass: null,
            visitorPass: null,
            activePass: null,
            renewDialog: false,
            deleteDialog: false,
            name:null
        }
    },
    watch:{
        selectedItem: function(val){
            if (val){
                this.activePass = this.buildPass(this.visitorPass)
            }
            else{
                this.activePass = this.buildPass(this.residentPass)
                this.expiration = this.findExpiration()
            }
        }
    },
    mounted: function(){
        this.getResidentPass()
        this.getVisitorPass()
        this.getResidentName()
    },
    methods:{
        renewPass: async function(){
            this.renewDialog=false
            let newExp = new Date()
            newExp.setFullYear(newExp.getFullYear() + 1)
            newExp.setDate(31)
            newExp.setMonth(6)
            await axios.put(`/passes/resident/${this.$root.residentID}`, {expiration: newExp}).then(res => console.log(res)).catch(err => console.error(err))
            this.residentPass = await axios.get(`/passes/resident/${this.$root.residentID}`).then(res => res.data).catch(err => console.error(err))
            this.activePass = this.buildPass(this.residentPass) 
        },
        goToForm: function(){
            this.renewDialog=false
            this.$root.passInfo = {type: "resident"}
            this.$root.$router.push('/renew')
        },
        registerPass:function(){
            this.$root.passInfo = {type: this.selectedItem ? "visitor" :"resident"}
            this.$root.$router.push('/register')
        },
        buildPass: function(pass){
            if (pass){
                let date = new Date(Date.parse(pass.expiration))
                return {
                    "Make": pass.vehicleMake,
                    "Model": pass.vehicleModel,
                    "Color": pass.vehicleColor[0].toUpperCase() + pass.vehicleColor.slice(1),
                    "Year" : pass.vehicleYear,
                    "License Plate" : pass.plateNum,
                    "Expiration Date" : `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
                }
            }
            return null
        },
        findExpiration: function(){
            if (this.residentPass){
                let today = new Date()
                let exp = new Date(this.residentPass.expiration)
                exp.setDate(exp.getDate() -21)
                return today > exp
            }
            return false
        },
        deletePass : async function(){
            this.deleteDialog=false
            await axios.delete(`/passes/${this.selectedItem ? 'visitor' : 'resident'}/${this.$root.residentID}`)
            .then(res => console.log(res))
            .catch(err => console.error(err))
            this.activePass = null
            this.selectedItem ? this.visitorPass=null : this.residentPass=null
        },
        getResidentPass: async function(){
            await axios.get(`/passes/resident/${this.$root.residentID}`)
            .then(res =>{
                this.residentPass = res.data
                this.activePass = this.buildPass(this.residentPass)
                this.expiration = this.findExpiration()
            }).catch()
        }, 
        getVisitorPass: async function(){
            await axios.get(`/passes/visitor/${this.$root.residentID}`)
            .then(res =>{
                this.visitorPass = res.data   
            }).catch()
        },
        getResidentName: async function(){
            await axios.get(`/resident/${this.$root.residentID}`)
                .then(res =>{
                    this.name = {
                        first: res.data.firstName,
                        last: res.data.lastName
                    }
                })
        }
    }

}
</script>