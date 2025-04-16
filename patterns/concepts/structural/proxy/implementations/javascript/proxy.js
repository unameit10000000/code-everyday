/**
 * Proxy Design Pattern
 *
 * The Proxy pattern provides a surrogate or placeholder for another object to control
 * access to it. It creates a representative object that controls access to another object,
 * which may be remote, expensive to create, or in need of security.
 */

// Subject Interface - defines the common interface for RealSubject and Proxy
class DataSource {
  /**
   * Gets data from the source
   * @param {string} query - Query to find specific data
   * @returns {Promise<Object>} - The requested data
   */
  async getData(query) {
    throw new Error('getData method must be implemented by concrete classes');
  }

  /**
   * Saves data to the source
   * @param {Object} data - Data to save
   * @returns {Promise<boolean>} - Success status
   */
  async saveData(data) {
    throw new Error('saveData method must be implemented by concrete classes');
  }
}

// RealSubject - the real object that the proxy represents
class DatabaseSource extends DataSource {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
    this.isConnected = false;
    this.connectionTime = null;
  }

  /**
   * Connects to the database
   * @returns {Promise<void>}
   */
  async connect() {
    console.log(`Connecting to database at ${this.connectionString}...`);

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.isConnected = true;
    this.connectionTime = new Date();
    console.log('Database connection established.');
  }

  /**
   * Disconnects from the database
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.isConnected) {
      console.log('Closing database connection...');

      // Simulate disconnection delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      this.isConnected = false;
      console.log('Database connection closed.');
    }
  }

  /**
   * Gets data from the database
   * @param {string} query - SQL-like query
   * @returns {Promise<Object>} - Query results
   */
  async getData(query) {
    if (!this.isConnected) {
      await this.connect();
    }

    console.log(`Executing database query: ${query}`);

    // Simulate query execution time
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate dummy data based on the query
    const result = {
      query,
      timestamp: new Date(),
      results: [
        { id: 1, name: 'Sample data 1' },
        { id: 2, name: 'Sample data 2' },
        { id: 3, name: 'Sample data 3' },
      ],
    };

    console.log(`Query executed successfully, returned ${result.results.length} records.`);
    return result;
  }

  /**
   * Saves data to the database
   * @param {Object} data - Data to save
   * @returns {Promise<boolean>} - Success status
   */
  async saveData(data) {
    if (!this.isConnected) {
      await this.connect();
    }

    console.log(`Saving data to database: ${JSON.stringify(data)}`);

    // Simulate save operation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log('Data saved successfully.');
    return true;
  }
}

// Proxy - controls access to the DatabaseSource
class DatabaseProxy extends DataSource {
  constructor(connectionString, accessLevel = 'read') {
    super();
    this.connectionString = connectionString;
    this.accessLevel = accessLevel;
    this.realDatabase = null;
    this.cache = new Map();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.lastAccess = null;
  }

  /**
   * Lazily initializes the real database connection
   * @returns {Promise<DatabaseSource>} - The real database
   */
  async getRealDatabase() {
    if (!this.realDatabase) {
      console.log('Proxy: Creating real database connection on first use.');
      this.realDatabase = new DatabaseSource(this.connectionString);
    }
    return this.realDatabase;
  }

  /**
   * Checks if the user has appropriate access
   * @param {string} operation - The operation being attempted
   * @returns {boolean} - Whether access is allowed
   */
  checkAccess(operation) {
    this.lastAccess = new Date();

    if (operation === 'write' && this.accessLevel !== 'write') {
      console.log('Proxy: Write access denied. Current access level: ' + this.accessLevel);
      return false;
    }

    return true;
  }

  /**
   * Gets data, using cache if possible
   * @param {string} query - Query to find specific data
   * @returns {Promise<Object>} - The requested data
   */
  async getData(query) {
    // Security check
    if (!this.checkAccess('read')) {
      throw new Error('Access denied: Read operation not allowed.');
    }

    // Log access
    console.log(`Proxy: getData request received for query: ${query}`);

    // Check cache first
    if (this.cache.has(query)) {
      this.cacheHits++;
      console.log(`Proxy: Cache hit for query "${query}". Using cached data.`);
      return this.cache.get(query);
    }

    this.cacheMisses++;
    console.log(`Proxy: Cache miss for query "${query}". Forwarding to real database.`);

    // Forward to real subject
    const database = await this.getRealDatabase();
    const result = await database.getData(query);

    // Cache the result
    console.log(`Proxy: Caching result for future use.`);
    this.cache.set(query, result);

    return result;
  }

  /**
   * Saves data after checking write access
   * @param {Object} data - Data to save
   * @returns {Promise<boolean>} - Success status
   */
  async saveData(data) {
    // Security check
    if (!this.checkAccess('write')) {
      throw new Error('Access denied: Write operation not allowed with current access level.');
    }

    // Log access
    console.log(`Proxy: saveData request received.`);

    // Validate data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format. Object expected.');
    }

    // Forward to real subject
    const database = await this.getRealDatabase();
    const result = await database.saveData(data);

    // Invalidate cache entries affected by this write
    console.log('Proxy: Data changed, invalidating cache...');
    this.cache.clear();

    return result;
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRatio: this.cacheHits / (this.cacheHits + this.cacheMisses || 1),
      lastAccess: this.lastAccess,
    };
  }

  /**
   * Clear the cache
   */
  clearCache() {
    console.log(`Proxy: Clearing cache with ${this.cache.size} entries.`);
    this.cache.clear();
  }

  /**
   * Closes the real database connection if it exists
   * @returns {Promise<void>}
   */
  async close() {
    if (this.realDatabase && this.realDatabase.isConnected) {
      console.log('Proxy: Closing real database connection.');
      await this.realDatabase.disconnect();
    }
  }
}

/**
 * Client code - demonstrates how to use the proxy
 */
async function clientCode() {
  console.log('CLIENT: Creating read-only database proxy');
  const readOnlyProxy = new DatabaseProxy('db://example.com/mydb', 'read');

  try {
    // Perform read operations
    console.log('\nCLIENT: Performing first read operation');
    const result1 = await readOnlyProxy.getData('SELECT * FROM users');
    console.log(`CLIENT: Received ${result1.results.length} records`);

    // The second identical read should come from cache
    console.log('\nCLIENT: Performing second read operation with same query');
    const result2 = await readOnlyProxy.getData('SELECT * FROM users');
    console.log(`CLIENT: Received ${result2.results.length} records`);

    // Different query should miss cache
    console.log('\nCLIENT: Performing read operation with different query');
    const result3 = await readOnlyProxy.getData('SELECT * FROM products');
    console.log(`CLIENT: Received ${result3.results.length} records`);

    // Show cache statistics
    console.log('\nCLIENT: Checking cache statistics');
    console.log(readOnlyProxy.getCacheStats());

    // Try to save data (should be denied)
    console.log('\nCLIENT: Attempting to write data with read-only proxy');
    try {
      await readOnlyProxy.saveData({ name: 'New record' });
    } catch (error) {
      console.log(`CLIENT: Error: ${error.message}`);
    }

    // Create a proxy with write access
    console.log('\nCLIENT: Creating proxy with write access');
    const writeProxy = new DatabaseProxy('db://example.com/mydb', 'write');

    // Save data with write proxy
    console.log('\nCLIENT: Saving data with write-enabled proxy');
    const saveResult = await writeProxy.saveData({ name: 'New record', value: 42 });
    console.log(`CLIENT: Save operation result: ${saveResult}`);

    // Read after saving
    console.log('\nCLIENT: Reading data after saving');
    const result4 = await writeProxy.getData('SELECT * FROM users WHERE id = 1');
    console.log(`CLIENT: Received data for id 1: ${result4.results[0].name}`);

    // Close connections
    console.log('\nCLIENT: Closing proxy connections');
    await readOnlyProxy.close();
    await writeProxy.close();
  } catch (error) {
    console.error(`CLIENT: Unexpected error: ${error.message}`);
  }
}

// Run the client code
(async () => {
  try {
    await clientCode();
  } catch (error) {
    console.error('Error in client code execution:', error);
  }
})();

module.exports = {
  DataSource,
  DatabaseSource,
  DatabaseProxy,
};
