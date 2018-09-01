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

## Load test

### concurrency: 100

```
$ ab -n 1000 -c 100 ${FUNCTION_URL}/counter?id=1
This is ApacheBench, Version 2.3 <$Revision: 1796539 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking xxx.cloudfunctions.net (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        Google
Server Hostname:        xxx.cloudfunctions.net
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128
TLS Server Name:        xxx.cloudfunctions.net

Document Path:          /counter?id=1
Document Length:        5 bytes

Concurrency Level:      100
Time taken for tests:   54.925 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      314600 bytes
HTML transferred:       5000 bytes
Requests per second:    18.21 [#/sec] (mean)
Time per request:       5492.501 [ms] (mean)
Time per request:       54.925 [ms] (mean, across all concurrent requests)
Transfer rate:          5.59 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       57  152 238.8     71     999
Processing:   456 4986 1862.1   4862   13670
Waiting:      456 4985 1862.2   4862   13670
Total:       1259 5138 1819.9   4962   13748

Percentage of the requests served within a certain time (ms)
  50%   4962
  66%   5699
  75%   6035
  80%   6539
  90%   7225
  95%   8262
  98%   9568
  99%  11561
 100%  13748 (longest request)
```

### concurrency: 10

```
$ ab -n 1000 -c 10 https://xxx.cloudfunctions.net/counter?id=1
This is ApacheBench, Version 2.3 <$Revision: 1796539 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking xxx.cloudfunctions.net (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        Google
Server Hostname:        xxx.cloudfunctions.net
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128
TLS Server Name:        xxx.cloudfunctions.net

Document Path:          /counter?id=1
Document Length:        5 bytes

Concurrency Level:      10
Time taken for tests:   57.980 seconds
Complete requests:      1000
Failed requests:        459
   (Connect: 0, Receive: 0, Length: 459, Exceptions: 0)
Total transferred:      315031 bytes
HTML transferred:       5459 bytes
Requests per second:    17.25 [#/sec] (mean)
Time per request:       579.797 [ms] (mean)
Time per request:       57.980 [ms] (mean, across all concurrent requests)
Transfer rate:          5.31 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       60   76  15.1     72     208
Processing:   336  499  59.8    480     809
Waiting:      336  498  59.7    479     809
Total:        404  575  63.4    556     920

Percentage of the requests served within a certain time (ms)
  50%    556
  66%    584
  75%    602
  80%    614
  90%    662
  95%    698
  98%    755
  99%    798
 100%    920 (longest request)
```
