import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Smartphone,
  Loader2,
  ShieldCheck,
  Copy,
  CreditCard,
  ArrowRight,
  ReceiptText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PaymentQRModal({ fine, onClose }) {
  const { payFineByStudent } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [receiptTxnId, setReceiptTxnId] = useState('');

  const upiId = 'hostel.fines@icici';

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const txnId = payFineByStudent(fine.id, {
        method: 'UPI QR Scan (Instant Settlement)',
        txnId: `UPI-${Math.floor(100000000 + Math.random() * 900000000)}`
      });

      setReceiptTxnId(txnId);
      setIsProcessing(false);
      setIsPaid(true);
    }, 1200);
  };

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
    } catch (error) {
      console.error('Unable to copy UPI ID', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">

      <div
        className="relative w-full max-w-lg max-h-[94vh] overflow-y-auto bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* =========================================================
            CLOSE BUTTON
        ========================================================= */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-xl
          bg-white/80 dark:bg-slate-900/80 backdrop-blur
          border border-slate-200 dark:border-slate-700
          text-slate-400 hover:text-slate-900 dark:hover:text-white
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isPaid ? (
          <>
            {/* =====================================================
                HEADER
            ===================================================== */}
            <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">

              <div className="flex items-start gap-3 pr-10">

                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50
                  border border-emerald-200 dark:border-emerald-800
                  flex items-center justify-center flex-shrink-0"
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Settle Fine
                    </h3>

                    <span className="text-[9px] uppercase tracking-wider font-bold
                      px-2 py-0.5 rounded-full
                      bg-emerald-50 dark:bg-emerald-950/50
                      text-emerald-700 dark:text-emerald-400
                      border border-emerald-200 dark:border-emerald-800"
                    >
                      UPI
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Secure payment through the hostel administration portal.
                  </p>
                </div>
              </div>

              {/* Amount Hero */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950 dark:bg-slate-900 border border-slate-800">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                      Total Amount Due
                    </p>

                    <p className="text-3xl font-black font-mono text-white mt-1">
                      ₹{fine.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ReceiptText className="w-5 h-5 text-emerald-400" />
                  </div>

                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">
                    Notice ID
                  </span>

                  <span className="text-[10px] font-mono font-bold text-slate-300">
                    {fine.id}
                  </span>
                </div>

              </div>
            </div>

            {/* =====================================================
                FINE DETAILS
            ===================================================== */}
            <div className="px-6 pt-5">

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Payment Details
                  </p>
                </div>

                <div className="p-4 space-y-3 text-xs">

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Student
                    </span>

                    <span className="text-right font-semibold text-slate-800 dark:text-slate-200">
                      {fine.studentName}
                      <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                        {fine.studentId}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Infraction
                    </span>

                    <span className="text-right font-medium text-slate-800 dark:text-slate-200 max-w-[65%]">
                      {fine.infraction}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      Payment Status
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Payment Pending
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* =====================================================
                QR PAYMENT AREA
            ===================================================== */}
            <div className="px-6 pt-5">

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* QR Header */}
                <div className="px-4 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Scan & Pay
                    </p>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Use any supported UPI application
                    </p>
                  </div>

                  <ShieldCheck className="w-4 h-4 text-emerald-500" />

                </div>

                {/* QR */}
                <div className="p-5 bg-white flex flex-col items-center">

                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-sm">

                    <svg
                      className="w-44 h-44"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >

                      {/* Finder patterns */}
                      <rect x="10" y="10" width="45" height="45" rx="4" fill="#0f172a" />
                      <rect x="18" y="18" width="29" height="29" rx="2" fill="white" />
                      <rect x="25" y="25" width="15" height="15" fill="#10b981" />

                      <rect x="145" y="10" width="45" height="45" rx="4" fill="#0f172a" />
                      <rect x="153" y="18" width="29" height="29" rx="2" fill="white" />
                      <rect x="160" y="25" width="15" height="15" fill="#10b981" />

                      <rect x="10" y="145" width="45" height="45" rx="4" fill="#0f172a" />
                      <rect x="18" y="153" width="29" height="29" rx="2" fill="white" />
                      <rect x="25" y="160" width="15" height="15" fill="#10b981" />

                      {/* Matrix */}
                      <rect x="70" y="15" width="10" height="10" fill="#0f172a" />
                      <rect x="90" y="15" width="10" height="10" fill="#10b981" />
                      <rect x="115" y="15" width="12" height="10" fill="#0f172a" />

                      <rect x="70" y="35" width="10" height="10" fill="#10b981" />
                      <rect x="90" y="35" width="15" height="10" fill="#0f172a" />

                      <rect x="15" y="70" width="10" height="10" fill="#0f172a" />
                      <rect x="35" y="70" width="10" height="10" fill="#10b981" />

                      <rect x="70" y="70" width="15" height="15" fill="#0f172a" />
                      <rect x="100" y="70" width="15" height="10" fill="#10b981" />
                      <rect x="130" y="70" width="10" height="15" fill="#0f172a" />
                      <rect x="160" y="70" width="15" height="10" fill="#10b981" />

                      <rect x="15" y="90" width="15" height="10" fill="#10b981" />
                      <rect x="40" y="90" width="10" height="15" fill="#0f172a" />

                      <rect x="120" y="90" width="20" height="10" fill="#10b981" />

                      <rect x="70" y="115" width="15" height="15" fill="#10b981" />
                      <rect x="100" y="115" width="15" height="10" fill="#0f172a" />

                      <rect x="70" y="145" width="10" height="15" fill="#0f172a" />
                      <rect x="90" y="145" width="15" height="10" fill="#10b981" />

                      {/* Center marker */}
                      <rect x="85" y="85" width="30" height="30" rx="6" fill="#10b981" />
                      <text
                        x="100"
                        y="104"
                        fontSize="13"
                        fill="white"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ₹
                      </text>

                    </svg>

                  </div>

                  <p className="mt-3 text-xs font-bold text-slate-900">
                    Hostel Administration
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="text-[10px] font-mono text-slate-600">
                      {upiId}
                    </span>

                    <button
                      type="button"
                      onClick={copyUPI}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Copy UPI ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                  </div>

                  <p className="text-[9px] text-slate-400 mt-1">
                    Google Pay • PhonePe • Paytm • BHIM
                  </p>

                </div>
              </div>
            </div>

            {/* =====================================================
                PAYMENT ACTION
            ===================================================== */}
            <div className="px-6 pt-5 pb-6">

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3 px-4 rounded-xl
                bg-emerald-600 hover:bg-emerald-500
                disabled:bg-emerald-600/60
                text-white text-xs font-bold
                shadow-sm
                flex items-center justify-center gap-2
                transition-all cursor-pointer"
              >

                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying UPI Transaction...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Simulate Payment</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}

              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Payment is automatically reflected in admin records</span>
              </div>

            </div>
          </>
        ) : (

          /* =======================================================
             PAYMENT SUCCESS
          ======================================================= */
          <div className="p-6">

            <div className="text-center">

              <div className="relative mx-auto w-20 h-20">

                <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-950/60 animate-pulse" />

                <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-9 h-9 text-white" />
                </div>

              </div>

              <div className="mt-5">

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-emerald-50 dark:bg-emerald-950/50
                  border border-emerald-200 dark:border-emerald-800
                  text-[9px] uppercase tracking-wider font-bold
                  text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Payment Successful
                </span>

                <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                  Fine Cleared Successfully
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your payment has been recorded and the disciplinary fine is now settled.
                </p>

              </div>

            </div>

            {/* Receipt */}
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Payment Receipt
                </span>
              </div>

              <div className="p-4 space-y-3 text-xs">

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Transaction Ref
                  </span>

                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 text-right">
                    {receiptTxnId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Notice ID
                  </span>

                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {fine.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Amount Paid
                  </span>

                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{fine.amount.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </span>

                  <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    SERVED / PAID
                  </span>
                </div>

              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-3 rounded-xl
              bg-slate-900 hover:bg-slate-800
              dark:bg-white dark:hover:bg-slate-200
              text-white dark:text-slate-900
              text-xs font-bold
              transition-colors cursor-pointer"
            >
              Done
            </button>

          </div>
        )}
      </div>
    </div>
  );
}