import { Button } from "@/components/ui/Button";
import SectionEyebrow from "@/utils/sectionEyeBrow";


const howItWorks = [
  {
    step: '01',
    title: 'Browse & choose',
    body: 'Explore our design catalogue or bring your own reference. Select fabric, colour, and style.',
  },
  {
    step: '02',
    title: 'Submit measurements',
    body: 'Our guided form walks you through every measurement — with diagrams to make it simple wherever you are.',
  },
  {
    step: '03',
    title: 'We craft & inspect',
    body: 'Your outfit is made by our tailors in Nigeria. Samuelson personally reviews every finished piece on video before dispatch.',
  },
  {
    step: '04',
    title: 'Delivered to your door',
    body: 'We ship directly to Italy, the UK, and across Europe. Track your order at every stage.',
  },
]


const HowItWorks = () => {
  return (
    <>
    {/* ══════════════════════════════════════════════════════════════════
            4. HOW IT WORKS
            Two-column layout: sticky large heading left, numbered steps right.
            Mirrors the Norven CUSTOMIZE section structure.
        ══════════════════════════════════════════════════════════════════ */}
        <section
          className="bg-brown-900 section-y"
          aria-labelledby="how-heading"
        >
          <div className="container-brand">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

              {/* Left — sticky heading + CTA */}
              <div className="lg:sticky lg:top-28">
                <SectionEyebrow label="The process" />
                <h2 id="how-heading" className="text-heading-xl text-cream-200">
                  How it
                  <br />works
                </h2>
                <p className="text-body mt-6 max-w-sm">
                  From your first message to a finished garment at your door —
                  every step is tracked, and Samuelson personally signs off
                  before anything ships.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button href="/order" variant="primary" size="lg">
                    Start your order
                  </Button>
                  <Button href="/track" variant="outline" size="lg">
                    Track an order
                  </Button>
                </div>
              </div>

              {/* Right — numbered steps */}
              <div>
                {howItWorks.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-8 py-8 border-b border-brown-700 last:border-b-0"
                  >
                    <span
                      className="font-display text-5xl md:text-6xl font-bold text-brown-600 leading-none flex-shrink-0 select-none"
                      aria-hidden="true"
                    >
                      {item.step}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-heading-md text-cream-200">{item.title}</h3>
                      <p className="text-body mt-2">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
    </>
  )
}

export default HowItWorks