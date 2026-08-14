import { useState, useEffect } from "react";
import useUserStore from "../Context/UserStore";
import usePackageStore from "../Context/packageStore";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const appointments = useUserStore((state) => state.users);
  const listenToUsers = useUserStore((state) => state.listenToUsers);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  const profiles = useUserStore((state) => state.profiles);

  const packages = usePackageStore((state) => state.packages);
  const listenToPackages = usePackageStore((state) => state.listenToPackages);
  const seedPackages = usePackageStore((state) => state.seedPackages);
  const addPackage = usePackageStore((state) => state.addPackage);
  const updatePackage = usePackageStore((state) => state.updatePackage);
  const deletePackage = usePackageStore((state) => state.deletePackage);

  const [editingPkg, setEditingPkg] = useState(null);
  const [newPkg, setNewPkg] = useState({ name: "", description: "", price: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const unsubUsers = listenToUsers();
    const unsubPackages = listenToPackages();
    return () => {
      unsubUsers();
      unsubPackages();
    };
  }, [listenToUsers, listenToPackages]);

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

  // Filtered appointments for the appointments tab
  const filtered = appointments.filter((a) => {
    const matchesSearch =
      !search ||
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.package || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || (a.status || "Pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const changeStatus = async (appointment, status) => {
    await updateUser(appointment.id, { status });
  };

  const handleDelete = async (appointment) => {
    if (window.confirm(`Delete appointment for ${appointment.name}?`)) {
      await deleteUser(appointment.id);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Package", "Date", "Time", "Price", "Payment", "Status", "Contact", "Email"];
    const rows = filtered.map((a) => [
      a.name || "",
      a.package || "",
      a.date || "",
      a.time || "",
      a.price || 0,
      a.paymentStatus || "clinic",
      a.status || "Pending",
      a.contact || "",
      a.email || "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePackage = async () => {
    if (!editingPkg) return;
    await updatePackage(editingPkg.id, {
      name: editingPkg.name,
      description: editingPkg.description,
      price: Number(editingPkg.price) || 0,
      disabled: !!editingPkg.disabled,
    });
    setEditingPkg(null);
  };

  const submitNewPackage = async () => {
    if (!newPkg.name.trim()) return;
    await addPackage({
      name: newPkg.name.trim(),
      description: newPkg.description.trim(),
      price: Number(newPkg.price) || 0,
      type: "Checkup",
      disabled: false,
    });
    setNewPkg({ name: "", description: "", price: 0 });
    setShowAddForm(false);
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

          <li
            className={`p-2 rounded cursor-pointer whitespace-nowrap ${activeTab === "packages" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("packages")}
          >
            Packages
          </li>

          <li
            className={`p-2 rounded cursor-pointer whitespace-nowrap ${activeTab === "users" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("users")}
          >
            Users
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <button
                onClick={exportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by name or package..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 px-3 text-sm flex-1 min-w-[200px]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 px-3 text-sm"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded shadow">
                No appointments match your filters.
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
                    {filtered.map((a) => (
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

        {/* Packages */}
        {activeTab === "packages" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold">Manage Packages</h2>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await seedPackages();
                  }}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Load Defaults
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  + Add Package
                </button>
              </div>
            </div>

            {showAddForm && (
              <div className="bg-white p-4 rounded shadow mb-4 space-y-3">
                <h3 className="font-semibold">New Package</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={newPkg.name}
                  onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 px-3 text-sm w-full"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newPkg.description}
                  onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 px-3 text-sm w-full"
                />
                <input
                  type="number"
                  placeholder="Price (GHS)"
                  value={newPkg.price}
                  onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 px-3 text-sm w-full"
                />
                <button
                  onClick={submitNewPackage}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Save Package
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className={`border-t ${pkg.disabled ? "opacity-50" : ""}`}>
                      <td className="p-3">{pkg.name}</td>
                      <td className="p-3 text-sm text-gray-600">{pkg.description || "-"}</td>
                      <td className="p-3">GHS {pkg.price}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-white text-sm ${pkg.disabled ? "bg-gray-500" : "bg-green-600"}`}>
                          {pkg.disabled ? "Hidden" : "Active"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingPkg(pkg)}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => updatePackage(pkg.id, { disabled: !pkg.disabled })}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            {pkg.disabled ? "Enable" : "Hide"}
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete package "${pkg.name}"?`)) {
                                await deletePackage(pkg.id);
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Modal */}
            {editingPkg && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-3">
                  <h3 className="font-bold text-lg">Edit Package</h3>
                  <input
                    type="text"
                    value={editingPkg.name}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 px-3 text-sm w-full"
                  />
                  <input
                    type="text"
                    value={editingPkg.description}
                    onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 px-3 text-sm w-full"
                  />
                  <input
                    type="number"
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 px-3 text-sm w-full"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!editingPkg.disabled}
                      onChange={(e) => setEditingPkg({ ...editingPkg, disabled: e.target.checked })}
                    />
                    <label className="text-sm">Hidden from booking</label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={savePackage}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPkg(null)}
                      className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

            {profiles.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded shadow">
                No registered users yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow rounded overflow-hidden">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-3 font-medium">{p.name || "-"}</td>
                        <td className="p-3">{p.email || "-"}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}
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