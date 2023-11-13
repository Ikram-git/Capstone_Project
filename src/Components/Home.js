import React,{useState, useEffect} from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import {auth,fs} from '../Config/Config'
import Slider from './Slider';
import { Helmet } from 'react-helmet';



export const Home = (props) => {

    // getting current user uid
    function GetUserUid(){
        const [uid, setUid]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    setUid(user.uid);
                }
            })
        },[])
        return uid;
    }

    const uid = GetUserUid();

    // getting current user function
    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(snapshot=>{
                        if (snapshot.exists && snapshot.data().FullName) {
                            setUser(snapshot.data().FullName);
                        } else {
                            // Handle the case when the snapshot does not exist or FullName does not exist
                        }
                    })
                }
                else{
                    setUser(null);
                }
            })
        },[])
        return user;
    }

    const user = GetCurrentUser();
    // console.log(user);
    
    // state of products
    const [products, setProducts]=useState([]);

    // getting products function
    const getProducts = async ()=>{
        const products = await fs.collection('Products').get();
        const productsArray = [];
        for (var snap of products.docs){
            var data = snap.data();
            data.ID = snap.id;
            productsArray.push({
                ...data
            })
            if(productsArray.length === products.docs.length){
                setProducts(productsArray);
            }
        }
    }

    useEffect(()=>{
        getProducts();
    },[])

    // state of totalProducts
    const [totalProducts, setTotalProducts]=useState(0);
    // getting cart products   
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user=>{
          if(user){
            fs.collection('Cart' + user.uid).onSnapshot(snapshot => {
              const qty = snapshot.docs.length;
              setTotalProducts(qty);
            })
          }
        });
        return () => {
          unsubscribe();
        };
      }, [])

    // globl variable
    let Product;

    // add to cart
    const addToCart = (product)=>{
        if(uid!==null){
            // console.log(product);
            Product=product;
            Product['qty']=1;
            Product['TotalProductPrice']=Product.qty*Product.price;
            fs.collection('Cart' + uid).doc(product.ID).set(Product).then(()=>{
                console.log('successfully added to cart');
            })

        }
        else{
            props.history.push('/login');
        }
        
    }
    
    
    return (
        <>
         <Helmet>
        <title>Food Blocks</title>
      </Helmet>
          <Navbar user={user} totalProducts={totalProducts}/>
          <Slider />
          <br></br>
          {products.length > 0 && (
            <div className='container-fluid'>
              <h1 className='text-center'>Products</h1>
              <div className='products-box'>
                <Products products={products} addToCart={addToCart}/>
              </div>
            </div>
          )}
          {products.length < 1 && (
            <div className='container-fluid'>Please wait....</div>
          )}
          <span class="inline-block align-text-bottom ...">
            <footer class="bg-light text-center text-lg-start">
              <div class="text-center p-3" style={{backgroundColor:"black", color: "white"}}>
                © 2023 Copyright:
                <a class="text-light" href="https://www.linkedin.com/in/ikram-sattar-4b6a54206/"> Ikram.com</a>
              </div>
            </footer>
          </span>
        </>
      );
    };