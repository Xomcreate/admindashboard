import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function Transactions() {
  const [investments, setInvestments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const inv = await API.get("investments/");
      const wd = await API.get("withdrawals/");

      setInvestments(inv.data);
      setWithdrawals(wd.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="text-white p-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Transactions
        </h1>

        {investments.map((item) => (
          <div
            key={`i-${item.id}`}
            className="bg-[#1f1b1b] p-4 rounded-xl"
          >
            Investment - $
            {Number(item.amount).toLocaleString()}
          </div>
        ))}

        {withdrawals.map((item) => (
          <div
            key={`w-${item.id}`}
            className="bg-[#1f1b1b] p-4 rounded-xl"
          >
            Withdrawal - $
            {Number(item.amount).toLocaleString()}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Transactions;