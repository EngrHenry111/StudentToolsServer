import axios from "axios";


const PAYSTACK_URL = "https://api.paystack.co";

export const createPlan = async () => {
  const response = await axios.post(
    `${PAYSTACK_URL}/plan`,
    {
      name: "StudentTools Monthly",
      interval: "monthly",
      amount: 500000 // ₦5000 (kobo)
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    }
  );

  return response.data.data;
};


// const PAYSTACK_URL = "https://api.paystack.co";

// export const initializePayment = async (email, amount, userId) => {
//   const response = await axios.post(
//     `${PAYSTACK_URL}/transaction/initialize`,
//     {
//       email,
//       amount: amount * 100, // Paystack uses kobo
//       metadata: {
//         userId
//       }
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   return response.data.data;
// };


