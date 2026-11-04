/**
 * All copy, links and imagery for the site live here.
 *
 * Facts below are drawn from publicly available sources (Instagram bio, Wikipedia,
 * Zee News, Variety coverage, IMDb). Items marked "verify" rest on a single source.
 * Images are her own photographs from the public @bashu_sanchita Instagram grid
 * (1080px web copies). Ask her for the original files before launch and drop them
 * into /public/images with the same names (2400px long edge, JPEG q80 or AVIF).
 */

export const profile = {
  name: 'Sanchita Bashu',
  nameDevanagari: 'संचिता बसु',
  firstName: 'Sanchita',
  lastName: 'Bashu',
  role: 'Actress',
  tagline: 'Actress · Creator · Founder, Archi Films',
  location: 'Mumbai',
  hometown: 'Bhagalpur, Bihar',
  born: '24 March 2004',
  height: '5′3″',
  /** Email is truncated in her public bio — add the real address here */
  email: '',
  instagram: {
    handle: '@bashu_sanchita',
    href: 'https://www.instagram.com/bashu_sanchita',
    followers: '5.1M',
  },
  youtube: { followers: '2.7M' },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/bashu_sanchita' },
    { label: 'Threads', href: 'https://www.threads.com/@bashu_sanchita' },
    { label: 'IMDb', href: 'https://www.imdb.com/name/nm3301582/' },
    { label: 'Archi Films', href: 'https://www.instagram.com/archi_films24' },
  ],
  headline: 'From a phone camera in *Bhagalpur* to the most-watched show on Hotstar.',
  intro: [
    'Sanchita Bashu is a Mumbai-based actress who plays Shanvika Chauhan in JioHotstar’s Thukra Ke Mera Pyaar — the platform’s most-watched show of 2024, now in its second season.',
    'Born in Bhagalpur, Bihar, she began filming dance and lip-sync videos at home in 2019 and built an audience of millions before stepping in front of a film camera. She made her feature debut in the Telugu film First Day First Show (2022), and in 2024 founded her own banner, Archi Films.',
    'A dancer since childhood and an athlete at school, she is drawn to characters who are allowed to make mistakes, learn and grow — and names Geet, Gangubai and Sridevi’s Sadma as the roles she measures herself against.',
  ],
  stats: [
    { value: '5.1M', label: 'Instagram followers' },
    { value: '2.7M', label: 'YouTube subscribers' },
    { value: '69', label: 'Episodes as Shanvika' },
    { value: '#1', label: 'Hotstar show of 2024' },
  ],
  quote: {
    text: 'I just love learning and enjoy the process of being an artist every day.',
    source: 'Zee News, June 2026',
  },
  heroImage: '/images/hero.jpg',
  aboutImage: '/images/about.jpg',
}

export type Film = {
  year: string
  title: string
  role: string
  director: string
  type: 'Feature' | 'Series' | 'Music video' | 'Theatre'
  platform?: string
  note?: string
  image: string
  href?: string
}

export const filmography: Film[] = [
  {
    year: '2026',
    title: 'Thukra Ke Mera Pyaar — Season 2',
    role: 'Lead — Shanvika Chauhan',
    director: 'Dir. Shraddha Pasi Jairath · Bombay Show Studios',
    type: 'Series',
    platform: 'JioHotstar',
    note: '50 episodes · Streaming from 19 June 2026',
    image: '/images/work-tkmp-s2.jpg',
    href: 'https://en.wikipedia.org/wiki/Thukra_Ke_Mera_Pyaar',
  },
  {
    year: '2024',
    title: 'Thukra Ke Mera Pyaar',
    role: 'Lead — Shanvika Chauhan',
    director: 'Dir. Shraddha Pasi Jairath · Bombay Show Studios',
    type: 'Series',
    platform: 'Disney+ Hotstar',
    note: '19 episodes · Most-watched show of 2024 on the platform',
    image: '/images/work-tkmp-s1.jpg',
    href: 'https://en.wikipedia.org/wiki/Thukra_Ke_Mera_Pyaar',
  },
  {
    year: '2024',
    title: 'Inna Sona',
    role: 'Featured artist',
    director: 'Music by Amjad Nadeem Aamir · Vocals Deedar Kaur',
    type: 'Music video',
    note: 'Single · January 2024 (verify)',
    image: '/images/work-inna-sona.jpg',
  },
  {
    year: '2022',
    title: 'First Day First Show',
    role: 'Laya',
    director: 'Telugu feature debut',
    type: 'Feature',
    note: 'Theatrical release in India and overseas',
    image: '/images/work-fdfs.jpg',
  },
]

export type Milestone = { year: string; title: string; detail: string }

export const journey: Milestone[] = [
  { year: '2019', title: 'First videos from home', detail: 'Starts filming dance and lip-sync videos in Bhagalpur while still at school. The clips travel.' },
  { year: '2019', title: 'YouTube channel', detail: 'Launches her channel on 21 June — vlogs and dance — on the way to 2.7M subscribers.' },
  { year: '2022', title: 'Feature debut', detail: 'Plays Laya in the Telugu film First Day First Show, released in theatres in India and overseas.' },
  { year: '2022', title: 'Silver Play Button', detail: 'YouTube recognises the channel at 100K subscribers in May.' },
  { year: '2024', title: 'Inna Sona', detail: 'Featured in the single composed by Amjad Nadeem Aamir, sung by Deedar Kaur.' },
  { year: '2024', title: 'Shanvika Chauhan', detail: 'Chosen from around 140 auditions. Thukra Ke Mera Pyaar premieres on Disney+ Hotstar on 22 November and becomes the platform’s most-watched show of the year.' },
  { year: '2024', title: 'Archi Films', detail: 'Founds her own production banner, Archi Films.' },
  { year: '2026', title: 'Season 2', detail: 'Returns as a widowed Shanvika in a 50-episode second season about power, politics and revenge, streaming on JioHotstar from 19 June.' },
]

export type GalleryImage = { src: string; alt: string; ratio: number }

export const gallery: GalleryImage[] = [
  { src: '/images/gallery-01.jpg', alt: 'Nothing extra. Just enough.', ratio: 1050 / 1400 },
  { src: '/images/gallery-11.jpg', alt: 'मौका मिले तो डूब जाना चाहिए, आँखें हों या समंदर', ratio: 1050 / 1400 },
  { src: '/images/gallery-03.jpg', alt: 'नज़ाकत भी, शरारत भी', ratio: 1058 / 1400 },
  { src: '/images/gallery-04.jpg', alt: 'हम तो दीवाने हुए यार', ratio: 1200 / 1600 },
  { src: '/images/gallery-10.jpg', alt: 'थोड़ी नज़ाकत, थोड़ी शरारत', ratio: 1050 / 1400 },
  { src: '/images/gallery-06.jpg', alt: 'Golden hour by the lake', ratio: 1050 / 1400 },
  { src: '/images/gallery-07.jpg', alt: 'मैंने अक्सर तुझे पुकारा है', ratio: 1200 / 1600 },
  { src: '/images/gallery-02.jpg', alt: 'Sea wall, Mumbai', ratio: 1050 / 1400 },
  { src: '/images/gallery-05.jpg', alt: 'Off duty', ratio: 1050 / 1400 },
  { src: '/images/gallery-12.jpg', alt: 'On set — monitors, lights, retakes', ratio: 1120 / 1400 },
  { src: '/images/gallery-08.jpg', alt: 'तुम्हारे ये इशारे', ratio: 720 / 1280 },
  { src: '/images/gallery-09.jpg', alt: 'आज रुसवा तेरी गलियों में', ratio: 720 / 1280 },
]

/** Photographs for the drifting film strip (two rows). */
export const strip: GalleryImage[] = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/strip-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `${profile.name} — photograph ${i + 1}`,
  ratio: 3 / 4,
}))

export const spotlight = {
  short: 'TKMP',
  title: 'Thukra Ke Mera Pyaar',
  headline: 'Shanvika *Chauhan*',
  platform: 'JioHotstar',
  poster: '/images/work-tkmp-s2.jpg',
  watch: 'https://www.instagram.com/jiohotstar/reel/DZCIasksw9_/',
  paragraphs: [
    'Kuldeep, a bright young man from a poor home, falls for Shanvika, the daughter of the powerful Chauhan family. Caste and class turn the romance violent, and what begins as a love story becomes a saga of revenge, family rivalry and politics.',
    'Season 2 picks up with a widowed Shanvika stepping into a power struggle of her own, while a guilt-ridden Kuldeep is pulled back into her orbit by political enemies. Fifty episodes, streaming from 19 June 2026.',
    'Sanchita was chosen for Shanvika from around 140 auditions. The first season became the most-watched show of 2024 on the platform within its first sixteen days.',
  ],
  facts: [
    { label: 'Role', value: 'Shanvika Chauhan (lead)' },
    { label: 'Director', value: 'Shraddha Pasi Jairath' },
    { label: 'Production', value: 'Bombay Show Studios' },
    { label: 'Co-star', value: 'Dhaval Thakur as Kuldeep Kumar' },
    { label: 'Cast', value: 'Aniruddh Dave, Palak Jain, Sushil Pandey, Govind Pandey' },
    { label: 'Season 1', value: '19 episodes · 22 Nov – 13 Dec 2024 · Disney+ Hotstar' },
    { label: 'Season 2', value: '50 episodes · 19 Jun – 4 Sep 2026 · JioHotstar' },
    { label: 'Record', value: 'Most-watched show of 2024 on the platform (Variety)' },
  ],
}

export type Fact = { label: string; value: string; devanagari?: boolean }

export const facts: Fact[] = [
  { label: 'Born', value: '24 March 2004 · Bhagalpur, Bihar' },
  { label: 'Raised', value: 'Salkhua, Saharsa · now Mumbai' },
  { label: 'School', value: 'Mount Carmel School, Bhagalpur' },
  { label: 'Height', value: '5′3″' },
  { label: 'Training', value: 'Dancer since childhood · school athlete' },
  { label: 'First camera', value: 'A phone, Class 9, 2019' },
  { label: 'Faith', value: 'राधे कृष्णा', devanagari: true },
  { label: 'Dream roles', value: 'Geet (Jab We Met) · Gangubai · Sadma' },
  { label: 'Idols', value: 'Salman Khan · Madhuri Dixit' },
  { label: 'Reading', value: 'Gunahon Ka Devta' },
  { label: 'Comfort food', value: 'Pani puri · burgers' },
  { label: 'Banner', value: 'Founder, Archi Films' },
]

export const showreel = {
  /** Replace with her showreel: a direct MP4/WebM URL, or a file in /public/video */
  src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  poster: '/images/showreel-poster.jpg',
  duration: '—',
  caption: 'Showreel',
}

export type PressItem = { outlet: string; quote: string; year: string; href?: string }

/** Headlines and descriptions from published coverage (not invented review quotes). */
export const press: PressItem[] = [
  {
    outlet: 'Variety',
    quote: 'Disney+ Hotstar India’s ‘Thukra Ke Mera Pyaar’ breaks platform records.',
    year: 'Dec 2024',
    href: 'https://variety.com/2024/tv/news/disney-hotstar-india-thukra-ke-mera-pyaar-records-1236250694/',
  },
  {
    outlet: 'Zee News',
    quote: 'Sanchita Basu opens up about returning as Shanvika, OTT success and lessons from her journey.',
    year: 'Jun 2026',
    href: 'https://zeenews.india.com/people/exclusive-sanchita-basu-opens-up-about-returning-as-shanvika-ott-success-and-lessons-from-her-journey-3055986.html',
  },
  {
    outlet: 'Tellychakkar',
    quote: 'Thukra Ke Mera Pyaar becomes the most subscribed and watched show on Disney+ Hotstar.',
    year: 'Dec 2024',
    href: 'https://tellychakkar.com/node/4324351',
  },
  {
    outlet: 'Jagran Film Festival',
    quote: 'From reels to the big screen — Sanchita shares her journey on stage.',
    year: '2025',
    href: 'https://www.youtube.com/watch?v=RTkLGqqrlSk',
  },
]

export const awards = [
  { year: '2024', title: 'Most-watched show of the year — Disney+ Hotstar', for: 'Thukra Ke Mera Pyaar' },
  { year: '2024', title: 'YouTube Creator Award — 1M+ subscribers', for: 'Channel at 2.7M' },
  { year: '2022', title: 'YouTube Silver Play Button', for: '100K subscribers' },
  { year: '2022', title: 'Verified Instagram — 5.1M followers', for: '@bashu_sanchita' },
]

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Spotlight', href: '#spotlight' },
  { label: 'Work', href: '#work' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Showreel', href: '#showreel' },
  { label: 'Press', href: '#press' },
  { label: 'Contact', href: '#contact' },
]
