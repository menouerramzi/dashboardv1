
export default function ({ store, route, redirect }) {
    // Validator
     
      if (store.state.auth.user && store.state.auth.user.role == 'user' && route.path !== '/orders') {
  
        return redirect('/orders')
      
      }   
      
  }