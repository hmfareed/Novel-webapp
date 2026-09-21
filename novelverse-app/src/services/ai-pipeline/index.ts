/* ================================================================
   NOVELVERSE AI PIPELINE — MASTER ORCHESTRATOR
   Translates second-plan.md §30 into an end-to-end pipeline:
   Story Architect → Arc Planner → Scene Writer → Continuity Editor → Media Director
   ================================================================ */

import { runStoryArchitect, type StoryArchitectInput, type StoryArchitectBlueprint } from "./story-architect";
import { runArcPlanner, type FullNovelArcPlan } from "./arc-planner";
import { runSceneWriter, type WrittenChapterPayload } from "./scene-writer";
import { runContinuityEditor, type EditorialAuditReport } from "./continuity-editor";
import { runMediaDirector, type MultimediaAssetBundle } from "./media-director";

export * from "./story-architect";
export * from "./arc-planner";
export * from "./scene-writer";
export * from "./continuity-editor";
export * from "./media-director";

export interface PipelineExecutionResult {
  blueprint: StoryArchitectBlueprint;
  arcPlan: FullNovelArcPlan;
  firstChapter: WrittenChapterPayload;
  editorialReport: EditorialAuditReport;
  mediaBundle: MultimediaAssetBundle;
  productionSummary: {
    novelSlug: string;
    totalArcs: number;
    totalPlannedChapters: number;
    firstChapterWordCount: number;
    continuityScore: number;
    isReadyForPublication: boolean;
  };
}

/**
 * Executes the complete AI Long-Form Production Pipeline.
 * Replaces simple one-shot generation with a multi-role publishing studio.
 */
export async function runNovelProductionPipeline(
  input: StoryArchitectInput
): Promise<PipelineExecutionResult> {
  // 1. Story Architect: Premise, World Rules, Characters, Story Bible
  const blueprint = await runStoryArchitect(input);

  // 2. Arc Planner: Breaks novel into structured multi-chapter arcs
  const arcPlan = runArcPlanner(blueprint, 10);

  // 3. Scene Writer: Writes Chapter 1 scene-by-scene
  const chapter1Meta = arcPlan.arcs[0].chapters[0];
  const firstChapter = await runSceneWriter(chapter1Meta, blueprint);

  // 4. Continuity & Editorial Agent: Audits draft against Story Bible
  const editorialReport = await runContinuityEditor(firstChapter, blueprint);

  // 5. Media Director: Synthesizes cover art prompts and ambient audio
  const mediaBundle = await runMediaDirector(blueprint, firstChapter);

  return {
    blueprint,
    arcPlan,
    firstChapter,
    editorialReport,
    mediaBundle,
    productionSummary: {
      novelSlug: blueprint.slug,
      totalArcs: arcPlan.arcs.length,
      totalPlannedChapters: arcPlan.totalChapters,
      firstChapterWordCount: firstChapter.totalWordCount,
      continuityScore: editorialReport.continuityScore,
      isReadyForPublication: editorialReport.isApprovedForPublication,
    },
  };
}
