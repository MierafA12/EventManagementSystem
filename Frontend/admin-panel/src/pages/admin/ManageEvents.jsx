import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Search from "../../components/SearchE";
import Filter from "../../components/FilterE";
import EventRow from "../../components/EventRow";
import EventDeleteModal from "../../components/EventDelete";
import EventEditModal from "./EditEvents";
import API from "../../api/adminApi";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // Helper to split datetime
  const processEvents = (rawData) => {
    let list = [];
    if (rawData.success && rawData.events) {
      list = rawData.events;
    } else if (Array.isArray(rawData)) {
      list = rawData;
    }

    return list.map(ev => {
      return {
        ...ev,
        date: ev.event_date || ev.date || (ev.datetime ? ev.datetime.split(' ')[0] : ''),
        time: ev.event_time || ev.time || (ev.datetime ? ev.datetime.split(' ')[1] : '')
      };
    });
  };

  // ------------------ Fetch Events ------------------
  const fetchEvents = () => {
    setLoading(true);

    if (search || filterType !== "all" || categoryFilter !== "all") {
      const params = {};
      if (search) params.search = search;
      if (filterType !== "all") params.status = filterType;
      if (categoryFilter !== "all") params.category = categoryFilter;

      API.get("/events/search-filter", { params })
        .then((res) => {
          const data = res.data;
          setEvents(processEvents(data));
        })
        .catch((err) => {
          console.error("Error fetching events:", err);
          setEvents([]);
        })
        .finally(() => setLoading(false));
    } else {
      API.get("/events")
        .then((res) => {
          const data = res.data;
          setEvents(processEvents(data));
        })
        .catch((err) => {
          console.error("Error fetching events:", err);
          setEvents([]);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, filterType, categoryFilter]);

  // ------------------ Save Edited Event ------------------
  const saveUpdated = async (updatedEvent) => {
    try {
      const formData = new FormData();
      for (const key in updatedEvent) {
        if (key === 'date' || key === 'time') continue;
        if (updatedEvent[key] !== null && updatedEvent[key] !== undefined) {
          formData.append(key, updatedEvent[key]);
        }
      }

      if (updatedEvent.date && updatedEvent.time) {
        formData.append('datetime', `${updatedEvent.date} ${updatedEvent.time}`);
      }

      const res = await API.post("/event/update", formData);
      const data = res.data;

      if (data.success) {
        alert("Event updated successfully!");
        fetchEvents();
        setEditTarget(null);
      } else {
        alert("Failed to update event: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Error updating event");
    }
  };

  // ------------------ Delete Event ------------------
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const formData = new FormData();
      formData.append('id', deleteTarget.id);

      const res = await API.post("/event/delete", formData);
      const data = res.data;

      if (data.success) {
        alert("Event deleted successfully!");
        fetchEvents();
        setDeleteTarget(null);
      } else {
        alert("Failed to delete event: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Error deleting event");
    }
  };

  // ------------------ Render ------------------
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-primary dark:text-text1 mb-6">
        Manage Events
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <Search search={search} setSearch={setSearch} />
        <div className="flex gap-3">
          <Filter value={filterType} onChange={setFilterType} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 h-10 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Music">Music</option>
            <option value="Technology">Technology</option>
            <option value="Culture">Culture</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-6">Loading events...</p>
      ) : (
        <div className="overflow-x-auto bg-bg dark:bg-bgDark shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-secondary dark:bg-secondaryDark text-primary dark:text-primaryDark">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Fee</th>
                <th className="px-4 py-3 text-left">Capacity</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-primary dark:text-text1Dark">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No events available
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    onEdit={() => setEditTarget(event)}
                    onDelete={() => setDeleteTarget(event)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <EventDeleteModal
        event={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {/* Edit Modal */}
      <EventEditModal
        event={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={saveUpdated}
      />
    </AdminLayout>
  );
}
