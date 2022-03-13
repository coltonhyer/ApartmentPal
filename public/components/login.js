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
                    <v-text-field @blur="reset" @input="reset" v-model="username" :rules="unRules" label="Username" :prepend-icon="'mdi-account'" required></v-text-field>
                    <v-text-field @blur="reset" @input="reset" v-model="password" :rules="pwRules" label="Password" class="shrink" :prepend-icon="'mdi-lock'" :type="show1 ? 'text': 'password'" :append-icon="show1 ? 'mdi-eye': 'mdi-eye-off'" @click:append="show1=!show1" required></v-text-field>
                    <v-btn color="primary" @click="submit">Accept</v-btn>
                </v-form>
            </v-container>
        </div>
    `,
    data: function(){
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
            await axios.get(`/logins?username=${this.username}&password=${this.password}`).then((res) =>{
                let user = res.data.user
                let role = res.data.role
                if (role==="resident"){
                    this.$root.$router.push('/resident')
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
           //this.$refs.form.$children[1].error = true
            //this.$root.$router.push('/lookup')
        },
        reset: function(){
            this.$refs.form.resetValidation()
        }
    }
})

/*
add these to the password field later:
:append-icon="show1 ? 'mdi-eye': 'mdi-eye-off'" 
@click:append="show1=!show1"
*/