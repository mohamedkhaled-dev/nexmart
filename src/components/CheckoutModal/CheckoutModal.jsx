import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCheckout } from "../../hooks/useCheckout";
import { showToast } from "../../utils/toastConfig";
import { UserContext } from "../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useFormik } from "formik";

export default function CheckoutModal() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setShowCheckout } = useCheckout();
  const { userToken } = useContext(UserContext);
  const { cartId, setCartCount } = useContext(CartContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const queryClient = useQueryClient();

  // reset states when modal opens or returns from payment
  useEffect(() => {
    setIsProcessing(false);
    setSelectedPayment(null);
    formik.resetForm();
  }, [cartId, userToken, setShowCheckout]);

  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
    },
    onSubmit: (values) => {
      selectedPayment === "cash"
        ? createCashOrder(values)
        : createOnlineOrder(values);
    },
  });

  // Cash Order Mutation
  const { mutate: createCashOrder } = useMutation({
    mutationFn: (values) =>
      axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          shippingAddress: values,
        },
        { headers: { token: userToken } }
      ),

    onMutate: () => {
      setIsProcessing(true);
    },

    // reset states when modal opens or returns from payment
    onSuccess: () => {
      showToast.success("Order placed successfully");
      setTimeout(() => {
        setCartCount(0);
        queryClient.invalidateQueries(["cart"]);
        setShowCheckout(false);
      }, 1000);
    },

    // reset states when modal opens or returns from payment
    onError: (error) => {
      showToast.error("Failed to place order");
    },

    // reset states when modal opens or returns from payment
    onSettled: () => {
      setIsProcessing(false);
      formik.resetForm();
      setSelectedPayment(null);
    },
  });

  // Online Payment Mutation
  const { mutate: createOnlineOrder } = useMutation({
    mutationFn: (values) =>
      axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`,
        {
          shippingAddress: values,
        },
        { headers: { token: userToken } }
      ),

    onMutate: () => {
      setIsProcessing(true);
    },

    // reset states when modal opens or returns from payment
    onSuccess: (data) => {
      showToast.success("Redirecting to payment...");
      setTimeout(() => {
        location.href = data.data.session.url;
      }, 1000);
    },

    // reset states when modal opens or returns from payment
    onError: (error) => {
      showToast.error("Failed to create payment session");
    },

    // reset states when modal opens or returns from payment
    onSettled: () => {
      setIsProcessing(false);
      formik.resetForm();
      setSelectedPayment(null);
    },
  });

  return (
    <>
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => !isProcessing && setShowCheckout(false)}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            {!selectedPayment ? (
              // Payment Method Selection
              <>
                <h3 className="text-2xl font-bold mb-6">
                  Choose Payment Method
                </h3>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("cash")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border hover:border-black transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-money-bill text-xl"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">
                          Pay when you receive
                        </p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment("online")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border hover:border-black transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-credit-card text-xl"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Pay Online</p>
                        <p className="text-sm text-gray-500">Secure payment</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </>
            ) : (
              // Shipping Details Form
              <>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h3 className="text-2xl font-bold">Shipping Details</h3>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-xl border focus:border-black outline-none transition-colors"
                  />

                  <textarea
                    name="details"
                    placeholder="Address Details"
                    value={formik.values.details}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-xl border focus:border-black outline-none transition-colors resize-none h-24"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-xl border focus:border-black outline-none transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-black text-white h-12 rounded-xl hover:-translate-y-[0.1rem] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    {isProcessing ? "Processing..." : "Continue"}
                  </button>
                </form>
              </>
            )}

            <button
              onClick={() => !isProcessing && setShowCheckout(false)}
              disabled={isProcessing}
              className="w-full py-3 mt-4 text-gray-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
