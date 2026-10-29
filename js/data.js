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
    tagline: ["Creative", "Researcher", "Student"],
    location: "Metro Manila, Philippines",
    email: "nadinegillegean@gmail.com",
    portrait: "assets/img/portrait.jpg", // vertical photo; swap the file to change it
    portraitAlt: "assets/img/teatro-main.jpg", // About page: shows on hover (or tap) as the "off camera" side
    // About page: the word after "I'm a" cycles through these
    roles: ["model", "stage manager", "soprano", "brand co-owner", "researcher", "engineering student"],
    // About page: quick facts beside the bio
    facts: [
      ["Based in", "Metro Manila"],
      ["Studying", "Industrial Engineering, DLSU"],
      ["On camera", "UNIQLO PH, McDonald's"],
      ["Behind it", "Stage manager, brand co-owner"],
      ["Off duty", "Soprano 2, DLSU Chorale"],
      ["Say it", "gil-ye-gan"],
    ],
    credential: "Cast: UNIQLO PH", // Short line above the hero name. Leave empty to hide it.
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
      "A creative who brings people together and turns ideas into action, across brand shoots, events, content and the research that makes them work.",
    bio: [
      "I'm Sofia, a creative based in Metro Manila and an Industrial Engineering student at De La Salle University.",
      "I keep ending up where people and ideas meet: shoots and brand work in front of the camera, and behind it, running a thrifted-denim brand, student government, theatre and events. I like clear plans, warm teams and work that looks good.",
    ],
  },

  // Hero deck: one card per line. kind "photo" uses profile.portrait; tone is one of pom / flax / esp / pink.
  deck: [
    { kind: "photo", title: "Sofia Nadine", idx: "S", suit: "\u2665" },
    { kind: "text", title: "Creative", text: "Shoots, brand work, content and events.", idx: "C", suit: "\u2663", tone: "pom" },
    { kind: "text", title: "Researcher", text: "The research that makes the work work.", idx: "R", suit: "\u2666", tone: "flax" },
    { kind: "text", title: "Student", text: "Industrial Engineering at De La Salle University.", idx: "S", suit: "\u2660", tone: "esp" },
    { kind: "text", title: "Model", text: "Brand shoots, campaigns and editorials.", idx: "M", suit: "\u2665", tone: "pink" },
  ],

  // Experience list + detail pages (org.html?id=...). Facts come from your resume; edit freely.
  // Add `cover: "assets/img/xyz.jpg"` and `gallery: [{ src, caption }]` to show real photos.
  orgs: [
    {
      id: "chorale", name: "DLSU Chorale", role: "Marketing Communications Lead · Soprano 2", years: "2025 – present", place: "De La Salle University",
      summary: "I handle marketing and content for the university choir, and sing as a Soprano 2 trainee.",
      did: ["Plan and produce the choir's videos and social content", "Lead marketing communications for performances and events", "Sing as a Soprano 2 trainee", "Represented the university at the 1st Asia Pacific Catholic University Choral Symposium in Hong Kong"],
      results: [{ value: "13", label: "videos produced" }, { value: "25k+", label: "total views" }, { value: "1.8k", label: "likes" }],
      tone: 1, icon: "note", cover: "assets/img/hk-digicam.jpg", gallery: [
        { src: "assets/img/hk-perf-1.jpg", caption: "Performing in Hong Kong" },
        { src: "assets/img/hk-rehearsal.jpg", caption: "Rehearsal before the symposium" },
        { src: "assets/img/hk-perf-2.jpg", caption: "On stage" },
        { src: "assets/img/hk-group.jpg", caption: "With participants at the symposium" },
        { src: "assets/img/hk-perf-3.jpg", caption: "The final bow" },
        { src: "assets/img/hk-frame-4.jpg", caption: "Symposium group photo" },
        { src: "assets/img/hk-delegation.jpg", caption: "The Philippine delegation in Hong Kong" },
      ],
    },
    {
      id: "teatro", name: "Teatro Lasalyano", role: "Stage Manager", years: "2024", place: "De La Salle University",
      summary: "Stage manager for the production \"Animulat: Ang Huling Takipsilim\".",
      did: ["Built and maintained the production cue sheets in Excel", "Ran the technical booth during the show", "Supported the production's promo video"],
      results: [{ value: "32k+", label: "views on the promo video" }],
      tone: 2, icon: "camera", cover: "assets/img/teatro-main.jpg", gallery: [
        { src: "assets/img/teatro-stage.jpg", caption: "The set before the show" },
        { src: "assets/img/teatro-group.jpg", caption: "Cast and crew after the show" },
      ],
    },
    {
      id: "old-jeans", name: "Old Jeans", role: "General Manager & Co-Owner", years: "2023 – present", place: "Metro Manila",
      summary: "A thrifted-denim brand with a denim-pouch line, built from first bazaar to a growing online following.",
      did: ["Led product development with external manufacturers", "Ran day-to-day operations and sales", "Grew the brand's social presence", "Sold at the DLSU SHS ABM bazaar"],
      results: [{ value: "1,000+", label: "followers in 2 months" }, { value: "₱44,000", label: "combined bazaar sales" }],
      tone: 4, icon: "brand", cover: "assets/img/old-jeans-bazaar.jpg", gallery: [],
    },
    {
      id: "gcoe", name: "Engineering Student Government", role: "Student Services Executive", years: "2025 – present", place: "79th Engineering Batch, GCOE",
      summary: "I run student services for the batch, including a central deadlines website.",
      did: ["Built a centralized deadlines website", "Integrated Google Calendar so every org can see what is due", "Coordinated with org representatives"],
      results: [{ value: "1", label: "central deadlines site" }],
      tone: 6, icon: "research", cover: "", gallery: [],
    },
    {
      id: "imes", name: "IMES AI Expo 2025", role: "Assistant Team Head, Productions", years: "2025", place: "Industrial Engineering Management Society",
      summary: "I helped lead the productions team for the society's AI Expo.",
      did: ["Designed booth layouts", "Built interactive photobooth props", "Coordinated on-site on the event day"],
      results: [],
      tone: 3, icon: "brand", cover: "", gallery: [],
    },
    {
      id: "gateway", name: "Gateway Summer Camp", role: "DLSU Student Delegate", years: "2025", place: "Singapore",
      summary: "A delegate for De La Salle University on a summer programme in Singapore.",
      did: ["Campus visits and academic sessions at NUS, SMU, LASALLE College of the Arts and SUTD", "Worked in a delegate team across the programme"],
      results: [{ value: "Award", label: "of Excellence for Best Teamwork" }],
      tone: 5, icon: "plane", cover: "assets/img/gateway-sg.jpg", gallery: [
        { src: "assets/img/gateway-sg.jpg", caption: "With the Gateway delegates in Singapore" },
      ],
    },
    {
      id: "hopefest", name: "Hopefest 2022: BAYLE", role: "Event Director", years: "2022", place: "Immaculate Heart of Mary College",
      summary: "I directed a school event and ran its promotion.",
      did: ["Directed the event end to end", "Produced promo videos and grew the event account"],
      results: [{ value: "4", label: "promo videos, 30k+ views in a month" }, { value: "2k+", label: "followers on the event account" }],
      tone: 2, icon: "camera", cover: "", gallery: [],
    },
  ],

  // Reel: vertical (9:16) MP4 files in assets/video/. Leave `src` empty for a placeholder.
  videos: [
    { title: "Modelling reel", note: "Selected looks", src: "", poster: "" },
    { title: "Behind the scenes", note: "On set", src: "", poster: "" },
    { title: "Brand content", note: "Old Jeans", src: "", poster: "" },
  ],

  // TikTok: paste full video links, e.g. "https://www.tiktok.com/@dimbokki/video/1234567890123456789".
  tiktok: ["", "", "", ""],

  // Short stories for the About page (not a CV): stat, title, tag, one sentence.
  stories: [
    { stat: "1,000+", title: "Old Jeans", org: "old-jeans", tag: "General Manager & Co-Owner", text: "A thrifted-denim brand and denim-pouch line. We grew to 1,000+ followers in two months and sold ₱44,000 at our first bazaar." },
    { stat: "25k+", title: "DLSU Chorale", org: "chorale", tag: "Marketing Communications Lead", text: "I make the videos and content for our choir: 13 videos so far, 25k+ views and 1.8k likes." },
    { stat: "32k+", title: "Teatro Lasalyano", org: "teatro", tag: "Stage Manager", text: "I ran the technical booth and the cue sheets for Animulat: Ang Huling Takipsilim, and the promo video passed 32k views." },
    { stat: "1 site", title: "Engineering Student Government", org: "gcoe", tag: "Student Services Executive", text: "I built a central deadlines website with Google Calendar built in, so every org can see what's due." },
    { stat: "On-site", title: "IMES AI Expo 2025", org: "imes", tag: "Assistant Team Head, Productions", text: "Booth layouts, interactive photobooth props and a lot of on-site coordination." },
    { stat: "4 campuses", title: "Gateway Summer Camp", org: "gateway", tag: "DLSU Student Delegate", text: "Campus visits at NUS, SMU, LASALLE and SUTD, and the Award of Excellence for Best Teamwork." },
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
    { title: "On location", text: "Shoots and brand work: the moments between the poses.", tone: 1, icon: "camera", label: "Shoot photo" },
    { title: "On stage", text: "Soprano 2 in the DLSU Chorale, and the one behind its videos.", src: "assets/img/hk-digicam.jpg", tone: 2, icon: "note", label: "Choir photo" },
    { title: "Abroad", text: "Singapore and Hong Kong so far, with a long list of next stops.", src: "assets/img/gateway-sg.jpg", tone: 4, icon: "plane", label: "Travel photo" },
    { title: "Backstage", text: "Stage manager for Animulat: cue sheets, headset and the technical booth.", src: "assets/img/teatro-main.jpg", tone: 6, icon: "cat", label: "Backstage photo" },
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
    { id: "brand", label: "Past Projects", desc: "Brands, content and events I have led." },
    { id: "modelling", label: "Modelling", desc: "Brand shoots, editorials and test shoots." },
    { id: "research", label: "Case Studies", desc: "Research and service-design projects in progress." },
  ],

  projects: [
    /* ---------- MODELLING ---------- */
    {
      id: "uniqlo-ph",
      category: "modelling",
      title: "UNIQLO PH",
      subtitle: "Brand shoot",
      year: "2026",
      role: "Model",
      tone: 1,
      cover: "assets/img/uniqlo-cover.jpg",
      summary: "Cast for a UNIQLO PH shoot. Watch the first reels from it below.",
      overview:
        "I was cast for a UNIQLO PH shoot. The first reels from it are below, with behind-the-scenes moments and the full story to follow.",
      // Instagram reels (paste the plain reel link; extra ?utm_ parameters are ignored).
      reels: [
        { title: "UNIQLO PH", note: "Reel 1", url: "https://www.instagram.com/reel/Deqx7hfDuNg/" },
        { title: "UNIQLO PH", note: "Reel 2", url: "https://www.instagram.com/reel/DegXLf7AeSD/" },
      ],
      // TODO for the in-depth write-up: add `process` (the brief, the shoot day, my part) and
      // `outcome` (results), plus `stats`, `credits` and a `gallery` of BTS stills. Each one
      // appears on the page as soon as it is filled in.
    },
    {
      id: "mcdo-desserts",
      category: "modelling",
      title: "McDonald's Desserts",
      subtitle: "Social media campaign",
      year: "2026",
      tone: 3,
      cover: "assets/img/mcdo-bts.jpg",
      status: "coming-soon",
      summary: "Cast for McDonald's desserts social media campaign. Behind the scenes for now, campaign photos soon.",
      overview:
        "I was cast in a social media campaign for McDonald's desserts. This page will carry the campaign, my part in it and the photos once they are released.",
      plan: ["The campaign and my role", "Content and highlights", "Results"],
    },
    { id: "empty-modelling", category: "modelling", empty: true, title: "More coming soon" },

    /* ---------- PAST PROJECTS ---------- */
    {
      id: "old-jeans",
      category: "brand",
      title: "Old Jeans",
      subtitle: "Thrifted denim brand",
      year: "2023 – Present",
      role: "General Manager · Co-Owner",
      tone: 4,
      cover: "assets/img/old-jeans-bazaar.jpg",
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
      id: "dlsu-chorale",
      category: "brand",
      title: "DLSU Chorale",
      subtitle: "Marketing and content",
      year: "2025 – Present",
      role: "Marketing Communications Lead · Soprano 2",
      tone: 1,
      cover: "assets/img/hk-digicam.jpg",
      summary: "Video and marketing content for the university choir, and a choral symposium in Hong Kong.",
      overview:
        "I lead marketing communications for the DLSU Chorale and sing as a Soprano 2 trainee. I also represented the university at the 1st Asia Pacific Catholic University Choral Symposium in Hong Kong.",
      process:
        "I plan and produce the choir's videos and social content, from concept and filming to editing, and coordinate the messaging around performances and events.",
      outcome: "13 videos produced, with 25k+ total views and 1.8k likes.",
      stats: [
        { value: "13", label: "videos produced" },
        { value: "25k+", label: "total views" },
        { value: "1.8k", label: "likes" },
      ],
      credits: ["DLSU Chorale"],
      gallery: [
        { src: "assets/img/hk-perf-1.jpg", caption: "Performing in Hong Kong" },
        { src: "assets/img/hk-rehearsal.jpg", caption: "Rehearsal before the symposium" },
        { src: "assets/img/hk-perf-2.jpg", caption: "On stage" },
        { src: "assets/img/hk-group.jpg", caption: "With participants at the symposium" },
        { src: "assets/img/hk-perf-3.jpg", caption: "The final bow" },
      ],
    },
    {
      id: "teatro-lasalyano",
      category: "brand",
      title: "Teatro Lasalyano",
      subtitle: "Stage management",
      year: "2024",
      role: "Stage Manager",
      tone: 2,
      cover: "assets/img/teatro-group.jpg",
      summary: "Stage manager for the production \"Animulat: Ang Huling Takipsilim\", from cue sheets to the technical booth.",
      overview:
        "I was the stage manager for Teatro Lasalyano's production \"Animulat: Ang Huling Takipsilim\" at De La Salle University, keeping cast, crew and the technical side moving together.",
      process:
        "I built and maintained the production's cue sheets in Excel, ran the technical booth during the show and supported the production's promo video.",
      outcome: "The production's promo video passed 32k views.",
      stats: [{ value: "32k+", label: "views on the promo video" }],
      credits: ["Teatro Lasalyano"],
      gallery: [
        { src: "assets/img/teatro-stage.jpg", caption: "The set before the show" },
        { src: "assets/img/teatro-main.jpg", caption: "On headset, backstage" },
      ],
    },
    { id: "empty-brand", category: "brand", empty: true, title: "More coming soon" },

    /* ---------- CASE STUDIES ---------- */
    {
      id: "seo",
      category: "research",
      title: "SEO",
      subtitle: "Case study",
      year: "2026",
      role: "Researcher",
      status: "coming-soon",
      tone: 6,
      cover: "",
      summary: "A case study on search engine optimisation. In progress.",
      overview:
        "A case study on search engine optimisation: what drives discoverability, what to measure, and what actually moves the needle. The full write-up will be added here.",
      plan: ["Define the question and audience", "Audit and benchmark the current state", "Test changes and measure results", "Write up findings and recommendations"],
    },
    { id: "empty-research", category: "research", empty: true, title: "More coming soon" },
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
