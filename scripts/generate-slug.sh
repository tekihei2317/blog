#!/bin/bash

cat /dev/urandom | base64 | tr -dc 'a-f0-9' | fold -w 14 | head -n 1
