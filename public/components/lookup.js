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
            this.$refs.form.validate()
            if (this.$refs.form.value){
                await axios.get(`/passes?plate=${this.licensePlate}`)
                .then(res =>{
                    this.$root.passInfo = res.data //change this to be an event
                }).catch(() =>{})
                this.$refs.form.reset()
                this.$root.$router.push('/results')
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
                <v-alert text outlined dense :type="!passInfo ? 'error' : expired ? 'warning' : 'success'" elevation=2>{{bannerMessage}}</v-alert>
                <v-card v-if="!!passInfo" v-model="ready" elevation=3>
                    <v-card-title> Pass Information </v-card-title>
                    <v-card-text v-for="(item, value) in carInfo">
                        <strong>{{value}}: </strong>{{item}}
                    </v-card-text>
                </v-card>
                <v-card class="mt-5" v-if="!!passInfo" v-model="ready" elevation=3>
                    <v-card-title> Resident Information </v-card-title>
                    <v-card-text v-for="(item, value) in residentInfo">
                        <strong>{{value}}: </strong>{{item}}
                    </v-card-text>
                </v-card>
            </v-container>
            <v-btn v-if="!passInfo || expired" bottom absolute right color="error">Print Ticket</v-btn>
        </div>
    `,
    data: function(){
        return{
            passInfo: null,
            ready:false,
            carInfo:{},
            residentInfo:{},
        }
    },
    computed: {
        expired: function(){
            if (this.passInfo){
                let today = new Date()
                let exp = new Date(this.passInfo.expiration)
                return exp < today
            }
            return false
        },
        bannerMessage: function(){
            if (this.passInfo){
                let passType = this.passInfo.passType[0].toUpperCase() + this.passInfo.passType.slice(1)
                if (this.expired){
                    return `Expired ${passType} Pass`
                }
                return `Valid ${passType} Pass`
            }
            return 'No Pass Found'
        }
    },
    mounted: async function(){
        this.passInfo = this.$root.passInfo
        if (this.passInfo){
            await axios.get(`/resident/${this.passInfo.residentID}`)
            .then(res =>{
                this.passInfo = {...res.data, ...this.passInfo}
                this._fillCard()
            })
        }
        this.$root.passInfo = null
    },

    methods: {
        _fillCard: function(){
            let date = new Date(Date.parse(this.passInfo.expiration))
            this.carInfo = {
                "License Plate Number": this.passInfo.plateNum,
                "Vehicle Color": this.passInfo.vehicleColor[0].toUpperCase() + this.passInfo.vehicleColor.slice(1),
                "Vehicle Make": this.passInfo.vehicleMake[0].toUpperCase() + this.passInfo.vehicleMake.slice(1),
                "Vehicle Model": this.passInfo.vehicleModel[0].toUpperCase() + this.passInfo.vehicleModel.slice(1),
                "Vehicle Year": this.passInfo.vehicleYear,
                "Expiration Date": `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`, 
            }
            this.residentInfo={
                "Name": `${this.passInfo.firstName} ${this.passInfo.lastName}`,
                "Apartment": this.passInfo.apartment,
                "Building Number": this.passInfo.building,
                "Email": this.passInfo.email,
                "Phone": this.passInfo.phone,
            }
            this.ready=true
        }
    }
})

//TODO: Maybe create a random fact card that displays when there isn't a pass
//TODO: add logic for print ticket button
//TODO: Pretty print the phone number
