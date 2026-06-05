import DashboardLayout from "../layouts/DashboardLayout";

function ProfitHistory() {
  return (
    <DashboardLayout>
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold">
          Profit History
        </h1>

        <div className="mt-6 bg-[#1f1b1b] p-6 rounded-xl">
          Profit records will appear here.
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfitHistory;