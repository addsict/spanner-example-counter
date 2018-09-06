const Spanner = require('@google-cloud/spanner');

const projectId = process.env.PROJECT_ID;
const instanceId = process.env.INSTANCE_ID;
const databaseId = process.env.DATABASE_ID;

const spanner = new Spanner({
  projectId: projectId,
});

const instance = spanner.instance(instanceId);

instance
  .createDatabase(databaseId)
  .then(results => {
    const database = results[0];
    const operation = results[1];

    console.log(`Waiting for operation on ${database.id} to complete...`);
    return operation.promise();
  })
  .then(() => {
    console.log(`Created database ${databaseId} on instance ${instanceId}.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
