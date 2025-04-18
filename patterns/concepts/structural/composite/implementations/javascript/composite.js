/**
 * Composite Design Pattern
 *
 * The Composite pattern lets you compose objects into tree structures to represent
 * part-whole hierarchies. It lets clients treat individual objects and compositions
 * of objects uniformly.
 */

/**
 * Component - The common interface for all concrete classes in the composition
 * Both leaves and composites share this interface
 */
class FileSystemComponent {
  /**
   * Returns the name of the component
   * @returns {string} Component name
   */
  getName() {
    throw new Error('getName method must be implemented by concrete classes');
  }

  /**
   * Returns the size of the component
   * @returns {number} Size in bytes
   */
  getSize() {
    throw new Error('getSize method must be implemented by concrete classes');
  }

  /**
   * Returns the type of the component (file or directory)
   * @returns {string} Component type
   */
  getType() {
    throw new Error('getType method must be implemented by concrete classes');
  }

  /**
   * Prints the component details
   * @param {string} indent - Indentation string for pretty printing
   */
  print(indent = '') {
    throw new Error('print method must be implemented by concrete classes');
  }

  /**
   * Returns the full path of the component
   * @returns {string} Full path
   */
  getPath() {
    throw new Error('getPath method must be implemented by concrete classes');
  }

  /**
   * Adds a child component (only works for composites)
   * @param {FileSystemComponent} component - The component to add
   */
  add(component) {
    throw new Error('Operation not supported');
  }

  /**
   * Removes a child component (only works for composites)
   * @param {FileSystemComponent} component - The component to remove
   */
  remove(component) {
    throw new Error('Operation not supported');
  }

  /**
   * Returns a child component by name (only works for composites)
   * @param {string} name - The name of the component to find
   * @returns {FileSystemComponent|null} The found component or null
   */
  getChild(name) {
    throw new Error('Operation not supported');
  }

  /**
   * Returns whether this component is a leaf
   * @returns {boolean} True if leaf, false if composite
   */
  isLeaf() {
    throw new Error('isLeaf method must be implemented by concrete classes');
  }
}

/**
 * Leaf - A component with no children
 * Represents a file in the file system
 */
class File extends FileSystemComponent {
  /**
   * Creates a new file
   * @param {string} name - File name with extension
   * @param {number} size - File size in bytes
   * @param {string} parentPath - Parent directory path
   */
  constructor(name, size, parentPath = '') {
    super();
    this.name = name;
    this.size = size;
    this.parentPath = parentPath;
  }

  /**
   * @inheritdoc
   */
  getName() {
    return this.name;
  }

  /**
   * @inheritdoc
   */
  getSize() {
    return this.size;
  }

  /**
   * @inheritdoc
   */
  getType() {
    return 'file';
  }

  /**
   * @inheritdoc
   */
  print(indent = '') {
    console.log(`${indent}📄 ${this.name} (${this.formatSize(this.size)})`);
  }

  /**
   * Format file size to human-readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size
   */
  formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return this.parentPath ? `${this.parentPath}/${this.name}` : this.name;
  }

  /**
   * @inheritdoc
   */
  isLeaf() {
    return true;
  }
}

/**
 * Composite - A component that may have children
 * Represents a directory in the file system
 */
class Directory extends FileSystemComponent {
  /**
   * Creates a new directory
   * @param {string} name - Directory name
   * @param {string} parentPath - Parent directory path
   */
  constructor(name, parentPath = '') {
    super();
    this.name = name;
    this.children = [];
    this.parentPath = parentPath;
  }

  /**
   * @inheritdoc
   */
  getName() {
    return this.name;
  }

  /**
   * @inheritdoc
   */
  getSize() {
    // Calculate the total size of all children
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  /**
   * @inheritdoc
   */
  getType() {
    return 'directory';
  }

  /**
   * @inheritdoc
   */
  print(indent = '') {
    console.log(
      `${indent}📁 ${this.name} (${this.children.length} items, ${this.formatSize(this.getSize())})`
    );

    // Print all children with increased indentation
    this.children.forEach((child) => {
      child.print(indent + '  ');
    });
  }

  /**
   * Format file size to human-readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size
   */
  formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return this.parentPath ? `${this.parentPath}/${this.name}` : this.name;
  }

  /**
   * @inheritdoc
   */
  add(component) {
    // Set the parent path for the component
    component.parentPath = this.getPath();
    this.children.push(component);
    return component;
  }

  /**
   * @inheritdoc
   */
  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  /**
   * @inheritdoc
   */
  getChild(name) {
    return this.children.find((child) => child.getName() === name) || null;
  }

  /**
   * @inheritdoc
   */
  isLeaf() {
    return false;
  }

  /**
   * Returns all children of the directory
   * @returns {Array} Array of child components
   */
  getChildren() {
    return [...this.children];
  }

  /**
   * Returns the number of children
   * @returns {number} Number of direct children
   */
  count() {
    return this.children.length;
  }

  /**
   * Returns the total number of files in this directory and all subdirectories
   * @returns {number} Total number of files
   */
  countFiles() {
    return this.children.reduce((count, child) => {
      if (child.getType() === 'file') {
        return count + 1;
      } else {
        return count + child.countFiles();
      }
    }, 0);
  }

  /**
   * Returns the total number of directories in this directory and all subdirectories
   * @returns {number} Total number of directories
   */
  countDirectories() {
    return this.children.reduce((count, child) => {
      if (child.getType() === 'directory') {
        // Count this directory and all its subdirectories
        return count + 1 + child.countDirectories();
      }
      return count;
    }, 0);
  }

  /**
   * Finds components by a predicate function
   * @param {Function} predicate - Function that returns true for matches
   * @returns {Array} Array of matching components
   */
  find(predicate) {
    const results = [];

    // Check if this directory matches
    if (predicate(this)) {
      results.push(this);
    }

    // Check all children
    this.children.forEach((child) => {
      if (child.isLeaf()) {
        // For files, just check the predicate
        if (predicate(child)) {
          results.push(child);
        }
      } else {
        // For directories, get their find results too
        results.push(...child.find(predicate));
      }
    });

    return results;
  }

  /**
   * Finds files by extension
   * @param {string} extension - File extension to find (e.g., '.txt')
   * @returns {Array} Array of matching files
   */
  findByExtension(extension) {
    return this.find((component) => {
      return component.getType() === 'file' && component.getName().endsWith(extension);
    });
  }

  /**
   * Finds files larger than the specified size
   * @param {number} size - Size threshold in bytes
   * @returns {Array} Array of matching files
   */
  findLargerThan(size) {
    return this.find((component) => {
      return component.getType() === 'file' && component.getSize() > size;
    });
  }
}

/**
 * Custom composite: Project directory with source code analysis capabilities
 */
class ProjectDirectory extends Directory {
  constructor(name, parentPath = '') {
    super(name, parentPath);
    this.sourceCodeStats = {
      js: { files: 0, lines: 0, size: 0 },
      css: { files: 0, lines: 0, size: 0 },
      html: { files: 0, lines: 0, size: 0 },
    };
    this.lastAnalysis = null;
  }

  /**
   * Analyzes source code files in the project
   * @returns {Object} Source code statistics
   */
  analyzeSourceCode() {
    // Reset statistics
    this.sourceCodeStats = {
      js: { files: 0, lines: 0, size: 0 },
      css: { files: 0, lines: 0, size: 0 },
      html: { files: 0, lines: 0, size: 0 },
    };

    // Find all source code files
    const jsFiles = this.findByExtension('.js');
    const cssFiles = this.findByExtension('.css');
    const htmlFiles = this.findByExtension('.html');

    // Analyze JavaScript files
    jsFiles.forEach((file) => {
      this.sourceCodeStats.js.files++;
      this.sourceCodeStats.js.size += file.getSize();
      this.sourceCodeStats.js.lines += this.estimateLines(file.getSize(), 50); // avg 50 bytes per line
    });

    // Analyze CSS files
    cssFiles.forEach((file) => {
      this.sourceCodeStats.css.files++;
      this.sourceCodeStats.css.size += file.getSize();
      this.sourceCodeStats.css.lines += this.estimateLines(file.getSize(), 40); // avg 40 bytes per line
    });

    // Analyze HTML files
    htmlFiles.forEach((file) => {
      this.sourceCodeStats.html.files++;
      this.sourceCodeStats.html.size += file.getSize();
      this.sourceCodeStats.html.lines += this.estimateLines(file.getSize(), 80); // avg 80 bytes per line
    });

    this.lastAnalysis = new Date();

    return this.sourceCodeStats;
  }

  /**
   * Estimate the number of lines based on file size
   * @param {number} size - File size in bytes
   * @param {number} avgBytesPerLine - Average bytes per line of code
   * @returns {number} Estimated number of lines
   */
  estimateLines(size, avgBytesPerLine) {
    return Math.round(size / avgBytesPerLine);
  }

  /**
   * Prints the project structure with source code statistics
   * @param {string} indent - Indentation string
   */
  print(indent = '') {
    console.log(`${indent}🚀 ${this.name} (Project, ${this.formatSize(this.getSize())})`);

    // Print source code statistics if they have been analyzed
    if (this.lastAnalysis) {
      console.log(`${indent}  Source Code Stats:`);
      console.log(
        `${indent}    JavaScript: ${this.sourceCodeStats.js.files} files, ${this.sourceCodeStats.js.lines} lines`
      );
      console.log(
        `${indent}    CSS: ${this.sourceCodeStats.css.files} files, ${this.sourceCodeStats.css.lines} lines`
      );
      console.log(
        `${indent}    HTML: ${this.sourceCodeStats.html.files} files, ${this.sourceCodeStats.html.lines} lines`
      );
    }

    // Print children
    this.children.forEach((child) => {
      child.print(indent + '  ');
    });
  }

  /**
   * @inheritdoc
   */
  getType() {
    return 'project';
  }
}

/**
 * Factory for creating file system structures - this simplifies client code
 */
class FileSystemFactory {
  /**
   * Creates a file
   * @param {string} name - File name
   * @param {number} size - File size in bytes
   * @param {string} parentPath - Parent path
   * @returns {File} The new file
   */
  static createFile(name, size, parentPath = '') {
    return new File(name, size, parentPath);
  }

  /**
   * Creates a directory
   * @param {string} name - Directory name
   * @param {string} parentPath - Parent path
   * @returns {Directory} The new directory
   */
  static createDirectory(name, parentPath = '') {
    return new Directory(name, parentPath);
  }

  /**
   * Creates a project directory
   * @param {string} name - Project name
   * @param {string} parentPath - Parent path
   * @returns {ProjectDirectory} The new project directory
   */
  static createProject(name, parentPath = '') {
    return new ProjectDirectory(name, parentPath);
  }

  /**
   * Creates a sample file structure for demonstration
   * @returns {Directory} The root directory
   */
  static createSampleFileSystem() {
    // Create root directory
    const root = this.createDirectory('root');

    // Create home directory
    const home = this.createDirectory('home');
    root.add(home);

    // Create user directories
    const user1 = this.createDirectory('user1');
    const user2 = this.createDirectory('user2');
    home.add(user1);
    home.add(user2);

    // Add files to user1
    user1.add(this.createFile('document.txt', 2048));
    user1.add(this.createFile('image.jpg', 4096000));

    // Create documents directory for user1
    const documents = this.createDirectory('documents');
    user1.add(documents);

    // Add files to documents
    documents.add(this.createFile('resume.pdf', 102400));
    documents.add(this.createFile('notes.txt', 1024));

    // Add files to user2
    user2.add(this.createFile('profile.jpg', 2048000));

    // Create a project directory for user2
    const project = this.createProject('my-website');
    user2.add(project);

    // Add source files to project
    const src = this.createDirectory('src');
    project.add(src);

    src.add(this.createFile('index.html', 5120));
    src.add(this.createFile('styles.css', 2048));
    src.add(this.createFile('app.js', 8192));

    const components = this.createDirectory('components');
    src.add(components);

    components.add(this.createFile('header.js', 1024));
    components.add(this.createFile('footer.js', 1024));
    components.add(this.createFile('sidebar.js', 2048));

    return root;
  }
}

/**
 * Client code - demonstrates how to use the composite pattern
 */
function clientCode() {
  // Create a sample file system
  const rootDir = FileSystemFactory.createSampleFileSystem();

  // Print the entire file system
  console.log('File System Structure:');
  rootDir.print();

  console.log('\nTotal size of the file system:', rootDir.formatSize(rootDir.getSize()));

  // Get a specific directory
  const homeDir = rootDir.getChild('home');
  console.log('\nHome directory contains:');
  homeDir.print();

  // Find user1's directory
  const user1Dir = homeDir.getChild('user1');
  console.log(`\nUser1 directory path: ${user1Dir.getPath()}`);
  console.log(
    `User1 directory contains ${user1Dir.countFiles()} files and ${user1Dir.countDirectories()} subdirectories`
  );

  // Find files by extension
  const txtFiles = rootDir.findByExtension('.txt');
  console.log('\nAll .txt files in the file system:');
  txtFiles.forEach((file) => {
    console.log(`- ${file.getPath()} (${file.formatSize(file.getSize())})`);
  });

  // Find large files
  const largeFiles = rootDir.findLargerThan(1000000); // > 1MB
  console.log('\nAll files larger than 1MB:');
  largeFiles.forEach((file) => {
    console.log(`- ${file.getPath()} (${file.formatSize(file.getSize())})`);
  });

  // Find and analyze project
  const user2Dir = homeDir.getChild('user2');
  const project = user2Dir.getChild('my-website');

  console.log('\nProject analysis:');
  const stats = project.analyzeSourceCode();
  console.log('JavaScript:', stats.js.files, 'files,', stats.js.lines, 'lines of code');
  console.log('CSS:', stats.css.files, 'files,', stats.css.lines, 'lines of code');
  console.log('HTML:', stats.html.files, 'files,', stats.html.lines, 'lines of code');

  console.log('\nProject structure with statistics:');
  project.print();

  // Demonstrate uniform treatment of leaves and composites
  console.log('\nDemonstrate uniform treatment of components:');

  // Array of different component types
  const components = [
    rootDir.getChild('home'),
    homeDir.getChild('user1'),
    user1Dir.getChild('document.txt'),
  ];

  // Process all components uniformly
  components.forEach((component) => {
    console.log(`\nComponent: ${component.getName()}`);
    console.log(`Type: ${component.getType()}`);
    console.log(`Path: ${component.getPath()}`);
    console.log(`Size: ${component.formatSize(component.getSize())}`);
    console.log(`Is leaf: ${component.isLeaf()}`);
  });
}

// Run the client code
clientCode();

module.exports = {
  FileSystemComponent,
  File,
  Directory,
  ProjectDirectory,
  FileSystemFactory,
};
