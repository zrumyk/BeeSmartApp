jest.mock("../../models", () => ({
  VetTask: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn()
  },
  Hive: {
    exists: jest.fn()
  },
  User: {
    findById: jest.fn()
  }
}));

const { VetTask, Hive, User } = require("../../models");
const { createVetTask, getMyTasksForToday, getAllTasks, completeTask } = require("../vetTask.service");

describe("vetTask.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createVetTask", () => {
    it("creates task for valid hive and beekeeper", async () => {
      Hive.exists.mockResolvedValue(true);
      User.findById.mockResolvedValue({ _id: "u1", role: "beekeeper" });
      VetTask.create.mockResolvedValue({ _id: "t1" });

      const payload = {
        hive_id: "h1",
        assigned_to: "u1",
        task_type: "Обробка від кліща",
        due_date: "2026-04-26"
      };

      const result = await createVetTask(payload);

      expect(VetTask.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ _id: "t1" });
    });

    it("throws 404 when hive is missing", async () => {
      Hive.exists.mockResolvedValue(false);
      User.findById.mockResolvedValue({ _id: "u1", role: "beekeeper" });

      await expect(
        createVetTask({
          hive_id: "h1",
          assigned_to: "u1",
          task_type: "Task",
          due_date: "2026-04-26"
        })
      ).rejects.toMatchObject({ statusCode: 404, message: "Hive not found" });
    });

    it("throws 400 when assignee is not beekeeper", async () => {
      Hive.exists.mockResolvedValue(true);
      User.findById.mockResolvedValue({ _id: "u2", role: "admin" });

      await expect(
        createVetTask({
          hive_id: "h1",
          assigned_to: "u2",
          task_type: "Task",
          due_date: "2026-04-26"
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Vet task can only be assigned to beekeeper"
      });
    });
  });

  describe("getMyTasksForToday", () => {
    it("returns pending tasks for user with populate and sort", async () => {
      const sort = jest.fn().mockResolvedValue([{ _id: "t1" }]);
      const populate = jest.fn().mockReturnValue({ sort });
      VetTask.find.mockReturnValue({ populate });

      const result = await getMyTasksForToday("u1");

      expect(VetTask.find).toHaveBeenCalledWith({ assigned_to: "u1", status: "pending" });
      expect(populate).toHaveBeenCalledWith("hive_id", "qr_code type status location_id");
      expect(sort).toHaveBeenCalledWith({ due_date: 1, createdAt: -1 });
      expect(result).toEqual([{ _id: "t1" }]);
    });
  });

  describe("getAllTasks", () => {
    it("returns all tasks with populated relations", async () => {
      const sort = jest.fn().mockResolvedValue([{ _id: "t1" }]);
      const populateAssigned = jest.fn().mockReturnValue({ sort });
      const populateHive = jest.fn().mockReturnValue({ populate: populateAssigned });
      VetTask.find.mockReturnValue({ populate: populateHive });

      const result = await getAllTasks();

      expect(populateHive).toHaveBeenCalledWith("hive_id", "qr_code type status location_id");
      expect(populateAssigned).toHaveBeenCalledWith("assigned_to", "name email role");
      expect(sort).toHaveBeenCalledWith({ due_date: 1, createdAt: -1 });
      expect(result).toEqual([{ _id: "t1" }]);
    });
  });

  describe("completeTask", () => {
    it("marks task as completed", async () => {
      const save = jest.fn().mockResolvedValue(undefined);
      VetTask.findById.mockResolvedValue({
        _id: "t1",
        assigned_to: "u1",
        status: "pending",
        save
      });

      const result = await completeTask("t1", { _id: "u1", role: "beekeeper" });

      expect(save).toHaveBeenCalled();
      expect(result.status).toBe("completed");
    });

    it("throws 403 when beekeeper completes someone else's task", async () => {
      VetTask.findById.mockResolvedValue({
        _id: "t1",
        assigned_to: "u2",
        status: "pending",
        save: jest.fn()
      });

      await expect(completeTask("t1", { _id: "u1", role: "beekeeper" })).rejects.toMatchObject({
        statusCode: 403,
        message: "You can complete only your own tasks"
      });
    });
  });
});
