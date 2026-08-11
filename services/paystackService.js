import axios from "axios";

const PAYSTACK_URL = "https://api.paystack.co";

// Initializes a one-off transaction (used by the "pay once" flow).
// amount is in Naira; Paystack expects kobo, so we multiply by 100.
export const initializePayment = async (email, amount, userId) => {
  const response = await axios.post(
    `${PAYSTACK_URL}/transaction/initialize`,
    {
      email,
      amount: amount * 100,
      metadata: {
        userId
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.data;
};
