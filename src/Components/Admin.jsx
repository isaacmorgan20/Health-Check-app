import { useState } from "react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const appointments = [
    {
      id: 1,
      name: "Isaac Morgan",
      package: "Full Body Check",
      date: "2026-05-20",
      time: "10:00 AM",
      status: "Pending"
    },
    {
      id: 2,
      name: "Ama Serwaa",
      package: "Basic Health Check",
      date: "2026-05-21",
      time: "09:00 AM",
      status: "Completed"
    }
  ];

  const packages = [
    { id: 1, name: "Basic Health Check", price: "GHS 150" },
    { id: 2, name: "Full Body Check", price: "GHS 400" },
    { id: 3, name: "Heart Check", price: "GHS 250" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">Health Admin</h1>

        <ul className="space-y-3">
          <li
            className={`p-2 rounded cursor-pointer ${activeTab === "dashboard" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={`p-2 rounded cursor-pointer ${activeTab === "appointments" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </li>

          <li
            className={`p-2 rounded cursor-pointer ${activeTab === "packages" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("packages")}
          >
            Packages
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Total Appointments</h3>
                <p className="text-2xl">{appointments.length}</p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Total Packages</h3>
                <p className="text-2xl">{packages.length}</p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Pending</h3>
                <p className="text-2xl">
                  {appointments.filter(a => a.status === "Pending").length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>

            <table className="w-full bg-white shadow rounded overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Package</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3">{a.name}</td>
                    <td className="p-3">{a.package}</td>
                    <td className="p-3">{a.date}</td>
                    <td className="p-3">{a.time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-white text-sm ${a.status === "Pending" ? "bg-yellow-500" : "bg-green-600"}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Packages */}
        {activeTab === "packages" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Packages</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {packages.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-gray-600">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
