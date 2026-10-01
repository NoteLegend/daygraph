import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { createState } from '../../../lib/domain';
import { stateSchema } from '../../../lib/validation';
export const dynamic = 'force-dynamic';
const db = () => (env as unknown as { DB: D1Database }).DB;
const reply = (value:unknown,status=200) => Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET() {
  const user = await getChatGPTUser();
  if(!user) return reply({error:'Sign in to save your Daygraph.'},401);
  await db().prepare('INSERT OR IGNORE INTO journals (user_id,data,revision,updated_at) VALUES (?,?,0,?)').bind(user.userId,JSON.stringify(createState()),new Date().toISOString()).run();
  const row = await db().prepare('SELECT data,revision FROM journals WHERE user_id=?').bind(user.userId).first<{data:string;revision:number}>();
  return reply({state:JSON.parse(row!.data),revision:row!.revision});
}
export async function PUT(request:Request) {
  const user = await getChatGPTUser();
  if(!user) return reply({error:'Sign in to save your Daygraph.'},401);
  const origin = request.headers.get('origin');
  if(origin && origin !== new URL(request.url).origin) return reply({error:'Cross-origin write rejected.'},403);
  const raw=await request.text();
  if(raw.length>1_000_000) return reply({error:'Journal size limit reached.'},413);
  let body; try{body=JSON.parse(raw);}catch{return reply({error:'Invalid request.'},400);}
  const parsed=stateSchema.safeParse(body.state);
  if(!parsed.success || !Number.isSafeInteger(body.revision) || body.revision<0) return reply({error:'Invalid journal data.'},400);
  const result=await db().prepare('UPDATE journals SET data=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=?').bind(JSON.stringify(parsed.data),new Date().toISOString(),user.userId,body.revision).run();
  if(!result.meta.changes)return reply({error:'This journal changed in another tab. Reload to use the latest version.'},409);
  return reply({revision:body.revision+1});
}
