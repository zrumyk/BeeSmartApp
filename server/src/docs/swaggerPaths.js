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
 *         status: { type: string, enum: [active, inactive, maintenance], default: active }
 *     Hive:
 *       type: object
 *       required: [qr_code, location_id, type, installed_at]
 *       properties:
 *         qr_code: { type: string, example: "H-001" }
 *         location_id: { type: string, example: "67b5bc9961c7b99351d26fb1" }
 *         type: { type: string, example: "Langstroth" }
 *         status: { type: string, enum: [healthy, weak, sick, needs_attention, archived], default: healthy }
 *         queen:
 *           type: object
 *           properties:
 *             breed: { type: string, example: "Buckfast" }
 *             year: { type: number, example: 2024 }
 *             color_mark: { type: string, example: "Green" }
 *     Inspection:
 *       type: object
 *       required: [hive_id, details]
 *       properties:
 *         hive_id: { type: string }
 *         date: { type: string, format: date-time }
 *         details:
 *           type: object
 *           properties:
 *             brood_frames: { type: number, example: 8 }
 *             honey_frames: { type: number, example: 4 }
 *             temper: { type: string, example: "Calm" }
 *             notes: { type: string }
 *         client_inspection_id: { type: string }
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate and get JWT token
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, properties: { email: {type: string}, password: {type: string} } } } }
 *
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security: [{ bearerAuth: [] }]
 *
 * /api/auth/beekeepers:
 *   get:
 *     tags: [Auth]
 *     summary: List all users with beekeeper role (Admin)
 *
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: List all apiary locations
 *   post:
 *     tags: [Locations]
 *     summary: Create new location (Admin)
 *     requestBody: { content: { application/json: { schema: { $ref: '#/components/schemas/Location' } } } }
 *
 * /api/locations/{id}:
 *   get:
 *     tags: [Locations]
 *     summary: Get specific Location details
 *   put:
 *     tags: [Locations]
 *     summary: Update Location info (Admin)
 *   delete:
 *     tags: [Locations]
 *     summary: Delete Location (Admin)
 *
 * /api/hives:
 *   get:
 *     tags: [Hives]
 *     summary: Get all registered hives
 *   post:
 *     tags: [Hives]
 *     summary: Register a new hive (Admin)
 *     requestBody: { content: { application/json: { schema: { $ref: '#/components/schemas/Hive' } } } }
 *
 * /api/hives/qr/{qr_code}:
 *   get: { tags: [Hives], summary: "Find hive by QR code", parameters: [{ in: path, name: qr_code, required: true }] }
 *
 * /api/hives/sick:
 *   get: { tags: [Hives], summary: "Get hives marked as sick or requiring attention" }
 *
 * /api/hives/{id}/productivity:
 *   get: { tags: [Hives], summary: "Calculate hive productivity score (1-10)", parameters: [{ in: path, name: id, required: true }] }
 *
 * /api/inspections:
 *   get: { tags: [Inspections], summary: "List all inspections log (Admin)" }
 *   post: { tags: [Inspections], summary: "Add inspection record", requestBody: { content: { application/json: { schema: { $ref: '#/components/schemas/Inspection' } } } } }
 *
 * /api/inspections/hive/{hiveId}:
 *   get: { tags: [Inspections], summary: "Get inspection history for specific hive", parameters: [{ in: path, name: hiveId, required: true }] }
 *
 * /api/inspections/sync:
 *   post: { tags: [Inspections], summary: "Bulk sync offline inspections from mobile", requestBody: { content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Inspection' } } } } } }
 *
 * /api/vet-tasks:
 *   post: { tags: [VetTasks], summary: "Assign new veterinary task (Admin)" }
 *
 * /api/vet-tasks/my-tasks:
 *   get: { tags: [VetTasks], summary: "List tasks assigned to the current user" }
 *
 * /api/vet-tasks/{id}/complete:
 *   patch: { tags: [VetTasks], summary: "Mark veterinary task as completed", parameters: [{ in: path, name: id, required: true }] }
 *
 * /api/iot/hive/{hiveId}/yield:
 *   get: { tags: [IoT], summary: "Get historical honey yield analytics (weights)", parameters: [{ in: path, name: hiveId, required: true }] }
 */
