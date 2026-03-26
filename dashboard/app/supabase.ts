import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAgents() {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
  return data;
}

export async function saveAgent(agentData: any) {
  const { data, error } = await supabase
    .from('agents')
    .insert([agentData])
    .select();
    
  if (error) {
    console.error('Error saving agent:', error);
    return null;
  }
  return data[0];
}

export async function generateApiKey(agentId: string) {
  const rawKey = `arch_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from('credentials')
    .insert([{
        key_name: `Key for Agent ${agentId}`,
        api_key_hash: rawKey, // En producción real deberíamos hashear esto con SHA-256
        is_active: true
    }])
    .select();

  if (error) {
    console.error('Error generating api key:', error);
    return null;
  }
  
  // Actualizar el agente con el ID de la credencial
  await supabase
    .from('agents')
    .update({ api_key_id: data[0].id })
    .eq('id', agentId);

  return rawKey;
}
