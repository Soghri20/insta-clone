import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient('https://qeenygvwbqrzpwiatkxj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZW55Z3Z3YnFyenB3aWF0a3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzk4MDIsImV4cCI6MjA1Njk1NTgwMn0.rCQz_MOIl-bmjz3KxVEhPgHShwWyMgw_GVVBeYCxwzs');

