const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfebmchdyrqurbnxkpek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZWJtY2hkeXJxdXJibnhrcGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNTczMjMsImV4cCI6MjAzMzkzMzMyM30.jRwjBiC2WMQM071msyNHDRgU0E3-EjWutlpo4uqefHs';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
