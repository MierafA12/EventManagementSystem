import { useState, useRef } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Button1 } from "../../components/Button";
import API from "../../api/adminApi";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    eventType: "",
    location: "",
    eventLink: "",
    datetime: "",
    fee: "",
    capacity: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation
    const required = ["title", "description", "category", "eventType", "datetime", "fee"];
    if (form.eventType === "Physical") required.push("location", "capacity");
    if (form.eventType === "Online") required.push("eventLink");

    for (const field of required) {
      if (!form[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key] !== null) formData.append(key, form[key]);
      }

      const res = await API.post("/event/create", formData);

      const data = res.data;



      if (data.success) {
        alert("Event created successfully!");

        // Reset form
        setForm({
          title: "",
          description: "",
          category: "",
          eventType: "",
          location: "",
          eventLink: "",
          datetime: "",
          fee: "",
          capacity: "",
          image: null,
        });
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
      } else {
        alert("Failed to create event: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-text1 shadow-lg rounded-xl p-8 dark:bg-bgDark">
        <h1 className="text-2xl font-semibold text-primary mb-6 dark:text-text1">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Title */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Event Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
              required
            />
          </div>


          {/* Category */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
              required
            >
              <option value="">Select category</option>
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Music">Music</option>
              <option value="Technology">Technology</option>
              <option value="Culture">Culture</option>
            </select>
          </div>

          {/* Event Type */}

          {/* Event Type */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Event Type</label>
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
              required
            >
              <option value="">Select type</option>
              <option value="Physical">Physical</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {form.eventType === "Physical" && (
            <>
              <div>
                <label className="block text-primary font-medium mb-1 dark:text-text1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-primary font-medium mb-1 dark:text-text1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {form.eventType === "Online" && (
            <div>
              <label className="block text-primary font-medium mb-1 dark:text-text1">Online Event Link</label>
              <input
                type="url"
                name="eventLink"
                value={form.eventLink}
                onChange={handleChange}
                placeholder="Enter meeting link"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                required
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter event description"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
              required
            />
          </div>


          {/* Date & Time */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Date & Time</label>
            <input
              type="datetime-local"
              name="datetime"
              value={form.datetime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
              required
            />
          </div>

          {/* Fee */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Registration Fee (ETB)</label>
            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleChange}
              min="0"
              placeholder="0 for free"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
              required
            />
          </div>

          {/* Event Image */}
          <div>
            <label className="block text-primary font-medium mb-1 dark:text-text1">Event Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setForm({ ...form, image: file });
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-secondary focus:outline-none"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-3 w-40 h-28 object-cover rounded-lg shadow" />
            )}
          </div>

          {/* Submit Button */}
          <Button1 type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button1>
        </form>
      </div>
    </AdminLayout>
  );
}
