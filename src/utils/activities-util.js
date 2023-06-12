

export const ACTIVITY_TYPES = {
  MIGRATION_STARTED: 'migration_started',
  MIGRATION_ENDED: 'migration_ended',
  MIGRATION_ERROR: 'migration_error',
  MIGRATION_WARNING: 'migration_warn',
  LOG: 'log',
}

/**
 *
 * @param {Object} data
 * @param {string} data.description A custom description for the activity to be logged
 * @param {string} data.type The type of activity, for example: migration_started, migration_ended
 * @param {string} data.createdBy
 * @param {Object} data.payload
 * @param {number} data.migrationId a migration ID that is unique per migration lot
 * @returns {db.activities} The activity created
 */

