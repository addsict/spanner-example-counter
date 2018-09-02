# spanner-example-counter

Example code for implementing a counter with Cloud Spanner and Cloud Functions.

## Setup

```sh
# set environment
PROJECT_ID=xxx
INSTANCE_ID=xxx
DATABASE_ID=xxx

npm install
gcloud auth application-default login

make setup PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID}
make deploy PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID} DATABASE_ID=${DATABASE_ID}
```

## Query

Set `FUNCTION_URL` and curl it.

```sh
FUNCTION_URL=`gcloud functions describe counter --format 'value(httpsTrigger.url)'`
curl ${FUNCTION_URL}/counter?id=1
```

## Cleanup

```sh
make clean PROJECT_ID=${PROJECT_ID} INSTANCE_ID=${INSTANCE_ID}
```

## Load test

### Conditions

* Load test tool: ab
* Total requests: 1000
* Concurrency: 100
* Increment one counter (same counter id)

### Results

Let's compare single-region and multi-region results.

| region config | total time | latency | concurrency |
|---------------|---------------------|------------|-------------|
| single-region (us-central1) | 54 sec | 300 ms/txn | 18 txn/sec |
| multi-region (tam3) | 114 sec | 500 ms/txn | 8.7 txn/sec |


<details>
  <summary>Single region result</summary>
  <pre>$ ab -n 1000 -c 100 ${FUNCTION_URL}/counter?id=1
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
</pre>
</details>

<details>
  <summary>Multi region result</summary>
  <pre>$ ab -n 1000 -c 100 ${FUNCTION_URL}/counter?id=1
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
Time taken for tests:   114.440 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      314952 bytes
HTML transferred:       5000 bytes
Requests per second:    8.74 [#/sec] (mean)
Time per request:       11443.989 [ms] (mean)
Time per request:       114.440 [ms] (mean, across all concurrent requests)
Transfer rate:          2.69 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       60  152 223.2     73    1116
Processing:   740 10520 3032.8  10378   20824
Waiting:      740 10520 3032.9  10374   20824
Total:       1161 10672 2971.4  10512   21751

Percentage of the requests served within a certain time (ms)
  50%  10512
  66%  12013
  75%  12432
  80%  12799
  90%  14560
  95%  15159
  98%  16325
  99%  17819
 100%  21751 (longest request)
</pre>
</details>
