const PassHome = Vue.component('pass-home', {
    template:
    `
    <div id="passHome" style="height:100%;">
        <v-app-bar app color="#6f5e5c">
            <v-app-bar-nav-icon><v-icon large color="#c6caed">mdi-home</v-icon></v-app-bar-nav-icon>
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
                            For Colton Hyer
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
                <v-banner class="text-h5">
                    Pass Information
                </v-banner>
                    <v-card>
                        <v-card-text v-for="(item, value) in activePass">
                            <strong>{{value}}: </strong>{{item}}
                        </v-card-text>
                    </v-card>
            </v-container>
        </v-layout>
        <v-footer fixed dark height="50%">
            <v-layout v-if=activePass justify-end>
                <v-btn color="error">Delete</v-btn>
                <v-tooltip v-if=!selectedItem top>
                    <template v-slot:activator="{ on }">
                        <div class="ml-1" v-on="on">
                            <v-btn :disabled=!expiration color="success" @click="renewPass"> Renew </v-btn>
                        </div>
                    </template>
                    <span>You can renew your pass starting 3 weeks before the expiration date</span>
                </v-tooltip>
            </v-layout>
        </v-footer>
    </div>
    `,
    data: function(){
        return{
            selectedItem:0,
            residentPass: null,
            visitorPass: null
        }
    },
    mounted: async function(){
        await axios.get(`/passes/resident/${this.$root.residentID}`)
        .then(res =>{
            this.residentPass = res.data
        }).catch()

        await axios.get(`/passes/visitor/${this.$root.residentID}`)
        .then(res =>{
            this.visitorPass = res.data   
        }).catch()
    },
    computed:{
        activePass: function(){
            return this.selectedItem ? this.buildPass(this.visitorPass) : this.buildPass(this.residentPass)
        },
        expiration: function(){
            if(this.residentPass){
                let today = new Date()
                let exp = new Date(this.residentPass.expiration)
                exp.setDate(exp.getDate() -21)
                return today > exp
            }
            return false
        }
    },
    methods:{
        renewPass: function(){
            this.$root.$router.push('/renew')
        },
        registerPass:function(){
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
                    "Expiration Date" : `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
                }
            }
            return null
        }
    }
})