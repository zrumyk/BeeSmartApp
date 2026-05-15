jest.mock("../../models", () => ({
  Inspection: {
    create: jest.fn(),
    find: jest.fn()
  },
  Hive: {
    exists: jest.fn()
  }
}));

const { Inspection, Hive } = require("../../models");
const { createInspection, getHiveInspectionHistory, syncInspections } = require("../inspection.service");

describe("inspection.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInspection", () => {
    it("creates inspection when hive exists", async () => {
      Hive.exists.mockResolvedValue(true);
      Inspection.create.mockResolvedValue({ _id: "i1" });

      const result = await createInspection({
        hive_id: "507f1f77bcf86cd799439011",
        userId: "u1",
        details: { brood_frames: 5, honey_frames: 3 }
      });

      expect(Hive.exists).toHaveBeenCalledWith({ _id: "507f1f77bcf86cd799439011" });
      expect(Inspection.create).toHaveBeenCalled();
      expect(result).toEqual({ _id: "i1" });
    });

    it("throws 404 when hive does not exist", async () => {
      Hive.exists.mockResolvedValue(false);

      await expect(
        createInspection({
          hive_id: "507f1f77bcf86cd799439011",
          userId: "u1",
          details: { brood_frames: 5, honey_frames: 3 }
        })
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Hive not found: 507f1f77bcf86cd799439011"
      });
    });
  });

  describe("getHiveInspectionHistory", () => {
    it("returns populated inspection history sorted by date desc", async () => {
      const sort = jest.fn().mockResolvedValue([{ _id: "i1" }]);
      const populate = jest.fn().mockReturnValue({ sort });
      Inspection.find.mockReturnValue({ populate });

      const result = await getHiveInspectionHistory("hive-1");

      expect(Inspection.find).toHaveBeenCalledWith({ hive_id: "hive-1" });
      expect(populate).toHaveBeenCalledWith("user_id", "name email role");
      expect(sort).toHaveBeenCalledWith({ date: -1, createdAt: -1 });
      expect(result).toEqual([{ _id: "i1" }]);
    });
  });

  describe("syncInspections", () => {
    it("returns created, failed and duplicate counters", async () => {
      Hive.exists.mockResolvedValue(true);
      Inspection.create
        .mockResolvedValueOnce({ _id: "i1" })
        .mockRejectedValueOnce({ code: 11000, message: "duplicate key" })
        .mockRejectedValueOnce(new Error("validation failed"));

      const result = await syncInspections(
        [
          {
            hive_id: "h1",
            date: "2026-01-01",
            client_inspection_id: "c1",
            details: { brood_frames: 1, honey_frames: 1 }
          },
          {
            hive_id: "h1",
            date: "2026-01-02",
            client_inspection_id: "c2",
            details: { brood_frames: 2, honey_frames: 2 }
          },
          {
            hive_id: "h1",
            date: "2026-01-03",
            client_inspection_id: "c3",
            details: { brood_frames: 3, honey_frames: 3 }
          }
        ],
        "user-1"
      );

      expect(result).toMatchObject({
        total: 3,
        saved: 1,
        duplicates: 1,
        failed: 1
      });
      expect(result.ignored).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        client_inspection_id: "c3",
        reason: "validation failed"
      });
    });
  });
});
