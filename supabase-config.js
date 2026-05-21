import { createClient } from '@supabase/supabase-js';

const RL = 'https://cnwnrqzfklmxtitoykzk.supabase.co';
const EY = 'sb_publishable__uggKxdEF4Kcy8sM2Z1EuA_IfsIArq-';

export const supabase = createClient(RL, EY);