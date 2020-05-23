#!/bin/bash

export ELECTRON_ENABLE_LOGGING=1

tsc -t es5 src/*.ts && electron .
