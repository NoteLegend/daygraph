import Daygraph from '../components/Daygraph';
import { getChatGPTUser } from './chatgpt-auth';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const user=await getChatGPTUser();
  return <Daygraph name={user?.fullName?.split(' ')[0] || 'You'} />;
}
