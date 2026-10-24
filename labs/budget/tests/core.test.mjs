import test from 'node:test';
import assert from 'node:assert/strict';
import {newBudget,addItem,updateItem,deleteItem,totals,validate,serialize,parseBackup,exportCSV,makeItem} from '../core.mjs';
test('contabiliza centavos sem ponto flutuante',()=>{let b=newBudget('Projeto audiovisual');b=addItem(b,makeItem({id:'i1',description:'Transporte',qty:2,unitCents:1355,kind:'expense'}));b=addItem(b,makeItem({id:'i2',description:'Receita estimada',qty:1,unitCents:6000,kind:'income'}));assert.deepEqual(totals(b),{expense:2710,income:6000,balance:3290});});
test('não aceita valores negativos, infinitos e campos inesperados',()=>{for(const x of [-1,0,1.5,Infinity])assert.throws(()=>makeItem({id:'a',description:'x',qty:x,unitCents:100,kind:'expense'}));assert.throws(()=>makeItem({id:'a',description:'x',qty:1,unitCents:-1,kind:'expense'}));});
test('editar e excluir preservam imutabilidade',()=>{const a=newBudget('Plano');const b=addItem(a,makeItem({id:'a',description:'Bateria',qty:1,unitCents:3000,kind:'expense'}));const c=updateItem(b,'a',{qty:3});assert.equal(totals(b).expense,3000);assert.equal(totals(c).expense,9000);assert.equal(deleteItem(c,'a').items.length,0);});
test('backup faz round trip e rejeita dados inesperados',()=>{const b=newBudget('Captação');assert.deepEqual(parseBackup(serialize(b)),b);assert.throws(()=>parseBackup(JSON.stringify({...b,token:'secret'})));assert.throws(()=>validate({...b,version:99}));});
test('CSV neutraliza injeção de fórmula',()=>{const b=addItem(newBudget('Teste'),makeItem({id:'a',description:'=1+1',qty:1,unitCents:100,kind:'expense'}));assert.match(exportCSV(b),/\'=1\+1/);});

test('CSV de orçamento acompanha totais auditáveis em centavos',()=>{
  let s=addItem(newBudget('Gravação'),makeItem({id:'a',description:'Transporte',qty:2,unitCents:1750,kind:'expense'}));
  s=addItem(s,makeItem({id:'b',description:'Serviço',qty:1,unitCents:10000,kind:'income'}));
  const csv=exportCSV(s);
  assert.match(csv,/Resumo financeiro/);
  assert.match(csv,/Total despesas/);
  assert.match(csv,/35,00/);
  assert.match(csv,/100,00/);
  assert.match(csv,/65,00/);
});
