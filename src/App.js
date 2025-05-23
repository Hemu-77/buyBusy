import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { UserContext, UserProvider } from "./components/userContext";
import {Navbar} from "./components/navbar";
import { MainPage } from "./pages/Hero";
import { SignIn } from "./pages/signin";
import { SignUp } from "./pages/signUp";
import { Cart } from "./pages/cart";
import { Order } from "./pages/order";
import { useContext } from "react";
import { NotFound } from "./pages/notfound";
import { ResetPassword } from "./pages/resetpassword";

// const {user} = useContext(UserContext)

const PrivateRoute = ({ children }) => {
  const {user} = useContext(UserContext)
  if (!user) return <Navigate to="/signin"
replace={true} />;
  return children;
};


const router = createBrowserRouter([
  {
    path : '/',
    element: <Navbar/>,
    errorElement: <NotFound/>,
    children : [
      {
        index : true,
        element : <MainPage/>
      },
      {
        path : '/signin',
        element : <SignIn/>
      },
      {
        path : '/signup',
        element : <SignUp/>
      },
      {
        path : '/reset',
        element: <ResetPassword/>
      },{
        path : '/cart',
        element : 
        <PrivateRoute>
          <Cart/>
        </PrivateRoute>
      },{
        path : '/order',
        element : 
         <PrivateRoute>
          <Order/>
        </PrivateRoute>
      }

    ]
  }
])

function App() {
  return(
     <UserProvider>
      <RouterProvider router={router} />
      </UserProvider>
  )
}

export default App;
