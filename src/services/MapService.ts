import {
  MapGrid, Tile, BranchSect, Player, PioneeringElder, AnyUnit, FormationScribe,
  ResourceType, TileImprovementType, TileImprovement
} from '../types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

// --- Game State ---
// For now, we'll manage players, units, and sects here.
// In a larger app, this might be in a dedicated state management solution (Redux, Zustand, Context API)

export const DEFAULT_PLAYER_ID = 'player1';

export const initialPlayers: Player[] = [
  { id: DEFAULT_PLAYER_ID, name: 'Player 1' },
];

export interface GameState {
  mapGrid: MapGrid;
  units: AnyUnit[]; // Now uses AnyUnit
  branchSects: BranchSect[];
  players: Player[];
}

export const initializeGameState = (): GameState => {
  const grid: MapGrid = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push({
        id: `${x}-${y}`,
        type: 'plains', // Default to 'plains'
        x,
        y,
        resource: undefined, // Initialize with no resource
      });
    }
    grid.push(row);
  }

  // Add specific resources for testing
  if (grid[1] && grid[1][1]) { // AmbientQiNode at (1,1)
    grid[1][1].resource = { type: 'AmbientQiNode', exploitedBy: null };
  }
  if (grid[2] && grid[2][2]) { // EssenceMaterial_SpiritStones at (2,2)
    grid[2][2].resource = { type: 'EssenceMaterial_SpiritStones', quantity: 100, exploitedBy: null };
  }
  if (grid[2] && grid[2][0]) { // EssenceMaterial_Ironwood at (0,2) - corrected from (2,0) to be closer
    grid[2][0].resource = { type: 'EssenceMaterial_Ironwood', quantity: 50, exploitedBy: null };
  }
  
  // Add an initial Pioneering Elder
  const initialElder: PioneeringElder = {
    id: uuidv4(),
    type: 'PioneeringElder',
    x: 0, // Starting at top-left
    y: 0,
    ownerId: DEFAULT_PLAYER_ID,
    status: 'idle',
  };

  // Add an initial Formation Scribe
  const initialScribe: FormationScribe = {
    id: uuidv4(),
    type: 'FormationScribe',
    x: 0, 
    y: 1, // Next to the Elder
    ownerId: DEFAULT_PLAYER_ID,
    status: 'idle',
  };

  return {
    mapGrid: grid,
    units: [initialElder, initialScribe], // Add Scribe to initial units
    branchSects: [],
    players: initialPlayers,
  };
};

// --- Action: Found Branch Sect ---
export const foundBranchSect = (
  currentState: GameState,
  elderId: string,
  targetX: number,
  targetY: number,
  newSectName: string = "New Branch" // Default name
): { newState: GameState; success: boolean; message: string } => {
  const elder = currentState.units.find(u => u.id === elderId && u.type === 'PioneeringElder') as PioneeringElder | undefined;

  if (!elder) {
    return { newState: currentState, success: false, message: "Pioneering Elder not found." };
  }

  // Check if tile is valid (e.g., 'plains' and unoccupied by another sect)
  const tile = currentState.mapGrid[targetY]?.[targetX];
  if (!tile || tile.type !== 'plains') {
    return { newState: currentState, success: false, message: "Cannot found sect on non-plains tile." };
  }

  const isOccupiedBySect = currentState.branchSects.some(sect => sect.x === targetX && sect.y === targetY);
  if (isOccupiedBySect) {
    return { newState: currentState, success: false, message: "Tile is already occupied by a Branch Sect." };
  }
  
  // Check if occupied by another unit (optional, for now one unit per tile or allow stacking)
  const isOccupiedByUnit = currentState.units.some(unit => unit.x === targetX && unit.y === targetY && unit.id !== elderId);
  if (isOccupiedByUnit) {
    return { newState: currentState, success: false, message: "Tile is occupied by another unit." };
  }

  // Create new Branch Sect
  const newSect: BranchSect = {
    id: uuidv4(),
    name: newSectName,
    x: targetX,
    y: targetY,
    ownerId: elder.ownerId,
    level: 1,
    exploitedTiles: [], // Initialize with no exploited tiles
  };

  // --- Automatic Resource Exploitation upon Founding ---
  // Check adjacent tiles for resources and exploit them if unexploited
  const directions = [
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, // Left, Right
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, // Up, Down
    // Optional: Diagonal
    // { dx: -1, dy: -1 }, { dx: 1, dy: -1 },
    // { dx: -1, dy: 1 }, { dx: 1, dy: 1 },
  ];

  const newGrid = currentState.mapGrid.map(row => row.map(tile => ({ ...tile }))); // Deep copy grid for modification

  for (const dir of directions) {
    const adjX = targetX + dir.dx;
    const adjY = targetY + dir.dy;

    if (adjX >= 0 && adjX < GRID_WIDTH && adjY >= 0 && adjY < GRID_HEIGHT) {
      const adjacentTile = newGrid[adjY][adjX];
      if (adjacentTile.resource && !adjacentTile.resource.exploitedBy) {
        adjacentTile.resource.exploitedBy = newSect.id;
        newSect.exploitedTiles?.push(adjacentTile.id);
      }
    }
  }
  // --- End of Automatic Resource Exploitation ---


  // Remove the elder and add the new sect
  const updatedUnits = currentState.units.filter(u => u.id !== elderId);
  const updatedBranchSects = [...currentState.branchSects, newSect];

  return {
    newState: {
      ...currentState,
      mapGrid: newGrid, // Use the modified grid
      units: updatedUnits,
      branchSects: updatedBranchSects,
    },
    success: true,
    message: `Branch Sect "${newSectName}" founded at (${targetX}, ${targetY}). Nearby resources exploited.`,
  };
};

// Potentially add functions here to modify the map, e.g., changeTileType, moveUnit

// --- Tile Improvement Mappings ---
export const improvementResourceMap: Record<TileImprovementType, ResourceType> = {
  'QiCondenser': 'AmbientQiNode',
  'SpiritStoneMine': 'EssenceMaterial_SpiritStones',
  'LumberMill': 'EssenceMaterial_Ironwood',
};

// --- Action: Start Build Improvement ---
export const startBuildImprovement = (
  currentState: GameState,
  scribeId: string,
  tileX: number,
  tileY: number,
  improvementType: TileImprovementType
): { newState: GameState; success: boolean; message: string } => {
  const scribe = currentState.units.find(u => u.id === scribeId) as FormationScribe | undefined;

  // Validation 1: Scribe exists and is a FormationScribe
  if (!scribe || scribe.type !== 'FormationScribe') {
    return { newState: currentState, success: false, message: "Invalid unit or unit is not a Formation Scribe." };
  }

  // Validation 2: Scribe is on the target tile
  if (scribe.x !== tileX || scribe.y !== tileY) {
    return { newState: currentState, success: false, message: "Formation Scribe is not on the target tile." };
  }

  const targetTile = currentState.mapGrid[tileY]?.[tileX];

  // Validation 3: Tile exists
  if (!targetTile) {
    return { newState: currentState, success: false, message: "Target tile does not exist." };
  }

  // Validation 4: Tile has a resource
  if (!targetTile.resource) {
    return { newState: currentState, success: false, message: "Target tile has no resource to improve." };
  }

  // Validation 5: Tile resource is compatible with the improvement
  const requiredResourceType = improvementResourceMap[improvementType];
  if (targetTile.resource.type !== requiredResourceType) {
    return { 
      newState: currentState, 
      success: false, 
      message: `Cannot build ${improvementType} on ${targetTile.resource.type}. Requires ${requiredResourceType}.` 
    };
  }

  // Validation 6: Tile does not already have an improvement
  if (targetTile.improvement) {
    return { newState: currentState, success: false, message: "Target tile already has an improvement." };
  }
  
  // Validation 7: Tile must be exploited by a sect owned by the scribe's owner
  // This ensures the player benefits from the improvement.
  const exploitingSect = currentState.branchSects.find(sect => sect.id === targetTile.resource?.exploitedBy);
  if (!exploitingSect || exploitingSect.ownerId !== scribe.ownerId) {
      return { newState: currentState, success: false, message: "Tile must be exploited by one of your Branch Sects to build an improvement." };
  }

  // Action: Create and apply the improvement (instant build)
  const newImprovement: TileImprovement = {
    type: improvementType,
    builtBySectId: exploitingSect.id, // Improvement is tied to the sect exploiting the tile
    active: true, // Instant build
    // progress and turnsToBuild could be added here for turn-based construction
  };

  const newGrid = currentState.mapGrid.map(row =>
    row.map(tile => {
      if (tile.id === targetTile.id) {
        return { ...tile, improvement: newImprovement };
      }
      return tile;
    })
  );
  
  // Optional: Change scribe status or consume charges
  // const updatedUnits = currentState.units.map(u => 
  //   u.id === scribeId ? { ...u, status: 'idle' /* or charges: scribe.buildCharges - 1 */ } : u
  // );

  return {
    newState: {
      ...currentState,
      mapGrid: newGrid,
      // units: updatedUnits // if scribe status/charges change
    },
    success: true,
    message: `${improvementType} built successfully on tile (${tileX}, ${tileY}).`,
  };
};
