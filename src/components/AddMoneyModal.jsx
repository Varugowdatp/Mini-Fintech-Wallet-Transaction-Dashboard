import { useState } from "react";
import { WALLET_CONFIG } from "../config/wallet";
import Modal from "./Modal";
import React from "react";
function AddMoneyModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < WALLET_CONFIG.MIN_AMOUNT) {
      setError(`Amount must be at least ${WALLET_CONFIG.CURRENCY}${WALLET_CONFIG.MIN_AMOUNT}`);
      return;
    }

    if (numAmount > WALLET_CONFIG.TRANSACTION_LIMIT) {
      setError(`Amount cannot exceed ${WALLET_CONFIG.CURRENCY}${WALLET_CONFIG.TRANSACTION_LIMIT.toLocaleString()}`);
      return;
    }

    await onSubmit(numAmount);
    setAmount("");
    onClose();
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Money">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Amount ({WALLET_CONFIG.CURRENCY})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min={WALLET_CONFIG.MIN_AMOUNT}
            max={WALLET_CONFIG.TRANSACTION_LIMIT}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Add Money"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddMoneyModal;
