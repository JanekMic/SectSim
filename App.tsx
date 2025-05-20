import React, { useReducer, useCallback, useEffect } from 'react';
import { GameState, GameAction, GameActionType, YieldType, DistrictId, EnlightenmentId, BuiltDistrict, Yields, SectLocation, EnlightenmentDefinition, DistrictDefinition, AISect, DiplomaticStatus } from './types';
import {
    INITIAL_GAME_STATE, DISTRICT_DEFINITIONS, ENLIGHTENMENT_DEFINITIONS,
    YIELD_ICONS, YIELD_COLORS, BASE_YIELDS_PER_TURN, FOOD_PER_DISCIPLE,
    HOUSING_PER_LEVEL, HOUSING_UPGRADE_BASE_COST,
    HARMONY_BASE, HARMONY_PENALTY_PER_DISCIPLE, LOW_HARMONY_THRESHOLD,
    VERY_LOW_HARMONY_THRESHOLD, DISCIPLE_LOSS_CHANCE_ON_VERY_LOW_HARMONY,
    STAT_ICONS, HARMONY_STATUS_COLORS, AI_BASE_YIELDS_PER_TURN
} from './constants';
import SectManagementPanel from './components/SectManagementPanel';
import EnlightenmentPanel from './components/EnlightenmentPanel';
import ResourceDisplay from './components/ResourceDisplay';
import NotificationArea from './components/NotificationArea';

// Helper function to calculate gross yields per turn from base income, districts, and enlightenments
export const calculateGrossYieldsPerTurn = (sectLocation: SectLocation | AISect, researchedEnlightenments?: Set<EnlightenmentId>, isAI: boolean = false): Yields => {
  const baseYieldsToUse = isAI ? AI_BASE_YIELDS_PER_TURN : BASE_YIELDS_PER_TURN;
  const yields: Yields = { ...baseYieldsToUse };

  // Add district yields (multiplied by tier) and specialist yields
  // AI currently doesn't build districts or use specialists in this iteration.
  // If AI had districts, sectLocation.districts would be used here.
  if (!isAI && sectLocation.districts) {
    const playerSect = sectLocation as SectLocation;
    playerSect.districts.forEach(district => {
      // Base yields from district tier
      Object.entries(district.baseYields).forEach(([yieldKey, yieldValue]) => {
        const key = yieldKey as YieldType;
        yields[key] = (yields[key] || 0) + ((yieldValue || 0) * district.tier);
      });
      // Yields from assigned specialists
      if (district.assignedSpecialists > 0) {
          Object.entries(district.specialistYieldBonus).forEach(([yieldKey, bonusPerSpecialist]) => {
              const key = yieldKey as YieldType;
              yields[key] = (yields[key] || 0) + ((bonusPerSpecialist || 0) * district.assignedSpecialists);
          });
      }
    });
  }


  // Add yields from researched enlightenments (Player only for now)
  if (researchedEnlightenments && !isAI) {
    researchedEnlightenments.forEach(eId => {
      const enlightenmentDef = ENLIGHTENMENT_DEFINITIONS.find(e => e.id === eId);
      if (enlightenmentDef?.yieldBonus) {
        Object.entries(enlightenmentDef.yieldBonus).forEach(([yieldKey, yieldValue]) => {
          const key = yieldKey as YieldType;
          yields[key] = (yields[key] || 0) + (yieldValue || 0);
        });
      }
    });
  }
  return yields;
};

// Helper function to calculate upgrade cost for a district
export const calculateDistrictUpgradeCost = (district: BuiltDistrict): Yields => {
  const nextTier = district.tier + 1;
  const upgradeCost: Yields = {};
  const baseDefinition = DISTRICT_DEFINITIONS.find(d => d.id === district.id);
  if (!baseDefinition) return {}; // Should not happen

  for (const key in baseDefinition.cost) {
    const yieldKey = key as YieldType;
    // Cost to upgrade to (currentTier + 1) is baseCost[yieldType] * currentTier
    upgradeCost[yieldKey] = (baseDefinition.cost[yieldKey] || 0) * district.tier;
  }
  return upgradeCost;
};

// Helper function to calculate housing upgrade cost
export const calculateHousingUpgradeCost = (currentHousingLevel: number): Yields => {
    const cost: Yields = {};
    for (const key in HOUSING_UPGRADE_BASE_COST) {
        const yieldKey = key as YieldType;
        cost[yieldKey] = (HOUSING_UPGRADE_BASE_COST[yieldKey] || 0) * currentHousingLevel;
    }
    return cost;
};


const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newNotifications = [...state.notifications];

  const addNotification = (message: string, type: 'info' | 'warning' | 'success' | 'error') => {
    newNotifications.push({ id: Date.now().toString() + Math.random(), message, type, turn: state.turn });
  };


  switch (action.type) {
    case GameActionType.NEXT_TURN: {
      // PLAYER'S TURN
      const playerGrossYields = calculateGrossYieldsPerTurn(state.sectHq, state.researchedEnlightenments);
      const newPlayerResources = { ...state.currentResources };

      (Object.keys(playerGrossYields) as YieldType[]).forEach(key => {
        if (key !== YieldType.SpiritualSustenance) { // Food handled separately
          newPlayerResources[key] = (newPlayerResources[key] || 0) + (playerGrossYields[key] || 0);
        }
      });

      const playerFoodProduced = playerGrossYields[YieldType.SpiritualSustenance] || 0;
      const playerFoodConsumed = state.sectHq.disciples;
      const playerNetFoodChange = playerFoodProduced - playerFoodConsumed;

      newPlayerResources[YieldType.SpiritualSustenance] = (newPlayerResources[YieldType.SpiritualSustenance] || 0) + playerNetFoodChange;

      let newPlayerDisciples = state.sectHq.disciples;
      let newPlayerAccumulatedFood = state.accumulatedFoodSurplus;
      let newPlayerSectHq = { ...state.sectHq };

      let playerHarmony = HARMONY_BASE - newPlayerDisciples * HARMONY_PENALTY_PER_DISCIPLE;
      playerHarmony = Math.max(0, Math.min(100, playerHarmony));
      newPlayerSectHq.harmony = playerHarmony;

      if (newPlayerResources[YieldType.SpiritualSustenance] < 0) {
         newPlayerAccumulatedFood += newPlayerResources[YieldType.SpiritualSustenance];
         newPlayerResources[YieldType.SpiritualSustenance] = 0;
         addNotification(`Warning: Disciples are starving! Food stockpile depleted.`, 'warning');
      } else if (playerNetFoodChange > 0) {
         newPlayerAccumulatedFood += playerNetFoodChange;
      }
      newPlayerAccumulatedFood = Math.max(0, newPlayerAccumulatedFood);

      let playerCanGrowDisciples = true;
      if (newPlayerSectHq.harmony <= LOW_HARMONY_THRESHOLD) {
        playerCanGrowDisciples = false;
        addNotification(`Sect Harmony is low (${newPlayerSectHq.harmony}%)! Growth halted.`, 'warning');
      }
      if (newPlayerSectHq.harmony <= VERY_LOW_HARMONY_THRESHOLD) {
        addNotification(`Sect Harmony critical (${newPlayerSectHq.harmony}%)! Risk of loss.`, 'error');
        if (Math.random() < DISCIPLE_LOSS_CHANCE_ON_VERY_LOW_HARMONY && newPlayerDisciples > 1) {
          newPlayerDisciples--;
          addNotification(`A disciple perished due to critical Harmony!`, 'error');
        }
      }
      newPlayerSectHq.disciples = newPlayerDisciples;

      let currentTotalAssignedSpecialists = newPlayerSectHq.districts.reduce((sum, d) => sum + d.assignedSpecialists, 0);
      if (newPlayerSectHq.disciples < currentTotalAssignedSpecialists) {
          let deficit = currentTotalAssignedSpecialists - newPlayerSectHq.disciples;
          const updatedDistrictsSpecialists = [...newPlayerSectHq.districts];
          for (let i = 0; i < deficit; i++) {
              for (let j = updatedDistrictsSpecialists.length - 1; j >= 0; j--) {
                  if (updatedDistrictsSpecialists[j].assignedSpecialists > 0) {
                      updatedDistrictsSpecialists[j] = {
                          ...updatedDistrictsSpecialists[j],
                          assignedSpecialists: updatedDistrictsSpecialists[j].assignedSpecialists - 1,
                      };
                      addNotification(`A specialist was lost from ${updatedDistrictsSpecialists[j].name} (Player).`, 'warning');
                      break; 
                  }
              }
          }
          newPlayerSectHq.districts = updatedDistrictsSpecialists;
      }

      if (playerCanGrowDisciples && newPlayerAccumulatedFood >= FOOD_PER_DISCIPLE && newPlayerSectHq.disciples < newPlayerSectHq.maxDisciples) {
        const potentialNew = Math.floor(newPlayerAccumulatedFood / FOOD_PER_DISCIPLE);
        const canHouseNew = newPlayerSectHq.maxDisciples - newPlayerSectHq.disciples;
        const actualNew = Math.min(potentialNew, canHouseNew);
        if (actualNew > 0) {
            newPlayerSectHq.disciples += actualNew;
            newPlayerAccumulatedFood -= actualNew * FOOD_PER_DISCIPLE;
            addNotification(`${actualNew} new disciple(s) joined your sect!`, 'info');
        }
      }
      
      // AI SECTS' TURN PROCESSING
      const newAiSects = state.aiSects.map(aiSect => {
        const updatedAiSect = { ...aiSect, currentResources: { ...aiSect.currentResources } };
        const aiGrossYields = calculateGrossYieldsPerTurn(updatedAiSect, undefined, true);

        (Object.keys(aiGrossYields) as YieldType[]).forEach(key => {
            if (key !== YieldType.SpiritualSustenance) {
                 updatedAiSect.currentResources[key] = (updatedAiSect.currentResources[key] || 0) + (aiGrossYields[key] || 0);
            }
        });
        
        const aiFoodProduced = aiGrossYields[YieldType.SpiritualSustenance] || 0;
        const aiFoodConsumed = updatedAiSect.disciples;
        const aiNetFoodChange = aiFoodProduced - aiFoodConsumed;

        updatedAiSect.currentResources[YieldType.SpiritualSustenance] = (updatedAiSect.currentResources[YieldType.SpiritualSustenance] || 0) + aiNetFoodChange;
        
        if (updatedAiSect.currentResources[YieldType.SpiritualSustenance] < 0) {
            updatedAiSect.accumulatedFoodSurplus += updatedAiSect.currentResources[YieldType.SpiritualSustenance];
            updatedAiSect.currentResources[YieldType.SpiritualSustenance] = 0;
        } else if (aiNetFoodChange > 0) {
            updatedAiSect.accumulatedFoodSurplus += aiNetFoodChange;
        }
        updatedAiSect.accumulatedFoodSurplus = Math.max(0, updatedAiSect.accumulatedFoodSurplus);

        updatedAiSect.harmony = Math.max(0, Math.min(100, HARMONY_BASE - updatedAiSect.disciples * HARMONY_PENALTY_PER_DISCIPLE));
        
        // AI Disciple Growth (simplified, no harmony penalty on growth/loss for now)
        if (updatedAiSect.accumulatedFoodSurplus >= FOOD_PER_DISCIPLE && updatedAiSect.disciples < updatedAiSect.maxDisciples) {
            const potentialNewAiDisciples = Math.floor(updatedAiSect.accumulatedFoodSurplus / FOOD_PER_DISCIPLE);
            const canHouseNewAiDisciples = updatedAiSect.maxDisciples - updatedAiSect.disciples;
            const actualNewAiDisciples = Math.min(potentialNewAiDisciples, canHouseNewAiDisciples);

            if (actualNewAiDisciples > 0) {
                updatedAiSect.disciples += actualNewAiDisciples;
                updatedAiSect.accumulatedFoodSurplus -= actualNewAiDisciples * FOOD_PER_DISCIPLE;
                // No notification for AI sect growth to player
            }
        }
        // AI Housing Upgrade (simple placeholder logic)
        // If AI has enough resources and is near housing cap, it might "upgrade" housing
        const aiHousingUpgradeCost = calculateHousingUpgradeCost(updatedAiSect.housingLevel);
        let canAiAffordHousing = true;
        for (const key in aiHousingUpgradeCost) {
            if ((updatedAiSect.currentResources[key as YieldType] || 0) < (aiHousingUpgradeCost[key as YieldType] || 0)) {
                canAiAffordHousing = false;
                break;
            }
        }
        if (canAiAffordHousing && updatedAiSect.disciples >= updatedAiSect.maxDisciples -1 && Math.random() < 0.25) { // 25% chance if conditions met
             for (const key in aiHousingUpgradeCost) {
                updatedAiSect.currentResources[key as YieldType] -= (aiHousingUpgradeCost[key as YieldType] || 0);
            }
            updatedAiSect.housingLevel++;
            updatedAiSect.maxDisciples = updatedAiSect.housingLevel * HOUSING_PER_LEVEL;
        }


        return updatedAiSect;
      });


      return {
        ...state,
        turn: state.turn + 1,
        currentResources: newPlayerResources,
        sectHq: newPlayerSectHq,
        accumulatedFoodSurplus: newPlayerAccumulatedFood,
        notifications: newNotifications.filter(n => (state.turn + 1) - n.turn < 5), // Keep notifications for 5 turns
        aiSects: newAiSects,
      };
    }
    case GameActionType.BUILD_DISTRICT: {
      const districtDef = DISTRICT_DEFINITIONS.find(d => d.id === action.payload);
      if (!districtDef) return state;

      let canAfford = true;
      for (const key in districtDef.cost) {
        const yieldKey = key as YieldType;
        if ((state.currentResources[yieldKey] || 0) < (districtDef.cost[yieldKey] || 0)) {
          canAfford = false;
          break;
        }
      }

      if (!canAfford) {
        addNotification(`Not enough resources to build ${districtDef.name}.`, 'warning');
        return {...state, notifications: newNotifications};
      }

      const nResources = { ...state.currentResources };
      for (const key in districtDef.cost) {
        const yieldKey = key as YieldType;
        nResources[yieldKey] = (nResources[yieldKey] || 0) - (districtDef.cost[yieldKey] || 0);
      }

      const newDistrict: BuiltDistrict = {...districtDef, tier: 1, assignedSpecialists: 0};
      addNotification(`${districtDef.name} constructed (Tier 1).`, 'success');
      return {
        ...state,
        currentResources: nResources,
        sectHq: {
          ...state.sectHq,
          districts: [...state.sectHq.districts, newDistrict],
        },
        notifications: newNotifications,
      };
    }
     case GameActionType.UPGRADE_DISTRICT: {
      const districtToUpgradeIndex = state.sectHq.districts.findIndex(d => d.id === action.payload);
      if (districtToUpgradeIndex === -1) return state;

      const district = state.sectHq.districts[districtToUpgradeIndex];
      if (district.tier >= district.maxTier) {
        addNotification(`${district.name} is already at max tier.`, 'info');
        return {...state, notifications: newNotifications};
      }

      const upgradeCost = calculateDistrictUpgradeCost(district);
      let canAfford = true;
      for (const key in upgradeCost) {
        const yieldKey = key as YieldType;
        if ((state.currentResources[yieldKey] || 0) < (upgradeCost[yieldKey] || 0)) {
          canAfford = false;
          break;
        }
      }

      if (!canAfford) {
        addNotification(`Not enough resources to upgrade ${district.name} to Tier ${district.tier + 1}.`, 'warning');
        return {...state, notifications: newNotifications};
      }

      const nResources = { ...state.currentResources };
      for (const key in upgradeCost) {
        const yieldKey = key as YieldType;
        nResources[yieldKey] = (nResources[yieldKey] || 0) - (upgradeCost[yieldKey] || 0);
      }

      const updatedDistricts = [...state.sectHq.districts];
      updatedDistricts[districtToUpgradeIndex] = {
        ...district,
        tier: district.tier + 1,
      };

      addNotification(`${district.name} upgraded to Tier ${district.tier + 1}!`, 'success');
      return {
        ...state,
        currentResources: nResources,
        sectHq: {
          ...state.sectHq,
          districts: updatedDistricts,
        },
        notifications: newNotifications,
      };
    }
    case GameActionType.RESEARCH_ENLIGHTENMENT: {
      const enlightenmentDef = ENLIGHTENMENT_DEFINITIONS.find(e => e.id === action.payload);
      if (!enlightenmentDef || state.researchedEnlightenments.has(action.payload)) return state;

      if ((state.currentResources[YieldType.Insight] || 0) < enlightenmentDef.cost) {
        addNotification(`Not enough Insight to research ${enlightenmentDef.name}.`, 'warning');
        return {...state, notifications: newNotifications};
      }

      const nResources = { ...state.currentResources };
      nResources[YieldType.Insight] = (nResources[YieldType.Insight] || 0) - enlightenmentDef.cost;

      const newResearchedEnlightenments = new Set(state.researchedEnlightenments);
      newResearchedEnlightenments.add(action.payload);
      addNotification(`${enlightenmentDef.name} researched.`, 'success');
      return {
        ...state,
        currentResources: nResources,
        researchedEnlightenments: newResearchedEnlightenments,
        notifications: newNotifications,
      };
    }
    case GameActionType.UPGRADE_HOUSING: {
        const currentHousingLevel = state.sectHq.housingLevel;
        const upgradeCost = calculateHousingUpgradeCost(currentHousingLevel);

        let canAfford = true;
        for (const key in upgradeCost) {
            const yieldKey = key as YieldType;
            if((state.currentResources[yieldKey] || 0) < (upgradeCost[yieldKey] || 0)) {
                canAfford = false;
                break;
            }
        }

        if(!canAfford) {
            addNotification('Not enough resources to expand Cultivation Grottoes.', 'warning');
            return {...state, notifications: newNotifications};
        }

        const nResources = { ...state.currentResources };
        for (const key in upgradeCost) {
            const yieldKey = key as YieldType;
            nResources[yieldKey] = (nResources[yieldKey] || 0) - (upgradeCost[yieldKey] || 0);
        }

        const newHousingLevel = currentHousingLevel + 1;
        const newMaxDisciples = newHousingLevel * HOUSING_PER_LEVEL;

        addNotification(`Cultivation Grottoes expanded to Level ${newHousingLevel}. Max disciples now ${newMaxDisciples}.`, 'success');
        return {
            ...state,
            currentResources: nResources,
            sectHq: {
                ...state.sectHq,
                housingLevel: newHousingLevel,
                maxDisciples: newMaxDisciples,
            },
            notifications: newNotifications,
        };
    }
    case GameActionType.ASSIGN_SPECIALIST: {
        const districtIndex = state.sectHq.districts.findIndex(d => d.id === action.payload);
        if (districtIndex === -1) return state;

        const district = state.sectHq.districts[districtIndex];
        const maxSpecialistsForDistrict = district.specialistSlotsPerTier[district.tier - 1];
        const totalAssignedSpecialists = state.sectHq.districts.reduce((sum, d) => sum + d.assignedSpecialists, 0);
        const unassignedDisciples = state.sectHq.disciples - totalAssignedSpecialists;

        if (unassignedDisciples <= 0) {
            addNotification('No unassigned disciples available to assign as specialist.', 'warning');
            return {...state, notifications: newNotifications};
        }
        if (district.assignedSpecialists >= maxSpecialistsForDistrict) {
            addNotification(`${district.name} has no available specialist slots at its current tier.`, 'warning');
            return {...state, notifications: newNotifications};
        }

        const updatedDistricts = [...state.sectHq.districts];
        updatedDistricts[districtIndex] = {
            ...district,
            assignedSpecialists: district.assignedSpecialists + 1,
        };
        addNotification(`A disciple has been assigned as a specialist in ${district.name}.`, 'success');
        return {
            ...state,
            sectHq: { ...state.sectHq, districts: updatedDistricts },
            notifications: newNotifications,
        };
    }
    case GameActionType.UNASSIGN_SPECIALIST: {
        const districtIndex = state.sectHq.districts.findIndex(d => d.id === action.payload);
        if (districtIndex === -1) return state;

        const district = state.sectHq.districts[districtIndex];
        if (district.assignedSpecialists <= 0) {
            addNotification(`No specialists to unassign from ${district.name}.`, 'info');
            return {...state, notifications: newNotifications};
        }

        const updatedDistricts = [...state.sectHq.districts];
        updatedDistricts[districtIndex] = {
            ...district,
            assignedSpecialists: district.assignedSpecialists - 1,
        };
        addNotification(`A specialist has been unassigned from ${district.name}.`, 'success');
        return {
            ...state,
            sectHq: { ...state.sectHq, districts: updatedDistricts },
            notifications: newNotifications,
        };
    }
     case GameActionType.DECLARE_WAR_ON_AI: {
        const aiSectIndex = state.aiSects.findIndex(ai => ai.id === action.payload);
        if (aiSectIndex === -1) return state;
        const updatedAiSects = [...state.aiSects];
        updatedAiSects[aiSectIndex] = { ...updatedAiSects[aiSectIndex], diplomaticStatus: DiplomaticStatus.WAR };
        addNotification(`You have declared war on ${updatedAiSects[aiSectIndex].name}!`, 'warning');
        return { ...state, aiSects: updatedAiSects, notifications: newNotifications };
    }
    case GameActionType.MAKE_PEACE_WITH_AI: {
        const aiSectIndex = state.aiSects.findIndex(ai => ai.id === action.payload);
        if (aiSectIndex === -1) return state;
        const updatedAiSects = [...state.aiSects];
        // For now, AI always accepts peace. Future: AI might refuse.
        updatedAiSects[aiSectIndex] = { ...updatedAiSects[aiSectIndex], diplomaticStatus: DiplomaticStatus.PEACE };
        addNotification(`Peace has been established with ${updatedAiSects[aiSectIndex].name}.`, 'success');
        return { ...state, aiSects: updatedAiSects, notifications: newNotifications };
    }
    case GameActionType.ADD_NOTIFICATION:
        newNotifications.push({ ...action.payload, id: Date.now().toString(), turn: state.turn });
        return { ...state, notifications: newNotifications };
    case GameActionType.INTERNAL_ADD_NOTIFICATION:
        newNotifications.push({ ...action.payload, id: Date.now().toString() });
        return { ...state, notifications: newNotifications };
    case GameActionType.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    default:
      return state;
  }
};


const App: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  const handleNextTurn = useCallback(() => {
    dispatch({ type: GameActionType.NEXT_TURN });
  }, []);

  const handleBuildDistrict = useCallback((districtId: DistrictId) => {
    dispatch({ type: GameActionType.BUILD_DISTRICT, payload: districtId });
  }, []);

  const handleUpgradeDistrict = useCallback((districtId: DistrictId) => {
    dispatch({ type: GameActionType.UPGRADE_DISTRICT, payload: districtId });
  }, []);

  const handleResearchEnlightenment = useCallback((enlightenmentId: EnlightenmentId) => {
    dispatch({ type: GameActionType.RESEARCH_ENLIGHTENMENT, payload: enlightenmentId });
  }, []);

  const handleUpgradeHousing = useCallback(() => {
    dispatch({ type: GameActionType.UPGRADE_HOUSING });
  }, []);

  const handleAssignSpecialist = useCallback((districtId: DistrictId) => {
    dispatch({ type: GameActionType.ASSIGN_SPECIALIST, payload: districtId });
  }, []);

  const handleUnassignSpecialist = useCallback((districtId: DistrictId) => {
    dispatch({ type: GameActionType.UNASSIGN_SPECIALIST, payload: districtId });
  }, []);

  const handleDeclareWar = useCallback((aiSectId: string) => {
    dispatch({ type: GameActionType.DECLARE_WAR_ON_AI, payload: aiSectId });
  }, []);

  const handleMakePeace = useCallback((aiSectId: string) => {
    dispatch({ type: GameActionType.MAKE_PEACE_WITH_AI, payload: aiSectId });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    dispatch({ type: GameActionType.DISMISS_NOTIFICATION, payload: id });
  }, []);

  const availableDistricts = DISTRICT_DEFINITIONS.filter(def => {
    const alreadyBuilt = gameState.sectHq.districts.some(d => d.id === def.id);
    if (alreadyBuilt) return false;
    if (!def.unlockedBy) return true;
    return gameState.researchedEnlightenments.has(def.unlockedBy);
  });

  const availableEnlightenments = ENLIGHTENMENT_DEFINITIONS.filter(def => {
    if (gameState.researchedEnlightenments.has(def.id)) return false;
    if (!def.prerequisites || def.prerequisites.length === 0) return true;
    return def.prerequisites.every(prereq => gameState.researchedEnlightenments.has(prereq));
  });

  const grossYieldsPerTurn = calculateGrossYieldsPerTurn(gameState.sectHq, gameState.researchedEnlightenments);
  const displayYieldsPerTurn: Yields = {
    ...grossYieldsPerTurn,
    [YieldType.SpiritualSustenance]: (grossYieldsPerTurn[YieldType.SpiritualSustenance] || 0) - gameState.sectHq.disciples,
  };

  const getHarmonyColorClass = (harmony: number): string => {
    if (harmony <= VERY_LOW_HARMONY_THRESHOLD) return HARMONY_STATUS_COLORS.very_low;
    if (harmony <= LOW_HARMONY_THRESHOLD) return HARMONY_STATUS_COLORS.low;
    // Could add a 'high' harmony color if needed
    return HARMONY_STATUS_COLORS.normal; 
  };

  const totalAssignedSpecialists = gameState.sectHq.districts.reduce((sum, d) => sum + d.assignedSpecialists, 0);
  const unassignedDisciples = gameState.sectHq.disciples - totalAssignedSpecialists;


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4 space-y-4">
      <header className="bg-gray-800 p-4 rounded-lg shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">{gameState.sectHq.name}</h1>
          <div className="text-xl">Turn: <span className="font-semibold text-amber-400">{gameState.turn}</span></div>
        </div>
      </header>

      <ResourceDisplay currentResources={gameState.currentResources} yieldsPerTurn={displayYieldsPerTurn} />

      <NotificationArea notifications={gameState.notifications} onDismiss={dismissNotification} />

      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-250px)]">
          <SectManagementPanel
            sectHq={gameState.sectHq}
            onBuildDistrict={handleBuildDistrict}
            onUpgradeDistrict={handleUpgradeDistrict}
            onUpgradeHousing={handleUpgradeHousing}
            onAssignSpecialist={handleAssignSpecialist}
            onUnassignSpecialist={handleUnassignSpecialist}
            availableDistricts={availableDistricts}
            currentResources={gameState.currentResources}
            unassignedDisciples={unassignedDisciples}
          />
        </div>
        <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-250px)]">
           <h2 className="text-xl font-semibold mb-3 text-cyan-400 border-b border-gray-700 pb-2">Sect Overview</h2>
            <div className="mt-1 p-3 bg-gray-700/50 rounded space-y-2">
                <h3 className="text-lg font-medium text-amber-300 mb-2">Status</h3>
                <div className="flex items-center space-x-2">
                    {STAT_ICONS.DISCIPLES}
                    <p>Disciples: <span className="font-semibold">{gameState.sectHq.disciples}</span> / {gameState.sectHq.maxDisciples} ({STAT_ICONS.HOUSING} Grottoes Lv {gameState.sectHq.housingLevel})</p>
                </div>
                 <p>Unassigned Disciples: <span className="font-semibold">{unassignedDisciples}</span></p>
                <div className="flex items-center space-x-2">
                    {STAT_ICONS.HARMONY}
                    <p>Harmony: <span className={`font-semibold ${getHarmonyColorClass(gameState.sectHq.harmony)}`}>{gameState.sectHq.harmony}%</span></p>
                </div>
                <p>Accumulated Food for Growth: <span className="font-semibold">{gameState.accumulatedFoodSurplus}</span> / {FOOD_PER_DISCIPLE}</p>
            </div>
            
            <div className="mt-4 p-3 bg-gray-700/50 rounded space-y-2">
                <h3 className="text-lg font-medium text-purple-300 mb-2">Other Sects</h3>
                {gameState.aiSects.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                        {gameState.aiSects.map(aiSect => (
                            <li key={aiSect.id} className="p-2 bg-gray-600/40 rounded">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {STAT_ICONS.AI_SECT}
                                        <span className="font-semibold">{aiSect.name}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                        aiSect.diplomaticStatus === DiplomaticStatus.WAR ? 'bg-red-700 text-red-100' : 'bg-sky-700 text-sky-100'
                                    }`}>
                                        {aiSect.diplomaticStatus === DiplomaticStatus.WAR ? STAT_ICONS.WAR_ICON : STAT_ICONS.PEACE_ICON} {aiSect.diplomaticStatus}
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-gray-300 space-y-0.5">
                                    <p>Disciples: {aiSect.disciples} / {aiSect.maxDisciples} (Grottoes Lv {aiSect.housingLevel})</p>
                                    <p>Harmony: <span className={getHarmonyColorClass(aiSect.harmony)}>{aiSect.harmony}%</span></p>
                                    {/* Optionally show some AI resources if needed for debugging or future UI:
                                    <p>Spirit Stones: {Math.floor(aiSect.currentResources[YieldType.SpiritStones] || 0)}</p> */}
                                </div>
                                <div className="mt-2 flex space-x-2">
                                    {aiSect.diplomaticStatus === DiplomaticStatus.PEACE ? (
                                        <button
                                            onClick={() => handleDeclareWar(aiSect.id)}
                                            className="px-2 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded shadow-sm transition-colors"
                                        >
                                            Declare War
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMakePeace(aiSect.id)}
                                            className="px-2 py-1 text-xs bg-sky-600 hover:bg-sky-500 text-white rounded shadow-sm transition-colors"
                                        >
                                            Offer Peace
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-400 italic">No other major sects known.</p>
                )}
            </div>

             <div className="aspect-video bg-gray-700/30 rounded flex items-center justify-center mt-4">
              <p className="text-gray-500 italic">Game Map Area (Future)</p>
            </div>
        </div>
        <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-250px)]">
          <EnlightenmentPanel
            enlightenments={availableEnlightenments}
            researchedEnlightenments={gameState.researchedEnlightenments}
            currentInsight={gameState.currentResources[YieldType.Insight] || 0}
            onResearch={handleResearchEnlightenment}
            allEnlightenments={ENLIGHTENMENT_DEFINITIONS}
          />
        </div>
      </main>

      <footer className="bg-gray-800 p-4 rounded-lg shadow-xl flex justify-end">
        <button
          onClick={handleNextTurn}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          aria-label={`End Turn ${gameState.turn}, Start Turn ${gameState.turn + 1}`}
        >
          End Turn ({gameState.turn})
        </button>
      </footer>
    </div>
  );
};

export default App;