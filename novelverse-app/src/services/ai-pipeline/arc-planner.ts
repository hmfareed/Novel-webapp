/* ================================================================
   NOVELVERSE AI PIPELINE — 2. ARC PLANNER
   Role: Deconstructs 30–150+ chapter epics into multi-arc structures,
   setting chapter milestones, tension curves, and scene quotas.
   ================================================================ */

import type { StoryArchitectBlueprint } from "./story-architect";

export interface PlannedChapterMeta {
  chapterNumber: number;
  title: string;
  arcName: string;
  arcNumber: number;
  primaryGoal: string;
  cliffhangerOrTurningPoint: string;
  targetWordCount: number;
  plannedSceneCount: number;
  tensionLevel: number; // 0–100
  charactersPresent: string[];
}

export interface StoryArcPlan {
  arcNumber: number;
  arcName: string;
  theme: string;
  chapterRange: string;
  climaxChapterNumber: number;
  summary: string;
  chapters: PlannedChapterMeta[];
}

export interface FullNovelArcPlan {
  novelTitle: string;
  totalChapters: number;
  arcs: StoryArcPlan[];
}

/**
 * ArcPlanner generates the long-form pacing outline, ensuring characters don't
 * wander aimlessly and that multi-chapter narratives maintain escalating stakes.
 */
export function runArcPlanner(
  blueprint: StoryArchitectBlueprint,
  chaptersPerArc = 10
): FullNovelArcPlan {
  const total = blueprint.totalPlannedChapters || 30;
  const numArcs = Math.ceil(total / chaptersPerArc);
  const arcs: StoryArcPlan[] = [];

  const arcTitles = [
    "The Breaking of the Oath",
    "The Singing Marshlands",
    "The Siege of Iron and Ash",
    "The Convergence of Kings",
    "The Eternal Dawn",
  ];

  let currentCh = 1;

  for (let a = 0; a < numArcs; a++) {
    const startCh = currentCh;
    const endCh = Math.min(total, currentCh + chaptersPerArc - 1);
    const arcTitle = arcTitles[a % arcTitles.length];
    const climaxCh = endCh;

    const plannedChapters: PlannedChapterMeta[] = [];

    for (let c = startCh; c <= endCh; c++) {
      const isArcClimax = c === climaxCh;
      const isArcStart = c === startCh;

      const tension = isArcClimax ? 95 : isArcStart ? 45 : 60 + ((c - startCh) * 3);

      plannedChapters.push({
        chapterNumber: c,
        title: isArcStart
          ? `The Threshold of ${arcTitle}`
          : isArcClimax
          ? `The Climax of ${arcTitle}`
          : `Echoes in the Shadows — Part ${c - startCh + 1}`,
        arcName: `Arc ${a + 1}: ${arcTitle}`,
        arcNumber: a + 1,
        primaryGoal: isArcStart
          ? "Establish the new regional crisis and force the characters into motion."
          : isArcClimax
          ? "The decisive confrontation that irrevocably alters the power balance."
          : "Uncover a critical piece of lore while surviving enemy patrols.",
        cliffhangerOrTurningPoint: isArcClimax
          ? "A trusted ally's secret allegiance is exposed before the burning citadel."
          : "An ancient alarm sounds across the valley; the escape route is sealed.",
        targetWordCount: 2200,
        plannedSceneCount: 3,
        tensionLevel: Math.min(100, tension),
        charactersPresent: [
          blueprint.characters[0]?.name || "Protagonist",
          c % 2 === 0 ? blueprint.characters[2]?.name || "Ally" : blueprint.characters[1]?.name || "Rival",
        ],
      });
    }

    arcs.push({
      arcNumber: a + 1,
      arcName: `Arc ${a + 1}: ${arcTitle}`,
      theme: a === 0 ? "Exile and Survival" : a === 1 ? "Gathering Alliances" : "Total War",
      chapterRange: `Ch ${startCh}–${endCh}`,
      climaxChapterNumber: climaxCh,
      summary: `In this arc, the stakes elevate from regional skirishes to full-scale imperial mobilization.`,
      chapters: plannedChapters,
    });

    currentCh = endCh + 1;
    if (currentCh > total) break;
  }

  return {
    novelTitle: blueprint.title,
    totalChapters: total,
    arcs,
  };
}
