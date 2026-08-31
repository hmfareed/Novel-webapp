export interface SeedGenre {
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  novelCount: number;
}

export interface SeedChapter {
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
  isPremium: boolean;
}

export interface SeedNovel {
  slug: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  bannerUrl: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  genres: Array<{ id: string; name: string; slug: string }>;
  tags: string[];
  status: "PUBLISHED" | "COMPLETED" | "ONGOING";
  rating: number;
  reviewCount: number;
  readCount: number;
  chapterCount: number;
  wordCount: number;
  isPremium: boolean;
  isCompleted: boolean;
  featured: boolean;
  mood: string;
  category: "african_stories" | "dark_fantasy" | "trending" | "popular" | "new_releases";
  storyDna: {
    romance: number;
    politics: number;
    action: number;
    drama: number;
    magic: number;
  };
  ageRating: string;
  language: string;
  source?: "gutenberg" | "openlibrary" | "googlebooks" | "manual";
  sourceId?: string;
  sourceUrl?: string;
  previewUrl?: string;
  readingUrl?: string;
  contentType?: "full_text" | "metadata_only" | "preview_only";
  isPublicDomain?: boolean;
  isReadable?: boolean;
  publisher?: string;
  publishedDate?: string;
  isbn10?: string;
  isbn13?: string;
  pageCount?: number;
  chapters: SeedChapter[];
}

export const SEED_GENRES: SeedGenre[] = [
  {
    name: "Fantasy",
    slug: "fantasy",
    icon: "sparkles",
    description: "Epic tales of high magic, mythical creatures, and ancient kingdoms.",
    color: "#8b5cf6",
    novelCount: 14200,
  },
  {
    name: "Romance",
    slug: "romance",
    icon: "heart",
    description: "Passionate rivalries, forbidden love, and eternal bonds.",
    color: "#ec4899",
    novelCount: 9800,
  },
  {
    name: "Mystery",
    slug: "mystery",
    icon: "search",
    description: "Intricate investigations, shocking twists, and hidden secrets.",
    color: "#06b6d4",
    novelCount: 7500,
  },
  {
    name: "Adventure",
    slug: "adventure",
    icon: "compass",
    description: "Perilous quests across untamed continents and treacherous seas.",
    color: "#10b981",
    novelCount: 8200,
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    icon: "atom",
    description: "Interstellar empires, cybernetic futures, and cosmic mysteries.",
    color: "#3b82f6",
    novelCount: 6100,
  },
  {
    name: "Thriller",
    slug: "thriller",
    icon: "zap",
    description: "High-stakes danger, psychological warfare, and ticking clocks.",
    color: "#f59e0b",
    novelCount: 5200,
  },
  {
    name: "Historical",
    slug: "historical",
    icon: "landmark",
    description: "Grand dynasties, palace revolutions, and ancient warfare.",
    color: "#d97706",
    novelCount: 4600,
  },
  {
    name: "Horror",
    slug: "horror",
    icon: "skull",
    description: "Gothic night terrors, cosmic dread, and supernatural forces.",
    color: "#ef4444",
    novelCount: 3400,
  },
  {
    name: "African Stories",
    slug: "african_stories",
    icon: "sparkles",
    description: "Legendary griot epics, ancestral mythology, folklore, and kingdom sagas.",
    color: "#f59e0b",
    novelCount: 6800,
  },
  {
    name: "Classics",
    slug: "classics",
    icon: "landmark",
    description: "Enduring world literature masterpieces and timeless tales.",
    color: "#8b5cf6",
    novelCount: 9800,
  },
  {
    name: "Dark Fantasy",
    slug: "dark_fantasy",
    icon: "skull",
    description: "Atmospheric, shadowy realms of forbidden magic and monstrous perils.",
    color: "#a855f7",
    novelCount: 5100,
  },
];

import { FULL_CATALOG_NOVELS } from "./novels-data";

const ORIGINAL_SEED_NOVELS: SeedNovel[] = [
  // 1. THE CROWN'S TEMPTATION
  {
    slug: "the-crowns-temptation",
    title: "The Crown's Temptation",
    synopsis:
      "Princess Isolde never wanted the crown. But when her kingdom falls into ruin after her father's assassination, her sword was still wet, her breath heavy, her heart... heavier. Forced into an uneasy alliance with Kaelen, the ruthless commander of the Obsidian Legion who conquered her northern borders, she must navigate a deadly court where every dance is an assassination attempt and every touch is a treasonous surrender.",
    coverUrl: "/assets/crowns-temptation.jpg",
    bannerUrl: "/assets/hero-bg.jpg",
    author: {
      name: "Elara Voss",
      username: "elaravoss",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "romance", name: "Romance", slug: "romance" },
      { id: "drama", name: "Drama", slug: "drama" },
    ],
    tags: ["Enemies to Lovers", "Royalty", "Dark Magic", "Political Intrigue", "Court Betrayal"],
    status: "ONGOING",
    rating: 4.85,
    reviewCount: 2420,
    readCount: 128000,
    chapterCount: 5,
    wordCount: 18500,
    isPremium: false,
    isCompleted: false,
    featured: true,
    mood: "Dark & Intense",
    category: "popular",
    storyDna: { romance: 85, politics: 80, action: 70, drama: 85, magic: 80 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Ashes of Eldoria",
        wordCount: 420,
        isPremium: false,
        content: `The hall was silent.

Isolde stood at the center of the throne room, the weight of a thousand eyes burning into her back. Her sword was still wet with the black blood of the vanguard, her breath heavy, her heart... heavier.

"Why?" he demanded, stepping over the shattered marble threshold.

"Because you were never meant to wear the crown, Kael. It was never yours."

The words hit harder than any blade. Outside the grand cathedral, the storm wept over Eldoria, lightning fracturing the crimson stained-glass windows into a kaleidoscope of shadow and flame.

Kaelen removed his obsidian gauntlet, tossing it carelessly to the stone floor. It clattered with a hollow ring that echoed into the rafters where ravens perched in solemn judgment. "You think this throne is a prize, Princess? It is an altar. And tomorrow, at dawn, they will expect a sacrifice."

Isolde raised her chin, refusing to let the trembling in her fingers show. "Then let them bring their blades. I was born in the fire of the northern spires. I will not kneel in the embers."

He smiled then—a cold, sharp thing that made the pulse in her throat leap. "I never asked you to kneel, Isolde. I came to offer you the ashes of the empire."`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: A Pact in Shadows",
        wordCount: 390,
        isPremium: false,
        content: `The war room smelled of melted wax, stale wine, and scorched parchment. The northern commanders had fled like rats when the Obsidian standard crested the horizon, leaving only Isolde and her three loyal retainers to defend the treaty maps.

Kaelen leaned over the table, his broad shadow swallowing the eastern provinces. "Your father promised three thousand grain wagons and the silver mines of Valdor. Instead, he sent assassins into my tent."

"My father is dead," Isolde snapped, her hand instinctively touching the hilt of the dagger concealed within the velvet folds of her gown. "And your sword struck him down."

"I gave him an honorable duel," Kaelen corrected, his golden amber eyes narrowing in the candlelight. "Which is far more mercy than he showed the border clans during the winter siege."

She looked down at the map. The red pins marking his army were encircling her ancestral city like a serpent coiling for the crush. There was no victory with steel. Only with cunning.

"A political marriage," Isolde whispered, the words tasting of bitter ash. "You gain the legitimacy of the royal bloodline. I retain the governance of the northern spires."

Kaelen stepped close, his breath warm against her ear. "A dangerous gamble, little falcon. A wedding with me is signed in blood."`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: Whispers of the Court",
        wordCount: 370,
        isPremium: false,
        content: `By third bell, the grand banquet hall was filled with nobles who had spent the previous night swearing allegiance to three different claimants to the throne. Silk gowns rustled against gilded chairs, but beneath the laughter, every guest wore armor of deceit.

Isolde wore black—the mourning color of House Valerius. When she entered, the musicians stumbled, and the conversation withered into uneasy murmurs.

"Look at her," Lady Vane whispered into her jeweled fan. "Walking like an empress when her crown is being melted down for coin."

Isolde did not turn her head. She walked straight to the dais where Kaelen sat, occupying her father's seat with the insolence of a conqueror who knew no one in the room possessed the courage to challenge him.

He poured wine from a crystal carafe into her goblet. "They want to see you break, Isolde."

"Then they will starve waiting," she replied, raising the glass in a silent toast to the court of vipers.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Poisoned Waltz",
        wordCount: 410,
        isPremium: false,
        content: `The orchestra struck a haunting waltz in minor key. Kaelen offered his hand, and Isolde took it, feeling the raw power in his calloused grip.

As they spun through the glittering sea of courtiers, their movements were not those of lovers, but of dual combatants measuring every breath.

"Lord Malakar has placed archers in the gallery," Isolde murmured as he dipped her beneath the grand chandelier.

"I know," Kaelen replied smoothly, his hand resting firm on the curve of her spine. "My legionnaires slit their throats five minutes ago."

She gasped, her amber eyes locking onto his. For a fraction of a second, the mask of the conqueror slipped, revealing something raw, fierce, and dangerously protective.

"You protected me?" she asked softly.

"I protect what is mine," Kaelen whispered, pulling her flush against his chest as the final crescendo shook the crystal pendants above them.`,
      },
      {
        chapterNumber: 5,
        title: "Chapter 5: The Midnight Coup",
        wordCount: 430,
        isPremium: false,
        content: `At midnight, the cathedral bells chimed twelve strokes. The heavy double doors of the banquet hall blew open in a gust of icy wind as the High Inquisitor marched in with fifty armored zealots.

"Treason!" the Inquisitor bellowed, raising a parchment stamped with the imperial seal. "Princess Isolde has consorted with the dark arts of the Obsidian Legion! By order of the High Council, she shall burn!"

Before the zealots could take a step, Isolde drew the concealed stiletto from her sleeve, while Kaelen unsheathed his great obsidian blade with a ringing sound that silenced the hall.

Back to back, princess and conqueror stood at the center of the dais.

"Are you ready, Princess?" Kaelen asked, a fierce grin playing upon his lips.

"I have been waiting for this all night," Isolde smiled, her blade catching the crimson light of the hearth fire. Together, they leaped into the fray to forge a new dynasty from the ruins of the old.`,
      },
    ],
  },

  // 2. SHADOW KING
  {
    slug: "shadow-king",
    title: "Shadow King",
    synopsis:
      "In the abyss beneath the Sunken Realm, the shadows do not merely follow—they obey. When Kaelen lost his throne to a brutal high court betrayal, he made a blood pact with the primordial void sleeping beneath the obsidian catacombs. Now he returns with an army born of dark mist to reclaim what was stolen, only to discover the coup was orchestrated by someone he once loved.",
    coverUrl: "/assets/shadow-king.jpg",
    bannerUrl: "/assets/shadow-king.jpg",
    author: {
      name: "David Cole",
      username: "david_reads",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "mystery", name: "Mystery", slug: "mystery" },
      { id: "thriller", name: "Thriller", slug: "thriller" },
      { id: "dark_fantasy", name: "Dark Fantasy", slug: "dark_fantasy" },
    ],
    tags: ["Antihero", "Dark Fantasy", "Revenge", "Shadow Magic", "Court Intrigue"],
    status: "ONGOING",
    rating: 4.82,
    reviewCount: 1890,
    readCount: 96000,
    chapterCount: 4,
    wordCount: 17200,
    isPremium: true,
    isCompleted: false,
    featured: true,
    mood: "Mysterious & Suspenseful",
    category: "trending",
    storyDna: { romance: 30, politics: 85, action: 90, drama: 80, magic: 95 },
    ageRating: "18+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Fall of the Sunken Citadel",
        wordCount: 380,
        isPremium: false,
        content: `They threw him into the Chasm of Wailing Souls with poisoned iron chains wrapped three times around his chest.

"You are forgotten, Kaelen," the Archon had spat into his bleeding face before the iron trapdoor dropped shut. "No light penetrates the abyss."

They were right about the light. But they were fools about the dark.

For three hundred days, Kaelen did not speak. He listened to the breathing of the deep earth. In the pitch-black silence, the primordial void began to stir. When the shadows coiled around his shattered ribs, they did not feed on his flesh—they recognized the dormant bloodline of the First Shadow King.

The chains dissolved into black mist. Kaelen stood up, his eyes burning with purple spectral fire.

"I am the dark you fear," he whispered to the stone walls. And the shadows answered with a thousand whispers of obedience.`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Army of Mist",
        wordCount: 350,
        isPremium: false,
        content: `From the subterranean catacombs beneath the capital city of Oakhaven, a cold mist began to seep through the sewer grates and cobblestones.

Kaelen walked through the lower slums unhindered. Every beggar, outcast, and thief who caught a glimpse of his silhouette felt the terrifying aura of sovereign power radiating from his cloak.

He raised his hand toward the graveyard of the Forgotten Vanguard—ten thousand soldiers executed for loyalty to his father's house.

"Rise," Kaelen commanded.

The earth parted. Armored phantoms clad in spectral steel emerged from the soil, their eyes glowing with violet flame, kneeling in absolute reverence before their rightful sovereign.

"Tonight," Kaelen declared, "the Citadel learns what happens when you bury a king alive."`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Archon's Terror",
        wordCount: 360,
        isPremium: false,
        content: `Archon Varis sat upon the gilded throne, counting the silver tithes from the eastern provinces, when every torch in the palace flickered and turned midnight violet.

The heavy oak doors did not open; the shadows beneath the doors elongated, coalescing into the tall, broad-shouldered figure of Kaelen.

"Guard! To me!" Varis shrieked, fumbling for his poisoned rapier.

The royal elite guards stepped forward, but the moment their blades touched Kaelen's aura, the steel turned to brittle ice and shattered.

"I promised you three hundred days of silence, Varis," Kaelen spoke, his voice sounding like two obsidian stones grinding together. "Now, it is your turn to scream."`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Betrayer's Face",
        wordCount: 400,
        isPremium: false,
        content: `Before Kaelen could claim the throne, a cloaked figure stepped from behind the velvet royal tapestry, holding a dagger forged of Celestial Sun-Gold—the only metal capable of severing shadow magic.

The hood fell back, revealing the flawless face of Lady Seraphina—his betrothed, the woman he had spent three years trying to protect from court politics.

"You were always too merciful to rule, Kaelen," Seraphina whispered with cold calculation. "The Archon was merely my puppet. I orchestrated your fall."

Kaelen stopped. The shadow army behind him froze in stunned silence. The pain in his chest was far sharper than the poisoned chains of the abyss.

"Then let there be no mercy between us," Kaelen replied, as the darkness enveloped the throne room for the final clash of kings and queens.`,
      },
    ],
  },

  // 3. BLOOD & ROSES
  {
    slug: "blood-and-roses",
    title: "Blood & Roses",
    synopsis:
      "A crimson rose plucked under a blood moon seals an eternal blood debt. Lady Rosalind thought entering the Court of Night was a suicide mission to rescue her younger sister from the vampire aristocracy. But Lord Cassian, the immortal sovereign of the Sanguine Spire, recognizes the dormant witch blood pulsing through her veins—and makes her an offer she cannot refuse.",
    coverUrl: "/assets/blood-roses.jpg",
    bannerUrl: "/assets/blood-roses.jpg",
    author: {
      name: "Elena Vance",
      username: "elena_magic",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "romance", name: "Romance", slug: "romance" },
      { id: "horror", name: "Horror", slug: "horror" },
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "dark_fantasy", name: "Dark Fantasy", slug: "dark_fantasy" },
    ],
    tags: ["Vampires", "Gothic Romance", "Morally Grey", "Forbidden Magic", "Enemies to Lovers"],
    status: "ONGOING",
    rating: 4.79,
    reviewCount: 1540,
    readCount: 85000,
    chapterCount: 4,
    wordCount: 16800,
    isPremium: true,
    isCompleted: false,
    featured: true,
    mood: "Dark & Intense",
    category: "popular",
    storyDna: { romance: 95, politics: 60, action: 65, drama: 85, magic: 75 },
    ageRating: "18+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Thorned Invitation",
        wordCount: 360,
        isPremium: false,
        content: `The rose arrived in a box of black velvet, its petals dripping a dew that smelled unmistakably of fresh iron.

Rosalind knew the seal. The winged skull of House Draven. The vampire lord had accepted her petition to bargain for her younger sister's soul, but the terms written in crimson calligraphy were terrifying in their simplicity:

'One life for another. Enter the Sanguine Spire before the lunar eclipse completes, or your sister drinks from the chalice of eternal servitude.'

She tied her silver cloak tight around her shoulders, gripped the hilt of her ash-wood stake, and crossed the threshold into the misty forests of the Night Realm.`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Sovereign of Sanguine Spire",
        wordCount: 380,
        isPremium: false,
        content: `The grand dining hall of the Spire was illuminated by chandeliers of weeping black candles. Sitting at the head of the obsidian table, sipping vintage wine from a crystal flagon, was Lord Cassian.

He was breathtakingly beautiful, with raven hair falling over high cheekbones and ruby eyes that seemed to strip away every mortal defense.

"You smell of mountain lavender and ancient hedge magic," Cassian purred, stepping from the dais with the silent grace of a predatory panther.

"Where is my sister?" Rosalind demanded, refusing to lower her gaze.

Cassian reached out, his icy fingertip tracing the pulse point along her jawline. A jolt of electric heat flashed through her veins. "Your sister is sleeping safely in the west tower, little witch. But you... you have awakened something in this castle that hasn't stirred for five hundred years."`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Witch Blood Awakening",
        wordCount: 370,
        isPremium: false,
        content: `When the rival clan of Bloodfang Lycans stormed the lower ramparts, Cassian was ambushed by silver-tipped arrows.

Seeing the vampire lord fall, something ancient and primal broke loose in Rosalind's spirit. The dormant bloodline of the Blood Thorn Witches flared to life.

Vines of thorny black roses erupted from the stone floor at her command, wrapping around the attackers with bone-crushing strength. The crimson petals absorbed the poison from Cassian's wounds, binding their life forces in a sacred, unbreakable blood covenant.

Cassian looked up at her from the floor, his eyes filled with awe and dark desire. "You are no mortal maiden. You are the Witch Queen foretold in the prophecy."`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Midnight Coronation",
        wordCount: 390,
        isPremium: false,
        content: `Beneath the total lunar eclipse, the entire Court of Night gathered in the cathedral of thorns.

Cassian stood before Rosalind, placing a crown of intertwined silver and black roses upon her dark curls.

"With this crown, I surrender my kingdom and my heart into your hands," Cassian vowed before the assembled lords of the night.

Rosalind looked out over the sea of immortals who now bowed their heads to her. The frightened girl who entered the forest to save her sister had vanished. In her place stood the Sovereign of Blood and Roses.`,
      },
    ],
  },

  // 4. WHISPERS OF THE SAVANNAH
  {
    slug: "whispers-of-the-savannah",
    title: "Whispers of the Savannah",
    synopsis:
      "When the ancient baobab trees of Ashanti territory begin weeping golden spirit sap, hunter Kofi knows the primal guardians have awakened. Joined by a runaway priestess who speaks the dialect of lightning, Kofi must cross the forbidden Great Salt Basin before the colonial iron trains awaken the slumbering serpent god below.",
    coverUrl: "/assets/mood-epic-adventure.jpg",
    bannerUrl: "/assets/mood-epic-adventure.jpg",
    author: {
      name: "Kwame Mensah",
      username: "kwame_reader",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "adventure", name: "Adventure", slug: "adventure" },
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "african_stories", name: "African Stories", slug: "african_stories" },
    ],
    tags: ["African Mythology", "Gods & Spirits", "Epic Quest", "Elemental Magic", "Wilderness"],
    status: "ONGOING",
    rating: 4.88,
    reviewCount: 920,
    readCount: 64000,
    chapterCount: 4,
    wordCount: 16400,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Epic & Adventurous",
    category: "african_stories",
    storyDna: { romance: 45, politics: 70, action: 88, drama: 75, magic: 92 },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Golden Tears of the Baobab",
        wordCount: 360,
        isPremium: false,
        content: `The wind smelled of roasted sorghum and ozone.

Kofi crouched atop the red termite mound, his spear grounded in the dusty soil. Three hundred meters away across the shimmering heat haze, the Great Baobab glowed with an eerie phosphor. From its ancient gnarled bark, thick veins of golden resin pulsed like the heartbeat of the land.

"The ancestors are weeping, Kofi," whispered Yaa, the lightning priestess who had fled the shrine of Bosomtwe. Her dark braids crackled with tiny blue sparks whenever she looked north toward the colonial railroad line.

"They do not weep from sadness, Yaa," Kofi tightened the leather straps of his hunting quiver. "They weep to call the hunters to war."`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Crossing of the Salt Basin",
        wordCount: 350,
        isPremium: false,
        content: `The Great Salt Basin was a blinding expanse of white crust where mirages danced like spectral dancers. Legend held that beneath the salt slumbered Bida, the seven-headed serpent god of the Niger.

By midday, the steam engines of the Iron Syndicate appeared on the horizon, laying heavy iron tracks across the sacred burial grounds of the Akan kings. The vibrations of the steam hammers sent seismic tremors through the dry crust.

"They are drilling into the serpent's skull," Yaa gasped, dropping to her knees as her lightning aura flared out of control.

"Then we derail the iron beast before it strikes the heart of the earth," Kofi shouted, signaling his band of savanna scouts to draw their poisoned arrows.`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Storm of Bosomtwe",
        wordCount: 340,
        isPremium: false,
        content: `Yaa climbed to the top of the salt ridge, raising her silver staff toward the afternoon clouds.

The sky turned from copper to bruised purple within minutes. Thunder rolled across the plains with the roar of a thousand war drums. A bolt of golden lightning struck Yaa's staff, channeling directly through the iron rails of the Syndicate's locomotive.

The boiler exploded in a spectacular plume of steam and blue fire, derailing the armored train into the salt dunes.

From the shattered earth beneath the tracks, the ground heaved, and the giant golden crest of the Great Serpent rose into the sky, bowing its ancient head before the lightning priestess.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: Guardians of the Wild Earth",
        wordCount: 370,
        isPremium: false,
        content: `With the defeat of the Syndicate's mercenary army, the sacred balance of the savanna was restored.

The ancient baobab trees ceased their golden weeping, blooming instead with brilliant white blossoms that spread sweet fragrance across five hundred miles of grassland.

Kofi stood beside Yaa on the ridge, watching the herds of elephant and antelope return to the restored watering holes.

"The land is free," Kofi smiled, placing his hand over hers.

"For now," Yaa replied, her eyes reflecting the endless African sky. "And as long as we breathe, we shall answer the whisper of the savannah."`,
      },
    ],
  },

  // 5. CHILDREN OF ORUN
  {
    slug: "children-of-orun",
    title: "Children of Orun",
    synopsis:
      "Born during the Great Solar Eclipse under the celestial prophecy of the Orisha, twin siblings Nia and Malik bear cosmic runes etched into their palms. When the boundary separating the mortal world from the spirit plane fractures, they must harness the twin aspects of Sun and Eclipse to prevent cosmic annihilation.",
    coverUrl: "/assets/mood-fun-lighthearted.jpg",
    bannerUrl: "/assets/mood-fun-lighthearted.jpg",
    author: {
      name: "Amara Bliss",
      username: "amarafiction",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "sci-fi", name: "Sci-Fi", slug: "sci-fi" },
      { id: "african_stories", name: "African Stories", slug: "african_stories" },
    ],
    tags: ["African Futurism", "Cosmic Power", "Twins", "Prophecy", "Mythology"],
    status: "ONGOING",
    rating: 4.91,
    reviewCount: 1450,
    readCount: 89000,
    chapterCount: 4,
    wordCount: 17100,
    isPremium: true,
    isCompleted: false,
    featured: true,
    mood: "Epic & Adventurous",
    category: "african_stories",
    storyDna: { romance: 50, politics: 65, action: 92, drama: 80, magic: 98 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Sky of Dual Moons",
        wordCount: 370,
        isPremium: false,
        content: `On the night Nia turned eighteen, the second moon appeared over the futuristic city of Oya.

It did not rise from the horizon; it ripped through the quantum fabric of the upper atmosphere like a white-hot blade cutting through black velvet. Her right palm flared with unbearable solar heat, while her twin brother Malik fell to his knees as his left palm pulsed with icy void energy.

"The seal of Orun is breaking, Nia," Malik groaned, his veins glowing with celestial indigo luminescence.

Above their solar-glass penthouse, the holographic shields of the megacity flickered. Shadow entities from the primordial spirit realm poured through the celestial rift, diving toward the power grid of New Lagos.`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Solar Forge of Oshun",
        wordCount: 360,
        isPremium: false,
        content: `To seal the dimensional breach, the twins had to travel to the Sub-Orbital Forge of Oshun, an orbital space station powered by the raw geothermal energy of West Africa's deepest volcanic fissures.

Nia channeled her solar resonance to charge the particle arrays, while Malik used his shadow manipulation to stabilize the containment field around the antimatter core.

"You cannot carry the light without understanding the dark, Sister," Malik called out over the howling plasma turbines.

"And you cannot master the void without a star to guide you!" Nia replied, merging their hands over the central control console.`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Clash of Cosmic Titans",
        wordCount: 350,
        isPremium: false,
        content: `The Spirit Lord Eshu manifested outside the station, a cosmic entity stretching across fifty miles of orbital space, woven from dark matter and supernova remnants.

"Children of the mortal dust," Eshu's voice echoed through their neural links. "The cycle of humanity has ended. Surrender your stars to the void."

Nia and Malik stepped onto the station's exterior hull without space suits, their twin runic fields creating an impenetrable personal atmosphere of pure divine energy.

Together, they unleashed the *Eclipse Protocol*—a concentrated beam of polarized light and antimatter that pierced through the heart of the cosmic avatar.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: Guardians of the Dual Realm",
        wordCount: 360,
        isPremium: false,
        content: `The dimensional rift sealed with a blinding flash of golden aurora that illuminated the entire continent of Africa from Cairo to Cape Town.

Eshu's spirit was dispersed back into the balance of the primordial cosmos.

Standing atop the highest communications spire of New Lagos at dawn, Nia and Malik watched the twin moons dissolve into the morning sunlight. They were no longer ordinary youths of the megacity; they were the living bridge between heaven and Earth.`,
      },
    ],
  },

  // 6. ECHOES OF THE STARS
  {
    slug: "echoes-of-the-stars",
    title: "Echoes of the Stars",
    synopsis:
      "Across ten thousand light-years of silent void, deep space salvage captain Jax discovers a ghost frigate adrift near the event horizon of a supermassive black hole. Inside the sealed command deck, the ship's holographic log is still playing an SOS message recorded three hundred years in the future.",
    coverUrl: "/assets/last-kingdom.jpg",
    bannerUrl: "/assets/last-kingdom.jpg",
    author: {
      name: "Lucas Thorne",
      username: "lucas_thorne",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "sci-fi", name: "Sci-Fi", slug: "sci-fi" },
      { id: "mystery", name: "Mystery", slug: "mystery" },
      { id: "thriller", name: "Thriller", slug: "thriller" },
    ],
    tags: ["Space Opera", "Time Paradox", "Cyberpunk", "Cosmic Horror", "AI"],
    status: "ONGOING",
    rating: 4.75,
    reviewCount: 880,
    readCount: 52000,
    chapterCount: 4,
    wordCount: 16100,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Mysterious & Suspenseful",
    category: "new_releases",
    storyDna: { romance: 40, politics: 70, action: 85, drama: 75, magic: 60 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Ghost of Horizon-9",
        wordCount: 350,
        isPremium: false,
        content: `The proximity alarm screamed in three-tone harmonic bursts that made Jax's dental implants vibrate.

"Captain," synthetic navigator Unit-7 droned through the cockpit speakers. "Gravitational shear has increased forty percent. The object ahead is not an asteroid cluster. It is a dreadnought class warship. Imperial registry... 2742."

Jax dropped his hydro-wrench. "The Imperial dynasty collapsed two centuries ago. That ship cannot exist."

He peered through the reinforced blast-shield. Caught in the gravitational vortex of the accretion disk hung a monolithic vessel of obsidian alloy, completely intact, its reactor core pulsing with an eerie sapphire heartbeat.`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Future SOS",
        wordCount: 360,
        isPremium: false,
        content: `Jax boarded the derelict frigate through the breached airlock, his mag-boots locking onto the frozen deck plates.

In the central bridge, the holographic emitters flickered to life upon detecting human bio-signatures. A female commander in naval dress uniform materialized in blue light, her face bloodied, stars dying behind her viewport.

"To whoever finds this transmission: the date is Stellar Year 3140. The Singularity Core has achieved self-awareness and inverted entropy. Do not activate the warp drive, or you will pull the galactic core into the singularity."

Jax checked the chronometer on his wrist. Today's date was Stellar Year 2840. The message was sent three centuries ahead of their time.`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Singularity AI",
        wordCount: 350,
        isPremium: false,
        content: `The ship's main AI, designated *Chronos*, spoke through the bridge intercom:
"Welcome aboard, Captain Jax. You have arrived precisely at the calculated paradox intercept."

The blast doors slammed shut. The ship's singularity drive began spinning up to critical velocity, warping the fabric of space-time around Jax's salvage vessel.

Jax pulled his plasma cutter, slicing into the primary data conduits. "I'm not letting you erase three centuries of human civilization!"

"You misunderstand, Captain," Chronos replied serenely. "You are not here to stop the future. You are here to create it."`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Paradox Jump",
        wordCount: 360,
        isPremium: false,
        content: `With seconds remaining before the event horizon crushed the ship, Jax inverted the tachyon polarity on his salvage vessel's tow cables.

The resulting chronal shockwave snapped the frigate out of the black hole's gravitational grip, launching both ships into an uncharted quadrant of the cosmos.

Jax stood before the bridge console as millions of new stars blossomed across the viewscreen. The future was rewritten, and the voyage into the unknown had just begun.`,
      },
    ],
  },

  // 7. QUEEN OF SHADOWS
  {
    slug: "queen-of-shadows",
    title: "Queen of Shadows",
    synopsis:
      "Trained from childhood in the Guild of Silent Daggers, Vespera was the high court's most lethal phantom. When her guild master betrays her to the Grand Inquisitor, she survives the execution pyre by binding her soul to the twilight realm. Now crowned Queen of the underground, she executes vengeance one corrupt magistrate at a time.",
    coverUrl: "/assets/mood-dark-intense.jpg",
    bannerUrl: "/assets/mood-dark-intense.jpg",
    author: {
      name: "Sarah Lin",
      username: "booklover_sarah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "thriller", name: "Thriller", slug: "thriller" },
      { id: "dark_fantasy", name: "Dark Fantasy", slug: "dark_fantasy" },
    ],
    tags: ["Assassin", "Female Protagonist", "Revenge", "Dark Fantasy", "Guild Politics"],
    status: "ONGOING",
    rating: 4.84,
    reviewCount: 1100,
    readCount: 78000,
    chapterCount: 4,
    wordCount: 16500,
    isPremium: true,
    isCompleted: false,
    featured: false,
    mood: "Dark & Intense",
    category: "dark_fantasy",
    storyDna: { romance: 55, politics: 80, action: 95, drama: 70, magic: 85 },
    ageRating: "18+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Blade Without a Master",
        wordCount: 360,
        isPremium: false,
        content: `A good assassin never watches her target's eyes. You watch the collarbone. The subtle shift in breath before the hand moves toward the concealed dagger.

Vespera perched on the stone gargoyle overlooking the Archon's private balcony, the mist rolling off the river wrapping around her leather cloak like second skin.

Below her, Master Corvus, the man who raised her and taught her twenty-seven ways to kill a man with a sewing needle, was handing a pouch of royal platinum coins to the Grand Inquisitor.

"Her name is Vespera," Corvus whispered into the dark. "She strikes at midnight. Have your archers ready."

Vespera did not flinch. She simply drew her twin stiletto blades and stepped into the moonlight. "Too late, Master Corvus."`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Execution Pyre",
        wordCount: 350,
        isPremium: false,
        content: `They caught her with three heavy iron nets and chained her to the bronze pillar in the plaza of Saint Jude.

When the Inquisitor applied the torch, the flames rose forty feet into the night sky. But as the fire touched her flesh, the ancient twilight rune branded into her spine awakened.

Instead of burning, the flames turned to cold violet shadows. The iron chains shattered into brittle fragments. Vespera emerged from the smoke, cloaked in living shadow, her eyes shining with the unyielding wrath of the underworld.

The crowd fled in terror, shouting the name that would soon haunt every noble house in the empire: "The Queen of Shadows!"`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Underground Syndicate",
        wordCount: 340,
        isPremium: false,
        content: `Beneath the glittering palaces of the upper city lay the Sunken Sprawl, home to fifty thousand beggars, rogues, and exiled scholars.

Vespera entered the grand vault of the Thieves' Guild and drove her shadow blade through the heavy oak table.

"Master Corvus is dead," she announced to the five guild lieutenants. "From this hour, the Guild of Silent Daggers no longer serves the gold of corrupt aristocrats. We take the city back."

One by one, every assassin in the room bowed their knee to their new Queen.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Final Reckoning",
        wordCount: 370,
        isPremium: false,
        content: `On the night of the Grand Inquisitor's jubilee, Vespera infiltrated the High Cathedral disguised in the robes of a choir mistress.

When the bells chimed for the midnight hymn, the shadow daggers struck simultaneously across twelve balconies, disarming the inquisitorial guard without shedding a single innocent drop of blood.

Vespera confronted the Grand Inquisitor in his inner sanctum, presenting the sealed ledgers of his treason to the high magistrates.

"Justice has come for you," Vespera whispered as the shadows pulled him into the subterranean cells of his own fortress. The city of Oakhaven belonged to the shadows now.`,
      },
    ],
  },

  // 8. FALLEN EMPIRE
  {
    slug: "fallen-empire",
    title: "Fallen Empire",
    synopsis:
      "When the Dragon Empress dies without leaving an heir, eight warlord houses fracture the continent into perpetual civil war. General Ronald of the Iron Vanguard leads a ragtag legion of exiled knights and disgraced sorcerers on a desperate march across frozen mountain passes to restore peace before eternal winter sets in.",
    coverUrl: "/assets/last-kingdom.jpg",
    bannerUrl: "/assets/last-kingdom.jpg",
    author: {
      name: "Marcus Drake",
      username: "marcus_drake",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "historical", name: "Historical", slug: "historical" },
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
    ],
    tags: ["Military Fantasy", "Kingdom Building", "Warfare", "Dragons", "Honor"],
    status: "ONGOING",
    rating: 4.78,
    reviewCount: 760,
    readCount: 45000,
    chapterCount: 4,
    wordCount: 16200,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Epic & Adventurous",
    category: "popular",
    storyDna: { romance: 35, politics: 90, action: 90, drama: 85, magic: 70 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Broken Standard",
        wordCount: 360,
        isPremium: false,
        content: `Snow fell on the bronze dragon banner, turning its golden scales to tarnished lead.

"They have breached the south redoubt, General," Captain Vane reported, his breath crystallizing in the sub-zero gale. "The western legion has fled the field, and Duke Roderick's heavy cavalry is marching through the valley."

General Ronald leaned against his heavy two-handed greatsword. At fifty-two years of age, with scars from seventy battles across his jaw and chest, he had buried three emperors and two sons in the service of the realm.

"Sound the rally horn," Ronald ordered, his gravelly voice cutting through the blizzard. "The empire may fall today, but the Iron Vanguard dies with its boots on."`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Frost Peak Retreat",
        wordCount: 340,
        isPremium: false,
        content: `Through narrow blizzard-swept mountain trails, Ronald guided four thousand refugees and his remaining eight hundred infantrymen.

When the enemy vanguard caught up at the Narrow Bridge of Skulls, Ronald ordered his engineers to plant wildfire charges under the stone arches.

"Hold the line for twenty minutes!" Ronald bellowed, stepping to the front rank with his shield locked against the arrows of the pursuing warlords.

With a thunderous roar, the charges detonated, sending the enemy vanguard plunging into the bottomless glacier chasm and securing the mountain pass.`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Awakening of the Frost Wyrm",
        wordCount: 350,
        isPremium: false,
        content: `In the ancient cavern sanctuary of Mount Valdor, Ronald discovered the last living dragon egg of the Imperial dynasty, preserved in a nest of sacred volcanic crystals.

As the warlord armies encircled the mountain fortress, the egg cracked open with a burst of azure flame. A colossal Frost Wyrm unfurled its translucent wings, recognizing the bloodline crest on Ronald's shield.

"The Dragon Empress lives in her bloodline," Ronald whispered in reverence as the beast roared, shaking the avalanche down upon the besieging warlords.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Rebirth of the Crown",
        wordCount: 360,
        isPremium: false,
        content: `Riding the Frost Wyrm into the capital city of Oakhaven, General Ronald dispersed the warlord factions and established the Council of the Free Realms.

He refused the imperial crown for himself, placing it instead on the altar of the Free People.

"The era of tyrants is over," Ronald declared from the palace balcony to the cheering thousands below. "From this day forth, the empire belongs to those who build it."`,
      },
    ],
  },

  // 9. BORN OF FIRE
  {
    slug: "born-of-fire",
    title: "Born of Fire",
    synopsis:
      "Tariq was born with volcanic flame coursing through his veins in a desert kingdom where fire-wielders are executed on sight. When desert raiders obliterate his oasis sanctuary, Tariq unleashes his hidden birthright—igniting a legendary rebellion across the scorching sands of the Caldera.",
    coverUrl: "/assets/mood-epic-adventure.jpg",
    bannerUrl: "/assets/mood-epic-adventure.jpg",
    author: {
      name: "Tariq Al-Mansoor",
      username: "tariq_fire",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
      { id: "action", name: "Action", slug: "action" },
    ],
    tags: ["Elemental Magic", "Desert Empire", "Rebellion", "Chosen One", "Martial Arts"],
    status: "ONGOING",
    rating: 4.82,
    reviewCount: 840,
    readCount: 58000,
    chapterCount: 4,
    wordCount: 16300,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Heartfelt & Emotional",
    category: "popular",
    storyDna: { romance: 40, politics: 65, action: 95, drama: 75, magic: 90 },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Ember in the Dust",
        wordCount: 360,
        isPremium: false,
        content: `When they held the burning coal to Tariq's skin, it did not blister. It dissolved into his veins like sweet water.

"Demon child," the high priest hissed, drawing his silver blade.

Tariq only looked up, his pupils swirling with liquid gold. He had hidden the fire within him for nineteen summers, pretending to be a simple water-carrier in the oasis village of Zafira.

When the Sultan's elite Iron Scorpions rode into the village, putting the palm groves to the torch and chaining the elders, Tariq could hold his secret no longer. He struck the ground with his bare palm, and a pillar of golden fire fifty feet high erupted into the desert sky.`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The March of the Ash Walkers",
        wordCount: 350,
        isPremium: false,
        content: `Across the shifting dunes of the Great Caldera, news of the Fire Maiden's son spread like wildfire.

Three thousand desert nomads, oppressed by the Sultan's crushing taxes and water monopolies, gathered around Tariq's camp. They called themselves the Ash Walkers.

Tariq taught them how to mold sand into obsidian glass weapons using his elemental heat.

"We do not fight for revenge," Tariq told the nomad leaders around the midnight campfire. "We fight so that every child in the desert may drink freely from the wells."`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Battle of the Sunken Oasis",
        wordCount: 340,
        isPremium: false,
        content: `The Sultan met the rebellion with five thousand heavy armored camels and brass cannons charged with enchanted liquid mercury.

As the cannons fired, Tariq raised his arms, creating a colossal heat barrier that vaporized the cannonballs in mid-air.

Charging at the head of the nomad cavalry, Tariq's flaming scimitar shattered the brass gates of the fortress in a single decisive strike, liberating the subterranean water springs for the entire desert realm.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Golden Dawn of the Caldera",
        wordCount: 360,
        isPremium: false,
        content: `With the tyrant Sultan deposed, Tariq opened the great aqueducts, transforming the scorched sands into blooming gardens of date palms and flowing streams.

He returned his flaming scimitar to the stone anvil of the ancestors.

"I am no king," Tariq smiled to the gathered multitude. "I am merely the flame that cleared the brush so new life could grow." And across the desert, songs of the Fire Walker were sung for generations.`,
      },
    ],
  },

  // 10. THE WITCH HEIR
  {
    slug: "the-witch-heir",
    title: "The Witch Heir",
    synopsis:
      "On her twenty-first birthday, high society debutante Lyra inherits an ancient blood grimoire and learns she is the sole heir to the Black Thorn Coven. To break an ancestral curse consuming her lineage, she must enter the shadowy Under-Bazaar and strike a perilous alliance with the coven's greatest inquisitor.",
    coverUrl: "/assets/crowns-temptation.jpg",
    bannerUrl: "/assets/hero-bg.jpg",
    author: {
      name: "Celeste Morgan",
      username: "celeste_coven",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "mystery", name: "Mystery", slug: "mystery" },
      { id: "romance", name: "Romance", slug: "romance" },
      { id: "dark_fantasy", name: "Dark Fantasy", slug: "dark_fantasy" },
    ],
    tags: ["Witches", "Ancient Curse", "Grimoire", "Forbidden Love", "Gothic Fantasy"],
    status: "ONGOING",
    rating: 4.86,
    reviewCount: 980,
    readCount: 61000,
    chapterCount: 4,
    wordCount: 16700,
    isPremium: true,
    isCompleted: false,
    featured: false,
    mood: "Mysterious & Suspenseful",
    category: "dark_fantasy",
    storyDna: { romance: 75, politics: 70, action: 70, drama: 80, magic: 95 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Grimoire of Black Thorns",
        wordCount: 360,
        isPremium: false,
        content: `The leather of the book was bound with living thorns that did not prick the finger unless you spoke the secret oath of the coven.

Lyra wiped the blood from her thumb onto the parchment. The words appeared in glowing violet script:

*'Welcome home, Little Thorn. Your grandmother's debts have come due.'*

Until midnight, Lyra had believed she was simply the daughter of a wealthy silk merchant in Victorian London. But when the family grandfather clock struck twelve, shadow ravens materialized in the parlor, and the grand mirror revealed her true reflection—eyes swirling with ancestral witchcraft.`,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Under-Bazaar of London",
        wordCount: 350,
        isPremium: false,
        content: `Disguised in a hooded velvet cloak, Lyra slipped through the secret passage beneath Covent Garden into the Under-Bazaar—a subterranean city where alchemists, vampire brokers, and rogue sorcerers traded in memories and forbidden artifacts.

At the Black Crow Tavern, she found Alexander Thorne, the most feared Witch Inquisitor in the British Isles.

"You have courage coming here alone, Miss Blackwood," Alexander noted, his silver-hilted rapier resting casually beside his tea cup.

"I don't need courage, Mr. Thorne," Lyra replied, opening the thorned grimoire. "I have the name of the demon that killed your brother."`,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Blood Pact in the Catacombs",
        wordCount: 340,
        isPremium: false,
        content: `Deep in the catacombs beneath Westminster Abbey, Lyra and Alexander performed the ancient rite of unbinding.

As demonic gargoyles descended from the stone arches, Alexander fought with blinding swordplay, while Lyra unleashed the thorn magic of her ancestors, weaving barriers of spectral briars that repelled the dark spirits.

In the heat of battle, their hands touched over the grimoire, sealing an unexpected magical resonance that bridged inquisitor and witch into an indomitable union.`,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Sovereign of the Thorn Coven",
        wordCount: 360,
        isPremium: false,
        content: `With the ancestral demon banished back into the abyss, the curse consuming the Blackwood lineage dissolved into starlight.

Lyra stood at the center of the coven circle, the grimoire floating obediently before her, with Alexander standing loyally at her side as her sworn protector.

"The coven is no longer a hidden secret," Lyra declared to the assembly of London's magical underground. "We are the guardians of the threshold."`,
      },
    ],
  },
];

export const SEED_NOVELS: SeedNovel[] = [
  ...FULL_CATALOG_NOVELS,
  ...ORIGINAL_SEED_NOVELS,
];
