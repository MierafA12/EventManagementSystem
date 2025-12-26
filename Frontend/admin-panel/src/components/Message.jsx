import { CheckCircle, XCircle } from "lucide-react";

export default function Message({ type, message, onClose }) {
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 animate-bounce`}>
      {isSuccess ? <CheckCircle size={28} /> : <XCircle size={28} />}
      <span className="font-bold text-lg">{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-white">✕</button>
    </div>
  );
}
