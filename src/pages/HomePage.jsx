import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import { FaLaptopCode, FaBrain, FaCompass, FaBullhorn, FaUsers, FaChartLine } from 'react-icons/fa';
import { FAQItem } from '../components/FAQItem';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Feature = ({ icon, title, children }) => (
  <div className="text-center p-6 bg-gray-800 rounded-lg transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
    <div className="text-blue-500 mb-4 inline-block">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);

const HowItWorksStep = ({ number, title, children }) => (
  <div className="flex items-start text-right">
    <div className="flex items-center justify-center text-2xl font-bold text-blue-500 border-2 border-blue-500 rounded-full w-12 h-12 ml-6 flex-shrink-0">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{children}</p>
    </div>
  </div>
);

const Testimonial = ({ author, role, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg text-right transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
    <p className="text-gray-300 italic">"{children}"</p>
    <div className="mt-4">
      <p className="font-bold text-white">{author}</p>
      <p className="text-sm text-gray-400">{role}</p>
    </div>
  </div>
);

const ShowcaseCard = ({ icon, title, path }) => (
    <Link to={path} className="block group">
        <div className="text-center p-8 bg-gray-800 rounded-lg transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:bg-gray-700 h-full flex flex-col justify-center items-center">
            <div className="text-blue-500 mb-4 inline-block transition-transform duration-300 group-hover:scale-110">{icon}</div>
            <h3 className="text-2xl font-bold">{title}</h3>
        </div>
    </Link>
);

const StatItem = ({ finalValue, label }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = finalValue;
      if (start === end) return;

      const duration = 2000;
      const incrementTime = (duration / end);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isVisible, finalValue]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-extrabold text-blue-500">
        {count}+
      </p>
      <p className="text-lg text-gray-400 mt-2">{label}</p>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="bg-gray-900 text-white">
      <Header />

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center text-center animated-gradient">
        <div className="px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
            جرب مسارك المهني المستقبلي.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            يقدم جلينت محاكاة واقعية لمساعدتك في استكشاف المهن والعثور على ما يناسبك. اتخذ قرارات واثقة بشأن مسارك الأكاديمي والمهني.
          </p>
          <Link
            to="/signup"
            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 inline-block"
          >
            ابدأ مجانًا
          </Link>
        </div>
      </main>

      {/* Simulations Showcase Section */}
      <AnimatedSection id="simulations" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold">استكشف محاكياتنا</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">انغمس في مهام واقعية من بعض المهن الأكثر طلبًا اليوم.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ShowcaseCard
              icon={<FaLaptopCode size={56} />}
              title="مهندس برمجيات"
              path="/simulations/software-engineer"
            />
            <ShowcaseCard
              icon={<FaBullhorn size={56} />}
              title="مسوق رقمي"
              path="/simulations/digital-marketer"
            />
            <ShowcaseCard
              icon={<FaUsers size={56} />}
              title="مدير موارد بشرية"
              path="/simulations/hr"
            />
             <ShowcaseCard
              icon={<FaChartLine size={56} />}
              title="محلل مالي"
              path="/simulations/finance-analyst"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold">لماذا تختار جلينت؟</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">اكتشف طريقة جديدة لتصور مستقبلك.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Feature title="محاكاة واقعية" icon={<FaLaptopCode size={48} />}>
              جرب المهام اليومية لمختلف المهن من خلال سيناريوهات تفاعلية وواقعية.
            </Feature>
            <Feature title="إرشاد مدعوم بالذكاء الاصطناعي" icon={<FaBrain size={48} />}>
              احصل على اقتراحات ورؤى مخصصة من مساعدنا الذكي "Ayed" للعثور على المسارات التي تتوافق مع ملفك الشخصي.
            </Feature>
            <Feature title="استكشف مهن متنوعة" icon={<FaCompass size={48} />}>
              من التكنولوجيا إلى الرعاية الصحية، استكشف مكتبة متنامية باستمرار من التخصصات والأدوار الوظيفية.
            </Feature>
          </div>
        </div>
      </AnimatedSection>

      {/* Dynamic Stats Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <StatItem finalValue={4} label="مسارات مهنية" />
            <StatItem finalValue={15} label="مهمة تفاعلية" />
            <StatItem finalValue={1000} label="طالب تم توجيهه" />
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold">ابدأ في 3 خطوات سهلة</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-12">
            <HowItWorksStep number="1" title="اختر مسارًا مهنيًا">
              تصفح مكتبتنا للمجالات واختر مسمى وظيفي يثير اهتمامك.
            </HowItWorksStep>
            <HowItWorksStep number="2" title="محاكاة المهام الحقيقية">
              انغمس في المهام والتحديات التفاعلية التي تعكس العمل الحقيقي للمهنيين.
            </HowItWorksStep>
            <HowItWorksStep number="3" title="احصل على رؤى قيمة">
              أكمل عمليات المحاكاة لفهم نقاط قوتك واكتشاف المهن التي تثير شغفك.
            </HowItWorksStep>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold">يثق بنا الطلاب والمؤسسات</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial author="أحمد العلي" role="طالب ثانوي">
              جلينت غير طريقة تفكيري في مستقبلي. المحاكاة أعطتني الثقة لاختيار تخصصي الجامعي.
            </Testimonial>
            <Testimonial author="فاطمة الزهراني" role="طالبة جامعية">
              كنت مترددة بشأن مساري المهني، لكن تجربة مهام وظيفة حقيقية على جلينت كانت كاشفة ومفيدة جدًا.
            </Testimonial>
            <Testimonial author="جامعة الملك سعود" role="شريك تعليمي">
              نحن نستخدم جلينت لتزويد طلابنا بأدوات إرشاد مهني مبتكرة. النتائج كانت رائعة.
            </Testimonial>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold">أسئلة شائعة</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQItem question="ما هو جلينت؟">
              جلينت هي منصة محاكاة مهنية تساعد الطلاب على استكشاف مختلف المهن والتخصصات الأكاديمية من خلال تجارب تفاعلية وواقعية، مما يساعدهم على اتخاذ قرارات مهنية مستنيرة.
            </FAQItem>
            <FAQItem question="هل المنصة مجانية؟">
              نعم، نحن نقدم خطة مجانية تتيح لك الوصول إلى مجموعة من عمليات المحاكاة والميزات الأساسية. كما نقدم خططًا مميزة باشتراك للوصول إلى محتوى أوسع وميزات متقدمة.
            </FAQItem>
            <FAQItem question="لمن تستهدف هذه المنصة؟">
              تستهدف المنصة بشكل أساسي طلاب المدارس الثانوية والجامعات الذين هم في مرحلة اتخاذ قرارات بشأن مستقبلهم الأكاديمي والمهني. كما أنها مفيدة للمؤسسات التعليمية.
            </FAQItem>
            <FAQItem question="كيف تعمل المحاكاة؟">
              تقوم كل عملية محاكاة بتوجيهك عبر سلسلة من المهام والسيناريوهات الواقعية التي تعكس المسؤوليات اليومية للمهنة. ستحل المشكلات وتتخذ القرارات وتستخدم الأدوات الافتراضية تمامًا كما يفعل المحترفون.
            </FAQItem>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4">هل أنت مستعد لاكتشاف مستقبلك؟</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            سجل اليوم واتخذ الخطوة الأولى نحو مهنة ستحبها. البدء مجاني.
          </p>
          <Link
            to="/signup"
            className="bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 inline-block"
          >
            ابدأ رحلتك الآن
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
} 