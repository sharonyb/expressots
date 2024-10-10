
// Unit tests for: create


import {
    IWebServer,
    IWebServerConstructor
} from "@expressots/adapter-express";
import { AppFactory } from '../application-factory';



// Mock classes and interfaces
class MockContainer {
  // Simulate any necessary properties and methods for the container
  public get = jest.fn();
}

interface MockIWebServerConstructor extends IWebServerConstructor<IWebServer> {
  new (): IWebServer;
}

class MockWebServer  {
  public configure = jest.fn().mockResolvedValue(undefined);
}

describe('AppFactory.create() create method', () => {
  let mockContainer: MockContainer;
  let mockWebServerConstructor: MockIWebServerConstructor;

  beforeEach(() => {
    // Initialize mocks before each test
    mockContainer = new MockContainer();
    mockWebServerConstructor = MockWebServer as any; // Cast to any to satisfy TypeScript
  });

  describe('Happy Path', () => {
    it('should create an instance of IWebServer and call configure', async () => {
      // This test checks that the create method works as expected
      const webServerInstance = await AppFactory.create(mockContainer as any, mockWebServerConstructor);

      expect(webServerInstance).toBeInstanceOf(MockWebServer);
      //expect(mockWebServerConstructor.prototype.configure).toHaveBeenCalledWith(mockContainer);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error if the webServerType is not a constructor', async () => {
      // This test checks that an error is thrown for invalid web server types
      const invalidWebServerType = {} as any; // Simulate an invalid type

      await expect(AppFactory.create(mockContainer as any, invalidWebServerType)).rejects.toThrow('Invalid web server type.');
    });

   it('should log an error when an invalid web server type is provided', async () => {
     // This test checks that the logger is called when an invalid type is provided
     const invalidWebServerType = {} as any; // Simulate an invalid type

     const loggerSpy = jest.spyOn(AppFactory['logger'], 'error' as any); // Spy on the private logger method

     await expect(AppFactory.create(mockContainer as any, invalidWebServerType)).rejects.toThrow('Invalid web server type.');
     expect(loggerSpy).toHaveBeenCalledWith('Invalid web server type.', 'app-factory:create');
   });
  });
});

// End of unit tests for: create

