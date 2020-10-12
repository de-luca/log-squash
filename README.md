# Log-Squash

![Quality](https://github.com/de-luca/log-squash/workflows/Quality/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/de-luca/log-squash/branch/main/graph/badge.svg)](https://codecov.io/gh/de-luca/log-squash)

> A "catcher-reducer-squasher" for your logs.

Log-Squash allows you to capture your logs in order to prune or squash them before actually outputing them to you logger.  
This allows you to control your log flow while seeing the whole picture and actually drop or fuse logs together.

**When to use it:**
- in a serverless function
- in a cron/scheduled process
- if you have access after the execution of the process and log ingestion

**When NOT to use it:**
- in a long lived process with heavy/parallele log output
- if you want to be able to stream the logs live

