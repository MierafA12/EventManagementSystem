import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function RegisteredUsers() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/event-system/api/admin.php?action=registered-users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .finally(() => setLoading(false));
  }, []);
ax
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary mb-6">
          Registered Users for Each Event
        </h1>

        {events.map((event) => (
          <div
            key={event.id}
            className="mb-8 p-4 border rounded-lg shadow-sm bg-white dark:bg-bgDark"
          >
            <h2 className="text-lg font-semibold text-primary mb-2">
              {event.name}
            </h2>

            <p className="text-gray-600 text-sm mb-3">
              {event.registeredUsers.length} users registered
            </p>

            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-lightBg dark:bg-primary text-text1">
                <tr>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                </tr>
              </thead>

              <tbody>
                {event.registeredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-lightBg">
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      </div>
    </AdminLayout>
  );
}