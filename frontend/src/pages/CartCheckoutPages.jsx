import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, CheckCircle, MapPin, CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { orderAPI } from '../api/services';
import { useRazorpay } from '../hooks/useRazorpay';
import { Button, Modal } from '../components/ui';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

// ─── CART PAGE ────────────────────────────────────────────────────────────────
export function CartPage() {
  const { cart, subtotal, fetchCart, updateItem, removeItem, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const handleApplyCoupon = async () => {
    const result = await applyCoupon(couponCode.toUpperCase());
    if (result.success) { setDiscount(result.discount); setAppliedCoupon(couponCode.toUpperCase()); }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setDiscount(0); setAppliedCoupon(''); setCouponCode('');
  };

  const shippingCost = subtotal >= 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax - discount;
  const items = cart?.items || [];

  if (!items.length) return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/shop"><Button size="lg"><ShoppingBag className="w-5 h-5" /> Start Shopping</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">
          Shopping Cart <span className="text-gray-400 font-normal text-xl">({items.length} items)</span>
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const p = item.product;
              if (!p) return null;
              return (
                <div key={item._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 hover:shadow-md transition-shadow">
                  <Link to={`/product/${p._id}`} className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                    <img src={p.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={p.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${p._id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 block">{p.name}</Link>
                    {item.variant && <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>}
                    <p className="font-bold text-primary-600 mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateItem(item._id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-3 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateItem(item._id, item.quantity + 1)} disabled={item.quantity >= p.stock}
                          className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-display font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary-600" /> Coupon Code</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                  <span className="text-green-700 font-mono font-bold text-sm">{appliedCoupon}</span>
                  <button onClick={handleRemoveCoupon} className="text-red-500 text-xs hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                  <Button size="sm" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>Apply</Button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-display font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span>{formatPrice(tax)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              {shippingCost > 0 && <p className="text-xs text-orange-600 mt-3 bg-orange-50 p-2 rounded-lg">Add {formatPrice(500 - subtotal)} more for free shipping!</p>}
              <Button className="w-full mt-5" size="lg" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
              <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors">Continue Shopping</Link>
            </div>

            {/* Trust badges */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              {[['🔒', 'Secure Checkout', 'SSL encrypted payment'], ['🚚', 'Free Shipping', 'On orders above ₹500'], ['↩️', 'Easy Returns', '7-day return policy']].map(([icon, title, sub]) => (
                <div key={title} className="flex items-center gap-3 text-xs">
                  <span className="text-base">{icon}</span>
                  <div><p className="font-semibold text-gray-700">{title}</p><p className="text-gray-400">{sub}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────
export function CheckoutPage() {
  const { cart, subtotal, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { openRazorpay } = useRazorpay();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => { fetchCart(); }, []);

  const shippingCost = subtotal >= 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;

  // Step 1 — create order first (with pending payment), then open Razorpay or finish for COD
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const items = cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        variant: i.variant,
      }));

      const { data } = await orderAPI.create({
        items,
        shippingAddress: address,
        payment: { method: paymentMethod },
        couponCode: cart.coupon || '',
      });

      const order = data.order;

      if (paymentMethod === 'razorpay') {
        setLoading(false);
        // Open Razorpay modal
        openRazorpay({
          amount: order.pricing.total,
          orderId: order.orderId,
          orderDbId: order._id,
          onSuccess: (paidOrder) => {
            setOrderPlaced(paidOrder);
            setStep(4);
          },
          onFailure: (reason) => {
            if (reason !== 'cancelled') {
              toast.error('Payment failed. Your order is saved — you can retry from My Orders.');
            }
            navigate('/orders');
          },
        });
      } else {
        // COD — done
        setOrderPlaced(order);
        setStep(4);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  // ─── Success screen ───────────────────────────────────────────────────────
  if (step === 4 && orderPlaced) return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-xl border border-gray-100 animate-scale-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-display font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-1">Order ID: <span className="font-mono font-bold text-gray-900">{orderPlaced.orderId}</span></p>
        <p className="text-gray-500 mb-1">
          Total: <span className="font-bold text-gray-900">{formatPrice(orderPlaced.pricing.total)}</span>
        </p>
        <p className="text-gray-500 mb-6">
          Payment:{' '}
          <span className={`font-semibold ${orderPlaced.payment?.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
            {orderPlaced.payment?.status === 'paid' ? '✅ Paid' : '💵 Pay on Delivery'}
          </span>
        </p>
        <p className="text-sm text-gray-400 mb-8">Thank you for shopping with us! We'll keep you updated.</p>
        <div className="flex gap-3">
          <Link to="/orders" className="flex-1"><Button variant="secondary" className="w-full">Track Order</Button></Link>
          <Link to="/shop" className="flex-1"><Button className="w-full">Shop More</Button></Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {['Address', 'Payment', 'Confirm'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className="h-0.5 bg-gray-200 w-8 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ── Step 1: Address ── */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" /> Delivery Address
                </h2>

                {user?.addresses?.length > 0 && (
                  <div className="mb-5 space-y-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Saved Addresses</p>
                    {user.addresses.map((addr) => (
                      <button key={addr._id}
                        onClick={() => setAddress({ name: user.name, phone: user.phone, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country })}
                        className="w-full text-left p-3 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 text-sm transition-all">
                        <span className="font-semibold text-gray-900">{addr.label}</span>
                        <span className="text-gray-500 ml-2">{addr.street}, {addr.city} — {addr.pincode}</span>
                      </button>
                    ))}
                    <p className="text-xs text-gray-400 text-center pt-1">— or enter a new address below —</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {[['name', 'Full Name', 'col-span-1'], ['phone', 'Phone Number', 'col-span-1'], ['street', 'Street Address', 'col-span-2'], ['city', 'City', 'col-span-1'], ['state', 'State', 'col-span-1'], ['pincode', 'Pincode', 'col-span-1'], ['country', 'Country', 'col-span-1']].map(([key, label, span]) => (
                    <div key={key} className={span}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-5" size="lg" onClick={() => {
                  if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
                    toast.error('Please fill all required address fields'); return;
                  }
                  setStep(2);
                }}>
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600" /> Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {/* Razorpay */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="accent-primary-600" />
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">Pay Online</p>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Recommended</span>
                      </div>
                      <p className="text-xs text-gray-500">Credit/Debit Card, Net Banking, UPI, Wallets</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {['VISA', 'MC', 'UPI', 'GPay', 'PhonePe'].map(m => (
                          <span key={m} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">{m}</span>
                        ))}
                      </div>
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-primary-600" />
                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay in cash when your order arrives</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'razorpay' && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-5 text-xs text-blue-700">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Your payment is secured by Razorpay with 256-bit SSL encryption</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                  <Button className="flex-1" size="lg" onClick={() => setStep(3)}>
                    Review Order <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3: Confirm ── */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in">
                <h2 className="font-display font-bold text-xl mb-5">Review & Place Order</h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-56 overflow-y-auto">
                  {cart?.items?.map(item => item.product && (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <img src={item.product.images?.[0]?.url || ''} alt="" className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery address summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                  <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" /> Delivering to
                  </p>
                  <p className="text-gray-600">{address.name} · {address.phone}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{address.street}, {address.city}, {address.state} — {address.pincode}</p>
                </div>

                {/* Payment method summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm flex items-center gap-3">
                  {paymentMethod === 'razorpay'
                    ? <><ShieldCheck className="w-4 h-4 text-blue-600" /><span className="text-gray-700">Paying online via <strong>Razorpay</strong></span></>
                    : <><Banknote className="w-4 h-4 text-yellow-600" /><span className="text-gray-700"><strong>Cash on Delivery</strong></span></>
                  }
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                  <Button className="flex-1" size="lg" loading={loading} onClick={handlePlaceOrder}>
                    {paymentMethod === 'razorpay'
                      ? `Pay ${formatPrice(total)} →`
                      : `Place Order — ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24">
            <h3 className="font-display font-bold mb-4">Order Total</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span>{formatPrice(tax)}</span></div>
              <div className="border-t pt-2.5 flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
              <p>🔒 Secure checkout</p>
              <p>🚚 Free delivery on orders above ₹500</p>
              <p>↩️ 7-day easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
