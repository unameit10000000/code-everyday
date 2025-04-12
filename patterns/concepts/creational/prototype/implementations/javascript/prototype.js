/**
 * Prototype Design Pattern
 *
 * The Prototype pattern creates new objects by copying an existing object, known as the prototype,
 * instead of creating new instances from scratch.
 */

// Base Prototype
class Prototype {
  clone() {
    // Default shallow clone implementation
    const clone = Object.create(Object.getPrototypeOf(this));
    const propNames = Object.getOwnPropertyNames(this);

    propNames.forEach((name) => {
      const desc = Object.getOwnPropertyDescriptor(this, name);
      Object.defineProperty(clone, name, desc);
    });

    return clone;
  }
}

// Concrete Prototype: Document
class Document extends Prototype {
  constructor(title, content, author, tags = [], metadata = {}) {
    super();
    this.title = title;
    this.content = content;
    this.author = author;
    this.tags = tags;
    this.metadata = metadata;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Custom deep clone implementation
  clone() {
    // First get a shallow clone from the parent class
    const clone = super.clone();

    // Deep clone arrays and objects
    clone.tags = [...this.tags];
    clone.metadata = JSON.parse(JSON.stringify(this.metadata));

    // Update the clone's timestamps
    clone.createdAt = new Date();
    clone.updatedAt = new Date();

    return clone;
  }

  edit(newContent) {
    this.content = newContent;
    this.updatedAt = new Date();
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  setMetadata(key, value) {
    this.metadata[key] = value;
    this.updatedAt = new Date();
  }

  getInfo() {
    return {
      title: this.title,
      author: this.author,
      createdAt: this.createdAt.toLocaleString(),
      updatedAt: this.updatedAt.toLocaleString(),
      tags: this.tags,
      metadata: this.metadata,
      contentPreview: this.content.substring(0, 50) + (this.content.length > 50 ? '...' : ''),
    };
  }
}

// Document Registry (Prototype Manager)
class DocumentRegistry {
  constructor() {
    this.documents = {};
  }

  registerDocument(key, document) {
    this.documents[key] = document;
  }

  unregisterDocument(key) {
    delete this.documents[key];
  }

  createDocument(key, customizations = {}) {
    const prototype = this.documents[key];

    if (!prototype) {
      throw new Error(`Document type "${key}" doesn't exist in the registry.`);
    }

    const clonedDocument = prototype.clone();

    // Apply customizations to the cloned document
    Object.keys(customizations).forEach((prop) => {
      if (prop === 'tags' && Array.isArray(customizations.tags)) {
        clonedDocument.tags = [...customizations.tags];
      } else if (prop === 'metadata' && typeof customizations.metadata === 'object') {
        clonedDocument.metadata = { ...customizations.metadata };
      } else {
        clonedDocument[prop] = customizations[prop];
      }
    });

    return clonedDocument;
  }
}

// Client code
function clientCode() {
  // Create prototype documents
  const articleTemplate = new Document(
    'Article Template',
    'Your content here...',
    'Editorial Team',
    ['article', 'template'],
    { type: 'article', status: 'draft', wordCount: 0 }
  );

  const tutorialTemplate = new Document(
    'Tutorial Template',
    'Step 1: Introduction\nStep 2: Setup\nStep 3: Implementation\nStep 4: Testing\nStep 5: Conclusion',
    'Tutorial Team',
    ['tutorial', 'template'],
    { type: 'tutorial', difficulty: 'beginner', estimatedTime: '15 minutes' }
  );

  const newsTemplate = new Document(
    'News Template',
    'What happened?\nWhen and where?\nWho was involved?\nWhy is it important?',
    'News Team',
    ['news', 'template'],
    { type: 'news', category: 'general', breakingNews: false }
  );

  // Register prototypes in the registry
  const registry = new DocumentRegistry();
  registry.registerDocument('article', articleTemplate);
  registry.registerDocument('tutorial', tutorialTemplate);
  registry.registerDocument('news', newsTemplate);

  // Create documents from prototypes
  const jsArticle = registry.createDocument('article', {
    title: 'Understanding JavaScript Prototypes',
    author: 'John Doe',
    content: 'JavaScript prototype inheritance is a powerful feature...',
    tags: ['javascript', 'programming', 'tutorial'],
    metadata: {
      type: 'article',
      status: 'published',
      wordCount: 1200,
      difficulty: 'intermediate',
    },
  });

  const reactTutorial = registry.createDocument('tutorial', {
    title: 'Building Your First React Component',
    author: 'Jane Smith',
    tags: ['react', 'javascript', 'web development'],
  });

  const techNews = registry.createDocument('news', {
    title: 'New JavaScript Framework Released',
    content: 'Today, a new JavaScript framework was announced...',
    metadata: {
      category: 'technology',
      breakingNews: true,
    },
  });

  // Modify the cloned documents
  reactTutorial.edit('Step 1: Create a new React project\nStep 2: Design your component...');
  reactTutorial.setMetadata('difficulty', 'intermediate');

  techNews.addTag('javascript');
  techNews.addTag('framework');

  // Display the results
  console.log('JavaScript Article Info:');
  console.log(jsArticle.getInfo());

  console.log('\nReact Tutorial Info:');
  console.log(reactTutorial.getInfo());

  console.log('\nTech News Info:');
  console.log(techNews.getInfo());

  // Clone an existing document directly (without registry)
  const followUpNews = techNews.clone();
  followUpNews.title = 'JavaScript Framework Update';
  followUpNews.edit('The recently released JavaScript framework has been updated with...');
  followUpNews.setMetadata('breakingNews', false);

  console.log('\nFollow-up News Info (direct clone):');
  console.log(followUpNews.getInfo());
}

// Run the client code
clientCode();

module.exports = {
  Prototype,
  Document,
  DocumentRegistry,
};
