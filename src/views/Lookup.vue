<template>
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
</template>

<script>
import axios from 'axios'
export default{
    data: () =>({
        licensePlate:'',
        valid: true,
        licenseRules: [
            v => !!v || 'License Plate Number is required',
        ]
    }),
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
}
</script>

<style>
    .adminBanner{
    height:10%;
    background-color: #6f5e5c;
    display: flex;
    align-items: center;
    justify-content: center;
    }

    .adminBanner div{
        font-size:50px;
        font-family:sans-serif;
        color: #c6caed;
    }

    .attendantLookup{
    height:100%;
    }

    #lookupField{
        display:flex;
        height:90%;
        justify-content: center;
        align-items: center;
    }

    #lookupForm{
        display:flex;
        flex-direction:column;
        align-items:center;
        width: 100%;
    }
</style>
