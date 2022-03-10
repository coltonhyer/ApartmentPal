const Form = Vue.component('pass-form',{
    template:
    `
    <div class="passForm">
        <v-app-bar app color="#6f5e5c">
            <v-app-bar-nav-icon><v-icon large color="#c6caed">mdi-home</v-icon></v-app-bar-nav-icon>
            <v-layout justify-center>
                <v-toolbar-title class="text-h3" style="color:#c6caed"> Pass {{type}} </v-toolbar-title>
            </v-layout>
        </v-app-bar>
        <v-layout fill-height>
            <v-content>
                <v-container>
                    <v-form ref="form">
                        <v-text-field v-model="pass.make" label="Make" required></v-text-field>
                        <v-text-field v-model="pass.model" label="Model" required></v-text-field>
                        <v-text-field v-model="pass.color" label="Color" required></v-text-field>
                        <v-text-field v-model="pass.year" label="Year" required></v-text-field>
                        <v-text-field v-model="pass.licensePlate" label="License Plate" required></v-text-field>
                        <v-select v-model="pass.expiration" label="Duration" :items=visitorExp v-if="pass.type == 'visitor'" required></v-select>
                        <v-btn color="success" @click="submit">Submit</v-btn>
                    </v-form>
                </v-container>  
            </v-content>
        </v-layout>
    </div>
    `, 
    data: function(){
        return{
            type:'Renewal',
            visitorExp: [
                {text: "1 day", value: 1},
                {text: "2 days", value: 2},
                {text: "3 days", value: 3},
            ],
            pass:{
                type:'visitor'
            }
        }
    },
    created: function(){
        console.log(this.$root.$route)
        if (this.$root.$route.path == "/renew"){
            this.pass = {
                make:"Hyundai",
                model:"Elantra",
                color:"Black",
                year:"2012",
                licensePlate:"abc123",
                type:"resident"
            }
        }
    }
})
