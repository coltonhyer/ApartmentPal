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
            <v-dialog width=280 v-if="!passInfo || expired" v-model="showTicket">
                <template v-slot:activator="{ on }">
                    <v-btn bottom absolute right color="error" @click="printTicket" v-on="on">Print Ticket</v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h4 justify-center">Apartment Pal</v-card-title>
                    <v-card-subtitle class="text-center">Parking Violation Ticket</v-card-subtitle>
                    <v-card-text class="text-caption font-weight-bold"><v-row>{{ticket.date}}<v-spacer></v-spacer>{{ticket.time}}</v-row></v-card-text>
                    <v-card-text></v-card-text>
                    <v-card-text><v-row>{{ticket.message}}<v-spacer></v-spacer>{{ticket.fine}}</v-row></v-card-text>
                    <v-card-text></v-card-text>
                    <v-card-text><v-row>&emsp;&emsp;Subtotal<v-spacer></v-spacer>{{ticket.fine}}</v-row></v-card-text>
                    <v-card-text><v-row>&emsp;&emsp;Tax<v-spacer></v-spacer>{{ticket.tax}}</v-row></v-card-text>
                    <v-card-text><v-row>&emsp;&emsp;Total<v-spacer></v-spacer>{{ticket.total}}</v-row></v-card-text>
                    <v-card-text></v-card-text>
                    <v-divider class="mx-8"></v-divider>
                    <v-card-text class="text-center">You can pay your fine by visiting the leasing office during regular hours:</v-card-text>
                    <v-card-text class="text-caption text--disabled">
                        <v-row class="justify-center">Monday-Thurs: 8:00 AM - 5:00 PM</v-row>
                        <v-row class="justify-center">Friday: 9:00 AM - 4:00 PM</v-row>
                        <v-row class="justify-center">Saturday: 10:00AM - 2:00PM</v-row>
                        <v-row class="justify-center">Sunday: Closed</v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="showTicket=false">Print</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    `,
    data: function(){
        return{
            passInfo: null,
            ready:false,
            carInfo:{},
            residentInfo:{},
            showTicket:false,
            ticket: {
                messsage:null,
                date:null,
                time: null,
                fine:null,
                tax:null,
                total:null
            }
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
                "Phone": this.passInfo.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
            }
            this.ready=true
        },
        printTicket: function(){
            let message, fine
            let date = new Date()
            let formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            })
            if (!this.passInfo){
                message = "No Parking Pass"
                fine = 45
            }else if (this.expired){
                message = "Expired Parking Pass"
                fine = 25
            }
            this.ticket = {
                message,
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString(),
                fine: formatter.format(fine),
                tax: formatter.format(fine*0.08),
                total: formatter.format(fine*1.08)
        }
        },
    }
})

//TODO: Maybe create a random fact card that displays when there isn't a pass
//TODO: add logic for print ticket button
//TODO: Pretty print the phone number
