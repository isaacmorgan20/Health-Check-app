import { useState, useEffect } from "react";
import useUserStore from "../Context/UserStore";
import usePackageStore from "../Context/packageStore";
import { notifyClient } from "../Utils/notify";

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
  const [messageTarget, setMessageTarget] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [recordTarget, setRecordTarget] = useState(null);
  const [recordSearch, setRecordSearch] = useState("");
  const [newRecord, setNewRecord] = useState({ type: "Visit note", title: "", details: "" });
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

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
    notifyClient(appointment, {
      subject: `Your appointment is ${status}`,
      body: `Hello ${appointment.name},\n\nYour appointment for ${
        appointment.package || "a health checkup"
      } on ${appointment.date || "your chosen date"} at ${
        appointment.time || "your chosen time"
      } has been updated to: ${status}.\n\nWe look forward to seeing you.\nHerbal Homeopathic Center`,
    });
  };

  const handleDelete = async (appointment) => {
    if (window.confirm(`Delete appointment for ${appointment.name}?`)) {
      await deleteUser(appointment.id);
    }
  };

  const openMessage = (appointment) => {
    setMessageTarget(appointment);
    setAdminMessage("");
  };

  const liveTarget = appointments.find((a) => a.id === messageTarget?.id) || messageTarget;

  const sendAdminMessage = async () => {
    const text = adminMessage.trim();
    if (!text || !liveTarget) return;
    await updateUser(liveTarget.id, {
      messages: [
        ...(liveTarget.messages || []),
        { from: "admin", text, at: Date.now() },
      ],
    });
    setAdminMessage("");
    notifyClient(liveTarget, {
      subject: "New message from the clinic",
      body: `Hello ${liveTarget.name},\n\nYou have a new message from the clinic:\n\n"${text}"\n\nReply anytime on your Messages page.\nHerbal Homeopathic Center`,
    });
  };

  const conversations = appointments
    .filter((a) => (a.messages || []).length > 0)
    .map((a) => ({
      ...a,
      lastMessage: [...(a.messages || [])].sort((x, y) => y.at - x.at)[0],
    }))
    .sort((x, y) => y.lastMessage.at - x.lastMessage.at);

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

  const recordTypes = ["Visit note", "Diagnosis", "Test result", "Prescription", "Vital signs"];

  const stamp = () => Date.now();

  const liveRecordTarget =
    appointments.find((a) => a.id === recordTarget?.id) || recordTarget;

  const totalPaid = (appt) =>
    (appt.paymentRecords || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const balance = (appt) =>
    Math.max(0, Number(appt.price || 0) - totalPaid(appt));

  const addRecord = async () => {
    if (!newRecord.details.trim() || !liveRecordTarget) return;
    await updateUser(liveRecordTarget.id, {
      records: [
        ...(liveRecordTarget.records || []),
        {
          type: newRecord.type,
          title: newRecord.title.trim(),
          details: newRecord.details.trim(),
          at: stamp(),
        },
      ],
    });
    setNewRecord({ type: "Visit note", title: "", details: "" });
  };

  const logPayment = async () => {
    const amount = Number(paymentAmount);
    if (!amount || !liveRecordTarget) return;
    const records = [
      ...(liveRecordTarget.paymentRecords || []),
      { amount, note: paymentNote.trim(), at: stamp(), method: "cash" },
    ];
    const paid = records.reduce((s, p) => s + Number(p.amount || 0), 0);
    const settled = paid >= Number(liveRecordTarget.price || 0);
    await updateUser(liveRecordTarget.id, {
      paymentRecords: records,
      ...(settled ? { paymentStatus: "paid" } : {}),
    });
    setPaymentAmount("");
    setPaymentNote("");
  };

  const filteredRecords = appointments.filter((a) => {
    if (!recordSearch) return true;
    const q = recordSearch.toLowerCase();
    return (
      (a.name || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q) ||
      (a.package || "").toLowerCase().includes(q)
    );
  });

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

          <li
            className={`p-2 rounded cursor-pointer whitespace-nowrap ${activeTab === "messages" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </li>

          <li
            className={`p-2 rounded cursor-pointer whitespace-nowrap ${activeTab === "records" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("records")}
          >
            Records
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => openMessage(a)}
                              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition"
                            >
                              Message{(a.messages || []).length > 0 ? ` (${a.messages.length})` : ""}
                            </button>
                            <button
                              onClick={() => handleDelete(a)}
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

        {/* Messages */}
        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Messages</h2>

            {conversations.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded shadow">
                No messages yet. Client replies will show up here.
              </p>
            ) : (
              <div className="bg-white shadow rounded overflow-hidden">
                {conversations.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => openMessage(a)}
                    className="w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-blue-50 transition flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-900 truncate">
                          {a.name}
                        </span>
                        {a.lastMessage.from === "client" && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            New reply
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 truncate">
                        {a.lastMessage.from === "admin" ? "You: " : `${a.name}: `}
                        {a.lastMessage.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {a.package || "Appointment"} · {new Date(a.lastMessage.at).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                      {(a.messages || []).length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Records */}
        {activeTab === "records" && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">Records</h2>
              <input
                type="text"
                placeholder="Search patient, email or package..."
                value={recordSearch}
                onChange={(e) => setRecordSearch(e.target.value)}
                className="ml-auto border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              />
            </div>

            {filteredRecords.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded shadow">
                No appointments found.
              </p>
            ) : (
              <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left p-3">Patient</th>
                      <th className="text-left p-3">Package</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Payment</th>
                      <th className="text-left p-3">Records</th>
                      <th className="text-left p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((a) => {
                      const bal = balance(a);
                      return (
                        <tr key={a.id} className="border-t border-gray-100">
                          <td className="p-3">
                            <span className="font-semibold text-blue-900">{a.name}</span>
                            <span className="block text-xs text-gray-400">{a.email}</span>
                          </td>
                          <td className="p-3">{a.package || "—"}</td>
                          <td className="p-3">{a.date || "—"}</td>
                          <td className="p-3">
                            <span className="font-medium">GHS {Number(a.price || 0)}</span>
                            <span className="block text-xs text-gray-400">
                              {bal > 0 ? `Balance GHS ${bal}` : "Paid in full"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                              {(a.records || []).length} record{(a.records || []).length === 1 ? "" : "s"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setRecordTarget(a)}
                              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition"
                            >
                              View / Add
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Record Modal */}
        {recordTarget && liveRecordTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Records — {liveRecordTarget.name}</h3>
                  <p className="text-sm text-gray-500">
                    {liveRecordTarget.package || "Appointment"} · {liveRecordTarget.date || "Date TBD"} ·{" "}
                    <span className="font-medium">GHS {Number(liveRecordTarget.price || 0)}</span>
                  </p>
                </div>
                <button
                  onClick={() => setRecordTarget(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Payment status */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400">Paid</p>
                  <p className="font-bold text-green-600">GHS {totalPaid(liveRecordTarget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="font-bold text-red-500">GHS {balance(liveRecordTarget)}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-24 border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Note (optional)"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="flex-1 min-w-24 border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={logPayment}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Log payment
                  </button>
                </div>
              </div>

              {/* Payment history */}
              {(liveRecordTarget.paymentRecords || []).length > 0 && (
                <div className="border border-gray-100 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm text-blue-900">Payment history</h4>
                  <ul className="space-y-1">
                    {(liveRecordTarget.paymentRecords || []).map((p, i) => (
                      <li key={i} className="text-sm flex justify-between">
                        <span>
                          GHS {p.amount}{" "}
                          <span className="text-gray-400">· {p.note || "cash"} · {new Date(p.at).toLocaleString()}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add record */}
              <div className="border border-gray-100 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm text-blue-900">Add record</h4>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                    className="border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {recordTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Title (e.g. Blood pressure)"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                    className="flex-1 min-w-32 border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <textarea
                  placeholder="Details / notes..."
                  value={newRecord.details}
                  onChange={(e) => setNewRecord({ ...newRecord, details: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={addRecord}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Save record
                </button>
              </div>

              {/* Records list */}
              <div className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm text-blue-900">All records</h4>
                {(liveRecordTarget.records || []).length === 0 ? (
                  <p className="text-sm text-gray-400">No records yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {(liveRecordTarget.records || []).slice().reverse().map((r, i) => (
                      <li key={i} className="text-sm bg-gray-50 rounded-lg p-3">
                        <span className="inline-block text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold mr-2 uppercase">
                          {r.type}
                        </span>
                        <span className="font-semibold">{r.title}</span>
                        <span className="text-gray-400 text-xs"> · {new Date(r.at).toLocaleString()}</span>
                        {r.details && <p className="text-gray-600 mt-1">{r.details}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageTarget && liveTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Message — {liveTarget.name}</h3>
                <button
                  onClick={() => setMessageTarget(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="h-64 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-3 bg-gray-50">
                {(liveTarget.messages || []).length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-10">
                    No messages yet. Say hi to the patient!
                  </p>
                ) : (
                  (liveTarget.messages || []).map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg text-sm max-w-[85%] ${
                        msg.from === "admin"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-green-100 text-green-900 ml-auto"
                      }`}
                    >
                      <p className="font-semibold text-xs mb-0.5">
                        {msg.from === "admin" ? "Clinic" : liveTarget.name}
                      </p>
                      {msg.text}
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(msg.at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAdminMessage()}
                  className="flex-1 border border-gray-300 rounded-lg p-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={sendAdminMessage}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;