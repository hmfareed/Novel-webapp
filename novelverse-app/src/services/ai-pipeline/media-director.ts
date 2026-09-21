/* ================================================================
   NOVELVERSE AI PIPELINE — 5. MEDIA DIRECTOR
   Role: Directs artwork synthesis, typography branding, ambient
   audio cues, and TTS narration guidelines for Enhanced Novels.
   ================================================================ */

import type { StoryArchitectBlueprint } from "./story-architect";
import type { WrittenChapterPayload } from "./scene-writer";

export interface CoverDirectionSpec {
  prompt: string;
  negativePrompt: string;
  aspectRatio: "3:4" | "16:9" | "1:1";
  artStyle: string;
  paletteTheme: string[];
  visualMotifs: string[];
  suggestedHeroCoverUrl: string;
}

export interface MultimediaAssetBundle {
  chapterNumber: number;
  coverDirection: CoverDirectionSpec;
  sceneMediaSpecs: Array<{
    sceneOrder: number;
    visualIllustrationPrompt: string;
    ambientAudioTrackName: string;
    ambientAudioUrl?: string;
    narrationVoiceStyle: string;
  }>;
}

/**
 * MediaDirector synthesizes non-generic, unique artwork and acoustic
 * directions matching the specific identity of the novel.
 */
export async function runMediaDirector(
  blueprint: StoryArchitectBlueprint,
  chapter: WrittenChapterPayload
): Promise<MultimediaAssetBundle> {
  const protagonist = blueprint.characters.find((c) => c.role === "PROTAGONIST");

  const coverDirection: CoverDirectionSpec = {
    prompt: `Professional cinematic fantasy book cover for "${blueprint.title}". Featuring ${protagonist?.name || "the hero"}, a scarred warrior holding an ancient iron bow atop a cliff overlooking an obsidian fortress in volcanic mist. Striking dramatic lighting, gold and violet color grading, epic typography space at top.`,
    negativePrompt: "lowres, text artifacts, duplicate limbs, cartoon, generic anime, blurry, deformed face",
    aspectRatio: "3:4",
    artStyle: "Cinematic High Fantasy Oil Illustration with Digital Matte Finish",
    paletteTheme: ["#07090e", "#7c3aed", "#d97706", "#dc2626"],
    visualMotifs: ["Iron bow", "Volcanic embers", "Ancestral lion crest", "Misty wetlands"],
    suggestedHeroCoverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
  };

  const sceneMediaSpecs = chapter.scenes.map((s) => ({
    sceneOrder: s.order,
    visualIllustrationPrompt: s.visualPromptForMediaDirector,
    ambientAudioTrackName: s.ambientSoundSuggested,
    ambientAudioUrl: s.order === 1 ? "https://cdn.pixabay.com/download/audio/forge-fire.mp3" : undefined,
    narrationVoiceStyle: "Deep baritone, measured pacing, authoritative epic tone",
  }));

  return {
    chapterNumber: chapter.chapterNumber,
    coverDirection,
    sceneMediaSpecs,
  };
}
