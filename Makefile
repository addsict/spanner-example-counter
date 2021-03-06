.PHONY: setup deploy deploy-datastore clean

setup:
	# create spanner instance
	gcloud spanner instances create ${INSTANCE_ID} --config=regional-us-central1 --nodes=1 --description="Test"
	
	# create table
	PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID} node schema/create_database.js
	PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID} node schema/create_table.js
	
	# load initial data
	PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID} node schema/load_data.js

deploy:
	gcloud beta --project=${PROJECT_ID} functions deploy counter --trigger-http --set-env-vars INSTANCE_ID=${INSTANCE_ID},DATABASE_ID=${DATABASE_ID}

deploy-datastore:
	gcloud --project=${PROJECT_ID} functions deploy counterDatastore --trigger-http

clean:
	gcloud --project=${PROJECT_ID} spanner instances delete ${INSTANCE_ID}
	gcloud --project=${PROJECT_ID} functions delete counter
