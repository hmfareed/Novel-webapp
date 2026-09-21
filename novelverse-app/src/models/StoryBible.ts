import mongoose, { Schema, Document, Model } from "mongoose";

/* ── Sub-types ──────────────────────────────────────────────────── */

export interface IBibleCharacter {
  _id?: mongoose.Types.ObjectId;
  name: string;
  aliases: string[];
  role: "PROTAGONIST" | "ANTAGONIST" | "SUPPORTING" | "MINOR" | "NARRATOR";
  description: string;

  // Physical
  age?: string;                   // can be "unknown" or "mid-30s"
  gender?: string;
  appearance?: string;

  // Personality & arc
  personality?: string;
  motivation?: string;
  backstory?: string;
  arcSummary?: string;

  // Relationships  {characterId: "...", type: "ally | rival | lover | family | enemy"}
  relationships: Array<{
    characterId: mongoose.Types.ObjectId;
    type: "ALLY" | "RIVAL" | "LOVER" | "FAMILY" | "ENEMY" | "OTHER";
    notes?: string;
  }>;

  // Continuity tracking
  firstAppearanceChapter?: number;
  lastKnownLocation?: string;
  currentStatus?: "ALIVE" | "DECEASED" | "MISSING" | "UNKNOWN";

  imageUrl?: string;              // optional character card illustration
}

export interface IBibleLocation {
  _id?: mongoose.Types.ObjectId;
  name: string;
  type: "CITY" | "COUNTRY" | "REGION" | "BUILDING" | "REALM" | "WORLD" | "OTHER";
  description: string;
  climate?: string;
  geography?: string;
  culture?: string;
  significance?: string;
  imageUrl?: string;
}

export interface IBibleFaction {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  alignment?: "GOOD" | "EVIL" | "NEUTRAL" | "CHAOTIC";
  goals?: string;
  resources?: string;
  relationships?: string;       // brief prose about inter-faction relations
}

export interface IBibleTimelineEvent {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  chapterRange?: string;        // e.g. "Ch 1–5" or "Before story begins"
  sortOrder: number;
}

export interface IStoryRules {
  magicSystem?: string;         // full explanation of magic/power rules
  technologyLevel?: string;     // e.g. "Medieval + basic alchemy"
  worldHistory?: string;        // brief lore history
  uniqueLaws?: string;          // laws of physics, biology, society
  prohibitions?: string;        // things explicitly not allowed in this world
}

/* ── Story Bible Document ─────────────────────────────────────── */
export interface IStoryBible extends Document {
  novelId: mongoose.Types.ObjectId;               // ref → Novel
  authorId: mongoose.Types.ObjectId;              // ref → User

  // World overview
  worldName?: string;
  era?: string;                                   // e.g. "Third Age of the Kingdoms"
  worldDescription: string;
  tone: "DARK" | "HOPEFUL" | "GRITTY" | "HUMOROUS" | "ROMANTIC" | "EPIC" | "MYSTERIOUS";

  // Core narrative
  centralConflict: string;
  themes: string[];
  centralQuestion?: string;                       // the dramatic question of the novel

  // Structured world data
  characters: IBibleCharacter[];
  locations: IBibleLocation[];
  factions: IBibleFaction[];
  timeline: IBibleTimelineEvent[];
  rules: IStoryRules;

  // Continuity aids
  glossary: Array<{ term: string; definition: string }>;
  openPlotThreads: Array<{ thread: string; resolvedAtChapter?: number }>;

  // AI generation metadata (used by the AI pipeline)
  generationModel?: string;                       // e.g. "gemini-2.0-flash"
  generationPromptVersion?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* ── Schema ───────────────────────────────────────────────────── */
const CharacterSchema = new Schema<IBibleCharacter>({
  name: { type: String, required: true },
  aliases: [{ type: String }],
  role: {
    type: String,
    enum: ["PROTAGONIST", "ANTAGONIST", "SUPPORTING", "MINOR", "NARRATOR"],
    required: true,
  },
  description: { type: String, default: "" },
  age: { type: String },
  gender: { type: String },
  appearance: { type: String },
  personality: { type: String },
  motivation: { type: String },
  backstory: { type: String },
  arcSummary: { type: String },
  relationships: [
    {
      characterId: { type: Schema.Types.ObjectId, required: true },
      type: {
        type: String,
        enum: ["ALLY", "RIVAL", "LOVER", "FAMILY", "ENEMY", "OTHER"],
        required: true,
      },
      notes: { type: String, default: "" },
    },
  ],
  firstAppearanceChapter: { type: Number },
  lastKnownLocation: { type: String },
  currentStatus: {
    type: String,
    enum: ["ALIVE", "DECEASED", "MISSING", "UNKNOWN"],
    default: "ALIVE",
  },
  imageUrl: { type: String },
});

const StoryBibleSchema = new Schema<IStoryBible>(
  {
    novelId: {
      type: Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
      unique: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    worldName: { type: String },
    era: { type: String },
    worldDescription: { type: String, default: "" },
    tone: {
      type: String,
      enum: ["DARK", "HOPEFUL", "GRITTY", "HUMOROUS", "ROMANTIC", "EPIC", "MYSTERIOUS"],
      default: "EPIC",
    },
    centralConflict: { type: String, default: "" },
    themes: [{ type: String }],
    centralQuestion: { type: String },

    characters: [CharacterSchema],
    locations: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["CITY", "COUNTRY", "REGION", "BUILDING", "REALM", "WORLD", "OTHER"],
          default: "OTHER",
        },
        description: { type: String, default: "" },
        climate: { type: String },
        geography: { type: String },
        culture: { type: String },
        significance: { type: String },
        imageUrl: { type: String },
      },
    ],
    factions: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        alignment: {
          type: String,
          enum: ["GOOD", "EVIL", "NEUTRAL", "CHAOTIC"],
        },
        goals: { type: String },
        resources: { type: String },
        relationships: { type: String },
      },
    ],
    timeline: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        chapterRange: { type: String },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    rules: {
      magicSystem: { type: String },
      technologyLevel: { type: String },
      worldHistory: { type: String },
      uniqueLaws: { type: String },
      prohibitions: { type: String },
    },
    glossary: [
      {
        term: { type: String, required: true },
        definition: { type: String, required: true },
      },
    ],
    openPlotThreads: [
      {
        thread: { type: String, required: true },
        resolvedAtChapter: { type: Number },
      },
    ],
    generationModel: { type: String },
    generationPromptVersion: { type: String },
  },
  {
    timestamps: true,
  }
);

export const StoryBible: Model<IStoryBible> =
  mongoose.models.StoryBible ||
  mongoose.model<IStoryBible>("StoryBible", StoryBibleSchema);
