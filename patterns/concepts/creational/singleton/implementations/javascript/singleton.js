/**
 * Singleton Design Pattern
 *
 * The Singleton pattern ensures a class has only one instance and provides
 * a global point of access to it. This is useful when exactly one object
 * is needed to coordinate actions across the system.
 */

class Singleton {
  // Static property to hold the single instance of the class
  // Initially set to undefined (not instantiated)
  static instance = undefined;

  /**
   * Constructor for the Singleton class
   * In a robust implementation, this would be private or throw an error
   * if a second instance is attempted to be created directly
   */
  constructor() {
    // In ES2022+, you could use private constructors with #constructor()
    // In current JavaScript, we rely on the static instance check
    if (Singleton.instance) {
      throw new Error('Singleton instance already exists. Use getInstance() instead.');
    }
  }

  /**
   * The getInstance method ensures only one instance is created
   * This implements the lazy initialization pattern - instance is only
   * created when first requested
   * @returns {Singleton} The singleton instance
   */
  static getInstance() {
    // Create the instance only if it doesn't exist yet
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  /**
   * An example method to demonstrate usage of the singleton
   */
  someMethod() {
    console.log('Method called on singleton instance');
  }
}

/**
 * Client code demonstrating how to properly use the Singleton pattern
 */
function clientCode() {
  // Get the first instance
  const singleton1 = Singleton.getInstance();

  // Get the second instance - this will return the same instance as singleton1
  const singleton2 = Singleton.getInstance();

  // Demonstrate that both variables refer to the same instance
  if (singleton1 === singleton2) {
    console.log('Singleton works: Both variables reference the same instance');
  } else {
    console.log('Error: Singleton failed - variables reference different instances');
  }

  // Use the singleton instance
  singleton1.someMethod();

  // Any changes to singleton1 are reflected in singleton2 (because they're the same object)
  singleton1.data = 'Some data set on singleton1';
  console.log(`Data from singleton2: ${singleton2.data}`);
}

// Run the client code
clientCode();

module.exports = Singleton;
