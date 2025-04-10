/**
 * Simple Factory Pattern
 *
 * The Simple Factory isn't a formal design pattern but a common programming idiom.
 * It encapsulates object creation logic in a single function or class.
 */

// Products
class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.createdAt = new Date();
  }

  describe() {
    return `User: ${this.name}`;
  }
}

class AdminUser extends User {
  constructor(data) {
    super(data);
    this.permissions = data.permissions || ['read', 'write', 'delete'];
    this.adminLevel = data.adminLevel || 1;
  }

  describe() {
    return `Admin: ${this.name} (Level ${this.adminLevel})`;
  }
}

class CustomerUser extends User {
  constructor(data) {
    super(data);
    this.subscription = data.subscription || 'free';
    this.customerId = `CUST-${Math.floor(Math.random() * 10000)}`;
  }

  describe() {
    return `Customer: ${this.name} (${this.subscription})`;
  }
}

class GuestUser extends User {
  constructor(data) {
    super(data);
    this.sessionId = `SESSION-${Math.floor(Math.random() * 10000)}`;
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  describe() {
    return `Guest: ${this.name || 'Anonymous'} (Expires: ${this.expiresAt.toDateString()})`;
  }
}

// Simple Factory
class UserFactory {
  createUser(type, data = {}) {
    switch (type.toLowerCase()) {
      case 'admin':
        return new AdminUser(data);
      case 'customer':
        return new CustomerUser(data);
      case 'guest':
        return new GuestUser(data);
      default:
        throw new Error(`User type ${type} is not recognized.`);
    }
  }
}

// Client code
function clientCode() {
  const factory = new UserFactory();

  try {
    // Create different types of users
    const admin = factory.createUser('admin', {
      name: 'Admin User',
      email: 'admin@example.com',
      adminLevel: 2,
    });

    const customer = factory.createUser('customer', {
      name: 'John Doe',
      email: 'john@example.com',
      subscription: 'premium',
    });

    const guest = factory.createUser('guest', {
      name: 'Visitor',
    });

    // Use the created users
    console.log(admin.describe());
    console.log(customer.describe());
    console.log(guest.describe());

    // This would throw an error
    // const unknown = factory.createUser('unknown');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

// Run the client code
clientCode();

module.exports = {
  User,
  AdminUser,
  CustomerUser,
  GuestUser,
  UserFactory,
};
