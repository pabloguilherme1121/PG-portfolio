import {newBudget,makeItem,addItem,updateItem,deleteItem,totals,money,serialize,parseBackup,exportCSV,validate} from './core.mjs';
const $=id=>document.getElementById(id),KEY='pg-budget-lab-v1';let budget=newBudget(),snapshot=null,editing=null;
// Browsers without a secure origin may omit crypto.randomUUID (e.g. local HTML previews).
// IDs identify local records only; they are never credentials or access tokens.
function newId(){
  if(typeof crypto!=='undefined' && typeof crypto.randomUUID==='function')return crypto.randomUUID();
  if(typeof crypto!=='undefined' && typeof crypto.getRandomValues==='function'){
    const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
    const h=Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20);
  }
  return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
}
const notify=(msg,bad=false)=>{const el=$('toast');el.textContent=msg;el.hidden=false;el.classList.toggle('bad',bad);clearTimeout(notify.id);notify.id=setTimeout(()=>el.hidden=true,5000)};
function load(){try{snapshot=localStorage.getItem(KEY);if(snapshot)budget=parseBackup(snapshot);}catch(e){notify('Backup local inválido: '+e.message,true)}}
function commit(next){try{if(localStorage.getItem(KEY)!==snapshot){$('save-state').textContent='Conflito entre abas';notify('Outra aba salvou mudanças. Exporte backup e recarregue antes de alterar.',true);return false;}const raw=serialize(next);localStorage.setItem(KEY,raw);snapshot=raw;budget=next;$('save-state').textContent='Salvo no dispositivo';render();return true;}catch(e){notify('Não foi possível salvar: '+e.message,true);return false;}}
const h=(tag,cls='',txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
const toCents=v=>{const s=String(v).trim().replace(/^R\$\s*/, '').replaceAll(' ','');if(!/^\d{1,7}(?:[.,]\d{1,2})?$/.test(s))throw Error('Use valor em reais, ex.: 125,90.');const [int,decimal='']=s.replace(',','.').split('.');return Number(int)*100+Number(decimal.padEnd(2,'0'));};
function resetForm(){$('item-form').reset();$('item-qty').value='1';editing=null;$('edit-id').value='';$('item-submit').textContent='Adicionar item ↗';$('cancel-edit').hidden=true;}
function render(){const t=totals(budget);$('metric-expense').textContent=money(t.expense);$('metric-income').textContent=money(t.income);$('metric-balance').textContent=money(t.balance);$('metric-balance').classList.toggle('negative',t.balance<0);$('budget-title').value=budget.title;document.title=budget.title+' · PG Budget';const q=$('search').value.toLocaleLowerCase('pt-BR').trim(),filter=$('filter').value;const items=budget.items.filter(i=>(filter==='all'||i.kind===filter)&&i.description.toLocaleLowerCase('pt-BR').includes(q));const list=$('item-list');list.replaceChildren();$('empty-state').hidden=items.length>0;for(const i of items){const li=h('li','task-card'),main=h('div','task-main'),head=h('div','budget-line');head.append(h('span','task-name',i.description),h('strong',i.kind==='income'?'value income':'value',money(i.qty*i.unitCents)));main.append(head,h('small','task-meta',(i.kind==='income'?'Entrada':'Despesa')+' • '+i.qty+' × '+money(i.unitCents)));const actions=h('div','card-actions');for(const [label,fn] of [['Editar',()=>edit(i)],['Excluir',()=>{if(confirm('Excluir item?')){const next=deleteItem(budget,i.id);commit(next)}}]]){const btn=h('button','mini',label);btn.type='button';btn.addEventListener('click',fn);actions.append(btn);}li.append(main,actions);list.append(li);}}
function edit(i){editing=i.id;$('edit-id').value=i.id;$('item-description').value=i.description;$('item-qty').value=i.qty;$('item-price').value=(i.unitCents/100).toFixed(2).replace('.',',');$('item-kind').value=i.kind;$('item-submit').textContent='Salvar alterações ↗';$('cancel-edit').hidden=false;$('item-description').focus()}
function download(text,name,type){const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=h('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}
$('item-form').addEventListener('submit',e=>{e.preventDefault();try{const wasEdit=Boolean(editing),id=editing||newId();const item=makeItem({id,description:$('item-description').value,kind:$('item-kind').value,qty:Number($('item-qty').value),unitCents:toCents($('item-price').value)});const next=editing?updateItem(budget,id,item):addItem(budget,item);if(commit(next)){resetForm();notify(wasEdit?'Item atualizado.':'Item adicionado.')}}catch(err){notify(err.message,true)}});
$('save-title').addEventListener('click',()=>{try{const next=validate({...budget,title:$('budget-title').value});if(commit(next))notify('Nome salvo.')}catch(err){notify(err.message,true)}});
$('cancel-edit').addEventListener('click',resetForm);
for(const key of ['search','filter'])$(key).addEventListener(key==='search'?'input':'change',render);
$('export-json').addEventListener('click',()=>download(serialize(budget),'pg-budget-backup.json','application/json'));
$('export-csv').addEventListener('click',()=>download(exportCSV(budget),'pg-budget-itens.csv','text/csv;charset=utf-8'));
$('print').addEventListener('click',()=>window.print());
$('import-trigger').addEventListener('click',()=>$('import-json').click());
$('import-json').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>300000)throw Error('Arquivo acima do limite.');const data=parseBackup(await f.text());if(!confirm('Substituir orçamento atual?'))return;if(commit(data)){resetForm();notify('Backup importado.')}}catch(err){notify('Importação recusada: '+err.message,true)}finally{e.target.value=''}});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue!==snapshot){$('save-state').textContent='Alteração em outra aba';notify('Outra aba alterou os dados. Faça backup e recarregue.',true)}});
load();render();
