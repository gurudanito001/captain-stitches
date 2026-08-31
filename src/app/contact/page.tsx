'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Bespoke Inquiry',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: 'Bespoke Inquiry',
      message: '',
    })
  }

  const inputClasses =
    'w-full px-4 bg-brown-950/40 border border-brown-800 text-cream-200 placeholder-stone-600 focus:outline-none focus:border-caramel-500 font-body text-xs tracking-wider transition-colors duration-200 rounded-none'
  const labelClasses = 'text-label text-stone-400 block mb-2 font-semibold'

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pb-24 animate-fadeIn" style={{ paddingTop: "150px", paddingBottom: "50px" }}>
        <div className="container-brand">

          {/* Page Header — Clean borderless hero */}
          <section className="pb-8" style={{ marginBottom: "64px" }}>
            <SectionEyebrow label="Get in Touch" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal">
              Connect with us
            </h1>
            <p className="text-body text-stone-300 mt-4 max-w-xl">
              Have questions about fabric weights, custom orders, measurements, or bulk shipments? Send us a message or chat with us directly on WhatsApp.
            </p>
          </section>

          {/* Contact Layout Grid — Stretched columns, borderless panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

            {/* Left: Physical Addresses & SLAs */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {/* WhatsApp Channels — Flat panel */}
              <div className="p-8 bg-brown-950/40 flex flex-col gap-4">
                <span className="text-label text-caramel-500 font-bold">Fastest Response</span>
                <h3 className="font-display text-xl text-cream-200 font-normal">
                  WhatsApp Direct Enquiry
                </h3>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  For sizing consultations, timeline updates, or to send fabric reference designs directly, WhatsApp is our primary channel.
                </p>
                <div className="pt-2">
                  <Button href="https://wa.me/message/PLACEHOLDER" variant="primary" size="sm" external style={{ padding: "10px 15px" }}>
                    Open WhatsApp Chat
                  </Button>
                </div>
              </div>

              {/* Physical Addresses */}
              <div className="flex flex-col gap-6">
                <span className="text-label text-stone-400 font-semibold pb-2">
                  Headquarters &amp; Workshops
                </span>

                {/* Italy */}
                <div className="flex flex-col gap-1.5 text-xs font-body">
                  <strong className="text-cream-200 uppercase tracking-widest text-[10px] text-caramel-500">
                    Verona, Italy — Sizing &amp; Fitting
                  </strong>
                  <p className="text-stone-300">Via Pallone, 12, 37121 Verona VR, Italy</p>
                  <p className="text-stone-500">Hours: Mon - Fri: 09:00 - 18:00 (CET)</p>
                </div>

                {/* Lagos */}
                <div className="flex flex-col gap-1.5 text-xs font-body">
                  <strong className="text-cream-200 uppercase tracking-widest text-[10px] text-caramel-500">
                    Lagos, Nigeria — Sourcing Office
                  </strong>
                  <p className="text-stone-300">15 Allen Avenue, Ikeja, Lagos, Nigeria</p>
                  <p className="text-stone-500">Hours: Mon - Sat: 08:30 - 17:30 (WAT)</p>
                </div>

                {/* Aba */}
                <div className="flex flex-col gap-1.5 text-xs font-body">
                  <strong className="text-cream-200 uppercase tracking-widest text-[10px] text-caramel-500">
                    Aba, Nigeria — Tailoring Workshop
                  </strong>
                  <p className="text-stone-300">44 Faulks Road, Aba, Abia State, Nigeria</p>
                  <p className="text-stone-500">Hours: Mon - Sat: 08:30 - 17:30 (WAT)</p>
                </div>
              </div>

              {/* Response SLAs — Flat panel */}
              <div className="p-8 bg-brown-950/20 flex flex-col gap-3">
                <span className="text-label text-stone-400 font-bold">Response SLA</span>
                <div className="font-body text-xs text-stone-400 flex flex-col gap-2">
                  <p>
                    <strong className="text-cream-200">WhatsApp:</strong> Typically replied to within 1 hour during operational hours.
                  </p>
                  <p>
                    <strong className="text-cream-200">Email Enquiries:</strong> Reviewed and answered within 24 business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Email Enquiry Form — Flat panel, matched height */}
            <div className="lg:col-span-7 bg-brown-950/40 p-8 md:p-12 flex flex-col h-full justify-between" style={{ padding: "24px 12px" }}>
              <div>
                <h3 className="text-label text-caramel-400 font-bold mb-8" style={{ marginBottom: "24px" }}>
                  Send an Enquiry
                </h3>

                {submitSuccess ? (
                  <div className="py-12 text-center flex flex-col items-center gap-4 animate-fadeIn">
                    <div className="w-12 h-12 rounded-full bg-caramel-500/10 border border-caramel-500 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6 text-caramel-500"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h4 className="font-display text-xl text-cream-200 font-bold">Enquiry Received</h4>
                    <p className="text-body text-stone-400 text-xs max-w-xs leading-relaxed">
                      Thank you. We have received your message and will review it immediately. You will receive an email response within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-4 text-[10px] uppercase tracking-widest font-bold text-caramel-400 hover:text-caramel-300 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Name */}
                    <div>
                      <label className={labelClasses}>Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={e => handleInputChange('fullName', e.target.value)}
                        className={inputClasses}
                        style={{ height: '50px' }}
                      />
                    </div>

                    {/* Contact Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClasses}>Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={e => handleInputChange('email', e.target.value)}
                          className={inputClasses}
                          style={{ height: '50px' }}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>WhatsApp Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="E.g., +39 333 444 555"
                          value={formData.phone}
                          onChange={e => handleInputChange('phone', e.target.value)}
                          className={inputClasses}
                          style={{ height: '50px' }}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={labelClasses}>Enquiry Subject</label>
                      <select
                        value={formData.subject}
                        onChange={e => handleInputChange('subject', e.target.value)}
                        className={inputClasses}
                        style={{ height: '50px' }}
                      >
                        <option value="Bespoke Inquiry">Bespoke Design Inquiry</option>
                        <option value="Timeline Query">Production Timeline Query</option>
                        <option value="Measurement Help">Sizing / Measurements Assistance</option>
                        <option value="Custom reference">Custom reference upload help</option>
                        <option value="Other">Other General Query</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClasses}>Your Message</label>
                      <textarea
                        required
                        placeholder="Tell us about the design you want, your event date, or any questions about measurements..."
                        value={formData.message}
                        onChange={e => handleInputChange('message', e.target.value)}
                        className={[inputClasses, 'resize-none py-4'].join(' ')}
                        style={{ height: '140px' }}
                      />
                    </div>

                    {/* Submit button */}
                    <div className="mt-2">
                      <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting} style={{ padding: "12px 5px" }}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2 justify-center">
                            <span className="w-3 h-3 border-2 border-brown-900 border-t-transparent rounded-full animate-spin" />
                            Submitting message...
                          </span>
                        ) : (
                          'Submit Enquiry'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
