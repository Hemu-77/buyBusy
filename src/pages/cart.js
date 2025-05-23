import { useState, useEffect } from 'react';
import styles from './cart.module.css';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { updateDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();



useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'cartItems'), (snapshot) => {
    const items = [];
    let price = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      items.push({ id: doc.id, ...data });
      price += Number(data.price * data.quantity);
    });

    setCartItems(items);
    setTotalPrice(price);
  });

  return () => unsubscribe(); // Clean up on unmount
}, []);




  const incrementQuantity = async (item) => {
    const newQuantity = item.quantity + 1;
  const itemRef = doc(db, 'cartItems', item.id);
  await updateDoc(itemRef, { quantity: newQuantity });

  
   
  }

  const decrementQuantity = async (item) => {
    const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
    const itemRef = doc(db, 'cartItems', item.id);
    await updateDoc(itemRef, { quantity: newQuantity });
    navigate('/cart');
  }
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cartItems'));
        const items = [];
        let price = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({ id: doc.id, ...data }); // Store document id and data
          price += Number(data.price * data.quantity);
        });

        setCartItems(items);
        setTotalPrice(price);
      } catch (error) {
        console.error('Error fetching cart items: ', error);
      }
    };

    fetchCartItems();
  }, []);

  const goToHome = () => {
    navigate('/')
  }

  const deleteFromCart = async (id, price) => {
    try {
      // Log the type and value of ID to make sure it's correct
      console.log('Deleting item with ID:', id, typeof id); 
  
      await deleteDoc(doc(db, 'cartItems', id)); // Ensure ID is passed as a string
      
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setTotalPrice((prevTotal) => prevTotal - price);

      navigate('/cart')
  
      console.log('Item deleted successfully'); // Log deletion success
    } catch (error) {
      console.error('Error deleting item: ', error); // Log any error encountered
    }
  };
  ;

  const onOrder = async () => {
    try {
      // Loop through each item in cartItems and add it to the 'orderItems' collection
      for (const product of cartItems) {
        await addDoc(collection(db, 'orderItems'), {
          title: product.title,
          price: product.price ,
          quantity: product.quantity,
          date : new Date()
        });
      }
      console.log('Order placed successfully!');
  
      // Clear the cart once the order is complete
      for (const product of cartItems) {
        await deleteDoc(doc(db, 'cartItems', product.id));
      }
      setCartItems([]); // Clear local state for cart items
      setTotalPrice(0); // Reset total price in the state
  
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err.message);
    }
  };
  

  return (
    <>
     
     
      <aside className={styles.aside}>
        <p className={styles.pie}>Total Price: &#x20b9; {totalPrice}</p>
        
        <button className={styles.btn1} onClick={onOrder}>Purchase</button>
      </aside>
      <div className={styles.outer}>
      {cartItems.length > 0 ? (
          cartItems.map((data, index) => (
      
       <div className={styles.flew} key={index}>
              <div className={styles.pic}>
                <img
                  src={data.img}
                  alt={data.title}
                  className={styles.picture}
                />
              </div>
              <p className={styles.naem}>{data.title}</p>
              <p className={styles.price}>&#x20b9; {data.price}</p>
              <button onClick={() => decrementQuantity(data)}>-</button>
              <p>{data.quantity}</p>
              <button onClick={() => incrementQuantity(data)}>+</button>
              <button
                className={styles.btn}
                onClick={() => deleteFromCart(data.id, data.price)}
              >
                Remove from cart
              </button>
              
            </div>
         
       
    ))
)  : (
        <>
        <h2 className={styles.h2}>Oops! No Item in Cart</h2>
        <button className={styles.btun} onClick={goToHome}>Add Items here</button>
        </>
      )

    }
    </div>
    </>
  );

};
