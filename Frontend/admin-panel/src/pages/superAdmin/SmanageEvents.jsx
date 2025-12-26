import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import AdminLayout from "../../layouts/AdminLayout";
import { getEventsSummary } from "../../api/adminApi";

export default function SmanageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getEventsSummary();
        setEvents(Array.isArray(res.data.events) ? res.data.events : []);
      } catch (err) {
        console.error("Failed to load event detail:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 bg-lightBg dark:bg-bgDark">
        <h1 className="text-3xl font-bold text-primary dark:text-secondary mb-8">Manage Events</h1>

        {loading ? (
          <p className="text-secondary text-lg">Loading events...</p>
        ) : (
          <div className="w-full max-w-5xl overflow-x-auto bg-white dark:bg-bgDark rounded-xl shadow-md">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Event Name</th>
                  <th className="px-6 py-3">Organizer</th>
                  <th className="px-6 py-3">Registered</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-secondary">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event, idx) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td className="px-6 py-4 font-semibold">{event.event_name}</td>
                      <td className="px-6 py-4">{event.organizer}</td>
                      <td className="px-6 py-4">{event.total_attendance}</td>
                      <td className="px-6 py-4">
                        <button
                          className="flex items-center gap-2 text-primary font-medium hover:text-buttonHover"
                          onClick={() => alert(`View details for ${event.event_name}`)}
                        >
                          View <FiArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
