const Lookup = Vue.component('lookup', {
    template:`
        <div class="attendantLookup">
            <v-container class="adminBanner" fluid>
                <div> Attendant Hub </div>
            </v-container>
            <v-container id="lookupField">
                <v-form ref="form" id="lookupForm">
                    <v-text-field outlined style="min-width:80%;" label="License Plate Number" :prepend-icon="'mdi-car-side'" v-model="licensePlate"></v-text-field>
                    <v-btn color="primary" @click="submit">Search</v-btn>
                </v-form>
            </v-container>
        </div>
    `

    ,
    methods:{
        submit: function(){
            this.$root.$router.push('/results')
        }
    }
})

