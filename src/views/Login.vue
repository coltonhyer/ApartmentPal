<template>
    <div class="login">
        <v-container id="welcome" fluid>
            <div> Welcome to Apartment Pal! </div>
        </v-container>
        <v-container id="loginMessage" fluid>
            <div> Please login to use our parking services... </div>
        </v-container>
        <v-container id="loginContainer">
            <!-- <v-card class="pa-5"> -->
                <v-form ref="form" id="loginForm">
                    <v-text-field @blur="reset" @input="reset" @keyup.enter="submit" v-model="username" :rules=unRules label="Username" :prepend-icon="'mdi-account'" required></v-text-field>
                    <v-text-field @blur="reset" @input="reset" @keyup.enter="submit" v-model="password" :rules=pwRules label="Password" class="shrink" :prepend-icon="'mdi-lock'" :type="show1 ? 'text': 'password'" :append-icon="show1 ? 'mdi-eye': 'mdi-eye-off'" @click:append="show1=!show1" required></v-text-field>
                    <v-btn color="primary" @click="submit">Accept</v-btn>
                </v-form>
            <!-- </v-card> -->
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'
export default{
    name: 'Login',
    data: function() {
        return{
            show1:false,
            username:'',
            password:'',
            passwordValid: true,
            unRules:[
                v => !!v || 'Username is required',
                v => this.passwordValid 
            ],
            pwRules:[
                v => !!v || 'Password is required',
                v => this.passwordValid || 'Invalid username/password'
            ]
        } 
    },
    methods:{
        submit: async function(){
            this.$refs.form.resetValidation()
            await axios.post(`/logins`, {username:this.username, password:this.password}).then((res) =>{
                let user = res.data.user
                let role = res.data.role
                if (role==="resident"){
                    this.$root.$router.push('/resident')
                    this.$root.residentID = user._id
                }
                else if (role === "admin"){
                    this.$root.$router.push('/lookup')
                }
                this.passwordValid=true
                this.$refs.form.reset()
            }).catch(err =>{
                this.passwordValid = false
                this.$refs.form.validate()
                console.log(err.response)
            })
        },
        reset: function(){
            this.$refs.form.resetValidation()
        }
    }
}
</script>

<style>
    .login{
        height:100%;
        /*background-image: linear-gradient(#ADA8BE 60%, #7c7979);*/
    }

    #welcome{
        height: 30%;
        background-color: #4A5240;
        display:flex;
        margin:0;
        align-items: center;
        justify-content: center;
    }
    #welcome div{
        font-size:100px;
        font-family: sans-serif;
        color:#a28497;
    }

    #loginMessage{
        height:10%;
        display:flex;
        align-items:center;
        justify-content: center;
        background-color: #ADA8BE;
    }

    #loginMessage{
        font-size: 30px;
        font-family:sans-serif;
    }

    #loginContainer{
        display:flex;
        height:55%;
        align-items:center;
        justify-content:center;
    }

    #loginForm{
        display:flex;
        flex-direction:column;
        bottom:75px;
        justify-content:center;
        
    }
</style>
