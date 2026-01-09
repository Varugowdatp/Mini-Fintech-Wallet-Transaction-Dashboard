import { useState, useEffect, useMemo } from "react";
import { WALLET_CONFIG } from "../config/wallet";
import {
  getTransactions,
  getBalance,
  createTransaction,
  deleteTransaction,
  updateTransactionStatus, 
} from "../services/api";
import { useToast } from "../components/Toast";
import Header from "../components/Header";
import BalanceCard from "../components/BalanceCard";
import TransactionCard from "../components/TransactionCard";
import AddMoneyModal from "../components/AddMoneyModal";
import TransferModal from "../components/TransferModal";
import TransactionFilters from "../components/TransactionFilters";

function Index() {
  const { showToast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    setIsLoadingBalance(true);
    setIsLoadingTransactions(true);

    try {
      const [balanceData, transactionsData] = await Promise.all([
        getBalance(),
        getTransactions(),
      ]);
      setBalance(balanceData);
      setTransactions(transactionsData);
    } catch {
      showToast("Failed to load wallet data", "error");
    } finally {
      setIsLoadingBalance(false);
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recentTransactions = transactions.slice(
    0,
    WALLET_CONFIG.RECENT_TRANSACTIONS_COUNT
  );

  const filteredTransactions = useMemo(() => {
  return transactions.filter((t) => {
    const txStatus = t.status ?? "success"; // normalize

    if (statusFilter !== "all" && txStatus !== statusFilter) return false;
    if (startDate && new Date(t.createdAt) < new Date(startDate)) return false;
    if (endDate && new Date(t.createdAt) > new Date(endDate + "T23:59:59")) return false;

    return true;
  });
}, [transactions, statusFilter, startDate, endDate]);

 
  const handleAddMoney = async (amount) => {
  setIsProcessing(true);

  try {
     
    const pendingTx = await createTransaction({
      type: "credit",
      amount,
      description: "Adding money",
      status: "pending",
    });

     
    await fetchData();  
     
    await new Promise((res) => setTimeout(res, 5000));
 
    await updateTransactionStatus(pendingTx.id, "success");

    
    await fetchData();

    showToast(
      `${WALLET_CONFIG.CURRENCY}${amount.toFixed(2)} added successfully`
    );
  } catch {
    showToast("Failed to add money", "error");
  } finally {
    setIsProcessing(false);
  }
};

 
 const handleTransfer = async (recipientId, recipientName, amount, fee) => {
  setIsProcessing(true);

  try {
 
    const pendingTx = await createTransaction({
      type: "debit",
      amount,
      description: `Transfer to ${recipientName}`,
      status: "pending",
      recipient: recipientName,
    });

     
    await fetchData();  

    
    await new Promise((res) => setTimeout(res, 5000));

     
    if (amount + fee > balance) {
      await updateTransactionStatus(
        pendingTx.id,
        "failed",
        "Insufficient balance"
      );
      await fetchData();
      showToast("Transfer failed: Insufficient balance", "error");
      return;
    }

     
    await updateTransactionStatus(pendingTx.id, "success");

     
    if (fee > 0) {
      await createTransaction({
        type: "fee",
        amount: fee,
        description: "Transfer fee",
        status: "success",
      });
    }

    await fetchData();
    showToast(
      `${WALLET_CONFIG.CURRENCY}${amount.toFixed(2)} sent to ${recipientName}`
    );
  } catch {
    showToast("Transfer failed", "error");
  } finally {
    setIsProcessing(false);
  }
};


  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast("Transaction deleted");
    } catch {
      showToast("Failed to delete transaction", "error");
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const renderSkeleton = () => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
  );

  const renderEmpty = (title, description) => (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <p className="text-gray-500 text-lg mb-1">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Transaction History
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <BalanceCard
                balance={balance}
                isLoading={isLoadingBalance}
              />

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <button
                  onClick={() => setIsAddMoneyOpen(true)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  + Add Money
                </button>
                <button
                  onClick={() => setIsTransferOpen(true)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  ↗ Transfer
                </button>
                <button
                  onClick={fetchData}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Transactions
              </h2>

              {isLoadingTransactions ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>{renderSkeleton()}</div>
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                renderEmpty(
                  "No transactions yet",
                  "Add money to your wallet to get started"
                )
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <TransactionFilters
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClear={clearFilters}
            />

            {isLoadingTransactions ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>{renderSkeleton()}</div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              renderEmpty("No transactions found", "Try adjusting your filters")
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    showDelete
                    onDelete={handleDeleteTransaction}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        onSubmit={handleAddMoney}
        isLoading={isProcessing}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSubmit={handleTransfer}
        isLoading={isProcessing}
        balance={balance}
      />
    </div>
  );
}

export default Index;
