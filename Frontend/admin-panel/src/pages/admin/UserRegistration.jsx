import AdminLayout from "../../layouts/AdminLayout";
export default function RegisteredUsers() {
  // sample data kept inside the same file (no separate file)
  const events = [
    {
      id: 1,
      name: "Tech Summit 2025",
      date: "2025-08-12",
      time: "10:00 AM",
      registeredUsers: [
        { id: 101, fullName: "Melat Yonas", email: "melat@gmail.com" },
        { id: 102, fullName: "Abel Fikadu", email: "abel@gmail.com" },
        { id: 103, fullName: "Sara Tadesse", email: "sara@gmail.com" },
        { id: 104, fullName: "Nahom Samuel", email: "nahom@gmail.com" },
        { id: 105, fullName: "Lidiya Meron", email: "lidiya@gmail.com" },
      ],
    },
    {
      id: 2,
      name: "Music Festival Night",
      date: "2025-09-05",
      time: "7:00 PM",
      registeredUsers: [
        { id: 201, fullName: "Ruth Tigist", email: "ruth@gmail.com" },
        { id: 202, fullName: "Yonatan Daniel", email: "yonatan@gmail.com" },
        { id: 203, fullName: "Meron Kifle", email: "meron@gmail.com" },
        { id: 204, fullName: "Biniam Fisseha", email: "biniam@gmail.com" },
        { id: 205, fullName: "Hanna Tsegaye", email: "hanna@gmail.com" },
      ],
    },
  ];

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
