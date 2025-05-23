import styles from './order.module.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';
export const Order = () => {

    const [order, setOrder] =  useState([])

    useEffect(() => {
        const fetchCartItems = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'orderItems'));
            const items = []
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({ id: doc.id, ...data }); // Store document id and data
               
              });

              setOrder(items)
            
            }catch(error) {
            console.error('Error fetching cart items: ', error);
          }
        };

        fetchCartItems()
},[])    
    return(
        <div>
            <h1 className={styles.head}>Your Orders</h1>
            <h4 className={styles.date}>Ordered on :- {new Date().toLocaleDateString()}</h4>

            <table className={styles.table}>
               <thead>
               <tr className={styles.row}>
                    <th >Title</th>
                    <th >Price</th>
                    <th >Quantity</th>
                    <th >Total Price</th>
                </tr>
               </thead>
                <tr></tr>
               <tbody>
  {order.map((data, index) => (
    <tr key={index}>
      <td className={styles.dat}>{data.title}</td>
      <td className={styles.dat}>{data.price}</td>
      <td className={styles.dat}>{data.quantity}</td>
      <td className={styles.dat}>{data.price * data.quantity}</td>
    </tr>
  ))}
  <tr>
    <td colSpan="3" className={styles.datih}>Grand Total</td>
    <td className={styles.dat}>
      {order.reduce((acc, current) => acc + current.price * current.quantity, 0)}
    </td>
  </tr>
</tbody>
                
            </table>
        </div>
    )
}