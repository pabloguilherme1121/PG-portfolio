export const MAX_TASKS = 150;
const fields=(o,keys)=>o && typeof o==='object' && !Array.isArray(o) && Object.keys(o).every(k=>keys.includes(k));
const limit=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.trim().length<=max;
const text=(s,max)=>typeof s==='string'?s.trim().slice(0,max):'';
const calendar=(s)=>{if(s==='')return true;if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number);return y>=2000&&y<=2100&&m>=1&&m<=12&&d>=1&&d<=new Date(y,m,0).getDate();};
export function makeState(){return {version:1,tasks:[]};}
export function makeTask(t){const allowed=['id','name','project','minutes','date','done'];if(!fields(t,allowed)||!limit(t.id,80)||!limit(t.name,90))throw Error('Informe ID e tarefa válidos.');const project=text(t.project??'Pessoal',48),date=t.date??'',minutes=t.minutes??25,done=t.done??false;
if(!project||!calendar(date)||!Number.isInteger(minutes)||minutes<1||minutes>360||typeof done!=='boolean')throw Error('Dados da tarefa inválidos.');return {id:t.id,name:text(t.name,90),project,minutes,date,done};}
export function validate(s){if(!fields(s,['version','tasks'])||s.version!==1||!Array.isArray(s.tasks)||s.tasks.length>MAX_TASKS)throw Error('Formato de tarefas inválido.');const ids=new Set();const tasks=s.tasks.map(t=>{const c=makeTask(t);if(ids.has(c.id))throw Error('ID duplicado.');ids.add(c.id);return c});return {version:1,tasks};}
export function addTask(s,t){const base=validate(s),x=makeTask(t);if(base.tasks.length>=MAX_TASKS)throw Error('Limite de 150 tarefas.');return validate({...base,tasks:[x,...base.tasks]});}
export function updateTask(s,id,patch){const b=validate(s),i=b.tasks.findIndex(t=>t.id===id);if(i<0)throw Error('Tarefa não encontrada.');return validate({...b,tasks:b.tasks.map(t=>t.id===id?makeTask({...t,...patch,id}):t)});}
export function removeTask(s,id){const b=validate(s);return validate({...b,tasks:b.tasks.filter(t=>t.id!==id)});}
export function metrics(s){const {tasks}=validate(s);return {total:tasks.length,complete:tasks.filter(t=>t.done).length,minutes:tasks.reduce((v,t)=>v+t.minutes,0),remaining:tasks.filter(t=>!t.done).reduce((v,t)=>v+t.minutes,0)};}
export function serialize(s){return JSON.stringify(validate(s),null,2);}
export function parseBackup(raw){if(typeof raw!=='string'||raw.length>300000)throw Error('Backup muito grande.');return validate(JSON.parse(raw));}
const cell=s=>{const v=String(s??'');const secured=/^[\s\uFEFF]*[=+\-@\t\r]/.test(v)?`'${v}`:v;return '"'+secured.replaceAll('"','""')+'"';};
export function exportCSV(s){const rows=validate(s).tasks.map(t=>[t.name,t.project,t.minutes,t.date,t.done?'Concluída':'Pendente']);const sum=metrics(s);const summary=[['','','','',''],['Resumo geral','','','',''],['Total previsto','',sum.minutes,'','min'],['Minutos pendentes','',sum.remaining,'','min'],['Tarefas concluídas','',sum.complete,'','de '+sum.total]];return '\uFEFF'+[['Tarefa','Projeto','Minutos','Data','Situação'],...rows,...summary].map(r=>r.map(cell).join(';')).join('\r\n')+'\r\n';}

/** Remaining whole seconds from an absolute deadline. Accounts for suspended browser timers. */
export function remainingFocusSeconds(deadline,now=Date.now()){
  if(!Number.isFinite(deadline)||!Number.isFinite(now)||deadline<=0)return 0;
  return Math.max(0,Math.ceil((deadline-now)/1000));
}
