/* eslint-disable mocha/no-mocha-arrows */
const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const HhAdapter = require('../src/adapters/hh');
const MoikrugAdapter = require('../src/adapters/moikrug');

function compare(key, adapter) {
    const hhJobHTML = fs.readFileSync(`./test/mocks/${key}.html`, 'utf8');
    const hhJobMessage = fs.readFileSync(`./test/snapshots/${key}.txt`, 'utf8');
    const { document } = (new JSDOM(hhJobHTML)).window;
    const result = adapter.parseItem({ document });
    // console.log(result);
    assert.equal(result, hhJobMessage);
}

describe('Check parsing', () => {
    it('hh job', () => {
        compare('hh-35174420', HhAdapter);
        compare('hh-35626760', HhAdapter);
    });

    it('moikrug job', () => {
        compare('moikrug-1000055939', MoikrugAdapter);
    });
});
