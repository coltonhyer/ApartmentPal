const Login = Vue.component('login', {
    template: `
        <div class="login">
            <v-container id="welcome" fluid>
                <div> Welcome to Apartment Pal! </div>
            </v-container>
            <v-container id="loginMessage" fluid>
                <div> Please login to continue. </div>
            </v-container>
            <form id="loginForm">
                <input></input>
                <input></input>
            </form>
        </div>
    `
})