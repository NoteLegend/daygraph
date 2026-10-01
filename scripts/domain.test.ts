import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balancesByPerson, createState, due, progress, shiftDate, today, type Expense } from '../lib/domain.ts';
import { stateSchema } from '../lib/validation.ts';
test('Sample journal validates and accounting uses only personal shares',()=>{
  const s=createState();assert.ok(stateSchema.safeParse(s).success);assert.equal(s.expenses.reduce((v,e)=>v+e.mine,0),611800);
  assert.deepEqual(balancesByPerson(s).map(b=>[b.person,b.amount]),[['Meera',-40000],['Aarav',10000]]);
});
test('Shared bills net names and partial repayments independently of spending',()=>{
  const s=createState(false); const date=today();const e:Expense={id:'x',date,title:'Dinner',category:'e0',total:100001,mine:50001,person:'  Sam ',payer:'them',note:''};s.expenses=[e];
  s.balances=[{id:'b',date,person:'sam',amount:-30001,note:'Partial repayment',kind:'settlement'}];
  assert.equal(balancesByPerson(s)[0].amount,20000);assert.equal(s.expenses[0].mine,50001);
  e.payer='me'; assert.equal(balancesByPerson(s)[0].amount,-80001);
});
test('Habit completion denominator honors schedules and creation date',()=>{
  const s=createState(false),date='2026-09-28';s.habits=[{id:'h',name:'Run',category:'c3',essential:false,days:[1],created:date,archived:false}];s.checks[date]=['h'];
  assert.equal(due(s.habits[0],shiftDate(date,-7)),false);assert.equal(due(s.habits[0],shiftDate(date,1)),false);assert.deepEqual(progress(s,date,shiftDate(date,6)),{done:1,total:1,percent:100});
  s.habits[0].essential=true;assert.equal(progress(s,date,shiftDate(date,6)).total,7);
});
test('Invalid shares, unknown checks and duplicate IDs cannot be stored',()=>{
  const s=createState();s.expenses[0].mine=s.expenses[0].total+1;assert.equal(stateSchema.safeParse(s).success,false);
  const t=createState();t.checks[today()]=['missing'];assert.equal(stateSchema.safeParse(t).success,false);
  const u=createState();u.categories.push(u.categories[0]);assert.equal(stateSchema.safeParse(u).success,false);
});
