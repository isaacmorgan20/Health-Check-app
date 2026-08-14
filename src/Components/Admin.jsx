import { useState, useEffect } from "react";
import useUserStore from "../Context/UserStore";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const appointments = useUserStore((state) => state.users);
  const fetchAppointments = useUserStore((state) => state.fetchAppointments);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const total = appointments.length;
  const pending = appointments.filter(
    (a) => a.status === "Pending" || a.paymentStatus === "unpaid"
  ).length;
  const paid = appointments.filter(
    (a) => a.paymentStatus === "paid"
  ).length;
  const revenue = appointments
    .filter((a) => a.paymentStatus === "paid" || a.paymentStatus === "clinic")
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  const changeStatus = async (appointment, status) => {
    await updateUser(appointment.id, { status });
  };

  const handleDelete = async (appointment) => {
    if (window.confirm(`Delete appointment for ${appointment.name}?`)) {
      await deleteUser(appointment.id);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-600";
      case "Cancelled": return "bg-red-600";
      case "Pending": return "bg-yellow-500";
      default: return "bg-blue-600";
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-blue-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">Health Admin</h1>

        <ul className="flex md:flex-col gap-3 md:space-y-3 overflow-x-auto pb-2 md:pb-0">
          <li
            className={`p-2 rounded cursor-pointer whitespace-nowrap ${activeTab === "dashboard" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={`p-2 rounded cursor-pointer whitespace-nowrap ${activeTab === "appointments" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Total Appointments</h3>
                <p className="text-2xl">{total}</p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Pending / Unpaid</h3>
                <p className="text-2xl">{pending}</p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">Paid</h3>
                <p className="text-2xl">{paid}</p>
              </div>

              <div className="bg-white p-4 rounded shadow col-span-full sm:col-span-3">
                <h3 className="text-lg font-semibold">Revenue (paid + clinic)</h3>
                <p className="text-2xl text-green-600">GHC {revenue}</p>
              </div>
            </div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>

            {appointments.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded shadow">
                No appointments yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow rounded overflow-hidden">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Package</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Time</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Payment</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="p-3">{a.name}</td>
                        <td className="p-3">{a.package || "-"}</td>
                        <td className="p-3">{a.date || "-"}</td>
                        <td className="p-3">{a.time || "-"}</td>
                        <td className="p-3">GHC {a.price || 0}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-white text-sm ${a.paymentStatus === "paid" ? "bg-green-600" : a.paymentStatus === "unpaid" ? "bg-red-500" : "bg-yellow-500"}`}>
                            {a.paymentStatus === "clinic" ? "Clinic" : (a.paymentStatus || "N/A")}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={a.status || "Pending"}
                            onChange={(e) => changeStatus(a, e.target.value)}
                            className={`px-2 py-1 rounded text-white text-sm border-none outline-none cursor-pointer ${statusColor(a.status || "Pending")}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDelete(a)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;