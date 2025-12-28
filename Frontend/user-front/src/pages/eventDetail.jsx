import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Users, Ticket, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../component/Header.jsx";
import Notification from "../component/messages.jsx";
import { getEvent } from "../api/userApi.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://localhost/EthioEvents/Backend/public/uploads/events/";

  // Fetch event details from backend
  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      const data = response.data;

      if (data.success) {
        setEvent(data.data);
      } else {
        navigate("/events");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      // Fallback or navigate
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleRegister = () => {
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

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 bg-lightBg dark:bg-bgDark transition-colors duration-300">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-secondary dark:text-gray-400">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    navigate("/events");
    return null;
  }

  return (
    <div>
      <Header />

      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <section className="pt-28 pb-20 bg-lightBg dark:bg-bgDark transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-300">
            {/* Event Image */}
            <div className="relative h-96">
              <img
                src={event.image ? `${IMAGE_BASE_URL}${event.image}` : "/images/default-event.jpg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${event.eventType === "Physical"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
                  }`}>
                  {event.eventType === "Physical" ? "📍 In-Person" : "🌐 Online"}
                </span>
              </div>
            </div>

            <div className="p-8">
              {/* Event Title & Info */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-text1 mb-4">
                  {event.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-lightBg dark:bg-gray-700 rounded-xl transition-colors duration-300">
                    <Calendar className="text-primary dark:text-secondary" size={20} />
                    <div>
                      <p className="text-sm text-secondary dark:text-gray-400">Date & Time</p>
                      <p className="font-semibold dark:text-text1">{formatDate(event.event_date)}</p>
                      {event.event_time && <p className="text-sm dark:text-gray-300">{event.event_time}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-lightBg dark:bg-gray-700 rounded-xl transition-colors duration-300">
                    <MapPin className="text-primary dark:text-secondary" size={20} />
                    <div>
                      <p className="text-sm text-secondary dark:text-gray-400">Venue</p>
                      <p className="font-semibold dark:text-text1">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-lightBg dark:bg-gray-700 rounded-xl transition-colors duration-300">
                    <Ticket className="text-primary dark:text-secondary" size={20} />
                    <div>
                      <p className="text-sm text-secondary dark:text-gray-400">Price</p>
                      <p className="font-semibold text-xl dark:text-text1">{event.fee} ETB</p>
                      <p className="text-sm dark:text-gray-300">per ticket</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-lightBg dark:bg-gray-700 rounded-xl transition-colors duration-300">
                    <Users className="text-primary dark:text-secondary" size={20} />
                    <div>
                      <p className="text-sm text-secondary dark:text-gray-400">Capacity</p>
                      <p className="font-semibold dark:text-text1">
                        {event.eventType === "Physical"
                          ? `${event.registered_count || 0} / ${event.capacity}`
                          : "Unlimited"}
                      </p>
                      {event.eventType === "Physical" && (
                        <p className={`text-xs ${event.registered_count >= event.capacity ? "text-red-500 font-bold" : "text-green-500"}`}>
                          {event.registered_count >= event.capacity ? "SOLD OUT" : `${event.capacity - (event.registered_count || 0)} spots left`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary dark:text-text1 mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="text-secondary dark:text-gray-300 leading-relaxed text-lg">{event.description}</p>
                </div>
              </div>

              {/* Online Event Link */}
              {event.eventType === "Online" && event.eventLink && (
                <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Online Event Access</h3>
                      <p className="text-blue-700 dark:text-blue-400">
                        Join via:{" "}
                        <a
                          href={event.eventLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          {event.eventLink}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Register Button */}
              <div className="border-t dark:border-gray-700 pt-8 transition-colors duration-300">
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleRegister}
                    disabled={event.eventType === "Physical" && event.registered_count >= event.capacity}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-lg transition ${event.eventType === "Physical" && event.registered_count >= event.capacity
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary dark:bg-secondary text-white hover:bg-buttonHover"
                      }`}
                  >
                    {event.eventType === "Physical" && event.registered_count >= event.capacity
                      ? "Registration Full"
                      : "Register Now"}
                    <ArrowRight size={24} />
                  </button>

                  <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm">
                    {user
                      ? `You are registering as ${user.full_name || user.username}`
                      : "Login required to register"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 text-primary dark:text-secondary hover:text-buttonHover transition mt-8"
          >
            <ArrowRight className="rotate-180" size={20} />
            Back to All Events
          </button>
        </div>
      </section>
    </div>
  );
}