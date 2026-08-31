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
    title: 'English Suit vs Senator: Which Should You Wear to a Corporate Dinner?',
    category: 'Design Opinions',
    date: 'May 5, 2026',
    readTime: '5 min read',
    excerpt:
      'Both are sharp. Both command a room. The right choice depends on the message you want to send.',
    slug: 'suit-vs-senator',
    image: '/images/blog-suit-senator.jpg',
    tags: ['Suits', 'Senator Wear', 'Corporate Fashion', 'Gala Attire'],
    content: [
      'It is the classic modern corporate dilemma for African professionals in Europe: do you wear a traditional English three-piece suit or a sharp custom Senator wear to a high-end corporate dinner? Both styles are formal, sophisticated, and command respect. However, they tell different stories.',
      '**The English Suit: Classic Corporate Authority**  \nA classic three-piece suit (jacket, waistcoat, trousers) is the universal language of global business. It represents structure, formality, and alignment with corporate traditions. If the dinner is an international corporate gala where you are presenting or negotiating, the English suit is a bulletproof choice. It says you belong in the room and respect global corporate standards.',
      '**The Senator Set: Cultural Confidence and Pride**  \nIn recent years, the Senator wear (a structured two-piece native set with long-sleeved tunic and slim trousers) has migrated from Nigerian political circles to global corporate tables. It represents cultural pride, identity, and confidence. Wearing a sharp, dark-toned Senator wear (such as Midnight Navy or Slate Grey) with a breast pocket pocket-square is highly distinguished. It says you are proud of your heritage and stand out from the sea of black tuxedos.',
      '**How to Choose Based on the Context**  \n1. *The Dress Code:* If the invitation explicitly says "Black Tie," a tuxedo or a Grand Agbada is appropriate. If it says "Business Formal," both the suit and the Senator wear are acceptable.  \n2. *Your Role:* If you are hosting or want to project an identity as a global African leader, the Senator set is an incredible icebreaker that starts conversations about craft and culture.  \n3. *Fabric and Tailoring:* A cheap suit looks bad, but a cheap Senator wear looks worse. If you wear Senator to a corporate dinner, the tailoring must be razor-sharp, made from high-grade wool or cashmere crepe, with clean plackets and invisible stitching.',
    ],
  },
]
