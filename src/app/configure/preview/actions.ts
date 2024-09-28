'use server'

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { db } from '@/db'
// import { stripe } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Order, ProductType, ShirtSize } from '@prisma/client'

export const createCheckoutSession = async ({
  formData,
}: {
  formData: {
    productType: ProductType
    uploadedImage: string
    resultImage: string
    size: ShirtSize
    color: string
    amount: number,
    userName: string,
    userEmail: string,
    userPhone: string,
    userAddress: string
  }
})=> {
  try {
    console.log('Function started');
    
    // Step 1: Fetch the logged-in user
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error('You need to be logged in')
  }else {
    console.log('User fetched successfully:', user);
  }

  
   // Step 2: Create a new configuration in the database
   const configuration = await db.configuration.create({
    data: {
      productType: formData.productType, // Assuming formData.productType matches your enum (e.g., shirt, cup, etc.)
      uploadedImage: formData.uploadedImage,
      resultImage: formData.resultImage,
      size: formData.size as any, // Assuming size is one of your ShirtSize enums
      color: formData.color as any, // Assuming color is one of your ProductColor enums
      amount: formData.amount,
      
    },
  })



  // Step 3: Calculate the price (adjust as needed based on configuration)
  let price = configuration.productType === "shirt"
  ? 30_00
  : configuration.productType === "cup"
  ? 15_00
  : 20_00
    price += 7_00

    // Step 4: Create a new order linked to the configuration
  const order = await db.order.create({
    data: {
      configurationId: configuration.id,
      userId: user.id,
      amount: price / 100, // Convert price from cents to dollars
      isPaid: false, // This will be updated once payment is confirmed
      status: 'awaiting_shipment',
      shippingAddress: formData.userAddress, 
    },
  })



  return { success: true, orderId: order.id  };
  } catch (error)  {
    console.log(formData.size)
    console.error("Error in createCheckoutSession:", error);
    return { success: false };
  }


}
// const product = await stripe.products.create({
//   name: 'Custom iPhone Case',
//   images: [configuration.imageUrl],
//   default_price_data: {
//     currency: 'USD',
//     unit_amount: price,
//   },
// })

// const stripeSession = await stripe.checkout.sessions.create({
//   success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
//   cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
//   payment_method_types: ['card', 'paypal'],
//   mode: 'payment',
//   shipping_address_collection: { allowed_countries: ['DE', 'US'] },
//   metadata: {
//     userId: user.id,
//     orderId: order.id,
//   },
//   line_items: [{ price: product.default_price as string, quantity: 1 }],
// })

// return { url: stripeSession.url }