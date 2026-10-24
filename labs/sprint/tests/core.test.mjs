import test from 'node:test';
import assert from 'node:assert/strict';
import {makeTask,addTask,updateTask,removeTask,metrics,parseBackup,exportCSV,serialize,makeState} from '../core.mjs';
const start=()=>makeState();
test('cria tarefa com limites claros',()=>{const t=makeTask({id:'a',name:'Praticar TypeScript',project:'ADS',minutes:25,date:'2026-10-25'});assert.equal(t.minutes,25);for(const minutes of [0,-3,361,1.5])assert.throws(()=>makeTask({id:'x',name:'Teste',minutes}));});
test('adiciona, conclui e remove sem mutação',()=>{const base=start(), task=makeTask({id:'id-1',name:'Editar reel',minutes:45});const added=addTask(base,task);assert.equal(base.tasks.length,0);assert.equal(metrics(added).minutes,45);const done=updateTask(added,'id-1',{done:true});assert.equal(metrics(done).complete,1);assert.equal(removeTask(done,'id-1').tasks.length,0);});
test('bloqueia IDs repetidos e excesso de tarefas',()=>{let s=start();let t=makeTask({id:'x',name:'Item'});s=addTask(s,t);assert.throws(()=>addTask(s,t));});
test('backup rejeita campos desconhecidos, datas e versões inválidas',()=>{const s=start();assert.deepEqual(parseBackup(serialize(s)),s);for(const bad of [{version:2,tasks:[]},{version:1,tasks:[],secret:'x'},{version:1,tasks:[{id:'i',name:'x',minutes:5,date:'2026-02-31',project:'ADS',done:false}]}])assert.throws(()=>parseBackup(JSON.stringify(bad)));});
test('CSV protege células que iniciam fórmula',()=>{const s=addTask(start(),makeTask({id:'a',name:'=IMPORTDATA("evil")',project:'Filmagem',minutes:30}));assert.match(exportCSV(s),/\'=IMPORTDATA/);});

test('CSV de Sprint inclui totais e tempo restante para revisão',()=>{
  let s=addTask(start(),makeTask({id:'s1',name:'Estudar React',project:'ADS',minutes:25}));
  s=addTask(s,makeTask({id:'s2',name:'Editar vídeo',project:'Audiovisual',minutes:40,done:true}));
  const csv=exportCSV(s);
  assert.match(csv,/Resumo geral/);
  assert.match(csv,/Total previsto.*65/);
  assert.match(csv,/Minutos pendentes.*25/);
});
