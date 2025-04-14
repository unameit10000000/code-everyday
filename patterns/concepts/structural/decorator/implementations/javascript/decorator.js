/**
 * Decorator Design Pattern
 *
 * The Decorator pattern lets you attach new behaviors to objects by placing these objects
 * inside special wrapper objects that contain the behaviors. It provides a flexible
 * alternative to subclassing for extending functionality.
 */

// Component Interface - defines operations that can be altered by decorators
class Coffee {
  /**
   * Get the cost of the coffee
   * @returns {number} The cost in dollars
   */
  getCost() {
    throw new Error('getCost method must be implemented by concrete classes');
  }

  /**
   * Get the description of the coffee
   * @returns {string} The coffee description
   */
  getDescription() {
    throw new Error('getDescription method must be implemented by concrete classes');
  }
}

// Concrete Component - implements the base component interface
class SimpleCoffee extends Coffee {
  /**
   * Get the cost of a simple coffee
   * @returns {number} Base cost of coffee
   */
  getCost() {
    return 2.0; // Base cost of simple coffee
  }

  /**
   * Get the description of a simple coffee
   * @returns {string} Simple coffee description
   */
  getDescription() {
    return 'Simple coffee';
  }
}

// Base Decorator - maintains a reference to a component object and implements the same interface
class CoffeeDecorator extends Coffee {
  /**
   * Create a new decorator that wraps a coffee component
   * @param {Coffee} coffee - The coffee to be decorated
   */
  constructor(coffee) {
    super();
    this.coffee = coffee;
  }

  /**
   * Get the cost of the decorated coffee
   * @returns {number} Cost after decoration
   */
  getCost() {
    return this.coffee.getCost(); // Delegates to wrapped object
  }

  /**
   * Get the description of the decorated coffee
   * @returns {string} Description after decoration
   */
  getDescription() {
    return this.coffee.getDescription(); // Delegates to wrapped object
  }
}

// Concrete Decorators - add responsibilities to the component

// Milk Decorator - adds milk to the coffee
class MilkDecorator extends CoffeeDecorator {
  /**
   * Get the cost with milk added
   * @returns {number} Cost with milk
   */
  getCost() {
    return this.coffee.getCost() + 0.5; // Add $0.50 for milk
  }

  /**
   * Get the description with milk
   * @returns {string} Description with milk
   */
  getDescription() {
    return `${this.coffee.getDescription()}, with milk`;
  }
}

// Sugar Decorator - adds sugar to the coffee
class SugarDecorator extends CoffeeDecorator {
  /**
   * Get the cost with sugar added
   * @returns {number} Cost with sugar
   */
  getCost() {
    return this.coffee.getCost() + 0.2; // Add $0.20 for sugar
  }

  /**
   * Get the description with sugar
   * @returns {string} Description with sugar
   */
  getDescription() {
    return `${this.coffee.getDescription()}, with sugar`;
  }
}

// Whipped Cream Decorator - adds whipped cream to the coffee
class WhippedCreamDecorator extends CoffeeDecorator {
  /**
   * Get the cost with whipped cream added
   * @returns {number} Cost with whipped cream
   */
  getCost() {
    return this.coffee.getCost() + 0.7; // Add $0.70 for whipped cream
  }

  /**
   * Get the description with whipped cream
   * @returns {string} Description with whipped cream
   */
  getDescription() {
    return `${this.coffee.getDescription()}, with whipped cream`;
  }
}

// Vanilla Syrup Decorator - adds vanilla syrup to the coffee
class VanillaSyrupDecorator extends CoffeeDecorator {
  /**
   * Get the cost with vanilla syrup added
   * @returns {number} Cost with vanilla syrup
   */
  getCost() {
    return this.coffee.getCost() + 0.6; // Add $0.60 for vanilla syrup
  }

  /**
   * Get the description with vanilla syrup
   * @returns {string} Description with vanilla syrup
   */
  getDescription() {
    return `${this.coffee.getDescription()}, with vanilla syrup`;
  }
}

// Client code
function clientCode() {
  // Create a simple coffee
  let coffee = new SimpleCoffee();
  console.log(`Order: ${coffee.getDescription()}`);
  console.log(`Cost: $${coffee.getCost().toFixed(2)}`);

  // Decorate it with milk
  coffee = new MilkDecorator(coffee);
  console.log(`\nOrder: ${coffee.getDescription()}`);
  console.log(`Cost: $${coffee.getCost().toFixed(2)}`);

  // Further decorate it with sugar
  coffee = new SugarDecorator(coffee);
  console.log(`\nOrder: ${coffee.getDescription()}`);
  console.log(`Cost: $${coffee.getCost().toFixed(2)}`);

  // Create a different coffee with multiple decorations at once
  let specialCoffee = new SimpleCoffee();
  specialCoffee = new WhippedCreamDecorator(
    new VanillaSyrupDecorator(new MilkDecorator(specialCoffee))
  );

  console.log(`\nSpecial Coffee Order: ${specialCoffee.getDescription()}`);
  console.log(`Cost: $${specialCoffee.getCost().toFixed(2)}`);

  // Create a coffee with just whipped cream
  let whippedCoffee = new WhippedCreamDecorator(new SimpleCoffee());
  console.log(`\nWhipped Coffee Order: ${whippedCoffee.getDescription()}`);
  console.log(`Cost: $${whippedCoffee.getCost().toFixed(2)}`);
}

// Run the client code
clientCode();

module.exports = {
  Coffee,
  SimpleCoffee,
  CoffeeDecorator,
  MilkDecorator,
  SugarDecorator,
  WhippedCreamDecorator,
  VanillaSyrupDecorator,
};
