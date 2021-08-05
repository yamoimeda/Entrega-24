import React, { Component } from 'react';
import { HashRouter, Route, Switch,Redirect, BrowserRouter } from 'react-router-dom';
import './scss/style.scss';
import fire from './firebase';
import ProtectedRoute from './Protected';
import AuthProvider,{ AuthContext } from "./Auth";


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));

// Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

class App extends Component {
  static contextType = AuthContext
  constructor(props) {
    super(props);
    this.state = {
      isUserAuthenticated: true,
      isAuth: null
    };
    
}


componentDidMount(){


  /** 
  fire.auth().onAuthStateChanged(user =>{
    
    if (user){
      console.log('sip')
      sessionStorage.setItem('token', JSON.stringify(user.refreshToken));
      sessionStorage.setItem('uid', JSON.stringify(user.uid));
      //this.props.history.push("/dash");
    
    } else {
      sessionStorage.removeItem("token");
    }
  })
  */
}  


getToken =  ()=> {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  
  if (userToken === null || userToken === undefined){
    
    return false
    
  }
  return userToken
  
}



  

  render() {
   
    const token = this.getToken();
   
    return (
  
      <HashRouter>
        <React.Suspense fallback={loading}>
        <AuthProvider>
          
            <Switch>
            
            <Route exact path="/login" name="Register Page" render={props => <Login {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <ProtectedRoute path="/dash" name="Home" render={props => <TheLayout {...props}/>} >
                  <TheLayout />
              </ProtectedRoute>
              <Route exact path="/" >
                  <Redirect to="/dash" />  
              </Route > 
            </Switch>
          
          </AuthProvider>
          </React.Suspense>
      </HashRouter>
      
    );
  }
}

export default App;


