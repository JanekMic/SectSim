import React, { useEffect, useState, useMemo } from 'react';
import MapGridDisplay from './components/MapGridDisplay';
import { 
  initializeGameState, 
  foundBranchSect, 
  startBuildImprovement, // Import startBuildImprovement
  improvementResourceMap, // Import improvementResourceMap
  GameState,
  DEFAULT_PLAYER_ID // Assuming this is the current player's ID
} from './services/MapService';
import { Tile, AnyUnit, FormationScribe, TileImprovementType, ResourceType } from './types'; // Updated Unit to AnyUnit
import './App.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isFoundingSectMode, setIsFoundingSectMode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); // For user feedback

  useEffect(() => {
    // Initialize the game state when the component mounts
    const initialGameState = initializeGameState();
    setGameState(initialGameState);
    // Select the initial elder by default if one exists
    if (initialGameState.units.length > 0 && initialGameState.units[0].type === 'PioneeringElder') {
      setSelectedUnitId(initialGameState.units[0].id);
    }
  }, []);

  const handleTileClick = (tile: Tile) => {
    setMessage(''); // Clear previous messages
    if (!gameState) return;

    const unitOnTile = gameState.units.find(u => u.x === tile.x && u.y === tile.y);

    if (isFoundingSectMode) {
      if (selectedUnitId) {
        const elder = gameState.units.find(u => u.id === selectedUnitId && u.type === 'PioneeringElder');
        if (elder) {
          const result = foundBranchSect(gameState, selectedUnitId, tile.x, tile.y, `Sect at (${tile.x},${tile.y})`);
          if (result.success) {
            setGameState(result.newState);
            setMessage(result.message);
            setSelectedUnitId(null); // Deselect elder after founding
            setIsFoundingSectMode(false); // Exit founding mode
          } else {
            setMessage(`Error: ${result.message}`);
          }
        } else {
          setMessage("Selected unit is not a Pioneering Elder or not found.");
          setIsFoundingSectMode(false); // Exit mode if something is wrong
        }
      } else {
        setMessage("No Pioneering Elder selected to found a sect.");
        setIsFoundingSectMode(false); // Exit mode
      }
    } else {
      // Regular tile click: select/deselect unit
      if (unitOnTile) {
        setSelectedUnitId(unitOnTile.id);
        setMessage(`Unit ${unitOnTile.type} selected at (${unitOnTile.x}, ${unitOnTile.y}).`);
      } else {
        setSelectedUnitId(null);
        setMessage('Empty tile clicked.');
      }
    }
  };

  const toggleFoundingMode = () => {
    if (!selectedUnitId) {
      setMessage("Please select a Pioneering Elder first.");
      setIsFoundingSectMode(false);
      return;
    }
     const selected = gameState?.units.find(u => u.id === selectedUnitId);
    if (selected && selected.type === 'PioneeringElder') {
      setIsFoundingSectMode(prev => !prev);
      setMessage(isFoundingSectMode ? "Exited founding mode." : "Founding mode activated. Click a valid tile to found a Branch Sect.");
    } else {
       setMessage("Only Pioneering Elders can found Branch Sects.");
       setIsFoundingSectMode(false);
    }
  };
  
  const getSelectedUnit = (): AnyUnit | undefined => { // Return type AnyUnit
    if (!gameState || !selectedUnitId) return undefined;
    return gameState.units.find(u => u.id === selectedUnitId);
  };

  const handleBuildImprovement = (improvementType: TileImprovementType) => {
    if (!gameState || !selectedUnitId) {
      setMessage("No unit selected or game state error.");
      return;
    }
    const scribe = getSelectedUnit();
    if (!scribe || scribe.type !== 'FormationScribe') {
      setMessage("Selected unit is not a Formation Scribe.");
      return;
    }

    const result = startBuildImprovement(gameState, scribe.id, scribe.x, scribe.y, improvementType);
    setGameState(result.newState);
    setMessage(result.message);
  };
  
  // Memoize available improvements to avoid re-calculating on every render
  const availableImprovements = useMemo((): TileImprovementType[] => {
    if (!gameState || !selectedUnitId) return [];
    const unit = getSelectedUnit();
    if (!unit || unit.type !== 'FormationScribe') return [];

    const tile = gameState.mapGrid[unit.y]?.[unit.x];
    if (!tile || !tile.resource || tile.improvement) return [];

    // Check if the tile is exploited by the current player's sect
    const exploitingSect = gameState.branchSects.find(sect => sect.id === tile.resource?.exploitedBy);
    if (!exploitingSect || exploitingSect.ownerId !== unit.ownerId) { // Assuming unit.ownerId is player's ID
        // setMessage("Tile not exploited by your sect."); // This would cause message to flash
        return [];
    }


    const possible: TileImprovementType[] = [];
    for (const impType in improvementResourceMap) {
      if (improvementResourceMap[impType as TileImprovementType] === tile.resource.type) {
        possible.push(impType as TileImprovementType);
      }
    }
    return possible;
  }, [gameState, selectedUnitId, getSelectedUnit]);


  if (!gameState) {
    return <div>Loading game...</div>;
  }

  const selectedUnit = getSelectedUnit();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Procedural Generation Game</h1>
      </header>
      <main className="app-main">
        <MapGridDisplay
          mapGrid={gameState.mapGrid}
          units={gameState.units} // Pass AnyUnit[]
          branchSects={gameState.branchSects}
          onTileClick={handleTileClick}
          selectedUnitId={selectedUnitId}
        />
        <div className="controls-panel">
          <h2>Controls</h2>
          {message && <p className="feedback-message">{message}</p>}
          {selectedUnit && (
            <div>
              <p>Selected Unit: {selectedUnit.type} at ({selectedUnit.x}, {selectedUnit.y})</p>
              {selectedUnit.type === 'PioneeringElder' && (
                <button onClick={toggleFoundingMode}>
                  {isFoundingSectMode ? "Cancel Founding" : "Found Branch Sect"}
                </button>
              )}
              {selectedUnit.type === 'FormationScribe' && availableImprovements.length > 0 && (
                <div>
                  <p>Available Improvements:</p>
                  {availableImprovements.map(impType => (
                    <button key={impType} onClick={() => handleBuildImprovement(impType)}>
                      Build {impType.replace(/([A-Z])/g, ' $1').trim()} {/* Add spaces for display */}
                    </button>
                  ))}
                </div>
              )}
               {selectedUnit.type === 'FormationScribe' && availableImprovements.length === 0 && (
                <p>No available improvements for this tile, or tile not exploited by your sect, or already improved.</p>
            )}
            </div>
          )}
          {!selectedUnit && <p>No unit selected. Click a unit on the map.</p>}
        </div>
      </main>
      <footer className="app-footer">
        <p>Game Footer - Status or Info</p>
      </footer>
    </div>
  );
};

export default App;
