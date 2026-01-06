import { faker } from '@faker-js/faker';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

// Load Chai assertions
globalThis.chai = chai;
globalThis.expect = chai.expect;
globalThis.assert = chai.assert;
chai.should();

// Load Sinon
globalThis.sinon = sinon;
// Updated to @faker-js/faker (modern version)
globalThis.faker = faker;
chai.use(chaiHttp);
