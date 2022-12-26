
import { account, db, Query } from "../appwrite.js"
export default function ({ store, route, redirect }) {
  // Authentication
  if (!store.state.auth.user && route.path !== '/login'){ 

    account.get().then(userData => { 
      store.dispatch('auth/onAuthStateChangedAction', {...userData}).then(() => { 
        
        if (!store.state.auth.user  && route.path !== '/login'){ 
          return redirect('/login')
        }
        
        
      })
      }).catch(err => {
        store.commit('auth/SET_UserInfo', null)
        return redirect('/login')
  
      }) 
  }
    
}