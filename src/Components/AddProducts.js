import React,{useState} from 'react'
import {storage,fs} from '../Config/Config'

export const AddProducts = (user,userEmail) => {

    console.log(user.userEmail)
    const [title, setTitle]=useState('');
    const [description, setDescription]=useState('');
    const [price, setPrice]=useState('');
    const [image, setImage]=useState(null);
    const [imageError, setImageError]=useState('');
    
    const [successMsg, setSuccessMsg]=useState('');
    const [uploadError, setUploadError]=useState('');

    const types =['image/jpg','image/jpeg','image/png','image/PNG'];
    const handleProductImg=(e)=>{
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile&&types.includes(selectedFile.type)){
                setImage(selectedFile);
                setImageError('');
            }
            else{
                setImage(null);
                setImageError('Please select a valid image file type (png or jpg)')
            }
        }
        else{
            console.log('please select your file');
        }
    }
    
    const handleAddProducts = (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`product-images/Rs{image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },
          (error) => setUploadError(error.message),
          () => {
            storage
              .ref("product-images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                fs.collection("Products")
                  .add({
                    title: title,
                    seller: user.userEmail, // add the email of the seller to the 'seller' field
                    description: description,
                    price: Number(price),
                    url: url,
                  })
                  .then(() => {
                    setSuccessMsg("Product added successfully, Refresh to view latest Products");
                    setTitle("");
                    setDescription("");
                    setPrice("");
                    document.getElementById("file").value = "";
                    setImageError("");
                    setUploadError("");
                    setTimeout(() => {
                      setSuccessMsg("");
                    }, 3000);
                  })
                  .catch((error) => setUploadError(error.message));
              });
          }
        );
      
    
    }
  
    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Add Products</h1>
            <hr></hr>        
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>} 
            <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setTitle(e.target.value)} value={title}></input>
                <br></br>
                <label>Product Description</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setDescription(e.target.value)} value={description}></input>
                <br></br>
                <label>Product Price</label>
                <input type="number" className='form-control' required
                onChange={(e)=>setPrice(e.target.value)} value={price}></input>
                <br></br>
                <label>Upload Product Image</label>
                <input type="file" id="file" className='form-control' required
                onChange={handleProductImg}></input>
                
                {imageError&&<>
                    <br></br>
                    <div className='error-msg'>{imageError}</div>
                   
                </>}
                <br></br>           
                <div className='bottom' style={{display:'flex', justifyContent:'flex-end'}}>
                    <button type="submit" className='btn btn-warning btn-md'>
                        ADD
                    </button>
                </div>
            </form>
            {uploadError&&<>
                    <br></br>
                    <div className='error-msg'>{uploadError}</div>
                    
                </>}

        </div>
    )
}
