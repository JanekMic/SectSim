
import React from 'react';
import { EnlightenmentDefinition, EnlightenmentId, YieldType } from '../types';
import { YIELD_ICONS, YIELD_COLORS } from '../constants';

interface EnlightenmentPanelProps {
  enlightenments: EnlightenmentDefinition[]; // Available (purchaseable) to research
  allEnlightenments: EnlightenmentDefinition[]; // All definitions for looking up names/icons for the whole tree
  researchedEnlightenments: Set<EnlightenmentId>;
  currentInsight: number;
  onResearch: (enlightenmentId: EnlightenmentId) => void;
}

interface EnlightenmentNodeProps {
  enlightenment: EnlightenmentDefinition;
  isResearched: boolean;
  canResearchPrerequisitesMet: boolean; // Only prerequisites are met
  isAffordable: boolean; // Only cost is met
  onResearch: (id: EnlightenmentId) => void;
  allEnlightenments: EnlightenmentDefinition[]; // For looking up prerequisite names
  currentInsight: number; 
  researchedEnlightenments: Set<EnlightenmentId>; 
}

const EnlightenmentNode: React.FC<EnlightenmentNodeProps> = ({ 
  enlightenment, 
  isResearched, 
  canResearchPrerequisitesMet, 
  isAffordable,
  onResearch, 
  allEnlightenments,
  currentInsight,
  researchedEnlightenments 
}) => {
  
  const getPrerequisiteName = (id: EnlightenmentId): string => {
    return allEnlightenments.find(e => e.id === id)?.name || 'Unknown Prerequisite';
  };

  const researchableNow = !isResearched && canResearchPrerequisitesMet && isAffordable;

  return (
    <li className={`p-3 rounded-md shadow-md transition-all duration-150 ${
      isResearched ? 'bg-green-700/50 opacity-90' : 
      researchableNow ? 'bg-sky-700/60 hover:bg-sky-600/70' : 
      canResearchPrerequisitesMet ? 'bg-gray-700/70 hover:bg-gray-600/70' : 'bg-gray-800/50 opacity-60 cursor-default'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className={isResearched ? 'text-green-300' : researchableNow ? 'text-sky-300' : canResearchPrerequisitesMet ? 'text-gray-300' : 'text-gray-500'}>{enlightenment.icon}</span>
            <h4 className={`font-semibold text-md ${isResearched ? 'text-green-200' : researchableNow ? 'text-sky-200' : canResearchPrerequisitesMet ? 'text-gray-200' : 'text-gray-400'}`}>{enlightenment.name}</h4>
          </div>
          <p className={`text-xs mt-1 ${isResearched ? 'text-green-300/80' : canResearchPrerequisitesMet ? 'text-gray-400' : 'text-gray-500'}`}>{enlightenment.description}</p>
          {!isResearched && (
            <div className="text-xs text-gray-300 mt-1">
              Cost: <span className={currentInsight < enlightenment.cost && canResearchPrerequisitesMet ? 'text-red-400' : YIELD_COLORS[YieldType.Insight]}>
                {enlightenment.cost} {YieldType.Insight}
              </span>
            </div>
          )}
          {enlightenment.prerequisites && enlightenment.prerequisites.length > 0 && (
            <div className="text-xs mt-1">
              <span className={isResearched || canResearchPrerequisitesMet ? "text-gray-400" : "text-gray-500"}>Requires: </span> 
              {enlightenment.prerequisites.map((prereqId, index) => 
                <span key={prereqId} className={`${researchedEnlightenments.has(prereqId) ? 'text-green-400' : isResearched ? 'text-green-400' : canResearchPrerequisitesMet ? 'text-red-400' : 'text-gray-500'} ml-1`}>
                  {getPrerequisiteName(prereqId)}{index < enlightenment.prerequisites!.length -1 ? ',' : ''}
                </span>
              )}
            </div>
          )}
           {enlightenment.yieldBonus && (
             <div className="text-xs mt-1 text-cyan-400">
                Bonus: {Object.entries(enlightenment.yieldBonus).map(([key, value]) => `+${value} ${key}`).join(', ')}
             </div>
           )}
        </div>
        {!isResearched && (
          <button
            onClick={() => onResearch(enlightenment.id)}
            disabled={!researchableNow}
            aria-label={`Research ${enlightenment.name}`}
            className={`ml-2 mt-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              researchableNow
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : canResearchPrerequisitesMet ? 'bg-gray-600 text-gray-400 cursor-not-allowed' // Affordable but prereqs not met
              : 'bg-gray-700 text-gray-500 cursor-not-allowed' // Default disabled
            }`}
          >
            {isAffordable && !canResearchPrerequisitesMet ? "Locked" : "Research"}
          </button>
        )}
        {isResearched && (
          <span className="text-xs font-semibold text-green-300 px-2 py-1 bg-green-800/70 rounded-full">Researched</span>
        )}
      </div>
    </li>
  );
};


const EnlightenmentPanel: React.FC<EnlightenmentPanelProps> = ({ enlightenments, researchedEnlightenments, currentInsight, onResearch, allEnlightenments }) => {
  // Display all enlightenments, sorted, showing researched status and availability
  const sortedAllEnlightenments = [...allEnlightenments].sort((a,b) => {
    // Basic sort: Researched first, then by cost or availability
    if (researchedEnlightenments.has(a.id) && !researchedEnlightenments.has(b.id)) return -1;
    if (!researchedEnlightenments.has(a.id) && researchedEnlightenments.has(b.id)) return 1;
    return a.cost - b.cost;
  });


  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-cyan-400 border-b border-gray-700 pb-2">Paths of Enlightenment</h2>
      <div className="flex items-center space-x-2 text-sm text-gray-300 p-2 bg-gray-700/30 rounded-md">
        {YIELD_ICONS[YieldType.Insight]} 
        <span>Current Insight:</span>
        <span className={`${YIELD_COLORS[YieldType.Insight]} font-semibold text-lg`}>{currentInsight}</span>
      </div>
      
      {sortedAllEnlightenments.length === 0 ? (
        <p className="text-gray-400 italic">No enlightenments defined.</p>
      ) : (
        <ul className="space-y-3">
          {sortedAllEnlightenments.map(enlightenment => {
            const isResearched = researchedEnlightenments.has(enlightenment.id);
            const prerequisitesMet = !enlightenment.prerequisites || enlightenment.prerequisites.every(prereq => researchedEnlightenments.has(prereq));
            const canAfford = currentInsight >= enlightenment.cost;
            
            return (
              <EnlightenmentNode
                key={enlightenment.id}
                enlightenment={enlightenment}
                isResearched={isResearched}
                canResearchPrerequisitesMet={prerequisitesMet}
                isAffordable={canAfford}
                onResearch={onResearch}
                allEnlightenments={allEnlightenments}
                currentInsight={currentInsight}
                researchedEnlightenments={researchedEnlightenments}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EnlightenmentPanel;
