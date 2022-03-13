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

