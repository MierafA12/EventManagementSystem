import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import SearchAdmin from "../../components/search";
import FilterAdmin from "../../components/filter";
import AdminRow from "../../components/AdminRow";
import AdminDeleteModal from "../../components/AdminDelate";
import AdminEditModal from "../../pages/superAdmin/editAdmin";

import {
  getAdmins,
  toggleAdminStatus,
  deleteAdmin,
  updateAdmin,
} from "../../api/adminApi";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState("");


  useEffect(() => {
  const loadAdmins = async () => {
    try {
      const res = await getAdmins();

      const adminList = Array.isArray(res.data.admins)
        ? res.data.admins
        : [];

      adminList.sort((a, b) => b.id - a.id);

      setAdmins(adminList);
    } catch (err) {
      console.error("Failed to load admins:", err);
      setAdmins([]);
    }
  };
  loadAdmins();
}, []);


const handleToggleStatus = async (admin) => {
  const newStatus = admin.status === "active" ? "inactive" : "active";
  try {
    await toggleAdminStatus({ ...admin, status: newStatus });
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === admin.id ? { ...a, status: newStatus } : a
      )
    );
  } catch (err) {
    console.error(err);
  }
};


const saveUpdated = async (updatedAdmin) => {
  try {
    await updateAdmin(updatedAdmin);
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === updatedAdmin.id
          ? {
              ...a,
              full_name: updatedAdmin.full_name,
              username: updatedAdmin.username,
              status: updatedAdmin.status,
            }
          : a
      )
    );

    setEditSuccess("Admin updated successfully");

    setTimeout(() => {
      setEditSuccess("");
      setEditTarget(null);
    }, 2000);

  } catch (err) {
    console.error(err);
  }
};



  const confirmDelete = async () => {
  try {
    await deleteAdmin(deleteTarget.id);

    setAdmins((prev) =>
      prev.filter((a) => a.id !== deleteTarget.id)
    );

    setDeleteSuccess("Admin deleted successfully");
    setDeleteTarget(null);

    setTimeout(() => {
      setDeleteSuccess("");
    }, 2000);

  } catch (err) {
    console.error(err);
  }
};


  const filtered = admins.filter((a) => {
    const matchSearch =
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" ? true : a.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-6">Manage Admins</h2>

        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <SearchAdmin search={search} setSearch={setSearch} />
          <FilterAdmin value={status} onChange={setStatus} />
        </div>

        <div className="overflow-x-auto bg-white dark:bg-bgDark shadow-md rounded-lg dark:text-text1">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200 dark:bg-bgDark">
              <tr>

                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((admin, index) => (
                  <AdminRow
                    key={admin.id}
                    index={index + 1}
                    admin={admin}
                    onToggleStatus={() => handleToggleStatus(admin)}
                    onEdit={() => setEditTarget(admin)}
                    onDelete={() => setDeleteTarget(admin)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminDeleteModal
          admin={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />{deleteSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700">
            ✓ {deleteSuccess}
          </div>
        )}

        <AdminEditModal
          admin={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={saveUpdated}
        />
      </div>
    </AdminLayout>
  );
}
