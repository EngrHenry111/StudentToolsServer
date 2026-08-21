import axios from "axios";

const PAYSTACK_URL = "https://api.paystack.co";

// Explicitly requests every channel Paystack supports for Nigerian NGN
// transactions, so customers can pay however they actually bank —
// including fintech/neobank apps like OPay, PalmPay, and Kuda, which
// show up under the "bank" / "bank_transfer" channels rather than
// needing any separate integration. Without this, Paystack falls back
// to whatever the account's default channel set happens to be, which
// may not include everything.
export const NGN_PAYMENT_CHANNELS = [
  "card",
  "bank",
  "bank_transfer",
  "ussd",
  "qr",
  "mobile_money"
];

// Initializes a one-off transaction (used by the "pay once" flow).
// amount is in Naira; Paystack expects kobo, so we multiply by 100.
export const initializePayment = async (email, amount, userId) => {
  const response = await axios.post(
    `${PAYSTACK_URL}/transaction/initialize`,
    {
      email,
      amount: amount * 100,
      channels: NGN_PAYMENT_CHANNELS,
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
