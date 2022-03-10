const Lookup = Vue.component('lookup', {
    template:`
        <div class="attendantLookup">
            <v-container class="adminBanner" fluid>
                <div> Attendant Hub </div>
            </v-container>
            <v-container id="lookupField">
                <v-form ref="form" id="lookupForm" v-model="valid">
                    <v-text-field outlined :rules="licenseRules" style="min-width:80%;" label="License Plate Number" :prepend-icon="'mdi-car-side'" v-model="licensePlate"></v-text-field>
                    <v-btn color="primary" @click="submit">Search</v-btn>
                </v-form>
            </v-container>
        </div>
    `

    ,
    data: function(){
        return{
            licensePlate:'',
            valid: true,
            licenseRules: [
                v => !!v || 'License Plate Number is required',
            ]
        }
    },
    methods:{
        submit: async function(){
            let passInfo
            this.$refs.form.validate()
            if (this.$refs.form.value){
                await axios.get(`/passes?plate=${this.licensePlate}`)
                .then(res =>{
                    passInfo = res.data
                }).catch(() =>{})
                this.$refs.form.reset()
                this.$root.$router.push({path:'/results', params:{passInfo}})
            }
        }
    }
})

const Results = Vue.component('results', {
    //v-alert has many types, I'll use the base type for now, but adding dense and/or outlined is a solid choice
    template:`
        <div class="results">
            <v-container class="adminBanner" fluid>
                <div> Attendant Hub </div>
            </v-container>
            <v-container id="resultsField">
                <v-alert text outlined dense type="warning" elevation=2>Expired Pass</v-alert>
                <v-card elevation=3>
                    <v-card-title> Colton's Card </v-card-title>
                    <v-card-text><strong>Name:</strong> Colton</v-card-text>
                    <v-card-text><strong>License Plate:</strong> ABC123</v-card-text>
                    <v-card-text><strong>Date of Birth:</strong> 01/01/2000</v-card-text>
                    <v-card-text><strong>Address:</strong> 123 Fake St</v-card-text>
                    <v-card-text><strong>City:</strong> Fakeville</v-card-text>
                    <v-card-text><strong>State:</strong> Fake</v-card-text>
                    <v-card-text><strong>Zip Code:</strong> 12345</v-card-text> 
                </v-card>
            </v-container>
            <v-btn bottom absolute right color="error">Print Ticket</v-btn>
        </div>
    `
})

