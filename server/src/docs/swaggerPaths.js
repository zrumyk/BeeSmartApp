/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required: [name, region, coordinates, max_capacity]
 *       properties:
 *         name: { type: string, example: "Forest Apiary" }
 *         region: { type: string, example: "Lviv Region" }
 *         coordinates:
 *           type: object
 *           properties:
 *             lat: { type: number, example: 49.8397 }
 *             lng: { type: number, example: 24.0297 }
 *         max_capacity: { type: number, example: 100 }
 *     Hive:
 *       type: object
 *       required: [qr_code, location_id, type, installed_at]
 *       properties:
 *         qr_code: { type: string, example: "H-001" }
 *         location_id: { type: string, example: "67b5bc9961c7b99351d26fb1" }
 *         type: { type: string, example: "Langstroth" }
 *         queen:
 *           type: object
 *           properties:
 *             breed: { type: string, example: "Buckfast" }
 *             year: { type: number, example: 2024 }
 *     Inspection:
 *       type: object
 *       required: [hive_id, details]
 *       properties:
 *         hive_id: { type: string }
 *         details:
 *           type: object
 *           properties:
 *             brood_frames: { type: number, example: 8 }
 *             honey_frames: { type: number, example: 4 }
 *             notes: { type: string }
 * 
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "admin@beesmart.com" }
 *               password: { type: string, example: "password123" }
 * 
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: List all apiary locations
 *   post:
 *     tags: [Locations]
 *     summary: Create new location (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Location' }
 *
 * /api/hives:
 *   get:
 *     tags: [Hives]
 *     summary: Get all hives registry
 *   post:
 *     tags: [Hives]
 *     summary: Register a new hive (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Hive' }
 *
 * /api/hives/qr/{qr_code}:
 *   get:
 *     tags: [Hives]
 *     summary: Find hive details by scanning QR
 *     parameters:
 *       - in: path
 *         name: qr_code
 *         required: true
 *         schema: { type: string }
 *
 * /api/hives/{id}/productivity:
 *   get:
 *     tags: [Hives]
 *     summary: Get automated productivity score (1-10)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *
 * /api/inspections/sync:
 *   post:
 *     tags: [Inspections]
 *     summary: Bulk upload offline inspections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: { $ref: '#/components/schemas/Inspection' }
 *
 * /api/vet-tasks/my-tasks:
 *   get:
 *     tags: [VetTasks]
 *     summary: Get active tasks for current beekeeper
 *
 * /api/vet-tasks/{id}/complete:
 *   patch:
 *     tags: [VetTasks]
 *     summary: Mark a task as completed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *
 * /api/iot/hive/{hiveId}/yield:
 *   get:
 *     tags: [IoT]
 *     summary: Get daily weight telemetry analytics
 *     parameters:
 *       - in: path
 *         name: hiveId
 *         required: true
 *         schema: { type: string }
 */
