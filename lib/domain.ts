export type Category = { id: string; name: string; color: string };
export type Habit = { id: string; name: string; category: string; essential: boolean; days: number[]; created: string; archived: boolean };
export type Expense = { id: string; date: string; title: string; category: string; total: number; mine: number; person: string; payer: 'me' | 'them'; note: string };
export type BalanceEntry = { id: string; date: string; person: string; amount: number; note: string; kind: 'balance' | 'settlement' };
export type DaygraphState = { sample: boolean; term: { name: string; start: string; end: string }; categories: Category[]; habits: Habit[]; checks: Record<string, string[]>; expenseCategories: Category[]; expenses: Expense[]; balances: BalanceEntry[] };
export const colors = ['#B8D5BE','#8DAEB0','#D8BE8C','#8C95A7','#B9AC9C','#A5BAA7'];
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const shiftDate = (day: string, offset: number) => { const d = new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0,10); };
export const dates = (start: string, end: string) => { const out: string[] = []; for (let d = start; d <= end && out.length < 3660; d = shiftDate(d,1)) out.push(d); return out; };
export const id = () => crypto.randomUUID();
export const money = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: paise % 100 === 0 ? 0 : 2 }).format(paise/100);
export const shortDate = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString('en-IN', { day:'numeric',month:'short' });
export const personKey = (name: string) => name.trim().toLocaleLowerCase();
export function due(habit: Habit, date: string) { return date >= habit.created && (habit.essential || habit.days.includes(new Date(`${date}T12:00:00Z`).getUTCDay())); }
export function progress(state: DaygraphState, start: string, end: string, category?: string) {
  let done = 0, total = 0;
  for (const day of dates(start,end)) for (const habit of state.habits.filter(h => !h.archived && (!category || h.category === category))) if (due(habit,day)) { total++; if (state.checks[day]?.includes(habit.id)) done++; }
  return { done,total,percent: total ? Math.round(done/total*100) : 0 };
}
export function streak(state: DaygraphState, habit: Habit, date = today()) {
  let count = 0;
  for (let day = date, n = 0; n < 3660 && day >= habit.created; day = shiftDate(day,-1), n++) { if (!due(habit,day)) continue; if (state.checks[day]?.includes(habit.id)) count++; else if (day !== date) break; }
  return count;
}
export function balancesByPerson(state: DaygraphState) {
  const map = new Map<string, { person: string; amount: number }>();
  const add = (person: string, amount: number) => { if (!person.trim()) return; const key = personKey(person); const old = map.get(key); map.set(key,{ person: old?.person || person.trim(), amount: (old?.amount || 0)+amount }); };
  for (const e of state.expenses) if (e.person) add(e.person, e.payer === 'them' ? e.mine : -(e.total-e.mine));
  for (const b of state.balances) add(b.person,b.amount);
  return [...map.values()].sort((a,b)=>Math.abs(b.amount)-Math.abs(a.amount));
}
export function createState(sample = true): DaygraphState {
  const day = today(), start = shiftDate(day,-27);
  const categories = ['Routine','Nutrition','Study','Exercise','Mindfulness','Personal growth'].map((name,i)=>({id:`c${i}`,name,color:colors[i]}));
  const habits: Habit[] = [['Morning reset',0,true],['Read 20 pages',5,true],['Drink 2L water',1,true],['Focused study',2,false],['Move for 30 minutes',3,false],['Meditate for 10 minutes',4,false],['Balanced meals',1,false],['Sleep before 11',0,false]].map((h,i)=>({id:`h${i}`,name:String(h[0]),category:`c${h[1]}`,essential:Boolean(h[2]),days:i===4?[1,2,3,4,5]:[0,1,2,3,4,5,6],created:start,archived:false}));
  const checks: Record<string,string[]> = {};
  if (sample) for (const [n,d] of dates(start,day).entries()) checks[d] = habits.filter((h,i)=>due(h,d) && (n === 27 ? [0,2,3,5].includes(i) : ((n*17+i*7)%13)<9)).map(h=>h.id);
  const expenseCategories = ['Food','Transport','Shopping','Home','Learning','Other'].map((name,i)=>({id:`e${i}`,name,color:colors[i]}));
  const expenses: Expense[] = sample ? [
    {id:'x1',date:day,title:'Coffee & breakfast',category:'e0',total:32000,mine:32000,person:'',payer:'me',note:'A slow start to the day'},
    {id:'x2',date:shiftDate(day,-1),title:'Dinner with Aarav',category:'e0',total:120000,mine:60000,person:'Aarav',payer:'them',note:'Equal split at the café'},
    {id:'x3',date:shiftDate(day,-3),title:'Groceries',category:'e0',total:145000,mine:145000,person:'',payer:'me',note:''},
    {id:'x4',date:shiftDate(day,-5),title:'Monthly metro pass',category:'e1',total:90000,mine:90000,person:'',payer:'me',note:''},
    {id:'x5',date:shiftDate(day,-7),title:'Books for the term',category:'e4',total:119900,mine:119900,person:'',payer:'me',note:'Learning, a little every day'},
    {id:'x6',date:shiftDate(day,-8),title:'Home essentials',category:'e3',total:80000,mine:40000,person:'Meera',payer:'me',note:'Split household supplies'},
    {id:'x7',date:shiftDate(day,-12),title:'Running tee',category:'e2',total:79900,mine:79900,person:'',payer:'me',note:''},
    {id:'x8',date:shiftDate(day,-18),title:'Weekend lunch',category:'e0',total:45000,mine:45000,person:'',payer:'me',note:''}
  ] : [];
  return {sample,term:{name:'My 90-day reset',start,end:shiftDate(start,89)},categories,habits:sample?habits:[],checks,expenseCategories,expenses,balances:sample?[{id:'b1',date:shiftDate(day,-1),person:'Aarav',amount:-50000,note:'Paid part of dinner back',kind:'settlement'}]:[]};
}
