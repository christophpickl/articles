#!/bin/bash

export ELECTRON_ENABLE_LOGGING=1

tsc src/*.ts && electron .
