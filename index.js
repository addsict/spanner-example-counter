const Spanner = require('@google-cloud/spanner');

const spanner = Spanner();
const instanceId = process.env.INSTANCE_ID;
const databaseId = process.env.DATABASE_ID;
const table = 'Counters';

exports.counter = (req, res) => {
  const counterId = req.query['id'];

  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  let count;
  let nextCount;

  console.time('transaction');
  database.runTransaction((err, transaction) => {
    if (err) {
      return handleError(res, err);
    }
    transaction.read(table, {
      columns: [`count`],
      keys: [counterId],
    })
    .then(results => {
      const rows = results[0].map(row => row.toJSON());
      count = rows[0].count;
      console.log(`read counter: id=${counterId}, count=${count}`);

      nextCount = count + 1;
      return transaction.update('Counters', [
        {
          id: 1,
          count: nextCount,
        },
      ]);
    })
    .then(() => {
      return transaction.commit();
    })
    .then(() => {
      console.timeEnd('transaction');
      console.log(`successfully increment counter: id=${counterId}, count=${nextCount}`);
      res.set('Content-Type', 'text/plain');
      res.write(`${nextCount}\n`);
      res.status(200).end();
    })
    .catch(err => {
      return handleError(res, err);
    })
    .then(() => {
      return database.close();
    });
  });
};

function handleError(res, err) {
  console.error(err);
  res
    .status(500)
    .send(`Error: ${err}`)
    .end();
}


// for test datastore version
const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();
exports.counterDatastore = (req, res) => {
  const counterId = req.query['id'];

  const transaction = datastore.transaction();
  let nextCount;

  console.time('transaction');
  transaction
    .run()
    .then(() => {
      return transaction.get(datastore.key(['Counter', counterId]));
    })
    .then(results => {
      let counter = results[0];
      if (!counter) {
        counter = {
          count: 0,
        };
      }

      console.log(`read counter: id=${counterId}, count=${counter.count}`);
      nextCount = counter.count + 1;
      counter.count = nextCount;
      transaction.save([
        {
          key: datastore.key(['Counter', counterId]),
          data: counter,
        },
      ]);

      return transaction.commit();
    })
    .catch(err => {
      return handleError(res, err);
    })
    .then(() => {
      console.timeEnd('transaction');
      console.log(`successfully increment counter: id=${counterId}, count=${nextCount}`);
      res.set('Content-Type', 'text/plain');
      res.write(`${nextCount}\n`);
      res.status(200).end();
    });
};
