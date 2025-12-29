import { serve } from "std/http/server.ts"
import { createClient } from 'supabase-js'
// Import the WASM-based Python runtime

// Define the shape of the incoming request body
interface RequestBody {
  taskId: number;
  answer: any;
}

// Define the shape of the task's solution data
type Solution = {
  validation_type: 'exact_match';
  expected_value: any;
  explanation?: string;
} | {
  validation_type: 'keyword_match';
  value: string[];
} | {
  validation_type: 'execute_javascript_and_match_output';
  test_cases: { input: string; expected_output: any }[];
} | {
  validation_type: 'chatbot_responses';
  test_cases: { input: string; expected_output: any }[];
} | {
    validation_type: 'checklist_and_keyword_match';
    checklist_solution: string[];
    keyword_solution: string[];
} | {
    validation_type: 'range_match';
    target_conversion_score_min: number;
    target_conversion_score_max: number;
} | {
    validation_type: 'completion';
};

// Utility to handle circular references in JSON
function safeStringify(obj: any, indent = 2) {
  let cache = new Set();
  const replacer = (_key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Circular reference found, discard key
        return "[Circular]";
      }
      // Store value in our collection
      cache.add(value);
    }
    return value;
  };
  const result = JSON.stringify(obj, replacer, indent);
  cache.clear(); // Clear cache for next use
  return result;
}

serve(async (req) => {
  // 1. Set up CORS headers to allow requests from the app
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 3. Parse the request body
    const { taskId, answer }: RequestBody = await req.json();
    if (!taskId || answer === undefined) {
      throw new Error("Task ID and user answer are required.");
    }
    
    // Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // 4. Fetch the task's definition from the database
    const { data: task, error } = await supabaseClient
      .from('tasks')
      .select('definition')
      .eq('id', taskId)
      .single();

    if (error) throw new Error(`Failed to fetch task. Supabase error: ${error.message}`);
    if (!task) throw new Error("Task not found in database.");
    if (!task.definition || !task.definition.solution) {
      throw new Error("Task definition is missing the 'solution' property.");
    }

    const solution: Solution = task.definition.solution;
    let isCorrect = false;
    let message = 'الإجابة ليست دقيقة تمامًا. حاول مرة أخرى!';
    
    // 5. Perform validation based on the type defined in the solution
    switch (solution.validation_type) {
      case 'exact_match': {
        const expected = solution.expected_value;
        if (typeof expected === 'string' && typeof answer === 'string') {
          // For code challenges, we need a more robust comparison
          if (task.definition.task_type === 'code_challenge') {
            const lang = task.definition.ui_schema.language;
            const commentRegex = lang === 'python' ? /#.*$/gm : /\/\/.*$/gm;
            
            const normalize = (str: string) => str
                .replace(commentRegex, '') // Remove comments
                .replace(/\s/g, '');      // Remove all whitespace and newlines

            isCorrect = normalize(expected) === normalize(answer);
          } else {
            // For simple text, a basic trim is sufficient
            isCorrect = expected.trim() === answer.trim();
          }
        } else {
          // For non-string types (like multiple choice), do a direct comparison
          isCorrect = expected === answer;
        }
        if (isCorrect && solution.explanation) {
            message = solution.explanation;
        }
        break;
      }
      
      case 'keyword_match': {
        if (typeof answer === 'string' && Array.isArray(solution.value)) {
          const userAnswer = answer.toLowerCase();
          isCorrect = solution.value.some(keyword => userAnswer.includes(keyword.toLowerCase()));
        }
        break;
      }

      case 'execute_javascript_and_match_output': {
        // This is a simplified JS execution for now.
        // A more robust solution would use a sandboxed environment.
        const { test_cases } = solution;
        let allTestsPassed = true;

        for (const test of test_cases) {
          // This is a simplistic way to test. It assumes the user code is a function definition.
          // We wrap it and call it. A real environment would be more complex.
          const userCode = answer;
          const fullCode = `${userCode}\nconsole.log(JSON.stringify(sumArray(${test.input})));`;
          
          const command = new Deno.Command("deno", {
            args: ["eval", fullCode],
          });
          const { stdout, stderr } = await command.output();
          
          if (stderr.length > 0) {
            console.error("JS Execution Error:", new TextDecoder().decode(stderr));
            allTestsPassed = false;
            break;
          }
          
          const result = new TextDecoder().decode(stdout).trim();
          if (JSON.parse(result) !== test.expected_output) {
            allTestsPassed = false;
            break;
          }
        }
        isCorrect = allTestsPassed;
        break;
      }

      case 'chatbot_responses': {
        const payload = answer as { rules: { input: string; output: string }[]; defaultReply: string };
        const { rules, defaultReply } = payload;
        const { test_cases } = solution;
        let allTestsPassed = true;

        for (const test of test_cases) {
            const matchingRule = rules.find(r => r.input.toLowerCase().trim() === test.input.toLowerCase().trim());
            
            // If a specific rule matches, use its output. Otherwise, use the student's default reply.
            // If the student's default reply is empty, fall back to the system default.
            const botResponse = matchingRule 
                ? matchingRule.output 
                : defaultReply || "عذراً، لم أفهم ذلك.";

            if (botResponse.trim() !== test.expected_output.trim()) {
                allTestsPassed = false;
                message = `فشل الاختبار: عند إدخال "${test.input}", كان متوقعاً "${test.expected_output}" لكن تم الحصول على "${botResponse}"`;
                break;
            }
        }
        isCorrect = allTestsPassed;
        break;
      }

      case 'checklist_and_keyword_match': {
        const payload = answer as { checklist: string[]; summary: string };
        const { checklist, summary } = payload;
        const { checklist_solution, keyword_solution } = solution;

        // 1. Validate the checklist
        const isChecklistCorrect = checklist_solution.every(item => checklist.includes(item)) &&
                                   checklist.length === checklist_solution.length;

        // 2. Validate the summary for keywords
        const summaryLower = summary.toLowerCase();
        const keywordsFound = keyword_solution.filter(kw => summaryLower.includes(kw.toLowerCase())).length;
        
        // Let's say at least 3 keywords must be present for the summary to be considered valid
        const isSummaryCorrect = keywordsFound >= 3;
        
        isCorrect = isChecklistCorrect && isSummaryCorrect;

        if (!isChecklistCorrect) {
          message = "الأسئلة التي اخترتها ليست دقيقة تمامًا. راجع المشكلة واختر الأسئلة الأكثر أهمية لطرحها.";
        } else if (!isSummaryCorrect) {
          message = "قائمة أسئلتك صحيحة، لكن ملخصك يفتقر إلى بعض الأفكار الرئيسية. تأكد من شرح المشكلة وما تحتاجه بوضوح.";
        }
        break;
      }

      case 'range_match': {
        const payload = answer as { conversionScore: number };
        const { conversionScore } = payload;
        const { target_conversion_score_min, target_conversion_score_max } = solution;
        
        isCorrect = conversionScore >= target_conversion_score_min && conversionScore <= target_conversion_score_max;
        
        if (isCorrect) {
          message = 'ممتاز! توزيع الميزانية يحقق توازناً مثالياً بين الوعي والتحويل.';
        } else if (conversionScore < target_conversion_score_min) {
          message = 'التوزيع يركز كثيراً على الوعي. حاول تخصيص المزيد للتحويل.';
        } else {
          message = 'التوزيع يركز كثيراً على التحويل. حاول تخصيص المزيد للوعي.';
        }
        break;
      }

      case 'completion': {
        // For completion-based tasks, any submission is considered correct
        isCorrect = true;
        message = 'تم إكمال المهمة بنجاح! أحسنت في إنجاز هذا التحدي الإبداعي.';
        break;
      }

      default:
        console.warn(`Unknown validation type`);
        break;
    }

    // If the answer is correct, record the completion in the database
    if (isCorrect) {
        const { error: insertError } = await supabaseClient
            .from('user_task_progress')
            .insert({ user_id: user.id, task_id: taskId });

        // If the record already exists, it's not an error.
        // The user might be re-submitting a correct answer.
        // PostgreSQL unique violation error code is '23505'.
        if (insertError && insertError.code !== '23505') {
            console.error('Failed to insert task progress:', insertError);
            throw new Error(`Failed to save task progress: ${insertError.message}`);
        }
        
        if (!message.includes('أحسنت')) {
            message = 'إجابة صحيحة! أحسنت.';
        }
    }

    const responseData = {
      is_correct: isCorrect,
      message: message,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error('!!! Critical error in validate-task function:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}); 