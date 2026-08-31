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
    novelCount: 12400,
  },
  {
    name: "Romance",
    slug: "romance",
    icon: "heart",
    description: "Passionate rivalries, forbidden love, and eternal bonds.",
    color: "#ec4899",
    novelCount: 8500,
  },
  {
    name: "Mystery",
    slug: "mystery",
    icon: "search",
    description: "Intricate investigations, shocking twists, and hidden secrets.",
    color: "#06b6d4",
    novelCount: 6700,
  },
  {
    name: "Adventure",
    slug: "adventure",
    icon: "compass",
    description: "Perilous quests across untamed continents and treacherous seas.",
    color: "#10b981",
    novelCount: 7100,
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    icon: "atom",
    description: "Interstellar empires, cybernetic futures, and cosmic mysteries.",
    color: "#3b82f6",
    novelCount: 5200,
  },
  {
    name: "Thriller",
    slug: "thriller",
    icon: "zap",
    description: "High-stakes danger, psychological warfare, and ticking clocks.",
    color: "#f59e0b",
    novelCount: 4300,
  },
  {
    name: "Historical",
    slug: "historical",
    icon: "landmark",
    description: "Grand dynasties, palace revolutions, and ancient warfare.",
    color: "#d97706",
    novelCount: 3800,
  },
  {
    name: "Horror",
    slug: "horror",
    icon: "skull",
    description: "Gothic night terrors, cosmic dread, and supernatural forces.",
    color: "#ef4444",
    novelCount: 2900,
  },
  {
    name: "African Stories",
    slug: "african_stories",
    icon: "sparkles",
    description: "Legendary griot epics, ancestral mythology, folklore, and kingdom sagas.",
    color: "#f59e0b",
    novelCount: 5600,
  },
  {
    name: "Classics",
    slug: "classics",
    icon: "landmark",
    description: "Enduring world literature masterpieces and timeless tales.",
    color: "#8b5cf6",
    novelCount: 9200,
  },
  {
    name: "Dark Fantasy",
    slug: "dark_fantasy",
    icon: "skull",
    description: "Atmospheric, shadowy realms of forbidden magic and monstrous perils.",
    color: "#a855f7",
    novelCount: 4100,
  },
];

import { FULL_CATALOG_NOVELS } from "./novels-data";

const ORIGINAL_SEED_NOVELS: SeedNovel[] = [
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
    rating: 4.8,
    reviewCount: 2420,
    readCount: 128000,
    chapterCount: 32,
    wordCount: 512000,
    isPremium: false,
    isCompleted: false,
    featured: true,
    mood: "Dark & Intense",
    category: "popular",
    storyDna: {
      romance: 80,
      politics: 75,
      action: 70,
      drama: 65,
      magic: 90,
    },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Ashes of Eldoria",
        wordCount: 3450,
        isPremium: false,
        content: `The hall was silent.\n\nIsolde stood at the center, the weight of a thousand eyes burning into her. Her sword was still wet with the black blood of the vanguard, her breath heavy, her heart... heavier.\n\n"Why?" he demanded, stepping over the shattered marble threshold.\n\n"Because you were never meant to wear the crown, Kael. It was never yours."\n\nThe words hit harder than any blade. Outside the grand cathedral, the storm wept over Eldoria, lightning fracturing the crimson stained-glass windows into a kaleidoscope of shadow and flame.\n\nKaelen removed his obsidian gauntlet, tossing it carelessly to the stone floor. It clattered with a hollow ring that echoed into the rafters where ravens perched in solemn judgment. "You think this throne is a prize, Princess? It is an altar. And tomorrow, at dawn, they will expect a sacrifice."\n\nIsolde raised her chin, refusing to let the trembling in her fingers show. "Then let them bring their blades. I was born in the fire of the northern spires. I will not kneel in the embers."\n\nHe smiled then—a cold, sharp thing that made the pulse in her throat leap. "I never asked you to kneel, Isolde. I came to offer you the ashes of the empire."`,
      },
      {
        chapterNumber: 2,
        title: "A Pact in Shadows",
        wordCount: 3820,
        isPremium: false,
        content: `The war room smelled of melted wax and old parchment. The northern commanders had fled like rats when the Obsidian standard crested the horizon, leaving only Isolde and her personal guard to defend the treaty maps.\n\nKaelen leaned over the table, his shadow swallowing the eastern provinces. "Your father promised three thousand grain wagons and the silver mines of Valdor. Instead, he sent assassins into my tent."\n\n"My father is dead," Isolde snapped, her hand instinctively touching the hilt of the dagger concealed within the velvet folds of her gown. "And you killed him."\n\n"I gave him an honorable duel," Kaelen corrected, his golden eyes narrowing in the candlelight. "Which is far more mercy than he showed the border clans."\n\nShe looked down at the map. The red pins marking his army were encircling her ancestral city like a serpent coiling for the crush. There was no victory with steel. Only with cunning.`,
      },
      {
        chapterNumber: 3,
        title: "Whispers of the Court",
        wordCount: 4100,
        isPremium: false,
        content: `By third bell, the grand banquet hall was filled with nobles who had spent the previous night swearing allegiance to three different claimants to the throne. Silk gowns rustled against gilded chairs, but beneath the laughter, every guest wore armor of deceit.\n\nIsolde wore black—the mourning color of house Valerius. When she entered, the musicians stumbled, and the conversation withered into uneasy murmurs.\n\n"Look at her," Lady Vane whispered into her jeweled fan. "Walking like an empress when her crown is being melted down for coin."\n\nIsolde did not turn her head. She walked straight to the dais where Kaelen sat, occupying her father's seat with the insolence of a conqueror who knew no one in the room possessed the courage to challenge him.`,
      },
    ],
  },
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
    ],
    tags: ["Antihero", "Dark Fantasy", "Revenge", "Shadow Magic", "Court Intrigue"],
    status: "ONGOING",
    rating: 4.7,
    reviewCount: 1890,
    readCount: 96000,
    chapterCount: 18,
    wordCount: 280000,
    isPremium: true,
    isCompleted: false,
    featured: true,
    mood: "Mysterious & Suspenseful",
    category: "trending",
    storyDna: {
      romance: 30,
      politics: 85,
      action: 90,
      drama: 80,
      magic: 95,
    },
    ageRating: "18+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Fall of the Sunken Citadel",
        wordCount: 3200,
        isPremium: false,
        content: `They threw him into the Chasm of Wailing Souls with poisoned iron chains wrapped three times around his chest.\n\n"You are forgotten, Kaelen," the Archon had spat into his bleeding face before the gate dropped. "No light penetrates the abyss."\n\nThey were right about the light. But they were fools about the dark.\n\nFor three hundred days, Kaelen did not speak. He listened to the breathing of the deep earth. When the shadows coiled around his shattered ribs, they did not feed on his flesh—they recognized the lineage of the First Shadow King.`,
      },
    ],
  },
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
    ],
    tags: ["Vampires", "Gothic Romance", "Morally Grey", "Forbidden Magic", "Enemies to Lovers"],
    status: "ONGOING",
    rating: 4.6,
    reviewCount: 1540,
    readCount: 85000,
    chapterCount: 24,
    wordCount: 340000,
    isPremium: true,
    isCompleted: false,
    featured: true,
    mood: "Dark & Intense",
    category: "popular",
    storyDna: {
      romance: 95,
      politics: 60,
      action: 65,
      drama: 85,
      magic: 75,
    },
    ageRating: "18+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Thorned Invitation",
        wordCount: 3100,
        isPremium: false,
        content: `The rose arrived in a box of black velvet, its petals dripping a dew that smelled unmistakably of iron.\n\nRosalind knew the seal. The winged skull of House Draven. The vampire lord had accepted her petition to bargain for her sister's soul, but the terms written in calligraphy were terrifying in their simplicity:\n\n'One life for another. Enter the spire before the eclipse completes, or she drinks from the chalice of eternal servitude.'`,
      },
    ],
  },
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
      { id: "historical", name: "Historical", slug: "historical" },
    ],
    tags: ["African Mythology", "Gods & Spirits", "Epic Quest", "Elemental Magic", "Wilderness"],
    status: "ONGOING",
    rating: 4.8,
    reviewCount: 920,
    readCount: 64000,
    chapterCount: 16,
    wordCount: 220000,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Epic & Adventurous",
    category: "african_stories",
    storyDna: {
      romance: 45,
      politics: 70,
      action: 88,
      drama: 75,
      magic: 92,
    },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Golden Tears of the Baobab",
        wordCount: 2900,
        isPremium: false,
        content: `The wind smelled of roasted sorghum and ozone.\n\nKofi crouched atop the red termite mound, his spear grounded in the dusty soil. Three hundred meters away across the shimmering heat haze, the Great Baobab glowed with an eerie phosphor. From its ancient gnarled bark, thick veins of golden resin pulsed like the heartbeat of the land.`,
      },
    ],
  },
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
      { id: "adventure", name: "Adventure", slug: "adventure" },
    ],
    tags: ["African Futurism", "Cosmic Power", "Twins", "Prophecy", "Mythology"],
    status: "ONGOING",
    rating: 4.9,
    reviewCount: 1450,
    readCount: 89000,
    chapterCount: 22,
    wordCount: 310000,
    isPremium: true,
    isCompleted: false,
    featured: true,
    mood: "Epic & Adventurous",
    category: "african_stories",
    storyDna: {
      romance: 50,
      politics: 65,
      action: 92,
      drama: 80,
      magic: 98,
    },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Sky of Dual Moons",
        wordCount: 3300,
        isPremium: false,
        content: `On the night Nia turned eighteen, the second moon appeared over the city of Oya.\n\nIt did not rise from the horizon; it ripped through the fabric of the night sky like a white-hot blade cutting through black velvet. Her palm flared with unbearable solar heat, illuminating her room in blinding azure radiance.`,
      },
    ],
  },
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
    rating: 4.7,
    reviewCount: 880,
    readCount: 52000,
    chapterCount: 14,
    wordCount: 195000,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Mysterious & Suspenseful",
    category: "new_releases",
    storyDna: {
      romance: 40,
      politics: 70,
      action: 85,
      drama: 75,
      magic: 60,
    },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Ghost of Horizon-9",
        wordCount: 2800,
        isPremium: false,
        content: `The proximity alarm screamed in three-tone harmonic bursts that made Jax's dental implants vibrate.\n\n"Captain," synthetic navigator Unit-7 droned through the cockpit speakers. "Gravitational shear has increased forty percent. The object ahead is not an asteroid cluster. It is a dreadnought class warship. Imperial registry... 2742."\n\nJax dropped his hydro-wrench. "The Imperial dynasty collapsed two centuries ago."`,
      },
    ],
  },
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
      { id: "drama", name: "Drama", slug: "drama" },
    ],
    tags: ["Assassin", "Female Protagonist", "Revenge", "Dark Fantasy", "Guild Politics"],
    status: "ONGOING",
    rating: 4.7,
    reviewCount: 1100,
    readCount: 78000,
    chapterCount: 20,
    wordCount: 290000,
    isPremium: true,
    isCompleted: false,
    featured: false,
    mood: "Dark & Intense",
    category: "dark_fantasy",
    storyDna: {
      romance: 55,
      politics: 80,
      action: 95,
      drama: 70,
      magic: 85,
    },
    ageRating: "18+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Blade Without a Master",
        wordCount: 3000,
        isPremium: false,
        content: `A good assassin never watches her target's eyes. You watch the collarbone. The subtle shift in breath before the hand moves toward the concealed dagger.\n\nVespera perched on the gargoyle overlooking the Archon's balcony, the mist rolling off the river wrapping around her leather cloak like second skin.`,
      },
    ],
  },
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
    rating: 4.5,
    reviewCount: 760,
    readCount: 45000,
    chapterCount: 15,
    wordCount: 240000,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Epic & Adventurous",
    category: "popular",
    storyDna: {
      romance: 35,
      politics: 90,
      action: 90,
      drama: 85,
      magic: 70,
    },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Broken Standard",
        wordCount: 3200,
        isPremium: false,
        content: `Snow fell on the bronze dragon banner, turning its golden scales to tarnished lead.\n\n"They have breached the south redoubt, General," Captain Vane reported, his breath crystallizing in the sub-zero gale. "The western legion is in full retreat."`,
      },
    ],
  },
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
    rating: 4.6,
    reviewCount: 840,
    readCount: 58000,
    chapterCount: 17,
    wordCount: 260000,
    isPremium: false,
    isCompleted: false,
    featured: false,
    mood: "Heartfelt & Emotional",
    category: "popular",
    storyDna: {
      romance: 40,
      politics: 65,
      action: 95,
      drama: 75,
      magic: 90,
    },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Ember in the Dust",
        wordCount: 3100,
        isPremium: false,
        content: `When they held the burning coal to Tariq's skin, it did not blister. It dissolved into his veins like sweet water.\n\n"Demon child," the high priest hissed. But Tariq only looked up, his pupils swirling with liquid gold.`,
      },
    ],
  },
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
    ],
    tags: ["Witches", "Ancient Curse", "Grimoire", "Forbidden Love", "Gothic Fantasy"],
    status: "ONGOING",
    rating: 4.7,
    reviewCount: 980,
    readCount: 61000,
    chapterCount: 19,
    wordCount: 275000,
    isPremium: true,
    isCompleted: false,
    featured: false,
    mood: "Mysterious & Suspenseful",
    category: "dark_fantasy",
    storyDna: {
      romance: 75,
      politics: 70,
      action: 70,
      drama: 80,
      magic: 95,
    },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "The Grimoire of Black Thorns",
        wordCount: 3050,
        isPremium: false,
        content: `The leather was bound with thorns that did not prick the finger unless you spoke the secret oath.\n\nLyra wiped the blood from her thumb onto the parchment. The words appeared in glowing violet script: 'Welcome home, Little Thorn.'`,
      },
    ],
  },
];

export const SEED_NOVELS: SeedNovel[] = [
  ...FULL_CATALOG_NOVELS,
  ...ORIGINAL_SEED_NOVELS,
];

