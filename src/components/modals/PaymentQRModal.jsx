import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Smartphone, 
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PaymentQRModal({ fine, onClose }) {
  const { payFineByStudent } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [receiptTxnId, setReceiptTxnId] = useState('');

  const upiId = "hostel.fines@icici";

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txnId = payFineByStudent(fine.id, {
        method: "UPI QR Scan (Instant Settlement)",
        txnId: `UPI-${Math.floor(100000000 + Math.random() * 900000000)}`
      });
      setReceiptTxnId(txnId);
      setIsProcessing(false);
      setIsPaid(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[95vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          <>
            {/* Header */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">UPI QR Code Payment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scan using any UPI app to settle the disciplinary fine penalty
              </p>
            </div>

            {/* Fine Summary Details */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Notice ID:</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">{fine.id}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Infraction:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{fine.infraction}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Student:</span>
                <span className="text-slate-800 dark:text-slate-200">{fine.studentName} ({fine.studentId})</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Amount Due:</span>
                <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{fine.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white text-slate-900 flex flex-col items-center justify-center space-y-2.5 border border-slate-200 dark:border-transparent shadow-sm">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Scan & Pay</p>
                <p className="text-xs font-extrabold text-slate-900">Hostel Administration Office</p>
              </div>

              {/* Dynamic Styled SVG QR Code Matrix */}
              <div className="p-2 bg-white border-2 border-slate-900 rounded-lg">
                <svg
                  className="w-36 h-36"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="10" y="10" width="45" height="45" rx="4" fill="#0f172a" />
                  <rect x="18" y="18" width="29" height="29" rx="2" fill="white" />
                  <rect x="25" y="25" width="15" height="15" fill="#2563eb" />

                  <rect x="145" y="10" width="45" height="45" rx="4" fill="#0f172a" />
                  <rect x="153" y="18" width="29" height="29" rx="2" fill="white" />
                  <rect x="160" y="25" width="15" height="15" fill="#2563eb" />

                  <rect x="10" y="145" width="45" height="45" rx="4" fill="#0f172a" />
                  <rect x="18" y="153" width="29" height="29" rx="2" fill="white" />
                  <rect x="25" y="160" width="15" height="15" fill="#2563eb" />

                  <rect x="70" y="15" width="10" height="10" fill="#0f172a" />
                  <rect x="90" y="15" width="10" height="10" fill="#2563eb" />
                  <rect x="115" y="15" width="12" height="10" fill="#0f172a" />
                  <rect x="70" y="35" width="10" height="10" fill="#2563eb" />
                  <rect x="90" y="35" width="15" height="10" fill="#0f172a" />
                  <rect x="15" y="70" width="10" height="10" fill="#0f172a" />
                  <rect x="35" y="70" width="10" height="10" fill="#2563eb" />
                  <rect x="70" y="70" width="15" height="15" fill="#0f172a" />
                  <rect x="100" y="70" width="15" height="10" fill="#2563eb" />
                  <rect x="130" y="70" width="10" height="15" fill="#0f172a" />
                  <rect x="160" y="70" width="15" height="10" fill="#2563eb" />
                  <rect x="15" y="90" width="15" height="10" fill="#2563eb" />
                  <rect x="40" y="90" width="10" height="15" fill="#0f172a" />
                  <rect x="120" y="90" width="20" height="10" fill="#2563eb" />
                  <rect x="70" y="115" width="15" height="15" fill="#2563eb" />
                  <rect x="100" y="115" width="15" height="10" fill="#0f172a" />
                  <rect x="70" y="145" width="10" height="15" fill="#0f172a" />
                  <rect x="90" y="145" width="15" height="10" fill="#2563eb" />

                  <rect x="85" y="85" width="30" height="30" rx="4" fill="#2563eb" />
                  <text x="100" y="104" fontSize="13" fill="white" fontWeight="bold" textAnchor="middle">₹</text>
                </svg>
              </div>

              <div className="text-center">
                <p className="text-[11px] font-mono text-slate-800 font-semibold">{upiId}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Google Pay • PhonePe • Paytm • BHIM</p>
              </div>
            </div>

            {/* Instant Payment Simulation */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying UPI Transaction...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Simulate UPI Payment (Instant ₹{fine.amount})</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                Payment automatically updates this record in the Admin Dashboard.
              </p>
            </div>
          </>
        ) : (
          /* Payment Confirmed Screen */
          <div className="py-2 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Received & Confirmed</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Fine ₹{fine.amount} is marked as <strong className="text-emerald-600 dark:text-emerald-400">SERVED & PAID</strong> in Admin records.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-1 font-mono">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Transaction Ref:</span>
                <span className="text-blue-600 dark:text-blue-400">{receiptTxnId}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Notice ID:</span>
                <span className="text-slate-900 dark:text-white">{fine.id}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{fine.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
