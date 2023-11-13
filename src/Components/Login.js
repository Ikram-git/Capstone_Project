import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { auth, fs } from '../Config/Config';
import { CartProducts } from './CartProducts';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import nodemailer from 'nodemailer';

export const Cart = () => {
 
  const history = useHistory();

  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection('users')
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data().FullName);
            });
        } else {
          setUser(null);
        }
      });

      return () => {
        unsubscribe();
      };
    }, []);

    return user;
  }

  const user = GetCurrentUser();

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);
  const [ItemsList, setItemsList] = useState([]);

  // getting cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart' + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
          let temp = [];
          for (let i = 0; i < newCartProduct.length; i++) {
            temp.push(newCartProduct[i].title);
          }
          setItemsList(temp);
        });
      } else {
        console.log('user is not signed in to retrieve cart');
      }
    });
  }, []);

  // getting the qty from cartProducts in a separate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // getting the TotalProductPrice from cartProducts in a separate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value
  const reducerOfPrice = (accumulator, currentValue) => accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);

  // global variable
  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart' + user.uid)
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => {
            console.log('increment added');
          });
      } else {
        console.log('user is not logged in to increment');
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection('Cart' + user.uid)
            .doc(cartProduct.ID)
            .update(Product)
            .then(() => {
              console.log('decrement');
            });
        } else {
          console.log('user is not logged in to decrement');
        }
      });
    }
  };

  const [successMsg, setSuccessMsg] = useState('');

  //Ethersjs Section
  console.log(ItemsList);

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart' + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);

  const handlePlaceOrder = () => {
    // send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sattarikram81@gmail.com',
        pass: 'Pakvssl2019',
      },
    });

    // ... code to place the order ...

    const mailOptions = {
      from: 'sattarikram81@gmail.com',
      to: 'youremail@gmail.com, ali.hasnainmovia@gmail.com', // replace with your own email address
      subject: 'sattarikram81@gmail.com',
      html: `
        <p>Hi, a new order has been placed with the following details:</p>
        <ul>
          <li>Customer name: ${user}</li>
          <li>Number of products: ${totalQty}</li>
          <li>Total price: Rs ${totalPrice}</li>
        </ul>
      `
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="cart">
        <div className="cart-products">
          {cartProducts.map((cartProduct) => {
            return (
              <CartProducts
                cartProduct={cartProduct}
                cartProductIncrease={cartProductIncrease}
                cartProductDecrease={cartProductDecrease}
                key={cartProduct.ID}
              />
            );
          })}
        </div>
        <div className="cart-summary">
          <h3>Cart Summary</h3>
          <div className="total-items">
            <div className="items">Total Items</div>
            <div className="items-count">{totalQty}</div>
          </div>
          <div className="total-price-section">
            <div className="total-price">Total Price</div>
            <div className="total-price-count">Rs {totalPrice}</div>
          </div>
          <div className="stripe-section">
            <button
              className={`btn btn-primary ${
                totalProducts > 0 ? '' : 'disabled'
              }`}
              onClick={() => {
                handlePlaceOrder();
                history.push('/Checkout');
              }}
            >
              Place Order
            </button>
          </div>
          {successMsg && <div className="success-msg">{successMsg}</div>}
        </div>
      </div>
    </div>
  );
};