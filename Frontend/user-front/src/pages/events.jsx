import { useState, useEffect } from "react";
import MainLayout from "../layout/mainLayout.jsx";
import Notification from "../component/messages.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../admin-panel/src/context/AuthContext.jsx";
import { Calendar, MapPin, Loader, AlertCircle } from "lucide-react";

export default function Events() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch events from backend
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Fetch from your backend API
      const response = await fetch(
        "http://localhost/EthioEvents/Backend/public/get_events.php"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched events:", data); // Debug log
      
      if (data.status === "success" || data.success) {
        // Handle both response formats
        const eventsData = data.data || data.events || [];
        setEvents(eventsData);
      } else {
        throw new Error(data.message || "Failed to load events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
      // Fallback to sample events if API fails
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Sample events fallback (remove when API works)
  const getSampleEvents = () => {
    return [
      { 
        id: 2, 
        title: "concert", 
        event_date: "2025-12-20", 
        event_time: "18:00:00", 
        location: "Bole", 
        category: "Music", 
        eventType: "Physical", 
        image: "/images/tech-conference.jpg",
        fee: 1000,
        status: "active" 
      },
      { 
        id: 3, 
        title: "jkg", 
        event_date: "2025-12-27", 
        event_time: "04:00:00", 
        location: "jjj", 
        category: "Conference", 
        eventType: "Physical", 
        image: "/images/tech-conference.jpg",
        fee: 333,
        status: "active" 
      },
      { 
        id: 4, 
        title: "ahgdh", 
        event_date: "2026-01-03", 
        event_time: "19:00:00", 
        location: "jjjj", 
        category: "Conference", 
        eventType: "Physical", 
        image: "/images/tech-conference.jpg",
        fee: 2000,
        status: "active" 
      }
    ];
  };

  // Get unique categories from events
  const categories = ["all", ...new Set(events.map(event => event.category))];

  const filteredEvents = selectedCategory === "all"
    ? events.filter(event => event.status === "active") // Only show active events
    : events.filter((event) => event.category === selectedCategory && event.status === "active");

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleViewDetails = (id) => navigate(`/events/${id}`);

  const handleRegister = (id) => {
    if (!user) {
      setNotification({ type: "error", message: "Please login to register!" });
      setTimeout(() => {
        setNotification(null);
        navigate("/login", { state: { from: `/events/${id}/register` } });
      }, 1500);
    } else {
      navigate(`/events/${id}/register`);
    }
  };

  // Register REQUIRES login

// Loading state
  if (loading) {
    return (
      <MainLayout activePage="/events">
        <section className="pt-32 pb-20 bg-lightBg">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="mt-6 text-xl text-secondary">Loading events...</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Error state
  if (error && events.length === 0) {
    return (
      <MainLayout activePage="/events">
        <section className="pt-32 pb-20 bg-lightBg">
          <div className="container mx-auto px-4 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">Failed to load events</h2>
            <p className="text-secondary mb-6">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-6 py-3 bg-primary text-white rounded-full hover:bg-buttonHover transition"
            >
              Try Again
            </button>
          </div>
        </section>
      </MainLayout>
    );
  }

  const EventsContent = (
    <section className="pt-28 pb-20 bg-lightBg">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-center text-primary mb-4">
          Upcoming Events
        </h1>
        <p className="text-center text-xl text-secondary mb-12 max-w-2xl mx-auto">
          Discover amazing events happening across Ethiopia. Book your tickets now!
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-primary">{events.filter(e => e.status === "active").length}</p>
            <p className="text-secondary">Active Events</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-primary">
              {events.filter(e => e.eventType === "Physical").length}
            </p>
            <p className="text-secondary">In-Person Events</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-primary">
              {events.filter(e => e.eventType === "Online").length}
            </p>
            <p className="text-secondary">Online Events</p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-full font-medium transition ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-gray-300 hover:border-primary"
              }`}
            >
              All Events
            </button>
            {categories
              .filter(cat => cat !== "all")
              .map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-gray-300 hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>

{/* Event Cards */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">No events found</h3>
            <p className="text-secondary mb-6">
              {selectedCategory === "all" 
                ? "No active events available at the moment." 
                : `No ${selectedCategory} events available.`}
            </p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-buttonHover transition"
              >
                View All Events
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2 duration-300"
              >
                <div className="h-64 relative">
                  <img
                    src={event.image || "/images/default-event.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/default-event.jpg";
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      event.eventType === "Physical" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {event.eventType === "Physical" ? "📍 In-Person" : "🌐 Online"}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    {event.category || "Event"}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-3 text-secondary mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                      <span>{formatDate(event.event_date)}{event.event_time && ` at ${event.event_time}`}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.fee > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-lg font-bold text-primary">
                          {event.fee} ETB
                        </p>
                        <p className="text-sm text-gray-500">per ticket</p>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => handleViewDetails(event.id)}
                      className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-buttonHover transition flex items-center justify-center gap-2"
                    >
                      View Details
                    </button>

<button
                      onClick={() => handleRegister(event.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      {event.fee > 0 ? "Book Now" : "Register"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {notification && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}
      </div>
    </section>
  );

  return <MainLayout activePage="/events">{EventsContent}</MainLayout>;
}