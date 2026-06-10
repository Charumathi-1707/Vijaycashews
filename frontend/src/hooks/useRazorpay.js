import { useCallback } from 'react';
import { paymentAPI } from '../api/services';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const useRazorpay = () => {
  const { user } = useAuthStore();

  const openRazorpay = useCallback(async ({ amount, orderId, orderDbId, onSuccess, onFailure }) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Payment gateway failed to load. Check your internet connection.');
      return;
    }

    try {
      // Create Razorpay order on backend
      const { data } = await paymentAPI.createRazorpayOrder({ amount, orderId });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopEase',
        description: `Order #${orderId}`,
        image: 'https://via.placeholder.com/60x60/ea580c/ffffff?text=S',
        order_id: data.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#ea580c' },

        // ─── FIX: Explicitly enable UPI on mobile ──────────────────────────
        // Without this, Razorpay hides UPI on mobile browsers because it can't
        // auto-detect intent flow. We force all three flows: intent (opens GPay/
        // PhonePe/Paytm), collect (type VPA), and qr (scan to pay).
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [
                  { method: 'upi', flows: ['intent', 'collect', 'qr'] },
                ],
              },
              other: {
                name: 'Other Methods',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: { show_default_blocks: false },
          },
        },
        // ───────────────────────────────────────────────────────────────────

        modal: {
          ondismiss: () => {
            toast('Payment cancelled', { icon: '⚠️' });
            onFailure?.('cancelled');
          },
        },
        handler: async (response) => {
          // Verify payment on backend
          const loadingToast = toast.loading('Verifying payment...');
          try {
            const { data: verifyData } = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderDbId,
            });
            toast.dismiss(loadingToast);
            toast.success('Payment successful! 🎉');
            onSuccess?.(verifyData.order);
          } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.message || 'Payment verification failed');
            onFailure?.('verification_failed');
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        onFailure?.(response.error);
      });

      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
      onFailure?.(err);
    }
  }, [user]);

  return { openRazorpay };
};