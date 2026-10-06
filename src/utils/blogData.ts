export interface BlogPost {
  title: string
  category: string
  date: string
  readTime: string
  excerpt: string
  slug: string
  image: string
  tags: string[]
  content: string[] // Paragraphs or HTML strings
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "The Modern Agbada in Europe: A Gentleman's Guide to Diaspora Weddings",
    category: 'Style Guide',
    date: 'Jun 5, 2026',
    readTime: '5 min read',
    excerpt:
      'Discover how to style traditional Nigerian Agbada in Italy and Europe with bespoke cashmere tailoring by CaptainStitches.',
    slug: 'the-modern-agbada-in-europe',
    image: '/images/blog-bespoke.jpg',
    tags: ['Agbada', 'Bespoke', 'Diaspora Wedding', 'Style Guide', 'Italy'],
    content: [
      'In the realm of traditional Nigerian fashion, fit is not just a preference — it is the entire statement. Whether it is a grand Agbada, a sleek Senator set, or a Kaftan, these garments are culturally designed to drape, flow, and align precisely with the wearer’s body.',
      'Wearing an Agbada in Rome, Milan, or Verona carries immense cultural pride. However, European climates and architectural settings demand thoughtful adaptations in fabric choice and tailoring cut. Traditional heavy jacquards can overheat in indoor Mediterranean ballrooms, which is why our Verona atelier crafts modern Agbadas from breathable high-twist Italian wool and refined cashmere-cottons.',
      '"A bespoke Agbada must command the room without restricting the gentleman wearing it. Seam balance across the shoulders determines whether the cloth flies or drapes." — Master Tailor Samuelson',
      'When styling for European ceremonies, three rules stand above all: first, ensure the winged shoulder drape falls cleanly at the wrist-point; second, opt for a tailored split-mandarin buba collar that rests flush without bunching; and third, finish with hand-burnished Italian footwear.',
      'Ready to craft your bespoke wedding piece? Explore our collection or book a commission.',
    ],
  },
  {
    title: 'Why Bespoke Beats Ready-to-Wear for Nigerian Occasions',
    category: 'Style Guide',
    date: 'Jun 1, 2026',
    readTime: '4 min read',
    excerpt:
      "There's a reason every agbada you admire at a wedding was made to order. We explain why off-the-rack will never match the real thing.",
    slug: 'bespoke-vs-ready-to-wear',
    image: '/images/blog-bespoke.jpg',
    tags: ['Agbada', 'Bespoke', 'Traditional Wedding', 'Fashion Guide'],
    content: [
      'In the realm of traditional Nigerian fashion, fit is not just a preference — it is the entire statement. Whether it is a grand Agbada, a sleek Senator set, or a Kaftan, these garments are culturally designed to drape, flow, and align precisely with the wearer’s body. This is why off-the-rack alternatives will always pale in comparison to a custom-tailored piece.',
      'Ready-to-wear clothes are engineered to represent averages. They assume that if you have a certain shoulder width, your waist and sleeve lengths must fit standard proportions. But African bodies, and particularly the posture required to carry traditional attires, are unique. An Agbada that is too tight in the armholes or too short at the hem instantly loses its majestic presence.',
      'When you choose bespoke tailoring through CaptainStitches, every seam is designed around your physical profile. The drape of the Agbada shoulder is structured to fall gracefully without bunching. The trousers are cut to sit comfortably, accommodating both standing posture and traditional sitting arrangements at ceremonies.',
      'Additionally, bespoke fashion is about fabric integrity and embroidery craftsmanship. Ready-to-wear native attires often use lightweight, blended fabrics that do not hold the heavy chest embroidery characteristic of a premium Agbada. Our artisans in Aba and Lagos hand-select dense cashmere, structured cottons, and rich wools that support intricate geometric embroidery patterns without warping the material.',
      'Investing in a bespoke piece is an investment in your personal brand. It ensures that when you step into the room at a wedding, gala, or community ceremony, your clothing communicates respect, dignity, and a flawless sense of style.',
    ],
  },
  {
    title: 'How We Made a Full Agbada Set in 10 Days for a Wedding in Rome',
    category: 'Case Study',
    date: 'May 20, 2026',
    readTime: '6 min read',
    excerpt:
      'When Adewale contacted us 12 days before his wedding, we had to move fast — here is exactly how we pulled it off.',
    slug: 'agbada-rome-wedding',
    image: '/images/blog-rome.jpg',
    tags: ['Case Study', 'Agbada', 'Express Delivery', 'Rome'],
    content: [
      'It was a Tuesday afternoon when Adewale reached out to us from Rome. He was getting married the following Saturday, and due to a catastrophic logistics failure with another tailor, he had no outfit. With only 10 days until the wedding ceremony, we had to execute our express tailoring pipeline with zero margin for error.',
      'Here is the daily breakdown of how CaptainStitches mobilized operations between Verona, Lagos, and Rome to save the day:',
      '**Day 1: Measurement Collection & Verification**  \nWe immediately scheduled a WhatsApp video consultation. Our head coordinator guided Adewale through the measurements process, capturing precise shoulder, sleeve, chest, and trouser lengths. We finalized the design: a Grand Agbada in Royal Blue with gold embroidery, paired with a matching native cap (Fila).',
      '**Day 2–3: Material Sourcing & Cutting**  \nThe specifications were sent to our workshop in Aba. Our tailors sourced a premium, heavy-weight polished wool-blend that would drape majestically. By Wednesday evening, the panels were cut and ready for the embroidery machine.',
      '**Day 4–6: Detailed Hand-Finished Embroidery**  \nIntricate embroidery is the soul of an Agbada. Our lead designer programmed the geometric chest and sleeve details. After machine embroidery, our artisans spent a full day hand-trimming and finishing the loose threads to ensure a clean look.',
      '**Day 7: Tailor Inspection & Video Sign-off**  \nThe completed pieces were assembled, pressed, and laid out on our quality check board. We recorded a 4K inspection video showing the stitch lines, seams, and fit dimensions, and sent it to Adewale for approval. He was thrilled.',
      '**Day 8–9: DHL Express Shipping**  \nThe package was dispatched via DHL Express from Lagos directly to Adewale’s address in Rome. We monitored the shipment hourly as it cleared customs.',
      '**Day 10: Fitting and Delivery**  \nThe package arrived in Rome on Thursday afternoon. Adewale tried it on immediately. The fit was impeccable — no alterations needed. Two days later, he walked down the aisle in a custom piece that looked like it took months to make.',
    ],
  },
  {
    title: 'Beyond the Off-The-Rack Suit: Why Bespoke Senator Wear & African Fabric Ties Lead European Galas',
    category: 'Design Opinions',
    date: 'May 5, 2026',
    readTime: '5 min read',
    excerpt:
      'Off-the-rack Western suits are everywhere. We explore why bespoke Senator sets and handcrafted African fabric accessories command true distinction.',
    slug: 'suit-vs-senator',
    image: '/images/blog-suit-senator.jpg',
    tags: ['Senator Wear', 'African Ties', 'Ankara Accessories', 'Gala Attire'],
    content: [
      'In major European cities like Milan, London, and Frankfurt, off-the-rack Western suits are ubiquitous and inexpensive. But when attending a prestigious corporate gala, diploma award, or evening banquet, blending into a monotonous sea of identical black ready-to-wear suits leaves no lasting impression. This is why distinguished African professionals and discerning European patrons are turning to bespoke Senator wear and authentic African fabric accessories.',
      '**The Limitations of Ready-to-Wear Western Suiting**  \nOff-the-rack suits are produced in massive batches with synthetic linings and generic drop sizing. While easily accessible, they lack individuality and heritage. If you choose to wear a classic suit jacket, pairing it with a bespoke Ankara silk tie, matching pocket square, and handcrafted brass cufflinks instantly transforms an ordinary outfit into a bespoke statement of culture and sophistication.',
      '**The Senator Set: Cultural Confidence and Modern Minimalism**  \nThe Senator wear (a structured two-piece native set with long-sleeved tunic and tailored trousers) has established itself as the modern vanguard of African luxury. Cut from high-twist Italian wool, cashmere cotton, or heavy linen, a dark-toned Senator set in Midnight Black, Navy, or Emerald Green commands immense respect. It honors heritage while offering the crisp, clean silhouette expected at global corporate tables.',
      '**How to Make a Sartorial Impression in Europe**  \n1. *Accessorize with Authenticity:* If wearing Western tailoring, elevate it with handcrafted African accessories — an Ankara silk bowtie or beaded coral cufflinks add rare texture and individuality.  \n2. *Demand Impeccable Tailoring:* A bespoke Senator set requires millimeter precision across the shoulders, a collar that rests flush without gaping, and trousers hemmed clean to the shoe top.  \n3. *Own Your Heritage:* Wearing bespoke African craftsmanship communicates dignity, origin, and an uncompromising standard of elegance.',
    ],
  },
]
