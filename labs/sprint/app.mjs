import {makeState,makeTask,addTask,updateTask,removeTask,metrics,serialize,parseBackup,exportCSV} from './core.mjs';
const $=id=>document.getElementById(id),KEY='pg-sprint-lab-v1';
let state=makeState(),snapshot=null,editing=null;
let focus={running:false,remain:1500,deadline:0,interval:null};
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
function load(){try{snapshot=localStorage.getItem(KEY);if(snapshot)state=parseBackup(snapshot);}catch(e){notify('Backup local inválido: '+e.message,true)}}
function commit(next){try{if(localStorage.getItem(KEY)!==snapshot){$('save-state').textContent='Conflito entre abas';notify('Dados alterados em outra aba. Exporte um backup antes de recarregar.',true);return false;}const raw=serialize(next);localStorage.setItem(KEY,raw);snapshot=raw;state=next;$('save-state').textContent='Salvo no dispositivo';render();return true;}catch(e){notify('Falha ao salvar: '+e.message,true);return false;}}
const h=(tag,cls='',txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};
function resetForm(){$('task-form').reset();$('task-minutes').value='25';editing=null;$('edit-id').value='';$('task-submit').textContent='Adicionar tarefa ↗';$('cancel-edit').hidden=true;}
function render(){const m=metrics(state);$('metric-total').textContent=m.total;$('metric-done').textContent=m.complete;$('metric-minutes').textContent=m.remaining+' min';const query=$('search').value.toLocaleLowerCase('pt-BR').trim(),filter=$('filter').value;const list=$('task-list');list.replaceChildren();const filtered=state.tasks.filter(t=>(filter==='all'||(filter==='done')===t.done)&&(t.name+' '+t.project).toLocaleLowerCase('pt-BR').includes(query));$('empty-state').hidden=filtered.length>0;for(const t of filtered){const li=h('li','task-card');const top=h('div','task-main'),label=h('label','check-line'),box=h('input');box.type='checkbox';box.checked=t.done;box.setAttribute('aria-label','Concluir '+t.name);box.addEventListener('change',()=>apply(()=>updateTask(state,t.id,{done:box.checked})));label.append(box,h('span',t.done?'task-name done':'task-name',t.name));top.append(label,h('small','task-meta',t.project+' • '+t.minutes+' min'+(t.date?' • '+t.date:'')));const actions=h('div','card-actions');for(const [text,fn] of [['Editar',()=>edit(t)],['Excluir',()=>{if(confirm('Excluir tarefa?'))apply(()=>removeTask(state,t.id))}]]){const btn=h('button','mini',text);btn.type='button';btn.addEventListener('click',fn);actions.append(btn);}li.append(top,actions);list.append(li);}const sel=$('focus-task'),before=sel.value;sel.replaceChildren(new Option('Sessão sem tarefa',''));for(const t of state.tasks.filter(t=>!t.done))sel.append(new Option(t.name+' ('+t.minutes+' min)',t.id));if([...sel.options].some(x=>x.value===before))sel.value=before;}
function apply(fn){try{const next=fn();if(!commit(next))render();}catch(e){notify(e.message,true);render()}}
function edit(t){editing=t.id;$('edit-id').value=t.id;$('task-name').value=t.name;$('task-project').value=t.project;$('task-minutes').value=t.minutes;$('task-date').value=t.date;$('task-submit').textContent='Salvar alterações ↗';$('cancel-edit').hidden=false;$('task-name').focus();}
function download(text,name,mime){const b=new Blob([text],{type:mime});const url=URL.createObjectURL(b);const a=h('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}
function clockRender(){const m=Math.floor(focus.remain/60),s=focus.remain%60;$('clock').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');$('timer-status').textContent=focus.running?'SESSÃO EM ANDAMENTO':focus.remain===0?'SESSÃO CONCLUÍDA':'PAUSADO / PRONTO';$('timer-toggle').textContent=focus.running?'Pausar':'Iniciar foco';}
function tick(){if(!focus.running)return;focus.remain=Math.max(0,Math.ceil((focus.deadline-Date.now())/1000));if(!focus.remain){focus.running=false;clearInterval(focus.interval);notify('Bloco de foco concluído. Marque a tarefa como feita se estiver pronta.');}clockRender();}
$('task-form').addEventListener('submit',e=>{e.preventDefault();try{const id=editing||newId();const t=makeTask({id,name:$('task-name').value,project:$('task-project').value,minutes:Number($('task-minutes').value),date:$('task-date').value,done:editing?state.tasks.find(t=>t.id===editing).done:false});const next=editing?updateTask(state,id,t):addTask(state,t);if(commit(next)){const wasEdit=Boolean(editing);resetForm();notify(wasEdit?'Alterações salvas.':'Tarefa salva.');}}catch(err){notify(err.message,true)}});
$('cancel-edit').addEventListener('click',resetForm);
for(const key of ['search','filter'])$(key).addEventListener(key==='search'?'input':'change',render);
$('timer-toggle').addEventListener('click',()=>{if(focus.running){tick();focus.running=false;clearInterval(focus.interval);}else{if(focus.remain===0)focus.remain=1500;focus.deadline=Date.now()+focus.remain*1000;focus.running=true;focus.interval=setInterval(tick,500)}clockRender()});
$('timer-reset').addEventListener('click',()=>{focus.running=false;clearInterval(focus.interval);const t=state.tasks.find(x=>x.id===$('focus-task').value);focus.remain=(t?.minutes||25)*60;clockRender()});
$('focus-task').addEventListener('change',()=>{$('timer-reset').click()});
$('export-json').addEventListener('click',()=>download(serialize(state),'pg-sprint-backup.json','application/json'));
$('export-csv').addEventListener('click',()=>download(exportCSV(state),'pg-sprint-tarefas.csv','text/csv;charset=utf-8'));
$('import-trigger').addEventListener('click',()=>$('import-json').click());
$('import-json').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>300000)throw Error('Arquivo grande demais.');const data=parseBackup(await file.text());if(!confirm('Substituir tarefas atuais pelas tarefas do backup?'))return;if(commit(data)){resetForm();notify('Backup importado.')}}catch(err){notify('Importação recusada: '+err.message,true)}finally{e.target.value=''}});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue!==snapshot){$('save-state').textContent='Alteração em outra aba';notify('Outra aba salvou dados. Faça backup e recarregue antes de editar.',true)}});
load();render();clockRender();
