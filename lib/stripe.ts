import {
  createCheckoutSession,
  getStripePayments,
} from "@stripe/firestore-stripe-payments";
import { getFunctions, httpsCallable } from "@firebase/functions";
import app from "../firebase";

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});

const loadCheckout = async (priceId: string) => {
  await createCheckoutSession(payments, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  })
    .then((snapshot) => window.location.assign(snapshot.url))
    .catch((error) => console.log(error.message));
};

// 前置作業 - 參考下列文件完成 stripe 上的設定
// Firebase > Extensions > Run Payments with Stripe > Configure the Stripe customer portal (only used for subscriptions)
const goToBillingPortal = async () => {
  const instance = getFunctions(app, "us-central1");
  // see the Redirect to the customer portal example
  // Firebase > Extensions > Run Payments with Stripe > Redirect to the customer portal
  const functionRef = httpsCallable(
    instance,
    "ext-firestore-stripe-payments-createPortalLink"
  );

  await functionRef({ returnUrl: `${window.location.origin}/account` })
    .then(({ data }: any) => window.location.assign(data.url))
    .catch((error) => console.log(error.message));
};

export { loadCheckout,goToBillingPortal };
export default payments;
