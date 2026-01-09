import React from "react";
import { WALLET_CONFIG } from "../config/wallet";

function BalanceCard({ balance, isLoading }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500 mb-1">Available Balance</p>
      {isLoading ? (
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900">
          {WALLET_CONFIG.CURRENCY}{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}

export default BalanceCard;
