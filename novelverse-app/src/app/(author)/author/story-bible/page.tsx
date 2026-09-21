"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  MapPin,
  Shield,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/novelverse/navbar";
import { Footer } from "@/components/novelverse/footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BibleCharacterUI {
  id: string;
  name: string;
  role: "PROTAGONIST" | "ANTAGONIST" | "SUPPORTING" | "MINOR";
  description: string;
  motivation: string;
  status: "ALIVE" | "DECEASED" | "UNKNOWN";
  allies: string[];
  enemies: string[];
}

interface BibleLocationUI {
  id: string;
  name: string;
  type: string;
  description: string;
  significance: string;
}

export default function StoryBiblePage() {
  const [activeTab, setActiveTab] = React.useState<"characters" | "locations" | "rules" | "timeline">("characters");
  const [searchQuery, setSearchQuery] = React.useState("");

  const [characters, setCharacters] = React.useState<BibleCharacterUI[]>([
    {
      id: "c-1",
      name: "Sundiata Keita",
      role: "PROTAGONIST",
      description: "Son of the buffalo woman Sogolon. Destined to unite the twelve kingdoms of Mali.",
      motivation: "Liberate his ancestral homeland from the sorcerer king and restore the Mandinka honor.",
      status: "ALIVE",
      allies: ["Balla Fasséké", "Manding Bory"],
      enemies: ["Soumaoro Kanté", "Sassouma Bérété"],
    },
    {
      id: "c-2",
      name: "Soumaoro Kanté",
      role: "ANTAGONIST",
      description: "King of Sosso. Wielder of dark fetishes and invulnerable to ordinary iron weapons.",
      motivation: "Expand his iron grip over the Niger river trade and suppress the ancient clans.",
      status: "ALIVE",
      allies: ["The Sosso Guard"],
      enemies: ["Sundiata Keita"],
    },
    {
      id: "c-3",
      name: "Balla Fasséké",
      role: "SUPPORTING",
      description: "Royal Griot and keeper of memory. Master of words and the sacred balafon.",
      motivation: "Record the eternal truth of the Lion King and preserve ancestral songs.",
      status: "ALIVE",
      allies: ["Sundiata Keita"],
      enemies: ["Soumaoro Kanté"],
    },
  ]);

  const [locations, setLocations] = React.useState<BibleLocationUI[]>([
    {
      id: "l-1",
      name: "Niani",
      type: "Capital City",
      description: "Ancient capital nestled among sacred baobabs on the fertile banks of the Sankarani.",
      significance: "Seat of the Keita kings and ancestral homeland.",
    },
    {
      id: "l-2",
      name: "The Koulikoro Caves",
      type: "Sacred Realm",
      description: "Subterranean cavern where the sorcerer king guards his seven-stringed sacred instrument.",
      significance: "Climactic sanctuary where the final confrontation is foretold.",
    },
  ]);

  const [magicRules, setMagicRules] = React.useState({
    system: "Totemic Animism & Ancestral Oaths (Tana). Every warrior is bound to a sacred animal totem.",
    laws: "No sorcery can supersede a blood oath spoken in the presence of a griot.",
    prohibitions: "An arrow dipped in white cock feathers renders dark fetishes powerless.",
  });

  const [newCharOpen, setNewCharOpen] = React.useState(false);
  const [newCharName, setNewCharName] = React.useState("");
  const [newCharRole, setNewCharRole] = React.useState<BibleCharacterUI["role"]>("SUPPORTING");
  const [newCharDesc, setNewCharDesc] = React.useState("");
  const [newCharMotivation, setNewCharMotivation] = React.useState("");

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;

    const created: BibleCharacterUI = {
      id: `c-${Date.now()}`,
      name: newCharName.trim(),
      role: newCharRole,
      description: newCharDesc.trim(),
      motivation: newCharMotivation.trim(),
      status: "ALIVE",
      allies: [],
      enemies: [],
    };

    setCharacters((prev) => [created, ...prev]);
    setNewCharName("");
    setNewCharDesc("");
    setNewCharMotivation("");
    setNewCharOpen(false);
    toast.success(`Character "${created.name}" added to Story Bible!`);
  };

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-600/30 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Header */}
        <section className="pt-10 pb-8 border-b border-white/5 bg-gradient-to-b from-violet-950/40 via-zinc-950 to-zinc-950">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/author"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                  Novel Continuity Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Story Bible: Sundiata Lion of Mali
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Persistent world lore, character dossiers, magic rules, and continuity graphs powering both human authorship and the AI pipeline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/author/studio-editor">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl px-5 h-10 shadow-lg shadow-violet-600/30 flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Open Studio Editor
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="border-b border-white/10 bg-zinc-950/80 sticky top-16 z-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center gap-4 overflow-x-auto py-2">
            {[
              { id: "characters", label: "Characters", count: characters.length, icon: Users },
              { id: "locations", label: "Locations", count: locations.length, icon: MapPin },
              { id: "rules", label: "Lore & World Rules", count: 3, icon: Shield },
              { id: "timeline", label: "Timeline & Plot Arcs", count: 4, icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-zinc-300">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
          {activeTab === "characters" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search character names, roles, motivations..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <Button
                  onClick={() => setNewCharOpen(!newCharOpen)}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold gap-1.5 self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Character
                </Button>
              </div>

              {/* Add Character Inline Drawer / Box */}
              {newCharOpen && (
                <form
                  onSubmit={handleAddCharacter}
                  className="p-5 rounded-3xl bg-zinc-950 border border-violet-500/40 space-y-4 shadow-xl"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    New Character Lore Entry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-400 font-medium">Character Name</label>
                      <input
                        type="text"
                        value={newCharName}
                        onChange={(e) => setNewCharName(e.target.value)}
                        placeholder="e.g. Manding Bory"
                        required
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-400 font-medium">Narrative Role</label>
                      <select
                        value={newCharRole}
                        onChange={(e) => setNewCharRole(e.target.value as BibleCharacterUI["role"])}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="PROTAGONIST">Protagonist</option>
                        <option value="ANTAGONIST">Antagonist</option>
                        <option value="SUPPORTING">Supporting</option>
                        <option value="MINOR">Minor</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-zinc-400 font-medium">Description & Backstory</label>
                      <textarea
                        rows={2}
                        value={newCharDesc}
                        onChange={(e) => setNewCharDesc(e.target.value)}
                        placeholder="Key physical traits, clan lineage, powers..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-zinc-400 font-medium">Core Motivation / Dramatic Want</label>
                      <input
                        type="text"
                        value={newCharMotivation}
                        onChange={(e) => setNewCharMotivation(e.target.value)}
                        placeholder="What drives their decisions across the novel?"
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewCharOpen(false)}
                      className="text-xs text-zinc-400 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
                    >
                      Save to Bible
                    </Button>
                  </div>
                </form>
              )}

              {/* Characters Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCharacters.map((char) => (
                  <div
                    key={char.id}
                    className="p-5 rounded-3xl bg-zinc-950 border border-white/10 hover:border-violet-500/40 transition-all space-y-3 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            char.role === "PROTAGONIST"
                              ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                              : char.role === "ANTAGONIST"
                              ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                              : "bg-violet-950/80 text-violet-300 border-violet-500/40"
                          )}
                        >
                          {char.role}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {char.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{char.name}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {char.description}
                      </p>

                      <div className="pt-2 border-t border-white/5 space-y-1 text-[11px]">
                        <div>
                          <strong className="text-zinc-300">Motivation: </strong>
                          <span className="text-zinc-400">{char.motivation}</span>
                        </div>
                        {char.allies.length > 0 && (
                          <div>
                            <strong className="text-emerald-400">Allies: </strong>
                            <span className="text-zinc-400">{char.allies.join(", ")}</span>
                          </div>
                        )}
                        {char.enemies.length > 0 && (
                          <div>
                            <strong className="text-rose-400">Enemies: </strong>
                            <span className="text-zinc-400">{char.enemies.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "locations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {locations.map((loc) => (
                <div key={loc.id} className="p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      {loc.name}
                    </h3>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">{loc.type}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{loc.description}</p>
                  <p className="text-xs text-violet-300 pt-1">
                    <strong>Significance: </strong>{loc.significance}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "rules" && (
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-violet-400">
                  Magic & Worldbuilding Laws
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  These rules are strictly enforced by the Continuity Agent during chapter drafting.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="font-bold text-white">Power System Rules:</span>
                  <p className="text-zinc-300">{magicRules.system}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="font-bold text-white">Inviolable World Laws:</span>
                  <p className="text-zinc-300">{magicRules.laws}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="font-bold text-white">Prohibitions & Vulnerabilities:</span>
                  <p className="text-zinc-300">{magicRules.prohibitions}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-violet-400">
                Plot Arcs & Timeline Progression
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Arc I: The Prophecy & The Iron Bow</span>
                    <p className="text-zinc-400 text-[11px]">Chapters 1–5 • Completed & Published</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Arc II: The Gathering Armies</span>
                    <p className="text-zinc-400 text-[11px]">Chapters 6–15 • In Production</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-500/30">
                    Drafting
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
