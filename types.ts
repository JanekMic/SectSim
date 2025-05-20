export enum YieldType {
  SpiritualSustenance = 'Spiritual Sustenance', // Food
  CraftingMight = 'Crafting Might',         // Production
  SpiritStones = 'Spirit Stones',           // Gold
  Insight = 'Insight',                   // Science
  SectPrestige = 'Sect Prestige',         // Culture
  SpiritualEnergy = 'Spiritual Energy',     // Faith
}

export type Yields = {
  [key in YieldType]?: number;
};

export enum DistrictId {
  ScripturePavilion = 'SCRIPTURE_PAVILION',
  AncestralShrine = 'ANCESTRAL_SHRINE',
  ProvingGrounds = 'PROVING_GROUNDS',
  MartialProwessBastion = 'MARTIAL_PROWESS_BASTION',
  TreasurePavilion = 'TREASURE_PAVILION',
}

export interface DistrictDefinition {
  id: DistrictId;
  name: string;
  description: string;
  cost: Yields; // Base cost for Tier 1
  baseYields: Yields;
  unlockedBy?: EnlightenmentId | null;
  icon: React.ReactNode;
  maxTier: number;
  specialistSlotsPerTier: number[]; // Max specialists per tier [T1, T2, T3]
  specialistYieldBonus: Yields;   // Yield bonus per specialist
}

export interface BuiltDistrict extends DistrictDefinition {
  tier: number;
  assignedSpecialists: number;
}


export interface SectLocation {
  id: string;
  name:string;
  disciples: number;
  maxDisciples: number; // Housing
  harmony: number; // Amenities, 0-100
  districts: BuiltDistrict[];
  housingLevel: number; // Level of Cultivation Grottoes
}

export enum EnlightenmentId {
  BasicQiCirculation = 'BASIC_QI_CIRCULATION',
  SpiritHerbRecognition = 'SPIRIT_HERB_RECOGNITION',
  SimpleTalismanCrafting = 'SIMPLE_TALISMAN_CRAFTING',
  FoundationEstablishment = 'FOUNDATION_ESTABLISHMENT',
  SectDoctrineBasics = 'SECT_DOCTRINE_BASICS',
  BasicMartialConditioning = 'BASIC_MARTIAL_CONDITIONING',
}

export interface EnlightenmentDefinition {
  id: EnlightenmentId;
  name: string;
  description: string;
  cost: number; // Insight cost
  icon: React.ReactNode;
  prerequisites?: EnlightenmentId[];
  unlocksDistricts?: DistrictId[];
  yieldBonus?: Yields;
}

export enum DiplomaticStatus {
  PEACE = 'Peace',
  WAR = 'War',
}

export interface AISect {
  id: string;
  name: string;
  disciples: number;
  maxDisciples: number;
  housingLevel: number;
  harmony: number;
  districts: BuiltDistrict[]; // AI sects can theoretically have districts
  currentResources: Yields;
  accumulatedFoodSurplus: number;
  diplomaticStatus: DiplomaticStatus; // Diplomatic status with the player
  // Potentially add AI-specific behavior flags or simple goals later
}

export interface GameState {
  sectHq: SectLocation;
  currentResources: Yields;
  researchedEnlightenments: Set<EnlightenmentId>;
  turn: number;
  notifications: GameNotification[];
  accumulatedFoodSurplus: number;
  aiSects: AISect[];
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  turn: number;
}

// Action types for reducer
export enum GameActionType {
  NEXT_TURN = 'NEXT_TURN',
  BUILD_DISTRICT = 'BUILD_DISTRICT',
  UPGRADE_DISTRICT = 'UPGRADE_DISTRICT',
  RESEARCH_ENLIGHTENMENT = 'RESEARCH_ENLIGHTENMENT',
  UPGRADE_HOUSING = 'UPGRADE_HOUSING',
  ASSIGN_SPECIALIST = 'ASSIGN_SPECIALIST',
  UNASSIGN_SPECIALIST = 'UNASSIGN_SPECIALIST',
  DECLARE_WAR_ON_AI = 'DECLARE_WAR_ON_AI',
  MAKE_PEACE_WITH_AI = 'MAKE_PEACE_WITH_AI',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  INTERNAL_ADD_NOTIFICATION = 'INTERNAL_ADD_NOTIFICATION',
  DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION',
}

export type GameAction =
  | { type: GameActionType.NEXT_TURN }
  | { type: GameActionType.BUILD_DISTRICT; payload: DistrictId }
  | { type: GameActionType.UPGRADE_DISTRICT; payload: DistrictId }
  | { type: GameActionType.RESEARCH_ENLIGHTENMENT; payload: EnlightenmentId }
  | { type: GameActionType.UPGRADE_HOUSING }
  | { type: GameActionType.ASSIGN_SPECIALIST; payload: DistrictId }
  | { type: GameActionType.UNASSIGN_SPECIALIST; payload: DistrictId }
  | { type: GameActionType.DECLARE_WAR_ON_AI; payload: string } // AI Sect ID
  | { type: GameActionType.MAKE_PEACE_WITH_AI; payload: string } // AI Sect ID
  | { type: GameActionType.ADD_NOTIFICATION; payload: Omit<GameNotification, 'id' | 'turn'> }
  | { type: GameActionType.INTERNAL_ADD_NOTIFICATION; payload: Omit<GameNotification, 'id'> }
  | { type: GameActionType.DISMISS_NOTIFICATION; payload: string };