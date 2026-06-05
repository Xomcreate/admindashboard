import DashboardLayout from "../layouts/DashboardLayout";

function CopyTrading() {
  return (
    <DashboardLayout>
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold">
          Copy Trading
        </h1>

        <div className="mt-6 bg-[#1f1b1b] p-6 rounded-xl">
          Copy professional traders automatically.
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CopyTrading;