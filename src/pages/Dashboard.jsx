// src/pages/Dashboard.jsx  (Admin)
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import Loader from "../MainComponets/Loader";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import {
  FaRobot, FaExchangeAlt, FaShoppingCart, FaChartLine, FaUsers,
  FaBan, FaArrowDown, FaArrowUp, FaSignal, FaGlobe,
  FaTimes, FaExpand, FaCompress, FaChartBar,
} from "react-icons/fa";

const PIE_COLORS = ["#c45a45", "#e07060", "#a03929", "#10b981", "#f59e0b", "#a78bfa"];

const TIER_STYLE = {
  silver:  { bg: "bg-slate-700/30",   text: "text-slate-300",   border: "border-slate-500/40",   label: "🥈 Silver"  },
  gold:    { bg: "bg-yellow-500/15",  text: "text-yellow-400",  border: "border-yellow-500/30",  label: "🥇 Gold"    },
  diamond: { bg: "bg-violet-500/15",  text: "text-violet-300",  border: "border-violet-500/30",  label: "💎 Diamond" },
  none:    { bg: "bg-white/5",        text: "text-white/40",    border: "border-white/10",        label: "—"          },
};

const INVESTMENT_PLANS = [
  { name: "Trial",     icon: "🌱", min: 500,    max: 5000,    duration: "3 Days",   minReturn: "15%",    maxReturn: "20%",    color: "#10b981" },
  { name: "Essential", icon: "🛡️", min: 5000,   max: 10000,   duration: "14 Days",  minReturn: "30%",    maxReturn: "35%",    color: "#3b82f6" },
  { name: "Premium",   icon: "✨", min: 10000,  max: 50000,   duration: "30 Days",  minReturn: "60%",    maxReturn: "65%",    color: "#f59e0b" },
  { name: "Ultimate",  icon: "🔥", min: 50000,  max: 250000,  duration: "60 Days",  minReturn: "290%",   maxReturn: "300%",   color: "#c45a45" },
  { name: "Royal",     icon: "👑", min: 250000, max: 500000,  duration: "90 Days",  minReturn: "550%",   maxReturn: "600%",   color: "#8b5cf6" },
  { name: "Diamond",   icon: "💎", min: 500000, max: 2000000, duration: "120 Days", minReturn: "1,450%", maxReturn: "1,500%", color: "#06b6d4" },
];

const signalData = [
  { time: "00:00", strength: 42 },
  { time: "03:00", strength: 58 },
  { time: "06:00", strength: 51 },
  { time: "09:00", strength: 74 },
  { time: "12:00", strength: 88 },
  { time: "15:00", strength: 65 },
  { time: "18:00", strength: 79 },
  { time: "21:00", strength: 91 },
  { time: "Now",   strength: 84 },
];

const tradingModules = [
  { name: "Stock Signals", pct: 84, color: "#c45a45", icon: <FaShoppingCart />, status: "Strong Buy" },
  { name: "Copy Trading",  pct: 67, color: "#10b981", icon: <FaExchangeAlt />,  status: "Active"     },
  { name: "AI Bot Engine", pct: 91, color: "#a78bfa", icon: <FaRobot />,        status: "Optimal"    },
];

const marketAssets = [
  {
    symbol: "BTC", name: "Bitcoin",
    price: 67842.50, change: +2.34, color: "#f59e0b",
    sparkline: [61000,63200,62100,65000,64500,66800,67200,67842],
    history: [
      { t: "Nov", p: 58000 },{ t: "Dec", p: 60200 },
      { t: "Jan", p: 62100 },{ t: "Feb", p: 61500 },
      { t: "Mar", p: 63000 },{ t: "Apr", p: 64200 },
      { t: "May", p: 65800 },{ t: "Jun", p: 65000 },
      { t: "Jul", p: 66100 },{ t: "Aug", p: 67200 },
      { t: "Now", p: 67842 },
    ],
    high: 68500, low: 57200, vol: "$38.2B", mktcap: "$1.33T",
  },
  {
    symbol: "ETH", name: "Ethereum",
    price: 3541.20, change: +1.87, color: "#6366f1",
    sparkline: [3200,3310,3280,3400,3380,3450,3510,3541],
    history: [
      { t: "Nov", p: 2800 },{ t: "Dec", p: 2950 },
      { t: "Jan", p: 3100 },{ t: "Feb", p: 3050 },
      { t: "Mar", p: 3200 },{ t: "Apr", p: 3300 },
      { t: "May", p: 3420 },{ t: "Jun", p: 3380 },
      { t: "Jul", p: 3450 },{ t: "Aug", p: 3510 },
      { t: "Now", p: 3541 },
    ],
    high: 3600, low: 2720, vol: "$18.5B", mktcap: "$425B",
  },
  {
    symbol: "AAPL", name: "Apple Inc.",
    price: 189.45, change: -0.52, color: "#10b981",
    sparkline: [191,190,192,191,190,189,190,189],
    history: [
      { t: "Nov", p: 175 },{ t: "Dec", p: 180 },
      { t: "Jan", p: 185 },{ t: "Feb", p: 182 },
      { t: "Mar", p: 188 },{ t: "Apr", p: 192 },
      { t: "May", p: 191 },{ t: "Jun", p: 189 },
      { t: "Jul", p: 190 },{ t: "Aug", p: 188 },
      { t: "Now", p: 189 },
    ],
    high: 198, low: 164, vol: "$62.1B", mktcap: "$2.91T",
  },
  {
    symbol: "TSLA", name: "Tesla",
    price: 248.30, change: +3.21, color: "#c45a45",
    sparkline: [232,235,238,241,244,245,247,248],
    history: [
      { t: "Nov", p: 210 },{ t: "Dec", p: 218 },
      { t: "Jan", p: 225 },{ t: "Feb", p: 222 },
      { t: "Mar", p: 230 },{ t: "Apr", p: 238 },
      { t: "May", p: 244 },{ t: "Jun", p: 240 },
      { t: "Jul", p: 245 },{ t: "Aug", p: 246 },
      { t: "Now", p: 248 },
    ],
    high: 255, low: 196, vol: "$22.4B", mktcap: "$791B",
  },
  {
    symbol: "GOLD", name: "Gold (XAU/USD)",
    price: 2341.80, change: +0.45, color: "#d97706",
    sparkline: [2310,2318,2325,2320,2330,2335,2338,2341],
    history: [
      { t: "Nov", p: 2180 },{ t: "Dec", p: 2210 },
      { t: "Jan", p: 2240 },{ t: "Feb", p: 2230 },
      { t: "Mar", p: 2270 },{ t: "Apr", p: 2300 },
      { t: "May", p: 2320 },{ t: "Jun", p: 2310 },
      { t: "Jul", p: 2330 },{ t: "Aug", p: 2338 },
      { t: "Now", p: 2341 },
    ],
    high: 2360, low: 2140, vol: "$184B", mktcap: "—",
  },
  {
    symbol: "SPX", name: "S&P 500",
    price: 5248.90, change: +0.78, color: "#8b5cf6",
    sparkline: [5180,5195,5200,5210,5220,5230,5240,5248],
    history: [
      { t: "Nov", p: 4900 },{ t: "Dec", p: 4960 },
      { t: "Jan", p: 5020 },{ t: "Feb", p: 5000 },
      { t: "Mar", p: 5080 },{ t: "Apr", p: 5140 },
      { t: "May", p: 5190 },{ t: "Jun", p: 5180 },
      { t: "Jul", p: 5210 },{ t: "Aug", p: 5240 },
      { t: "Now", p: 5248 },
    ],
    high: 5265, low: 4820, vol: "—", mktcap: "$46.8T",
  },
];

/* ─── Chart helpers (ported from UserDashboard) ─── */
const RANGES = [7, 11, null];

function seeded(n, s) {
  const x = Math.sin(s + n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildCandles(history, vol = 0.018) {
  return history.map((pt, i) => {
    const b = pt.p;
    const r1 = seeded(i,1), r2 = seeded(i,2), r3 = seeded(i,3), r4 = seeded(i,4);
    const open  = i === 0 ? b*(1-vol*0.5) : history[i-1].p*(1+(r1-0.5)*vol);
    const close = b;
    const hi = Math.max(open,close)*(1+r2*vol*0.8);
    const lo = Math.min(open,close)*(1-r3*vol*0.8);
    const volume = Math.round(b*(500+r4*4500));
    return { time: pt.t, open, high: hi, low: lo, close, volume, bull: close >= open };
  });
}

function calcEma(data, p) {
  const k = 2/(p+1); let v = data[0]?.close ?? 0;
  return data.map(d => { v = d.close*k+v*(1-k); return v; });
}

function calcRsi(data, p = 14) {
  const out = new Array(data.length).fill(null);
  if (p >= data.length) return out;
  let g = 0, l = 0;
  for (let i = 1; i <= p && i < data.length; i++) {
    const d = data[i].close - data[i-1].close;
    if (d > 0) g += d; else l -= d;
  }
  let ag = g/p, al = l/p;
  out[p] = parseFloat((100-100/(1+(al===0?Infinity:ag/al))).toFixed(2));
  for (let i = p+1; i < data.length; i++) {
    const d = data[i].close - data[i-1].close;
    ag = (ag*(p-1)+Math.max(d,0))/p;
    al = (al*(p-1)+Math.max(-d,0))/p;
    out[i] = parseFloat((100-100/(1+(al===0?Infinity:ag/al))).toFixed(2));
  }
  return out;
}

function fmtPrice(v) {
  return "$" + Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildOrderBook(asset) {
  const p = asset.price;
  const asks = [], bids = [];
  for (let i = 0; i < 7; i++) {
    asks.push({ price: p*(1+0.0004*(i+1)), size: (0.3+seeded(i,1+i*13)*0.7)*80+10 });
    bids.push({ price: p*(1-0.0004*(i+1)), size: (0.3+seeded(i,2+i*17)*0.7)*80+10 });
  }
  return { asks, bids };
}

const getSignal = (change) => {
  if (change > 2)  return { label: "Strong Buy", style: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" };
  if (change > 0)  return { label: "Buy",        style: "bg-emerald-400/8 text-emerald-300 border-emerald-400/15" };
  if (change > -2) return { label: "Neutral",    style: "bg-white/5 text-white/30 border-white/10" };
  return                  { label: "Sell",       style: "bg-red-400/10 text-red-400 border-red-400/20" };
};

/* ─── Sparkline SVG ─── */
const SparklineSVG = ({ data, color }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const W = 200, H = 44;
  const pts = data.map((v, i) => ({
    x: parseFloat(((i/(data.length-1))*W).toFixed(1)),
    y: parseFloat((H-((v-min)/range)*(H-6)-3).toFixed(1)),
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const polygon  = `${polyline} ${W},${H} 0,${H}`;
  const last = pts[pts.length-1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-11">
      <polygon points={polygon} fill={color} opacity="0.08" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3" fill={color} />
    </svg>
  );
};

/* ─── Asset Card ─── */
const AssetCard = ({ asset, onClick }) => {
  const isPositive = asset.change >= 0;
  const { label: signalLabel, style: signalStyle } = getSignal(asset.change);
  return (
    <button
      onClick={() => onClick(asset)}
      className="bg-[#121010] border border-[#2e2726] rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-[#c45a45]/50 hover:shadow-md hover:shadow-[#c45a45]/5 transition-all duration-200 cursor-pointer text-left w-full group"
      aria-label={`View ${asset.name} chart`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ backgroundColor: `${asset.color}18`, color: asset.color }}
          >
            {asset.symbol.slice(0,2)}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-none">{asset.symbol}</p>
            <p className="text-[10px] text-[#9e9593] mt-0.5 leading-none truncate max-w-20">{asset.name}</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />}
          {Math.abs(asset.change).toFixed(2)}%
        </span>
      </div>
      <SparklineSVG data={asset.sparkline} color={asset.color} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">
          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${signalStyle}`}>
          {signalLabel}
        </span>
      </div>
      <p className="text-[9px] text-white/15 group-hover:text-[#c45a45]/60 transition-colors text-center uppercase tracking-widest">
        Tap to expand
      </p>
    </button>
  );
};

/* ════════════════════════════════════════
   BYBIT-STYLE CHART MODAL
   ════════════════════════════════════════ */
const AssetChartModal = ({ asset: initialAsset, allAssets, onClose }) => {
  const [asset, setAsset]       = useState(initialAsset);
  const [rangeIdx, setRangeIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [tooltip, setTooltip]   = useState(null);

  const candleRef = useRef(null);
  const volRef    = useRef(null);
  const rsiRef    = useRef(null);
  const wrapRef   = useRef(null);

  const candles = useMemo(() => {
    const all = buildCandles(asset.history, 0.018);
    const n = RANGES[rangeIdx];
    return n ? all.slice(-n) : all;
  }, [asset, rangeIdx]);

  const ema9   = useMemo(() => calcEma(candles, 3),  [candles]);
  const ema21  = useMemo(() => calcEma(candles, 7),  [candles]);
  const rsiArr = useMemo(() => calcRsi(candles, Math.min(7, candles.length-1)), [candles]);
  const ob     = useMemo(() => buildOrderBook(asset), [asset]);

  const lastRsi  = rsiArr.filter(Boolean).at(-1);
  const rsiColor = lastRsi > 70 ? "#f6465d" : lastRsi < 30 ? "#0ecb81" : "#f0b90b";

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { const h = e => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);

  const dpr = () => window.devicePixelRatio || 1;
  function setupCtx(el, w, h) {
    const r = dpr(); el.width = w*r; el.height = h*r;
    el.style.width = w+"px"; el.style.height = h+"px";
    const ctx = el.getContext("2d"); ctx.scale(r, r); return ctx;
  }

  const drawCharts = useCallback(() => {
    const chartsCol = wrapRef.current?.querySelector(".bybit-col");
    if (!chartsCol || !candleRef.current || !volRef.current || !rsiRef.current) return;
    const W = chartsCol.clientWidth || 480;
    const mono = "'JetBrains Mono','Fira Code',monospace";

    /* === CANDLE === */
    const CW = W, CH = 220;
    const ctx = setupCtx(candleRef.current, CW, CH);
    const padL=64,padR=14,padT=10,padB=22;
    const chartW=CW-padL-padR, chartH=CH-padT-padB;
    const priceMin = Math.min(...candles.map(c=>c.low))*0.997;
    const priceMax = Math.max(...candles.map(c=>c.high))*1.003;
    const priceRange = priceMax-priceMin||1;
    const toY = v => padT+chartH*(1-(v-priceMin)/priceRange);
    const n=candles.length, gap=chartW/n, bw=Math.max(4,Math.floor(gap*0.65));
    const cx = i => padL+i*gap+gap/2;

    for (let i=0; i<=4; i++) {
      const v=priceMin+(priceMax-priceMin)*(i/4), y=toY(v);
      ctx.strokeStyle="rgba(255,255,255,0.04)"; ctx.lineWidth=0.5; ctx.setLineDash([3,6]);
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(CW-padR,y); ctx.stroke(); ctx.setLineDash([]);
      ctx.font=`9px ${mono}`; ctx.fillStyle="rgba(255,255,255,0.2)";
      ctx.fillText("$"+Number(v).toLocaleString(undefined,{maximumFractionDigits:0}),2,y+3);
    }
    candles.forEach((c,i) => {
      const x=cx(i), col=c.bull?"#0ecb81":"#f6465d";
      const yH=toY(c.high),yL=toY(c.low),yO=toY(c.open),yC=toY(c.close);
      const bodyTop=Math.min(yO,yC), bodyH=Math.max(Math.abs(yO-yC),1.5);
      if (i===hoverIdx) { ctx.fillStyle="rgba(255,255,255,0.05)"; ctx.fillRect(x-gap/2,padT,gap,chartH); }
      ctx.strokeStyle=col; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x,yH); ctx.lineTo(x,bodyTop); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x,bodyTop+bodyH); ctx.lineTo(x,yL); ctx.stroke();
      ctx.fillStyle=col;
      ctx.beginPath(); ctx.roundRect(x-bw/2,bodyTop,bw,bodyH,1); ctx.fill();
    });
    ctx.beginPath(); ctx.strokeStyle=asset.color; ctx.lineWidth=1.5; ctx.setLineDash([]);
    ema9.forEach((v,i)=>{ const x=cx(i),y=toY(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }); ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle="#4a90e2"; ctx.lineWidth=1.5; ctx.setLineDash([5,3]);
    ema21.forEach((v,i)=>{ const x=cx(i),y=toY(v); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }); ctx.stroke(); ctx.setLineDash([]);
    const refY=toY(asset.price);
    ctx.strokeStyle=asset.change>=0?"rgba(14,203,129,0.35)":"rgba(246,70,93,0.35)";
    ctx.lineWidth=0.8; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(padL,refY); ctx.lineTo(CW-padR,refY); ctx.stroke(); ctx.setLineDash([]);
    ctx.font=`9px ${mono}`; ctx.fillStyle="rgba(255,255,255,0.2)";
    candles.forEach((c,i)=>{ ctx.fillText(c.time,cx(i)-10,CH-5); });

    /* === VOLUME === */
    const VW=W,VH=64;
    const vctx=setupCtx(volRef.current,VW,VH);
    const vpadL=64,vpadR=14,vpadT=6,vpadB=4;
    const vchartW=VW-vpadL-vpadR,vchartH=VH-vpadT-vpadB;
    const volMax=Math.max(...candles.map(c=>c.volume));
    const vgap=vchartW/n,vbw=Math.max(3,Math.floor(vgap*0.65));
    const vcx=i=>vpadL+i*vgap+vgap/2;
    candles.forEach((c,i)=>{
      const x=vcx(i),barH=(c.volume/volMax)*vchartH;
      vctx.fillStyle=c.bull?"rgba(14,203,129,0.5)":"rgba(246,70,93,0.5)";
      vctx.beginPath(); vctx.roundRect(x-vbw/2,VH-vpadB-barH,vbw,barH,1); vctx.fill();
    });
    vctx.font=`8px ${mono}`; vctx.fillStyle="rgba(255,255,255,0.18)";
    vctx.fillText((volMax/1e6).toFixed(1)+"M",2,14);

    /* === RSI === */
    const RW=W,RH=72;
    const rctx=setupCtx(rsiRef.current,RW,RH);
    const rpadL=64,rpadR=14,rpadT=6,rpadB=4;
    const rchartW=RW-rpadL-rpadR,rchartH=RH-rpadT-rpadB;
    const rtoY=v=>rpadT+rchartH*(1-v/100);
    const rcx=i=>rpadL+i*(rchartW/n)+(rchartW/n)/2;
    [70,50,30].forEach(lvl=>{
      rctx.strokeStyle=lvl===50?"rgba(255,255,255,0.05)":lvl===70?"rgba(246,70,93,0.2)":"rgba(14,203,129,0.2)";
      rctx.lineWidth=0.7; rctx.setLineDash([3,4]);
      const y=rtoY(lvl); rctx.beginPath(); rctx.moveTo(rpadL,y); rctx.lineTo(RW-rpadR,y); rctx.stroke(); rctx.setLineDash([]);
      rctx.font=`8px ${mono}`; rctx.fillStyle="rgba(255,255,255,0.15)"; rctx.fillText(lvl,2,y+3);
    });
    const validRsi=rsiArr.map((v,i)=>v!=null?{v,i}:null).filter(Boolean);
    if (validRsi.length>1) {
      const grad=rctx.createLinearGradient(0,rpadT,0,RH-rpadB);
      grad.addColorStop(0,"rgba(240,185,11,0.18)"); grad.addColorStop(1,"rgba(240,185,11,0)");
      rctx.fillStyle=grad; rctx.beginPath();
      rctx.moveTo(rcx(validRsi[0].i),rtoY(validRsi[0].v));
      validRsi.forEach(({v,i})=>rctx.lineTo(rcx(i),rtoY(v)));
      rctx.lineTo(rcx(validRsi.at(-1).i),RH-rpadB); rctx.lineTo(rcx(validRsi[0].i),RH-rpadB); rctx.fill();
      rctx.beginPath(); rctx.strokeStyle="#f0b90b"; rctx.lineWidth=1.5;
      validRsi.forEach(({v,i},j)=>{ const x=rcx(i),y=rtoY(v); j===0?rctx.moveTo(x,y):rctx.lineTo(x,y); }); rctx.stroke();
    }
  }, [candles, ema9, ema21, rsiArr, hoverIdx, asset]);

  useEffect(() => { drawCharts(); }, [drawCharts]);
  useEffect(() => { window.addEventListener("resize", drawCharts); return () => window.removeEventListener("resize", drawCharts); }, [drawCharts]);

  const handleMouseMove = useCallback(e => {
    const el = candleRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const padL=64,padR=14, chartW=el.clientWidth-padL-padR, gap=chartW/candles.length;
    const i = Math.max(0, Math.min(candles.length-1, Math.floor((mx-padL)/gap)));
    if (i !== hoverIdx) setHoverIdx(i);
    const c = candles[i]; const bull = c.close >= c.open;
    const pct = (((c.close-c.open)/c.open)*100).toFixed(2);
    setTooltip({
      x: Math.min(e.clientX-rect.left+14, el.clientWidth-160),
      y: Math.max(e.clientY-rect.top-40, 4),
      time: c.time, O: fmtPrice(c.open), H: fmtPrice(c.high),
      C: fmtPrice(c.close), L: fmtPrice(c.low),
      pct, bull, vol: (c.volume/1e6).toFixed(2)+"M",
    });
  }, [candles, hoverIdx]);

  const handleMouseLeave = useCallback(() => { setHoverIdx(-1); setTooltip(null); }, []);

  const pos = asset.change >= 0;
  const mono = "'JetBrains Mono','Fira Code',monospace";

  const statPills = [
    { label: "24h High",  val: fmtPrice(asset.high),                           color: "#0ecb81" },
    { label: "24h Low",   val: fmtPrice(asset.low),                            color: "#f6465d" },
    { label: "Open",      val: fmtPrice(candles[0]?.open ?? asset.price),      color: "rgba(255,255,255,0.8)" },
    { label: "Close",     val: fmtPrice(candles.at(-1)?.close ?? asset.price), color: candles.at(-1)?.bull ? "#0ecb81" : "#f6465d" },
    { label: "Volume",    val: asset.vol,                                        color: "rgba(255,255,255,0.8)" },
    { label: "Mkt Cap",   val: asset.mktcap,                                    color: "rgba(255,255,255,0.8)" },
    { label: "RSI",       val: lastRsi ? lastRsi.toFixed(1) : "—",             color: rsiColor },
    { label: "EMA 9",     val: fmtPrice(ema9.at(-1) ?? asset.price),           color: asset.color },
    { label: "EMA 21",    val: fmtPrice(ema21.at(-1) ?? asset.price),          color: "#4a90e2" },
  ];

  return (
    <div
      style={{ position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(10px)" }}
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}
    >
      <div
        ref={wrapRef}
        style={{
          background:"#0b0e11",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,
          width:"100%",maxWidth:expanded?"calc(100vw - 32px)":980,
          maxHeight:"calc(100vh - 32px)",overflow:"hidden",
          display:"flex",flexDirection:"column",
          boxShadow:"0 32px 80px rgba(0,0,0,0.85)",fontFamily:mono,
          transition:"max-width 0.3s ease",
        }}
      >
        {/* Asset selector */}
        <div style={{display:"flex",gap:4,padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"#131720",overflowX:"auto",scrollbarWidth:"none"}}>
          {allAssets.map(a => (
            <button key={a.symbol}
              onClick={() => { setAsset(a); setHoverIdx(-1); setTooltip(null); }}
              style={{
                padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",
                border:asset.symbol===a.symbol?`1px solid ${a.color}50`:"1px solid transparent",
                background:asset.symbol===a.symbol?"rgba(255,255,255,0.07)":"transparent",
                color:asset.symbol===a.symbol?a.color:"rgba(255,255,255,0.35)",
                fontFamily:mono,whiteSpace:"nowrap",letterSpacing:"0.04em",
              }}
            >
              {a.symbol}
              <span style={{marginLeft:5,fontSize:9,color:a.change>=0?"#0ecb81":"#f6465d"}}>
                {a.change>=0?"+":""}{a.change.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>

        {/* Top bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"#131720",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${asset.color}18`,border:`1px solid ${asset.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:asset.color,letterSpacing:"0.04em"}}>
              {asset.symbol.slice(0,2)}
            </div>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                <span style={{fontSize:15,fontWeight:800,color:"#e8eaf0",letterSpacing:"0.03em"}}>{asset.symbol}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{asset.name}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:4}}>
                <span style={{fontSize:22,fontWeight:900,color:pos?"#0ecb81":"#f6465d",letterSpacing:"-0.02em"}}>{fmtPrice(asset.price)}</span>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,background:pos?"rgba(14,203,129,0.12)":"rgba(246,70,93,0.12)",color:pos?"#0ecb81":"#f6465d",border:`1px solid ${pos?"rgba(14,203,129,0.25)":"rgba(246,70,93,0.25)"}`}}>
                  {pos?"▲ +":"▼ "}{Math.abs(asset.change).toFixed(2)}%
                </span>
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#0ecb81",animation:"bybpulse 1.4s ease-in-out infinite"}}/>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:"0.1em"}}>LIVE</span>
                </span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.04)",borderRadius:8,padding:3}}>
              {["1W","1M","ALL"].map((r,i)=>(
                <button key={r} onClick={()=>setRangeIdx(i)} style={{padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,border:"none",cursor:"pointer",letterSpacing:"0.05em",fontFamily:mono,background:rangeIdx===i?asset.color:"transparent",color:rangeIdx===i?"#000":"rgba(255,255,255,0.35)",transition:"all 0.15s"}}>
                  {r}
                </button>
              ))}
            </div>
            <button onClick={()=>setExpanded(e=>!e)} style={{width:30,height:30,borderRadius:7,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.4)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {expanded?<FaCompress style={{fontSize:10}}/>:<FaExpand style={{fontSize:10}}/>}
            </button>
            <button onClick={onClose} style={{width:30,height:30,borderRadius:7,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.4)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <FaTimes style={{fontSize:11}}/>
            </button>
          </div>
        </div>

        {/* Stat pills */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,0.05)",overflowX:"auto",scrollbarWidth:"none"}}>
          {statPills.map(s=>(
            <div key={s.label} style={{padding:"8px 14px",borderRight:"1px solid rgba(255,255,255,0.05)",minWidth:80,flexShrink:0}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{s.label}</div>
              <div style={{fontSize:12,fontWeight:700,color:s.color,fontFamily:mono}}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Charts + Order Book */}
        <div style={{display:"flex",flex:1,overflow:"hidden"}}>
          <div className="bybit-col" style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{position:"relative",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{position:"absolute",top:6,left:12,fontSize:9,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"0.1em",zIndex:2,display:"flex",alignItems:"center",gap:8}}>
                <FaChartBar style={{fontSize:9}}/><span>Candlestick · OHLCV</span>
                <span style={{fontSize:9,fontWeight:700,color:asset.color}}>── EMA 9</span>
                <span style={{fontSize:9,fontWeight:700,color:"#4a90e2"}}>- - EMA 21</span>
              </div>
              <div style={{position:"relative"}}>
                <canvas ref={candleRef} style={{display:"block",width:"100%",height:220,cursor:"crosshair"}} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}/>
                {tooltip && (
                  <div style={{position:"absolute",left:tooltip.x,top:tooltip.y,pointerEvents:"none",zIndex:10,background:"#131720",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"8px 12px",fontSize:10,fontFamily:mono,minWidth:150,boxShadow:"0 8px 24px rgba(0,0,0,0.6)"}}>
                    <div style={{color:"rgba(255,255,255,0.3)",fontSize:9,marginBottom:5}}>{tooltip.time}</div>
                    {[["O",tooltip.O,"rgba(255,255,255,0.8)"],["H",tooltip.H,"#0ecb81"],["C",tooltip.C,tooltip.bull?"#0ecb81":"#f6465d"],["L",tooltip.L,"#f6465d"]].map(([k,v,c])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",gap:12,margin:"2px 0"}}>
                        <span style={{color:"rgba(255,255,255,0.3)"}}>{k}</span>
                        <span style={{color:c,fontWeight:700}}>{v}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",gap:12,margin:"2px 0"}}>
                      <span style={{color:"rgba(255,255,255,0.3)"}}>%</span>
                      <span style={{color:tooltip.bull?"#0ecb81":"#f6465d",fontWeight:700}}>{tooltip.bull?"+":""}{tooltip.pct}%</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",gap:12,margin:"2px 0"}}>
                      <span style={{color:"rgba(255,255,255,0.3)"}}>Vol</span>
                      <span style={{color:"rgba(255,255,255,0.5)"}}>{tooltip.vol}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{position:"relative",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{position:"absolute",top:4,left:12,fontSize:9,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"0.1em",zIndex:2}}>Volume</div>
              <canvas ref={volRef} style={{display:"block",width:"100%",height:64}}/>
            </div>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",top:4,left:12,fontSize:9,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"0.1em",zIndex:2,display:"flex",alignItems:"center",gap:6}}>
                <span>RSI (14)</span>
                {lastRsi && <span style={{fontWeight:700,color:rsiColor}}>{lastRsi.toFixed(1)}</span>}
              </div>
              <canvas ref={rsiRef} style={{display:"block",width:"100%",height:72}}/>
            </div>
          </div>

          {/* Order Book */}
          <div style={{width:128,flexShrink:0,borderLeft:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",background:"#0f1217",fontSize:10,fontFamily:mono}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:"0.1em",padding:"8px 10px 4px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>Order Book</div>
            <div style={{flex:1,overflow:"hidden"}}>
              {ob.asks.slice().reverse().map((row,i)=>{
                const maxS=Math.max(...ob.asks.map(r=>r.size));
                return (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"1.5px 10px",position:"relative"}}>
                    <div style={{position:"absolute",top:0,bottom:0,right:0,width:`${(row.size/maxS*100).toFixed(0)}%`,background:"rgba(246,70,93,0.1)",borderRadius:2}}/>
                    <span style={{color:"#f6465d",fontWeight:700,fontSize:10}}>{asset.price<100?row.price.toFixed(4):row.price.toFixed(1)}</span>
                    <span style={{color:"rgba(255,255,255,0.35)",fontSize:10}}>{row.size.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:9,color:"#f0b90b",textAlign:"center",padding:"4px 8px",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(240,185,11,0.05)"}}>
              Spread {(((ob.asks[0].price-ob.bids[0].price)/asset.price)*100).toFixed(4)}%
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              {ob.bids.map((row,i)=>{
                const maxS=Math.max(...ob.bids.map(r=>r.size));
                return (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"1.5px 10px",position:"relative"}}>
                    <div style={{position:"absolute",top:0,bottom:0,right:0,width:`${(row.size/maxS*100).toFixed(0)}%`,background:"rgba(14,203,129,0.1)",borderRadius:2}}/>
                    <span style={{color:"#0ecb81",fontWeight:700,fontSize:10}}>{asset.price<100?row.price.toFixed(4):row.price.toFixed(1)}</span>
                    <span style={{color:"rgba(255,255,255,0.35)",fontSize:10}}>{row.size.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{padding:"6px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",background:"#131720",fontSize:9,color:"rgba(255,255,255,0.15)",letterSpacing:"0.07em"}}>
          <span>EMA · RSI · OHLCV · Indicative data only</span>
          <span>NOT FINANCIAL ADVICE</span>
        </div>
      </div>
      <style>{`@keyframes bybpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.5)}}`}</style>
    </div>
  );
};

/* ─── Sub-components ─── */
const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || TIER_STYLE.none;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
};

const StatCard = ({ label, value, color, icon, sub }) => (
  <div className="bg-[#1f1b1b] border border-[#2e2726] p-5 rounded-2xl transition-all duration-200 hover:border-[#c45a45]/30 group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm border bg-[#c45a45]/10 border-[#c45a45]/20 text-[#c45a45]">
        {icon}
      </div>
      {sub && <span className="text-[10px] text-[#9e9593]">{sub}</span>}
    </div>
    <p className="text-[11px] uppercase tracking-widest text-[#9e9593] mb-1">{label}</p>
    <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-xl p-3 text-sm shadow-xl">
        <p className="text-[#9e9593] mb-1 text-xs">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold text-sm">
            {typeof p.value === "number" && p.value > 100
              ? `$${Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SignalTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-xl p-2.5 text-xs shadow-xl">
        <p className="text-[#9e9593] mb-1">{label}</p>
        <p className="text-[#c45a45] font-bold">{payload[0].value}% Signal</p>
      </div>
    );
  }
  return null;
};

/* ─── Main Component ─── */
const Dashboard = () => {
  const [stats,         setStats]         = useState(null);
  const [topList,       setTopList]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [topLoading,    setTopLoading]    = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => { fetchStats(); fetchTopInvestors(); }, []);

  const fetchStats = async () => {
    try { const res = await API.get("dashboard-stats/"); setStats(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchTopInvestors = async () => {
    try { const res = await API.get("top-investors/"); setTopList(res.data); }
    catch (err) { console.error(err); }
    finally { setTopLoading(false); }
  };

  if (loading) return <Loader />;

  const categoryData = stats?.investment_by_category ?? [];
  const monthlyData  = stats?.monthly_investments    ?? [];

  const currentSignal = signalData[signalData.length - 1].strength;
  const signalLabel =
    currentSignal >= 80 ? "Strong Buy" :
    currentSignal >= 60 ? "Buy" :
    currentSignal >= 40 ? "Neutral" : "Weak";
  const signalColor =
    currentSignal >= 80 ? "text-emerald-400" :
    currentSignal >= 60 ? "text-yellow-400" :
    currentSignal >= 40 ? "text-[#9e9593]" : "text-red-400";

  return (
    <DashboardLayout>
      <div className="text-white font-sans max-w-6xl mx-auto space-y-8 min-h-screen bg-[#171515] p-4 rounded-xl">

        {/* Bybit Chart Modal */}
        {selectedAsset && (
          <AssetChartModal
            asset={selectedAsset}
            allAssets={marketAssets}
            onClose={() => setSelectedAsset(null)}
          />
        )}

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#9e9593] mb-1">Admin Overview</p>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-[#9e9593] text-sm mt-1">
              Real-time capital flows, user tiers, and trading performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[#9e9593]">Live</span>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users"
            value={stats?.users ?? 0}
            color="text-white"
            icon={<FaUsers />} sub="All accounts" />
          <StatCard label="Total Investments"
            value={`$${Number(stats?.investments ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-emerald-400"
            icon={<FaChartLine />} sub="Capital deployed" />
          <StatCard label="Total Withdrawals"
            value={`$${Number(stats?.withdrawals ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="text-[#c45a45]"
            icon={<FaArrowDown />} sub="Paid out" />
          <StatCard label="Blocked Accounts"
            value={stats?.blocked_users ?? 0}
            color="text-red-400"
            icon={<FaBan />} sub="Restricted" />
        </div>

        {/* ── TRADING SIGNAL ANALYSIS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Signal Strength Chart */}
          <div className="lg:col-span-2 bg-[#1f1b1b] border border-[#2e2726] rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FaSignal className="text-[#c45a45]" /> Trading Signal Analysis
                </h2>
                <p className="text-[11px] text-[#9e9593] mt-0.5">Live market signal strength over 24h</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-black ${signalColor}`}>{currentSignal}%</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  currentSignal >= 80
                    ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                    : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                }`}>{signalLabel}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full bg-[#121010] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentSignal}%`, background: "linear-gradient(90deg, #c45a45, #e07060)" }}
                />
              </div>
              <span className="text-xs text-[#9e9593] shrink-0">Signal Power</span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signalData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="signalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c45a45" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#c45a45" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: "#9e9593", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#9e9593", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<SignalTooltip />} />
                  <Area type="monotone" dataKey="strength" stroke="#c45a45" strokeWidth={2} fillOpacity={1} fill="url(#signalGrad)" dot={{ fill: "#c45a45", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module Signal Strength */}
          <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-white mb-0.5">Module Signals</h2>
              <p className="text-[11px] text-[#9e9593] mb-4">Live signal per trading engine</p>
            </div>
            <div className="space-y-4">
              {tradingModules.map((mod) => (
                <div key={mod.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#9e9593] flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: mod.color }}>{mod.icon}</span>
                      {mod.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                        style={{ backgroundColor: `${mod.color}18`, color: mod.color }}>
                        {mod.status}
                      </span>
                      <span className="text-white font-bold">{mod.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#121010] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${mod.pct}%`, backgroundColor: mod.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#2e2726] pt-3 mt-4 flex items-center justify-between text-[10px] text-[#9e9593]">
              <span>All systems operational</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>

        {/* ── MARKET OVERVIEW ── */}
        <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FaGlobe className="text-[#c45a45]" /> Market Overview
              </h2>
              <p className="text-[11px] text-[#9e9593] mt-0.5">Live prices · tap any asset to view full chart</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Markets Open
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {marketAssets.map((asset) => (
              <AssetCard key={asset.symbol} asset={asset} onClick={setSelectedAsset} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2e2726] text-[10px] text-[#9e9593]">
            <span>Data updates every 30 seconds</span>
            <span>Prices indicative only · not financial advice</span>
          </div>
        </div>

        {/* ── PLAN DISTRIBUTION + PIE CHART ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Investments by Plan</h2>
            <p className="text-xs text-[#9e9593] mb-5">Capital allocated per plan tier</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#9e9593] italic text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={categoryData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="category" tick={{ fill: "#9e9593", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.04)" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9e9593", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(196,90,69,0.06)" }} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Portfolio Distribution</h2>
            <p className="text-xs text-[#9e9593] mb-5">Share of total capital by plan</p>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-[#9e9593] italic text-sm">No data yet</div>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="total" paddingAngle={3}>
                      {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  {categoryData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[#9e9593] truncate">{entry.category}</span>
                      <span className="ml-auto text-white font-bold shrink-0">
                        ${Number(entry.total).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MONTHLY TREND ── */}
        {monthlyData.length > 0 && (
          <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">Monthly Investment Trend</h2>
            <p className="text-xs text-[#9e9593] mb-5">Total investments received per month</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#9e9593", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.04)" }} tickLine={false} />
                <YAxis tick={{ fill: "#9e9593", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="total" stroke="#c45a45" strokeWidth={2.5}
                  dot={{ fill: "#c45a45", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#c45a45" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── INVESTMENT PLANS ── */}
        <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#2e2726]">
            <h2 className="text-base font-bold text-white">📊 Investment Tiers</h2>
            <p className="text-xs text-[#9e9593] mt-0.5">All available plans and their return ranges</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#121010] text-[#9e9593] uppercase text-[10px] font-bold tracking-wider border-b border-[#2e2726]">
                  <th className="p-4">Plan</th>
                  <th className="p-4 text-center">Duration</th>
                  <th className="p-4 text-right">Min. Investment</th>
                  <th className="p-4 text-right">Max. Investment</th>
                  <th className="p-4 text-center">Returns</th>
                </tr>
              </thead>
              <tbody>
                {INVESTMENT_PLANS.map((plan) => (
                  <tr key={plan.name} className="border-b border-[#2e2726] hover:bg-[#2e2726]/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[#121010] border border-[#2e2726] flex items-center justify-center text-base">
                          {plan.icon}
                        </span>
                        <div>
                          <p className="font-bold text-white">{plan.name} Plan</p>
                          <p className="text-[10px] text-[#9e9593] mt-0.5">Investment Tier</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px]"
                        style={{ backgroundColor: `${plan.color}15`, color: plan.color }}>
                        {plan.duration}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-white">${plan.min.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-white">${plan.max.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px]">
                        <span className="text-emerald-400 font-bold">{plan.minReturn}</span>
                        <span className="text-[#2e2726]">–</span>
                        <span className="text-[#c45a45] font-bold">{plan.maxReturn}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── TOP INVESTORS ── */}
        <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2e2726]">
            <div>
              <h2 className="text-base font-bold text-white">🏆 Top Investors</h2>
              <p className="text-xs text-[#9e9593] mt-0.5">
                Tier by count · 🥈 Silver (1–2) · 🥇 Gold (3–5) · 💎 Diamond (6+)
              </p>
            </div>
            <span className="text-xs bg-[#121010] border border-[#2e2726] text-[#9e9593] px-3 py-1 rounded-full">
              Top {topList.length}
            </span>
          </div>

          {topLoading ? (
            <div className="flex items-center justify-center py-16 text-[#9e9593]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c45a45] mr-3" />
              Loading leaderboard…
            </div>
          ) : topList.length === 0 ? (
            <div className="text-center py-16 text-[#9e9593] italic text-sm">No investors yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#121010] text-[#9e9593] uppercase text-xs font-semibold tracking-wider border-b border-[#2e2726]">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-center">Tier</th>
                    <th className="p-4 text-right">Total Invested</th>
                    <th className="p-4 text-right">Total Profit</th>
                    <th className="p-4 text-right">Wallet</th>
                    <th className="p-4 text-center">Plans</th>
                    <th className="p-4 text-center">#</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((inv) => {
                    const rankLabel =
                      inv.rank === 1 ? "🥇" :
                      inv.rank === 2 ? "🥈" :
                      inv.rank === 3 ? "🥉" : `#${inv.rank}`;
                    return (
                      <tr key={inv.rank} className="border-b border-[#2e2726] hover:bg-[#2e2726]/40 transition-colors">
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-[#121010] border border-[#2e2726] text-[#9e9593]">
                            {rankLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-[#c45a45]">{inv.name}</p>
                        </td>
                        <td className="p-4 text-center"><TierBadge tier={inv.tier} /></td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ${Number(inv.total_invested).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right font-semibold text-yellow-400">
                          ${Number(inv.total_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right text-white font-semibold">
                          ${Number(inv.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            inv.active_plans > 0
                              ? "bg-[#c45a45]/15 text-white border border-[#c45a45]/30"
                              : "bg-[#121010] text-[#9e9593] border border-[#2e2726]"
                          }`}>
                            {inv.active_plans}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[#9e9593] font-semibold">
                          {inv.investment_count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;