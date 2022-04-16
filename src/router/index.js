import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Lookup from '../views/Lookup.vue'
import Results from '../views/Results.vue'
import Passes from '../views/Passes.vue'
import PassForm from '../views/PassForm.vue'


Vue.use(VueRouter)

const routes = [
  {path: '/', component: Login},
  {path: '/lookup', component: Lookup},
  {path: '/results', component: Results},
  {path:'/resident', component: Passes},
  {path:'/register', component: PassForm},
  {path:'/renew', component: PassForm}
]

const router = new VueRouter({
  routes
})

export default router
