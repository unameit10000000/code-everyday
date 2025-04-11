/**
 * Builder Design Pattern
 *
 * The Builder Pattern separates the construction of a complex object
 * from its representation, allowing the same construction process to
 * create different representations.
 */

// Product
class Car {
  constructor() {
    this.make = '';
    this.model = '';
    this.year = 0;
    this.color = '';
    this.engine = '';
    this.transmission = '';
    this.features = [];
    this.safetyOptions = [];
    this.interiorPackage = '';
    this.navigationSystem = false;
    this.warranties = [];
  }

  describe() {
    let description = `${this.year} ${this.make} ${this.model} (${this.color})\n`;
    description += `Engine: ${this.engine}, Transmission: ${this.transmission}\n`;

    if (this.features.length > 0) {
      description += `Features: ${this.features.join(', ')}\n`;
    }

    if (this.safetyOptions.length > 0) {
      description += `Safety Options: ${this.safetyOptions.join(', ')}\n`;
    }

    description += `Interior: ${this.interiorPackage}\n`;

    if (this.navigationSystem) {
      description += `Navigation System: Included\n`;
    }

    if (this.warranties.length > 0) {
      description += `Warranties: ${this.warranties.join(', ')}\n`;
    }

    return description;
  }
}

// Builder
class CarBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.car = new Car();
    return this;
  }

  setMake(make) {
    this.car.make = make;
    return this;
  }

  setModel(model) {
    this.car.model = model;
    return this;
  }

  setYear(year) {
    this.car.year = year;
    return this;
  }

  setColor(color) {
    this.car.color = color;
    return this;
  }

  setEngine(engine) {
    this.car.engine = engine;
    return this;
  }

  setTransmission(transmission) {
    this.car.transmission = transmission;
    return this;
  }

  addFeature(feature) {
    this.car.features.push(feature);
    return this;
  }

  addSafetyOption(option) {
    this.car.safetyOptions.push(option);
    return this;
  }

  // Fixed: renamed parameter to avoid reserved word 'package'
  setInteriorPackage(interiorType) {
    this.car.interiorPackage = interiorType;
    return this;
  }

  includeNavigationSystem() {
    this.car.navigationSystem = true;
    return this;
  }

  addWarranty(warranty) {
    this.car.warranties.push(warranty);
    return this;
  }

  build() {
    const car = this.car;
    this.reset();
    return car;
  }
}

// Director
class CarDirector {
  constructor(builder) {
    this.builder = builder;
  }

  constructEconomyCar() {
    return this.builder
      .setMake('Honda')
      .setModel('Civic')
      .setYear(2023)
      .setColor('Silver')
      .setEngine('1.5L 4-Cylinder')
      .setTransmission('CVT')
      .addFeature('Bluetooth')
      .addFeature('Backup Camera')
      .addSafetyOption('Anti-lock Brakes')
      .addSafetyOption('Airbags')
      .setInteriorPackage('Cloth Standard')
      .addWarranty('3-year/36,000-mile basic')
      .build();
  }

  constructLuxuryCar() {
    return this.builder
      .setMake('Mercedes-Benz')
      .setModel('S-Class')
      .setYear(2023)
      .setColor('Black')
      .setEngine('3.0L V6 Turbo')
      .setTransmission('9-speed Automatic')
      .addFeature('Bluetooth')
      .addFeature('Backup Camera')
      .addFeature('Heated Seats')
      .addFeature('Sunroof')
      .addFeature('Premium Sound System')
      .addSafetyOption('Anti-lock Brakes')
      .addSafetyOption('Airbags')
      .addSafetyOption('Lane Departure Warning')
      .addSafetyOption('Blind Spot Monitoring')
      .addSafetyOption('Automatic Emergency Braking')
      .setInteriorPackage('Leather Premium')
      .includeNavigationSystem()
      .addWarranty('4-year/50,000-mile basic')
      .addWarranty('10-year powertrain')
      .build();
  }

  constructSportsCar() {
    return this.builder
      .setMake('Porsche')
      .setModel('911')
      .setYear(2023)
      .setColor('Red')
      .setEngine('3.0L Twin-Turbo Flat-6')
      .setTransmission('8-speed PDK')
      .addFeature('Sport Exhaust')
      .addFeature('Sport Suspension')
      .addFeature('Performance Brakes')
      .addFeature('Sport Chronograph')
      .addSafetyOption('Anti-lock Brakes')
      .addSafetyOption('Airbags')
      .addSafetyOption('Stability Control')
      .setInteriorPackage('Sport Leather')
      .includeNavigationSystem()
      .addWarranty('4-year/50,000-mile basic')
      .build();
  }
}

// Client code
function clientCode() {
  // Using builder directly
  const builder = new CarBuilder();

  const customCar = builder
    .setMake('Toyota')
    .setModel('Camry')
    .setYear(2023)
    .setColor('Blue')
    .setEngine('2.5L 4-Cylinder')
    .setTransmission('8-speed Automatic')
    .addFeature('Bluetooth')
    .addFeature('Backup Camera')
    .addFeature('Apple CarPlay')
    .addSafetyOption('Anti-lock Brakes')
    .addSafetyOption('Airbags')
    .addSafetyOption('Lane Departure Alert')
    .setInteriorPackage('Leather')
    .includeNavigationSystem()
    .addWarranty('3-year/36,000-mile basic')
    .addWarranty('5-year/60,000-mile powertrain')
    .build();

  console.log('Custom Car:');
  console.log(customCar.describe());

  // Using director for predefined configurations
  const director = new CarDirector(builder);

  const economyCar = director.constructEconomyCar();
  console.log('\nEconomy Car:');
  console.log(economyCar.describe());

  const luxuryCar = director.constructLuxuryCar();
  console.log('\nLuxury Car:');
  console.log(luxuryCar.describe());

  const sportsCar = director.constructSportsCar();
  console.log('\nSports Car:');
  console.log(sportsCar.describe());
}

// Run the client code
clientCode();

module.exports = {
  Car,
  CarBuilder,
  CarDirector,
};
