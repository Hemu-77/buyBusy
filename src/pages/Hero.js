import { useState, useEffect, useContext } from 'react';
import styles from './hero.module.css'
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../components/userContext';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const { user, setQuantity } = useContext(UserContext);
  const [price, setPrice] = useState(75000);
  const [products, setProducts] = useState([]); // Full list from API
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState({
    mensFashion: false,
    womensFashion: false,
    Jewelery: false,
    Electronics: false,
  });
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        // Normalize category names to match your filters
        const mapped = data.map(p => ({
          ...p,
          category: mapCategory(p.category),
          img: p.image,
          title: p.title,
          price: Math.floor(p.price * 83), // Convert to INR approx
        }));
        setProducts(mapped);
        setFilteredProducts(mapped);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  
  const mapCategory = (cat) => {
    switch (cat) {
      case "men's clothing":
        return "Men's Clothing";
      case "women's clothing":
        return "Women's Clothing";
      case "jewelery":
        return "Jewelery";
      case "electronics":
        return "Electronics";
      default:
        return cat;
    }
  };

  
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesPrice = product.price <= price;
      const matchesCategory =
        (categories.mensFashion && product.category === "Men's Clothing") ||
        (categories.womensFashion && product.category === "Women's Clothing") ||
        (categories.Jewelery && product.category === 'Jewelery') ||
        (categories.Electronics && product.category === 'Electronics') ||
        (!categories.mensFashion && !categories.womensFashion && !categories.Jewelery && !categories.Electronics);
      return matchesPrice && matchesCategory;
    });

    setFilteredProducts(filtered);
  }, [categories, price, products]);


  const onAddToCart = async (product) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      const q = query(collection(db, 'cartItems'), where('title', '==', product.title));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingProduct = querySnapshot.docs[0];
        const existingProductData = existingProduct.data();
        const newQuantity = existingProductData.quantity + 1;
        setQuantity(newQuantity);

        const productRef = doc(db, 'cartItems', existingProduct.id);
        await updateDoc(productRef, { quantity: newQuantity });
        console.log('Product quantity updated successfully!');
      } else {
        await addDoc(collection(db, 'cartItems'), {
          title: product.title,
          img: product.img,
          price: product.price,
          quantity: 1,
        });
        console.log('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };


  const handlePriceChange = (e) => setPrice(Number(e.target.value));
  const handleCategoryChange = (e) => {
    setCategories({ ...categories, [e.target.name]: e.target.checked });
  };

  return (
    <>
      {/* <form className={styles.fo}>
        <input placeholder="Search By Name" className={styles.form} />
      </form> */}
      <div>
        <aside className={styles.aside}>
          <h2 className={styles.filt}>Filter</h2>
          <form>
            <label htmlFor="price" className={styles.pri}>
              Price : {price}
            </label>
            <input
              className={styles.range}
              type="range"
              name="price"
              min="1"
              max="100000"
              step="10"
              value={price}
              onChange={handlePriceChange}
            />

            <p className={styles.cat}>Category</p>
            {["mensFashion", "womensFashion", "Jewelery", "Electronics"].map((key) => (
              <div key={key}>
                <input
                  type="checkbox"
                  name={key}
                  className={styles.box}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={key} className={styles.check}>
                  {key === "mensFashion"
                    ? "Men's Clothing"
                    : key === "womensFashion"
                    ? "Women's Clothing"
                    : key}
                </label>
              </div>
            ))}
          </form>
        </aside>
      </div>
      <div className={styles.outer}>
        {filteredProducts.map((data, index) => (
          <div className={styles.flew} key={index}>
            <div className={styles.pic}>
              <img src={data.img} alt={data.title} className={styles.picture} />
            </div>
            <p className={styles.naem}>{data.title}</p>
            <p className={styles.price}>&#x20b9; {data.price}</p>
            <button className={styles.btn} onClick={() => onAddToCart(data)}>
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
