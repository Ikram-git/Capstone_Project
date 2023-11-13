import React,{useState, useEffect} from 'react'
import {Navbar} from './Navbar'
import {auth,fs} from '../Config/Config'
import { CartProducts } from './CartProducts';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

const Cart = ({ user, totalProducts }) => {
    const history = useHistory();
    const [successMsg, setSuccessMsg] = useState('');
    const [cartProducts, setCartProducts] = useState([]);
    const [totalQty, setTotalQty] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
  
    // Fetch the cart products
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection('Cart' + user.uid).onSnapshot((snapshot) => {
            const products = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCartProducts(products);
            calculateCartTotal(products);
          });
        }
      });
    }, []);
  
    // Calculate the total quantity and price of the cart
    const calculateCartTotal = (products) => {
      let qty = 0;
      let price = 0;
      products.forEach((product) => {
        qty += product.qty;
        price += product.qty * product.price;
      });
      setTotalQty(qty);
      setTotalPrice(price);
    };
  
    // Redirect to personal details form
    const redirectToPersonalDetails = () => {
      history.push('/personal-details');
    };
  
    return (
      <>
        <Navbar user={user} totalProducts={totalProducts} />
        <br />
        {successMsg && (
          <>
            <div className='success-msg'>{successMsg}</div>
            <br />
          </>
        )}
        {cartProducts.length > 0 ? (
          <div className='container-fluid'>
            <h1 className='text-center'>Cart</h1>
            <div className='products-box'>
              <CartProducts
                cartProducts={cartProducts}
                cartProductIncrease={cartProductIncrease}
                cartProductDecrease={cartProductDecrease}
              />
            </div>
            <div className='summary-box'>
              <h5>Cart Summary</h5>
              <br />
              <div>
                Total No of Products: <span>{totalQty}</span>
              </div>
              <div>
                Total Price to Pay: <span>$ {totalPrice}</span>
              </div>
              <br />
              <button
                type='button'
                className='btn btn-primary'
            
              >
                Proceed to Personal Details
              </button>
            </div>
          </div>
        ) : (
          <div className='container-fluid'>No products to show</div>
        )}
      </>
    );
  };