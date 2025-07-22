import { config } from 'dotenv';
config();

import '@/ai/flows/generate-improvement-suggestions.ts';
import '@/ai/flows/match-job-description.ts';
import '@/ai/flows/analyze-resume.ts';
import '@/ai/flows/bulk-analyze-resumes.ts';
