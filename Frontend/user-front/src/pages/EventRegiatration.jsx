import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, Mail, CreditCard, Calendar, MapPin, Ticket, 
  Plus, X, Loader, ArrowLeft, AlertCircle, CheckCircle 
} from "lucide-react";
import { useAuth } from "../../../admin-panel/src/context/AuthContext.jsx";
import Header from "../component/Header.jsx";
import Notification from "../component/messages.jsx";

export default function EventRegister() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  
  // Attendees state - Start with logged-in user as first attendee
  const [attendees, setAttendees] = useState([
    { 
      name: user?.full_name || user?.username || "", 
      email: user?.email || "",
      isPrimary: true 
    }
  ]);
  
  // Fetch event details
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: `/events/${id}/register` } });
      return;
    }
    
    fetchEventDetails();
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost/EthioEvents/Backend/public/get_event.php?id=${id}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          navigate("/events");
        }
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!event) return 0;
    return event.fee * attendees.length;
  };

  const handleAddAttendee = () => {
    if (attendees.length < 10) {
      setAttendees([...attendees, { name: "", email: "", isPrimary: false }]);
    }
  };

  const handleRemoveAttendee = (index) => {
    if (index === 0) return; // Cannot remove primary attendee
    if (attendees.length > 1) {
      const newAttendees = [...attendees];
      newAttendees.splice(index, 1);
      setAttendees(newAttendees);
    }
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handlePayment = async () => {
    if (!user || !event) return;

    // Validate all attendees have names
    const invalidAttendees = attendees.filter(a => !a.name.trim());
    if (invalidAttendees.length > 0) {
      setError("Please enter name for all attendees");
      return;
    }

    // Validate emails (optional but check format if provided)
    const invalidEmails = attendees.filter(a => a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email));
    if (invalidEmails.length > 0) {
      setError("Please enter valid email addresses");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      console.log("=== PAYMENT START ===");
      
      // Generate unique transaction reference
      const tx_ref = `event_${event.id}_${user.id}_${Date.now()}`;
      
      // Prepare payment data for chapa/initiate.php
      const paymentData = {
        amount: calculateTotal().toString(),
        currency: "ETB",
        email: user.email,
        first_name: user.full_name?.split(" ")[0] || user.username || "Customer",
        last_name: user.full_name?.split(" ").slice(1).join(" ") || "User",
        tx_ref: tx_ref,
        return_url: `http://localhost:5173/payment-success?tx_ref=${tx_ref}&event_id=${event.id}`,
        metadata: {
          event_id: event.id,
          ticket_type: event.eventType === "Physical" ? "physical" : "online",
          quantity: attendees.length,
          attendees: attendees.map(attendee => ({
            name: attendee.name,
            email: attendee.email || user.email
          }))
        }
      };

      console.log("Payment data:", paymentData);

      // Call chapa/initiate.php (your simple payment wrapper)
      const response = await fetch(
        "http://localhost/EthioEvents/Backend/public/chapa/initiate.php",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify(paymentData)
        }
      );

      const data = await response.json();
      console.log("Payment response:", data);

      if (data.status === "success") {
        // Redirect to Chapa payment page
        window.location.href = data.data.checkout_url;
      } else {
        setError(data.message || "Payment initialization failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <button
            onClick={() => navigate("/events")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="flex items-center gap-2 text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft size={20} />
            Back to Event Details
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Event Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Register for <span className="text-primary">{event.title}</span>
                </h1>
                <p className="text-gray-600 mb-6">Complete registration for {attendees.length} attendee{attendees.length !== 1 ? 's' : ''}</p>

                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">{formatDate(event.event_date)} {event.event_time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Attendees Form */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Attendee Information</h2>
                  
                  {attendees.map((attendee, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-gray-800">
                            {index === 0 ? "Primary Attendee (You)" : `Additional Attendee ${index}`}
                          </h3>
                          {index === 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Ticket Owner
                            </span>
                          )}
                        </div>
                        {index > 0 && (
                          <button
                            onClick={() => handleRemoveAttendee(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={attendee.name}
                            onChange={(e) => handleAttendeeChange(index, "name", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address {index === 0 ? "*" : ""}
                          </label>
                          <input
                            type="email"
                            value={attendee.email}
                            onChange={(e) => handleAttendeeChange(index, "email", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="email@example.com"
                            required={index === 0}
                          />
                          {index > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Optional. If empty, tickets will be sent to your email.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add More Attendees Button */}
                  {attendees.length < 10 && (
                    <button
                      onClick={handleAddAttendee}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add Another Attendee
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Payment Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Order Summary
                </h2>
                
                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">Ticket Price</p>
                      <p className="text-sm text-gray-600">{event.fee} ETB × {attendees.length}</p>
                    </div>
                    <p className="font-semibold">{event.fee * attendees.length} ETB</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-800">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">
                        {calculateTotal()} ETB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">Secure Payment</p>
                      <p className="text-sm text-blue-700">
                        Powered by Chapa. Your payment is encrypted and secure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay {calculateTotal()} ETB
                    </>
                  )}
                </button>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Accepted Payment Methods</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-3 py-1.5 bg-gray-100 rounded">Visa</span>
                    <span className="text-xs px-3 py-1.5 bg-gray-100 rounded">Mastercard</span>
                    <span className="text-xs px-3 py-1.5 bg-gray-100 rounded">Mobile Money</span>
                    <span className="text-xs px-3 py-1.5 bg-gray-100 rounded">Chapa</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="mt-6 text-xs text-gray-500">
                  <p className="mb-2">By completing your purchase, you agree to our Terms of Service.</p>
                  <p>Each attendee will receive their own ticket via email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}