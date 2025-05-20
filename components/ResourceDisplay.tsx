
import React from 'react';
import { Yields, YieldType } from '../types';
import { YIELD_ICONS, YIELD_COLORS, DisciplesIcon } from '../constants'; // DisciplesIcon added

interface ResourceDisplayProps {
  currentResources: Yields;
  yieldsPerTurn: Yields;
}

const ResourceItem: React.FC<{ icon: React.ReactNode; label: string; value: number; perTurn?: number; colorClass: string }> = ({ icon, label, value, perTurn, colorClass }) => (
  <div className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg min-w-[150px]">
    <span className={`p-1 rounded-full bg-gray-600 ${colorClass}`}>{icon}</span>
    <div>
      <div className={`text-sm font-medium ${colorClass}`}>{label}</div>
      <div className="text-lg font-semibold text-gray-100">{value.toLocaleString()}</div>
      {perTurn !== undefined && (
        <div className={`text-xs ${perTurn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ({perTurn >= 0 ? '+' : ''}{perTurn.toLocaleString()}/turn)
        </div>
      )}
    </div>
  </div>
);

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ currentResources, yieldsPerTurn }) => {
  const order: YieldType[] = [
    YieldType.SpiritStones,
    YieldType.Insight,
    YieldType.SpiritualSustenance,
    YieldType.CraftingMight,
    YieldType.SectPrestige,
    YieldType.SpiritualEnergy,
  ];
  
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {/* Special display for Disciples, as it's not a typical "yield" but a core stat from sectHq */}
        {/* This component doesn't have direct access to sectHq.disciples. We'll keep it focused on Yields from currentResources. */}
        {/* If disciples were needed here, it would require passing gameState.sectHq.disciples */}

        {order.map(yieldType => (
          <ResourceItem
            key={yieldType}
            icon={YIELD_ICONS[yieldType]}
            label={yieldType}
            value={Math.floor(currentResources[yieldType] || 0)}
            perTurn={Math.floor(yieldsPerTurn[yieldType] || 0)}
            colorClass={YIELD_COLORS[yieldType]}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceDisplay;
    