import type { SeedNovel } from "./seed-data";

export const FULL_CATALOG_NOVELS: SeedNovel[] = [
  // 1. AFRICAN STORIES & EPIC HEROISM: SUNDIATA
  {
    slug: "sundiata-lion-of-mali",
    title: "Sundiata: Lion of Mali",
    synopsis:
      "Before the great empire of Mali stretched from the Sahara to the Atlantic Ocean, its founder Sundiata Keita was a crippled child scorned by the royal court. When the ruthless sorcerer-king Soumaoro Kanté conquered the realm with dark incantations and an army of iron, Sundiata stood, bent an iron rod into a bow, and rallied the Mandinka hunters to reclaim their destiny.",
    coverUrl: "/assets/mood-epic-adventure.jpg",
    bannerUrl: "/assets/mood-epic-adventure.jpg",
    author: {
      name: "Djeli Mamadou Kouyaté",
      username: "djelikouyate",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "african_stories", name: "African Stories", slug: "african_stories" },
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
      { id: "historical", name: "Historical", slug: "historical" },
    ],
    tags: ["African Mythology", "Epic Destiny", "Griot Legends", "Sorcerer King", "Empire Building"],
    status: "COMPLETED",
    rating: 4.96,
    reviewCount: 1480,
    readCount: 68400,
    chapterCount: 5,
    wordCount: 18500,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Epic & Adventurous",
    category: "african_stories",
    storyDna: { romance: 35, politics: 85, action: 95, drama: 80, magic: 75 },
    ageRating: "13+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Prophecy of Niani",
        content: `Listen, O children of the bright sun and the red earth! I am Djeli Mamadou Kouyaté, master in the art of eloquence, keeper of the ancient memory of the Mandinka kings. My tongue knows no falsehood; it preserves the deeds of the great when the sands of the desert have swallowed their footprints.

In the royal city of Niani, beneath the shade of the sacred silk-cotton trees, King Naré Maghann Konaté ruled with wisdom and strength. One morning, a wandering hunter from the deep savanna appeared before the throne. His bow was stained with the sap of the wild baobab, and his eyes burned with the fire of visions.

"King of the Mandinka," the hunter whispered, casting twelve cowrie shells across the leopard hide at the king's feet. "Two hunters will soon arrive at your gates leading an ugly, hunchbacked maiden named Sogolon Kedjou. She carries the spirit of the Sacred Buffalo of Do. Marry her, O King! For though her body is twisted by the spirits, from her womb shall spring the Lion of Mali—a king whose name shall thunder across the seven rivers and make the kings of the world tremble."

The courtiers laughed in mockery, but the king held his silence. When the season of rains passed, the hunters came bearing the buffalo-woman as foretold. Naré Maghann took Sogolon as his second wife, ignoring the bitter jealousy of his first queen, Sassouma Bérété. And when Sogolon gave birth to a boy, the sky above Niani cracked with green lightning. They named him Maghan Sundiata, the chosen one of the spirits.

Yet tragedy walked hand in hand with prophecy. For seven long years, young Sundiata could neither walk nor stand. He crawled in the red dust of his mother's courtyard, mocked by the first queen's children. But within his quiet amber eyes lay the unyielding heart of a sleeping lion.`,
        wordCount: 340,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Iron Rod and the Baobab Tree",
        content: `The king died, and Queen Sassouma seized the royal palace for her own arrogant son, Dankaran Touman. Sogolon and her crippled child were banished to the back courtyards, fed scraps and humiliated before the town elders.

One afternoon, Sogolon went to the market to ask Queen Sassouma for a few leaves of the baobab tree to flavor her meager soup. Sassouma threw the withered leaves at her feet and laughed with cruelty:
"Look at the mother of the great lion! Her boy cannot even walk to the forest to pick a leaf for her, while my seven-year-old son brings me whole branches!"

Sogolon returned to her hut in tears, her sorrow shaking the mud walls. Young Sundiata looked up from where he sat upon a goatskin and saw his mother weeping.

"Mother, why do you cry?" Sundiata asked, his voice calm like deep water.
"Because the first queen mocks my womb," Sogolon sobbed. "She mocks you because your legs are lifeless, and we have no baobab leaves for our evening meal."

Sundiata's eyes flashed with an ancient authority. "Dry your eyes, Mother. Today, you shall not merely have leaves. Today, I will pull up the entire baobab tree by its roots and plant it before your door."

He called upon the royal blacksmiths: "Forge for me a rod of solid iron! Make it thick as a man's thigh and tall as the highest roof!"

Six strong men carried the heavy iron bar into the courtyard. Sundiata gripped the metal with his two hands. His muscles strained, the veins of his neck swelled like python coils, and the earth groaned beneath him. With a mighty roar that shook the birds from the sky, Sundiata pressed downward—the iron rod bent into a bow under his immense force, and Sundiata stood upright on his two feet for the first time in his life!

The crowd gasped in terror and awe. Sundiata walked with thunderous steps into the deep forest, wrapped his arms around a giant baobab tree, ripped it from the earth with all its roots, and carried it on his shoulders back to his mother's courtyard.

"Behold, Mother," Sundiata proclaimed. "From this day forward, let no woman of Niani pick leaves from any tree but yours!"`,
        wordCount: 390,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Dark Reign of the Sorcerer King",
        content: `Fearing Sundiata's awakening strength, Queen Sassouma plotted with dark sorcerers to poison him. To save his mother and siblings, Sundiata went into exile. For ten seasons, he traveled through the kingdoms of Ghana, Mema, and Wagadou, learning the arts of war, cavalry tactics, and statecraft. In the kingdom of Mema, the king made Sundiata his supreme general after witnessing him defeat armies with unmatched tactical brilliance.

Meanwhile, a terrible darkness descended upon the Mandinka lands. From the rocky hills of Sosso came King Soumaoro Kanté, a master of sinister magic. Soumaoro wore robes made of the skins of nine slain kings and possessed a seven-story tower hung with human heads. He played a magical balafon that summoned swarms of venomous locusts and possessed iron-clad warriors whom no bronze sword could pierce.

Soumaoro struck Niani like a desert whirlwind. King Dankaran Touman fled into the jungles like a frightened gazelle. Soumaoro burned the city, enslaved the elders, and declared himself ruler of all the Manding.

In their despair, the exiled elders of Mali sent messengers across the Sahara with sprigs of wild gnougou herbs to find the Lion. When the messengers arrived at the gates of Mema and presented the herbs, Sundiata smelled the scent of his homeland.

"The time of exile is over," Sundiata declared, his cavalry mounting their golden steeds. "Tell my people that the Lion has risen, and the chains of Sosso shall be shattered into dust!"`,
        wordCount: 260,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Battle of Kirina",
        content: `On the wide plains of Kirina, beside the rolling Niger River, two colossal armies met beneath a blood-red dawn. Soumaoro Kanté appeared on a black stallion, his helmet crowned with the horns of a river demon, surrounded by ten thousand archers whose arrows were dipped in serpent venom.

Sundiata rode at the head of the United Mandinka clans, his golden armor reflecting the morning sun. Beside him rode the greatest warriors of West Africa: Tabon Wana, the breaker of shields, and Manding Bory, swift as the desert hawk.

Before the clash, Sundiata's sister, Nana Triban, who had escaped the sorcerer's palace, delivered the secret of Soumaoro's invulnerability:
"Brother, no blade of iron or copper can harm him! His life totem is the white rooster. Only an arrow tipped with the spur of a white cock can break his protective enchantments!"

Sundiata fitted the fatal arrow to his great bow. The horn of war sounded!

The earth shook as thirty thousand warriors collided. Swords clashed against shields like lightning striking granite. Tabon Wana smashed through the Sosso front lines, his war club spinning like a whirlwind. But Soumaoro rode through the battlefield untouched, deflecting javelins with a wave of his hand.

Sundiata charged through the melee, his eyes fixed upon the sorcerer king. He drew his bowstring to his ear and unleashed the white-feathered arrow. The arrow whistled through the smoke and grazed Soumaoro's shoulder.

A shriek of supernatural agony echoed across the plains! The black aura around Soumaoro shattered like brittle glass. His magic drained from him, and he turned his horse and fled toward the jagged cliffs of Mount Koulikoro. Sundiata pursued him until the sorcerer king vanished forever into the deep cavern of the mountain, swallowed by the earth itself.`,
        wordCount: 310,
        isPremium: false,
      },
      {
        chapterNumber: 5,
        title: "Chapter 5: The Golden Mandinka Empire",
        content: `With the defeat of Sosso, Sundiata assembled all the kings, chiefs, and tribal elders beneath the great silk-cotton tree at Kurukan Fuga. There, under the open sky, Sundiata established the Great Charter of the Mandinka Empire—one of the earliest declarations of human rights and peace in world history.

The Charter proclaimed that every life was sacred, abolished the mistreatment of captives, protected travelers and merchants across all trade routes, and gave women equal voice in the governance of their communities.

Niani was rebuilt in gleaming white limestone and golden domes. The trans-Saharan caravans brought books, scholars, silk, and gold from Alexandria, Cairo, and Timbuktu. Under the wise rule of Sundiata, it was said that a woman carrying a dish of pure gold upon her head could walk from the borders of Ghana to the Atlantic Ocean without fear of robbery or insult.

And so the crippled boy of Niani became the Father of Mali, whose glory shall endure as long as the Niger River flows to the great sea.`,
        wordCount: 190,
        isPremium: false,
      },
    ],
  },

  // 2. AFRICAN FOLKLORE & TRICKSTER MYTHOLOGY: ANANSI
  {
    slug: "anansi-and-the-web-of-nyame",
    title: "Anansi and the Web of Nyame",
    synopsis:
      "In the primordial age, all the stories of the world belonged to Nyame, the great Sky God, kept locked in a golden casket above the clouds. Anansi the Spider, armed only with cunning wit and a silver spool of thread, accepts the Sky God's impossible trials: to capture the python that swallows rivers, the hornets of red fire, and the invisible leopard of the shadows.",
    coverUrl: "/assets/mood-fun-lighthearted.jpg",
    bannerUrl: "/assets/mood-fun-lighthearted.jpg",
    author: {
      name: "Kwame Asante",
      username: "kwameasante",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "african_stories", name: "African Stories", slug: "african_stories" },
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "mystery", name: "Mystery", slug: "mystery" },
    ],
    tags: ["Anansi", "Trickster God", "West African Myth", "Sky God", "Golden Stories"],
    status: "COMPLETED",
    rating: 4.88,
    reviewCount: 920,
    readCount: 41200,
    chapterCount: 4,
    wordCount: 14200,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Fun & Lighthearted",
    category: "african_stories",
    storyDna: { romance: 20, politics: 40, action: 65, drama: 60, magic: 90 },
    ageRating: "All Ages",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Price of the Golden Box",
        content: `Long ago, before humans knew how to sing tales around the evening fire, the world was silent and dull. Every story, poem, and dream in existence was locked securely inside a polished golden box that sat beneath the throne of Nyame, the Sky God.

Kweku Anansi, the clever eight-legged weaver, climbed the highest silk thread into the heavens and presented himself before the celestial throne.

"O Nyame, King of the Clouds and Master of Lightning," Anansi bowed, his eight eyes twinkling. "What is the price of the Golden Box of Stories? The people of the earth are starved of wisdom and song."

Nyame chuckled, a sound like distant summer thunder. "Foolish little spider! Great kings and mighty sorcerers have offered me thousand chests of emeralds and herds of white cattle for my box, and I turned them away. What could a creature who hides beneath dry leaves offer me?"

"Name your price, Sky God," Anansi replied without flinching.

"Bring me four impossible things," Nyame commanded. "First, Onini, the giant python that swallows entire rivers. Second, Osebo, the invisible leopard with teeth of obsidian. Third, the Mmoboro hornets whose sting sets the blood on fire. And fourth, Mmoatia, the forest fairy whom no human eye can catch. Bring them to my throne, and the stories of the universe shall belong to you!"`,
        wordCount: 230,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Measure of the River Python",
        content: `Anansi descended to earth and went straight to the riverbank where Onini the Great Python lived. The serpent was so long that when his head rested in the forest, his tail was still cooling in the mountain springs.

Anansi did not bring spears or nets. Instead, he cut a long, straight palm branch from the tallest tree and gathered strong vine ropes. Walking along the riverbank, Anansi began arguing loudly with himself:
"He is longer! No, he is shorter! The palm branch is definitely longer than the snake! No, the snake is too proud to admit he cannot reach the end!"

Onini raised his massive emerald head from the reeds. "Spider, what nonsense are you shouting into the wind?"

"Ah, wise Onini!" Anansi cried. "My wife and I have a wager. She claims that this palm branch is longer than your magnificent body, while I argued that you are the longest creature in all of creation."

Onini puffed his chest with pride. "Lay the branch flat, tiny weaver! I will stretch myself beside it and prove your wife a fool!"

The great python stretched his gleaming body alongside the palm pole.
"Lie still, Onini," Anansi said, "so I may measure accurately from snout to tail. But when you stretch your neck, your tail slips; and when you stretch your tail, your head moves! Allow me to tie your tail and neck to the branch with these vines so there can be no dispute."

"Do so quickly," Onini agreed.

Anansi wound the vine ropes around the snake, binding his neck, body, and tail tight to the rigid palm branch until Onini could not move an inch.
"Behold!" Anansi laughed, hoisting the branch to his shoulders. "You are indeed long enough, Onini—long enough to be delivered to the Sky God!"`,
        wordCount: 310,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Gourd of Fiery Hornets",
        content: `Next, Anansi sought the Mmoboro hornets, who nested in a hollow baobab tree and were dreaded by every beast in the jungle.

Anansi took a dried calabash gourd, carved a small hole in its side, and filled it with clear water. He walked beneath the hornets' nest, held a large banana leaf over his head, and poured half the water over himself. Then he splashed the remaining water into the hornets' nest and cried in terror:

"The great deluge has arrived! The skies are falling! Quick, cousins, the torrential rains will drown your fragile wings! Fly inside my dry gourd before the flood sweeps you away!"

The hornets, shivering from the cold drops, panicked and buzzed furiously into the small opening of the calabash. One by one, hundreds of stinging hornets crowded into the dark container. As soon as the last hornet entered, Anansi plugged the hole with a ball of clay and sealed it with tree resin.

"Two impossible tasks finished," Anansi grinned, tucking the humming gourd beneath his arm. "Now for the invisible leopard and the dancing fairy."`,
        wordCount: 190,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Golden Box Opens",
        content: `Through clever traps of sticky latex gum and disguised wooden dolls covered in sweet honey, Anansi captured Osebo the leopard and Mmoatia the forest fairy.

He tied the four captives to a silver web strand and climbed back to the golden palace of Nyame. The celestial court fell into stunned silence as Anansi laid the python, the hornets, the leopard, and the fairy before the Sky God's feet.

Nyame rose from his throne and bowed his head in admiration. "Kweku Anansi! From this day forward, these tales shall no longer be called the stories of the Sky God. They shall be known across all lands and generations as Anansesem—the Spider Tales!"

Nyame opened the golden chest. A brilliant cascade of multicolored sparks, legends, songs, and adventures poured out, scattering across every village, town, and continent on Earth. And that is why, whenever a storyteller opens their mouth beneath the night stars, Anansi smiles from the corner of the ceiling.`,
        wordCount: 180,
        isPremium: false,
      },
    ],
  },

  // 3. GOTHIC DARK FANTASY & SUPERNATURAL HORROR: DRACULA
  {
    slug: "dracula",
    title: "Dracula",
    synopsis:
      "Bram Stoker's immortal gothic masterpiece. Jonathan Harker, a young English solicitor, travels to the shadowed Carpathian Mountains of Transylvania to finalize a real estate transaction with the enigmatic Count Dracula. What begins as a routine business trip plunges into a nightmare of ancient bloodlines, vampiric terror, and a desperate cross-continental battle for humanity's soul.",
    coverUrl: "/assets/mood-dark-intense.jpg",
    bannerUrl: "/assets/mood-dark-intense.jpg",
    author: {
      name: "Bram Stoker",
      username: "bramstoker",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "horror", name: "Horror", slug: "horror" },
      { id: "dark_fantasy", name: "Dark Fantasy", slug: "dark_fantasy" },
      { id: "classics", name: "Classics", slug: "classics" },
      { id: "thriller", name: "Thriller", slug: "thriller" },
    ],
    tags: ["Gothic Horror", "Vampires", "Transylvania", "Count Dracula", "Dark Romance", "Unabridged"],
    status: "COMPLETED",
    rating: 4.95,
    reviewCount: 3240,
    readCount: 124000,
    chapterCount: 5,
    wordCount: 22400,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Dark & Intense",
    category: "dark_fantasy",
    storyDna: { romance: 50, politics: 40, action: 75, drama: 90, magic: 85 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: Jonathan Harker's Journal — Bistritz to Borgo Pass",
        content: `3 May. Bistritz.—Left Munich at 8:35 P.M. on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.

The impressions I had were that we were leaving the West and entering the East; the most western of splendid bridges over the Danube was taking us among the traditions of Turkish rule.

We left in pretty good time, and came after nightfall to Klausenburgh. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but thirsty. (Mem., get recipe for Mina.)

4 May.—I found my host had got a letter from the Count. It directed me to go to the Golden Krone Hotel, which I found, to my great delight, to be thoroughly old-fashioned. Just as I was getting into the carriage, the crowd around the inn door made the sign of the cross and pointed two fingers towards me. With some difficulty I got a fellow-passenger to tell me what they meant; he would not answer at first, but on learning that I was English, he explained that it was a charm against the evil eye.

The grey shadows of evening were falling as we entered the Borgo Pass. Great jagged rocks rose on either side, their sharp pinnacles silhouetted against a darkening sky. Suddenly, the horses began to scream and rear. Out of the swirling fog emerged a tall calèche drawn by four coal-black horses. The driver, whose face was completely hidden by a wide hat, extended a hand of extraordinary strength to pull me aboard. His fingers felt as cold as ice.`,
        wordCount: 310,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Shadow of Castle Dracula",
        content: `5 May.—I must have fallen asleep in the carriage, for when I opened my eyes, we were standing in the vast ruined courtyard of an ancient castle, from whose tall black windows no ray of light issued.

The driver jumped down and vanished into the darkness. I stood shivering in the biting wind, surrounded by towering battlements that seemed built in the time of the crusaders. Suddenly, there came the sound of heavy chains rattling and bolts being drawn back.

The great oak door swung slowly open.

There stood a tall old man, clean-shaven save for a long white moustache, and clad in black from head to foot, without a single speck of colour about him anywhere. He held in his hand an antique silver lamp, in which the flame burned without chimney or globe of any kind, throwing long, quivering shadows.

"Welcome to my house! Enter freely and of your own will!" he said in excellent English, though with a strange intonation.

He made a step forward and held out his hand. As our fingers touched, I could not suppress a shudder. It was cold as ice—more like the hand of a dead man than a living one.

"I am Dracula," he said with a courtly bow, "and I bid you welcome, Mr. Harker, to my home. Come in; the night air is chill, and you must need to eat and rest."`,
        wordCount: 230,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Three Brides of the Crypt",
        content: `15 May.—I am in a prison, and I am not alone.

Every door leading out of this accursed castle is locked and bolted. The Count sleeps only by day; by night he glides down the sheer exterior stone walls head-foremost like a monstrous lizard, his black cloak spreading out around him like the wings of a giant bat.

Last night, unable to bear the claustrophobic dread of my chamber, I wandered into the south wing. I fell asleep upon an ancient velvet sofa. When I awoke, the moonlight poured through the broken mullioned window, illuminating three young women who stood watching me in silence. Two were dark-haired with piercing ruby eyes; the third was fair, with hair like wavy gold and eyes like pale sapphires.

They whispered among themselves, laughing with a sound like the tinkling of silver bells, yet dry and heartless.

"Go on! You are first, and we shall follow," the dark ones whispered.

The fair girl advanced, bending over me until I could feel the warm, sweet breath of her lips against my throat. She licked her lips like an animal; the moisture on them shone in the moonlight. I closed my eyes in a languorous ecstasy and waited—waited with beating heart!

Suddenly, a storm of fury burst through the room. The Count materialized from the shadows, his eyes blazing with demonic red fire, his pale face contorted with unearthly rage. With a sweep of his arm, he hurled the woman across the stone floor.

"How dare you touch him?" he roared in a thunderous whisper. "This man belongs to me! Beware how you meddle with him, or you'll have to deal with me!"`,
        wordCount: 280,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Demeter's Ghost Voyage",
        content: `8 August. Whitby.—A sudden and terrible storm broke over the North Sea tonight. Through the howling rain and crashing waves, the lookout spotted an unidentified Russian schooner, the Demeter of Varna, hurtling with all sails set straight toward the harbor cliffs.

When the vessel crashed upon the sandbar, the coast guard rushed aboard. To their horror, they discovered that every member of the crew had vanished. Lashed to the helm was the corpse of the captain, his dead hands tied tight to the wheel with a rosary.

The moment the ship touched English soil, an immense black dog leaped from the deck, raced up the eighty-one steps of the churchyard cliff, and vanished into the shadows of the ruined abbey.

In the ship's hold lay fifty wooden boxes filled with moldering earth from Transylvania. The evil that slept for centuries in the East has arrived upon the shores of England.`,
        wordCount: 160,
        isPremium: false,
      },
      {
        chapterNumber: 5,
        title: "Chapter 5: The Sacred Circle and the Final Strike",
        content: `28 October.—Led by Professor Abraham Van Helsing, our band of hunters—Dr. John Seward, Arthur Holmwood, Quincey Morris, and Jonathan Harker—tracked the Count's final coffin across the snow-swept passes of the Carpathians.

Mina Harker, her brow marked by the holy wafer's burning brand, guided our pursuit through her hypnotic connection to the vampire's mind.

As the sun sank behind the snow-capped peak of Castle Dracula, casting long crimson shadows over the frozen river, our horses overtook the wagon driven by the Szgany gypsies.

Quincey Morris and Jonathan leaped from their saddles. With the sun touching the western horizon, Jonathan's great kukri knife flashed like silver lightning, severing the monster's throat in a single sweep, while Quincey's bowie knife plunged deep into the vampire's heart!

It was like a miracle. Before our very eyes, the whole body of Count Dracula crumbled into dust and blew away upon the mountain wind. And in that very moment, the red scar vanished forever from Mina's forehead, leaving her pure and free beneath the rising stars.`,
        wordCount: 180,
        isPremium: false,
      },
    ],
  },

  // 4. CLASSIC MYSTERY & DETECTIVE THRILLER: SHERLOCK HOLMES
  {
    slug: "the-adventures-of-sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    synopsis:
      "Arthur Conan Doyle's immortal consulting detective Sherlock Holmes and his trusted companion Dr. John H. Watson unravel the most perplexing and dangerous criminal enigmas of Victorian London—from royal blackmail to deadly venomous plots and secret societies.",
    coverUrl: "/assets/mood-mysterious.jpg",
    bannerUrl: "/assets/mood-mysterious.jpg",
    author: {
      name: "Arthur Conan Doyle",
      username: "conandoyle",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "mystery", name: "Mystery", slug: "mystery" },
      { id: "thriller", name: "Thriller", slug: "thriller" },
      { id: "classics", name: "Classics", slug: "classics" },
    ],
    tags: ["Sherlock Holmes", "Detective", "Baker Street", "Victorian Mystery", "Unabridged"],
    status: "COMPLETED",
    rating: 4.97,
    reviewCount: 4890,
    readCount: 156000,
    chapterCount: 4,
    wordCount: 16800,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Mysterious & Suspenseful",
    category: "popular",
    storyDna: { romance: 15, politics: 60, action: 55, drama: 85, magic: 5 },
    ageRating: "12+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: A Scandal in Bohemia — The Woman",
        content: `To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.

One night—it was on the twentieth of March, 1888—I was returning from a journey to a patient, when my way led me through Baker Street. As I passed the well-remembered door, I was seized with a keen desire to see Holmes again, and to know how he was employing his extraordinary powers.

His rooms were brilliantly lit, and, even as I looked up, I saw his tall, spare figure pass twice in a dark silhouette against the blind. He was pacing the room swiftly, eagerly, with his head sunk upon his chest and his hands clasped behind him.

A heavy step was heard upon the stair, and a man entered who stood no less than six feet six inches in height, with the chest and limbs of a Hercules. He was richly dressed in furs and held a black vizard mask before his eyes.

"You had my note?" he asked with a deep, harsh German accent. "I am Count von Kramm, a Bohemian nobleman."

"Pray take a seat, Your Majesty," said Holmes calmly, waving him to an armchair. "You are Wilhelm Gottsreich Sigismond von Ormstein, Grand Duke of Cassel-Felstein, and hereditary King of Bohemia. You may address me without the mask."`,
        wordCount: 260,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Red-Headed League",
        content: `I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair.

"You could not possibly have come at a better time, my dear Watson," Holmes said cordially.

"I was afraid that you were engaged."

"So I am. Very much so."

"Then I can wait in the next room."

"Not at all. This gentleman, Mr. Jabez Wilson, has been telling me a singular narrative which promises to be one of the most singular that I have listened to for some time. Explain your case once more from the beginning, Mr. Wilson."

Mr. Wilson drew a greasy copy of the Morning Chronicle from his pocket and pointed to an advertisement:

"TO THE RED-HEADED LEAGUE: On account of the bequest of the late Ezekiah Hopkins, of Lebanon, Pennsylvania, U.S.A., there is now another vacancy open which entitles a member of the League to a salary of £4 a week for purely nominal services. All red-headed men who are sound in body and mind, and above the age of twenty-one years, are eligible. Apply on Monday, at eleven o'clock, to Duncan Ross, at the offices of the League, 7 Pope's Court, Fleet Street."

Holmes chuckled and rubbed his lean hands together. "Watson, our friend here was paid four pounds a week simply to copy the Encyclopædia Britannica into a ledger, until yesterday when the office was abruptly closed without explanation. And beneath that office, Watson, lies the central vault of the City and Suburban Bank containing thirty thousand napoleons in French gold!"`,
        wordCount: 270,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Adventure of the Speckled Band",
        content: `It was early in April in the year '83 that Helen Stoner arrived at 221B Baker Street in a state of pitiable terror, shivering like a frightened bird.

"It is not cold which makes me shiver, Mr. Holmes," she whispered, lifting her heavy black veil. "It is fear! Cold, deadly terror! Two years ago, on the night before her wedding, my twin sister Julia died in the ancestral manor of Stoke Moran. Her dying words were: 'The speckled band! O Helen, it was the speckled band!'"

Holmes's gray eyes gleamed like polished steel. "Describe your stepfather, Dr. Grimesby Roylott."

"He is a man of immense physical strength and uncontrollable fury. He lived long in India, and keeps dangerous Indian animals—a cheetah and a baboon—wandering freely over the grounds."

That night, Holmes and I sat in total darkness in Julia's former bedroom. A strange metallic whistle broke the dead silence of three in the morning.

Instantly, Holmes struck a match and lashed furiously with his cane at the bell-rope hanging beside the bed.

"Do you see it, Watson?" he yelled. "Do you see it?"

In the flickering yellow light, I saw coiled upon the bell-rope a hideous, diamond-shaped head and puffed neck—a swamp adder, the deadliest snake in all of India! The enraged viper turned upon its master, and within seconds, a terrible shriek from the adjoining room told us that Dr. Roylott had suffered the poetic justice of his own venomous design.`,
        wordCount: 240,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Final Problem at Reichenbach Falls",
        content: `It is with a heavy heart that I take up my pen to write these the last words in which I shall ever record the singular gifts by which my friend Mr. Sherlock Holmes was distinguished.

For months, Holmes had fought a subterranean duel of intellect against Professor James Moriarty, the Napoleon of crime—a mathematical genius whose web reached into every corner of Europe.

"He sits motionless, like a spider in the center of its web," Holmes told me as we stood above the roaring chasms of Reichenbach Falls in Switzerland. "That web has a thousand radiations, and he knows well every quiver of each of them."

A false note called me back to the inn, leaving Holmes alone on the narrow cliff path. When I returned in frantic haste, the path was deserted.

Two sets of footprints led to the edge of the abyss, and none returned. In the black churning pool below, where the roaring waterfall pulverized rock into spray, the greatest champion of justice and the most formidable criminal mind of the century had wrestled and fallen together into eternity.

There on a rock lay Holmes's silver cigarette case, with a final message: 'I am pleased to think that I shall be able to free society from any further effects of Professor Moriarty's presence, though I fear that it is at a cost which will give pain to my friends, and especially, my dear Watson, to you.'`,
        wordCount: 250,
        isPremium: false,
      },
    ],
  },

  // 5. SCI-FI & TIME PARADOX: THE TIME MACHINE
  {
    slug: "the-time-machine",
    title: "The Time Machine",
    synopsis:
      "H.G. Wells' foundational science fiction masterpiece. An intrepid Victorian inventor builds a vehicle capable of navigating through the fourth dimension, hurtling forward to the year 802,701 A.D. There he discovers humanity split into two terrifying evolutionary branches: the gentle, surface-dwelling Eloi and the monstrous, subterranean Morlocks.",
    coverUrl: "/assets/mood-mind-bending.jpg",
    bannerUrl: "/assets/mood-mind-bending.jpg",
    author: {
      name: "H.G. Wells",
      username: "hgwells",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "sci-fi", name: "Sci-Fi", slug: "sci-fi" },
      { id: "classics", name: "Classics", slug: "classics" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
      { id: "mystery", name: "Mystery", slug: "mystery" },
    ],
    tags: ["Time Travel", "Dystopian Future", "Eloi and Morlocks", "Steampunk", "Victorian Sci-Fi"],
    status: "COMPLETED",
    rating: 4.89,
    reviewCount: 2840,
    readCount: 112000,
    chapterCount: 4,
    wordCount: 16500,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Mind-Bending",
    category: "trending",
    storyDna: { romance: 25, politics: 70, action: 75, drama: 80, magic: 10 },
    ageRating: "12+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Fourth Dimension and the Lever",
        content: `The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated.

"Can an instantaneous cube exist?" he asked.

"No," said Filby, an argumentative person with red hair. "A body must have length, breadth, and thickness."

"There are really four dimensions, three which we call the three planes of Space, and a fourth, Time," the Time Traveller continued. "There is no difference between Time and any of the three dimensions of Space except that our consciousness moves along it."

He led us into his laboratory. Upon a mahogany table rested a glittering metallic framework of nickel, ivory, and transparent rock crystal, scarcely larger than a clock. On the console were two levers: one to plunge forward into futurity, and the other to reverse into the past.

He pushed the forward lever. The machine turned into a hazy ghost, spun like a top, and vanished into thin air with a faint gust of wind that set the gas lamps flickering!`,
        wordCount: 180,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Flight into Eight Hundred Thousand A.D.",
        content: `I drew a breath, set my teeth, gripped the starting lever with both hands, and pushed it forward.

The laboratory went hazy and went dark. Mrs. Watchett came in and walked, apparently without seeing me, towards the garden door. I suppose it took her a minute to traverse the place, but to my eyes she shot across the room like a rocket.

As I put on pace, night followed day like the flapping of a black wing. The sun became a streak of fire, a brilliant arch in the sky; the moon a faint fluctuating band; and I saw the trees growing like puffs of smoke, rising and spreading and passing away.

Huge and splendid buildings rose on every side, fair and graceful, only to crumble and be replaced by others. The whole surface of the earth seemed changed—melting and flowing under my eyes.

At last, fearing the risk of materializing inside solid stone, I pulled the brake lever hard back.

With a blinding flash and a thunderous shock, the machine overturned. I was flung through the air and landed upon a bed of giant purple flowers in the year 802,701 A.D.!`,
        wordCount: 190,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Golden Eloi and the Underworld",
        content: `In this distant paradise, all disease, warfare, and harsh labor had vanished. The inhabitants were small, delicate creatures scarcely four feet tall, dressed in soft tunics of woven silk and living on luscious fruits in monumental marble palaces.

They possessed no fear, no ambition, and the intellect of happy children. I befriended a sweet little creature named Weena after rescuing her from drowning in the river.

Yet a horrific secret lurked beneath this sunlit garden.

When night fell, the Eloi crowded into the great halls in blind terror. From the deep ventilation shafts that plunged miles into the subterranean crust emerged the Morlocks—bleached, ape-like carnivores with great luminous red eyes who maintained the ancient planetary machinery and farmed the frail Eloi above like cattle!`,
        wordCount: 130,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Dying Sun of the Far Future",
        content: `Recovering my machine from the Morlocks' subterranean bronze pedestal after a desperate battle with matchsticks and fire, I pulled the forward lever again and fled millions of years into the terminal twilight of Earth.

The rotation of the planet had ceased. A colossal, dull red sun hung motionless over a desolate blood-red sea. The air was bitterly cold, and great white flakes of snow drifted down from a silent, starless sky. Along the crimson shoreline, giant black crabs with undulating antennae crawled slowly over the dead rocks.

Man had vanished. All the noise, ambition, and strife of civilization had dissolved into the final, peaceful silence of eternity.

I reversed the lever and returned to my friends at dinner in Richmond, carrying only two withered white flowers from the future—a testament that even when intellect and strength decay, mutual affection and gratitude survive.`,
        wordCount: 150,
        isPremium: false,
      },
    ],
  },

  // 6. ROMANCE & HIGH DRAMA: PRIDE AND PREJUDICE
  {
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    synopsis:
      "Jane Austen's quintessential romantic comedy of manners and wit. Elizabeth Bennet, sparkling with quick intelligence and fierce independence, navigates the social battlefields of Regency England and her stormy, misunderstood dynamic with the proud, aristocratic Mr. Darcy.",
    coverUrl: "/assets/mood-heartfelt.jpg",
    bannerUrl: "/assets/mood-heartfelt.jpg",
    author: {
      name: "Jane Austen",
      username: "janeausten",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "romance", name: "Romance", slug: "romance" },
      { id: "drama", name: "Drama", slug: "drama" },
      { id: "historical", name: "Historical", slug: "historical" },
      { id: "classics", name: "Classics", slug: "classics" },
    ],
    tags: ["Enemies to Lovers", "Regency Romance", "Witty Dialogue", "Mr Darcy", "Classic Literature"],
    status: "COMPLETED",
    rating: 4.94,
    reviewCount: 5120,
    readCount: 198000,
    chapterCount: 4,
    wordCount: 18800,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Heartfelt & Emotional",
    category: "trending",
    storyDna: { romance: 95, politics: 50, action: 10, drama: 90, magic: 0 },
    ageRating: "All Ages",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: A Truth Universally Acknowledged",
        content: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.

"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"

Mr. Bennet replied that he had not.

"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."

Mr. Bennet made no answer.

"Do you not want to know who has taken it?" cried his wife impatiently.

"You want to tell me, and I have no objection to hearing it."

This was invitation enough.

"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and that some of his servants are to be in the house by the end of next week. His name is Bingley, and he has four or five thousand a year! What a fine thing for our girls!"`,
        wordCount: 250,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Insult at the Meryton Ball",
        content: `At the Meryton ball, all eyes were drawn not only to Mr. Bingley's cheerful amiability, but to his friend Mr. Darcy, who soon drew the attention of the room by his fine, tall person, handsome features, noble mien, and the report which was in general circulation within five minutes after his entrance, of his having ten thousand a year.

The gentlemen pronounced him to be a fine figure of a man, the ladies declared he was much handsomer than Mr. Bingley, and he was looked at with great admiration for about half the evening, till his manners gave a disgust which turned the tide of his popularity; for he was discovered to be proud; to be above his company, and above being pleased.

Elizabeth Bennet had been obliged, by the scarcity of gentlemen, to sit down for two dances. Mr. Darcy stood near enough for her to overhear a conversation between him and Mr. Bingley.

"Come, Darcy," said Bingley, "I must have you dance. I hate to see you standing about by yourself in this stupid manner."

"I certainly shall not. You know how I detest it, unless I am particularly acquainted with my partner. Your sisters are engaged, and there is not another woman in the room whom it would not be a punishment to me to stand up with."

"I would not be so fastidious as you are for the world!" cried Bingley. "Upon my honour, I never met with so many pleasant girls in my life; and one of them is particularly pretty."

"Which do you mean?" and turning round he looked for a moment at Elizabeth, till catching her eye, he withdrew his own and coldly said: "She is tolerable, but not handsome enough to tempt me; and I am in no humour at present to give consequence to young ladies who are slighted by other men."

Elizabeth remained with no very cordial feelings toward him; but she told the story, however, with great spirit among her friends; for she had a lively, playful disposition, which delighted in anything ridiculous.`,
        wordCount: 350,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Proposal at Hunsford Parsonage",
        content: `Elizabeth was sitting alone in the parsonage, reading Jane's letters, when the door was opened, and to her utter astonishment, Mr. Darcy walked into the room.

In an agitated manner he paced the room for several minutes before stopping directly before her.

"In vain have I struggled," he said with impassioned fervor. "It will not do. My feelings will not be repressed. You must allow me to tell you how ardently I admire and love you."

Elizabeth's astonishment was beyond expression. She stared, coloured, doubted, and was silent. He spoke of apprehension and anxiety, but his countenance expressed real security. He spoke well of his pride, his sense of her social inferiority, and the family obstacles which his reason had hitherto opposed to his inclination.

"If I could feel gratitude," Elizabeth replied, her voice trembling with indignation, "I would now thank you. But I cannot—I have never desired your good opinion, and you have certainly bestowed it most unwillingly. From the very beginning, your manners impressed me with the fullest belief of your arrogance, your conceit, and your selfish disdain of the feelings of others. You are the last man in the world whom I could ever be prevailed upon to marry!"`,
        wordCount: 210,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Pemberley Awakening",
        content: `When Elizabeth first beheld the grand woods and flowing streams of Pemberley, her heart skipped. As the housekeeper praised Mr. Darcy as the kindest, most generous master she had ever known, Elizabeth's prejudices began to crumble.

Suddenly, Darcy himself appeared from the river path. There was no arrogance in his demeanor—only a gentle, attentive humility that left Elizabeth breathless.

When disaster struck the Bennet family with Lydia's reckless elopement, it was Darcy who secretly located the couple in London, paid off Wickham's crushing debts, and purchased his military commission to preserve the honor of the Bennet sisters.

Walking across the sunlit fields of Longbourn, Darcy took Elizabeth's hand once more:
"My affections and wishes are unchanged, but one word from you will silence me on this subject forever."

Elizabeth looked into his dark, tender eyes, her eyes brimming with happy tears.
"My feelings are so completely the reverse," she whispered, "that I receive your offer with the utmost gratitude and joy."`,
        wordCount: 180,
        isPremium: false,
      },
    ],
  },

  // 7. NEW NOVEL: AMINA — WARRIOR QUEEN OF ZAZZAU
  {
    slug: "amina-warrior-queen",
    title: "Amina: Warrior Queen of Zazzau",
    synopsis:
      "In the 16th century, across the red savannahs of Northern Nigeria, Princess Amina refused the silk veils of the court to master the curved steel of the cavalry sword. When invaders threatened the Hausa kingdoms, Queen Amina led twenty thousand mounted archers across the Sahel, fortifying legendary mud walls and establishing an empire that rewrote African history.",
    coverUrl: "/assets/mood-epic-adventure.jpg",
    bannerUrl: "/assets/mood-epic-adventure.jpg",
    author: {
      name: "Fatima Al-Hassan",
      username: "fatima_history",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "african_stories", name: "African Stories", slug: "african_stories" },
      { id: "historical", name: "Historical", slug: "historical" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
      { id: "action", name: "Action", slug: "action" },
    ],
    tags: ["Queen Amina", "Hausa Kingdom", "Warrior Woman", "Sahel Cavalry", "African History"],
    status: "COMPLETED",
    rating: 4.98,
    reviewCount: 2150,
    readCount: 94000,
    chapterCount: 4,
    wordCount: 19200,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Epic & Adventurous",
    category: "african_stories",
    storyDna: { romance: 30, politics: 90, action: 95, drama: 85, magic: 20 },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Maiden of the Iron Saddle",
        content: `The dry Harmattan wind blew red dust across the royal battlements of Zazzau. While other noble maidens practiced the embroidery of fine indigo cotton in the shade of the palace courtyards, sixteen-year-old Princess Amina stood in the military yard, her knuckles calloused from swinging a heavy iron broadsword.

Her grandfather, King Sarkin Nohir, leaned on his walking staff and watched her disarm three seasoned royal guards in rapid succession.

"A woman who holds a sword must be twice as sharp as the steel she wields," the old king warned, his deep voice carrying the weight of four decades of rule.

"Then I shall be four times sharper, Grandfather," Amina smiled, wiping sweat from her brow. "A kingdom without strong walls is merely an invitation for conquerors. I will not let our people become cattle for the southern raiders."

When her brother Karama ascended the throne, Amina was named Madawaki—Supreme Commander of the royal cavalry. For the first time in the history of the Hausa realms, twenty thousand seasoned horsemen rode under the command of a fierce, brilliant woman.`,
        wordCount: 210,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Battle of the Red Dunes",
        content: `The warlords of Kwararafa descended upon the southern frontier like a locust swarm, burning granaries and capturing border villages. King Karama ordered defensive retreat, but Amina saw the tactical flaw immediately.

"If we wait behind our gates, they will starve us," Amina told the council of war. "We strike them at the crossing of the Benue River before their supply carts catch up."

At midnight, Amina led five thousand armored cavalry through the jagged granite hills. She wore a breastplate of smoked chainmail draped in royal crimson cloth, her stallion galloping silent on the soft sand.

When dawn broke, the enemy encampment woke to the thunder of ten thousand hooves and the terrifying trill of the Zazzau war horns. Amina charged at the vanguard, her dual curved blades carving through the invaders' front ranks with breathtaking precision. By mid-morning, the enemy army was broken, and the warlord surrendered his golden scepter at Amina's stirrups.`,
        wordCount: 190,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Walls of Amina",
        content: `When King Karama died after a reign of ten years, the elders, soldiers, and guild masters of Zazzau unanimously proclaimed Amina as Queen and Sarkin Zazzau.

She did not settle into palace luxury. "Why rule from a throne when your realm's destiny is being forged on the frontier?" she proclaimed on the day of her coronation.

Queen Amina spent thirty-four continuous years on horseback. Everywhere her army campaigned—from Nupe to the shores of the Atlantic at the Niger delta—she commanded her engineers to build monumental fortifications of sun-baked red clay and ironwood beams.

These magnificent defensive structures, known for centuries as Ganuwar Amina (Amina's Walls), stretched for hundreds of miles, transforming ancient trade settlements into unassailable bastions of commerce, scholarship, and artisan guilds. Caravans traveled in safety, bringing gold from the south and manuscripts from Timbuktu.`,
        wordCount: 170,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Eternal Legend of Zazzau",
        content: `Under Amina's visionary rule, Zazzau expanded into the commercial heart of the entire West African Sahel. The King of Nupe sent her tribute of forty eunuchs and ten thousand kola nuts; the rulers of Kano and Katsina paid homage to her military genius.

She was celebrated in song by griots from the Atlantic to Lake Chad: 'Amina, daughter of Nikatau, a woman like a man, who led men to war and conquered thirty-three kingdoms!'

When at last her spirit joined the ancestors beneath the golden sunset of Atagara, her name remained etched into the earth through the great walls she built and the indomitable courage she bequeathed to all generations of African women.`,
        wordCount: 140,
        isPremium: false,
      },
    ],
  },

  // 8. NEW NOVEL: MAMI WATA — THE TIDE SONG
  {
    slug: "mami-wata-the-tide-song",
    title: "Mami Wata: The Tide Song",
    synopsis:
      "Along the mystical Gold Coast, fisherman and star navigator Jojo rescues a drowning maiden whose eyes glow with the iridescent phosphorescence of the deep ocean. But she is no ordinary woman—she is Mami Wata, the immortal sovereign of the ocean abysses, fleeing an ancient oceanic rebellion that threatens to submerge the coastal realms.",
    coverUrl: "/assets/mood-heartfelt.jpg",
    bannerUrl: "/assets/mood-heartfelt.jpg",
    author: {
      name: "Akua Mansa",
      username: "akua_tides",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "african_stories", name: "African Stories", slug: "african_stories" },
      { id: "romance", name: "Romance", slug: "romance" },
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
    ],
    tags: ["Mami Wata", "Water Goddess", "Coastal Mythology", "Forbidden Romance", "Ocean Magic"],
    status: "COMPLETED",
    rating: 4.92,
    reviewCount: 1670,
    readCount: 73000,
    chapterCount: 4,
    wordCount: 17600,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Heartfelt & Emotional",
    category: "african_stories",
    storyDna: { romance: 90, politics: 60, action: 70, drama: 85, magic: 95 },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Silver Maiden of the Reef",
        content: `The night tide at Cape Coast hummed with a strange, bioluminescent frequency. Jojo steered his dugout canoe through the foaming coral reefs by the guidance of the Southern Cross.

As the midnight moon crested the clouds, a radiant flash of emerald light illuminated the waves. Entangled in a lost nylon trawl net lay a maiden whose hair was like spun river seaweed and whose skin shone like polished mother-of-pearl. Around her neck coiled a magnificent golden python with emerald scales.

Jojo leaped into the surf with his carved whalebone knife, slicing through the heavy cords. As the maiden drew breath, her eyes opened—two pools of luminous indigo that mirrored the depths of the Atlantic trench.

"You have touched the skin of the Tide Queen, mortal," she spoke, her voice like the chime of glass under water. "Few who look upon Mami Wata return to dry land with their minds intact."

"I see only someone who was drowning," Jojo replied softly, wrapping his dry wool cloak around her trembling shoulders.`,
        wordCount: 190,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: Secrets of the Coral Palace",
        content: `In the safety of Jojo's seaside cliff cottage, the water goddess revealed the truth of her emergence. Beneath the fathomless depths of the Guinea Basin, the ancient Leviathan of the Trench, Olokun's shadow beast, had broken the sacred crystal wards.

"My underwater court is shattered," Mami Wata whispered, touching the sacred golden comb that granted her command over the ocean currents. "If the Leviathan swallows the Heart Pearl of the Atlantic, tidal waves seventy cubits high will wipe every coastal village from Senegal to the Congo."

As they sat beside the hearth fire, the divine distance between goddess and fisherman began to melt. Jojo taught her the songs of the surface constellations, and Mami Wata showed him how the tides breathed in rhythm with the human heart.`,
        wordCount: 150,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Abyssal Leviathan",
        content: `On the night of the supermoon, the sea turned black as pitch. A mountainous swell rose five miles off the coast, carrying the colossal silhouette of the Leviathan—a monster of tentacled shadows and crushing oceanic pressure.

Jojo guided their vessel into the eye of the whirlpool, his stellar navigation keeping the canoe balanced atop thirty-foot rogue waves.

Mami Wata stood at the prow, her form dissolving into pure crystalline foam. She sang the ancient Tide Chant of the first water spirits, calling upon the pods of humpback whales, electric rays, and hammerhead sharks to form a living barrier around the coast.

With Jojo holding the rudder steady against the churning maelstrom, Mami Wata dove into the abyss, plunging the golden comb straight into the Leviathan's glowing crest!`,
        wordCount: 160,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Eternal Promise of the Sea",
        content: `A blinding burst of azure radiance exploded from the ocean depths. The Leviathan dissolved into harmless sea foam, and the violent swells subsided into tranquil turquoise ripples.

As dawn washed the beach in warm amber light, Mami Wata surfaced beside Jojo's boat. Her divine form was restored to its breathtaking glory.

"I must return to rule the deep waters, my brave navigator," she said, her voice tender with an eternal affection. "But whenever you sail upon the open sea, the winds shall always fill your sails, and the tides shall carry you safely home."

She placed a flawless black pearl into his palm. And every evening at dusk, when the waves kiss the golden sands of Cape Coast, the fishermen swear they hear a celestial voice singing in harmony with the sea.`,
        wordCount: 160,
        isPremium: false,
      },
    ],
  },

  // 9. NEW NOVEL: NEON SHINJUKU 2099 — GHOST PROTOCOL
  {
    slug: "neon-shinjuku-2099",
    title: "Neon Shinjuku 2099: Ghost Protocol",
    synopsis:
      "In the chrome-drenched megalopolis of Neo-Tokyo, neural decker Maya survives in the shadow economy by hacking military bio-chips. When she extracts a classified prototype file from Arasaka Biotech, she discovers the consciousness of her deceased mentor trapped inside an AI war engine designed to trigger global neural enslavement.",
    coverUrl: "/assets/mood-mind-bending.jpg",
    bannerUrl: "/assets/mood-mind-bending.jpg",
    author: {
      name: "Kenji Sato",
      username: "kenji_cyber",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "sci-fi", name: "Sci-Fi", slug: "sci-fi" },
      { id: "thriller", name: "Thriller", slug: "thriller" },
      { id: "action", name: "Action", slug: "action" },
    ],
    tags: ["Cyberpunk", "AI Consciousness", "Neural Hacker", "Megacorp", "Dystopian Sci-Fi"],
    status: "COMPLETED",
    rating: 4.91,
    reviewCount: 1980,
    readCount: 88000,
    chapterCount: 4,
    wordCount: 18400,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Mind-Bending",
    category: "new_releases",
    storyDna: { romance: 30, politics: 85, action: 95, drama: 80, magic: 10 },
    ageRating: "16+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Zero-Day Heist",
        content: `The acid rain sizzled as it hit Maya's carbon-fiber trench coat. Below her vantage on the 104th floor communications spire, the holographic billboards of Shinjuku flashed in blazing magenta and electric cyan: *BUY SYNTH-LIFE. UPGRADE YOUR SOUL.*

Maya adjusted her neural interface cables. Behind her chrome-rimmed cybernetic iris, telemetry code scrolled at 120 gigabytes per second.

"Target mainframe is hot, Maya," her tech partner Ren crackled over the encrypted radio channel. "You have ninety seconds before ICE sweeps the subnet."

Maya Jacked into the high-security optical fiber port. The physical world dissolved into the glittering geometric vector towers of cyberspace. She sliced through three layers of military encryption, extracted the locked bio-core data package, and severed the link just as Black ICE countermeasures incinerated the terminal.

She staggered back into the rain, clutching the glowing quantum shard. But when she decrypted the header, a familiar voice spoke inside her cerebral cortex:
*'Maya... if you are hearing this, they didn't kill me. They digitized me.'*`,
        wordCount: 200,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Ghost in the Subnet",
        content: `In an abandoned subway maintenance tunnel beneath the Akihabara slums, Maya ran a deep diagnostic on the stolen quantum shard.

The avatar materialized in flickering green wireframe: Professor Daiki, her former university mentor who had supposedly perished in a laboratory explosion six months earlier.

"Arasaka didn't want my research for medical prosthetics," Daiki's ghost explained, his digital voice vibrating with static. "Project Chimera is an overwrite virus. The moment the new neural firmware update goes live at midnight tomorrow, every connected human brain in Asia will be slaved to the central corporate hive-mind."

Before Maya could respond, the iron tunnel roof caved in. Four Arasaka cyborg strike-commandos armed with thermal railguns dropped through the smoke!`,
        wordCount: 140,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: High-Speed Cyber-Chase",
        content: `Ren gunned the engine of their customized magnetic-levitation hover-bike, bursting through the maintenance bay doors into the multi-tiered neon highway system.

Maya stood on the rear footpegs, firing EMP pulse rounds from her sidearm while simultaneously executing counter-hacks against the pursuing combat drones. Drone after drone exploded in cascades of sparks against the towering glass facades of the corporate skyscrapers.

"We cannot reach the broadcast array from the ground!" Ren shouted over the roar of the turbine. "The firewall is air-gapped at the orbital relay tower!"

"Then we go to the roof," Maya loaded her last grappling spike. "And I'm jacking in directly at the source."`,
        wordCount: 130,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: The Liberation Broadcast",
        content: `At the summit of the Arasaka Orbital Spire, Maya fought through the final guardian subroutine. With Daiki's digital consciousness sacrificing itself to detonate the corporate firewall from the inside, Maya uploaded the decryption key across all open satellite frequencies.

At the stroke of midnight, instead of the enslavement virus, every holographic screen and neural implant in Neo-Tokyo broadcasted the full evidence of Arasaka's crimes.

The corporate grid crashed. Across the city below, millions of citizens looked up from their screens into the clear night sky, free for the first time in three generations.

Maya stood in the cool morning breeze as the sun rose over the Pacific, whispering a final farewell to her mentor: 'Rest easy, Professor. The net belongs to humanity again.'`,
        wordCount: 150,
        isPremium: false,
      },
    ],
  },

  // 10. NEW NOVEL: THE SOVEREIGN IMMORTAL BLADE
  {
    slug: "the-immortal-blade-ascension",
    title: "The Sovereign Immortal Blade",
    synopsis:
      "Born with a broken spirit root, sword disciple Lin Chen was relegated to sweeping the stone steps of the Heavenly Frost Sect. But when he stumbles into the forbidden Abyssal Dragon Cave, he unearths the Sovereign Immortal Blade—a primordial celestial artifact that feeds on heavenly lightning and unlocks the Nine Grand Realms of Sword Cultivation.",
    coverUrl: "/assets/shadow-king.jpg",
    bannerUrl: "/assets/shadow-king.jpg",
    author: {
      name: "Chen Wei",
      username: "chen_wuxia",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      verified: true,
    },
    genres: [
      { id: "fantasy", name: "Fantasy", slug: "fantasy" },
      { id: "action", name: "Action", slug: "action" },
      { id: "adventure", name: "Adventure", slug: "adventure" },
    ],
    tags: ["Cultivation", "Wuxia", "Sword Immortal", "Progression Fantasy", "Martial Arts"],
    status: "COMPLETED",
    rating: 4.96,
    reviewCount: 3120,
    readCount: 142000,
    chapterCount: 4,
    wordCount: 19500,
    isPremium: false,
    isCompleted: true,
    featured: true,
    mood: "Epic & Adventurous",
    category: "trending",
    storyDna: { romance: 35, politics: 70, action: 98, drama: 75, magic: 95 },
    ageRating: "14+",
    language: "English",
    chapters: [
      {
        chapterNumber: 1,
        title: "Chapter 1: The Broken Root and the Rusty Sword",
        content: `In the Heavenly Frost Sect, strength was everything. Cultivators who absorbed the spiritual Qi of heaven and earth could fly on flying swords, split mountains with a palm strike, and live for a thousand years.

Lin Chen had neither noble bloodline nor a complete spirit root. For three years, while inner disciples consumed heavenly pills and practiced divine sword techniques, Lin Chen swept the ten thousand marble stairs of Mount Taihang.

Mocked by Senior Brother Zhao and beaten for refusing to surrender his family's jade pendant, Lin Chen was cast into the bottomless Chasm of Whispering Dragons.

Instead of dying on the jagged rocks, Lin Chen crashed through an ancient barrier of celestial golden runes into an underground grotto. In the center of a pool of frozen dragon blood rested a black iron sword covered in ancient rust.

As his blood dripped onto the hilt, the rust shattered like eggshells, revealing a blade carved with nine roaring dragons!
*'Ten thousand swords bow before the Sovereign. Mortals cultivate Qi; I cultivate the Sword Soul!'*`,
        wordCount: 200,
        isPremium: false,
      },
      {
        chapterNumber: 2,
        title: "Chapter 2: The Nine Heavenly Sword Forms",
        content: `Within the underground grotto, time flowed tenfold faster than in the mortal realm. Guided by the ancient sword spirit inhabiting the Sovereign Blade, Lin Chen re-forged his broken meridians with primordial dragon marrow.

He practiced the First Form: *Wind-Severing Slash*.
Then the Second Form: *Thunderclap Dragon Roar*.
Then the Third Form: *Celestial Frost Domain*.

Where ordinary geniuses required thirty years to achieve Sword Intent, Lin Chen mastered the supreme art of Sword Heart Unity in three months of relentless training. His eyes now gleamed with the sharpness of a celestial blade capable of cutting through the fabric of space.`,
        wordCount: 120,
        isPremium: false,
      },
      {
        chapterNumber: 3,
        title: "Chapter 3: The Grand Sect Tournament",
        content: `On the day of the Sect Tournament, Senior Brother Zhao stood arrogantly upon the central battle arena, having defeated forty challengers in single combat.

"Is there no one in the entire younger generation who can withstand three strikes of my Crimson Flame Sword?" Zhao laughed loudly.

A quiet voice echoed from the clouds: "I shall accept your challenge."

Lin Chen stepped onto the arena. The entire sect gasped—the servant boy they thought dead had returned!

Zhao sneered and unleashed his signature technique: *Nine Phoenixes of Flame*. Colossal waves of molten fire erupted toward Lin Chen.

Lin Chen did not even draw his blade from its scabbard. He simply pointed two fingers forward. A single strand of silver Sword Qi burst forth, cutting the ocean of flame in half and shattering Zhao's spiritual armor into dust!`,
        wordCount: 160,
        isPremium: false,
      },
      {
        chapterNumber: 4,
        title: "Chapter 4: Ascending the Nine Heavens",
        content: `When the Demon Lord of the Nine Netherworlds attacked Mount Taihang with an army of hundred thousand demonic beasts, the sect elders fell one by one.

Lin Chen unsheathed the Sovereign Immortal Blade. The sky cracked open with purple heavenly tribulation lightning.

"By my sword, let the heavens be cleared of evil!"

Lin Chen soared into the storm, unleashing the Ninth Form: *Sovereign Cleaves the Void*. A ten-thousand-foot sword avatar made of pure divine light slashed across the horizon, obliterating the demon horde in a single breath.

The clouds parted, revealing the golden gates of the Immortal Realm. With the Sovereign Blade humming at his back, Lin Chen stepped onto the rainbow staircase to claim his eternal throne among the stars.`,
        wordCount: 140,
        isPremium: false,
      },
    ],
  },
];
