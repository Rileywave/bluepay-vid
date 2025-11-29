
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "../../types/transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">Recent Transactions</h3>
        <Button variant="ghost" className="h-6 px-2 text-bluepay-blue text-xs">
          View All <ArrowRight size={12} />
        </Button>
      </div>
      
      <div className="space-y-1">
        {transactions.slice(0, 3).map(transaction => (
          <div key={transaction.id} className="flex justify-between py-1 border-b border-gray-100">
            <div>
              <p className="font-medium text-xs">{transaction.type}</p>
              <p className="text-xs text-gray-500">{transaction.date}</p>
              {transaction.recipient && (
                <p className="text-xs text-gray-500">{transaction.recipient}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-xs">{transaction.amount}</p>
              <p className={`text-xs ${transaction.status === "Completed" ? "text-green-500" : "text-orange-500"}`}>
                {transaction.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
