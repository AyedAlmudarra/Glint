-- بيانات أولية لتطبيق Glint
-- الإصدار 2.1.0 (تصحيح بيانات)
--
-- يوفر هذا السكربت البيانات الأولية اللازمة لتشغيل تطبيق Glint.
-- هذا الإصدار يصحح الأخطاء في تعيينات task_id و task_type.

-- الخطوة 1: مسح البيانات الحالية لمنع التكرار والتعارض
truncate table task_skills, user_task_progress, tasks, simulations, skills, achievements restart identity cascade;

-- الخطوة 2: ملء جدول 'skills'
insert into skills (name, description) values
('جافاسكريبت', 'لغة برمجة عالية المستوى تستخدم لبناء تطبيقات ويب تفاعلية.'),
('بايثون', 'لغة برمجة متعددة الاستخدامات تشتهر ببساطتها وقابليتها للقراءة.'),
('تصميم واجهات برمجة التطبيقات (API)', 'عملية تصميم وتطوير واجهات برمجة تطبيقات فعالة وآمنة.'),
('تحسين محركات البحث (SEO)', 'عملية تحسين ظهور موقع الويب في نتائج محركات البحث.'),
('إعلانات الدفع لكل نقرة (PPC)', 'نموذج إعلاني على الإنترنت يستخدم لجلب حركة المرور إلى مواقع الويب.'),
('التوظيف', 'العملية الشاملة لتحديد وجذب وفحص واختيار المرشحين المناسبين للوظائف.'),
('إجراء المقابلات', 'محادثة منظمة لتقييم مدى ملاءمة المرشح للوظيفة.'),
('النمذجة المالية', 'مهمة بناء تمثيل مجرد (نموذج) لوضع مالي في العالم الحقيقي.'),
('تقييم الاستثمار', 'العملية التحليلية لتحديد القيمة الحالية والمستقبلية لأصل أو شركة.');

-- الخطوة 3: ملء جدول 'achievements'
insert into achievements (code, title, description, icon_name) values
('FIRST_SIM_COMPLETE', 'أول محاكاة مكتملة', 'تهانينا على إكمال أول محاكاة مهنية كاملة لك!', 'FaAward'),
('TECH_WHIZ', 'خبير تقني', 'أكملت محاكاة مهندس البرمجيات بنجاح.', 'FaCode');

-- الخطوة 4: ملء جدول 'simulations'
insert into simulations (id, title, description, icon_name, path, enhanced_briefing)
OVERRIDING SYSTEM VALUE
values
(1, 'مهندس برمجيات', 'تعلم أساسيات تطوير البرمجيات من خلال بناء تطبيقات وتحديات واقعية.', 'FaLaptopCode', '/simulations/software-engineer', '{
  "identity_headline": "كن صانعًا للحلول",
  "what_you_create": [
    {"title": "بناء تطبيق التواصل الاجتماعي القادم", "icon": "FaUsers"},
    {"title": "تصميم واجهات للسيارات ذاتية القيادة", "icon": "FaCar"},
    {"title": "إنشاء المؤثرات البصرية لفيلم ضخم", "icon": "FaFilm"}
  ],
  "bridge_skills": [
    {"from": "حل الألغاز في ألعاب الفيديو", "to": "هو نفس المنطق الذي ستستخدمه لإصلاح الأخطاء في الكود."},
    {"from": "بناء هياكل معقدة في ألعاب البناء", "to": "يشبه تصميم بنية تطبيق برمجي قوي."}
  ],
  "persona": {
    "name": "عمر، مهندس برمجيات",
    "image_url": "/assets/guides/omar.png",
    "quote": "أكثر ما يثيرني هو تحويل فكرة بسيطة إلى منتج يستخدمه ويحبه الآلاف من الناس."
  },
  "day_in_the_life_timeline": [
    {"time": "٩:٠٠ ص", "activity": "مزامنة الفريق", "description": "اجتماع صباحي سريع مع فريقك لتحديد أهداف اليوم.", "icon": "FaCoffee"},
    {"time": "١٠:٠٠ ص", "activity": "عمل مركز", "description": "التركيز على مشكلة صعبة، مثل تصميم ميزة جديدة.", "icon": "FaLaptopCode"},
    {"time": "١:٠٠ م", "activity": "برمجة ثنائية", "description": "العمل مباشرة مع مهندس أقدم لحل خطأ برمجي معقد.", "icon": "FaUserFriends"},
    {"time": "٣:٠٠ م", "activity": "مراجعة التصميم", "description": "التعاون مع فريق التصميم لجعل التطبيق يبدو رائعًا.", "icon": "FaPalette"}
  ],
  "highs_lows": {
    "highs": ["إثارة حل لغز معقد ورؤية عملك ينبض بالحياة.", "القدرة على بناء أي شيء يمكنك تخيله."],
    "lows": ["قد يكون الأمر محبطًا عندما يكون الحل صعب المنال، لكن هذا يجعل النجاح أكثر حلاوة."]
  },
  "career_path_steps": ["مطور مبتدئ", "مطور متوسط المستوى", "مطور خبير", "قائد تقني"],
  "salary_range": "١٥٠٬٠٠٠ - ٢٥٠٬٠٠٠ ريال سعودي سنوياً"
}'),
(2, 'محلل مالي', 'اكتسب مهارات في التحليل المالي وتقييم الاستثمارات من خلال سيناريوهات عملية.', 'FaChartLine', '/simulations/finance-analyst', '{
  "identity_headline": "كن مهندس القرارات المالية",
  "what_you_create": [
    {"title": "تحديد الصفقة الاستثمارية الكبرى التالية للشركة", "icon": "FaHandshake"},
    {"title": "بناء النموذج المالي الذي يتنبأ بنجاح شركة ناشئة", "icon": "FaRocket"},
    {"title": "حماية ثروة الشركة من تقلبات السوق", "icon": "FaShieldAlt"}
  ],
  "bridge_skills": [
    {"from": "إدارة ميزانيتك الشخصية بصرامة", "to": "هي نفس المهارة التي تستخدمها لتحليل القوائم المالية للشركات."},
    {"from": "التخطيط الاستراتيجي في ألعاب الطاولة", "to": "يشبه تقييم المخاطر والمكافآت في الاستثمارات."}
  ],
  "persona": {
    "name": "سارة، محللة مالية",
    "image_url": "/assets/guides/sara.png",
    "quote": "أجد الرضا في تحويل البيانات المعقدة إلى رؤى واضحة تقود قرارات ذكية."
  },
  "day_in_the_life_timeline": [
    {"time": "٨:٣٠ ص", "activity": "تحليل أخبار السوق", "description": "مراجعة الأخبار المالية العالمية وتأثيرها على المحافظ الاستثمارية.", "icon": "FaNewspaper"},
    {"time": "١٠:٠٠ ص", "activity": "بناء النماذج", "description": "قضاء وقت في Excel لبناء وتحديث النماذج المالية للتنبؤ بأداء الشركات.", "icon": "FaFileExcel"},
    {"time": "٢:٠٠ م", "activity": "اجتماع استثماري", "description": "عرض تحليلاتك وتوصياتك على لجنة الاستثمار.", "icon": "FaUsers"},
    {"time": "٤:٠٠ م", "activity": "إعداد التقارير", "description": "كتابة تقرير مفصل عن توصية استثمارية جديدة.", "icon": "FaPencilAlt"}
  ],
  "highs_lows": {
    "highs": ["الشعور بالمسؤولية عند اتخاذ قرارات بملايين الريالات.", "متعة اكتشاف فرصة استثمارية لم يلاحظها الآخرون."],
    "lows": ["الضغط العالي للسوق، حيث يمكن أن تتغير الأوضاع بسرعة."]
  },
  "career_path_steps": ["محلل مالي مبتدئ", "محلل مالي خبير", "مدير استثمار", "مدير مالي (CFO)"],
  "salary_range": "١٤٠٬٠٠٠ - ٢٢٠٬٠٠٠ ريال سعودي سنوياً"
}'),
(3, 'مسؤول موارد بشرية', 'تعلم كيفية إدارة المواهب وحل النزاعات وبناء ثقافة شركة إيجابية.', 'FaUsers', '/simulations/hr-specialist', '{
  "identity_headline": "كن بانيًا لثقافة الشركات",
  "what_you_create": [
    {"title": "بناء فريق عمل متناغم ومنتج من الصفر", "icon": "FaUsersCog"},
    {"title": "تصميم برامج تدريبية تطلق العنان لإمكانيات الموظفين", "icon": "FaBrain"},
    {"title": "خلق بيئة عمل إيجابية يطمح الجميع للانتماء إليها", "icon": "FaSmileBeam"}
  ],
  "bridge_skills": [
    {"from": "حل النزاعات بين الأصدقاء", "to": "هي نفس مهارة الوساطة التي تستخدمها في علاقات الموظفين."},
    {"from": "التخطيط لفعالية أو مناسبة", "to": "يشبه تنظيم برامج تدريب وتطوير للموظفين."}
  ],
  "persona": {
    "name": "فهد، أخصائي موارد بشرية",
    "image_url": "/assets/guides/fahad.png",
    "quote": "لا شيء يضاهي رؤية موظف ينمو ويتطور بفضل بيئة العمل التي ساعدنا في بنائها."
  },
  "day_in_the_life_timeline": [
    {"time": "٩:٠٠ ص", "activity": "مراجعة السير الذاتية", "description": "البحث عن المرشحين الواعدين للوظائف الشاغرة.", "icon": "FaFileAlt"},
    {"time": "١١:٠٠ ص", "activity": "إجراء المقابلات", "description": "التعرف على المرشحين وتقييم مدى ملاءمتهم لثقافة الشركة.", "icon": "FaComments"},
    {"time": "٢:٠٠ م", "activity": "علاقات الموظفين", "description": "اجتماع مع موظف لمناقشة مساره الوظيفي أو حل مشكلة يواجهها.", "icon": "FaHandHoldingHeart"},
    {"time": "٤:٠٠ م", "activity": "تخطيط استراتيجي", "description": "العمل على سياسات جديدة لتحسين بيئة العمل والرضا الوظيفي.", "icon": "FaLightbulb"}
  ],
  "highs_lows": {
    "highs": ["المساهمة بشكل مباشر في نجاح الشركة من خلال بناء فريقها.", "مساعدة الناس على تحقيق أهدافهم المهنية."],
    "lows": ["اتخاذ قرارات صعبة قد تؤثر على حياة الموظفين.", "التعامل مع النزاعات الحساسة والمواقف الصعبة."]
  },
  "career_path_steps": ["أخصائي موارد بشرية", "شريك أعمال الموارد البشرية", "مدير الموارد البشرية", "رئيس قطاع الموارد البشرية"],
  "salary_range": "١٢٠٬٠٠٠ - ١٩٠٬٠٠٠ ريال سعودي سنوياً"
}'),
(4, 'مسوق رقمي', 'استكشف عالم التسويق الرقمي من خلال إدارة الحملات الإعلانية وتحليل البيانات.', 'FaBullhorn', '/simulations/digital-marketer', '{
  "identity_headline": "كن صوت العلامة التجارية",
  "what_you_create": [
    {"title": "إطلاق حملة إعلانية تصبح حديث الناس (ترند)", "icon": "FaChartLine"},
    {"title": "بناء مجتمع مخلص للعلامة التجارية على وسائل التواصل الاجتماعي", "icon": "FaThumbsUp"},
    {"title": "كتابة محتوى يجذب آلاف القراء ويحولهم إلى عملاء", "icon": "FaFeatherAlt"}
  ],
  "bridge_skills": [
    {"from": "معرفة ما هو رائج على تيك توك وانستغرام", "to": "هي نفس الحدس الذي تحتاجه لتحديد اتجاهات السوق."},
    {"from": "كتابة منشورات جذابة على حساباتك الشخصية", "to": "هي أساس كتابة المحتوى التسويقي الفعال."}
  ],
  "persona": {
    "name": "نورة، مسوقة رقمية",
    "image_url": "/assets/guides/noura.png",
    "quote": "أنا أحب فن وعلم الوصول إلى الجمهور المناسب بالرسالة المناسبة في الوقت المناسب."
  },
  "day_in_the_life_timeline": [
    {"time": "٩:٣٠ ص", "activity": "تحليل البيانات", "description": "مراجعة أداء الحملات الإعلانية من اليوم السابق وتحديد نقاط التحسين.", "icon": "FaChartPie"},
    {"time": "١١:٠٠ ص", "activity": "إنشاء المحتوى", "description": "كتابة منشورات جديدة لوسائل التواصل الاجتماعي أو مقال للمدونة.", "icon": "FaKeyboard"},
    {"time": "١:٣٠ م", "activity": "اجتماع إبداعي", "description": "اجتماع مع فريق التصميم لتبادل الأفكار حول حملة إعلانية جديدة.", "icon": "FaPaintBrush"},
    {"time": "٣:٣٠ م", "activity": "إدارة الحملات", "description": "إطلاق حملة إعلانية جديدة على جوجل أو فيسبوك ومراقبة أدائها الأولي.", "icon": "FaMousePointer"}
  ],
  "highs_lows": {
    "highs": ["الإبداع في إيجاد طرق جديدة للتواصل مع الجمهور.", "رؤية نتائج مباشرة لجهودك في شكل أرقام ومبيعات."],
    "lows": ["التغير السريع في الخوارزميات والاتجاهات الذي يتطلب تعلمًا مستمرًا.", "التعامل مع التعليقات السلبية أو الحملات غير الناجحة."]
  },
  "career_path_steps": ["منسق تسويق رقمي", "أخصائي تسويق رقمي", "مدير تسويق رقمي", "رئيس قسم التسويق"],
  "salary_range": "١٣٠٬٠٠٠ - ٢١٠٬٠٠٠ ريال سعودي سنوياً"
}');

-- الخطوة 5: ملء جدول 'tasks' بالبنية الجديدة
-- I have explicitly set the IDs to ensure the foreign keys in task_skills are correct.
insert into tasks (id, simulation_id, title, description, task_order, definition)
OVERRIDING SYSTEM VALUE
values
-- مهام "مهندس برمجيات" (simulation_id = 1)
(1, 1, 'إرجاع رسالة ترحيب', 'مهمتك هي إكمال دالة في بايثون لتقوم بإرجاع رسالة ترحيب.', 1, '{
    "task_type": "code_challenge",
    "ui_schema": {
        "language": "python",
        "problem_statement": "أكمل دالة `create_greeting_message` لتقوم بإرجاع السلسلة النصية `\"Welcome to Glint!\"`.",
        "existing_code": "def create_greeting_message():\n  # اكتب الكود الخاص بك هنا\n  return None",
        "solution_display": "def create_greeting_message():\n  return \"Welcome to Glint!\"",
        "learning_module": {
            "title": "إرجاع القيم من دوال بايثون",
            "content": "في بايثون، تُستخدم كلمة `return` لإرسال قيمة من دالة. يمكن أن تكون هذه القيمة أي نوع من البيانات، مثل رقم أو سلسلة نصية أو قاموس."
        },
        "steps": [
            { "title": "الخطوة ١: فهم المطلوب", "guidance": "المطلوب هو إرجاع سلسلة نصية، وليست أي بنية بيانات أخرى." },
            { "title": "الخطوة ٢: كتابة السلسلة النصية", "guidance": "تأكد من أن السلسلة النصية تطابق تمامًا `\"Welcome to Glint!\"`." },
            { "title": "الخطوة ٣: استخدام `return`", "guidance": "استخدم كلمة `return` لإرجاع السلسلة النصية." }
        ],
        "hints": [
            "يجب أن يكون الحل سطرًا واحدًا فقط.",
            "تأكد من استخدام علامتي الاقتباس `\"` حول السلسلة النصية."
        ]
    },
    "solution": {
        "validation_type": "exact_match",
        "expected_value": "def create_greeting_message():\n  return \"Welcome to Glint!\""
    }
}'),
(2, 1, 'إصلاح خطأ في حلقة تكرار', 'لديك دالة من المفترض أن تجمع أرقامًا في مصفوفة، لكنها لا تعمل بشكل صحيح. مهمتك هي تحديد الخطأ وإصلاحه.', 2, '{
    "task_type": "code_challenge",
    "ui_schema": {
        "language": "javascript",
        "problem_statement": "الدالة `sumArray` تستقبل مصفوفة من الأرقام ويجب أن تعيد مجموعها. الكود الحالي يعيد دائمًا 0. أصلح الخطأ.",
        "existing_code": "function sumArray(numbers) {\n  let sum = 0;\n  for (let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n  }\n  return 0; // The bug is here!\n}",
        "solution_display": "function sumArray(numbers) {\n  let sum = 0;\n  for (let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n  }\n  return sum;\n}"
    },
    "solution": {
        "validation_type": "execute_javascript_and_match_output",
        "test_cases": [
            { "input": "[1, 2, 3]", "expected_output": 6 },
            { "input": "[-1, 0, 1]", "expected_output": 0 }
        ]
    }
}'),
(5, 1, 'فهم تدفق تسجيل الدخول', 'مهمتك هي تتبع الخطوات التي تحدث عندما يقوم المستخدم بتسجيل الدخول إلى تطبيق.', 3, '{
    "task_type": "diagram_interpretation",
    "ui_schema": {
        "scenario": "أنت مهندس برمجيات وتعمل على ميزة تسجيل الدخول لتطبيق جديد. يوضح الرسم البياني تدفق عملية المصادقة.",
        "diagram": {
            "title": "تدفق مصادقة المستخدم",
            "nodes": [
                {"id": "user", "label": "هاتف المستخدم", "subtitle": "(العميل)", "x": 20, "y": 70},
                {"id": "server", "label": "خادم الشركة", "subtitle": "(الخادم)", "x": 220, "y": 70},
                {"id": "db", "label": "قاعدة البيانات", "subtitle": "(التخزين)", "x": 420, "y": 70}
            ],
            "edges": [
                {"from": "user", "to": "server"},
                {"from": "server", "to": "db"}
            ]
        },
        "steps": [
            "يبدأ المستخدم بإدخال بريده الإلكتروني وكلمة المرور.",
            "يرسل التطبيق هذه المعلومات عبر الإنترنت إلى خادم الشركة.",
            "يقارن الخادم المعلومات التي تلقاها بالمعلومات المخزنة في قاعدة البيانات الخاصة به."
        ],
        "question": "ما هو المكون الذي يتحقق فعليًا مما إذا كانت كلمة المرور صحيحة أم لا؟",
        "explanation": "صحيح! الخادم يتلقى الطلب، لكنه يحتاج إلى التحقق من مكان ما. الهاتف هو مجرد واجهة لإرسال المعلومات. أين يتم تخزين بيانات المستخدم بشكل دائم؟"
    },
    "solution": {
        "validation_type": "keyword_match",
        "value": ["الخادم", "server"]
    }
}'),
(6, 1, 'بناء بوت محادثة بسيط', 'مهمتك هي برمجة بوت محادثة بسيط يرد على تحيات المستخدم.', 4, '{
    "task_type": "chatbot_creation",
    "ui_schema": {
        "problem_statement": "مهمتك هي تعليم بوت المحادثة كيفية الرد على المستخدمين عن طريق إنشاء مجموعة من القواعد. لكل قاعدة، حدد ما يقوله المستخدم وما يجب أن يكون رد البوت.",
        "learning_module": {
            "title": "ما هو بوت المحادثة؟",
            "content": "بوت المحادثة هو برنامج يحاكي المحادثة البشرية. في جوهرها، تستخدم منطقًا شرطيًا (قواعد إذا/عندئذ) لتحديد كيفية الرد على مدخلات المستخدم."
        },
        "steps": [
            { "title": "التعامل مع ''مرحباً''", "guidance": "إذا كتب المستخدم ''مرحباً''، يجب أن يرد البوت بـ ''أهلاً بك!''" },
            { "title": "التعامل مع ''كيف حالك؟''", "guidance": "إذا سأل المستخدم ''كيف حالك؟''، يجب أن يرد البوت بـ ''أنا بوت، أنا بخير!''" },
            { "title": "التعامل مع ''وداعاً''", "guidance": "إذا قال المستخدم ''وداعاً''، يجب أن يرد البوت بـ ''إلى اللقاء!''" },
            { "title": "التعامل مع المدخلات غير المعروفة", "guidance": "إذا لم يتعرف البوت على المدخلات، يجب أن يرد برسالة افتراضية مثل ''عذراً، لم أفهم ذلك.''" }
        ],
        "hints": [
            "تأكد من تطابق الردود تمامًا مع ما هو مطلوب في الخطوات.",
            "يمكنك إضافة قاعدة للتعامل مع المدخلات التي لا تتعرف عليها."
        ]
    },
    "solution": {
        "validation_type": "chatbot_responses",
        "test_cases": [
            { "input": "مرحباً", "expected_output": "أهلاً بك!" },
            { "input": "كيف حالك؟", "expected_output": "أنا بوت، أنا بخير!" },
            { "input": "وداعاً", "expected_output": "إلى اللقاء!" },
            { "input": "ما اسمك؟", "expected_output": "عذراً، لم أفهم ذلك." }
        ]
    }
}'),
(7, 1, 'تحليل مشكلة مستخدم', 'حلل مشكلة أبلغ عنها مستخدم وحدد المعلومات اللازمة لحلها.', 5, '{
    "task_type": "problem_analysis",
    "ui_schema": {
        "problem_statement": "أنت مهندس برمجيات مبتدئ في شركة تقنية. أبلغ مدير دعم العملاء أن بعض المستخدمين يواجهون مشكلة في تطبيق الشركة.",
        "report_text": "يقول بعض المستخدمين إن زر ''إرسال'' لا يعمل أحيانًا في صفحة الاتصال.",
        "checklist_options": [
            "ما هي الخطوات الدقيقة التي اتخذها المستخدم قبل حدوث الخطأ؟",
            "هل يمكنك تقديم لقطة شاشة أو تسجيل فيديو للمشكلة؟",
            "ما هو نظام التشغيل وإصدار المتصفح الذي يستخدمه العميل؟",
            "هل كان العميل غاضبًا عند الإبلاغ عن المشكلة؟",
            "هل يمكننا فقط أن نطلب من المستخدم تحديث متصفحه؟",
            "ما هو معرف المستخدم أو البريد الإلكتروني للمستخدمين المتأثرين؟"
        ],
        "summary_prompt": "بناءً على الأسئلة التي اخترتها، اكتب ملخصًا للمشكلة وخطة عملك التالية."
    },
    "solution": {
        "validation_type": "checklist_and_keyword_match",
        "checklist_solution": [
            "ما هي الخطوات الدقيقة التي اتخذها المستخدم قبل حدوث الخطأ؟",
            "هل يمكنك تقديم لقطة شاشة أو تسجيل فيديو للمشكلة؟",
            "ما هو نظام التشغيل وإصدار المتصفح الذي يستخدمه العميل؟",
            "ما هو معرف المستخدم أو البريد الإلكتروني للمستخدمين المتأثرين؟"
        ],
        "keyword_solution": ["خطوات", "فيديو", "لقطة", "نظام التشغيل", "متصفح", "مستخدم", "تحديد"]
    }
}'),

-- مهام "مسوق رقمي" (simulation_id = 4)
(3, 4, 'اختيار الجمهور المستهدف', 'اختر الجمهور الأنسب لحملة إعلانية بناءً على المنتج.', 1,
'{
  "task_type": "multiple_choice",
  "ui_schema": {
    "scenario": "أنت تطلق حملة إعلانية لسماعات رأس لاسلكية فاخرة تتميز بجودة صوت عالية وتصميم أنيق.",
    "question": "من هو الجمهور الأكثر ملاءمة لهذه الحملة الإعلانية لتحقيق أفضل عائد على الاستثمار؟",
    "options": [
      "الطلاب الباحثون عن صفقات",
      "المهنيون الشباب وعشاق التكنولوجيا",
      "كبار السن المتقاعدون",
      "الرياضيون المحترفون"
    ]
  },
  "solution": {
    "validation_type": "exact_match",
    "expected_value": "المهنيون الشباب وعشاق التكنولوجيا",
    "explanation": "المهنيون الشباب هم الفئة الأكثر احتمالاً لتقدير الجودة العالية والاستعداد لدفع سعر أعلى مقابل منتج فاخر، مما يجعلهم الجمهور المثالي."
  }
}');

-- الخطوة 6: ملء جدول 'task_skills'
insert into task_skills (task_id, skill_id) values
-- Software Engineer Skills
(1, 2), -- Task 1 (Python) -> Python
(1, 3), -- Task 1 -> API Design
(2, 1), -- Task 2 (JS) -> JavaScript
(5, 3), -- Task 5 -> API Design
(6, 1), -- Task 6 (Chatbot) -> JavaScript

-- Digital Marketer Skills
(3, 5); -- Task 3 -> PPC Advertising

-- نهاية سكربت البيانات الأولية