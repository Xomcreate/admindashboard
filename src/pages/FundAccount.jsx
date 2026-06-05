import DashboardLayout from "../layouts/DashboardLayout";

function FundAccount() {
  return (
    <DashboardLayout>
      <div className="text-white max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Fund Account</h1>

        <div className="bg-[#1f1b1b] border border-[#2e2726] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Deposit Funds
          </h2>

          <p className="text-[#9e9593]">
            Fund your account using Bitcoin.
          </p>

          <div className="mt-4 bg-[#121010] p-4 rounded-lg">
            <p className="text-sm text-[#9e9593] mb-2">
              BTC Wallet Address
            </p>

            <p className="font-mono break-all">
              1ABCXYZBTCWALLETADDRESS
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default FundAccount;