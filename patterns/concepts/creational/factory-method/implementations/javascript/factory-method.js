/**
 * Factory Method Pattern
 *
 * Defines an interface for creating an object, but lets subclasses
 * decide which class to instantiate.
 */

// Product interface (base class)
class Document {
  constructor(name) {
    this.name = name;
  }

  open() {
    throw new Error('Abstract method: open() must be implemented by subclasses');
  }

  save() {
    throw new Error('Abstract method: save() must be implemented by subclasses');
  }
}

// Concrete Products
class TextDocument extends Document {
  constructor(name) {
    super(name);
    this.extension = '.txt';
  }

  open() {
    return `Opening text document: ${this.name}${this.extension}`;
  }

  save() {
    return `Saving text document: ${this.name}${this.extension}`;
  }
}

class SpreadsheetDocument extends Document {
  constructor(name) {
    super(name);
    this.extension = '.xlsx';
  }

  open() {
    return `Opening spreadsheet: ${this.name}${this.extension}`;
  }

  save() {
    return `Saving spreadsheet: ${this.name}${this.extension}`;
  }
}

class PresentationDocument extends Document {
  constructor(name) {
    super(name);
    this.extension = '.pptx';
  }

  open() {
    return `Opening presentation: ${this.name}${this.extension}`;
  }

  save() {
    return `Saving presentation: ${this.name}${this.extension}`;
  }
}

// Creator - declares the factory method
class Application {
  constructor() {
    if (this.constructor === Application) {
      throw new Error('Abstract class Application cannot be instantiated');
    }
  }

  // Factory method - to be implemented by subclasses
  createDocument(name) {
    throw new Error('Factory method createDocument() must be implemented by subclasses');
  }

  // Business logic that uses the product
  openDocument(name) {
    // Call the factory method to create a Document object
    const document = this.createDocument(name);

    // Use the document
    return document.open();
  }

  saveDocument(name) {
    const document = this.createDocument(name);
    return document.save();
  }
}

// Concrete Creators
class TextEditor extends Application {
  createDocument(name) {
    return new TextDocument(name);
  }
}

class SpreadsheetApplication extends Application {
  createDocument(name) {
    return new SpreadsheetDocument(name);
  }
}

class PresentationApplication extends Application {
  createDocument(name) {
    return new PresentationDocument(name);
  }
}

// Client code
function clientCode() {
  // Create different applications
  const textEditor = new TextEditor();
  const spreadsheetApp = new SpreadsheetApplication();
  const presentationApp = new PresentationApplication();

  // Use applications with the same client code
  console.log(textEditor.openDocument('Report'));
  console.log(textEditor.saveDocument('Report'));

  console.log(spreadsheetApp.openDocument('Budget'));
  console.log(spreadsheetApp.saveDocument('Budget'));

  console.log(presentationApp.openDocument('Quarterly Results'));
  console.log(presentationApp.saveDocument('Quarterly Results'));
}

// Run the client code
clientCode();

module.exports = {
  Document,
  TextDocument,
  SpreadsheetDocument,
  PresentationDocument,
  Application,
  TextEditor,
  SpreadsheetApplication,
  PresentationApplication,
};
