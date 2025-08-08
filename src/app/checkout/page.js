"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePaymentMutation } from "@/services/payment/paymentApi";
import {
  createPurchase,
  purchaseSuccess,
  purchaseError,
} from "@/features/purchase/purchaseSlice";
import Image from "next/image";
import Trash from "@/components/icons/Trash";

const CheckoutPage = () => {
  const user = useSelector((state) => state?.auth?.user);
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || user?.shippingAddress || "",
    shippingAddress: "",
    diffAddr: false,
    deliveryType: "INSIDE_DHAKA",
    paymentType: "CASH_ON_DELIVERY",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || user?.shippingAddress || "",
    }));
  }, [user]);

  const dispatch = useDispatch();
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  useEffect(() => {
    const storedCart = localStorage.getItem("checkoutCart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Calculate subtotal and delivery fee
  const subtotal = cart.reduce(
    (acc, item) =>
      acc + (item.price || item.product?.price || 0) * item.quantity,
    0
  );
  let deliFee = 0;
  if (form.deliveryType === "INSIDE_DHAKA") deliFee = 80;
  else if (form.deliveryType === "OUTSIDE_DHAKA") deliFee = 120;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = subtotal + deliFee;
    dispatch(createPurchase({ ...form, cart, total }));
    try {
      const res = await createPayment({ ...form, cart, total }).unwrap();
      console.log("Order API response:", res);
      // Try to clear cart and show success message regardless of res.ok for debugging
      if (
        res?.ok ||
        res?.success ||
        res?.status === "success" ||
        res?.message === "Order placed successfully!" ||
        res?.acknowledgement === true
      ) {
        setCart([]);
        localStorage.removeItem("checkoutCart");
        setOrderSuccess(true);
      } else {
        setOrderSuccess(false);
        // Optionally show error in UI
      }
      dispatch(purchaseSuccess());
    } catch (err) {
      setOrderSuccess(false);
      dispatch(purchaseError(err));
    }
  };

  const handleDeleteCartItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("checkoutCart", JSON.stringify(updatedCart));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {orderSuccess ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="  text-green-700 px-6 py-8  text-center">
            <h2 className="text-2xl font-bold mb-2">
              Order placed successfully!
            </h2>
            <p className="mb-4">
              Thank you for your purchase. We will contact you soon.
            </p>
            <a href="/" className="text-blue-600 underline">
              Go to Home
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded shadow flex flex-col gap-4 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1 font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                    inputMode="email"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phone" className="mb-1 font-medium">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="number"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="phone" className="mb-1 font-medium">
                  Address
                </label>
                <textarea
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="diffAddr"
                  checked={form.diffAddr}
                  onChange={handleChange}
                />
                <label>Different Shipping Address</label>
              </div>
              {form.diffAddr && (
                <textarea
                  name="shippingAddress"
                  placeholder="Shipping Address"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}
              <div className="mt-2">
                <div className="">
                  <label className="block mb-1 font-semibold">
                    Delivery Method
                  </label>
                  <div className="flex flex-col gap-2">
                    <label>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="INSIDE_DHAKA"
                        checked={form.deliveryType === "INSIDE_DHAKA"}
                        onChange={handleChange}
                      />{" "}
                      Inside Dhaka delivery charges (80TK)
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="OUTSIDE_DHAKA"
                        checked={form.deliveryType === "OUTSIDE_DHAKA"}
                        onChange={handleChange}
                      />{" "}
                      Outside Dhaka delivery charges (120TK)
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block mb-1 font-semibold">
                    Payment Method
                  </label>
                  <div className="flex flex-col gap-2">
                    <label>
                      <input
                        type="radio"
                        name="paymentType"
                        value="CASH_ON_DELIVERY"
                        checked={form.paymentType === "CASH_ON_DELIVERY"}
                        onChange={handleChange}
                      />{" "}
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="bg-black text-white py-2 rounded mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
            <div className="bg-white p-4 rounded shadow w-full">
              {cart.length > 0 ? (
                <div className="flex flex-col gap-2 w-full">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-x-2 transition-all border p-2 rounded group relative"
                    >
                      <div>
                        <Image
                          src={item?.thumbnail?.url}
                          alt={item?.thumbnail?.public_id}
                          width={50}
                          height={50}
                          className="rounded h-[50px] w-[50px] object-cover"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-2 w-full gap-2">
                        <div>
                          <div>
                            <span className="truncate max-w-xs">
                              <strong>
                                {item.product?.title || item.name}
                              </strong>{" "}
                            </span>
                          </div>
                          <div>
                            <span>
                              Quantity:
                              <span className="ml-1"> {item.quantity}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-1 rounded text-red-900"
                        onClick={() => handleDeleteCartItem(index)}
                      >
                        <Trash />
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row flex-wrap justify-between mt-4 font-bold w-full gap-2">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)} TK</span>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap justify-between w-full gap-2">
                    <span>Delivery Fee:</span>
                    <span>{deliFee.toFixed(2)} TK</span>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap justify-between text-lg mt-2 w-full gap-2">
                    <span>Total:</span>
                    <span>{(subtotal + deliFee).toFixed(2)} TK</span>
                  </div>
                </div>
              ) : (
                <p>Loading cart...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
