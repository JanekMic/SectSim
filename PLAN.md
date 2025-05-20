# Path of the Ascendant Sect - Next Steps Plan

This document outlines the plan for future development of the "Path of the Ascendant Sect" prototype. The initial prototype focuses on core mechanics: sect HQ management (1 district type), basic resource generation (Insight, Spirit Stones), a simple Enlightenment tree (1-2 techs), and a turn-based progression.

## Phase 1: Expanding Core Gameplay Loops (Short-Term)

**1. Deeper Sect Management:**
    *   **More Districts:** [COMPLETED] Implement the remaining district types as defined (Ancestral Shrine, Proving Grounds, Martial Prowess Bastion, Treasure Pavilion) with their respective yields and unlock conditions.
    *   **District Tiers/Upgrades:** [COMPLETED] Allow districts to be upgraded for improved yields or new functionalities.
    *   **Disciple Management:**
        *   Introduce "Housing" (Cultivation Grottoes) as a limit on disciple count, buildable/upgradable. [COMPLETED]
        *   Implement "Sect Harmony" (Amenities) affecting disciple growth rate, productivity, or causing negative events at low levels. Link to luxury resources (Auspicious Treasures). [COMPLETED]
        *   Allow assigning disciples to specific districts as "Specialists" to boost that district's output or unlock unique actions. [COMPLETED]

**2. Expanded Enlightenment & Doctrine Trees:**
    *   **More Enlightenments:** [COMPLETED - Basic structure allows for more, further expansion in later phases] Flesh out the Enlightenment Tree with more tiers and branches, unlocking new units, buildings, abilities, or game mechanics.
    *   **Introduce Doctrine Tree (Civics):** [COMPLETED - Basic yield and panel structure ready] Implement the "Sect Prestige" (Culture) yield. Create a basic Doctrine Tree with a few initial Doctrines that provide passive bonuses or unlock "Sect Maxims" (Policies).
    *   **Sect Governance Styles & Maxims:** [COMPLETED - Foundational elements for Doctrines set up] Introduce simple governance styles unlocked by Doctrines, providing Maxim slots for passive bonuses.

**3. Basic Map Interaction & Exploration:**
    *   **Actual Game Map:** [PENDING - Placeholder UI exists] Move from a placeholder to a simple tile-based grid.
    *   **Pioneering Elder (Settler):** [PENDING] Implement unit to found new "Branch Sects" on the map.
    *   **Resource Tiles:** [PENDING] Introduce map tiles with "Ambient Qi Nodes" (Bonus Resources) and "Essence Materials" (Strategic Resources) that Branch Sects can exploit.
    *   **Formation Scribe (Builder):** [PENDING] Unit to build improvements on resource tiles (e.g., "Herb Gardens," "Ore Refinement Pits").
    *(Note: Map interaction parts of Phase 1 will be a focus of early Phase 2 as they are more involved than initially scoped for the core loop refinement of Phase 1)*

**4. Rudimentary Combat & Units:**
    *   **Sect Guardians (Basic Military Unit):** [PENDING] Implement one or two basic military unit types (e.g., Sword Disciples).
    *   **Simple Combat:** [PENDING] Basic unit vs. unit combat on map tiles. Strength-based, no complex damage types yet.
    *   **Rogue Cultivators (Barbarians):** [PENDING] Simple AI-controlled units that spawn and can raid improvements or weak Branch Sects.
    *(Note: Combat parts of Phase 1 will be a focus of early Phase 2)*

## Phase 2: Introducing Strategic Depth (Medium-Term)

**1. Inter-Sect Diplomacy:**
    *   **Multiple AI Sects:** [IN PROGRESS - Basic simulation, diplomatic states, and player-initiated actions implemented. AI decision-making for diplomacy is next.] Introduce 1-2 AI-controlled rival sects.
    *   **Basic Diplomacy:** Allow declaring war/peace, simple trade (e.g., Spirit Stones for Essence Materials).
    *   **Karmic Feuds (Grievances):** Basic system for tracking negative interactions.

**2. Doctrinal System (Religion):**
    *   **Spiritual Energy (Faith) Yield:** Implement fully.
    *   **Founding a Major Dao Path:** Allow founding a "religion" using a "Peerless Ascetic" (Great Prophet equivalent).
    *   **Path Propagators (Missionaries):** Units to spread Doctrinal Influence to other sect's disciples.
    *   **Core Tenets:** Simple belief choices when founding a Dao Path.

**3. Peerless Geniuses (Great People):**
    *   Implement one or two types (e.g., Peerless Sage for Insight boosts, Peerless Artificer for production boosts).
    *   Point generation system based on relevant district activity.

**4. Wonders & Auspicious Terrains:**
    *   **Auspicious Terrains (Natural Wonders):** Add unique map tiles with significant yield bonuses or special effects.
    *   **Heavenly Artifacts (World Wonders):** Implement 1-2 World Wonders with powerful, sect-wide effects.

**5. UI/UX Polish:**
    *   Improved visual feedback for actions.
    *   Tooltips for all major UI elements, yields, and definitions.
    *   More refined icons and visual styling.
    *   Better layout for information display.

**6. Initial Map & Combat Implementation (Carried from Phase 1 scope):**
    *   Implement core map grid.
    *   Implement Pioneering Elder, Formation Scribe.
    *   Implement basic combat units and Rogue Cultivators.

## Phase 3: Advanced Systems & Victory Conditions (Long-Term)

**1. Advanced Combat & Units:**
    *   Full range of unit types (Melee, Ranged, Siege, Swift, Sky-Riders).
    *   Unit promotions and combat experience.
    *   Battle Formations.
    *   Sect Sieges with "Grand Protective Formations" (City Walls).
    *   "Debates of the Dao" (Theological Combat).

**2. Full Diplomacy & World Interaction:**
    *   Alliances, trade deals, espionage (Shadow Agents).
    *   Minor Sects & Hidden Clans (City-States) with envoys and suzerainty.
    *   Grand Cultivator Conclave (World Congress).
    *   World-Threat Edicts (Emergencies).

**3. Complete Victory Conditions:**
    *   Implement all defined victory conditions: Martial Hegemony, Transcendence, Dao Unification, Supreme Path, Celestial Mandate.
    *   Score Victory as a fallback.

**4. Karmic Cycles & Cultivation Epochs (Ages):**
    *   Implement Era Score (Karmic Merit) and Ages (Golden, Waning, Heroic Epochs) with their respective mechanics.

**5. Environmental Factors & Hidden Realms:**
    *   Consider map features like Miasmic Swamps, Volcanic Vents.
    *   Potential for "Spiritual Qi Imbalance" (Climate Change equivalent).
    *   Possibility of "Hidden Realms" (small sub-maps for exploration/quests).

**6. AI Enhancement:**
    *   More sophisticated AI for rival sects (expansion, military, diplomacy, pursuing victory conditions).

**7. Multiplayer:**
    *   Consider feasibility for multiplayer functionality if core single-player game is robust.

**Technical Considerations:**

*   **State Management:** Evaluate if `useReducer` remains sufficient or if a more robust solution like Zustand or Redux Toolkit is needed as complexity grows.
*   **Performance:** Optimize rendering and game logic, especially for map interactions and large numbers of entities.
*   **Code modularity:** Continue to break down components and logic into manageable, reusable pieces.
*   **Testing:** Introduce unit and integration tests.