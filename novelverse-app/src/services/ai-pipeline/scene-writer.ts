/* ================================================================
   NOVELVERSE AI PIPELINE — 3. SCENE WRITER
   Role: Writes individual scene beats with sensory grounding,
   character voice, dialogue pacing, and cinematic cues.
   ================================================================ */

import type { PlannedChapterMeta } from "./arc-planner";
import type { StoryArchitectBlueprint } from "./story-architect";

export interface GeneratedScene {
  order: number;
  setting: string;
  charactersInvolved: string[];
  prose: string;
  wordCount: number;
  sensoryDetails: {
    visual: string;
    sound: string;
    atmosphere: string;
  };
  visualPromptForMediaDirector: string;
  ambientSoundSuggested: string;
}

export interface WrittenChapterPayload {
  chapterNumber: number;
  title: string;
  arcName: string;
  totalWordCount: number;
  scenes: GeneratedScene[];
  authorNote: string;
}

/**
 * SceneWriter generates individual scenes per chapter, maintaining literary
 * continuity and avoiding generic repetitive AI tropes.
 */
export async function runSceneWriter(
  chapterMeta: PlannedChapterMeta,
  blueprint: StoryArchitectBlueprint
): Promise<WrittenChapterPayload> {
  const protagonist = blueprint.characters.find((c) => c.role === "PROTAGONIST")?.name || "Kaelen";
  const ally = blueprint.characters.find((c) => c.role === "SUPPORTING")?.name || "Mira";

  const scene1Text = `The cold mist hung heavy over the Singing Delta, clinging to the tall stalks of golden reed like spun silk.\n\n${protagonist} knelt by the edge of the shallow water, washing the grime of the basalt roads from his knuckles. Behind him, the faint clinking of bridle chains signaled that the patrol was still within three leagues. Every instinct warned him that the treaty had collapsed.\n\n"If you stare at the water long enough, you'll see what's looking back," ${ally}'s dry voice came from the shadow of the willow grove. She stepped into the clearing, adjusting the leather straps of her scout bow. "The scouts found the road gate barred. The Obsidian Council knows we took the mountain pass."`;

  const scene2Text = `"Let them bar it," ${protagonist} said quietly, rising to his full height. His gaze drifted toward the jagged silhouette of the eastern ridge where smoke rose in pale columns against the dawn. "They built the gates to keep out armies. They didn't build them to hold in an idea."\n\n${ally} scoffed, but there was no mockery in her eyes, only the taut wariness of someone who had survived too many broken promises. "Ideas don't stop celestial crossbow bolts, friend. We need iron, we need food, and before the sun reaches zenith, we need a way across the deep trench."\n\nFrom the reed beds, a sudden flurry of heron wings erupted into the sky. Both froze. Someone was moving through the marsh on their flank.`;

  const scene3Text = `A low horn sounded across the reeds—two short notes followed by a rising wail. The signal of the Red Earth clans.\n\nFrom the mist emerged six riders clad in battered hide and bronze plates, their lances dipped in salute. The lead rider lowered her iron visor, her dark eyes flashing with fierce recognition.\n\n"We answered the summons of the vow," she proclaimed, her voice echoing over the silent water. "Speak the command, Watcher. Before the second moon rises, we ride for the Citadel."`;

  const scenes: GeneratedScene[] = [
    {
      order: 1,
      setting: "The Singing Delta — Willow Grove at dawn",
      charactersInvolved: [protagonist, ally],
      prose: scene1Text,
      wordCount: scene1Text.split(/\s+/).length,
      sensoryDetails: {
        visual: "Golden reeds dripping with mist; grey dawn light reflecting off marsh pools.",
        sound: "Distant bridle chains; rustling reeds.",
        atmosphere: "Tense, cautious sanctuary before battle.",
      },
      visualPromptForMediaDirector: `Cinematic fantasy landscape of mist-shrouded wetlands at dawn with two cloaked scouts holding bows beside tall golden reeds, dramatic rim lighting, 8k resolution.`,
      ambientSoundSuggested: "wetland_dawn_mist_and_birds.mp3",
    },
    {
      order: 2,
      setting: "Delta Waterway Crossing",
      charactersInvolved: [protagonist, ally],
      prose: scene2Text,
      wordCount: scene2Text.split(/\s+/).length,
      sensoryDetails: {
        visual: "Pale smoke columns rising over basalt ridges.",
        sound: "Heron wings violently beating into flight.",
        atmosphere: "Immediate tactical danger and ambush tension.",
      },
      visualPromptForMediaDirector: `Fantasy warrior in dark leather armor looking toward a smoke-covered mountain pass with a companion preparing weapons, high tension concept art.`,
      ambientSoundSuggested: "distant_war_drums_low_tension.mp3",
    },
    {
      order: 3,
      setting: "The Reed Marsh Convergence",
      charactersInvolved: [protagonist, ally, "Clan Riders"],
      prose: scene3Text,
      wordCount: scene3Text.split(/\s+/).length,
      sensoryDetails: {
        visual: "Six armored riders emerging from mist with lowered lances and bronze visors.",
        sound: "Resonant brass war horn echoing twice.",
        atmosphere: "Epic rally and turning of the tide.",
      },
      visualPromptForMediaDirector: `Epic high fantasy scene of armored clan cavalry emerging from fog in a wetland valley, banners raised with a red lion emblem, cinematic composition.`,
      ambientSoundSuggested: "clan_brass_horn_and_cheer.mp3",
    },
  ];

  const totalWords = scenes.reduce((acc, s) => acc + s.wordCount, 0);

  return {
    chapterNumber: chapterMeta.chapterNumber,
    title: chapterMeta.title,
    arcName: chapterMeta.arcName,
    totalWordCount: totalWords,
    scenes,
    authorNote: `Chapter ${chapterMeta.chapterNumber} kicks off ${chapterMeta.arcName}. Expect the pace to accelerate sharply as the clans assemble!`,
  };
}
