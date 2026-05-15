/**
 * @swagger
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: Get all locations
 *   post:
 *     tags: [Locations]
 *     summary: Create location (admin)
 *
 * /api/locations/{id}:
 *   get:
 *     tags: [Locations]
 *     summary: Get location by ID
 *   put:
 *     tags: [Locations]
 *     summary: Update location (admin)
 *   delete:
 *     tags: [Locations]
 *     summary: Delete location (admin)
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get JWT token
 *
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *
 * /api/hives:
 *   get:
 *     tags: [Hives]
 *     summary: Get all hives
 *   post:
 *     tags: [Hives]
 *     summary: Create hive (admin)
 *
 * /api/hives/qr/{qr_code}:
 *   get:
 *     tags: [Hives]
 *     summary: Find hive by QR code
 *
 * /api/hives/sick:
 *   get:
 *     tags: [Hives]
 *     summary: Get hives requiring treatment
 *
 * /api/hives/{id}/productivity:
 *   get:
 *     tags: [Hives]
 *     summary: Calculate hive productivity score (1-10)
 *
 * /api/inspections:
 *   post:
 *     tags: [Inspections]
 *     summary: Add inspection record
 *
 * /api/inspections/hive/{hiveId}:
 *   get:
 *     tags: [Inspections]
 *     summary: Get inspection history for hive
 *
 * /api/inspections/sync:
 *   post:
 *     tags: [Inspections]
 *     summary: Bulk sync inspections from mobile offline mode
 *
 * /api/vet-tasks:
 *   post:
 *     tags: [VetTasks]
 *     summary: Create veterinary task (admin)
 *
 * /api/vet-tasks/my-tasks:
 *   get:
 *     tags: [VetTasks]
 *     summary: Get beekeeper tasks for today
 *
 * /api/vet-tasks/{id}/complete:
 *   patch:
 *     tags: [VetTasks]
 *     summary: Mark task as completed
 *
 * /api/iot/webhook/weight:
 *   post:
 *     tags: [IoT]
 *     summary: Public webhook for weight telemetry
 *
 * /api/iot/hive/{hiveId}/yield:
 *   get:
 *     tags: [IoT]
 *     summary: Get daily honey yield by hive
 */

