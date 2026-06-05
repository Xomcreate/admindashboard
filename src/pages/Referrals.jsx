import DashboardLayout from "../layouts/DashboardLayout";

function Referrals() {
  return (
    <DashboardLayout>
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold">
          Referrals
        </h1>

        <div className="bg-[#1f1b1b] rounded-xl p-6 mt-6">
          <h2 className="font-semibold mb-3">
            Your Referral Link
          </h2>

          <div className="bg-[#121010] p-3 rounded-lg break-all">
            https://yourdomain.com/register?ref=USER123
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Referrals;