# Razorpay live checkout setup

The checkout creates Razorpay orders through the separate `payment-api` service. The Key Secret stays on that server. The server fetches each product price from the existing product API, then calculates shipping, 5% tax, and the supported default coupon before creating the Razorpay order. The browser compares that trusted quote to the total shown at checkout and stops if they differ. An order is marked paid only after the server verifies Razorpay's signature and confirms the payment is captured for the same amount.

## Local configuration

1. In the project root `.env`, set `VITE_RAZORPAY_API_URL=http://localhost:5001`.
2. In `payment-api`, copy `.env.example` to `.env`, then set a newly generated live key pair. Keep the other example values unless the product API or shipping settings differ.
3. Start the payment API from `payment-api` with `npm install` then `npm start`; run the frontend separately with `npm run dev`.

## Production configuration

Deploy `payment-api` as a separate Render web service using its folder as the root directory. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as Render secret environment variables, and set `CLIENT_URL` to the exact public website origin. Confirm `PRODUCT_API_URL` is the live product catalogue API and shipping environment values match the website's current shipping policy. The frontend has a production fallback to the deployed payment API; set `VITE_RAZORPAY_API_URL` only if the service URL changes.

Use a newly generated live key pair after revoking the pair shared in chat. Never put the Key Secret in a `VITE_` variable or frontend code. The payment service rejects non-live key IDs.

The payment API uses the three built-in default coupons (`HOMECARE10`, `WELLNESS20`, and `FLAT150`). If the admin changes coupon rules in the browser-managed coupon list, update server coupon rules before advertising those changes. Razorpay activation/KYC and a newly rotated live key pair are required before live transactions can be accepted.
