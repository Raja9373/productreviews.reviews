import React from "react";
import { Package, Truck, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export const FlashOrderTracker: React.FC = () => {
  const sampleOrders = [
    {
      store: "Amazon India",
      item: "OnePlus Nord CE4 5G (Dark Chrome)",
      status: "Out for Delivery",
      eta: "Today, by 4:00 PM",
      statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800"
    },
    {
      store: "Amazon US",
      item: "Sony WH-1000XM5 Wireless Headphones",
      status: "Shipped",
      eta: "Arriving Tomorrow",
      statusColor: "text-[#FFE600] bg-amber-950/40 border-amber-800"
    }
  ];

  return (
    <section id="order-tracker" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600]/10 border border-[#FFE600]/25 text-[#FFE600] text-xs font-mono font-bold uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Universal Logistics</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track all your online orders in one single dashboard
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            No more logging into 10 different retailer apps. Orders from Amazon, Flipkart, Myntra, and international couriers sync into your unified productreviews.review timeline.
          </p>

          <div className="pt-2">
            <button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
              <span>View Tracking Simulation</span>
              <ArrowRight className="w-4 h-4 text-[#FFE600]" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {sampleOrders.map((ord, idx) => (
            <div
              key={idx}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFE600] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">{ord.store}</div>
                  <h4 className="text-sm font-bold text-white leading-snug">{ord.item}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{ord.eta}</span>
                  </div>
                </div>
              </div>

              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border self-start sm:self-center ${ord.statusColor}`}>
                {ord.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
