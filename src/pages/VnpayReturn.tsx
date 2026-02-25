import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, LoaderIcon, XCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

type PaymentState = 'loading' | 'success' | 'failed';

export const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<PaymentState>('loading');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const txnRef = searchParams.get('vnp_TxnRef') ?? '';
    const responseCode = searchParams.get('vnp_ResponseCode') ?? '';
    const transactionStatus = searchParams.get('vnp_TransactionStatus') ?? '';
    const amountParam = searchParams.get('vnp_Amount') ?? '';

    const parts = txnRef.split('_');
    const originalOrderId = parts.length > 1 ? parts.slice(0, -1).join('_') : txnRef;
    setOrderId(originalOrderId);
    setAmount(amountParam);

    const confirmPayment = async () => {
      setState('loading');
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((v, k) => {
          params[k] = v;
        });

        const res = await fetch(`${import.meta.env.VITE_API_URL}/order/vnpay/confirm-payment/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || 'Xác nhận thanh toán VNPAY thất bại.');
          setState('failed');
          return;
        }

        const success = responseCode === '00' && (transactionStatus === '' || transactionStatus === '00');
        setMessage(success ? 'Thanh toán VNPAY thành công.' : 'Thanh toán VNPAY thất bại.');
        setState(success ? 'success' : 'failed');
      } catch (_err) {
        setMessage('Lỗi xác nhận thanh toán. Vui lòng thử lại.');
        setState('failed');
      }
    };

    confirmPayment();
  }, [searchParams]);

  const formatAmount = (rawValue: string) => {
    const raw = parseInt(rawValue, 10);
    if (isNaN(raw)) return rawValue;
    const vnd = Math.floor(raw / 100);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vnd);
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoaderIcon className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thanh toán thành công!
          </h1>
          {amount && (
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              Số tiền: <span className="font-semibold text-green-600">{formatAmount(amount)}</span>
            </p>
          )}
          {orderId && (
            <p className="text-sm text-gray-400 mb-6">
              Mã đơn hàng: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/orders/${orderId}`)}>Xem đơn hàng</Button>
            <Button variant="outline" onClick={() => navigate('/')}>Về trang chủ</Button>
          </div>
        </div>
      </div>
    );
  }

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
          <Button onClick={() => navigate('/checkout')}>Thử lại</Button>
        </div>
      </div>
    </div>
  );
};
