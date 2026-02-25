import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, LoaderIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

type PaymentState = 'loading' | 'success' | 'failed';

export const MomoReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState]       = useState<PaymentState>('loading');
  const [orderId, setOrderId]   = useState<string>('');
  const [message, setMessage]   = useState<string>('');
  const [amount, setAmount]     = useState<string>('');

  useEffect(() => {
    const resultCode   = searchParams.get('resultCode');
    const momoOrderId  = searchParams.get('orderId') ?? '';
    const msg          = searchParams.get('message') ?? '';
    const amountParam  = searchParams.get('amount') ?? '';

    // Log các params nhận được từ Momo
    // eslint-disable-next-line no-console
    console.log('MomoReturn params:', {
      resultCode,
      momoOrderId,
      msg,
      amountParam,
      searchParams: Object.fromEntries(searchParams)
    });

    // Lấy original order_id (bỏ phần _timestamp ở cuối)
    const parts = momoOrderId.split('_');
    const originalOrderId = parts.length > 1 ? parts.slice(0, -1).join('_') : momoOrderId;

    setOrderId(originalOrderId);
    setMessage(msg);
    setAmount(amountParam);

    // Gửi toàn bộ params về backend để xác thực chữ ký & cập nhật payment_status
    const confirmPayment = async () => {
      setState('loading');
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((v, k) => { params[k] = v; });
        // Log params gửi về backend
        // eslint-disable-next-line no-console
        console.log('MomoReturn gửi confirm-payment:', params);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/order/momo/confirm-payment/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.error || 'Xác nhận thanh toán thất bại.');
          setState('failed');
        } else {
          setMessage(msg || data.message || '');
          setState(resultCode === '0' ? 'success' : 'failed');
        }
        // Log kết quả xác nhận
        // eslint-disable-next-line no-console
        console.log('Momo confirm-payment:', data);
      } catch (err) {
        setMessage('Lỗi xác nhận thanh toán. Vui lòng thử lại.');
        setState('failed');
      }
    };

    confirmPayment();
  }, [searchParams]);

  const formatAmount = (vnd: string) => {
    const num = parseInt(vnd, 10);
    if (isNaN(num)) return vnd;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  /* ── Loading ── */
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoaderIcon className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  /* ── Success ── */
  if (state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            Số tiền: <span className="font-semibold text-green-600">{formatAmount(amount)}</span>
          </p>
          {orderId && (
            <p className="text-sm text-gray-400 mb-6">
              Mã đơn hàng: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/orders/${orderId}`)}>
              Xem đơn hàng
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Failed ── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Thanh toán thất bại
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {message || 'Giao dịch không thành công hoặc đã bị huỷ.'}
        </p>
        <div className="flex gap-3 justify-center">
          {orderId && (
            <Button variant="outline" onClick={() => navigate(`/orders/${orderId}`)}>
              Xem đơn hàng
            </Button>
          )}
          <Button onClick={() => navigate('/checkout')}>
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  );
};
