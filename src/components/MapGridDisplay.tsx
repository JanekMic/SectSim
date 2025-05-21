import React from 'react';
import { MapGrid, Tile, AnyUnit, BranchSect, TileImprovementType } from '../types'; // Updated Unit to AnyUnit
import './MapGridDisplay.css';

interface MapGridDisplayProps {
  mapGrid: MapGrid;
  units: AnyUnit[]; // Changed Unit[] to AnyUnit[]
  branchSects: BranchSect[];
  onTileClick: (tile: Tile) => void;
  selectedUnitId?: string | null;
}

const MapGridDisplay: React.FC<MapGridDisplayProps> = ({
  mapGrid,
  units,
  branchSects,
  onTileClick,
  selectedUnitId,
}) => {
  const getUnitOnTile = (x: number, y: number): AnyUnit | undefined => { // Changed return type
    return units.find(unit => unit.x === x && unit.y === y);
  };

  const getBranchSectOnTile = (x: number, y: number): BranchSect | undefined => {
    return branchSects.find(sect => sect.x === x && sect.y === y);
  };

  return (
    <div className="map-grid-container">
      {mapGrid.map((row, y) => (
        <div key={y} className="map-grid-row">
          {row.map((tile) => {
            const unit = getUnitOnTile(tile.x, tile.y);
            const sect = getBranchSectOnTile(tile.x, tile.y);
            const resource = tile.resource;
            const improvement = tile.improvement;

            let tileContent = '';
            let titleText = `(${tile.x}, ${tile.y}) - ${tile.type}`;
            let tileClass = `map-tile ${tile.type}`;

            if (unit) {
              if (unit.type === 'PioneeringElder') tileContent = 'E';
              else if (unit.type === 'FormationScribe') tileContent = 'F';
              else tileContent = 'U'; // Default for unknown units
              
              tileClass += ' unit';
              if (unit.id === selectedUnitId) {
                tileClass += ' selected-unit';
              }
              titleText += ` | Unit: ${unit.type}`;
            } else if (sect) {
              tileContent = 'S'; // Representing a Sect
              tileClass += ' sect';
              titleText += ` | Sect: ${sect.name}`;
            } else if (improvement && improvement.active) {
                // Display improvement if no unit or sect on top
                switch (improvement.type) {
                    case 'QiCondenser': tileContent = 'Q+'; tileClass += ' improvement-qi'; break;
                    case 'SpiritStoneMine': tileContent = '$+'; tileClass += ' improvement-stones'; break;
                    case 'LumberMill': tileContent = 'W+'; tileClass += ' improvement-wood'; break;
                    default: tileContent = 'I+'; // Generic Improvement
                }
            } else if (resource) {
              // Display resource symbol if no unit, sect, or active improvement is on the tile
              switch (resource.type) {
                case 'AmbientQiNode': tileContent = 'Q'; tileClass += ' resource-qi'; break;
                case 'EssenceMaterial_SpiritStones': tileContent = '$'; tileClass += ' resource-stones'; break;
                case 'EssenceMaterial_Ironwood': tileContent = 'W'; tileClass += ' resource-wood'; break;
                default: tileContent = 'R'; // Generic Resource
              }
            }
            
            // Add resource information to title and class
            if (resource) {
              tileClass += ' has-resource';
              titleText += ` | Resource: ${resource.type}`;
              if (resource.quantity !== undefined) titleText += ` (Qty: ${resource.quantity})`;
              if (resource.exploitedBy) {
                tileClass += ' exploited'; // Simplified from 'exploited-resource' for general exploitation indication
                titleText += ` (Exploited by Sect ID: ${resource.exploitedBy})`;
              } else {
                titleText += ` (Unexploited)`;
              }
            }

            // Add improvement information to title and class
            if (improvement) {
              tileClass += ' has-improvement';
              if (improvement.active) tileClass += ' improvement-active';
              titleText += ` | Improvement: ${improvement.type} (${improvement.active ? 'Active' : 'Building'}) by Sect ${improvement.builtBySectId}`;
            }

            return (
              <div
                key={tile.id}
                className={tileClass}
                title={titleText}
                onClick={() => onTileClick(tile)}
              >
                {tileContent || ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MapGridDisplay;
