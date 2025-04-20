/**
 * Bridge Design Pattern
 *
 * The Bridge pattern decouples an abstraction from its implementation
 * so that the two can vary independently. It involves an interface that
 * acts as a bridge between the abstraction class and implementation classes.
 */

/**
 * Implementation Interface - Defines the interface for implementation classes
 * All concrete implementations will implement this interface
 */
class DeviceImplementation {
  /**
   * Power on the device
   */
  turnOn() {
    throw new Error('turnOn method must be implemented by concrete classes');
  }

  /**
   * Power off the device
   */
  turnOff() {
    throw new Error('turnOff method must be implemented by concrete classes');
  }

  /**
   * Set the volume level
   * @param {number} percent - Volume level (0-100)
   */
  setVolume(percent) {
    throw new Error('setVolume method must be implemented by concrete classes');
  }

  /**
   * Set the channel
   * @param {number} channel - Channel number
   */
  setChannel(channel) {
    throw new Error('setChannel method must be implemented by concrete classes');
  }

  /**
   * Get the current status of the device
   * @returns {Object} Status information
   */
  getStatus() {
    throw new Error('getStatus method must be implemented by concrete classes');
  }
}

/**
 * Concrete Implementation - TV Device
 */
class TV extends DeviceImplementation {
  constructor(brand = 'Generic') {
    super();
    this.brand = brand;
    this.isOn = false;
    this.volume = 30;
    this.channel = 1;
    this.maxChannels = 100;
    console.log(`Creating new ${this.brand} TV`);
  }

  turnOn() {
    this.isOn = true;
    console.log(`${this.brand} TV is now ON`);
  }

  turnOff() {
    this.isOn = false;
    console.log(`${this.brand} TV is now OFF`);
  }

  setVolume(percent) {
    if (!this.isOn) {
      console.log(`Cannot set volume - ${this.brand} TV is OFF`);
      return;
    }

    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`${this.brand} TV volume set to ${this.volume}%`);
  }

  setChannel(channel) {
    if (!this.isOn) {
      console.log(`Cannot set channel - ${this.brand} TV is OFF`);
      return;
    }

    if (channel > 0 && channel <= this.maxChannels) {
      this.channel = channel;
      console.log(`${this.brand} TV channel set to ${this.channel}`);
    } else {
      console.log(`${this.brand} TV - Invalid channel: ${channel} (must be 1-${this.maxChannels})`);
    }
  }

  getStatus() {
    return {
      deviceType: 'TV',
      brand: this.brand,
      powerStatus: this.isOn ? 'ON' : 'OFF',
      volume: this.volume,
      channel: this.channel,
    };
  }
}

/**
 * Concrete Implementation - Radio Device
 */
class Radio extends DeviceImplementation {
  constructor(brand = 'Generic') {
    super();
    this.brand = brand;
    this.isOn = false;
    this.volume = 20;
    this.channel = 87.5; // FM frequency
    this.isFM = true;
    console.log(`Creating new ${this.brand} Radio`);
  }

  turnOn() {
    this.isOn = true;
    console.log(`${this.brand} Radio is now ON`);
  }

  turnOff() {
    this.isOn = false;
    console.log(`${this.brand} Radio is now OFF`);
  }

  setVolume(percent) {
    if (!this.isOn) {
      console.log(`Cannot set volume - ${this.brand} Radio is OFF`);
      return;
    }

    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`${this.brand} Radio volume set to ${this.volume}%`);
  }

  setChannel(channel) {
    if (!this.isOn) {
      console.log(`Cannot set channel - ${this.brand} Radio is OFF`);
      return;
    }

    if (this.isFM) {
      // FM range is typically 87.5 to 108.0 MHz
      if (channel >= 87.5 && channel <= 108.0) {
        this.channel = channel;
        console.log(`${this.brand} Radio frequency set to ${this.channel.toFixed(1)} MHz FM`);
      } else {
        console.log(
          `${this.brand} Radio - Invalid FM frequency: ${channel} (must be 87.5-108.0 MHz)`
        );
      }
    } else {
      // AM range is typically 540 to 1600 kHz
      if (channel >= 540 && channel <= 1600) {
        this.channel = channel;
        console.log(`${this.brand} Radio frequency set to ${this.channel} kHz AM`);
      } else {
        console.log(
          `${this.brand} Radio - Invalid AM frequency: ${channel} (must be 540-1600 kHz)`
        );
      }
    }
  }

  // Additional method specific to Radio
  toggleBand() {
    if (!this.isOn) {
      console.log(`Cannot toggle band - ${this.brand} Radio is OFF`);
      return;
    }

    this.isFM = !this.isFM;
    if (this.isFM) {
      this.channel = 87.5; // Default FM frequency
      console.log(`${this.brand} Radio switched to FM band (${this.channel.toFixed(1)} MHz)`);
    } else {
      this.channel = 1000; // Default AM frequency
      console.log(`${this.brand} Radio switched to AM band (${this.channel} kHz)`);
    }
  }

  getStatus() {
    return {
      deviceType: 'Radio',
      brand: this.brand,
      powerStatus: this.isOn ? 'ON' : 'OFF',
      volume: this.volume,
      frequency: this.channel,
      band: this.isFM ? 'FM' : 'AM',
    };
  }
}

/**
 * Concrete Implementation - Smart Speaker
 */
class SmartSpeaker extends DeviceImplementation {
  constructor(brand = 'Generic') {
    super();
    this.brand = brand;
    this.isOn = false;
    this.volume = 40;
    this.channel = null; // Smart speakers use "apps" instead of channels
    this.currentApp = 'None';
    this.availableApps = ['Music', 'Podcast', 'News', 'Weather', 'Home Control'];
    console.log(`Creating new ${this.brand} Smart Speaker`);
  }

  turnOn() {
    this.isOn = true;
    console.log(`${this.brand} Smart Speaker is now ON`);
  }

  turnOff() {
    this.isOn = false;
    console.log(`${this.brand} Smart Speaker is now OFF`);
  }

  setVolume(percent) {
    if (!this.isOn) {
      console.log(`Cannot set volume - ${this.brand} Smart Speaker is OFF`);
      return;
    }

    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`${this.brand} Smart Speaker volume set to ${this.volume}%`);
  }

  // For Smart Speakers, "setChannel" selects an app instead
  setChannel(appIndex) {
    if (!this.isOn) {
      console.log(`Cannot set app - ${this.brand} Smart Speaker is OFF`);
      return;
    }

    if (appIndex >= 0 && appIndex < this.availableApps.length) {
      this.currentApp = this.availableApps[appIndex];
      console.log(`${this.brand} Smart Speaker now running app: ${this.currentApp}`);
    } else {
      console.log(
        `${this.brand} Smart Speaker - Invalid app index: ${appIndex} (must be 0-${
          this.availableApps.length - 1
        })`
      );
    }
  }

  // Additional method specific to Smart Speaker
  voiceCommand(command) {
    if (!this.isOn) {
      console.log(`Cannot process command - ${this.brand} Smart Speaker is OFF`);
      return;
    }

    console.log(`${this.brand} Smart Speaker processing command: "${command}"`);

    // Simple command processing
    if (command.toLowerCase().includes('play music')) {
      this.currentApp = 'Music';
      console.log(`${this.brand} Smart Speaker now playing music`);
    } else if (command.toLowerCase().includes('weather')) {
      this.currentApp = 'Weather';
      console.log(`${this.brand} Smart Speaker showing weather information`);
    } else if (command.toLowerCase().includes('volume up')) {
      this.setVolume(this.volume + 10);
    } else if (command.toLowerCase().includes('volume down')) {
      this.setVolume(this.volume - 10);
    } else {
      console.log(`${this.brand} Smart Speaker couldn't understand the command`);
    }
  }

  getStatus() {
    return {
      deviceType: 'Smart Speaker',
      brand: this.brand,
      powerStatus: this.isOn ? 'ON' : 'OFF',
      volume: this.volume,
      currentApp: this.currentApp,
      availableApps: [...this.availableApps],
    };
  }
}

/**
 * Abstraction - Defines the interface for the "control" part of the bridge
 */
class RemoteControl {
  /**
   * Create a new remote control for a specific device
   * @param {DeviceImplementation} device - The device to control
   */
  constructor(device) {
    this.device = device;
  }

  /**
   * Power the device on
   */
  power() {
    if (this.device.getStatus().powerStatus === 'ON') {
      this.device.turnOff();
    } else {
      this.device.turnOn();
    }
  }

  /**
   * Increase the volume
   * @param {number} amount - Amount to increase by (default: 10)
   */
  volumeUp(amount = 10) {
    const currentVolume = this.device.getStatus().volume;
    this.device.setVolume(currentVolume + amount);
  }

  /**
   * Decrease the volume
   * @param {number} amount - Amount to decrease by (default: 10)
   */
  volumeDown(amount = 10) {
    const currentVolume = this.device.getStatus().volume;
    this.device.setVolume(currentVolume - amount);
  }

  /**
   * Set a specific channel
   * @param {number} channel - Channel to set
   */
  setChannel(channel) {
    this.device.setChannel(channel);
  }

  /**
   * Get the device status
   * @returns {Object} Device status
   */
  getDeviceStatus() {
    return this.device.getStatus();
  }

  /**
   * Print the device status to console
   */
  printStatus() {
    const status = this.device.getStatus();
    console.log('\nDevice Status:');
    Object.entries(status).forEach(([key, value]) => {
      console.log(`- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
    });
  }
}

/**
 * Refined Abstraction - Advanced Remote Control with additional features
 */
class AdvancedRemoteControl extends RemoteControl {
  constructor(device) {
    super(device);
  }

  /**
   * Mute the device
   */
  mute() {
    const status = this.device.getStatus();
    console.log(`Setting ${status.deviceType} to mute`);
    this.device.setVolume(0);
  }

  /**
   * Channel up - implementation varies by device type
   */
  channelUp() {
    const status = this.device.getStatus();

    if (status.deviceType === 'TV') {
      this.device.setChannel(status.channel + 1);
    } else if (status.deviceType === 'Radio') {
      // For FM, increase by 0.1 MHz
      // For AM, increase by 10 kHz
      if (status.band === 'FM') {
        this.device.setChannel(status.frequency + 0.1);
      } else {
        this.device.setChannel(status.frequency + 10);
      }
    } else if (status.deviceType === 'Smart Speaker') {
      // For Smart Speaker, cycle through apps
      const appIndex = status.availableApps.indexOf(status.currentApp);
      const nextAppIndex = (appIndex + 1) % status.availableApps.length;
      this.device.setChannel(nextAppIndex);
    }
  }

  /**
   * Channel down - implementation varies by device type
   */
  channelDown() {
    const status = this.device.getStatus();

    if (status.deviceType === 'TV') {
      this.device.setChannel(status.channel - 1);
    } else if (status.deviceType === 'Radio') {
      // For FM, decrease by 0.1 MHz
      // For AM, decrease by 10 kHz
      if (status.band === 'FM') {
        this.device.setChannel(status.frequency - 0.1);
      } else {
        this.device.setChannel(status.frequency - 10);
      }
    } else if (status.deviceType === 'Smart Speaker') {
      // For Smart Speaker, cycle through apps
      const appIndex = status.availableApps.indexOf(status.currentApp);
      const prevAppIndex =
        (appIndex - 1 + status.availableApps.length) % status.availableApps.length;
      this.device.setChannel(prevAppIndex);
    }
  }

  /**
   * Special device-specific actions
   */
  performSpecialAction() {
    const status = this.device.getStatus();

    if (status.deviceType === 'Radio') {
      // For Radio, toggle between AM and FM
      console.log('Advanced Remote: Toggling Radio band');
      this.device.toggleBand();
    } else if (status.deviceType === 'Smart Speaker') {
      // For Smart Speaker, issue a voice command
      console.log('Advanced Remote: Sending voice command');
      this.device.voiceCommand('play music');
    } else {
      console.log(`Advanced Remote: No special action for ${status.deviceType}`);
    }
  }
}

/**
 * Refined Abstraction - Universal Remote Control
 * Shows how one abstraction can work with multiple device types
 */
class UniversalRemoteControl extends AdvancedRemoteControl {
  constructor(device) {
    super(device);
    this.devices = [device];
    this.currentDeviceIndex = 0;
  }

  /**
   * Add another device to the universal remote
   * @param {DeviceImplementation} device - The device to add
   */
  addDevice(device) {
    this.devices.push(device);
    console.log(
      `Universal Remote: Added ${device.getStatus().brand} ${device.getStatus().deviceType}`
    );
  }

  /**
   * Switch to the next device
   */
  switchDevice() {
    this.currentDeviceIndex = (this.currentDeviceIndex + 1) % this.devices.length;
    this.device = this.devices[this.currentDeviceIndex];
    const status = this.device.getStatus();
    console.log(`Universal Remote: Switched to ${status.brand} ${status.deviceType}`);
  }

  /**
   * Get a list of all connected devices
   * @returns {Array} Connected devices information
   */
  listDevices() {
    return this.devices.map((device, index) => {
      const status = device.getStatus();
      return {
        index,
        type: status.deviceType,
        brand: status.brand,
        active: index === this.currentDeviceIndex,
      };
    });
  }

  /**
   * Print a list of all connected devices
   */
  printDeviceList() {
    console.log('\nUniversal Remote - Connected Devices:');
    this.listDevices().forEach((device) => {
      console.log(
        `- ${device.index}: ${device.brand} ${device.type} ${device.active ? '(ACTIVE)' : ''}`
      );
    });
  }

  /**
   * Power on/off all devices
   * @param {boolean} on - True to power on, false to power off
   */
  masterPower(on) {
    console.log(`Universal Remote: ${on ? 'Powering on' : 'Powering off'} all devices`);
    this.devices.forEach((device) => {
      if ((device.getStatus().powerStatus === 'ON') !== on) {
        if (on) {
          device.turnOn();
        } else {
          device.turnOff();
        }
      }
    });
  }
}

/**
 * Client code - demonstrates how to use the bridge pattern
 */
function clientCode() {
  // Create different implementation objects
  const samsungTv = new TV('Samsung');
  const sonyRadio = new Radio('Sony');
  const amazonSpeaker = new SmartSpeaker('Amazon');

  console.log('\n=== Basic Remote with TV ===');
  const tvRemote = new RemoteControl(samsungTv);
  tvRemote.power(); // Turn on
  tvRemote.setChannel(15);
  tvRemote.volumeUp(15);
  tvRemote.printStatus();

  console.log('\n=== Advanced Remote with Radio ===');
  const radioRemote = new AdvancedRemoteControl(sonyRadio);
  radioRemote.power(); // Turn on
  radioRemote.volumeUp(5);
  radioRemote.channelUp(); // 87.6 MHz
  radioRemote.channelUp(); // 87.7 MHz
  radioRemote.performSpecialAction(); // Toggle to AM
  radioRemote.printStatus();

  console.log('\n=== Advanced Remote with Smart Speaker ===');
  const speakerRemote = new AdvancedRemoteControl(amazonSpeaker);
  speakerRemote.power(); // Turn on
  speakerRemote.volumeUp(10);
  speakerRemote.setChannel(2); // Set to 'News' app
  speakerRemote.performSpecialAction(); // Voice command
  speakerRemote.printStatus();

  console.log('\n=== Universal Remote controlling multiple devices ===');
  const universalRemote = new UniversalRemoteControl(samsungTv);
  universalRemote.addDevice(sonyRadio);
  universalRemote.addDevice(amazonSpeaker);

  universalRemote.printDeviceList();

  // Control TV (currently active)
  universalRemote.setChannel(25);
  universalRemote.volumeDown(5);

  // Switch to radio
  universalRemote.switchDevice();
  universalRemote.volumeUp(15);
  universalRemote.performSpecialAction(); // Toggle radio band

  // Switch to smart speaker
  universalRemote.switchDevice();
  universalRemote.mute(); // Use advanced function
  universalRemote.performSpecialAction(); // Voice command

  // Master power off
  console.log('\nTurning off all devices:');
  universalRemote.masterPower(false);

  // Show final status of each device
  universalRemote.switchDevice(); // TV
  universalRemote.printStatus();
  universalRemote.switchDevice(); // Radio
  universalRemote.printStatus();
  universalRemote.switchDevice(); // Speaker
  universalRemote.printStatus();
}

// Run the client code
clientCode();

module.exports = {
  DeviceImplementation,
  TV,
  Radio,
  SmartSpeaker,
  RemoteControl,
  AdvancedRemoteControl,
  UniversalRemoteControl,
};
