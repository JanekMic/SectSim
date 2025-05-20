import React from 'react';
import { SectLocation, DistrictDefinition, DistrictId, Yields, YieldType, BuiltDistrict } from '../types';
import { YIELD_ICONS, YIELD_COLORS, ArrowUpCircleIcon, STAT_ICONS, HOUSING_UPGRADE_BASE_COST, HARMONY_STATUS_COLORS, LOW_HARMONY_THRESHOLD, VERY_LOW_HARMONY_THRESHOLD } from '../constants';
import { calculateDistrictUpgradeCost, calculateHousingUpgradeCost } from '../App';

interface SectManagementPanelProps {
  sectHq: SectLocation;
  availableDistricts: DistrictDefinition[];
  onBuildDistrict: (districtId: DistrictId) => void;
  onUpgradeDistrict: (districtId: DistrictId) => void;
  onUpgradeHousing: () => void;
  onAssignSpecialist: (districtId: DistrictId) => void;
  onUnassignSpecialist: (districtId: DistrictId) => void;
  currentResources: Yields;
  unassignedDisciples: number;
}

const SectManagementPanel: React.FC<SectManagementPanelProps> = ({
  sectHq,
  availableDistricts,
  onBuildDistrict,
  onUpgradeDistrict,
  onUpgradeHousing,
  onAssignSpecialist,
  onUnassignSpecialist,
  currentResources,
  unassignedDisciples,
}) => {

  const canAfford = (cost: Yields): boolean => {
    for (const key in cost) {
      const yieldKey = key as YieldType;
      if ((currentResources[yieldKey] || 0) < (cost[yieldKey] || 0)) {
        return false;
      }
    }
    return true;
  };

  const housingUpgradeCost = calculateHousingUpgradeCost(sectHq.housingLevel);
  const canAffordHousingUpgrade = canAfford(housingUpgradeCost);

  const getHarmonyColorClass = (harmony: number): string => {
    if (harmony <= VERY_LOW_HARMONY_THRESHOLD) return HARMONY_STATUS_COLORS.very_low;
    if (harmony <= LOW_HARMONY_THRESHOLD) return HARMONY_STATUS_COLORS.low;
    return HARMONY_STATUS_COLORS.normal;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-400 border-b border-gray-700 pb-2">{sectHq.name} - HQ Management</h2>

      <div className="p-3 bg-gray-700/40 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-amber-300 mb-2 flex items-center space-x-2">
          {STAT_ICONS.HOUSING}
          <span>Cultivation Grottoes (Housing)</span>
        </h3>
        <div className="space-y-1 text-sm">
            <p>Grotto Level: <span className="font-semibold">{sectHq.housingLevel}</span></p>
            <p>Max Disciples: <span className="font-semibold">{sectHq.maxDisciples}</span></p>
            <div className="text-xs text-gray-300 mt-2">
                Upgrade to Level {sectHq.housingLevel + 1} Cost:
                {Object.keys(housingUpgradeCost).length > 0 ? (
                    Object.entries(housingUpgradeCost).map(([key, value]) => (
                    <span key={key} className={`ml-2 ${ (currentResources[key as YieldType] || 0) < (value || 0) ? 'text-red-400' : YIELD_COLORS[key as YieldType]}`}>
                        {value} {key}
                    </span>
                    ))
                ) : (
                    <span className="ml-2 text-gray-400 italic">N/A</span>
                )}
            </div>
        </div>
        <button
            onClick={onUpgradeHousing}
            disabled={!canAffordHousingUpgrade}
            aria-label={`Upgrade Cultivation Grottoes to Level ${sectHq.housingLevel + 1}`}
            className={`mt-3 w-full px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center space-x-1 ${
                canAffordHousingUpgrade
                ? 'bg-lime-600 hover:bg-lime-500 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
        >
            <ArrowUpCircleIcon />
            <span>Expand Grottoes</span>
        </button>
      </div>

      <div className="p-3 bg-gray-700/30 rounded-md">
        <h3 className="text-md font-medium text-amber-200 mb-1">Core Stats</h3>
        <div className="flex items-center space-x-2 text-sm">
            {STAT_ICONS.DISCIPLES}
            <p>Total Disciples: <span className="font-semibold">{sectHq.disciples}</span> / {sectHq.maxDisciples} (Housing Cap)</p>
        </div>
         <div className="flex items-center space-x-2 text-sm mt-1">
             {STAT_ICONS.USER_PLUS} {/* Using a generic user icon for unassigned */}
             <p>Unassigned Disciples: <span className="font-semibold">{unassignedDisciples}</span></p>
        </div>
        <div className="flex items-center space-x-2 text-sm mt-1">
            {STAT_ICONS.HARMONY}
             <p>Harmony: <span className={`font-semibold ${getHarmonyColorClass(sectHq.harmony)}`}>{sectHq.harmony}%</span></p>
        </div>
      </div>


      <div>
        <h3 className="text-lg font-medium text-amber-300 mb-2">Built Districts</h3>
        {sectHq.districts.length === 0 ? (
          <p className="text-gray-400 italic">No districts built yet.</p>
        ) : (
          <ul className="space-y-3">
            {sectHq.districts.map(district => {
              const isMaxTier = district.tier >= district.maxTier;
              const upgradeCost = isMaxTier ? {} : calculateDistrictUpgradeCost(district);
              const affordableForUpgrade = isMaxTier ? false : canAfford(upgradeCost);
              const maxSpecialistsForTier = district.specialistSlotsPerTier[district.tier - 1];
              const canAssignMoreSpecialists = unassignedDisciples > 0 && district.assignedSpecialists < maxSpecialistsForTier;
              const canUnassignSpecialists = district.assignedSpecialists > 0;

              return (
                <li key={district.id} className="p-3 bg-gray-700/50 rounded-md shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">{district.icon}</span>
                        <span className="font-medium">{district.name}</span>
                        <span className="text-xs px-1.5 py-0.5 bg-cyan-700 rounded-full">Tier {district.tier}/{district.maxTier}</span>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Base Yields: {Object.entries(district.baseYields).map(([key, value]) => (
                          <span key={key} className={`mr-2 ${YIELD_COLORS[key as YieldType]}`}>
                            +{value} {key}
                          </span>
                        ))}
                      </div>
                       <div className="text-xs text-gray-300 mt-1">
                        Current Effective Yields (Tier): {Object.entries(district.baseYields).map(([key, value]) => (
                          <span key={key} className={`mr-2 ${YIELD_COLORS[key as YieldType]}`}>
                            +{(value || 0) * district.tier} {key}
                          </span>
                        ))}
                      </div>
                       <div className="text-xs text-gray-300 mt-1">
                        Specialist Bonus: {Object.entries(district.specialistYieldBonus).map(([key, value]) => (
                          <span key={key} className={`mr-2 ${YIELD_COLORS[key as YieldType]}`}>
                            +{value}/specialist {key}
                          </span>
                        ))}
                      </div>
                      {!isMaxTier && (
                        <div className="text-xs text-gray-300 mt-2">
                          Upgrade to Tier {district.tier + 1} Cost: {Object.entries(upgradeCost).map(([key, value]) => (
                            <span key={key} className={`mr-2 ${ (currentResources[key as YieldType] || 0) < (value || 0) ? 'text-red-400' : YIELD_COLORS[key as YieldType]}`}>
                              {value} {key}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {!isMaxTier && (
                       <button
                        onClick={() => onUpgradeDistrict(district.id)}
                        disabled={!affordableForUpgrade}
                        aria-label={`Upgrade ${district.name} to Tier ${district.tier + 1}`}
                        className={`ml-2 mt-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1 ${
                          affordableForUpgrade
                          ? 'bg-sky-600 hover:bg-sky-500 text-white'
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUpCircleIcon />
                        <span>Upgrade</span>
                      </button>
                    )}
                    {isMaxTier && (
                        <span className="text-xs font-semibold text-green-300 px-2 py-1 bg-green-800/70 rounded-full mt-1">Max Tier</span>
                    )}
                  </div>
                  {/* Specialist Assignment UI */}
                  <div className="mt-2 pt-2 border-t border-gray-600/50">
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-300">
                        Specialists: <span className="font-semibold">{district.assignedSpecialists}</span> / {maxSpecialistsForTier}
                      </p>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onAssignSpecialist(district.id)}
                          disabled={!canAssignMoreSpecialists}
                          aria-label={`Assign specialist to ${district.name}`}
                          title="Assign Specialist"
                          className={`p-1 rounded transition-colors ${
                            canAssignMoreSpecialists ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {STAT_ICONS.USER_PLUS}
                        </button>
                        <button
                          onClick={() => onUnassignSpecialist(district.id)}
                          disabled={!canUnassignSpecialists}
                          aria-label={`Unassign specialist from ${district.name}`}
                          title="Unassign Specialist"
                          className={`p-1 rounded transition-colors ${
                            canUnassignSpecialists ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {STAT_ICONS.USER_MINUS}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-amber-300 mb-2">Available Districts to Build</h3>
        {availableDistricts.length === 0 ? (
          <p className="text-gray-400 italic">No new districts available. Research more Enlightenments or all districts are built.</p>
        ) : (
          <ul className="space-y-3">
            {availableDistricts.map(districtDef => {
              const affordable = canAfford(districtDef.cost);
              return (
                <li key={districtDef.id} className="p-3 bg-gray-700/70 rounded-md shadow-md hover:bg-gray-600/70 transition-colors duration-150">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sky-400">{districtDef.icon}</span>
                        <h4 className="font-semibold text-md">{districtDef.name}</h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{districtDef.description}</p>
                       <div className="text-xs text-gray-300 mt-1">
                        Cost (Tier 1): {Object.entries(districtDef.cost).map(([key, value]) => (
                          <span key={key} className={`mr-2 ${ (currentResources[key as YieldType] || 0) < (value || 0) ? 'text-red-400' : YIELD_COLORS[key as YieldType]}`}>
                            {value} {key}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => onBuildDistrict(districtDef.id)}
                      disabled={!affordable}
                      aria-label={`Build ${districtDef.name}`}
                      className={`ml-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        affordable
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Build
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SectManagementPanel;