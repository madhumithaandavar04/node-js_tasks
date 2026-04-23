import { jest } from '@jest/globals';

/**
 * mocking phase
 */

// mock bcryptjs
await jest.unstable_mockModule('bcryptjs', () => ({
    default: {
        compare: jest.fn(),
        hash: jest.fn()
    }
}));

// mock jsonwebtoken
await jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn(),
        verify: jest.fn()
    }
}));

// mock the config
await jest.unstable_mockModule('../../logger/config.js', () => ({
    logger: {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn()
    }
}));

// mock the user model
await jest.unstable_mockModule('../../models/userModel.js', () => ({
    default: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn() // Crucial for your login/logout logic
    }
}));

/**
 * import modules
 */
const authService = await import('./authServices.js');
const { default: User } = await import('../../models/userModel.js');
const { default: bcrypt } = await import('bcryptjs');
const { default: jwt } = await import('jsonwebtoken');
const { logger } = await import('../../logger/config.js');

describe("Auth Services Unit Tests", () => {
    //run after all the test
    afterEach(() => {
        jest.clearAllMocks();
    });

    //test the login service
    describe("login()", () => {
        const credentials = { email: "test@test.com", password: "password123" };
        const mockUser = {
            email: "test@test.com",
            password: "hashedPassword",
            role: "user",
            realName: "Test User",
            _id: "user_id_123"
        };
        test("should return a token and update DB for valid credentials", async () => {
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mock.jwt.token");
            User.updateOne.mockResolvedValue({ modifiedCount: 1 });
            const result = await authService.login(credentials);
            expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, "hashedPassword");
            expect(User.updateOne).toHaveBeenCalledWith(
                { email: credentials.email },
                { token: "Bearer mock.jwt.token" }
            );
            expect(result).toBe("mock.jwt.token");
        });
        test("should throw error if user is not found", async () => {
            User.findOne.mockResolvedValue(null);
            await expect(authService.login(credentials))
                .rejects.toThrow("User not exist");
        });
        test("should throw error if password comparison fails", async () => {
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);
            await expect(authService.login(credentials))
                .rejects.toThrow("Incorrect password");
        });
    });

    //test the logout service
    describe("logout()", () => {
        test("should successfully clear user token from db", async () => {
            const email = "test@test.com";
            User.updateOne.mockResolvedValue({ modifiedCount: 1 });
            await authService.logout(email);
            expect(User.updateOne).toHaveBeenCalledWith(
                { email: email },
                { $set: { token: '' } }
            );
            expect(logger.debug).toHaveBeenCalledWith(expect.stringContaining("clearing the token"));
        });
    });
});