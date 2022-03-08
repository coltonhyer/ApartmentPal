const Login = Vue.component('login', {
    template: `
        <div class="login">
            <v-container id="welcome" fluid>
                <div> Welcome to Apartment Pal! </div>
            </v-container>
            <v-container id="loginMessage" fluid>
                <div> Please login to continue. </div>
            </v-container>
            <v-container id="loginContainer">
                <v-form ref="form" id="loginForm">
                    <v-text-field v-model="username" label="Username" :prepend-icon="'mdi-account'"></v-text-field>
                    <v-text-field v-model="password" label="Password" class="shrink" :prepend-icon="'mdi-lock'" :type="show1 ? 'text': 'password'" ></v-text-field>
                    <v-btn color="primary" @click="submit">Accept</v-btn>
                </v-form>
            </v-container>
        </div>
    `,
    data: function(){
        return{
            show1:false,
            username:'',
            password:''
        }
    },

    methods:{
        submit: function(){
            console.log(`User logging in with the following information\nUsername: ${this.username}\nPassword:${this.password}`)
           //this.$refs.form.$children[1].error = true
            this.$root.$router.push('/lookup')
        }
    }
})

/*
add these to the password field later:
:append-icon="show1 ? 'mdi-eye': 'mdi-eye-off'" 
@click:append="show1=!show1"
*/