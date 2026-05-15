import { createClient } from '@supabase/supabase-js';
async function test() {
  try {
    const response = await fetch('https://njfhggpzfcvxdmykjrvv.supabase.co/functions/v1/career-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZmhnZ3B6ZmN2eGRteWtqcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxODk4MDUsImV4cCI6MjA5MDc2NTgwNX0.zejwQANvq7iv86G9Q_FqgGXyYuJi4Bxe4FVkg82u2eo'
      },
      body: JSON.stringify({ type: 'quiz', stage: 'after_10th', history: [] })
    });
    console.log('Status:', response.status);
    console.log('Body:', await response.text());
  } catch(e) {
    console.log(e);
  }
}
test();
