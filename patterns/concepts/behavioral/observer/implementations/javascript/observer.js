/**
 * Observer Design Pattern
 *
 * The Observer pattern defines a one-to-many dependency between objects so that
 * when one object changes state, all its dependents are notified and updated automatically.
 * It's also known as the Publish-Subscribe pattern.
 */

/**
 * Subject interface - defines methods for attaching, detaching,
 * and notifying observers
 */
class Subject {
  /**
   * Attach an observer to the subject
   * @param {Observer} observer - The observer to attach
   */
  attach(observer) {
    throw new Error('attach method must be implemented by concrete classes');
  }

  /**
   * Detach an observer from the subject
   * @param {Observer} observer - The observer to detach
   */
  detach(observer) {
    throw new Error('detach method must be implemented by concrete classes');
  }

  /**
   * Notify all observers about state changes
   */
  notify() {
    throw new Error('notify method must be implemented by concrete classes');
  }
}

/**
 * Observer interface - defines a method to be called when subjects change
 */
class Observer {
  /**
   * Receive update from subject
   * @param {Subject} subject - The subject that triggered the update
   */
  update(subject) {
    throw new Error('update method must be implemented by concrete classes');
  }
}

/**
 * Concrete Subject - Weather Station
 */
class WeatherStation extends Subject {
  constructor() {
    super();
    this.observers = [];
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
  }

  /**
   * @inheritdoc
   */
  attach(observer) {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log('WeatherStation: Observer has been attached already.');
      return;
    }

    console.log('WeatherStation: Attached an observer.');
    this.observers.push(observer);
  }

  /**
   * @inheritdoc
   */
  detach(observer) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log('WeatherStation: Nonexistent observer.');
      return;
    }

    this.observers.splice(observerIndex, 1);
    console.log('WeatherStation: Detached an observer.');
  }

  /**
   * @inheritdoc
   */
  notify() {
    console.log('WeatherStation: Notifying observers...');
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Set measurements and notify observers
   * @param {number} temperature - The current temperature
   * @param {number} humidity - The current humidity
   * @param {number} pressure - The current pressure
   */
  setMeasurements(temperature, humidity, pressure) {
    console.log('WeatherStation: Weather measurements changed.');
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;

    this.notify();
  }

  /**
   * Get the current temperature
   * @returns {number} The current temperature
   */
  getTemperature() {
    return this.temperature;
  }

  /**
   * Get the current humidity
   * @returns {number} The current humidity
   */
  getHumidity() {
    return this.humidity;
  }

  /**
   * Get the current pressure
   * @returns {number} The current pressure
   */
  getPressure() {
    return this.pressure;
  }
}

/**
 * Concrete Observer - Current Conditions Display
 */
class CurrentConditionsDisplay extends Observer {
  constructor() {
    super();
    this.temperature = 0;
    this.humidity = 0;
    this.displayName = 'Current Conditions Display';
  }

  /**
   * @inheritdoc
   */
  update(subject) {
    if (subject instanceof WeatherStation) {
      this.temperature = subject.getTemperature();
      this.humidity = subject.getHumidity();
      this.display();
    }
  }

  /**
   * Display current conditions
   */
  display() {
    console.log(
      `\n${this.displayName}: Current conditions: ${this.temperature.toFixed(
        1
      )}°C and ${this.humidity.toFixed(1)}% humidity`
    );
  }
}

/**
 * Concrete Observer - Statistics Display
 */
class StatisticsDisplay extends Observer {
  constructor() {
    super();
    this.temperatures = [];
    this.displayName = 'Statistics Display';
  }

  /**
   * @inheritdoc
   */
  update(subject) {
    if (subject instanceof WeatherStation) {
      this.temperatures.push(subject.getTemperature());
      this.display();
    }
  }

  /**
   * Calculate average temperature
   * @returns {number} The average temperature
   */
  getAverageTemperature() {
    if (this.temperatures.length === 0) return 0;
    const sum = this.temperatures.reduce((a, b) => a + b, 0);
    return sum / this.temperatures.length;
  }

  /**
   * Calculate minimum temperature
   * @returns {number} The minimum temperature
   */
  getMinTemperature() {
    if (this.temperatures.length === 0) return 0;
    return Math.min(...this.temperatures);
  }

  /**
   * Calculate maximum temperature
   * @returns {number} The maximum temperature
   */
  getMaxTemperature() {
    if (this.temperatures.length === 0) return 0;
    return Math.max(...this.temperatures);
  }

  /**
   * Display statistics
   */
  display() {
    console.log(
      `\n${this.displayName}: Avg/Max/Min temperature = ${this.getAverageTemperature().toFixed(
        1
      )}/${this.getMaxTemperature().toFixed(1)}/${this.getMinTemperature().toFixed(1)}`
    );
  }
}

/**
 * Concrete Observer - Forecast Display
 */
class ForecastDisplay extends Observer {
  constructor() {
    super();
    this.currentPressure = 29.92; // Initial pressure in inches
    this.lastPressure = 0;
    this.displayName = 'Forecast Display';
  }

  /**
   * @inheritdoc
   */
  update(subject) {
    if (subject instanceof WeatherStation) {
      this.lastPressure = this.currentPressure;
      this.currentPressure = subject.getPressure();
      this.display();
    }
  }

  /**
   * Display forecast
   */
  display() {
    console.log(`\n${this.displayName}: Forecast: `);
    if (this.currentPressure > this.lastPressure) {
      console.log('Improving weather on the way!');
    } else if (this.currentPressure === this.lastPressure) {
      console.log('More of the same');
    } else {
      console.log('Watch out for cooler, rainy weather');
    }
  }
}

/**
 * Concrete Observer - Heat Index Display
 */
class HeatIndexDisplay extends Observer {
  constructor() {
    super();
    this.heatIndex = 0;
    this.displayName = 'Heat Index Display';
  }

  /**
   * @inheritdoc
   */
  update(subject) {
    if (subject instanceof WeatherStation) {
      const t = subject.getTemperature();
      const rh = subject.getHumidity();
      // Complex formula to calculate heat index
      this.heatIndex = this.computeHeatIndex(t, rh);
      this.display();
    }
  }

  /**
   * Compute heat index using temperature and humidity
   * @param {number} t - Temperature in Celsius
   * @param {number} rh - Relative humidity (%)
   * @returns {number} Heat index
   */
  computeHeatIndex(t, rh) {
    // Convert Celsius to Fahrenheit for the formula
    const tf = (t * 9) / 5 + 32;

    // Heat index formula (simplified version)
    let index =
      16.923 +
      0.185212 * tf +
      5.37941 * rh -
      0.100254 * tf * rh +
      0.00941695 * (tf * tf) +
      0.00728898 * (rh * rh) +
      0.000345372 * (tf * tf * rh) -
      0.000814971 * (tf * rh * rh) +
      0.0000102102 * (tf * tf * rh * rh) -
      0.000038646 * (tf * tf * tf) +
      0.0000291583 * (rh * rh * rh) +
      0.00000142721 * (tf * tf * tf * rh) +
      0.000000197483 * (tf * rh * rh * rh) -
      0.0000000218429 * (tf * tf * tf * rh * rh) +
      0.000000000843296 * (tf * tf * rh * rh * rh) -
      0.0000000000481975 * (tf * tf * tf * rh * rh * rh);

    // Convert back to Celsius
    index = ((index - 32) * 5) / 9;

    return index;
  }

  /**
   * Display heat index
   */
  display() {
    console.log(`\n${this.displayName}: Heat Index is ${this.heatIndex.toFixed(1)}°C`);
  }
}

/**
 * More sophisticated Subject - Stock Market Data
 */
class StockMarket extends Subject {
  constructor() {
    super();
    this.observers = new Map(); // Using Map to store observers with their topics
    this.stocks = new Map(); // Store stock prices
  }

  /**
   * Attach an observer for specific stocks
   * @param {Observer} observer - The observer to attach
   * @param {Array<string>} stocks - List of stock symbols to subscribe to
   */
  attach(observer, stocks = []) {
    console.log(`StockMarket: Attached observer for stocks: ${stocks.join(', ') || 'ALL'}`);
    this.observers.set(observer, stocks);
  }

  /**
   * Detach an observer
   * @param {Observer} observer - The observer to detach
   */
  detach(observer) {
    const isExist = this.observers.has(observer);
    if (!isExist) {
      console.log('StockMarket: Nonexistent observer.');
      return;
    }

    this.observers.delete(observer);
    console.log('StockMarket: Detached an observer.');
  }

  /**
   * Notify only relevant observers about stock changes
   * @param {string} symbol - The stock symbol that changed
   */
  notify(symbol) {
    console.log(`StockMarket: Notifying observers about ${symbol} changes...`);

    for (const [observer, stocks] of this.observers.entries()) {
      // If observer subscribed to specific stocks, check if the changed stock is in their list
      if (stocks.length === 0 || stocks.includes(symbol)) {
        observer.update(this, symbol);
      }
    }
  }

  /**
   * Update stock price
   * @param {string} symbol - Stock symbol
   * @param {number} price - New stock price
   */
  setStockPrice(symbol, price) {
    console.log(`StockMarket: ${symbol} price updated to $${price}`);
    this.stocks.set(symbol, price);
    this.notify(symbol);
  }

  /**
   * Get current price for a stock
   * @param {string} symbol - Stock symbol
   * @returns {number} Current stock price
   */
  getStockPrice(symbol) {
    return this.stocks.get(symbol);
  }

  /**
   * Get all current stock prices
   * @returns {Map} Map of all stock prices
   */
  getAllStocks() {
    return new Map(this.stocks);
  }
}

/**
 * Concrete Observer - Stock Dashboard
 */
class StockDashboard extends Observer {
  constructor(name = 'Stock Dashboard') {
    super();
    this.name = name;
    this.stocks = new Map();
  }

  /**
   * @inheritdoc
   */
  update(subject, symbol) {
    if (subject instanceof StockMarket) {
      if (symbol) {
        // Single stock update
        this.stocks.set(symbol, subject.getStockPrice(symbol));
        this.displayStock(symbol);
      } else {
        // Full update
        this.stocks = subject.getAllStocks();
        this.displayAll();
      }
    }
  }

  /**
   * Display info for a specific stock
   * @param {string} symbol - Stock symbol
   */
  displayStock(symbol) {
    const price = this.stocks.get(symbol);
    console.log(`\n${this.name}: ${symbol} is now $${price.toFixed(2)}`);
  }

  /**
   * Display all stocks
   */
  displayAll() {
    console.log(`\n${this.name}: Current Stock Prices:`);
    for (const [symbol, price] of this.stocks.entries()) {
      console.log(`- ${symbol}: $${price.toFixed(2)}`);
    }
  }
}

/**
 * Concrete Observer - StockAlertService
 */
class StockAlertService extends Observer {
  constructor() {
    super();
    this.alertThresholds = new Map();
    this.name = 'Stock Alert Service';
  }

  /**
   * Set price threshold for a stock
   * @param {string} symbol - Stock symbol
   * @param {number} minPrice - Alert when price goes below this threshold
   * @param {number} maxPrice - Alert when price goes above this threshold
   */
  setAlertThreshold(symbol, minPrice, maxPrice) {
    this.alertThresholds.set(symbol, { min: minPrice, max: maxPrice });
    console.log(
      `${this.name}: Set alert for ${symbol} when price is below $${minPrice} or above $${maxPrice}`
    );
  }

  /**
   * @inheritdoc
   */
  update(subject, symbol) {
    if (subject instanceof StockMarket && symbol) {
      const price = subject.getStockPrice(symbol);
      const threshold = this.alertThresholds.get(symbol);

      if (threshold) {
        if (price < threshold.min) {
          this.triggerAlert(symbol, price, 'below', threshold.min);
        } else if (price > threshold.max) {
          this.triggerAlert(symbol, price, 'above', threshold.max);
        }
      }
    }
  }

  /**
   * Trigger price alert
   * @param {string} symbol - Stock symbol
   * @param {number} price - Current price
   * @param {string} direction - 'above' or 'below'
   * @param {number} threshold - Threshold value
   */
  triggerAlert(symbol, price, direction, threshold) {
    console.log(
      `\n${this.name}: ALERT! ${symbol} at $${price.toFixed(
        2
      )} is ${direction} the threshold of $${threshold.toFixed(2)}`
    );
  }
}

/**
 * Event Management System - A general purpose implementation for events
 */
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Function to call when event is triggered
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(callback);

    // Return a function to unsubscribe
    return () => {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Emit an event
   * @param {string} eventName - Name of the event
   * @param {...any} args - Arguments to pass to the callbacks
   */
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) {
      return;
    }

    const callbacks = this.events.get(eventName);
    callbacks.forEach((callback) => {
      callback(...args);
    });
  }

  /**
   * Remove all listeners for an event
   * @param {string} eventName - Name of the event
   */
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }

  /**
   * Get the number of listeners for an event
   * @param {string} eventName - Name of the event
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    if (!this.events.has(eventName)) {
      return 0;
    }
    return this.events.get(eventName).length;
  }
}

/**
 * User Interface Demonstration using the Observer pattern
 */
class UserInterface {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.components = new Map();

    // Register some default events
    this.eventEmitter.on('button-click', (buttonId) => {
      console.log(`UI: Button ${buttonId} was clicked`);
    });

    this.eventEmitter.on('form-submit', (formData) => {
      console.log('UI: Form submitted with data:', formData);
    });
  }

  /**
   * Add a UI component
   * @param {string} id - Component ID
   * @param {string} type - Component type
   */
  addComponent(id, type) {
    this.components.set(id, { id, type, state: {} });
    console.log(`UI: Added ${type} component with ID ${id}`);
  }

  /**
   * Simulate a button click
   * @param {string} buttonId - ID of the button
   */
  clickButton(buttonId) {
    if (!this.components.has(buttonId) || this.components.get(buttonId).type !== 'button') {
      console.log(`UI: No button found with ID ${buttonId}`);
      return;
    }

    console.log(`UI: Clicking button ${buttonId}`);
    this.eventEmitter.emit('button-click', buttonId);
  }

  /**
   * Simulate a form submission
   * @param {string} formId - ID of the form
   * @param {Object} data - Form data
   */
  submitForm(formId, data) {
    if (!this.components.has(formId) || this.components.get(formId).type !== 'form') {
      console.log(`UI: No form found with ID ${formId}`);
      return;
    }

    console.log(`UI: Submitting form ${formId}`);
    this.eventEmitter.emit('form-submit', data);
  }

  /**
   * Subscribe to UI events
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Function to call when event is triggered
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    return this.eventEmitter.on(eventName, callback);
  }
}

/**
 * Client code - demonstrates how to use the Observer pattern
 */
function clientCode() {
  // Weather Station Example
  console.log('WEATHER STATION EXAMPLE');
  console.log('=======================');

  // Create the weather station (subject)
  const weatherStation = new WeatherStation();

  // Create displays (observers)
  const currentDisplay = new CurrentConditionsDisplay();
  const statisticsDisplay = new StatisticsDisplay();
  const forecastDisplay = new ForecastDisplay();
  const heatIndexDisplay = new HeatIndexDisplay();

  // Register observers with the subject
  weatherStation.attach(currentDisplay);
  weatherStation.attach(statisticsDisplay);
  weatherStation.attach(forecastDisplay);
  weatherStation.attach(heatIndexDisplay);

  // Simulate weather changes
  weatherStation.setMeasurements(27, 65, 30.4);
  weatherStation.setMeasurements(28, 70, 29.2);
  weatherStation.setMeasurements(26, 90, 29.2);

  // Detach an observer
  console.log('\nDetaching the forecast display...');
  weatherStation.detach(forecastDisplay);

  // One more weather change
  weatherStation.setMeasurements(25, 80, 30.1);

  // Stock Market Example
  console.log('\n\nSTOCK MARKET EXAMPLE');
  console.log('===================');

  // Create the stock market (subject)
  const stockMarket = new StockMarket();

  // Create observers
  const investorDashboard = new StockDashboard('Investor Dashboard');
  const analystDashboard = new StockDashboard('Analyst Dashboard');
  const alertService = new StockAlertService();

  // Set up alerts
  alertService.setAlertThreshold('AAPL', 150, 200);
  alertService.setAlertThreshold('GOOGL', 130, 180);
  alertService.setAlertThreshold('MSFT', 300, 350);

  // Register observers with different subscriptions
  stockMarket.attach(investorDashboard, ['AAPL', 'MSFT']); // Only interested in Apple and Microsoft
  stockMarket.attach(analystDashboard, []); // Interested in all stocks
  stockMarket.attach(alertService, ['AAPL', 'GOOGL', 'MSFT']); // Set alerts for specific stocks

  // Update stock prices
  stockMarket.setStockPrice('AAPL', 182.5);
  stockMarket.setStockPrice('GOOGL', 145.75);
  stockMarket.setStockPrice('MSFT', 320.3);
  stockMarket.setStockPrice('AMZN', 128.9); // analystDashboard will see this, but not investorDashboard

  // Trigger some alerts
  stockMarket.setStockPrice('AAPL', 205.3); // Above threshold
  stockMarket.setStockPrice('GOOGL', 128.4); // Below threshold

  // UI Event System Example
  console.log('\n\nUI EVENT SYSTEM EXAMPLE');
  console.log('======================');

  // Create UI
  const ui = new UserInterface();
  ui.addComponent('saveBtn', 'button');
  ui.addComponent('cancelBtn', 'button');
  ui.addComponent('userForm', 'form');

  // Set up event handlers
  const saveBtnListener = ui.on('button-click', (buttonId) => {
    if (buttonId === 'saveBtn') {
      console.log('Save button handler: Saving data...');
    }
  });

  ui.on('button-click', (buttonId) => {
    if (buttonId === 'cancelBtn') {
      console.log('Cancel button handler: Canceling operation...');
    }
  });

  ui.on('form-submit', (data) => {
    console.log('Form submit handler: Processing user data:', data.name);
    if (data.email) {
      console.log(`Form submit handler: Sending confirmation email to ${data.email}`);
    }
  });

  // Simulate UI interactions
  ui.clickButton('saveBtn');
  ui.clickButton('cancelBtn');

  // Unsubscribe a listener
  console.log('\nRemoving save button listener...');
  saveBtnListener();
  ui.clickButton('saveBtn'); // This won't trigger our handler anymore

  // Submit a form
  ui.submitForm('userForm', { name: 'John Doe', email: 'john@example.com' });
}

// Run the client code
clientCode();

module.exports = {
  Subject,
  Observer,
  WeatherStation,
  CurrentConditionsDisplay,
  StatisticsDisplay,
  ForecastDisplay,
  HeatIndexDisplay,
  StockMarket,
  StockDashboard,
  StockAlertService,
  EventEmitter,
  UserInterface,
};
