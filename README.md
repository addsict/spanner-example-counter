# spanner-example-counter

Example code for implementing a counter with Cloud Spanner.

## Setup

```sh
# set environment
PROJECT_ID=xxx
INSTANCE_ID=xxx
DATABASE_ID=xxx

npm install
gcloud auth application-default login

# create spanner instance
gcloud spanner instances create ${INSTANCE_ID} --config=regional-us-central1 --nodes=1 --description="Test"

# create table
PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID} node schema/create_table.js

# load initial data
PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID} node schema/load_data.js

# deploy function
gcloud beta --project=${PROJECT_ID} functions deploy counter --trigger-http --set-env-vars INSTANCE_ID=${INSTANCE_ID},DATABASE_ID=${DATABASE_ID}
```

## Query

Set `FUNCTION_URL` and curl it.

```sh
curl ${FUNCTION_URL}/counter?id=1
```
