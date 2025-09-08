import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact({data}) {
  return (
    <section className="min-h-screen py-20 px-6 md:px-16 bg-black text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Get in <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">touch</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Panel */}
        <div>
          <h3 className="text-4xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Let's talk
            </span>
          </h3>
          <p className="text-lg leading-relaxed mb-6">
            I'm currently available to take on new projects, so feel free to send
            me a message about anything that you want me to work on. You can
            contact anytime.
          </p>

          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-xl text-primary" />
              <span>{data?.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-xl text-primary" />
              <span>{data?.phone}</span>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-xl text-primary" />
              <span>{data?.location}</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <form className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full bg-neutral text-white px-4 py-3 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-neutral text-white px-4 py-3 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Write your message here</label>
            <textarea
              rows="6"
              placeholder="Enter your message"
              className="w-full bg-neutral text-white px-4 py-3 rounded-xl focus:outline-none"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}