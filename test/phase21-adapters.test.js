import test from'node:test';
import assert from'node:assert/strict';
import {RepoMindAdapter} from'../src/adapters/repomind.js';
import {TemenosSkillsAdapter,ProviderUnavailableError} from'../src/adapters/temenos-skills.js';
import {createAdapterConfig,discoverAdapter,validateAdapterCapabilities,validateRepoMindInput,checkAdapterReadiness,onboardRepoMind,onboardTemenosSkills} from'../src/product/adapter-onboarding.js';
import {readFile} from'node:fs/promises';
import {join} from'node:path';
import {fileURLToPath} from'node:url';

const fixture=JSON.parse(await readFile(join(fileURLToPath(new URL('.',import.meta.url)),'fixtures/phase21-real-repomind-export.json'),'utf8'));

test('adapter configuration is explicit and contains no credentials',()=>{
 const config=createAdapterConfig({id:'repomind',provider:'repomind',requiredCapabilities:['listArtifacts']});
 assert.deepEqual(config,{id:'repomind',provider:'repomind',enabled:true,requiredCapabilities:['listArtifacts'],settings:{}});
 assert.equal(JSON.stringify(config).includes('password'),false);
});

test('adapter discovery and capability validation use the real adapter contracts',()=>{
 const repo=new RepoMindAdapter();
 const skills=new TemenosSkillsAdapter({skillsHome:'fixture',runner:async()=>JSON.stringify({status:'READY',release:'R25'})});
 assert.equal(discoverAdapter(repo).id,'repomind');
 assert.equal(discoverAdapter(skills).capabilities.length,4);
 assert.equal(validateAdapterCapabilities(repo,['getDependencies','analyzeImpact']).valid,true);
 assert.deepEqual(validateAdapterCapabilities(repo,['missingCapability']).missing,['missingCapability']);
});

test('RepoMind input validation rejects malformed exports',()=>{
 const result=validateRepoMindInput({files:[{path:'ok.js'},{}],imports:[{from:'a.js'}]});
 assert.equal(result.valid,false);
 assert.deepEqual(result.errors,['RepoMind file[1].path is required','RepoMind import[0] target is required']);
});

test('RepoMind readiness is unverified before loading and ready after loading',async()=>{
 const adapter=new RepoMindAdapter();
 assert.equal((await checkAdapterReadiness(adapter,{requiredCapabilities:['listArtifacts']})).status,'UNVERIFIED');
 adapter.loadIndex(fixture);
 const readiness=await checkAdapterReadiness(adapter,{requiredCapabilities:['listArtifacts']});
 assert.equal(readiness.status,'READY');
 assert.equal(readiness.checks[0].details.fileCount,2);
});

test('RepoMind onboarding validates and normalizes a deterministic fixture',async()=>{
 const adapter=new RepoMindAdapter();
 const result=await onboardRepoMind({adapter,input:fixture,projectId:'bank-r16-r25',release:'R25'});
 assert.equal(result.status,'READY');
 assert.equal(result.profile.fileCount,2);
 assert.equal(result.normalized.artifacts.length,2);
 assert.equal(result.normalized.dependencies.length,1);
 assert.equal(result.normalized.evidence.length,1);
});

test('Temenos-Skills health check uses the injected worker contract',async()=>{
 const calls=[];
 const adapter=new TemenosSkillsAdapter({skillsHome:'fixture',runner:async args=>{calls.push(args);return JSON.stringify({status:'READY',release:args.argv[0]})}});
 const health=await adapter.healthCheck({release:'R25'});
 assert.equal(health.status,'READY');
 assert.equal(health.release,'R25');
 assert.equal(calls.length,1);
 assert.deepEqual(calls[0].argv,['R25']);
 assert.match(calls[0].code,/open_release_db/);
});

test('Temenos-Skills onboarding fails cleanly when required capability is absent',async()=>{
 const adapter=new TemenosSkillsAdapter({skillsHome:'fixture',runner:async()=>JSON.stringify({status:'READY'})});
 const result=await onboardTemenosSkills({adapter,requiredCapabilities:['lookupField','not-real']});
 assert.equal(result.status,'FAILED');
 assert.deepEqual(result.capabilityCheck.missing,['not-real']);
});

test('Temenos-Skills onboarding is ready with a deterministic worker',async()=>{
 const adapter=new TemenosSkillsAdapter({skillsHome:'fixture',runner:async()=>JSON.stringify({status:'READY',release:'R25'})});
 const result=await onboardTemenosSkills({adapter,release:'R25'});
 assert.equal(result.status,'READY');
 assert.equal(result.readiness.checks[0].status,'READY');
});

test('Temenos-Skills provider absence is reported as provider failure',async()=>{
 const adapter=new TemenosSkillsAdapter({skillsHome:'fixture',runner:async()=>{throw new ProviderUnavailableError('worker unavailable')}});
 const result=await onboardTemenosSkills({adapter});
 assert.equal(result.status,'FAILED');
 assert.equal(result.readiness.checks[0].status,'FAILED');
 assert.match(result.readiness.checks[0].error,/worker unavailable/);
});
