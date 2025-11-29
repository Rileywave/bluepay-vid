
import React from "react";
import { ArrowLeft, History, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserStore } from "../stores/userStore";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { transactions } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Transaction History</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4">
        <Card className="p-3 mb-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold mb-1">All Transactions</h3>
              <p className="text-xs text-gray-600">{transactions.length} total transactions</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </Card>

        <div className="space-y-2">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Card key={transaction.id} className="p-3 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{transaction.type}</h4>
                    <p className="text-xs text-gray-600 mt-1">{transaction.date}</p>
                    {transaction.recipient && (
                      <p className="text-xs text-gray-500 mt-1">{transaction.recipient}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      transaction.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.amount}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 bg-white shadow-sm text-center">
              <History className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-600 mb-2">No Transactions Yet</h3>
              <p className="text-xs text-gray-500">Your transaction history will appear here</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
