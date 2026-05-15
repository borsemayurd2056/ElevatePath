import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://njfhggpzfcvxdmykjrvv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZmhnZ3B6ZmN2eGRteWtqcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxODk4MDUsImV4cCI6MjA5MDc2NTgwNX0.zejwQANvq7iv86G9Q_FqgGXyYuJi4Bxe4FVkg82u2eo');

async function test() {
  const { data, error } = await supabase.functions.invoke('career-ai', {
    body: { type: 'quiz', stage: 'after_10th', history: [
      { question: 'Q1?', answer: 'A1' },
      { question: 'Q2?', answer: 'A2' },
      { question: 'Q3?', answer: 'A3' },
      { question: 'Q4?', answer: 'A4' },
      { question: 'Q5?', answer: 'A5' }
    ] }
  });
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
