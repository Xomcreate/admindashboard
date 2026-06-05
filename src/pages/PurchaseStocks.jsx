import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const STOCKS_LIST = [
  {
    id: "SHOP",
    name: "Shopify Inc.",
    ticker: "SHOP",
    min: 500,
    max: 50000,
    icon: "🛍️",
    color: "#96bf48",
  },
  {
    id: "TSLA",
    name: "Tesla, Inc.",
    ticker: "TSLA",
    min: 1000,
    max: 100000,
    icon: "⚡",
    color: "#cc0000",
  },
  {
    id: "META",
    name: "Meta Platforms, Inc.",
    ticker: "META",
    min: 1000,
    max: 100000,
    icon: "♾️",
    color: "#0066ff",
  },
  {
    id: "AMZN",
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    min: 1000,
    max: 100000,
    icon: "📦",
    color: "#ff9900",
  },
  {
    id: "NVDA",
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    min: 2000,
    max: 20000,
    icon: "🟢",
    color: "#76b900",
  },
  {
    id: "AAPL",
    name: "Apple Inc.",
    ticker: "AAPL",
    min: 299,
    max: 10000,
    icon: "🍏",
    color: "#a3aaae",
  },
  {
    id: "MSFT",
    name: "Microsoft Corporation",
    ticker: "MSFT",
    min: 1500,
    max: 150000,
    icon: "💻",
    color: "#00a4ef",
  },
  {
    id: "NFLX",
    name: "Netflix, Inc.",
    ticker: "NFLX",
    min: 800,
    max: 75000,
    icon: "🍿",
    color: "#e50914",
  }
];

function PurchaseStocks() {
  const [amounts, setAmounts] = useState({});

  const handleAmountChange = (stockId, value) => {
    setAmounts((prev) => ({ ...prev, [stockId]: value }));
  };

  const handleInvest = (stock, e) => {
    e.preventDefault();
    const val = parseFloat(amounts[stock.id] || 0);
    if (!val || val < stock.min || val > stock.max) {
      alert(`Please enter a valid allocation between $${stock.min.toLocaleString()} and $${stock.max.toLocaleString()} for ${stock.name}.`);
      return;
    }
    alert(`Initiating contract purchase of $${val.toLocaleString()} in ${stock.name} (${stock.ticker})`);
    // Connect to your API.post("investments/", ...) process here
  };

  // PALETTE DESIGN CONFIGS
  const pageBg        = "bg-[#171515]";
  const cardBg        = "bg-[#211e1e]";
  const borderCol     = "border-[#332d2c]";
  const mutedText     = "text-[#9e9593]";
  const inputBg       = "bg-[#171515]";

  return (
    <DashboardLayout>
      <div className={`text-white space-y-8 max-w-6xl mx-auto p-4 min-h-screen ${pageBg}`}>
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide">Purchase Stocks</h1>
          <p className={`${mutedText} text-sm mt-1`}>
            Deploy capital directly into top-tier global corporate equities. Contracts automatically accumulate 25% daily yields for a 120-day cycle.
          </p>
        </div>

        {/* Responsive Asset Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STOCKS_LIST.map((stock) => (
            <div
              key={stock.id}
              className={`${cardBg} rounded-xl border ${borderCol} p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#c45a45]/40 hover:scale-[1.02] shadow-xl`}
            >
              <div>
                {/* Visual Identity Layout */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative shadow-inner"
                    style={{ backgroundColor: `${stock.color}20`, border: `1px solid ${stock.color}40` }}
                  >
                    {stock.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide leading-tight text-slate-100">{stock.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5 inline-block mt-0.5">
                      {stock.ticker}
                    </span>
                  </div>
                </div>

                {/* Configuration Specs */}
                <div className="space-y-2 bg-[#171515]/50 border border-[#332d2c]/40 rounded-lg p-3 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className={mutedText}>Min. Investment</span>
                    <span className="font-semibold text-slate-200">${stock.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={mutedText}>Max. Investment</span>
                    <span className="font-semibold text-slate-200">${stock.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Form Input Handler */}
              <form onSubmit={(e) => handleInvest(stock, e)} className="space-y-3">
                <div>
                  <label className={`block text-[10px] uppercase tracking-wider font-medium mb-1 ${mutedText}`}>
                    Amount to Invest
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${mutedText}`}>$</span>
                    <input
                      type="number"
                      placeholder={`${stock.min}`}
                      min={stock.min}
                      max={stock.max}
                      className={`w-full ${inputBg} border ${borderCol} rounded-lg pl-7 pr-3 py-2 text-sm text-white placeholder-[#5a5352] focus:outline-none focus:border-[#c45a45] transition-colors`}
                      value={amounts[stock.id] || ""}
                      onChange={(e) => handleAmountChange(stock.id, e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#a64633] hover:bg-[#c45a45] text-white text-xs font-semibold py-2.5 rounded-lg transition-all duration-200 uppercase tracking-wider shadow-md"
                >
                  Invest Asset
                </button>
              </form>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default PurchaseStocks;