import React from 'react'
import { IndividualSellerProduct } from './IndividualSellerProducts'

  
export const SellerProducts = ({products}) => {
    return products.map((individualProduct, index) => (
      individualProduct && <IndividualSellerProduct key={individualProduct.id || index} individualProduct={individualProduct} />
    ));
  }
  
  