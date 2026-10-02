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
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const handleInputChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
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
    'w-full px-4 py-3 bg-[#FAF7F2] border border-[#D1C9BE] text-[#2B2B2B] placeholder-[#8C7B6B] focus:outline-none focus:border-[#C4975A] font-body text-xs tracking-wider transition-colors duration-200 rounded-xl'
  const labelClasses = 'text-label text-stone-300 block mb-2 font-semibold text-xs uppercase tracking-wider'

  const FAQS = [
    {
      q: 'How do I submit measurements from Italy or across Europe?',
      a: 'You can input your measurements directly into our online order wizard or book a 10-minute guided video call with our fitting concierge in Verona. We will guide you step-by-step with a tape measure.',
    },
    {
      q: 'How does the 50% deposit payment structure work?',
      a: 'We require a 50% deposit upfront to purchase fabric and commence custom pattern drafting. The remaining 50% is only requested after our tailors upload high-resolution inspection photos and a 360° fit video for your personal approval.',
    },
    {
      q: 'How long does direct shipping to Europe take?',
      a: 'Once tailoring and quality inspection are approved, garments are dispatched via DHL Express air freight with tracking. Standard delivery to Italy, the UK, Germany, and Europe takes 3 to 5 business days.',
    },
    {
      q: 'What happens if my garment needs an adjustment?',
      a: 'We stand by our Perfect Fit Guarantee. If minor alterations are required upon arrival, our partner master tailors in Verona handle them with no additional charge to you.',
    },
  ]

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-950 min-h-screen text-cream-100">
        {/* =========================================================================
            SECTION 1: OBSIDIAN CONCIERGE HERO (#0C0704)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#0C0704] text-cream-100 border-b border-brown-800/60"
          style={{
            paddingTop: 'clamp(6.5rem, 11vw, 9rem)',
            paddingBottom: 'clamp(3rem, 6vw, 4.5rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ maxWidth: '780px' }}>
              <span
                className="inline-block text-[#C4975A] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '8px' }}
              >
                Tailoring Concierge &amp; Ateliers
              </span>
              <h1
                className="font-serif text-cream-100 font-bold leading-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}
              >
                Connect with our Ateliers
              </h1>
              <p
                className="font-body text-stone-300 text-sm leading-relaxed"
                style={{ maxWidth: '640px', lineHeight: 1.7 }}
              >
                Whether you need advice on fabric weights, desire a custom embroidery motif, have a tight wedding deadline, or wish to book a Verona fitting consultation — our concierge is ready to assist.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: LUMINOUS ALABASTER DUAL-HUB ATELIERS (#FAF6F0)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#FAF6F0] text-[#140C07] border-b border-[#EBE3D7]"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ marginBottom: '3rem' }}>
              <span
                className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '6px' }}
              >
                Physical Presence
              </span>
              <h2
                className="font-serif font-normal leading-tight text-[#140C07]"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
              >
                Our Workshops &amp; Sizing Hubs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Verona Hub */}
              <div
                className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#C2410C] font-bold text-xs uppercase tracking-widest block mb-2">
                    🇮🇹 Italy Hub
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#140C07] mb-2">
                    Verona Showroom &amp; Fitting
                  </h3>
                  <p className="text-xs text-[#52453B] leading-relaxed mb-4">
                    Via Pallone, 12, 37121 Verona VR, Italy
                  </p>
                  <p className="text-[11px] text-[#8A7A6E]">
                    Operating Hours: Mon – Fri: 09:00 – 18:00 (CET)
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-[#F2ECE1]">
                  <span className="text-[10px] text-[#C4975A] font-bold uppercase tracking-widest">
                    ✦ Sizing Validation & Alterations
                  </span>
                </div>
              </div>

              {/* Lagos Office */}
              <div
                className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#C2410C] font-bold text-xs uppercase tracking-widest block mb-2">
                    🇳🇬 Nigeria Hub
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#140C07] mb-2">
                    Lagos Sourcing &amp; Export
                  </h3>
                  <p className="text-xs text-[#52453B] leading-relaxed mb-4">
                    15 Allen Avenue, Ikeja, Lagos, Nigeria
                  </p>
                  <p className="text-[11px] text-[#8A7A6E]">
                    Operating Hours: Mon – Sat: 08:30 – 17:30 (WAT)
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-[#F2ECE1]">
                  <span className="text-[10px] text-[#C4975A] font-bold uppercase tracking-widest">
                    ✦ Fabric Curation & International Export
                  </span>
                </div>
              </div>

              {/* Aba Workshop */}
              <div
                className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#C2410C] font-bold text-xs uppercase tracking-widest block mb-2">
                    🇳🇬 Tailoring Workshop
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#140C07] mb-2">
                    Aba Master Atelier
                  </h3>
                  <p className="text-xs text-[#52453B] leading-relaxed mb-4">
                    44 Faulks Road, Aba, Abia State, Nigeria
                  </p>
                  <p className="text-[11px] text-[#8A7A6E]">
                    Operating Hours: Mon – Sat: 08:30 – 17:30 (WAT)
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-[#F2ECE1]">
                  <span className="text-[10px] text-[#C4975A] font-bold uppercase tracking-widest">
                    ✦ Hand-Stitching & Native Embroidery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: ROYAL HERITAGE EMERALD ENQUIRY PORTAL (#071A14)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#071A14] text-[#FAF6F0] border-y border-[#10B981]/20"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6.5rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6.5rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: WhatsApp Direct & SLA (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div
                  className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/75 p-8 shadow-2xl flex flex-col gap-4"
                >
                  <span className="text-[#34D399] font-bold text-xs uppercase tracking-widest">
                    ⚡ Fastest Response Channel
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-cream-100">
                    WhatsApp Direct Consultation
                  </h3>
                  <p className="text-xs text-stone-300 font-body leading-relaxed">
                    Have an inspirational screenshot or Pinterest pin you want duplicated? Need instant feedback on chest measurements? Chat directly with Samuelson on WhatsApp.
                  </p>
                  <div style={{ paddingTop: '8px' }}>
                    <Button
                      href="https://wa.me/2348000000000?text=Hello%20CaptainStitches,%20I%20have%20an%20inquiry%20regarding%20a%20bespoke%20order."
                      variant="primary"
                      size="md"
                      external
                      style={{
                        borderRadius: '12px',
                        padding: '14px 28px',
                        fontWeight: 700,
                      }}
                    >
                      💬 Open WhatsApp Direct
                    </Button>
                  </div>
                </div>

                {/* SLA Assurance Card */}
                <div
                  className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/75 p-8 shadow-2xl"
                >
                  <h4 className="font-serif text-lg font-bold text-cream-100 mb-4 pb-2 border-b border-[#10B981]/25">
                    Concierge Response Times
                  </h4>
                  <div className="flex flex-col gap-3 text-xs font-body text-stone-300">
                    <p>
                      <strong className="text-[#34D399]">WhatsApp:</strong> Replies typically within 1 hour during European and West African operating hours.
                    </p>
                    <p>
                      <strong className="text-[#E8D4B0]">Email Inquiries:</strong> Reviewed and answered with comprehensive fabric quotes within 24 business hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Email Form (7 Cols) */}
              <div className="lg:col-span-7">
                <div
                  className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/75 p-8 sm:p-10 shadow-2xl"
                >
                  <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                    Send a Tailoring Enquiry
                  </h3>
                  <p className="text-xs text-stone-300 font-body mb-6">
                    Fill out the form below and our head concierge will connect with you via email or phone.
                  </p>

                  {submitSuccess ? (
                    <div className="py-12 text-center flex flex-col items-center gap-4 animate-fadeIn">
                      <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center">
                        <span className="text-[#34D399] text-2xl font-bold">✓</span>
                      </div>
                      <h4 className="font-serif text-2xl text-cream-100 font-bold">
                        Enquiry Received
                      </h4>
                      <p className="text-stone-300 text-xs max-w-sm leading-relaxed">
                        Thank you for reaching out. We have logged your enquiry and our fitting team will review your details and respond within 24 business hours.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-4 rounded-full bg-[#C4975A] text-[#0C0704] px-6 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-[#E8D4B0] transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div>
                        <label className={labelClasses}>Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g., Chidi Okafor"
                          value={formData.fullName}
                          onChange={e => handleInputChange('fullName', e.target.value)}
                          className={inputClasses}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClasses}>Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="chidi@domain.com"
                            value={formData.email}
                            onChange={e => handleInputChange('email', e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>WhatsApp Number (Optional)</label>
                          <input
                            type="tel"
                            placeholder="+39 333 444 555"
                            value={formData.phone}
                            onChange={e => handleInputChange('phone', e.target.value)}
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClasses}>Enquiry Subject</label>
                        <select
                          value={formData.subject}
                          onChange={e => handleInputChange('subject', e.target.value)}
                          className={inputClasses}
                        >
                          <option value="Bespoke Inquiry">Bespoke Design & Fabric Inquiry</option>
                          <option value="Timeline Query">Production Timeline & Rush Order</option>
                          <option value="Measurement Help">Measurement Assistance & Verona Consultation</option>
                          <option value="Custom reference">Custom Photo Reference Reproduction</option>
                          <option value="Bulk/Wedding">Wedding Aso-Ebi & Group Attire</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClasses}>Your Message</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Tell us about the design you are envisioning, target delivery date in Europe, or any sizing questions..."
                          value={formData.message}
                          onChange={e => handleInputChange('message', e.target.value)}
                          className={[inputClasses, 'resize-none'].join(' ')}
                        />
                      </div>

                      <div style={{ marginTop: '8px' }}>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          disabled={isSubmitting}
                          style={{
                            borderRadius: '12px',
                            padding: '16px',
                            fontWeight: 700,
                          }}
                        >
                          {isSubmitting ? 'Transmitting Message...' : 'Submit Bespoke Enquiry'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WARM SAND EUROPEAN PATRON FAQS (#F7F3EB)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#F7F3EB] text-[#140C07]"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span
                className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '6px' }}
              >
                Frequently Asked Questions
              </span>
              <h2
                className="font-serif font-normal leading-tight text-[#140C07]"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
              >
                Everything You Need to Know
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#EBE3D7] overflow-hidden shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#140C07]">
                        {faq.q}
                      </h3>
                      <span className="text-[#C2410C] font-bold text-lg">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-0 text-xs sm:text-sm text-[#52453B] leading-relaxed border-t border-[#F2ECE1]">
                        <p style={{ marginTop: '1rem' }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
