/**
 * Abstract Factory Pattern
 * 
 * Provides an interface for creating families of related or dependent objects
 * without specifying their concrete classes.
 */

// Abstract Products
class Button {
    render() {
      throw new Error('Abstract method: render() must be implemented by subclasses');
    }
    
    onClick() {
      throw new Error('Abstract method: onClick() must be implemented by subclasses');
    }
  }
  
  class Checkbox {
    render() {
      throw new Error('Abstract method: render() must be implemented by subclasses');
    }
    
    toggle() {
      throw new Error('Abstract method: toggle() must be implemented by subclasses');
    }
  }
  
  class FormInput {
    render() {
      throw new Error('Abstract method: render() must be implemented by subclasses');
    }
    
    getValue() {
      throw new Error('Abstract method: getValue() must be implemented by subclasses');
    }
  }
  
  // Windows Concrete Products
  class WindowsButton extends Button {
    render() {
      return 'Rendering a Windows button';
    }
    
    onClick() {
      return 'Windows button clicked';
    }
  }
  
  class WindowsCheckbox extends Checkbox {
    render() {
      return 'Rendering a Windows checkbox';
    }
    
    toggle() {
      return 'Windows checkbox toggled';
    }
  }
  
  class WindowsFormInput extends FormInput {
    constructor() {
      super();
      this.value = '';
    }
    
    render() {
      return 'Rendering a Windows form input';
    }
    
    getValue() {
      return `Windows input value: ${this.value}`;
    }
  }
  
  // MacOS Concrete Products
  class MacOSButton extends Button {
    render() {
      return 'Rendering a MacOS button';
    }
    
    onClick() {
      return 'MacOS button clicked';
    }
  }
  
  class MacOSCheckbox extends Checkbox {
    render() {
      return 'Rendering a MacOS checkbox';
    }
    
    toggle() {
      return 'MacOS checkbox toggled';
    }
  }
  
  class MacOSFormInput extends FormInput {
    constructor() {
      super();
      this.value = '';
    }
    
    render() {
      return 'Rendering a MacOS form input';
    }
    
    getValue() {
      return `MacOS input value: ${this.value}`;
    }
  }
  
  // Abstract Factory
  class UIFactory {
    createButton() {
      throw new Error('Abstract method: createButton() must be implemented by subclasses');
    }
    
    createCheckbox() {
      throw new Error('Abstract method: createCheckbox() must be implemented by subclasses');
    }
    
    createFormInput() {
      throw new Error('Abstract method: createFormInput() must be implemented by subclasses');
    }
  }
  
  // Concrete Factories
  class WindowsUIFactory extends UIFactory {
    createButton() {
      return new WindowsButton();
    }
    
    createCheckbox() {
      return new WindowsCheckbox();
    }
    
    createFormInput() {
      return new WindowsFormInput();
    }
  }
  
  class MacOSUIFactory extends UIFactory {
    createButton() {
      return new MacOSButton();
    }
    
    createCheckbox() {
      return new MacOSCheckbox();
    }
    
    createFormInput() {
      return new MacOSFormInput();
    }
  }
  
  // Client code
  function createUI(factory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();
    const input = factory.createFormInput();
    
    return {
      renderUI: () => {
        return [
          button.render(),
          checkbox.render(),
          input.render()
        ].join('\n');
      },
      
      simulateInteraction: () => {
        return [
          button.onClick(),
          checkbox.toggle(),
          input.getValue()
        ].join('\n');
      }
    };
  }
  
  function clientCode() {
    console.log('Client: Testing Windows UI');
    const windowsUI = createUI(new WindowsUIFactory());
    console.log(windowsUI.renderUI());
    console.log(windowsUI.simulateInteraction());
    
    console.log('\nClient: Testing MacOS UI');
    const macUI = createUI(new MacOSUIFactory());
    console.log(macUI.renderUI());
    console.log(macUI.simulateInteraction());
  }
  
  // Run the client code
  clientCode();
  
  module.exports = {
    Button, Checkbox, FormInput,
    WindowsButton, WindowsCheckbox, WindowsFormInput,
    MacOSButton, MacOSCheckbox, MacOSFormInput,
    UIFactory, WindowsUIFactory, MacOSUIFactory,
    createUI
  };