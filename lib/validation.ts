import { z } from 'zod';
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v);
const label = z.string().trim().min(1).max(100);
const identifier = z.string().min(1).max(100);
const amount = z.number().int().min(0).max(100_000_000_00);
const category = z.object({ id: identifier, name: label, color:z.string().regex(/^#[0-9a-fA-F]{6}$/) });
export const stateSchema = z.object({
  sample:z.boolean(), term:z.object({name:label,start:date,end:date}).refine(t=>t.end>=t.start && Date.parse(t.end)-Date.parse(t.start)<=3660*86400000),
  categories:z.array(category).min(1).max(100),
  habits:z.array(z.object({id:identifier,name:label,category:identifier,essential:z.boolean(),days:z.array(z.number().int().min(0).max(6)).min(1).max(7),created:date,archived:z.boolean()})).max(1000),
  checks:z.record(date,z.array(identifier).max(1000)), expenseCategories:z.array(category).min(1).max(100),
  expenses:z.array(z.object({id:identifier,date,title:label,category:identifier,total:amount,mine:amount,person:z.string().trim().max(100),payer:z.enum(['me','them']),note:z.string().max(1000)}).refine(e=>e.mine<=e.total && e.total>0 && (e.person.length>0 || e.mine===e.total))).max(5000),
  balances:z.array(z.object({id:identifier,date,person:label,amount:z.number().int().min(-100_000_000_00).max(100_000_000_00),note:z.string().max(1000),kind:z.enum(['balance','settlement'])})).max(5000),
}).superRefine((s,ctx)=>{
  const unique = (ids:string[]) => new Set(ids).size===ids.length;
  for(const rows of [s.categories,s.habits,s.expenseCategories,s.expenses,s.balances]) if(!unique(rows.map(r=>r.id)))ctx.addIssue({code:'custom',message:'Duplicate record IDs'});
  if(s.habits.some(h=>!s.categories.some(c=>c.id===h.category)) || s.expenses.some(e=>!s.expenseCategories.some(c=>c.id===e.category)))ctx.addIssue({code:'custom',message:'Unknown category'});
  if(Object.values(s.checks).some(ids=>!unique(ids)||ids.some(id=>!s.habits.some(h=>h.id===id))))ctx.addIssue({code:'custom',message:'Unknown habit check'});
});
