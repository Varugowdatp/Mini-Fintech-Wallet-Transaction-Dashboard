import { WALLET_CONFIG } from "../config/wallet";
import React from "react";
function TransactionCard({ transaction, showDelete, onDelete }) {
  const { type, amount, description, status, createdAt } = transaction;

  const typeStyles = {
    credit: "text-green-600",
    debit: "text-red-600",
    fee: "text-orange-600",
  };

  const statusStyles = {
    success: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-lg font-semibold ${typeStyles[type]}`}>
          {type === "credit" ? "+" : "-"}{WALLET_CONFIG.CURRENCY}{amount.toFixed(2)}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{description}</p>
      <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>
      {showDelete && (
        <button
          onClick={() => onDelete(transaction.id)}
          className="mt-2 text-xs text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default TransactionCard;
