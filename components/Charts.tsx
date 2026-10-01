'use client';
import { useContext } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { QuietMotion, NumberValue } from './Ui';
export type ChartDatum = { name:string;value:number;color?:string };
const tooltip={background:'#232A26',border:'1px solid #3C4840',borderRadius:12,color:'#ECEFE9',fontSize:14};
export function Donut({data,value,label,percent=false}:{data:ChartDatum[];value:number;label:string;percent?:boolean}) {
  const quiet=useContext(QuietMotion);
  const usable=data.filter(d=>d.value>0);
  return <div className="donut-wrap" role="img" aria-label={`${label}: ${value}${percent?' percent':''}. ${data.map(d=>`${d.name}: ${d.value}`).join(', ')}`}><ResponsiveContainer width="100%" height={244}><PieChart><Pie data={usable.length?usable:[{name:'No data',value:1,color:'#303735'}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={91} outerRadius={110} paddingAngle={usable.length>1?3:0} stroke="none" cornerRadius={5} animationDuration={1100} isAnimationActive={!quiet}>{(usable.length?usable:[{color:'#303735'}]).map((d,i)=><Cell key={i} fill={d.color||'#B8D5BE'}/>)}</Pie><Tooltip contentStyle={tooltip} itemStyle={{color:'#ECEFE9'}}/></PieChart></ResponsiveContainer><div className="donut-center"><NumberValue value={value} suffix={percent?'%':''}/><span>{label}</span></div></div>;
}
export function RadarView({data,percent=true}:{data:ChartDatum[];percent?:boolean}) {
  const quiet=useContext(QuietMotion);
  if(data.length<3)return <div className="empty-chart">Add at least three categories to see the radar.</div>;
  return <div className="radar-wrap" role="img" aria-label={data.map(d=>`${d.name}: ${d.value}${percent?'%':''}`).join(', ')}><ResponsiveContainer width="100%" height={270}><RadarChart data={data} outerRadius="56%"><PolarGrid stroke="#3A433D"/><PolarAngleAxis dataKey="name" tick={{fill:'#ADB8AF',fontSize:12}} tickFormatter={v=>String(v).length>16?String(v).slice(0,14)+'…':String(v)}/><PolarRadiusAxis angle={90} domain={[0,percent?100:Math.max(1,...data.map(d=>d.value))]} tick={false} axisLine={false}/><Radar dataKey="value" name={percent?'Completion (%)':'Spending (₹)'} stroke="#B8D5BE" strokeWidth={2} fill="#B8D5BE" fillOpacity={0.14} animationDuration={1200} isAnimationActive={!quiet}/><Tooltip contentStyle={tooltip}/></RadarChart></ResponsiveContainer></div>;
}
export function Trend({data,money=false}:{data:{name:string;value:number}[];money?:boolean}) {
  const quiet=useContext(QuietMotion);
  return <div className="trend-wrap" role="img" aria-label={money?'Spending by day in rupees':'Daily habit completion percentages'}><ResponsiveContainer width="100%" height={165}><AreaChart data={data} margin={{top:14,right:12,left:-26,bottom:0}}><defs><linearGradient id={money?'expense-area':'habit-area'} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B8D5BE" stopOpacity={0.25}/><stop offset="100%" stopColor="#B8D5BE" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#2B3430" vertical={false} strokeDasharray="4 6"/><XAxis dataKey="name" tick={{fill:'#96A398',fontSize:12}} axisLine={false} tickLine={false} minTickGap={40}/><YAxis domain={money?[0,'auto']:[0,100]} tick={{fill:'#96A398',fontSize:12}} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltip} formatter={(v)=>[`${money?'₹':''}${v}${money?'':'%'}`,money?'Spending':'Completion']}/><Area type="monotone" dataKey="value" stroke="#B8D5BE" strokeWidth={2} fill={`url(#${money?'expense-area':'habit-area'})`} isAnimationActive={!quiet}/></AreaChart></ResponsiveContainer></div>;
}
