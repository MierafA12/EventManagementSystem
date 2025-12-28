import { useState } from 'react';
import MainLayout from '../layout/mainLayout';
import API from '../api/userApi.jsx'; 

export default function Contact() {
  const [formStatus, setFormStatus] = useState('');
  
  // Mock events for dropdown
  const events = [
    { id: null, name: 'General Inquiry' },
    { id: 1, name: 'Summer Gala 2025' },
    { id: 2, name: 'Tech Conference 2025' },
    { id: 3, name: 'Music Festival 2025' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
      event_id: form.event_id.value === 'null' ? null : parseInt(form.event_id.value)
    };

    try {
      const res = await API.post('/contact/send', data);
      setFormStatus(res.data.message);
      form.reset();
    } catch (err) {
      console.error(err);
      setFormStatus('Failed to send message.');
    }

    setTimeout(() => setFormStatus(''), 5000);
  };

  return (
    <MainLayout>
      <section className="pt-24 pb-20 bg-lightBg dark:bg-bgDark transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center text-primary dark:text-text1 mb-16">
            Contact Us
          </h1>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

            {/* Form Card */}
            <div className="bg-bg dark:bg-bgDark rounded-2xl shadow-xl p-8 transition-colors duration-300">
              <h2 className="text-3xl font-bold mb-6 text-primary dark:text-text1">
                Send us a Message About Events / The Platform
              </h2>

              {formStatus && (
                <div className="mb-6 p-4 bg-success/20 border border-success text-success rounded-lg text-center font-medium dark:bg-success/30 dark:text-success">
                  {formStatus}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-primary dark:text-text1 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-secondary dark:border-text1 rounded-lg bg-bg dark:bg-bgDark text-primary dark:text-text1 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-primary dark:text-text1 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-secondary dark:border-text1 rounded-lg bg-bg dark:bg-bgDark text-primary dark:text-text1 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-primary dark:text-text1 font-medium mb-2">Select Event</label>
                  <select 
                    name="event_id" 
                    className="w-full px-4 py-3 border border-secondary dark:border-text1 rounded-lg bg-bg dark:bg-bgDark text-primary dark:text-text1 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                  >
                    {events.map(event => (
                      <option key={event.id ?? 'general'} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-primary dark:text-text1 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-secondary dark:border-text1 rounded-lg bg-bg dark:bg-bgDark text-primary dark:text-text1 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                    placeholder="Event Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-primary dark:text-text1 font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-secondary dark:border-text1 rounded-lg bg-bg dark:bg-bgDark text-primary dark:text-text1 focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors duration-300"
                    placeholder="Tell us about your event..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary  text-text1 dark:text-bg py-4 rounded-lg font-semibold text-lg hover:bg-buttonHover dark:hover:bg-primary transition transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info Card */}
            <div className="bg-primary text-text1 dark:text-bg rounded-2xl shadow-xl p-8 flex flex-col justify-center transition-colors duration-300">
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <i className="fas fa-map-marker-alt text-2xl mt-1"></i>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="opacity-90">Bole, Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="fas fa-phone text-2xl mt-1"></i>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="opacity-90">+251 912 121212</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="fas fa-envelope text-2xl mt-1"></i>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="opacity-90">info@Ethioevents.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <i className="fas fa-clock text-2xl mt-1"></i>
                  <div>
                    <p className="font-semibold">Working Hours</p>
                    <p className="opacity-90">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
