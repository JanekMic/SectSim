export interface Tile {
  id: string;
  type: string; // e.g., 'plains', 'mountain', 'water'
  x: number;
  y: number;
  resource?: ResourceNode;
}

export type MapGrid = Tile[][];

export type ResourceType = 
  | 'AmbientQiNode'         // Bonus resource
  | 'EssenceMaterial_SpiritStones' // Strategic resource
  | 'EssenceMaterial_Ironwood';    // Strategic resource

export interface ResourceNode {
  type: ResourceType;
  quantity?: number;      // Optional, e.g., for exhaustible resources
  exploitedBy?: string | null; // ID of the BranchSect exploiting this, null if unexploited
}

// Represents a player or AI entity in the game
export interface Player {
  id: string;
  name: string;
  // Add other player-specific properties here, e.g., resources, faction
}

export interface Unit {
  id: string;
  type: 'PioneeringElder'; // For now, only one type
  x: number;
  y: number;
  ownerId: string; // ID of the Player who owns this unit
  status?: 'idle' | 'moving' | 'selected' | 'improving'; // Optional status
}

// Unit Types
export type PioneeringElder = Unit & { type: 'PioneeringElder' };
export type FormationScribe = Unit & { 
  type: 'FormationScribe';
  buildCharges?: number; // Optional: if improvements consume charges
};

export type AnyUnit = PioneeringElder | FormationScribe; // Union type for all unit kinds

export interface BranchSect {
  id: string;
  name: string;
  x: number;
  y: number;
  ownerId: string; // ID of the Player who owns this sect
  level: number;
  exploitedTiles?: string[]; // Array of tile IDs (e.g., "x-y")
  // Add other sect-specific properties, e.g., population, resources generated
}
