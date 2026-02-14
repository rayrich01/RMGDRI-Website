"use client";

import { useState, FormEvent } from "react";

type IntakeType = "adopt" | "foster" | "volunteer" | "surrender" | "contact";

interface IntakeFormProps {
  type: IntakeType;
  title: string;
  description: string;
}

export default function IntakeForm({ type, title, description }: IntakeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "", // honeypot
    message: "",
    // type-specific fields
    household_size: "",
    has_other_pets: "",
    experience_level: "",
    interests: [] as string[],
    dog_name: "",
    urgency: "",
    city: "",
    state: "",
    topic: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Build payload based on type
    const payload: Record<string, any> = {};

    if (type === "adopt") {
      if (formData.household_size) payload.household_size = parseInt(formData.household_size, 10);
      if (formData.has_other_pets) payload.has_other_pets = formData.has_other_pets === "true";
      if (formData.city) payload.city = formData.city;
      if (formData.state) payload.state = formData.state;
      if (formData.message) payload.message = formData.message;
    } else if (type === "foster") {
      if (formData.experience_level) payload.experience_level = formData.experience_level;
      if (formData.city) payload.city = formData.city;
      if (formData.state) payload.state = formData.state;
      if (formData.message) payload.message = formData.message;
    } else if (type === "volunteer") {
      if (formData.interests.length > 0) payload.interests = formData.interests;
      if (formData.city) payload.city = formData.city;
      if (formData.state) payload.state = formData.state;
      if (formData.message) payload.message = formData.message;
    } else if (type === "surrender") {
      if (formData.dog_name) payload.dog_name = formData.dog_name;
      if (formData.urgency) payload.urgency = formData.urgency;
      if (formData.city) payload.city = formData.city;
      if (formData.state) payload.state = formData.state;
      if (formData.message) payload.message = formData.message;
    } else if (type === "contact") {
      if (formData.topic) payload.topic = formData.topic;
      payload.message = formData.message; // required for contact
    }

    const body = {
      type,
      website: formData.website,
      name: formData.name || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      payload,
    };

    try {
      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        message: "",
        household_size: "",
        has_other_pets: "",
        experience_level: "",
        interests: [],
        dog_name: "",
        urgency: "",
        city: "",
        state: "",
        topic: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Submission failed. Please try again.");
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
        <p className="text-green-700">
          Your {type} application has been received. We'll be in touch soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) => handleChange("website", e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Common fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            maxLength={120}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            maxLength={40}
          />
        </div>

        {/* Type-specific fields */}
        {type === "adopt" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Household Size</label>
              <input
                type="number"
                value={formData.household_size}
                onChange={(e) => handleChange("household_size", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Do you have other pets?</label>
              <select
                value={formData.has_other_pets}
                onChange={(e) => handleChange("has_other_pets", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </>
        )}

        {type === "foster" && (
          <div>
            <label className="block text-sm font-medium mb-1">Experience Level</label>
            <select
              value={formData.experience_level}
              onChange={(e) => handleChange("experience_level", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="none">None</option>
              <option value="some">Some</option>
              <option value="experienced">Experienced</option>
            </select>
          </div>
        )}

        {type === "volunteer" && (
          <div>
            <label className="block text-sm font-medium mb-1">Areas of Interest</label>
            <div className="space-y-2">
              {["Events", "Foster Support", "Transport", "Fundraising", "Social Media"].map((interest) => (
                <label key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleChange("interests", [...formData.interests, interest]);
                      } else {
                        handleChange("interests", formData.interests.filter((i) => i !== interest));
                      }
                    }}
                    className="mr-2"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>
        )}

        {type === "surrender" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Dog's Name</label>
              <input
                type="text"
                value={formData.dog_name}
                onChange={(e) => handleChange("dog_name", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => handleChange("urgency", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        )}

        {type === "contact" && (
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => handleChange("topic", e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Location fields for non-contact types */}
        {type !== "contact" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                maxLength={2}
                placeholder="e.g., CO"
              />
            </div>
          </>
        )}

        {/* Message field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {type === "contact" ? "Message *" : "Additional Information"}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows={5}
            maxLength={5000}
            required={type === "contact"}
          />
        </div>

        {/* Error display */}
        {status === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
