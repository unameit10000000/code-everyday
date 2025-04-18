/**
 * Adapter Design Pattern
 *
 * The Adapter pattern allows objects with incompatible interfaces to collaborate.
 * It acts as a bridge between two incompatible interfaces by wrapping an instance
 * of one class with a new adapter class that presents the expected interface.
 */

/**
 * Target Interface - defines the domain-specific interface that Client uses
 */
class PaymentProcessor {
  /**
   * Process a payment
   * @param {number} amount - The payment amount
   * @param {string} currency - The currency code (e.g., 'USD')
   * @param {Object} paymentDetails - Card or payment details
   * @returns {Object} - Payment result
   */
  processPayment(amount, currency, paymentDetails) {
    throw new Error('processPayment method must be implemented by concrete classes');
  }

  /**
   * Refund a payment
   * @param {string} transactionId - The original transaction ID
   * @param {number} amount - The refund amount (may be partial)
   * @returns {Object} - Refund result
   */
  refundPayment(transactionId, amount) {
    throw new Error('refundPayment method must be implemented by concrete classes');
  }

  /**
   * Verify payment status
   * @param {string} transactionId - The transaction ID to verify
   * @returns {Object} - Transaction status
   */
  verifyPayment(transactionId) {
    throw new Error('verifyPayment method must be implemented by concrete classes');
  }
}

/**
 * Standard payment processor implementing the target interface directly
 */
class StandardPaymentProcessor extends PaymentProcessor {
  constructor(merchantId, apiKey) {
    super();
    this.merchantId = merchantId;
    this.apiKey = apiKey;
    this.name = 'StandardPaymentGateway';
  }

  /**
   * Process a payment using the standard payment gateway
   * @param {number} amount - The payment amount
   * @param {string} currency - The currency code
   * @param {Object} paymentDetails - Card or payment details
   * @returns {Object} - Payment result
   */
  processPayment(amount, currency, paymentDetails) {
    console.log(`${this.name}: Processing ${currency} ${amount} payment`);
    console.log(`Using merchant ID: ${this.merchantId}`);

    // Simulate payment processing
    const transactionId = 'STD-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);

    return {
      success: true,
      transactionId: transactionId,
      amount: amount,
      currency: currency,
      timestamp: new Date(),
      processor: this.name,
    };
  }

  /**
   * Refund a payment
   * @param {string} transactionId - The original transaction ID
   * @param {number} amount - The refund amount
   * @returns {Object} - Refund result
   */
  refundPayment(transactionId, amount) {
    console.log(`${this.name}: Refunding ${amount} for transaction ${transactionId}`);

    return {
      success: true,
      refundId: 'REF-' + Date.now().toString(),
      originalTransaction: transactionId,
      amount: amount,
      timestamp: new Date(),
      processor: this.name,
    };
  }

  /**
   * Verify payment status
   * @param {string} transactionId - The transaction ID to verify
   * @returns {Object} - Transaction status
   */
  verifyPayment(transactionId) {
    console.log(`${this.name}: Verifying transaction ${transactionId}`);

    return {
      transactionId: transactionId,
      status: 'completed',
      timestamp: new Date(),
      processor: this.name,
    };
  }
}

/**
 * Adaptee - Third-party or legacy payment service with incompatible interface
 */
class LegacyPaymentService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.serviceName = 'LegacyPaymentService';
  }

  /**
   * Initialize a payment (different interface than target)
   * @param {Object} paymentData - Payment data with specific format
   * @returns {Object} - Service-specific response
   */
  initiateTransaction(paymentData) {
    console.log(`${this.serviceName}: Initiating transaction with data:`, paymentData);

    // Simulate legacy service processing
    const reference = 'LEGACY-' + Math.random().toString(36).substring(2, 15);

    return {
      reference: reference,
      status: 'initiated',
      time: new Date().toISOString(),
      service: this.serviceName,
    };
  }

  /**
   * Complete a previously initiated transaction
   * @param {string} reference - Transaction reference from initiation
   * @param {Object} confirmationData - Confirmation details
   * @returns {Object} - Transaction result
   */
  completeTransaction(reference, confirmationData) {
    console.log(`${this.serviceName}: Completing transaction ${reference} with:`, confirmationData);

    return {
      reference: reference,
      result: 'approved',
      authCode: 'AUTH' + Math.floor(Math.random() * 10000),
      time: new Date().toISOString(),
      service: this.serviceName,
    };
  }

  /**
   * Request a refund for a transaction
   * @param {string} reference - Original transaction reference
   * @param {string} reason - Reason for refund
   * @param {number} amount - Amount to refund
   * @returns {Object} - Refund result
   */
  requestRefund(reference, reason, amount) {
    console.log(
      `${this.serviceName}: Requesting refund for ${reference}, reason: ${reason}, amount: ${amount}`
    );

    return {
      reference: reference,
      refundReference: 'LEGREF-' + Math.floor(Math.random() * 10000),
      status: 'refunded',
      time: new Date().toISOString(),
      service: this.serviceName,
    };
  }

  /**
   * Check status of a transaction
   * @param {string} reference - Transaction reference
   * @returns {Object} - Status information
   */
  checkStatus(reference) {
    console.log(`${this.serviceName}: Checking status for transaction ${reference}`);

    return {
      reference: reference,
      currentStatus: 'complete',
      lastUpdated: new Date().toISOString(),
      service: this.serviceName,
    };
  }
}

/**
 * Another Adaptee - Modern third-party payment API with different interface
 */
class ModernPaymentAPI {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.apiName = 'ModernPaymentAPI';
  }

  /**
   * Authorize API access (specific to this service)
   * @returns {string} - Access token
   */
  authorize() {
    console.log(`${this.apiName}: Authorizing client ${this.clientId}`);
    return 'mocked-auth-token-' + Date.now();
  }

  /**
   * Create a payment intent
   * @param {Object} options - Payment options
   * @returns {Object} - Payment intent
   */
  createPaymentIntent(options) {
    const token = this.authorize();
    console.log(`${this.apiName}: Creating payment intent with token ${token}`);
    console.log('Options:', options);

    return {
      id: 'pi_' + Math.random().toString(36).substring(2, 15),
      amount: options.amount,
      currency: options.currency,
      status: 'requires_confirmation',
      created: Date.now(),
      provider: this.apiName,
    };
  }

  /**
   * Confirm a payment intent
   * @param {string} intentId - Payment intent ID
   * @param {Object} confirmOptions - Confirmation details
   * @returns {Object} - Confirmation result
   */
  confirmPaymentIntent(intentId, confirmOptions) {
    console.log(`${this.apiName}: Confirming payment intent ${intentId}`);
    console.log('Confirmation options:', confirmOptions);

    return {
      id: intentId,
      status: 'succeeded',
      confirmed: Date.now(),
      provider: this.apiName,
    };
  }

  /**
   * Issue a refund
   * @param {string} intentId - Payment intent ID
   * @param {Object} refundOptions - Refund options
   * @returns {Object} - Refund result
   */
  createRefund(intentId, refundOptions) {
    console.log(`${this.apiName}: Creating refund for payment intent ${intentId}`);
    console.log('Refund options:', refundOptions);

    return {
      id: 're_' + Math.random().toString(36).substring(2, 12),
      payment_intent: intentId,
      amount: refundOptions.amount,
      status: 'succeeded',
      created: Date.now(),
      provider: this.apiName,
    };
  }

  /**
   * Retrieve payment intent details
   * @param {string} intentId - Payment intent ID
   * @returns {Object} - Payment intent details
   */
  retrievePaymentIntent(intentId) {
    console.log(`${this.apiName}: Retrieving payment intent ${intentId}`);

    return {
      id: intentId,
      status: 'succeeded',
      amount_received: 1000, // Example amount
      created: Date.now() - 3600000, // One hour ago
      provider: this.apiName,
    };
  }
}

/**
 * Adapter - Adapts the LegacyPaymentService to the PaymentProcessor interface
 */
class LegacyPaymentAdapter extends PaymentProcessor {
  /**
   * Create adapter wrapping the legacy payment service
   * @param {LegacyPaymentService} legacyService - The service to adapt
   */
  constructor(legacyService) {
    super();
    this.legacyService = legacyService;
    this.name = 'LegacyPaymentAdapter';
  }

  /**
   * Process payment by adapting to legacy service methods
   * @param {number} amount - The payment amount
   * @param {string} currency - The currency code
   * @param {Object} paymentDetails - Card or payment details
   * @returns {Object} - Standardized payment result
   */
  processPayment(amount, currency, paymentDetails) {
    console.log(`${this.name}: Adapting payment request to legacy service format`);

    // Convert to the format expected by the legacy service
    const legacyPaymentData = {
      amount: amount,
      currencyCode: currency,
      cardNumber: paymentDetails.cardNumber,
      expiryDate: paymentDetails.expiryDate,
      cardHolderName: paymentDetails.cardHolder,
      securityCode: paymentDetails.cvv,
    };

    // First call initiateTransaction
    const initiationResult = this.legacyService.initiateTransaction(legacyPaymentData);

    // Then complete the transaction
    const completionData = {
      paymentMethod: 'card',
      confirmationToken: 'adapted-token-' + Date.now(),
    };

    const legacyResult = this.legacyService.completeTransaction(
      initiationResult.reference,
      completionData
    );

    // Adapt the legacy result to the expected PaymentProcessor result format
    return {
      success: legacyResult.result === 'approved',
      transactionId: legacyResult.reference,
      amount: amount,
      currency: currency,
      timestamp: new Date(legacyResult.time),
      processor: this.name,
      originalResponse: legacyResult,
    };
  }

  /**
   * Refund payment by adapting to legacy service
   * @param {string} transactionId - The original transaction ID
   * @param {number} amount - The refund amount
   * @returns {Object} - Standardized refund result
   */
  refundPayment(transactionId, amount) {
    console.log(`${this.name}: Adapting refund request to legacy service format`);

    // Call the legacy refund method
    const legacyResult = this.legacyService.requestRefund(
      transactionId,
      'Refund requested via adapter',
      amount
    );

    // Adapt the result to the expected format
    return {
      success: legacyResult.status === 'refunded',
      refundId: legacyResult.refundReference,
      originalTransaction: transactionId,
      amount: amount,
      timestamp: new Date(legacyResult.time),
      processor: this.name,
      originalResponse: legacyResult,
    };
  }

  /**
   * Verify payment by adapting to legacy status check
   * @param {string} transactionId - The transaction ID to verify
   * @returns {Object} - Standardized transaction status
   */
  verifyPayment(transactionId) {
    console.log(`${this.name}: Adapting verification request to legacy service format`);

    // Call the legacy status check method
    const legacyResult = this.legacyService.checkStatus(transactionId);

    // Map the legacy status to standard format
    const statusMap = {
      complete: 'completed',
      pending: 'pending',
      failed: 'failed',
      refunded: 'refunded',
    };

    return {
      transactionId: transactionId,
      status: statusMap[legacyResult.currentStatus] || 'unknown',
      timestamp: new Date(legacyResult.lastUpdated),
      processor: this.name,
      originalResponse: legacyResult,
    };
  }
}

/**
 * Adapter - Adapts the ModernPaymentAPI to the PaymentProcessor interface
 */
class ModernPaymentAdapter extends PaymentProcessor {
  /**
   * Create adapter wrapping the modern payment API
   * @param {ModernPaymentAPI} modernApi - The API to adapt
   */
  constructor(modernApi) {
    super();
    this.modernApi = modernApi;
    this.name = 'ModernPaymentAdapter';
    this.intentMap = new Map(); // Store mapping between our IDs and API intent IDs
  }

  /**
   * Process payment by adapting to modern API methods
   * @param {number} amount - The payment amount
   * @param {string} currency - The currency code
   * @param {Object} paymentDetails - Card or payment details
   * @returns {Object} - Standardized payment result
   */
  processPayment(amount, currency, paymentDetails) {
    console.log(`${this.name}: Adapting payment request to modern API format`);

    // Create a payment intent
    const intentOptions = {
      amount: amount * 100, // Modern API might use smallest currency unit (cents)
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      description: `Payment processed via ${this.name}`,
    };

    const intent = this.modernApi.createPaymentIntent(intentOptions);

    // Confirm the payment intent
    const confirmOptions = {
      payment_method: {
        card: {
          number: paymentDetails.cardNumber,
          exp_month: paymentDetails.expiryDate.split('/')[0],
          exp_year: paymentDetails.expiryDate.split('/')[1],
          cvc: paymentDetails.cvv,
        },
        billing_details: {
          name: paymentDetails.cardHolder,
        },
      },
    };

    const confirmation = this.modernApi.confirmPaymentIntent(intent.id, confirmOptions);

    // Generate our own transaction ID and map it to the intent ID
    const transactionId =
      'MODERN-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000);
    this.intentMap.set(transactionId, intent.id);

    // Adapt the result to the expected format
    return {
      success: confirmation.status === 'succeeded',
      transactionId: transactionId,
      amount: amount,
      currency: currency,
      timestamp: new Date(confirmation.confirmed),
      processor: this.name,
      originalResponse: confirmation,
    };
  }

  /**
   * Refund payment by adapting to modern API
   * @param {string} transactionId - The original transaction ID
   * @param {number} amount - The refund amount
   * @returns {Object} - Standardized refund result
   */
  refundPayment(transactionId, amount) {
    console.log(`${this.name}: Adapting refund request to modern API format`);

    // Retrieve the original intent ID from our mapping
    const intentId = this.intentMap.get(transactionId);
    if (!intentId) {
      throw new Error(`Unknown transaction ID: ${transactionId}`);
    }

    // Create refund request options
    const refundOptions = {
      amount: amount * 100, // Convert to smallest currency unit
      reason: 'requested_by_customer',
    };

    // Call the API's refund method
    const refundResult = this.modernApi.createRefund(intentId, refundOptions);

    // Adapt the result to the expected format
    return {
      success: refundResult.status === 'succeeded',
      refundId: refundResult.id,
      originalTransaction: transactionId,
      amount: amount,
      timestamp: new Date(refundResult.created),
      processor: this.name,
      originalResponse: refundResult,
    };
  }

  /**
   * Verify payment by adapting to modern API
   * @param {string} transactionId - The transaction ID to verify
   * @returns {Object} - Standardized transaction status
   */
  verifyPayment(transactionId) {
    console.log(`${this.name}: Adapting verification request to modern API format`);

    // Retrieve the original intent ID from our mapping
    const intentId = this.intentMap.get(transactionId);
    if (!intentId) {
      throw new Error(`Unknown transaction ID: ${transactionId}`);
    }

    // Retrieve the payment intent
    const intentResult = this.modernApi.retrievePaymentIntent(intentId);

    // Map API status to standard format
    const statusMap = {
      succeeded: 'completed',
      requires_payment_method: 'failed',
      requires_confirmation: 'pending',
      requires_action: 'pending',
      processing: 'pending',
      canceled: 'failed',
    };

    return {
      transactionId: transactionId,
      status: statusMap[intentResult.status] || 'unknown',
      timestamp: new Date(intentResult.created),
      processor: this.name,
      originalResponse: intentResult,
    };
  }
}

/**
 * Client code - demonstrates how to use the adapters
 */
function clientCode() {
  // Sample payment details
  const paymentDetails = {
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cardHolder: 'John Doe',
    cvv: '123',
  };

  // Create standard payment processor
  console.log('\n--- Using Standard Payment Processor ---');
  const standardProcessor = new StandardPaymentProcessor('MERCHANT-123', 'api-key-123');

  const standardResult = standardProcessor.processPayment(100.0, 'USD', paymentDetails);
  console.log('Payment result:', standardResult);

  const standardVerification = standardProcessor.verifyPayment(standardResult.transactionId);
  console.log('Verification result:', standardVerification);

  const standardRefund = standardProcessor.refundPayment(standardResult.transactionId, 50.0);
  console.log('Partial refund result:', standardRefund);

  // Create and use legacy payment service with adapter
  console.log('\n--- Using Legacy Payment Service through Adapter ---');
  const legacyService = new LegacyPaymentService('legacy-api-key-456');
  const legacyAdapter = new LegacyPaymentAdapter(legacyService);

  const legacyResult = legacyAdapter.processPayment(75.5, 'EUR', paymentDetails);
  console.log('Payment result through legacy adapter:', legacyResult);

  const legacyVerification = legacyAdapter.verifyPayment(legacyResult.transactionId);
  console.log('Verification result through legacy adapter:', legacyVerification);

  const legacyRefund = legacyAdapter.refundPayment(legacyResult.transactionId, 75.5);
  console.log('Full refund result through legacy adapter:', legacyRefund);

  // Create and use modern payment API with adapter
  console.log('\n--- Using Modern Payment API through Adapter ---');
  const modernApi = new ModernPaymentAPI('client-id-789', 'client-secret-789');
  const modernAdapter = new ModernPaymentAdapter(modernApi);

  const modernResult = modernAdapter.processPayment(200.0, 'GBP', paymentDetails);
  console.log('Payment result through modern adapter:', modernResult);

  const modernVerification = modernAdapter.verifyPayment(modernResult.transactionId);
  console.log('Verification result through modern adapter:', modernVerification);

  const modernRefund = modernAdapter.refundPayment(modernResult.transactionId, 200.0);
  console.log('Full refund result through modern adapter:', modernRefund);

  // Demonstrate that all processors now share the same interface
  console.log('\n--- Using Different Processors with the Same Client Code ---');

  function processPaymentWithProcessor(processor, amount, currency) {
    console.log(
      `\nProcessing payment of ${currency} ${amount} with ${processor.name || 'unknown processor'}`
    );

    // Use the same client code regardless of the actual processor
    const result = processor.processPayment(amount, currency, paymentDetails);
    console.log(`Payment processed, transaction ID: ${result.transactionId}`);

    const verification = processor.verifyPayment(result.transactionId);
    console.log(`Transaction status: ${verification.status}`);

    const refund = processor.refundPayment(result.transactionId, amount / 2);
    console.log(`Refunded ${amount / 2}, refund ID: ${refund.refundId}`);

    return result;
  }

  // Same client code works with all three processors
  processPaymentWithProcessor(standardProcessor, 50.0, 'USD');
  processPaymentWithProcessor(legacyAdapter, 60.0, 'EUR');
  processPaymentWithProcessor(modernAdapter, 70.0, 'GBP');
}

// Run the client code
clientCode();

module.exports = {
  PaymentProcessor,
  StandardPaymentProcessor,
  LegacyPaymentService,
  ModernPaymentAPI,
  LegacyPaymentAdapter,
  ModernPaymentAdapter,
};
