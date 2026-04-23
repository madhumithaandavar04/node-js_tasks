import { jest } from '@jest/globals';

// mock modules
// mocking the logger
await jest.unstable_mockModule("../../logger/config.js", () => ({
    logger: {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn()
    }
}));

//mock the service
await jest.unstable_mockModule("../../services/buddyServices/buddyServices.js", () => ({
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

// import controller and service
const buddyController = await import("./buddyController.js");
const buddyService = await import("../../services/buddyServices/buddyServices.js");

describe('Buddy Controller Unit Tests', () => {
    let req, res, next;
    // run before every single test
    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(), // Allows chaining: res.status(200).json(...)
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });
    //run after every single test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // getBuddies 
    describe('getBuddies()', () => {
        test('should return 200 and a list of buddies', async () => {
            const mockList = [{ realName: "John" }, { realName: "Jane" }];
            buddyService.getAll.mockResolvedValue(mockList);
            await buddyController.getBuddies(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: "success",
                data: mockList
            });
        });
        test('should call next(error) if getAll fails', async () => {
            const error = new Error("Database error");
            buddyService.getAll.mockRejectedValue(error);
            await buddyController.getBuddies(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    //get buddy
    describe('getBuddy()', () => {
        test('should return 200 and a single buddy', async () => {
            req.params.query = "John";
            const mockBuddy = { realName: "John", employeeId: 101 };
            buddyService.getOne.mockResolvedValue(mockBuddy);
            await buddyController.getBuddy(req, res, next);
            expect(buddyService.getOne).toHaveBeenCalledWith("John");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: "success",
                data: mockBuddy
            });
        });
    });

    //create buddy
    describe('createBuddy()', () => {
        test('should return 201 on successful creation', async () => {
            req.body = { realName: "New Buddy", email: "new@test.com" };
            buddyService.create.mockResolvedValue(true);
            await buddyController.createBuddy(req, res, next);
            expect(buddyService.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Buddy created successfully"
            }));
        });
    });

    //update buddy
    describe('updateBuddy()', () => {
        test('should return 200 and the updated buddy object', async () => {
            req.params.id = "101";
            req.body = { realName: "Updated Name" };
            const updatedResult = { employeeId: 101, realName: "Updated Name" };
            buddyService.update.mockResolvedValue(updatedResult);
            await buddyController.updateBuddy(req, res, next);
            expect(buddyService.update).toHaveBeenCalledWith("101", req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                data: updatedResult
            }));
        });
    });

    //delete buddy
    describe('deleteBuddy()', () => {
        test('should return 201 and success message', async () => {
            req.params.id = "101";
            buddyService.remove.mockResolvedValue(true);
            await buddyController.deleteBuddy(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Buddy deleted successfully"
            }));
        });
        test('should call next(error) if delete service fails', async () => {
            const error = new Error("Delete failed");
            buddyService.remove.mockRejectedValue(error);
            await buddyController.deleteBuddy(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});