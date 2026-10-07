/*
  SITE DATA — the single source of truth for the whole portfolio.
  ------------------------------------------------------------------
  • To add a project: copy one object in `projects`, give it a unique `id`.
  • To use a real image: put the file in assets/img/ and set
      cover: "assets/img/your-photo.jpg"
    and/or fill `gallery` with { src: "assets/img/...", caption: "..." }.
    Anything without `src` shows a pink placeholder frame instead.
  • category must be one of: "modelling", "brand", "research".
  • status: "coming-soon" shows a badge and a planned-outline page.
*/
window.SITE = {
  profile: {
    name: "Sofia Nadine Gillegean",
    short: "Sofia",
    tagline: ["Model", "Creative", "Brand & Research"],
    location: "Metro Manila, Philippines",
    email: "nadinegillegean@gmail.com",
    portrait: "", // e.g. "assets/img/portrait.jpg" — empty shows a pink placeholder circle
    // Scrapbook ending: add your own images in assets/img/ and set the paths.
    postcard: "", // e.g. "assets/img/postcard.jpg"
    photobooth: ["", "", "", ""], // up to 4 photobooth frames, e.g. ["assets/img/booth1.jpg", ...]
    // Social links shown in the footer/contact. Remove a line to hide it.
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/sofia-nadine-gillegean-484507383/" },
      { label: "Instagram", url: "https://instagram.com/sofiagillegean" },
      { label: "TikTok", url: "https://www.tiktok.com/@dimbokki" },
      { label: "Facebook", url: "https://www.facebook.com/dimxcxy/" },
    ],
    intro:
      "A people-oriented creative who brings people together and turns ideas into action — across modelling, brand design, events, and the research that makes them work.",
    bio: [
      "Hi! I'm Sofia. I love travelling, singing in my choir, and cats.",
      "By day I'm an Industrial Engineering student at De La Salle University. Somehow I keep ending up in charge of the projects that need someone to bring people together — a thrifted-denim brand, student government, theatre, and events.",
    ],
  },

  // Short stories for the About page (not a CV): stat, title, tag, one sentence.
  stories: [
    { stat: "1,000+", title: "Old Jeans", tag: "General Manager & Co-Owner", text: "A thrifted-denim brand and denim-pouch line. We grew to 1,000+ followers in two months and sold ₱44,000 at our first bazaar." },
    { stat: "25k+", title: "DLSU Chorale", tag: "Marketing Communications Lead", text: "I make the videos and content for our choir: 13 videos so far, 25k+ views and 1.8k likes." },
    { stat: "32k+", title: "Teatro Lasalyano", tag: "Stage Manager", text: "I ran the technical booth and the cue sheets for Animulat: Ang Huling Takipsilim, and the promo video passed 32k views." },
    { stat: "1 site", title: "Engineering Student Government", tag: "Student Services Executive", text: "I built a central deadlines website with Google Calendar built in, so every org can see what's due." },
    { stat: "On-site", title: "IMES AI Expo 2025", tag: "Assistant Team Head, Productions", text: "Booth layouts, interactive photobooth props and a lot of on-site coordination." },
    { stat: "4 campuses", title: "Gateway Summer Camp", tag: "DLSU Student Delegate", text: "Campus visits at NUS, SMU, LASALLE and SUTD, and the Award of Excellence for Best Teamwork." },
  ],

  // Skills shown as a receipt on the About page.
  toolkit: [
    { group: "Creative", items: ["Photoshop", "Lightroom", "After Effects", "DaVinci Resolve", "CapCut", "Canva"] },
    { group: "Work", items: ["MS Office", "Google Workspace"] },
    { group: "Code", items: ["Python", "C++"] },
    { group: "Languages", items: ["English", "Filipino"] },
  ],

  // Digital-camera scroll section. Add `src: "assets/img/xyz.jpg"` to use your own photos.
  camera: [
    { title: "On the road", text: "I love travelling: Singapore and Hong Kong so far, with a long list of next stops.", tone: 4, icon: "plane", label: "Travel photo" },
    { title: "In the choir", text: "Soprano 2 in the DLSU Chorale, and the one making the videos for it.", tone: 1, icon: "note", label: "Choir photo" },
    { title: "Behind the lens", text: "Polaroids, digicams and a camera roll full of friends.", tone: 6, icon: "camera", label: "Friends photo" },
    { title: "Cat person", text: "If there's a cat nearby, I've already found it.", tone: 2, icon: "cat", label: "Cat photo" },
  ],

  highlights: [
    { short: "₱44,000", detail: "Combined sales at the DLSU SHS ABM bazaar — Old Jeans", size: 3 },
    { short: "1,000+", detail: "Social followers gained in 2 months — Old Jeans", size: 2 },
    { short: "32k+ views", detail: "Teatro Lasalyano promo video", size: 3 },
    { short: "Best Teamwork", detail: "Award of Excellence — Gateway Summer Camp, Singapore", size: 2 },
    { short: "30k+ views", detail: "4 promo videos in a month — Hopefest 2022", size: 2 },
    { short: "Gold Term", detail: "Excellence Award, AY 2022–2024", size: 1 },
    { short: "25k+ views", detail: "13 videos for DLSU Chorale, 1.8k likes", size: 2 },
    { short: "2k+ followers", detail: "Hopefest 2022 event account growth", size: 1 },
  ],

  categories: [
    { id: "modelling", label: "Modelling" },
    { id: "brand", label: "Past Works" },
    { id: "research", label: "Future Research" },
  ],

  projects: [
    /* ---------- MODELLING (placeholder shoots — edit with your real details) ---------- */
    {
      id: "denim-story",
      category: "modelling",
      title: "Denim Story",
      subtitle: "Editorial shoot",
      year: "2025",
      role: "Model",
      tone: 1,
      summary: "A soft, sunlit editorial built around vintage denim and everyday movement.",
      overview:
        "An editorial series styled around thrifted denim — relaxed silhouettes, natural light, and candid in-between moments rather than stiff poses.",
      process:
        "Worked with the photographer and stylist on mood references, posing direction, and a shot list that balanced full-length looks with close detail frames.",
      outcome:
        "A cohesive set of editorial frames used for lookbook and social content.",
      credits: ["Photography — TBA", "Styling — TBA"],
      gallery: [{ caption: "Look 01" }, { caption: "Look 02" }, { caption: "Detail" }, { caption: "Look 03" }],
    },
    {
      id: "campus-lookbook",
      category: "modelling",
      title: "Campus Lookbook",
      subtitle: "Lifestyle / lookbook",
      year: "2025",
      role: "Model",
      tone: 2,
      summary: "Everyday campus style, shot on location around Manila.",
      overview:
        "A lifestyle lookbook capturing easy, wearable outfits in real campus spaces — hallways, steps, and coffee breaks.",
      process:
        "Planned outfit changes and locations around natural light windows, keeping energy playful and unposed.",
      outcome: "A bright, approachable lookbook set for brand and personal use.",
      credits: ["Photography — TBA"],
      gallery: [{ caption: "Outfit 01" }, { caption: "Outfit 02" }, { caption: "Outfit 03" }],
    },
    {
      id: "portrait-series",
      category: "modelling",
      title: "Portrait Series",
      subtitle: "Studio portraits",
      year: "2024",
      role: "Model",
      tone: 3,
      summary: "Clean studio portraits exploring expression and soft light.",
      overview:
        "A studio portrait session focused on expression, posture, and minimal styling against simple backdrops.",
      process: "Short sets with a single soft light, moving from neutral to expressive frames.",
      outcome: "A portrait set suited for comp cards and profiles.",
      credits: ["Photography — TBA"],
      gallery: [{ caption: "Portrait 01" }, { caption: "Portrait 02" }, { caption: "Portrait 03" }, { caption: "Portrait 04" }],
    },

    /* ---------- BRAND DESIGN ---------- */
    {
      id: "old-jeans",
      category: "brand",
      title: "Old Jeans",
      subtitle: "Thrifted denim brand",
      year: "2023 – Present",
      role: "General Manager · Co-Owner",
      tone: 4,
      summary: "A thrifted-clothing and denim-pouch brand — from identity and content to product and sales.",
      overview:
        "Old Jeans started as an ABM business project at DLSU Senior High School and grew into a brand spanning thrifted clothing and an original denim pouch line. I led end-to-end operations across marketing, sales, finance, and product development with my co-owners.",
      process:
        "I directed the brand's promotional and digital content — product publications, photoshoots, edited promo videos and marketing materials. For the denim pouch line, I designed the products with my co-owners and coordinated with external manufacturers from design through production. I also oversaw financial operations and prepared the financial statements.",
      outcome:
        "Grew the brand's social media following to 1,000+ within two months and generated ₱44,000 in combined sales across both ventures at the DLSU SHS ABM bazaar.",
      stats: [
        { value: "₱44k", label: "combined bazaar sales" },
        { value: "1,000+", label: "followers in 2 months" },
        { value: "2", label: "product ventures" },
      ],
      credits: ["Co-owners — the Old Jeans team"],
      gallery: [{ caption: "Brand identity" }, { caption: "Product shoot" }, { caption: "Denim pouch line" }, { caption: "Social content" }],
    },
    {
      id: "mochi-milk",
      category: "brand",
      title: "Mochi & Milk",
      subtitle: "Café brand concept (mock)",
      year: "2025",
      role: "Brand Designer",
      tone: 5,
      summary: "A cosy dessert café identity — soft shapes, milky pinks, and a mascot that winks.",
      overview:
        "A self-initiated mock brand for a mochi and milk-tea café aimed at students who want a calm, pretty place to study.",
      process:
        "Explored names and moodboards, then built a logo, palette, type pairing, packaging mockups and a short social launch set.",
      outcome: "A complete mini brand kit: logo suite, colour system, cup and box packaging, and launch posts.",
      credits: ["Concept project"],
      gallery: [{ caption: "Logo suite" }, { caption: "Palette & type" }, { caption: "Packaging" }, { caption: "Launch posts" }],
    },
    {
      id: "petal-lab",
      category: "brand",
      title: "Petal Lab",
      subtitle: "Skincare brand concept (mock)",
      year: "2025",
      role: "Brand Designer",
      tone: 6,
      summary: "A gentle, science-meets-flowers skincare identity for sensitive skin.",
      overview:
        "A mock skincare brand balancing clinical clarity with softness — clean labels, petal motifs and calm whitespace.",
      process:
        "Defined the brand voice, designed the wordmark and label system, and mocked up bottles, boxes and an e-commerce hero.",
      outcome: "Brand guidelines, product label system, and a campaign key visual.",
      credits: ["Concept project"],
      gallery: [{ caption: "Wordmark" }, { caption: "Label system" }, { caption: "Product mockups" }],
    },

    /* ---------- RESEARCH & CASE STUDIES (coming soon) ---------- */
    {
      id: "queue-to-cup",
      category: "research",
      status: "coming-soon",
      title: "Queue to Cup",
      subtitle: "Service-design case study",
      year: "Coming soon",
      role: "Researcher · IE / Service Management",
      tone: 7,
      summary: "Mapping a campus café's service journey to cut wait times without losing the warmth.",
      overview:
        "A planned case study applying Industrial Engineering and service-management tools to a busy campus café during peak hours.",
      plan: [
        "Observe and time the end-to-end customer journey at peak and off-peak hours",
        "Build a service blueprint (front-stage, back-stage, support processes)",
        "Identify bottlenecks with simple queueing and process analysis",
        "Propose and prototype low-cost improvements",
      ],
      credits: [],
      gallery: [],
    },
    {
      id: "pre-loved",
      category: "research",
      status: "coming-soon",
      title: "Pre-loved, Re-loved",
      subtitle: "Market research — Gen Z thrift fashion",
      year: "Coming soon",
      role: "Market Researcher",
      tone: 8,
      summary: "Why Gen Z in Metro Manila buys thrifted fashion — and what makes them come back.",
      overview:
        "A planned market study building on lessons from running Old Jeans: motivations, price sensitivity and channels for thrifted fashion among students.",
      plan: [
        "Survey and short interviews with student shoppers",
        "Competitor scan of local online thrift shops",
        "Customer personas and purchase-journey map",
        "Recommendations for small thrift brands",
      ],
      credits: [],
      gallery: [],
    },
  ],

  cv: {
    education: [
      {
        school: "De La Salle University",
        place: "Manila, Philippines",
        program: "BS Industrial Engineering with Service Management",
        years: "2024 – Present",
        notes: [],
      },
      {
        school: "De La Salle University",
        place: "Manila, Philippines",
        program: "Senior High School — Accountancy, Business, and Management (ABM)",
        years: "2022 – 2024",
        notes: ["Recipient of Exemplary Conduct Award", "Gold Term Excellence Award across AY 2022–2024"],
      },
      {
        school: "Immaculate Heart of Mary College",
        place: "Parañaque, Philippines",
        program: "Junior High School",
        years: "2018 – 2022",
        notes: [
          "Graduated with High Honors; consistent Merit Card awardee",
          "SAGE (Student Alliance for Good Education) Leadership Award",
          "Students' Choice Award — Picture Perfect Science Fair 2021",
          "Class president for two consecutive years",
        ],
      },
    ],
    experience: [
      {
        org: "79th Engineering Batch — GCOE Student Government",
        role: "Student Services Executive",
        place: "Manila",
        years: "2025 – Present",
        points: [
          "Designed and built a centralized website consolidating verified academic and organizational deadlines for the batch.",
          "Integrated Google Calendar to streamline time-sensitive announcements.",
          "Coordinated with student leaders and org representatives to gather and verify information.",
        ],
      },
      {
        org: "Gateway Summer Camp",
        role: "DLSU Student Delegate",
        place: "Singapore",
        years: "2025",
        points: [
          "Academic sessions and campus visits at NUS, SMU, LASALLE College of the Arts and SUTD.",
          "Analyzed global issues from a local perspective in an international team.",
          "Received the Award of Excellence for Best Teamwork.",
        ],
      },
      {
        org: "Old Jeans",
        role: "General Manager · Co-Owner",
        place: "Manila",
        years: "2023 – Present",
        points: [
          "Led operations across marketing, sales, finance and product development.",
          "Grew social following to 1,000+ in two months; ₱44,000 combined bazaar sales.",
          "Led denim-pouch product development with external manufacturers.",
        ],
      },
      {
        org: "IMES AI Expo 2025",
        role: "Assistant Team Head for Productions",
        place: "Manila",
        years: "2025",
        points: [
          "Conceptualized booth layouts and designed interactive photobooth props.",
          "Coordinated venue and on-site production for smooth event execution.",
        ],
      },
      {
        org: "De La Salle University Chorale",
        role: "Marketing Communications Lead · Soprano 2 Trainee",
        place: "Manila",
        years: "2025 – Present",
        points: ["Produced 13 social videos totaling 25k+ views and 1.8k likes promoting the Chorale's performances."],
      },
      {
        org: "Teatro Lasalyano",
        role: "Stage Manager — “Animulat: Ang Huling Takipsilim”",
        place: "Manila",
        years: "2024",
        points: [
          "Coordinated production committees and kept information flowing across teams.",
          "Built production cue sheets in Excel and ran the technical booth during shows.",
          "Directed promotional video content that garnered 32k+ views.",
        ],
      },
      {
        org: "Hopefest 2022: BAYLE",
        role: "Event Director",
        place: "Manila",
        years: "2022",
        points: [
          "Directed planning and execution of a large-scale school event.",
          "Produced four promo videos with 30k+ views in a month; grew the event account to 2k+ followers.",
        ],
      },
      {
        org: "Student Alliance for Good Education (S.A.G.E.)",
        role: "Junior High School President · Batch Representative",
        place: "Parañaque",
        years: "2018 – 2022",
        points: [
          "Represented the student body and coordinated with faculty and administration.",
          "Created and launched the organization's official social media page, still in use today.",
        ],
      },
    ],
    skills: {
      Creative: ["Adobe Photoshop", "Adobe Lightroom", "Adobe After Effects", "DaVinci Resolve", "CapCut", "Canva"],
      Business: ["Microsoft Excel", "Word", "PowerPoint", "Google Workspace"],
      Code: ["Python", "C++"],
      People: [
        "Collaborative Leadership",
        "Project Management",
        "Stakeholder Coordination",
        "Relationship Building",
        "Creative Problem-Solving",
      ],
      Languages: ["English (native/bilingual)", "Filipino (native/bilingual)"],
    },
    organizations: [
      "Industrial Engineering Management Society",
      "JCI Perlas Pasay",
      "Red Cross Youth",
      "Immaculatinian Thespian Guild",
      "Coro Fransescano",
    ],
    achievements: [
      "University representative — 1st Asia Pacific Catholic University Choral Symposium, Hong Kong",
      "Award of Excellence for Best Teamwork — Gateway Summer Camp, Singapore",
    ],
  },
};
