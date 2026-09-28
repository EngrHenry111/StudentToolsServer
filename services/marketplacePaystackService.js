import axios from "axios";

// Deliberately separate from services/paystackService.js — that file
// handles StudentTools Pro's recurring-plan subscriptions. This one
// handles one-time marketplace purchases with subaccount splits, a
// fundamentally different Paystack API surface (subaccounts, not plans).
// Do not merge these.
//
// 🔒 Uses its OWN secret key — PAYSTACK_MARKETPLACE_SECRET_KEY, never
// PAYSTACK_SECRET_KEY (that one belongs to Pro subscriptions). This lets
// the marketplace run against a completely independent Paystack
// key/account (test now, live later) with zero risk to Pro payments.
const PAYSTACK_URL = "https://api.paystack.co";

const paystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_MARKETPLACE_SECRET_KEY}`,
  "Content-Type": "application/json"
});

// https://api.paystack.co/bank/resolve — confirmed against Paystack's own
// docs (PaystackHQ/documentation, other-features/user-verification.md).
// Free to call. Throws with Paystack's own message on an invalid account
// so the controller can surface a clear error without creating anything.
export const resolveAccountNumber = async (accountNumber, bankCode) => {
  const response = await axios.get(`${PAYSTACK_URL}/bank/resolve`, {
    params: { account_number: accountNumber, bank_code: bankCode },
    headers: paystackHeaders()
  });

  return response.data.data; // { account_number, account_name, bank_id }
};

// https://api.paystack.co/bank — list of Nigerian banks + their codes,
// for the onboarding form's bank dropdown.
export const listBanks = async () => {
  const response = await axios.get(`${PAYSTACK_URL}/bank`, {
    params: { country: "nigeria", currency: "NGN" },
    headers: paystackHeaders()
  });

  return response.data.data; // [{ name, code, ... }]
};

// https://api.paystack.co/subaccount
//
// percentage_charge is confirmed (verbatim, from Paystack's own official
// docs repo) to be the MAIN/platform account's share, not the
// subaccount's: "Payments are split on Paystack by percentage i.e. 20%
// going to main account and the rest going to subaccount." So
// commissionRate maps straight through — no inversion.
export const createSubaccount = async ({ businessName, bankCode, accountNumber, accountName, commissionRate }) => {
  const response = await axios.post(
    `${PAYSTACK_URL}/subaccount`,
    {
      business_name: businessName,
      settlement_bank: bankCode,
      account_number: accountNumber,
      percentage_charge: commissionRate,
      primary_contact_name: accountName
    },
    { headers: paystackHeaders() }
  );

  return response.data.data; // { subaccount_code, account_name, ... }
};

// https://api.paystack.co/transaction/initialize with a `subaccount`
// param — the split itself is governed by that subaccount's
// percentage_charge fixed at creation time; we don't override it per
// transaction (no transaction_charge / bearer overrides), so a
// publisher's agreed commission rate can never silently drift.
export const initializeMarketplaceTransaction = async ({ email, amountKobo, subaccountCode, reference, callbackUrl, metadata }) => {
  const response = await axios.post(
    `${PAYSTACK_URL}/transaction/initialize`,
    {
      email,
      amount: amountKobo,
      subaccount: subaccountCode,
      reference,
      // Paystack redirects here after payment, appending ?reference=...
      callback_url: callbackUrl,
      metadata
    },
    { headers: paystackHeaders() }
  );

  return response.data.data; // { authorization_url, access_code, reference }
};

// https://api.paystack.co/transaction/verify/:reference — used as a
// defensive double-check alongside the webhook (never trust the webhook
// alone for anything the webhook itself can't cryptographically prove
// beyond the signature — verifying server-side against Paystack directly
// closes the loop).
export const verifyMarketplaceTransaction = async (reference) => {
  const response = await axios.get(
    `${PAYSTACK_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: paystackHeaders() }
  );

  return response.data.data;
};
