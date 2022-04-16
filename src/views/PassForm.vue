<template>
    <div class="passForm">
        <v-app-bar app color="#6f5e5c">
            <v-app-bar-nav-icon @click="goToHome"><v-icon large color="#c6caed">mdi-home</v-icon></v-app-bar-nav-icon>
            <v-layout justify-center>
                <v-toolbar-title  class="text-h3 pa-1" style="color:#c6caed"> Pass Registration</v-toolbar-title>
            </v-layout>
        </v-app-bar>
        <v-layout fill-height>
            <v-content>
                <v-container>
                    <v-form ref="form">
                        <v-text-field :rules="passRules" v-model="pass.make" label="Make"></v-text-field>
                        <v-text-field :rules="passRules" v-model="pass.model" label="Model"></v-text-field>
                        <v-text-field :rules="passRules" v-model="pass.color" label="Color"></v-text-field>
                        <v-text-field type="number" :rules="yearRules" v-model="pass.year" label="Year"></v-text-field>
                        <v-text-field :rules="passRules" v-model="pass.licensePlate" label="License Plate"></v-text-field>
                        <v-select :rules="passRules" v-model="pass.expiration" label="Duration" :items=visitorExp v-if="passType == 'visitor'"></v-select>
                        <v-btn color="success" @click="submit">Submit</v-btn>
                    </v-form>
                </v-container>  
            </v-content>
        </v-layout>
    </div>
</template>

<script>
export default {
    data: function(){
        return{
            visitorExp: [
                {text: "1 day", value: 1},
                {text: "2 days", value: 2},
                {text: "3 days", value: 3},
            ],
            passRules:[
                v => !!v || 'Field Required'
            ],
            yearRules:[
                v => !!v || 'Field Required',
                v => {
                    let currYear = new Date().getFullYear();
                    return v <= currYear +1 || 'Please enter a valid year'
                }
            ],
            passType:null,
            pass:{}
        }
    },
    mounted: function(){
        this.passType = this.$root.passInfo.type
    },
    methods:{
        submit: async function(){
            this.$refs.form.validate()
            if(!this.$refs.form.valid) return
            if (this.pass.expiration){
                let date = new Date()
                this.pass.expiration = date.setDate(date.getDate() + this.pass.expiration)
            }
            else{
                let newExp = new Date(`${new Date().getFullYear()}/07/31`)
                if (this.findExpiration(newExp)){
                    newExp.setFullYear(newExp.getFullYear() + 1)
                }
                this.pass.expiration = newExp
            }
            if (this.$root.$route.path ==="/renew"){
                await axios.put(`/passes/resident/${this.$root.residentID}`, this.cleanPass(this.pass))
                .then(() => this.$root.$router.push('/resident'))
                .catch(err => console.error(err))
            }else{
                await axios.post(`/passes`, this.cleanPass(this.pass))
                .then(() => this.$root.$router.push('/resident'))
                .catch(err => console.error(err))
            }
        },
        cleanPass: function(pass){
            return{
                plateNum: pass.licensePlate,
                passType: this.passType,
                expiration: pass.expiration,
                vehicleMake: pass.make[0].toUpperCase() + pass.make.slice(1).toLowerCase(),
                vehicleModel: pass.model[0].toUpperCase() + pass.model.slice(1).toLowerCase(),
                vehicleColor: pass.color[0].toUpperCase() + pass.color.slice(1).toLowerCase(),
                vehicleYear: pass.year,
                residentID: this.$root.residentID
            }
        },
        findExpiration: function(exp){
            let today = new Date()
            let expDate = new Date(exp)
            expDate.setDate(expDate.getDate()-21)
            return today > expDate
        },
        goToHome: function(){
            this.$refs.form.reset()
            this.$root.$router.push('/resident')
        }
    }
}
</script>