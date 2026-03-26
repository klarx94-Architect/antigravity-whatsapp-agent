import { createClient } from '@supabase/supabase-js';

// CREDENCIALES DE PRODUCCIÓN (v4.4.0)
const supabaseUrl = 'https://kfxzwrjahqdexakwozja.supabase.co';
const supabaseKey = 'sb_publishable_raQTCnCzW19NSOgyX10Byg_H2TUYZGB';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
        api_key_hash: rawKey,
        is_active: true
    }])
    .select();

  if (error) {
    console.error('Error generating api key:', error);
    return null;
  }
  
  await supabase
    .from('agents')
    .update({ api_key_id: data[0].id })
    .eq('id', agentId);

  return rawKey;
}
