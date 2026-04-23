import { jest } from '@jest/globals';

// mock the modules
// logger module
await jest.unstable_mockModule("../../logger/config.js", () => ({
    logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    }
}));

await jest.unstable_mockModule("../../models/userModel.js", () => {
    //mock user instance
    const mockUserInstance = {
        save: jest.fn()
    };
    // mock user model
    const MockUser = jest.fn(() => mockUserInstance);
    // methods in mock user
    MockUser.find = jest.fn();
    MockUser.exists = jest.fn();
    MockUser.findOne = jest.fn();
    MockUser.findOneAndUpdate = jest.fn();
    MockUser.deleteOne = jest.fn();
    return {
        default: MockUser,
        mockUserInstance
    };
});

// import modules
const buddyService = await import("./buddyServices.js");
const { default: User, mockUserInstance } = await import("../../models/userModel.js");

describe("Buddy Services Unit Tests", () => {
    // run after every test
    afterEach(() => {
        jest.clearAllMocks();  //clear the mock memory after every test
    });
    //test get all service
    describe("getAll()", () => {
        test("should return all buddies from the database", async () => {
            const mockBuddies = [{ employeeId: 1 }, { employeeId: 2 }];
            User.find.mockResolvedValue(mockBuddies);
            const result = await buddyService.getAll();
            expect(User.find).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result).toEqual(mockBuddies);
        });
    });
    //test create service
    describe("create()", () => {
        const mockBuddy = {
            employeeId: 101,
            realName: "John Doe",
            email: "john@example.com",
            dob: "1990-01-01"
        };
        test("should throw 400 if buddy already exists", async () => {
            User.exists.mockResolvedValue(true);
            await expect(buddyService.create(mockBuddy))
                .rejects.toThrow("Buddy already exist.");
        });
        test("should save a new user successfully", async () => {
            User.exists.mockResolvedValue(false);
            mockUserInstance.save.mockResolvedValue(true);
            //attach data to our fake instance
            Object.assign(mockUserInstance, mockBuddy);
            const result = await buddyService.create(mockBuddy);
            expect(mockUserInstance.save).toHaveBeenCalled();
            expect(result.employeeId).toBe(101);
        });
    });

    // test update buddy
    describe("update()", () => {
        const updateData = { realName: "John Updated" };
        test("should update and return the buddy if it exists", async () => {
            //if user already exist
            User.exists.mockResolvedValue(true);
            User.findOneAndUpdate.mockResolvedValue({ employeeId: "101", ...updateData });
            const result = await buddyService.update("101", updateData);
            expect(User.findOneAndUpdate).toHaveBeenCalled();
            expect(result.realName).toBe("John Updated");
        });
        test("should throw 400 if buddy to update is not found", async () => {
            User.exists.mockResolvedValue(false);
            await expect(buddyService.update("999", updateData))
                .rejects.toThrow("Buddy doesn't exist");
        });
    });

    // remove buddy
    describe("remove()", () => {
        test("should delete buddy if they exist", async () => {
            User.exists.mockResolvedValue(true);
            User.deleteOne.mockResolvedValue({ deletedCount: 1 });
            await buddyService.remove("101");
            expect(User.deleteOne).toHaveBeenCalledWith({ employeeId: "101" });
        });
        test("should throw error if buddy to delete doesn't exist", async () => {
            User.exists.mockResolvedValue(false);
            await expect(buddyService.remove("999"))
                .rejects.toThrow("Buddy doesn't exist");
        });
    });

    // test getBuddyByIdOrName service
    describe("getBuddyByIdOrName()", () => {
        test("should find a user by ID (numeric query)", async () => {
            const mockUser = { employeeId: 101, realName: "John Doe" };
            User.findOne.mockResolvedValue(mockUser);
            const result = await buddyService.getBuddyByIdOrName("101");
            expect(User.findOne).toHaveBeenCalled();
            expect(result.employeeId).toBe(101);
        });
        test("should throw 404 if no user found", async () => {
            User.findOne.mockResolvedValue(null);
            await expect(buddyService.getBuddyByIdOrName("UnknownUser"))
                .rejects.toThrow("Buddy doesn't exist");
        });
    });
});