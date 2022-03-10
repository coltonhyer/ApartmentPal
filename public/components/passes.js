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
            <v-container v-if=selectedItem>
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
            <v-container v-if=!selectedItem id="passHomeField">
                <v-banner class="text-h5">
                    Pass Information
                </v-banner>
                    <v-card>
                        <v-card-text>Make: Hyundai</v-card-text>
                        <v-card-text>Model: Elantra</v-card-text>
                        <v-card-text>Color: Black</v-card-text>
                        <v-card-text>License Plate: ABC123</v-card-text>
                        <v-card-text>Expiration Date: 01/01/2020</v-card-text>
                    </v-card>
            </v-container>
        </v-layout>
        <v-footer fixed dark height="50%">
            <div id="btnHolder" style="position:absolute; right:5px;">
                <v-btn color="error">Delete</v-btn>
                <v-btn v-if=!selectedItem color="success" @click="renewPass"> Renew </v-btn>
            </div>
        </v-footer>
    </div>
    `,
    data: function(){
        return{
            selectedItem:0
        }
    },
    methods:{
        renewPass: function(){
            this.$root.$router.push('/renew')
        },
        registerPass:function(){
            this.$root.$router.push('/register')
        }
    }
})