import { useEffect, useState } from "react";
import {
  getGroups,
  createGroup,
  getGroupExpenses,
  addExpense,
  getSettlement,
  deleteGroup,
} from "../services/groupService";
import api from "../services/apiClient";

export default function GroupExpenses() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [totals, setTotals] = useState({});
  const [groupForm, setGroupForm] = useState({ name: "", newMember: "" });
  const [addedMembers, setAddedMembers] = useState([]);
  const [memberStatus, setMemberStatus] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
  });
  const [sortOption, setSortOption] = useState("date");

  const fetchGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddMember = async () => {
    const identifier = groupForm.newMember?.trim();
    if (!identifier) return;

    try {
      setMemberStatus("🔍 Checking user...");
      const res = await api.get(`/auth/search?query=${identifier}`);
      const users = res.data;

      if (users.length === 0) {
        setMemberStatus(`❌ No user found for "${identifier}"`);
      } else {
        const user = users[0];
        if (addedMembers.some((m) => m._id === user._id)) {
          setMemberStatus(`⚠️ ${user.name} is already added.`);
        } else {
          setAddedMembers([...addedMembers, user]);
          setMemberStatus(`✅ ${user.name} added successfully!`);
        }
      }
    } catch {
      setMemberStatus("⚠️ Error verifying user.");
    } finally {
      setGroupForm({ ...groupForm, newMember: "" });
      setTimeout(() => setMemberStatus(""), 3000);
    }
  };

  const handleRemoveMember = (index) =>
    setAddedMembers(addedMembers.filter((_, i) => i !== index));

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name) return alert("Please enter a group name.");
    if (addedMembers.length === 0) return alert("Add at least one member.");

    const memberIdentifiers = addedMembers.map((m) => m.email || m.mobile);

    await createGroup({
      name: groupForm.name,
      membersIdentifiers: memberIdentifiers,
    });


    setGroupForm({ name: "", newMember: "" });
    setAddedMembers([]);
    setMemberStatus("");
    fetchGroups();
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteGroup(groupId);
      setGroups(groups.filter((g) => g._id !== groupId));
    } catch (err) {
      if (err.response?.status === 403) {
        alert("❌ You are not allowed to delete this group.");
      } else {
        alert("⚠️ Something went wrong while deleting.");
      }
      console.error("❌ Error deleting group:", err);
    }
  };



  const loadGroup = async (group) => {
    setSelectedGroup(group);
    const exp = await getGroupExpenses(group._id);
    const settle = await getSettlement(group._id);

    // sort latest first
    const sortedExp = [...exp].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setExpenses(sortedExp);
    setSettlements(settle.settlements);

    const spent = {};
    group.members.forEach((m) => (spent[m._id] = 0));
    exp.forEach((e) => {
      if (e.paidBy?._id) spent[e.paidBy._id] += Number(e.amount);
    });
    setTotals(spent);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await addExpense({
      groupId: selectedGroup._id,
      description: expenseForm.description,
      amount: expenseForm.amount,
      paidBy: expenseForm.paidBy,
    });
    setExpenseForm({ description: "", amount: "", paidBy: "" });
    loadGroup(selectedGroup);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortOption === "name") {
      return a.paidBy.name.localeCompare(b.paidBy.name);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div
      className="container py-5"
      style={{ minHeight: "100vh", background: "#f8fafc" }}
    >
      <h2 className="fw-bold text-center mb-4 text-primary">
        👥 Group Expense Manager
      </h2>

      {/* Create Group Section */}
      {/* 🧩 Create Group Section */}
      <div
        className="card border-0 shadow-lg p-4 rounded-4 mb-5"
        style={{
          background: "linear-gradient(135deg, #f8fbff, #ffffff)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h4 className="fw-bold text-primary mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-people-fill fs-4"></i> Create a New Group
        </h4>

        <form
          onSubmit={handleCreateGroup}
          className="row g-3 align-items-end justify-content-center"
        >
          {/* Group Name */}
          <div className="col-md-4">
            <label className="form-label fw-semibold text-secondary">
              Group Name
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-chat-dots text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="e.g. Goa Trip, Roommates"
                value={groupForm.name}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Add Member Field */}
          <div className="col-md-5">
            <label className="form-label fw-semibold text-secondary">
              Add Member (Email or Phone)
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i
                  className={`bi ${groupForm.newMember.includes("@")
                    ? "bi-envelope text-info"
                    : "bi-telephone text-success"
                    }`}
                ></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Enter email or phone number"
                value={groupForm.newMember}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, newMember: e.target.value })
                }
              />
              <button
                type="button"
                className="btn btn-outline-primary fw-bold d-flex align-items-center gap-1"
                onClick={handleAddMember}
                disabled={!groupForm.newMember}
              >
                <i className="bi bi-person-plus-fill"></i> Add
              </button>
            </div>

            {/* Member Add Status */}
            {memberStatus && (
              <small
                className={`mt-2 d-block fw-semibold ${memberStatus.includes("❌") || memberStatus.includes("⚠️")
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {memberStatus}
              </small>
            )}
          </div>

          {/* Create Button */}
          <div className="col-md-3 d-grid">
            <button
              className="btn btn-info text-white fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 rounded-pill"
              type="submit"
            >
              <i className="bi bi-check-circle-fill"></i> Create Group
            </button>
          </div>
        </form>

        {/* Members Added Display */}
        {addedMembers.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold text-secondary mb-2 d-flex align-items-center gap-1">
              <i className="bi bi-person-lines-fill text-info"></i> Members Added
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {addedMembers.map((m, i) => (
                <div
                  key={i}
                  className="badge bg-light border border-info text-dark rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
                  style={{
                    transition: "0.2s",
                  }}
                >
                  <div
                    className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, fontSize: "0.8rem" }}
                  >
                    {m.name[0].toUpperCase()}
                  </div>
                  <span className="fw-semibold">{m.name}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger border-0 py-0 px-1"
                    onClick={() => handleRemoveMember(i)}
                    title="Remove member"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* 🧩 Groups List */}
      <h5 className="fw-bold mb-3 text-secondary d-flex align-items-center gap-2">
        <i className="bi bi-people-fill text-info"></i> Your Groups
      </h5>

      <div className="row g-4">
        {groups.length === 0 ? (
          <p className="text-muted text-center">
            No groups yet. Create one above!
          </p>
        ) : (
          groups.map((g) => (
            <div key={g._id} className="col-md-4">
              <div
                className={`card border-0 rounded-4 p-4 shadow-sm position-relative h-100 ${selectedGroup?._id === g._id ? "border-primary border-3" : ""
                  }`}
                style={{
                  transition: "transform 0.25s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => loadGroup(g)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0px)")
                }
              >
                {/* Group Icon */}
                <div className="fs-2 mb-2">💼</div>

                {/* Group Title */}
                <h5 className="fw-bold text-primary mb-1">{g.name}</h5>
                <p className="text-muted small mb-3">
                  {g.members.length} {g.members.length === 1 ? "Member" : "Members"}
                </p>

                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2 mt-auto">
                  <button
                    className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadGroup(g);
                    }}
                  >
                    <i className="bi bi-eye"></i> View
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(g._id);
                    }}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>

                {/* Decorative background accent */}
                <div
                  className="position-absolute"
                  style={{
                    bottom: 0,
                    right: 0,
                    opacity: 0.05,
                    fontSize: "4rem",
                  }}
                >
                  💸
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Selected Group */}
      {selectedGroup && (
        <div className="mt-5 card border-0 shadow-lg p-4 rounded-4">
          <h4 className="fw-bold text-info mb-3">
            📊 {selectedGroup.name} — Group Details
          </h4>

          {/* Add Expense */}
          <form onSubmit={handleAddExpense} className="row g-2 mb-4">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Amount ₹"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={expenseForm.paidBy}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, paidBy: e.target.value })
                }
                required
              >
                <option value="">Paid by...</option>
                {selectedGroup.members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-success">Add</button>
            </div>
          </form>

          {/* Totals */}
          <h6 className="fw-bold mb-2 text-center">💰 Total Spent by Each Member</h6>
          <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
            {selectedGroup.members.map((m) => (
              <div
                key={m._id}
                className="card p-3 text-center border-0 shadow-sm rounded-4 bg-light"
                style={{ width: "200px" }}
              >
                <div
                  className="rounded-circle bg-info text-white mx-auto mb-2 d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 50, height: 50, fontSize: "1.2rem" }}
                >
                  {m.name[0].toUpperCase()}
                </div>
                <h6 className="fw-bold mb-1">{m.name}</h6>
                <span className="text-primary fw-bold fs-6">
                  ₹{totals[m._id] || 0}
                </span>
              </div>
            ))}
          </div>



          {/* Settlement */}
          <h6 className="fw-bold mb-2">💹 Settlement Summary</h6>
          <div className="row g-3">
            {settlements.length ? (
              settlements.map((s, i) => {
                const from = selectedGroup.members.find(
                  (m) => m._id === s.from
                )?.name;
                const to = selectedGroup.members.find(
                  (m) => m._id === s.to
                )?.name;
                return (
                  <div key={i} className="col-md-6">
                    <div
                      className="card border-0 shadow-sm p-3 rounded-3 d-flex align-items-center justify-content-between"
                      style={{
                        background:
                          "linear-gradient(135deg, #e3f2fd, #ffffff 70%)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 35, height: 35 }}
                        >
                          {from?.[0]}
                        </div>
                        <div>
                          <strong>{from}</strong>
                          <div className="small text-muted">gives</div>
                        </div>
                      </div>

                      <div className="text-success fw-bold fs-5">₹{s.amount}</div>

                      <div className="d-flex align-items-center gap-3">
                        <div>
                          <strong>{to}</strong>
                          <div className="small text-muted">receives</div>
                        </div>
                        <div
                          className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 35, height: 35 }}
                        >
                          {to?.[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center text-success fw-bold">
                ✅ All settled!
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div className="d-flex justify-content-end mb-2">
            <select
              className="form-select w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {/* Expenses */}
          <h6 className="fw-bold mb-2">💵 Expenses</h6>
          <div className="list-group mb-4">
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map((e) => (
                <div
                  key={e._id}
                  className="list-group-item border-0 shadow-sm mb-2 rounded-3 p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #e0f7fa, #ffffff 80%)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 text-primary">
                        {e.description}
                      </h6>
                      <small className="text-muted">
                        Paid by {e.paidBy.name} • {formatDate(e.createdAt)}
                      </small>
                    </div>
                    <div className="fw-bold text-dark fs-6">
                      ₹{e.amount}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="list-group-item text-muted text-center">
                No expenses yet.
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
}
