import axios from "axios";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import EmptyOrders from "../EmptyOrders/EmptyOrders";

export default function AllOrders() {
  const { userToken } = useContext(UserContext);

  // Get user name from token
  const userId = userToken ? jwtDecode(userToken).id : null;

  useEffect(() => {
    document.title = "NexMart | Orders";
  }, []);

  // Get user orders from API
  function getUserOrders() {
    return axios.get(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
    );
  }

  const {
    data: orders,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getUserOrders,
    select: (data) => data.data,
    enabled: !!localStorage.getItem("token"),
  });

  if (isError) {
    return (
      <div className="min-h-screen pt-40 pb-12">
        <Error />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 pb-16">
        <Loader />
      </div>
    );
  }

  if (!localStorage.getItem("token") || orders?.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <>
      <div className="min-h-screen pt-40 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-8">
          {orders
            ?.slice()
            .reverse()
            .map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border p-6">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{order.totalOrderPrice} EGP</p>
                  </div>
                  <div className="flex gap-3">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Not paid"}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        order.isDelivered
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="py-6 border-b space-y-4">
                  <h3 className="font-medium">Order Items</h3>
                  {order.cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-pretty truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.count}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium">
                            {item.price} EGP
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.product.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Details */}
                <div className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Shipping Details</h3>
                      <div className="space-y-1 text-sm">
                        <p>{order.shippingAddress.city}</p>
                        <p className="first-letter:uppercase lowercase">
                          {order.shippingAddress.details}
                        </p>
                        <p>{order.shippingAddress.phone}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Payment Details</h3>
                      <div className="space-y-1 text-sm capitalize">
                        <p>Method: {order.paymentMethodType}</p>
                        <p>
                          {order.shippingPrice === 0
                            ? `Shipping: Free`
                            : `Shipping: ${order.shippingPrice}`}
                        </p>
                        <p className="font-medium">
                          Total: {order.totalOrderPrice} EGP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
