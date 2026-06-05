import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaExchangeAlt,
  FaChartLine,
  FaUserCircle,
  FaStar,
  FaCheckCircle,
  FaFire,
  FaLock,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaFilter,
  FaBolt,
  FaShieldAlt,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";

const traders = [
  {
    id: 1,
    name: "Alex Mercer",
    handle: "@alexm_trades",
    avatar: "AM",
    roi: "+184.3%",
    roiPositive: true,
    winRate: "78%",
    followers: "12.4K",
    risk: "Medium",
    tags: ["Forex", "Gold"],
    monthlyReturn: "+18.2%",
    badge: "Top Performer",
    color: "#c45a45",
    copying: false,
  },
  {
    id: 2,
    name: "Sofia Chen",
    handle: "@sofia_quant",
    avatar: "SC",
    roi: "+231.7%",
    roiPositive: true,
    winRate: "83%",
    followers: "28.1K",
    risk: "Low",
    tags: ["Stocks", "ETFs"],
    monthlyReturn: "+22.5%",
    badge: "Elite",
    color: "#d4875a",
    copying: true,
  },
  {
    id: 3,
    name: "Raj Patel",
    handle: "@raj_algo",
    avatar: "RP",
    roi: "+97.6%",
    roiPositive: true,
    winRate: "71%",
    followers: "7.8K",
    risk: "High",
    tags: ["Crypto", "Futures"],
    monthlyReturn: "+9.8%",
    badge: "Rising Star",
    color: "#9b6ab5",
    copying: false,
  },
  {
    id: 4,
    name: "Elena Kovacs",
    handle: "@elena_macro",
    avatar: "EK",
    roi: "+312.0%",
    roiPositive: true,
    winRate: "88%",
    followers: "41.3K",
    risk: "Low",
    tags: ["Indices", "Forex"],
    monthlyReturn: "+28.1%",
    badge: "Legend",
    color: "#c45a45",
    copying: false,
  },
  {
    id: 5,
    name: "Marcus Webb",
    handle: "@mwebb_scalp",
    avatar: "MW",
    roi: "+143.8%",
    roiPositive: true,
    winRate: "69%",
    followers: "9.2K",
    risk: "High",
    tags: ["Crypto", "Stocks"],
    monthlyReturn: "+14.6%",
    badge: "Top Performer",
    color: "#5a8fc4",
    copying: false,
  },
  {
    id: 6,
    name: "Nadia Osei",
    handle: "@nadia_swing",
    avatar: "NO",
    roi: "+189.2%",
    roiPositive: true,
    winRate: "76%",
    followers: "15.6K",
    risk: "Medium",
    tags: ["Forex", "Commodities"],
    monthlyReturn: "+17.9%",
    badge: "Verified",
    color: "#4db89b",
    copying: false,
  },
];

const riskColor = {
  Low: "text-emerald-400",
  Medium: "text-amber-400",
  High: "text-red-400",
};

const riskBg = {
  Low: "bg-emerald-400/10 border-emerald-400/20",
  Medium: "bg-amber-400/10 border-amber-400/20",
  High: "bg-red-400/10 border-red-400/20",
};

const badgeIcon = {
  Elite: <FaTrophy className="text-[10px]" />,
  Legend: <FaStar className="text-[10px]" />,
  "Top Performer": <FaFire className="text-[10px]" />,
  "Rising Star": <FaBolt className="text-[10px]" />,
  Verified: <FaCheckCircle className="text-[10px]" />,
};

function TraderCard({ trader, onToggle }) {
  return (
    <div className="group relative bg-[#0f0e0e] border border-white/[0.07] rounded-2xl p-5 hover:border-[#c45a45]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#c45a45]/5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: `${trader.color}25`, border: `1px solid ${trader.color}40` }}
          >
            <span style={{ color: trader.color }}>{trader.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-semibold leading-none">{trader.name}</p>
              <span
                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: `${trader.color}18`, color: trader.color, border: `1px solid ${trader.color}30` }}
              >
                {badgeIcon[trader.badge]}
                {trader.badge}
              </span>
            </div>
            <p className="text-white/30 text-xs mt-0.5">{trader.handle}</p>
          </div>
        </div>
        <div className={`text-xs px-2 py-1 rounded-lg border font-medium ${riskBg[trader.risk]} ${riskColor[trader.risk]}`}>
          {trader.risk} Risk
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/3 rounded-xl p-3 text-center border border-white/3">
          <p className="text-emerald-400 text-base font-bold leading-none">{trader.roi}</p>
          <p className="text-white/30 text-[10px] mt-1 uppercase tracking-wide">Total ROI</p>
        </div>
        <div className="bg-white/3 rounded-xl p-3 text-center border border-white/3">
          <p className="text-white text-base font-bold leading-none">{trader.winRate}</p>
          <p className="text-white/30 text-[10px] mt-1 uppercase tracking-wide">Win Rate</p>
        </div>
        <div className="bg-white/3 rounded-xl p-3 text-center border border-white/3">
          <p className="text-white/70 text-base font-bold leading-none">{trader.followers}</p>
          <p className="text-white/30 text-[10px] mt-1 uppercase tracking-wide">Followers</p>
        </div>
      </div>

      {/* Tags + Monthly */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {trader.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40 font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-emerald-400 text-xs font-semibold">{trader.monthlyReturn}</p>
          <p className="text-white/25 text-[10px]">this month</p>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onToggle(trader.id)}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          trader.copying
            ? "bg-[#c45a45]/15 border border-[#c45a45]/40 text-[#c45a45] hover:bg-[#c45a45]/25"
            : "bg-[#c45a45] hover:bg-[#d06a55] text-white shadow-md shadow-[#c45a45]/20"
        }`}
      >
        {trader.copying ? "✓ Copying — Stop" : "Copy Trader"}
      </button>
    </div>
  );
}

function CopyTrading() {
  const [traderList, setTraderList] = useState(traders);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filters = ["All", "Low Risk", "High ROI", "Most Followed"];

  const toggle = (id) => {
    setTraderList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, copying: !t.copying } : t))
    );
  };

  const copyingCount = traderList.filter((t) => t.copying).length;

  const filtered = traderList.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.handle.toLowerCase().includes(search.toLowerCase());
    if (filter === "Low Risk") return t.risk === "Low" && matchSearch;
    if (filter === "High ROI") return matchSearch;
    if (filter === "Most Followed") return matchSearch;
    return matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="text-white p-5 md:p-7 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#c45a45]/15 border border-[#c45a45]/30 flex items-center justify-center">
              <FaExchangeAlt className="text-[#c45a45] text-sm" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Copy Trading</h1>
          </div>
          <p className="text-white/35 text-sm ml-12">
            Mirror top traders automatically and share in their profits.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Active Copies", value: copyingCount, icon: <FaUsers />, up: true },
            { label: "Avg. ROI", value: "+18.4%", icon: <FaChartLine />, up: true },
            { label: "Top Trader", value: "Elena K.", icon: <FaTrophy />, up: null },
            { label: "Protected", value: "Insured", icon: <FaShieldAlt />, up: null },
          ].map((s) => (
            <div key={s.label} className="bg-[#0f0e0e] border border-white/[0.07] rounded-2xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c45a45]/12 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] text-xs shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">{s.value}</p>
                <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs" />
            <input
              type="text"
              placeholder="Search traders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0e0e] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#c45a45]/40 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border ${
                  filter === f
                    ? "bg-[#c45a45]/15 border-[#c45a45]/35 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Traders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((trader) => (
            <TraderCard key={trader.id} trader={trader} onToggle={toggle} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/25">
            <FaSearch className="text-4xl mx-auto mb-3 opacity-30" />
            <p className="text-sm">No traders match your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CopyTrading;