import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import { FaLaptopCode, FaBrain, FaCompass, FaBullhorn, FaUsers, FaChartLine, FaPlay, FaArrowLeft, FaStar, FaRocket, FaLightbulb, FaGraduationCap, FaRobot, FaCheckCircle } from 'react-icons/fa';
import { FAQItem } from '../components/FAQItem';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

// Career card colors configuration
const careerConfig = {
  software: {
    gradient: 'from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    hoverGlow: 'group-hover:shadow-blue-500/20',
  },
  marketing: {
    gradient: 'from-amber-500/20 to-amber-600/20',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    hoverGlow: 'group-hover:shadow-amber-500/20',
  },
  hr: {
    gradient: 'from-purple-500/20 to-purple-600/20',
    border: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    hoverGlow: 'group-hover:shadow-purple-500/20',
  },
  finance: {
    gradient: 'from-emerald-500/20 to-emerald-600/20',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    hoverGlow: 'group-hover:shadow-emerald-500/20',
  },
};

const Feature = ({ icon, title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-8 rounded-2xl bg-gradient-to-b from-[var(--color-surface-1)] to-[var(--color-bg-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/10"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
    <div className="relative">
      <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <span className="text-[var(--color-primary)]">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  </motion.div>
);

const HowItWorksStep = ({ number, title, children, delay = 0, isLast = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start"
  >
    <div className="flex flex-col items-center ml-6">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl w-12 h-12 shadow-lg shadow-[var(--color-primary)]/30"
      >
        {number}
      </motion.div>
      {!isLast && (
        <div className="w-0.5 h-16 bg-gradient-to-b from-[var(--color-primary)]/50 to-transparent mt-4" />
      )}
    </div>
    <div className="flex-1 pb-8">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  </motion.div>
);

const Testimonial = ({ author, role, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group p-6 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)]/30 transition-all duration-300"
  >
    <div className="flex items-center gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={`star-${n}`} className="w-4 h-4 text-amber-400" />
      ))}
    </div>
    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6 italic">"{children}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white font-bold">
        {author.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-[var(--color-text-primary)]">{author}</p>
        <p className="text-sm text-[var(--color-text-muted)]">{role}</p>
      </div>
    </div>
  </motion.div>
);

const ShowcaseCard = ({ icon, title, path, career, description, skills = [] }) => {
  const config = careerConfig[career] || careerConfig.software;
  
  return (
    <Link to={path} className="block group">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={`
          relative p-8 rounded-2xl 
          bg-gradient-to-br ${config.gradient}
          border ${config.border}
          transition-all duration-300
          hover:shadow-xl ${config.hoverGlow}
          overflow-hidden
        `}
      >
        {/* Decorative background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        </div>
        
        <div className="relative">
          <div className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <span className={config.iconColor}>{icon}</span>
          </div>
          
          <h3 className="text-2xl font-bold mb-2 text-[var(--color-text-primary)]">{title}</h3>
          
          {description && (
            <p className="text-[var(--color-text-secondary)] text-sm mb-4">{description}</p>
          )}
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-white/10 text-[var(--color-text-secondary)]">
                  {skill}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-medium group-hover:gap-3 transition-all duration-300">
            <span>استكشف المحاكاة</span>
            <FaArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const StatItem = ({ finalValue, label, icon, suffix = '+' }) => {
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center p-8 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-default)]"
    >
      <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <p className="text-5xl font-extrabold bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
        {count}{suffix}
      </p>
      <p className="text-[var(--color-text-secondary)] mt-2">{label}</p>
    </motion.div>
  );
};

// Floating icons for hero background
const FloatingIcon = ({ icon, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.1, y: [0, -20, 0] }}
    transition={{ 
      opacity: { delay, duration: 1 },
      y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    className={`absolute text-[var(--color-primary)] ${className}`}
  >
    {icon}
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Header />

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
        {/* Animated background */}
        <div className="absolute inset-0 mesh-gradient" />
        
        {/* Floating career icons - Hidden on mobile */}
        <div className="hidden md:block">
          <FloatingIcon icon={<FaLaptopCode size={48} />} className="top-1/4 right-1/4" delay={0} />
          <FloatingIcon icon={<FaBullhorn size={40} />} className="top-1/3 left-1/4" delay={0.5} />
          <FloatingIcon icon={<FaChartLine size={44} />} className="bottom-1/3 right-1/3" delay={1} />
          <FloatingIcon icon={<FaUsers size={36} />} className="bottom-1/4 left-1/3" delay={1.5} />
        </div>
        
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
        
        <div className="relative py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="primary" className="mb-4 sm:mb-6">
              <FaRocket className="w-3 h-3" />
              منصة استكشاف المهن الأولى عربياً
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-4 sm:mb-6"
          >
            <span className="block">جرّب مسارك المهني</span>
            <span className="block bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-light)] bg-clip-text text-transparent">
              قبل أن تختاره
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            محاكاة تفاعلية واقعية تساعدك على استكشاف المهن المختلفة واكتشاف شغفك الحقيقي.
            اتخذ قرارات مستنيرة بشأن مستقبلك الأكاديمي والمهني.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="lg"
              isPill
              icon={<FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
              iconPosition="end"
              className="w-full sm:w-auto"
            >
              ابدأ مجانًا
            </Button>
            
            <Button
              as={Link}
              to="#simulations"
              variant="secondary"
              size="lg"
              isPill
              icon={<FaPlay className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              شاهد كيف تعمل
            </Button>
          </motion.div>
          
          {/* Trust indicators - Responsive layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[var(--color-text-muted)] text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>+1000 طالب</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
            <div className="flex items-center gap-2">
              <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span>4.9 تقييم</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
            <div className="flex items-center gap-2">
              <FaLightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>4 مسارات مهنية</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simulations Showcase Section */}
      <AnimatedSection id="simulations" className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-primary)]/5 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="primary" className="mb-4">المحاكاة التفاعلية</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">استكشف المسارات المهنية</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-base sm:text-lg">
              انغمس في مهام واقعية من أكثر المهن طلباً في سوق العمل
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ShowcaseCard
              icon={<FaLaptopCode size={32} />}
              title="مهندس برمجيات"
              path="/signup"
              career="software"
              description="تعلم البرمجة وحل المشكلات التقنية"
              skills={['Python', 'حل المشكلات', 'التفكير المنطقي']}
            />
            <ShowcaseCard
              icon={<FaBullhorn size={32} />}
              title="مسوق رقمي"
              path="/signup"
              career="marketing"
              description="أنشئ حملات تسويقية مؤثرة"
              skills={['التسويق', 'التحليل', 'الإبداع']}
            />
            <ShowcaseCard
              icon={<FaUsers size={32} />}
              title="مدير موارد بشرية"
              path="/signup"
              career="hr"
              description="اكتشف فن إدارة الكفاءات البشرية"
              skills={['التواصل', 'القيادة', 'التنظيم']}
            />
            <ShowcaseCard
              icon={<FaChartLine size={32} />}
              title="محلل مالي"
              path="/signup"
              career="finance"
              description="حلل البيانات واتخذ قرارات مالية"
              skills={['التحليل المالي', 'Excel', 'التقارير']}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Quick Taste Section - Try Before Signup */}
      <AnimatedSection className="py-16 sm:py-24 bg-[var(--color-surface-1)]/50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="relative overflow-hidden bg-gradient-to-l from-blue-500/10 to-emerald-500/10 border-blue-500/20">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
              
              <div className="relative text-center">
                <Badge variant="success" className="mb-4">
                  <FaPlay className="w-3 h-3" />
                  تذوق التجربة
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">
                  جرب مهمة حقيقية الآن
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                  قبل التسجيل، جرب مهمة قصيرة من محاكاة مهندس البرمجيات. 
                  اكتشف كيف يبدو العمل الحقيقي!
                </p>
                
                {/* Mini Task Preview */}
                <div className="bg-[var(--color-bg-primary)] rounded-xl p-4 sm:p-6 text-right mb-6 border border-[var(--color-border-default)]">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--color-text-primary)] mb-1">تحدي: أصلح الخطأ البرمجي</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        لديك كود بسيط يحتوي على خطأ. هل يمكنك اكتشافه؟
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FaLaptopCode className="text-blue-400 text-xl" />
                    </div>
                  </div>
                  
                  <div className="bg-[var(--color-surface-2)] rounded-lg p-4 font-mono text-sm text-[var(--color-text-secondary)] text-left mb-4 overflow-x-auto">
                    <code>
                      <span className="text-purple-400">def</span> <span className="text-blue-400">greet</span>(name):<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-emerald-400">"مرحبًا، "</span> + <span className="text-red-400">Name</span>
                    </code>
                  </div>
                  
                  <p className="text-xs text-[var(--color-text-muted)] mb-4">
                    تلميح: انتبه لحالة الأحرف في المتغيرات!
                  </p>
                </div>
                
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  size="lg"
                  icon={<FaArrowLeft />}
                  iconPosition="end"
                >
                  سجل لتجربة المزيد
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="info" className="mb-4">لماذا جلينت؟</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">تجربة تعليمية فريدة</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-base sm:text-lg">
              اكتشف طريقة جديدة ومبتكرة لتصور مستقبلك المهني
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Feature title="محاكاة واقعية" icon={<FaLaptopCode size={28} />} delay={0}>
              جرب المهام اليومية لمختلف المهن من خلال سيناريوهات تفاعلية وواقعية مصممة بعناية.
            </Feature>
            <Feature title="إرشاد ذكي" icon={<FaBrain size={28} />} delay={0.1}>
              احصل على توجيهات مخصصة من مساعدنا الذكي "سَند" الذي يفهم احتياجاتك وطموحاتك.
            </Feature>
            <Feature title="مهن متنوعة" icon={<FaCompass size={28} />} delay={0.2}>
              من التكنولوجيا إلى الأعمال، استكشف مكتبة متنامية من التخصصات والمسارات المهنية.
            </Feature>
          </div>
        </div>
      </AnimatedSection>

      {/* Sanad AI Assistant Section */}
      <AnimatedSection className="py-16 sm:py-24 bg-[var(--color-surface-1)]/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-right order-2 md:order-1"
              >
                <Badge variant="primary" className="mb-4">
                  <FaRobot className="w-3 h-3" />
                  مساعد ذكي
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">
                  تعرف على سَند
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                  سَند هو مساعدك الذكي للإرشاد المهني. يساعدك في استكشاف المسارات المهنية، 
                  يجيب على أسئلتك، ويقدم لك توصيات مخصصة بناءً على اهتماماتك ومهاراتك.
                </p>
                
                <ul className="space-y-3 mb-6">
                  {[
                    'اسأله عن أي مهنة تثير فضولك',
                    'احصل على نصائح مخصصة لمسارك',
                    'استفسر عن المهارات المطلوبة',
                    'اكتشف فرص العمل في السوق السعودي'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                      <span className="flex-1">{item}</span>
                      <FaCheckCircle className="text-emerald-400 shrink-0" />
                    </li>
                  ))}
                </ul>
                
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  icon={<FaArrowLeft />}
                  iconPosition="end"
                >
                  جرب سَند مجانًا
                </Button>
              </motion.div>
              
              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 md:order-2"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-dark)]/20 rounded-3xl blur-2xl" />
                  <div className="relative bg-[var(--color-surface-1)] rounded-2xl p-6 border border-[var(--color-border-default)]">
                    {/* Chat Preview */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-default)]">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
                        <FaRobot className="text-white text-xl" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-[var(--color-text-primary)]">سَند</h4>
                        <p className="text-xs text-emerald-400">متصل الآن</p>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
                          <p className="text-sm">ما هي أفضل المهن للمستقبل؟</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-[var(--color-surface-2)] px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%]">
                          <p className="text-sm text-[var(--color-text-primary)]">
                            أهلاً! المهن التقنية والذكاء الاصطناعي في نمو مستمر. 
                            جرب محاكاة مهندس البرمجيات لتكتشف إذا كانت تناسبك!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Dynamic Stats Section */}
      <AnimatedSection className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <StatItem 
              finalValue={4} 
              label="مسارات مهنية متاحة" 
              icon={<FaCompass className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />}
            />
            <StatItem 
              finalValue={15} 
              label="مهمة تفاعلية" 
              icon={<FaLaptopCode className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />}
            />
            <StatItem 
              finalValue={1000} 
              label="طالب مستفيد" 
              icon={<FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection className="py-16 sm:py-24 bg-[var(--color-surface-1)]/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="success" className="mb-4">كيف تبدأ؟</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">3 خطوات بسيطة</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-base sm:text-lg">
              ابدأ رحلة استكشاف مستقبلك المهني بخطوات سهلة وممتعة
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <HowItWorksStep number="1" title="اختر مسارًا مهنيًا" delay={0}>
              تصفح مكتبتنا المتنوعة للمجالات المهنية واختر ما يثير اهتمامك وفضولك.
            </HowItWorksStep>
            <HowItWorksStep number="2" title="جرب المهام الحقيقية" delay={0.1}>
              انغمس في تحديات ومهام تفاعلية تحاكي العمل الفعلي للمحترفين في المجال.
            </HowItWorksStep>
            <HowItWorksStep number="3" title="اكتشف نفسك" delay={0.2} isLast>
              احصل على تقييم شامل لمهاراتك واكتشف المهن التي تناسب شخصيتك وطموحاتك.
            </HowItWorksStep>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="warning" className="mb-4">آراء المستخدمين</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">ماذا يقولون عنا</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-base sm:text-lg">
              تجارب حقيقية من طلاب ومؤسسات تعليمية
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Testimonial author="أحمد العلي" role="طالب ثانوي" delay={0}>
              جلينت غيّر طريقة تفكيري في مستقبلي بالكامل. المحاكاة أعطتني الثقة لاختيار تخصصي الجامعي بوضوح.
            </Testimonial>
            <Testimonial author="فاطمة الزهراني" role="طالبة جامعية" delay={0.1}>
              كنت مترددة بشأن مساري المهني، لكن تجربة مهام وظيفة حقيقية على جلينت كانت كاشفة ومفيدة جداً.
            </Testimonial>
            <Testimonial author="جامعة الملك سعود" role="شريك تعليمي" delay={0.2}>
              نستخدم جلينت لتزويد طلابنا بأدوات إرشاد مهني مبتكرة. النتائج كانت رائعة ومشجعة.
            </Testimonial>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-16 sm:py-24 bg-[var(--color-surface-1)]/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="neutral" className="mb-4">أسئلة شائعة</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">هل لديك استفسار؟</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-base sm:text-lg">
              إليك إجابات الأسئلة الأكثر شيوعاً
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <FAQItem question="ما هو جلينت؟">
              جلينت هي منصة محاكاة مهنية تفاعلية تساعد الطلاب على استكشاف مختلف المهن والتخصصات من خلال تجارب واقعية، مما يساعدهم على اتخاذ قرارات مهنية مستنيرة.
            </FAQItem>
            <FAQItem question="هل المنصة مجانية؟">
              نعم، نقدم خطة مجانية تتيح الوصول إلى مجموعة من المحاكاة والميزات الأساسية. كما نوفر خططاً مميزة للمؤسسات التعليمية.
            </FAQItem>
            <FAQItem question="لمن تستهدف المنصة؟">
              تستهدف المنصة طلاب الثانوية والجامعة الذين يستكشفون خياراتهم المهنية، بالإضافة إلى المؤسسات التعليمية الراغبة في تقديم إرشاد مهني مبتكر.
            </FAQItem>
            <FAQItem question="كيف تعمل المحاكاة؟">
              كل محاكاة توجهك عبر سلسلة من المهام والسيناريوهات الواقعية. ستحل مشكلات وتتخذ قرارات وتستخدم أدوات افتراضية تماماً كما يفعل المحترفون.
            </FAQItem>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[var(--color-primary)]/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6">
              هل أنت مستعد لاكتشاف مستقبلك؟
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg">
              انضم إلى آلاف الطلاب الذين اكتشفوا شغفهم الحقيقي. البدء مجاني!
            </p>
            
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="lg"
              isPill
              icon={<FaRocket className="w-4 h-4 sm:w-5 sm:h-5" />}
              className="shadow-xl shadow-[var(--color-primary)]/30 w-full sm:w-auto"
            >
              ابدأ رحلتك الآن
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
