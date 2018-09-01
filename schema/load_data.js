const Spanner = require('@google-cloud/spanner');

const projectId = process.env.PROJECT_ID;
const instanceId = process.env.INSTANCE_ID;
const databaseId = process.env.DATABASE_ID;

const spanner = new Spanner({
  projectId: projectId,
});

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);
const counterTable = database.table('Counters');

counterTable
  .insert([
    {id: '1', count: 0},
  ])
  .then(() => {
    console.log('Inserted data.');
  })
  .catch(err => {
    console.error('ERROR:', err);
  })
  .then(() => {
    // Close the database when finished.
    return database.close();
  });
