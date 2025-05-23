import styles from './signup.module.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";

export const SignUp = () => {
  const initialState = {
    userType: "", 
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  };
  
  
  const [formData, setFormData] = useState(initialState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const Navigate = useNavigate()

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
      setFormData(f => ({ ...f, state: "", city: "" })); // functional update
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      setCities(City.getCitiesOfState(formData.country, formData.state));
      setFormData(f => ({ ...f, city: "" })); // functional update
    }
  }, [formData.country, formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidPassword(formData.password)) {
      alert("Password must be at least 8 characters long and include at least one special character.");
      return;
    }
    // Basic password confirmation check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User signed up:", formData);
  
      setFormData({...initialState });
  
      Navigate('/signin');  //  Redirect after successful signup
    } catch (err) {
      console.error("Signup error:", err.message);
      alert(err.message);  //  Give user feedback
    }
  };
  

  return (
    <div className={styles.formContainer}>
      <h1>SIGN UP</h1>
      <form onSubmit={handleSubmit}>
      <label>User Type</label>
      <div style={{ marginBottom: "1rem" }}>
  <p style={{ marginBottom: "0.5rem", fontWeight: "bold", color:"black"}} className={styles.lbel}>
    Select User Type
  </p>

  <div style={{ display: "flex", gap: "1rem" }}>
    <label className={styles.lbl}>
      <input
        type="radio"
        name="userType"
        value="individual"
        checked={formData.userType === "individual"}
        onChange={handleChange}
        className={styles.int}
      />
      Individual
    </label>
    <label className={styles.lbl}>
      <input
        type="radio"
        name="userType"
        value="enterprise"
        checked={formData.userType === "enterprise"}
        onChange={handleChange}
        className={styles.int}
      />
      Enterprise
    </label>
    <label className={styles.lbl}>
      <input
        type="radio"
        name="userType"
        value="government"
        checked={formData.userType === "government"}
        onChange={handleChange}
        className={styles.int}
      />
      Government
    </label>
  </div>
</div>


      <label className={styles.lbel}>First Name</label>
      <input type="text" name="firstName" placeholder='First Name' onChange={handleChange} required className={styles.int}/>

      <label className={styles.lbel}>Last Name</label>
      <input type="text" name="lastName" placeholder='Last Name' onChange={handleChange} className={styles.int} required/>

      <label className={styles.lbel}>Email</label>
      <input type="email" name="email" placeholder='Email' onChange={handleChange} className={styles.int} required/>

      <label className={styles.lbel}>Address</label>
      <input type="text" name="address" placeholder='Address' onChange={handleChange} className={styles.int} required/>

      <label className={styles.lbel}>Country</label>
      <select name="country" value={formData.country} onChange={handleChange} className={styles.int} required>
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>

      <label className={styles.lbel}>State</label>
      <select name="state" value={formData.state} onChange={handleChange} className={styles.int}>
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>

      <label className={styles.lbel}>City</label>
      <select name="city" value={formData.city} onChange={handleChange} className={styles.int}>
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <label className={styles.lbel}>Pincode</label>
      <input type="Number" name="pincode" onChange={handleChange} className={styles.int} required/>

      <label className={styles.lbel}>Mobile</label>
      <input type="Number" name="mobile" onChange={handleChange} className={styles.int} required />

      <label className={styles.lbel}>Password</label>
      <input type="password" name="password" onChange={handleChange} className={styles.int} required/>

      <label className={styles.lbel}>Confirm Password</label>
      <input type="password" name="confirmPassword" onChange={handleChange} className={styles.int} required/>

      <button type="submit" className={styles.btn}>Sign Up</button>
    </form>

    </div>
  );
};
