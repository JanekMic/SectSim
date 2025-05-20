import React from 'react';
import { DistrictDefinition, DistrictId, EnlightenmentDefinition, EnlightenmentId, GameState, SectLocation, YieldType, Yields, AISect, DiplomaticStatus } from './types';

// Icons (simple SVGs)
export const InsightIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className || ''}`}><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
export const SpiritStonesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className || ''}`}><path d="M10 2a.75.75 0 01.75.75v1.5h3.75a.75.75 0 010 1.5H10.75v1.5H14a.75.75 0 010 1.5H10.75v1.5H14a.75.75 0 010 1.5H10.75v1.5a.75.75 0 01-1.5 0v-1.5H5.5a.75.75 0 010-1.5H9.25v-1.5H5.5a.75.75 0 010-1.5H9.25v-1.5H5.5a.75.75 0 010-1.5h3.75V2.75A.75.75 0 0110 2z" /></svg>;
export const DisciplesIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className || ''}`}><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" /></svg>;
export const SpiritualSustenanceIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className || ''}`}><path fillRule="evenodd" d="M10 2a.75.75 0 01.664.431l3.878 7.756a.75.75 0 01-1.328.664L10 5.274l-3.214 5.577a.75.75 0 01-1.327-.664L9.336 2.43A.75.75 0 0110 2zM3.397 11.78A.75.75 0 014.25 11h11.5a.75.75 0 01.853.78 11.5 11.5 0 01-23 0A.75.75 0 013.397 11.78zM4.756 13.75a.75.75 0 01.712.914 9.5 9.5 0 0011.064 0 .75.75 0 111.424-.228 11 11 0 01-13.912 0A.75.75 0 014.756 13.75z" clipRule="evenodd" /></svg>;
export const CraftingMightIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className || ''}`}><path fillRule="evenodd" d="M11.09 3.562A4.5 4.5 0 105.59 9.418a.75.75 0 011.061 1.061 6 6 0 118.486-8.486.75.75 0 01-1.061 1.06L11.09 3.562zM6.013 9.63a.75.75 0 00-1.06 0L2.225 12.36a.75.75 0 101.06 1.061L6.013 10.7a.75.75 0 000-1.06z" clipRule="evenodd" /></svg>;
export const BookIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V3.75m0 16.5A8.966 8.966 0 0 1 12 18a8.966 8.966 0 0 1-6 2.292m0 0V9.75M12 6.042V18m6-11.958V18" /></svg>;
export const ShrineIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1M14.25 3l6.364 2.323M12 3v9.75m0 0l3 1.091M12 12.75l-3 1.091M12 12.75V3m0 9.75L4.5 9.75M3.75 7.5h1.5v3.75h-1.5V7.5Z" /></svg>;
export const LightbulbIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.354a15.055 15.055 0 0 1-4.5 0M12 3v2.25m0 0a6.01 6.01 0 0 0 4.5 5.25m-4.5-5.25a6.01 6.01 0 0 1-4.5 5.25m0 0A2.25 2.25 0 0 0 6 12.75m0 0A2.25 2.25 0 0 0 7.5 15m0 0A2.25 2.25 0 0 0 9 12.75m3-7.5A2.25 2.25 0 0 0 15 3.75M15 3.75A2.25 2.25 0 0 0 16.5 6m0 0A2.25 2.25 0 0 0 18 3.75m-6 15A2.25 2.25 0 0 0 9 15.75m3 2.25a2.25 2.25 0 0 1-3-2.25M15 15.75a2.25 2.25 0 0 0-3-2.25M4.5 15.75A2.25 2.25 0 0 1 3 13.5m0 0A2.25 2.25 0 0 1 4.5 11.25m0 0A2.25 2.25 0 0 1 6 13.5m0 0A2.25 2.25 0 0 1 7.5 11.25m6-7.5A2.25 2.25 0 0 0 18 8.25m0 0A2.25 2.25 0 0 0 19.5 6M19.5 6A2.25 2.25 0 0 0 18 3.75M4.5 6A2.25 2.25 0 0 0 3 8.25M3 8.25A2.25 2.25 0 0 0 4.5 6" /></svg>;
export const ScrollIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
export const HammerIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 4.5 7.5 7.5-7.5 7.5m-6-15 7.5 7.5-7.5 7.5" /></svg>;
export const UsersIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
export const StarIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.31h5.418a.563.563 0 0 1 .321.988l-4.202 3.283a.563.563 0 0 0-.182.557l1.285 4.971a.563.563 0 0 1-.84.61l-4.62-3.655a.563.563 0 0 0-.656 0l-4.62 3.655a.563.563 0 0 1-.84-.61l1.285-4.971a.563.563 0 0 0-.182-.557l-4.202-3.283a.563.563 0 0 1 .321-.988h5.418a.563.563 0 0 0 .475-.31L11.48 3.5Z" /></svg>;
export const ShieldIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
export const FistIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>;
export const ArrowUpCircleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const HomeIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
export const HeartIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>;
export const UserPlusIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>;
export const UserMinusIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5H6m12 0a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>;
const SwordsIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-3.75 0l3-2.25 3 2.25M11.25 15.75l-3 2.25m9-15l-3 2.25m0 0l-3-2.25m3 2.25V15m0 0l3 2.25m-3-2.25l-3 2.25m-3-15l3 2.25m0 0l3-2.25m-3 2.25V15m0 0l-3 2.25m3-2.25l3 2.25" /></svg>; // Simplified
const DoveIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className || ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3.031A4.483 4.483 0 0017.483 6H6.517a4.483 4.483 0 001.732 5.969l3 3.031m-.743-3.03L9 14.25M15 14.25L12.75 12m2.25 0L12 9.75M9 9.75L11.25 12M12 3v1.5M12 18v3" /></svg>; // Simplified


export const INITIAL_HOUSING_LEVEL = 2;
export const HOUSING_PER_LEVEL = 5;
export const HOUSING_UPGRADE_BASE_COST: Yields = {
  [YieldType.CraftingMight]: 20,
  [YieldType.SpiritStones]: 30
};

export const HARMONY_BASE = 75;
export const HARMONY_PENALTY_PER_DISCIPLE = 1;
export const LOW_HARMONY_THRESHOLD = 30;
export const VERY_LOW_HARMONY_THRESHOLD = 15;
export const DISCIPLE_LOSS_CHANCE_ON_VERY_LOW_HARMONY = 0.2; // 20%


export const INITIAL_SECT_HQ: SectLocation = {
  id: 'main_peak',
  name: 'Celestial Summit Sect',
  disciples: 5,
  housingLevel: INITIAL_HOUSING_LEVEL,
  maxDisciples: INITIAL_HOUSING_LEVEL * HOUSING_PER_LEVEL,
  harmony: HARMONY_BASE - (5 * HARMONY_PENALTY_PER_DISCIPLE), // Initial harmony adjusted for starting disciples
  districts: [],
};

export const DISTRICT_DEFINITIONS: DistrictDefinition[] = [
  {
    id: DistrictId.ScripturePavilion,
    name: 'Scripture Pavilion',
    description: 'Generates Insight for researching new Enlightenments. Specialists enhance research speed.',
    cost: { [YieldType.SpiritStones]: 40, [YieldType.CraftingMight]: 15 },
    baseYields: { [YieldType.Insight]: 2 },
    icon: <BookIcon />,
    maxTier: 3,
    specialistSlotsPerTier: [1, 2, 3],
    specialistYieldBonus: { [YieldType.Insight]: 1 },
  },
  {
    id: DistrictId.AncestralShrine,
    name: 'Ancestral Shrine',
    description: 'Generates Spiritual Energy. Specialists deepen the connection, increasing Spiritual Energy.',
    cost: { [YieldType.SpiritStones]: 60, [YieldType.CraftingMight]: 25 },
    baseYields: { [YieldType.SpiritualEnergy]: 1, [YieldType.SectPrestige]: 0.5 },
    unlockedBy: EnlightenmentId.SpiritHerbRecognition,
    icon: <ShrineIcon />,
    maxTier: 3,
    specialistSlotsPerTier: [1, 1, 2],
    specialistYieldBonus: { [YieldType.SpiritualEnergy]: 0.5, [YieldType.SectPrestige]: 0.25 },
  },
  {
    id: DistrictId.TreasurePavilion,
    name: 'Treasure Pavilion',
    description: 'Generates Spirit Stones. Specialists improve financial operations.',
    cost: { [YieldType.SpiritStones]: 70, [YieldType.CraftingMight]: 30 },
    baseYields: { [YieldType.SpiritStones]: 5 },
    unlockedBy: EnlightenmentId.FoundationEstablishment,
    icon: <SpiritStonesIcon className="text-yellow-400" />,
    maxTier: 3,
    specialistSlotsPerTier: [1, 2, 2],
    specialistYieldBonus: { [YieldType.SpiritStones]: 2 },
  },
  {
    id: DistrictId.ProvingGrounds,
    name: 'Proving Grounds',
    description: 'Generates Sect Prestige. Specialists (Elders/Instructors) enhance prestige gain.',
    cost: { [YieldType.SpiritStones]: 70, [YieldType.CraftingMight]: 30 },
    baseYields: { [YieldType.SectPrestige]: 2 },
    unlockedBy: EnlightenmentId.SectDoctrineBasics,
    icon: <UsersIcon className="text-purple-400" />,
    maxTier: 3,
    specialistSlotsPerTier: [1, 1, 2],
    specialistYieldBonus: { [YieldType.SectPrestige]: 1 },
  },
  {
    id: DistrictId.MartialProwessBastion,
    name: 'Martial Prowess Bastion',
    description: 'Enhances martial readiness. Specialists improve Crafting Might for military production.',
    cost: { [YieldType.SpiritStones]: 80, [YieldType.CraftingMight]: 35 },
    baseYields: { [YieldType.CraftingMight]: 1, [YieldType.SectPrestige]: 1 },
    unlockedBy: EnlightenmentId.BasicMartialConditioning,
    icon: <ShieldIcon className="text-red-400" />,
    maxTier: 3,
    specialistSlotsPerTier: [1, 1, 1], // Fewer, more impactful specialists perhaps
    specialistYieldBonus: { [YieldType.CraftingMight]: 1 },
  },
];

export const ENLIGHTENMENT_DEFINITIONS: EnlightenmentDefinition[] = [
  {
    id: EnlightenmentId.BasicQiCirculation,
    name: 'Basic Qi Circulation',
    description: 'Understand the fundamentals of Qi flow, improving overall sect efficiency slightly.',
    cost: 15,
    icon: <LightbulbIcon className="text-blue-400" />,
    yieldBonus: {[YieldType.CraftingMight]: 0.5}
  },
  {
    id: EnlightenmentId.SpiritHerbRecognition,
    name: 'Spirit Herb Recognition',
    description: 'Learn to identify and utilize common spirit herbs, unlocking the Ancestral Shrine.',
    cost: 25,
    prerequisites: [EnlightenmentId.BasicQiCirculation],
    unlocksDistricts: [DistrictId.AncestralShrine],
    icon: <ScrollIcon className="text-green-400" />,
  },
  {
    id: EnlightenmentId.FoundationEstablishment,
    name: 'Foundation Establishment',
    description: 'Solidify the sect\'s foundations, enabling advanced economic structures like the Treasure Pavilion.',
    cost: 40,
    prerequisites: [EnlightenmentId.SpiritHerbRecognition],
    unlocksDistricts: [DistrictId.TreasurePavilion],
    icon: <HammerIcon className="text-gray-400" />,
  },
  {
    id: EnlightenmentId.SectDoctrineBasics,
    name: 'Sect Doctrine Basics',
    description: 'Formulate the initial doctrines of your sect, unlocking the Proving Grounds to cultivate Sect Prestige.',
    cost: 30,
    prerequisites: [EnlightenmentId.SpiritHerbRecognition],
    unlocksDistricts: [DistrictId.ProvingGrounds],
    icon: <StarIcon className="text-yellow-300" />,
  },
  {
    id: EnlightenmentId.BasicMartialConditioning,
    name: 'Basic Martial Conditioning',
    description: 'Fundamental training regimens for disciples, unlocking the Martial Prowess Bastion.',
    cost: 35,
    prerequisites: [EnlightenmentId.BasicQiCirculation],
    unlocksDistricts: [DistrictId.MartialProwessBastion],
    icon: <FistIcon className="text-orange-400" />,
  },
];

export const INITIAL_STARTING_RESOURCES: Yields = {
  [YieldType.SpiritStones]: 100,
  [YieldType.Insight]: 5,
  [YieldType.SpiritualSustenance]: 20,
  [YieldType.CraftingMight]: 25, // Increased slightly for earlier specialist assignment
  [YieldType.SectPrestige]: 0,
  [YieldType.SpiritualEnergy]: 0,
};

export const BASE_YIELDS_PER_TURN: Yields = {
  [YieldType.SpiritualSustenance]: 5,
  [YieldType.CraftingMight]: 3,
  [YieldType.SpiritStones]: 2,
  [YieldType.Insight]: 0,
  [YieldType.SectPrestige]: 0.5,
  [YieldType.SpiritualEnergy]: 0,
};

export const AI_BASE_YIELDS_PER_TURN: Yields = {
    [YieldType.SpiritualSustenance]: 3, // AI has slightly less base food
    [YieldType.CraftingMight]: 2,
    [YieldType.SpiritStones]: 3,
    [YieldType.Insight]: 1,
    [YieldType.SectPrestige]: 0.2,
    [YieldType.SpiritualEnergy]: 0.1,
};


export const FOOD_PER_DISCIPLE = 20;

const INITIAL_AI_SECTS: AISect[] = [
    {
        id: 'rival_sect_shadow_talon',
        name: 'Shadow Talon Clan',
        disciples: 3,
        housingLevel: 1,
        maxDisciples: 1 * HOUSING_PER_LEVEL,
        harmony: HARMONY_BASE - (3 * HARMONY_PENALTY_PER_DISCIPLE),
        districts: [],
        currentResources: {
            [YieldType.SpiritStones]: 50,
            [YieldType.Insight]: 2,
            [YieldType.SpiritualSustenance]: 10,
            [YieldType.CraftingMight]: 10,
            [YieldType.SectPrestige]: 0,
            [YieldType.SpiritualEnergy]: 0,
        },
        accumulatedFoodSurplus: 0,
        diplomaticStatus: DiplomaticStatus.PEACE,
    },
    {
        id: 'rival_sect_jade_serpent',
        name: 'Jade Serpent Sect',
        disciples: 4,
        housingLevel: 1, // Start with basic housing
        maxDisciples: 1 * HOUSING_PER_LEVEL,
        harmony: HARMONY_BASE - (4 * HARMONY_PENALTY_PER_DISCIPLE),
        districts: [],
        currentResources: {
            [YieldType.SpiritStones]: 60,
            [YieldType.Insight]: 1,
            [YieldType.SpiritualSustenance]: 15,
            [YieldType.CraftingMight]: 5,
            [YieldType.SectPrestige]: 1,
            [YieldType.SpiritualEnergy]: 0,
        },
        accumulatedFoodSurplus: 5,
        diplomaticStatus: DiplomaticStatus.PEACE,
    }
];

export const INITIAL_GAME_STATE: GameState = {
  sectHq: INITIAL_SECT_HQ,
  currentResources: { ...INITIAL_STARTING_RESOURCES },
  researchedEnlightenments: new Set<EnlightenmentId>(),
  turn: 1,
  notifications: [],
  accumulatedFoodSurplus: 0,
  aiSects: INITIAL_AI_SECTS,
};

export const YIELD_ICONS: Record<YieldType, React.ReactNode> = {
    [YieldType.SpiritualSustenance]: <SpiritualSustenanceIcon className="text-green-400" />,
    [YieldType.CraftingMight]: <CraftingMightIcon className="text-orange-400" />,
    [YieldType.SpiritStones]: <SpiritStonesIcon className="text-yellow-400" />,
    [YieldType.Insight]: <InsightIcon className="text-blue-400" />,
    [YieldType.SectPrestige]: <UsersIcon className="text-purple-400" />,
    [YieldType.SpiritualEnergy]: <ShrineIcon className="text-indigo-400" />,
};

// Adding a general stats icon map for things like Harmony
export const STAT_ICONS = {
    HARMONY: <HeartIcon className="text-rose-400" />,
    DISCIPLES: <DisciplesIcon className="text-gray-300" />,
    HOUSING: <HomeIcon className="text-lime-400" />,
    USER_PLUS: <UserPlusIcon className="text-green-400" />,
    USER_MINUS: <UserMinusIcon className="text-red-400" />,
    AI_SECT: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-fuchsia-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 0 0-2.25-2.25H15a3.75 3.75 0 0 1-3.75-3.75V1.5a2.25 2.25 0 0 0-2.25-2.25L8.25 0L7.5 1.5v3.75A3.75 3.75 0 0 1 3.75 9H1.5a2.25 2.25 0 0 0-2.25 2.25v.75c0 .621.504 1.125 1.125 1.125h19.5A1.125 1.125 0 0 0 22.5 12v-.75a2.25 2.25 0 0 0-2.25-2.25Z" /></svg>,
    WAR_ICON: <SwordsIcon className="text-red-500" />,
    PEACE_ICON: <DoveIcon className="text-sky-400" />,
};


export const YIELD_COLORS: Record<YieldType, string> = {
    [YieldType.SpiritualSustenance]: 'text-green-400',
    [YieldType.CraftingMight]: 'text-orange-400',
    [YieldType.SpiritStones]: 'text-yellow-400',
    [YieldType.Insight]: 'text-blue-400',
    [YieldType.SectPrestige]: 'text-purple-400',
    [YieldType.SpiritualEnergy]: 'text-indigo-400',
};

// Harmony status colors
export const HARMONY_STATUS_COLORS: Record<'high' | 'normal' | 'low' | 'very_low', string> = {
    high: 'text-green-400', // e.g. > 70
    normal: 'text-yellow-300', // e.g. 31 - 70
    low: 'text-orange-400', // e.g. 16 - 30
    very_low: 'text-red-500', // e.g. <= 15
};