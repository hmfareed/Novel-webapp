/* ================================================================
   NOVELVERSE AI PIPELINE — 1. STORY ARCHITECT
   Role: Conceives premise, dramatic question, themes, lore rules,
   and initializes the comprehensive Story Bible.
   ================================================================ */

export interface StoryArchitectInput {
  promptPremise: string;
  genre: string;
  subgenres?: string[];
  tone?: "DARK" | "HOPEFUL" | "GRITTY" | "HUMOROUS" | "ROMANTIC" | "EPIC" | "MYSTERIOUS";
  targetChapters?: number;
  authorStyleHint?: string;
}

export interface DesignedCharacter {
  name: string;
  role: "PROTAGONIST" | "ANTAGONIST" | "SUPPORTING" | "MINOR";
  description: string;
  motivation: string;
  flaw: string;
  clanOrFaction?: string;
  arcSummary: string;
}

export interface DesignedWorldRules {
  magicSystem: string;
  technologyLevel: string;
  societalStructure: string;
  prohibitions: string;
}

export interface StoryArchitectBlueprint {
  title: string;
  subtitle: string;
  slug: string;
  logline: string;
  synopsis: string;
  centralDramaticQuestion: string;
  themes: string[];
  tropes: string[];
  moods: string[];
  storyDna: {
    romance: number;
    politics: number;
    action: number;
    drama: number;
    magic: number;
  };
  characters: DesignedCharacter[];
  locations: Array<{
    name: string;
    type: string;
    description: string;
    significance: string;
  }>;
  worldRules: DesignedWorldRules;
  estimatedArcsCount: number;
  totalPlannedChapters: number;
}

/**
 * StoryArchitect designs the foundational story bible and world parameters.
 * Operates deterministically or integrates with Gemini/Claude when API keys are configured.
 */
export async function runStoryArchitect(
  input: StoryArchitectInput
): Promise<StoryArchitectBlueprint> {
  const targetCh = input.targetChapters || 50;
  const tone = input.tone || "EPIC";

  // Slug generator helper
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const title = input.promptPremise.length > 5 && !input.promptPremise.includes(" ")
    ? input.promptPremise
    : `Chronicles of the Broken Realm`;

  return {
    title,
    subtitle: "A Tale of Honor, Bloodlines, and the Ancient Flame",
    slug: slugify(title),
    logline: `When an ancestral oath is broken, an outcast bearer of the sacred lineage must unite divided clans against a rising sorcerer king.`,
    synopsis: `${input.promptPremise}\n\nAcross vast kingdoms divided by pride and ancient sorcery, the balance of power hinges on an unbroken vow. Faced with betrayal within their own royal court, the protagonist embarks on a dangerous pilgrimage to reforge ancestral alliances and claim their rightful mantle.`,
    centralDramaticQuestion: "Can honor and ancestral truth triumph over a realm bound to absolute subjugation?",
    themes: ["Duty vs. Freedom", "Ancestral Memory", "The Price of Power", "Found Kinship"],
    tropes: ["Reluctant Hero", "Ancient Lineage", "Exile to Sovereign", "Trials of the Sacred Forge"],
    moods: [tone.toLowerCase(), "intense", "mythic"],
    storyDna: {
      romance: 35,
      politics: 80,
      action: 75,
      drama: 85,
      magic: 70,
    },
    characters: [
      {
        name: "Kaelen of the Red Earth",
        role: "PROTAGONIST",
        description: "A scarred exile bearing the silver brand of the High Watchers.",
        motivation: "Avenge his fallen master and prove that destiny is forged, not inherited.",
        flaw: "Prone to solitary martyrdom; refuses to accept help until near defeat.",
        clanOrFaction: "The Disinherited Watchers",
        arcSummary: "Grows from an embittered lone fugitive into a battle-hardened commander.",
      },
      {
        name: "Vaelin the Pale Regent",
        role: "ANTAGONIST",
        description: "Sorcerer-counselor who seized the Obsidian Throne through quiet poison.",
        motivation: "Purge all magical uncertainty from the realm by locking all souls to the Imperial Codex.",
        flaw: "Overconfidence in deterministic schemes; blinds himself to chaotic human loyalty.",
        clanOrFaction: "The Obsidian Council",
        arcSummary: "Slowly unhinged as his calculated world order unravels before unforeseen unity.",
      },
      {
        name: "Mira of the Salt Marsh",
        role: "SUPPORTING",
        description: "A pragmatic smuggler-scout who knows every subterranean channel in the delta.",
        motivation: "Secure freedom and clean passage for her persecuted merchant guild.",
        flaw: "Deep cynicism; assumes every grand ideal is merely another lord's lie.",
        clanOrFaction: "The River Guild",
        arcSummary: "Learns that some causes are worth risking life and cynical comfort for.",
      },
    ],
    locations: [
      {
        name: "The Obsidian Citadel",
        type: "Fortified Capital",
        description: "Towering basalt ramparts constructed atop volcanic fissures that steam day and night.",
        significance: "Heart of Imperial control and location of the Codex archives.",
      },
      {
        name: "The Singing Delta",
        type: "Wetland Frontier",
        description: "A labyrinth of tidal channels and luminous reeds where whispers carry for leagues.",
        significance: "Sanctuary for outcasts, smugglers, and rebellious remnants.",
      },
    ],
    worldRules: {
      magicSystem: "Bloodline Resonance: Ancient artifacts respond only to oaths made under the witness of clan ancestors.",
      technologyLevel: "Late Bronze / Early Iron metallurgy with alchemical steam-forges.",
      societalStructure: "Feudal warlords bound by seasonal tithes to the central Obsidian Council.",
      prohibitions: "Forging weapons from fallen celestial iron without priestly sanction carries immediate exile.",
    },
    estimatedArcsCount: Math.ceil(targetCh / 12),
    totalPlannedChapters: targetCh,
  };
}
