import DashboardLayout from "../layouts/DashboardLayout";

function InvestmentPlans() {
  const plans = [
    {
      name: "Silver Plan",
      roi: "25%",
      min: "$500,000",
      max: "$2,000,000",
      icon: "🥈",
    },
    {
      name: "Gold Plan",
      roi: "25%",
      min: "$500,000",
      max: "$2,000,000",
      icon: "🥇",
    },
    {
      name: "Diamond Plan",
      roi: "25%",
      min: "$500,000",
      max: "$2,000,000",
      icon: "💎",
    },
  ];

  return (
    <DashboardLayout>
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-6">
          Investment Plans
        </h1>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-[#1f1b1b] p-6 rounded-xl border border-[#2e2726]"
            >
              <h2 className="text-2xl mb-4">
                {plan.icon}
              </h2>

              <h3 className="font-bold text-lg">
                {plan.name}
              </h3>

              <p>ROI: {plan.roi} Daily</p>
              <p>Min: {plan.min}</p>
              <p>Max: {plan.max}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InvestmentPlans;