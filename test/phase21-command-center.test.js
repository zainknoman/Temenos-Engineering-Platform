import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

test('command center is a thin read-only browser surface over the report model', async () => {
 const html=await readFile(resolve('docs/command-center.html'),'utf8');
 const js=await readFile(resolve('docs/command-center.js'),'utf8');
 assert.match(html,/TEP Command Center/);assert.match(html,/Load report JSON/);assert.match(html,/Production execution/);
 for(const id of ['findings','risk','remediation','regression','migration','adc','certification','evidence']) assert.match(html,new RegExp('id="'+id+'-value"'));
 assert.match(html,/command-center\.js/);
 for(const token of ['report\.summary','report\.adapters','report\.safety','loadJsonFile','loadFromUrl','renderList']) assert.match(js,new RegExp(token));
 assert.doesNotMatch(js,/fetch.*temenos/i);assert.doesNotMatch(js,/execute|applyRemediation|runMigration|cutover/i);
});
test('command center uses stable read-model count sections', async () => {
 const js=await readFile(resolve('docs/command-center.js'),'utf8');
 assert.match(js,/for\(const key of \['findings','risk','remediation','regression','migration','adc','certification','evidence'\]\)/);
});
