const Spanner = require('@google-cloud/spanner');

const projectId = process.env.PROJECT_ID;
const instanceId = process.env.INSTANCE_ID;
const databaseId = process.env.DATABASE_ID;

const spanner = new Spanner({
  projectId: projectId,
});

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

const schema = 
    `CREATE TABLE Counters (
      id     INT64 NOT NULL,
      count  INT64 NOT NULL
    ) PRIMARY KEY (id)`;

database
  .createTable(schema)
  .then(results => {
    const table = results[0];
    const operation = results[1];

    console.log(`Waiting for operation to complete...`);
    return operation.promise();
  })
  .then(() => {
    console.log(`Created Counters table on database ${databaseId}.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
