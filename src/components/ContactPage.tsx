import React, { useState } from 'react';
import { Mail, MapPin, Send, Phone, Clock, CheckCircle2, Compass, ShieldCheck } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import heroImg from '../assets/images/book_cover_zen_garden_1792610457442.jpg';

export const ContactPage: React.FC = () => {
  const { showToast } = useLibrary();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been received by our curators.');
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setTopic('General Inquiry');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="animate-fadeIn">
      {/* Editorial Hero Header */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(28,25,23,0.76), rgba(28,25,23,0.88)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-medium">
            <Mail className="w-3.5 h-3.5" />
            <span>Curatorial Desk & Archive Correspondence</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-50 leading-tight">
            Connect with the Curators
          </h1>
          <p className="text-base text-stone-200 font-serif italic max-w-xl mx-auto leading-relaxed">
            Inquiries regarding preserved monographs, edition acquisitions, corrections, or study visits.
          </p>
        </div>
      </section>

      <div className="py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Contact Channels Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Mail,
              title: 'Curatorial Desk',
              desc: 'curator@athenaeum.library',
              sub: 'Response within 48 hours'
            },
            {
              icon: Phone,
              title: 'Preservation Office',
              desc: '+92 42 3587 9000',
              sub: 'Mon–Fri, 9:00 AM – 6:00 PM'
            },
            {
              icon: Clock,
              title: 'Silent Reading Hours',
              desc: 'Daily 08:00 – 22:00',
              sub: 'Study desks & quiet carrels'
            }
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 shadow-2xs space-y-2 text-center"
            >
              <item.icon className="w-6 h-6 mx-auto text-amber-700 dark:text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200 font-mono">
                {item.desc}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {item.sub}
              </p>
            </div>
          ))}
        </section>

        {/* Correspondence Form & Physical Office Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="p-6 sm:p-8 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-2xl shadow-2xs">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Message Dispatched
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-serif italic max-w-xs mx-auto">
                  Thank you, {name}. A member of our curatorial archive team will reply directly to {email}.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                  Send a Dispatch
                </h2>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reader@domain.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                    Topic of Correspondence
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="General Inquiry">General Curatorial Inquiry</option>
                    <option value="Book Recommendation">Propose Volume for Preservation</option>
                    <option value="Correction">Textual or Typographic Correction</option>
                    <option value="Physical Delivery">Physical Edition Order Inquiry</option>
                    <option value="Research Access">Scholar Study Desk Reservation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-medium">
                    Message *
                  </label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Enter your message or inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Dispatch</span>
                </button>
              </form>
            )}
          </div>

          {/* Details & Visiting Protocols */}
          <div className="space-y-4 text-sm text-stone-600 dark:text-stone-300">
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    The Main Sanctuary & Archive
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    42 Athenaeum Court, Off Mall Road, Lahore 54000, Pakistan
                  </p>
                  <p className="text-[11px] font-mono text-stone-400 mt-1">
                    Geo: 31°32′59″ N, 74°20′37″ E · Altitude 217m
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Atmospheric & humidity-controlled preservation vaults</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Quiet carrels available for verified researchers and scholars</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800/70 text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-stone-500 block">
                Reading Protocol
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                All digital visitors have unlimited complimentary access to excerpts, indices, and private local annotations. No algorithms, newsletters, or tracking beacons are used.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};