/// <reference types="node" />
import express from 'express';
import { Worker } from 'worker_threads';
export default function (worker: Worker): express.Router;
