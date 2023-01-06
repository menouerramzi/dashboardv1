
import { account, db, Query } from "../appwrite.js"
export default function ({ store, route, redirect }) {
    // Not Authentication
    if (!store.state.auth.user) {
    account.get().then(userData => { 
      store.dispatch('auth/onAuthStateChangedAction', {...userData}).then(() => { 
          if (store.state.auth.user && route.path !== '/') {
            return redirect('/')
          }
        })
      }).catch(err => {
        store.commit('auth/SET_UserInfo', null)
        return redirect('/login')
      })  
    } else{
      if (store.state.auth.user && route.path !== '/') {
        return redirect('/')
      } 
    }   
      
      
  }