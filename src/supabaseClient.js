
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://gonkyvaufgbxaatibplw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvbmt5dmF1ZmdieGFhdGlicGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDA0NzAsImV4cCI6MjA4MzAxNjQ3MH0.7pLyD_yNnVTiBAISR-oTR-grdHbcIqk_jaSveDS6gxw'

export const supabase = createClient(supabaseUrl, supabaseKey)
