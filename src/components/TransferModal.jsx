import { useState, useEffect } from "react";
import { WALLET_CONFIG } from "../config/wallet";
import { getUsers } from "../services/api";
import Modal from "./Modal";
import React from "react";

function TransferModal({ isOpen, onClose, onSubmit, isLoading, balance }) {
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      getUsers().then(setUsers).catch(() => {});
    }
  }, [isOpen]);

  const numAmount = parseFloat(amount);
  const fee =
    !isNaN(numAmount) ? numAmount * (WALLET_CONFIG.FEE_PERCENTAGE / 100) : 0;
  const total = !isNaN(numAmount) ? numAmount + fee : 0;

  const selectedUser = users.find((u) => u.id === recipientId);

  // ✅ Continue should NOT block for insufficient balance
  const handleContinue = (e) => {
    e.preventDefault();

    if (!recipientId) {
      setError("Please select a recipient");
      return;
    }

    if (isNaN(numAmount) || numAmount < WALLET_CONFIG.MIN_AMOUNT) {
      setError(
        `Amount must be at least ${WALLET_CONFIG.CURRENCY}${WALLET_CONFIG.MIN_AMOUNT}`
      );
      return;
    }

    if (numAmount > WALLET_CONFIG.TRANSACTION_LIMIT) {
      setError(
        `Amount cannot exceed ${WALLET_CONFIG.CURRENCY}${WALLET_CONFIG.TRANSACTION_LIMIT.toLocaleString()}`
      );
      return;
    }

    // ❗ DO NOT block on insufficient balance
    setStep(2);
  };

  const handleConfirm = async () => {
    await onSubmit(recipientId, selectedUser.name, numAmount, fee);
    handleClose();
  };

  const handleClose = () => {
    setRecipientId("");
    setAmount("");
    setError("");
    setStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Transfer Money" : "Confirm Transfer"}
    >
      {step === 1 ? (
        <form onSubmit={handleContinue}>
          {/* Recipient */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Recipient
            </label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select recipient</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Amount ({WALLET_CONFIG.CURRENCY})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                const n = parseFloat(value);

                setAmount(value);

                // ✅ REAL-TIME insufficient balance warning
                if (!isNaN(n) && n > 0 && n + n * (WALLET_CONFIG.FEE_PERCENTAGE / 100) > balance) {
                  setError("Insufficient balance");
                } else {
                  setError("");
                }
              }}
              placeholder="Enter amount"
              min={WALLET_CONFIG.MIN_AMOUNT}
              max={WALLET_CONFIG.TRANSACTION_LIMIT}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fee breakdown */}
          {amount && !isNaN(numAmount) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Fee ({WALLET_CONFIG.FEE_PERCENTAGE}%)
                </span>
                <span>
                  {WALLET_CONFIG.CURRENCY}
                  {fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-1">
                <span>Total</span>
                <span>
                  {WALLET_CONFIG.CURRENCY}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          {/* Actions */}
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Sending to</p>
            <p className="font-semibold">{selectedUser?.name}</p>

            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>
                  {WALLET_CONFIG.CURRENCY}
                  {numAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Fee</span>
                <span>
                  {WALLET_CONFIG.CURRENCY}
                  {fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>
                  {WALLET_CONFIG.CURRENCY}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default TransferModal;
