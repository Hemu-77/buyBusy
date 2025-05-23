import { useNavigate, NavLink } from 'react-router-dom'
// import styles from './login.module.css'
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import {  useContext,useState } from 'react';
import styles from './signup.module.css';

import { UserContext } from '../components/userContext';


export const SignIn = () => {

    // const auth = getAuth();
    const {setUser} = useContext(UserContext);

    const[email, setEmail] = useState('');
    const[password,setPassword] = useState('');
    const[error, setError] = useState(null);

   
    const Navigate = useNavigate()
   
    const signIn = async(e) => {
        e.preventDefault()
    try{
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        console.log('User Signed in Successfully!');
        console.log('User ID:', user.uid);
        Navigate('/');
        setUser(true);
        // console.log();
        

    }catch(err){
        setError(err.message)
        Navigate('/')
    }
    }
     return(
        <div className={styles.formContainer}>
  <h1>SIGN IN</h1>
  <form onSubmit={signIn}>
    <label className={styles.lbl}>Email</label>
    <input type="email" placeholder='Email' name="email" onChange={(e) => setEmail(e.target.value)} required className={styles.int}/>

    <label className={styles.lbl}>Password</label>
    <input type="password" placeholder='Password' name="password" onChange={(e) => setPassword(e.target.value)} required className={styles.int}/>

    {error && <p style={{ color: 'red' }}>{error}</p>}

    <button type="submit" className={styles.btn}>Sign In</button>

    <div className={styles.linkRow}>
      <NavLink className={styles.link} to="/signup">Or SignUp instead</NavLink>
      <NavLink className={styles.link} to="/reset">Reset Password</NavLink>
    </div>
  </form>
</div>

       

    )
}