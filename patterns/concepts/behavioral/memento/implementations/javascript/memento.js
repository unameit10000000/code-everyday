/**
 * Memento Design Pattern
 *
 * The Memento pattern captures and externalizes an object's internal state
 * without violating encapsulation, so that the object can be restored to this state later.
 * It's useful for implementing undo mechanisms, snapshots, or rollback operations.
 */

/**
 * Originator - The object whose state needs to be saved and restored
 * In this example, it represents a text editor with undo capabilities
 */
class TextEditor {
  constructor() {
    this.content = '';
    this.cursorPosition = 0;
    this.selection = { start: 0, end: 0 };
    this.fontName = 'Arial';
    this.fontSize = 12;
  }

  /**
   * Write text at the current cursor position
   * @param {string} text - Text to insert
   */
  write(text) {
    // Insert text at cursor position
    const before = this.content.substring(0, this.cursorPosition);
    const after = this.content.substring(this.cursorPosition);
    this.content = before + text + after;

    // Move cursor position
    this.cursorPosition += text.length;

    // Reset selection
    this.selection = { start: this.cursorPosition, end: this.cursorPosition };

    console.log(`Wrote text: "${text}"`);
  }

  /**
   * Delete characters from the current selection or cursor position
   * @param {number} count - Number of characters to delete, default: 1
   */
  delete(count = 1) {
    if (this.hasSelection()) {
      // Delete the selected text
      const before = this.content.substring(0, this.selection.start);
      const after = this.content.substring(this.selection.end);
      this.content = before + after;
      this.cursorPosition = this.selection.start;
      console.log(
        `Deleted selected text (${this.selection.end - this.selection.start} characters)`
      );
    } else {
      // Delete characters after cursor
      const before = this.content.substring(0, this.cursorPosition);
      const after = this.content.substring(this.cursorPosition + count);
      this.content = before + after;
      console.log(`Deleted ${count} characters after cursor`);
    }

    // Reset selection
    this.selection = { start: this.cursorPosition, end: this.cursorPosition };
  }

  /**
   * Select text from startPosition to endPosition
   * @param {number} startPosition - Start of selection
   * @param {number} endPosition - End of selection
   */
  select(startPosition, endPosition) {
    if (startPosition >= 0 && endPosition <= this.content.length && startPosition <= endPosition) {
      this.selection = { start: startPosition, end: endPosition };
      this.cursorPosition = endPosition;
      console.log(`Selected text from position ${startPosition} to ${endPosition}`);
    } else {
      console.log('Invalid selection range');
    }
  }

  /**
   * Move cursor to a specific position
   * @param {number} position - New cursor position
   */
  moveCursor(position) {
    if (position >= 0 && position <= this.content.length) {
      this.cursorPosition = position;
      this.selection = { start: position, end: position };
      console.log(`Moved cursor to position ${position}`);
    } else {
      console.log('Invalid cursor position');
    }
  }

  /**
   * Check if there is a text selection
   * @returns {boolean} True if there is a selection
   */
  hasSelection() {
    return this.selection.start !== this.selection.end;
  }

  /**
   * Change the font settings
   * @param {string} fontName - Font name
   * @param {number} fontSize - Font size
   */
  changeFont(fontName, fontSize) {
    this.fontName = fontName;
    this.fontSize = fontSize;
    console.log(`Changed font to ${fontName}, ${fontSize}px`);
  }

  /**
   * Display the current state of the editor
   */
  display() {
    console.log('\nText Editor State:');
    console.log('=================');
    console.log(`Content: "${this.content}"`);
    console.log(`Cursor Position: ${this.cursorPosition}`);
    console.log(
      `Selection: ${
        this.hasSelection() ? `From ${this.selection.start} to ${this.selection.end}` : 'None'
      }`
    );
    console.log(`Font: ${this.fontName}, ${this.fontSize}px`);
    console.log('=================\n');
  }

  /**
   * Save the current state to a memento object
   * @returns {TextEditorMemento} The saved state
   */
  save() {
    console.log('Saving editor state...');
    return new TextEditorMemento(
      this.content,
      this.cursorPosition,
      { ...this.selection },
      this.fontName,
      this.fontSize
    );
  }

  /**
   * Restore the state from a memento object
   * @param {TextEditorMemento} memento - The state to restore
   */
  restore(memento) {
    // Validate memento
    if (!(memento instanceof TextEditorMemento)) {
      console.log('Invalid memento object');
      return;
    }

    console.log('Restoring editor state...');
    // Get the state data from the memento
    const state = memento.getState();

    // Restore the state
    this.content = state.content;
    this.cursorPosition = state.cursorPosition;
    this.selection = { ...state.selection };
    this.fontName = state.fontName;
    this.fontSize = state.fontSize;
  }
}

/**
 * Memento - Stores the state of the TextEditor
 * This is immutable to prevent accidental changes
 */
class TextEditorMemento {
  /**
   * Create a memento with the state of the TextEditor
   * @param {string} content - Text content
   * @param {number} cursorPosition - Cursor position
   * @param {Object} selection - Selection state
   * @param {string} fontName - Font name
   * @param {number} fontSize - Font size
   */
  constructor(content, cursorPosition, selection, fontName, fontSize) {
    this._content = content;
    this._cursorPosition = cursorPosition;
    this._selection = selection;
    this._fontName = fontName;
    this._fontSize = fontSize;
    this._timestamp = new Date();
  }

  /**
   * Return the state stored in the memento
   * Only the originator (TextEditor) should access this
   * @returns {Object} The stored state
   */
  getState() {
    return {
      content: this._content,
      cursorPosition: this._cursorPosition,
      selection: this._selection,
      fontName: this._fontName,
      fontSize: this._fontSize,
    };
  }

  /**
   * Get a description of this memento
   * @returns {string} Memento description
   */
  getDescription() {
    const dateStr = this._timestamp.toLocaleTimeString();
    return `${dateStr} - ${this._content.substring(0, 15)}${
      this._content.length > 15 ? '...' : ''
    }`;
  }

  /**
   * Get the timestamp of when this memento was created
   * @returns {Date} Creation timestamp
   */
  getTimestamp() {
    return new Date(this._timestamp);
  }
}

/**
 * Caretaker - Manages and stores mementos without modifying them
 * In this example, it's a history manager for the text editor
 */
class EditorHistory {
  constructor() {
    this.states = [];
    this.currentStateIndex = -1;
  }

  /**
   * Add a memento to the history
   * @param {TextEditorMemento} memento - The memento to store
   */
  push(memento) {
    // If we did some new actions after undoing, clear the "future" states
    if (this.currentStateIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentStateIndex + 1);
    }

    this.states.push(memento);
    this.currentStateIndex = this.states.length - 1;
    console.log(`Added state to history (${this.states.length} total states)`);
  }

  /**
   * Get the previous state (for undo)
   * @returns {TextEditorMemento|null} The previous state or null if at the beginning
   */
  undo() {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      console.log(`Undoing to state ${this.currentStateIndex + 1}`);
      return this.states[this.currentStateIndex];
    } else {
      console.log('Cannot undo: at the beginning of history');
      return null;
    }
  }

  /**
   * Get the next state (for redo)
   * @returns {TextEditorMemento|null} The next state or null if at the end
   */
  redo() {
    if (this.currentStateIndex < this.states.length - 1) {
      this.currentStateIndex++;
      console.log(`Redoing to state ${this.currentStateIndex + 1}`);
      return this.states[this.currentStateIndex];
    } else {
      console.log('Cannot redo: at the end of history');
      return null;
    }
  }

  /**
   * Get the list of saved states for display
   * @returns {Array} Array of state descriptions
   */
  getStateList() {
    return this.states.map((memento, index) => {
      const description = memento.getDescription();
      const currentMarker = index === this.currentStateIndex ? '> ' : '  ';
      return `${currentMarker}${index + 1}. ${description}`;
    });
  }

  /**
   * Go to a specific state by index
   * @param {number} index - The index of the state to restore
   * @returns {TextEditorMemento|null} The requested state or null if invalid
   */
  goToState(index) {
    if (index >= 0 && index < this.states.length) {
      this.currentStateIndex = index;
      console.log(`Going to state ${index + 1}`);
      return this.states[index];
    } else {
      console.log(`Invalid state index: ${index + 1}`);
      return null;
    }
  }

  /**
   * Clear all history
   */
  clear() {
    this.states = [];
    this.currentStateIndex = -1;
    console.log('History cleared');
  }
}

/**
 * A more complex originator example: Game character with state
 */
class GameCharacter {
  constructor(name) {
    this.name = name;
    this.level = 1;
    this.health = 100;
    this.inventory = [];
    this.position = { x: 0, y: 0 };
    this.skills = [];
  }

  /**
   * Move the character to a new position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  moveTo(x, y) {
    this.position = { x, y };
    console.log(`${this.name} moved to position (${x}, ${y})`);
  }

  /**
   * Character takes damage
   * @param {number} amount - Damage amount
   */
  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    console.log(`${this.name} took ${amount} damage, health is now ${this.health}`);

    if (this.health === 0) {
      console.log(`${this.name} has been defeated!`);
    }
  }

  /**
   * Heal the character
   * @param {number} amount - Healing amount
   */
  heal(amount) {
    this.health = Math.min(100, this.health + amount);
    console.log(`${this.name} healed for ${amount}, health is now ${this.health}`);
  }

  /**
   * Gain experience and potentially level up
   * @param {number} exp - Experience points gained
   */
  gainExperience(exp) {
    // Simple level up logic: each level needs level*100 XP
    const xpNeeded = this.level * 100;
    if (exp >= xpNeeded) {
      this.level++;
      console.log(`${this.name} leveled up to level ${this.level}!`);
      // Restore health on level up
      this.health = 100;
    } else {
      console.log(`${this.name} gained ${exp} experience points`);
    }
  }

  /**
   * Add an item to inventory
   * @param {string} item - Item to add
   */
  addItem(item) {
    this.inventory.push(item);
    console.log(`${this.name} added ${item} to inventory`);
  }

  /**
   * Remove an item from inventory
   * @param {string} item - Item to remove
   * @returns {boolean} True if item was removed
   */
  removeItem(item) {
    const index = this.inventory.indexOf(item);
    if (index !== -1) {
      this.inventory.splice(index, 1);
      console.log(`${this.name} removed ${item} from inventory`);
      return true;
    }
    console.log(`${this.name} doesn't have ${item} in inventory`);
    return false;
  }

  /**
   * Learn a new skill
   * @param {string} skill - Skill to learn
   */
  learnSkill(skill) {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
      console.log(`${this.name} learned ${skill}!`);
    } else {
      console.log(`${this.name} already knows ${skill}`);
    }
  }

  /**
   * Display character status
   */
  displayStatus() {
    console.log('\nCharacter Status:');
    console.log('================');
    console.log(`Name: ${this.name}`);
    console.log(`Level: ${this.level}`);
    console.log(`Health: ${this.health}/100`);
    console.log(`Position: (${this.position.x}, ${this.position.y})`);
    console.log(`Inventory (${this.inventory.length}): ${this.inventory.join(', ') || 'Empty'}`);
    console.log(`Skills (${this.skills.length}): ${this.skills.join(', ') || 'None'}`);
    console.log('================\n');
  }

  /**
   * Save character state to a memento
   * @returns {GameCharacterMemento} Saved state
   */
  save() {
    console.log(`Saving ${this.name}'s state...`);
    return new GameCharacterMemento(
      this.name,
      this.level,
      this.health,
      [...this.inventory],
      { ...this.position },
      [...this.skills]
    );
  }

  /**
   * Restore character state from a memento
   * @param {GameCharacterMemento} memento - State to restore
   */
  restore(memento) {
    if (!(memento instanceof GameCharacterMemento)) {
      console.log('Invalid memento object');
      return;
    }

    console.log(`Restoring ${this.name}'s state...`);
    const state = memento.getState();

    // Only restore if it's the same character
    if (state.name !== this.name) {
      console.log(`Memento is for ${state.name}, not ${this.name}`);
      return;
    }

    this.level = state.level;
    this.health = state.health;
    this.inventory = [...state.inventory];
    this.position = { ...state.position };
    this.skills = [...state.skills];
  }
}

/**
 * Memento for GameCharacter state
 */
class GameCharacterMemento {
  constructor(name, level, health, inventory, position, skills) {
    this._name = name;
    this._level = level;
    this._health = health;
    this._inventory = inventory;
    this._position = position;
    this._skills = skills;
    this._timestamp = new Date();
    this._label = `Save - ${name} (Lvl ${level})`;
  }

  /**
   * Get the saved state (only for originator)
   * @returns {Object} Saved state
   */
  getState() {
    return {
      name: this._name,
      level: this._level,
      health: this._health,
      inventory: [...this._inventory],
      position: { ...this._position },
      skills: [...this._skills],
    };
  }

  /**
   * Get memento description
   * @returns {string} Description
   */
  getDescription() {
    return `${this._label} - ${this._timestamp.toLocaleString()}`;
  }

  /**
   * Set a custom label for this save point
   * @param {string} label - Custom label
   */
  setLabel(label) {
    this._label = label;
  }

  /**
   * Get the timestamp
   * @returns {Date} Save timestamp
   */
  getTimestamp() {
    return new Date(this._timestamp);
  }
}

/**
 * SaveManager - Caretaker for game saves
 */
class SaveManager {
  constructor() {
    this.savedGames = new Map(); // Character name -> array of saves
  }

  /**
   * Save a character state
   * @param {GameCharacter} character - Character to save
   * @param {string} label - Optional label for the save
   */
  saveCharacter(character, label = null) {
    const memento = character.save();

    // Set custom label if provided
    if (label) {
      memento.setLabel(label);
    }

    // Get or create save list for this character
    if (!this.savedGames.has(character.name)) {
      this.savedGames.set(character.name, []);
    }

    // Add to save list
    const saves = this.savedGames.get(character.name);
    saves.push(memento);

    console.log(`Saved game for ${character.name} (${saves.length} total saves)`);
  }

  /**
   * Load a saved state for a character
   * @param {GameCharacter} character - Character to load state for
   * @param {number} index - Save index to load
   */
  loadCharacter(character, index) {
    if (!this.savedGames.has(character.name)) {
      console.log(`No saves found for ${character.name}`);
      return;
    }

    const saves = this.savedGames.get(character.name);

    if (index < 0 || index >= saves.length) {
      console.log(`Invalid save index: ${index}`);
      return;
    }

    const memento = saves[index];
    character.restore(memento);
    console.log(`Loaded save #${index + 1} for ${character.name}`);
  }

  /**
   * Get list of saves for a character
   * @param {string} characterName - Character name
   * @returns {Array} List of save descriptions
   */
  getSaveList(characterName) {
    if (!this.savedGames.has(characterName)) {
      return [];
    }

    return this.savedGames.get(characterName).map((memento, index) => {
      return `${index + 1}. ${memento.getDescription()}`;
    });
  }

  /**
   * Delete a save
   * @param {string} characterName - Character name
   * @param {number} index - Save index to delete
   */
  deleteSave(characterName, index) {
    if (!this.savedGames.has(characterName)) {
      console.log(`No saves found for ${characterName}`);
      return;
    }

    const saves = this.savedGames.get(characterName);

    if (index < 0 || index >= saves.length) {
      console.log(`Invalid save index: ${index}`);
      return;
    }

    const removed = saves.splice(index, 1)[0];
    console.log(`Deleted save: ${removed.getDescription()}`);
  }
}

/**
 * Client code - demonstrates how to use the Memento pattern
 */
function clientCode() {
  // Text Editor Example
  console.log('TEXT EDITOR EXAMPLE');
  console.log('===================');

  // Create text editor and history
  const editor = new TextEditor();
  const history = new EditorHistory();

  // Initial state
  history.push(editor.save()); // Save initial empty state

  // Make some changes and save states
  editor.write('Hello, world!');
  editor.display();
  history.push(editor.save());

  editor.select(7, 12);
  editor.delete(); // Delete "world"
  editor.write('Memento Pattern');
  editor.display();
  history.push(editor.save());

  editor.moveCursor(0);
  editor.write('Implementing the ');
  editor.changeFont('Times New Roman', 14);
  editor.display();
  history.push(editor.save());

  // Demonstrate undo functionality
  console.log('PERFORMING UNDO OPERATIONS:');
  let previousState = history.undo();
  if (previousState) {
    editor.restore(previousState);
    editor.display();
  }

  previousState = history.undo();
  if (previousState) {
    editor.restore(previousState);
    editor.display();
  }

  // Demonstrate redo functionality
  console.log('PERFORMING REDO OPERATIONS:');
  let nextState = history.redo();
  if (nextState) {
    editor.restore(nextState);
    editor.display();
  }

  // Show history list
  console.log('EDITOR HISTORY:');
  const stateList = history.getStateList();
  stateList.forEach((state) => console.log(state));

  // Game Character Example
  console.log('\n\nGAME CHARACTER EXAMPLE');
  console.log('======================');

  // Create character and save manager
  const hero = new GameCharacter('Hero');
  const saveManager = new SaveManager();

  // Initial save
  saveManager.saveCharacter(hero, 'Game Start');

  // Character progression
  hero.moveTo(10, 5);
  hero.addItem('Sword');
  hero.addItem('Health Potion');
  hero.learnSkill('Slash');
  hero.displayStatus();

  // Save after initial equipment
  saveManager.saveCharacter(hero, 'After Getting Equipment');

  // More progression
  hero.takeDamage(30);
  hero.moveTo(20, 15);
  hero.gainExperience(120); // Level up
  hero.learnSkill('Fireball');
  hero.removeItem('Health Potion');
  hero.displayStatus();

  // Save after battle
  saveManager.saveCharacter(hero, 'After First Battle');

  // Even more progression
  hero.takeDamage(95); // Near death
  hero.displayStatus();

  // List all saves
  console.log('AVAILABLE SAVES:');
  const saves = saveManager.getSaveList('Hero');
  saves.forEach((save) => console.log(save));

  // Load an earlier save (After Getting Equipment)
  console.log('\nLOADING EARLIER SAVE:');
  saveManager.loadCharacter(hero, 1);
  hero.displayStatus();

  // Continue with alternative path
  console.log('\nCONTINUING WITH ALTERNATIVE PATH:');
  hero.moveTo(15, 20);
  hero.addItem('Magic Staff');
  hero.learnSkill('Teleport');
  hero.displayStatus();

  // Save new path
  saveManager.saveCharacter(hero, 'Alternative Path');

  // Show updated save list
  console.log('\nUPDATED SAVE LIST:');
  const updatedSaves = saveManager.getSaveList('Hero');
  updatedSaves.forEach((save) => console.log(save));
}

// Run the client code
clientCode();

module.exports = {
  TextEditor,
  TextEditorMemento,
  EditorHistory,
  GameCharacter,
  GameCharacterMemento,
  SaveManager,
};
