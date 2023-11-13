import React,{useState, useEffect} from 'react'
import { SellerNavbar } from './SellerNavbar'
import {auth,fs} from '../Config/Config'
import { Link } from 'react-router-dom'
import { SellerProducts } from './SellerProducts'
import { AddProducts } from './AddProducts'
 
export const SellerMain = () => {
    const [user, setUser]=useState(null);
    const [userEmail, setUserEmail]=useState(null);
    const [products, setProducts]=useState([]);
    const productsVar = fs.collection('Products').get();
    const productsArray = [];
    const getProducts = async (user)=>{

        const productsVar = await fs.collection('Products').get();
        var arraydata = []

       productsVar.docs.map((data1,index)=>{
            // arraydata[index]["id"]= data1?.id;
            console.log(data1?.data().seller,userEmail)
            if(data1?.data().seller === userEmail ){
                arraydata[index]= data1?.data();
                console.log("data1 :",data1?.data())

            }
            // console.log("data1 :",data1?.data())

        })
    //    console.log("userEmail:",userEmail)
       setProducts(arraydata)


        }
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){ 
                    fs.collection('Sellers').doc(user.uid).get().then(snapshot=>{
                        setUser(snapshot.data().FullName);
                        setUserEmail(snapshot.data().Email)
                    })
    
                    // getProducts()
                    // console.log("products:",products)
    
                }
                else{
                    setUser(null);
                    setUserEmail(null);
                }
            })
            

        },[])
    
        useEffect(()=>{
            getProducts()
    
        },[userEmail])


    return (
        <>
            <SellerNavbar user={user}/>           
            <br></br>
            
            {products.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Your Products</h1>
                    <div className='products-box'>
                        <SellerProducts products={products}/>
                    </div>
                </div>
            )} 
            {products.length < 1 && (
                <div className='container-fluid'>Please wait....</div>
                
            )}

            <AddProducts user={user} userEmail ={userEmail}>
            </AddProducts>
            <span class="inline-block align-text-bottom ...">

<footer class="bg-light text-center text-lg-start">

  <div class="text-center p-3" style={{backgroundColor:"black", color: "white"}}>
          © 2023 Copyright:
    <a class="text-light"  href="https://www.linkedin.com/in/ikram-sattar-4b6a54206/"> Ikram.com</a>
             </div>

</footer>
</span>
        </>
    )
}