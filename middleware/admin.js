import { account, db, Query } from "../appwrite.js"
export default function ({ store, route, redirect }) {
    // Validator
     
        account.get().then(userData => { 
          store.dispatch('auth/onAuthStateChangedAction', {...userData}).then(() => { 
            
            if (store.state.auth.user && store.state.auth.user.role != 'admin' && route.path !== '/orders'){ 
              return redirect('/orders')
            }
  
          })
        }).catch(err => {
            store.commit('auth/SET_UserInfo', null)
            return redirect('/orders')
      
        }) 
      
}     
     
      