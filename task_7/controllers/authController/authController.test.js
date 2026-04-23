import { jest } from '@jest/globals';

/**
 * Mocking
 * define mocks before controller load
 */

// mock auth service
await jest.unstable_mockModule('../../services/authServices/authServices.js', () => ({
    login: jest.fn(),
    logout: jest.fn()
}));

// global logger setup
global.logger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
};

/**
 * import the controller and service after mocks.
 */
const authController = await import('./authController.js');
const authService = await import('../../services/authServices/authServices.js');

describe('Auth Controller Unit Tests', () => {
    let req, res;
    beforeEach(() => {
        // mock req and res
        req = {
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            header: jest.fn().mockReturnThis()
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    //login user
    describe('loginUser()', () => {
        test('should set auth header and return success message', async () => {
            req.body = { email: 'test@test.com', password: 'password123' };
            const mockToken = 'fake-jwt-token';
            // access mocked fn
            authService.login.mockResolvedValue(mockToken);
            await authController.loginUser(req, res);
            expect(authService.login).toHaveBeenCalledWith(req.body);
            expect(res.header).toHaveBeenCalledWith('authorization', mockToken);
            expect(res.json).toHaveBeenCalledWith({
                status: "success",
                message: "User logged in successfully"
            });
        });
        test('should throw error if login service fails', async () => {
            authService.login.mockRejectedValue(new Error("Invalid Credentials"))
            //use dynamic controller reference
            await expect(authController.loginUser(req, res))
                .rejects.toThrow("Invalid Credentials");
        });
    });

    // logout user
    describe('logoutUser()', () => {
        test('should logout successfully based on req.user email', async () => {
            req.user = { email: 'test@test.com' };
            authService.logout.mockResolvedValue();
            await authController.logoutUser(req, res);
            //expected response
            expect(authService.logout).toHaveBeenCalledWith('test@test.com');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: "success"
            }));
        });
    });

    //get user profile
    describe('userProfile()', () => {
        test('should return 200 and user data from request', async () => {
            const mockUserData = { email: 'test@test.com', role: 'admin' };
            req.user = mockUserData;
            await authController.userProfile(req, res);
            //expected response
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUserData);
        });
    });
});