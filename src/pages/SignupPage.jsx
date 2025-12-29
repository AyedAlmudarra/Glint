import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaGraduationCap, FaArrowRight, FaArrowLeft, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';

const interestOptions = [
  { id: 'tech', label: 'التكنولوجيا والبرمجة', icon: '💻' },
  { id: 'business', label: 'الأعمال والمالية', icon: '📊' },
  { id: 'arts', label: 'الفنون والتصميم الإبداعي', icon: '🎨' },
  { id: 'health', label: 'الرعاية الصحية والعلوم', icon: '🔬' },
  { id: 'engineering', label: 'الهندسة والتصنيع', icon: '⚙️' },
  { id: 'marketing', label: 'التسويق والتواصل', icon: '📢' },
];

const PasswordStrengthMeter = ({ password }) => {
  const checkPasswordStrength = () => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };
    const strength = Object.values(checks).filter(Boolean).length;
    return { strength, checks };
  };

  const { strength, checks } = checkPasswordStrength();
  
  if (!password) return null;

  const strengthLevels = [
    { text: 'ضعيف جداً', color: 'text-red-400', bgColor: 'bg-red-500' },
    { text: 'ضعيف', color: 'text-red-400', bgColor: 'bg-red-500' },
    { text: 'مقبول', color: 'text-amber-400', bgColor: 'bg-amber-500' },
    { text: 'جيد', color: 'text-yellow-400', bgColor: 'bg-yellow-500' },
    { text: 'قوي', color: 'text-emerald-400', bgColor: 'bg-emerald-500' },
    { text: 'ممتاز', color: 'text-emerald-400', bgColor: 'bg-emerald-500' },
  ];

  const level = strengthLevels[strength];

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className={`text-xs font-medium ${level.color}`}>{level.text}</span>
        <div className="flex-1 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${level.bgColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${(strength / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-end text-xs">
        <span className={checks.length ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'}>
          {checks.length ? '✓' : '○'} 8 أحرف
        </span>
        <span className={checks.uppercase ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'}>
          {checks.uppercase ? '✓' : '○'} حرف كبير
        </span>
        <span className={checks.number ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'}>
          {checks.number ? '✓' : '○'} رقم
        </span>
      </div>
    </div>
  );
};

const InterestChip = ({ interest, selected, onChange }) => (
  <motion.button
    type="button"
    onClick={() => onChange(interest.label)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      w-full text-sm text-right p-3 rounded-xl border-2 transition-all duration-200
      flex items-center gap-3
      ${selected 
        ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-white' 
        : 'bg-[var(--color-surface-1)] border-[var(--color-border-default)] hover:border-[var(--color-border-light)] text-[var(--color-text-secondary)]'
      }
    `}
  >
    <span className="text-xl">{interest.icon}</span>
    <span className="flex-1">{interest.label}</span>
    {selected && <FaCheckCircle className="text-[var(--color-primary)]" />}
  </motion.button>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    educationLevel: '',
    interests: [],
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) return "البريد الإلكتروني مطلوب.";
    if (!/\S+@\S+\.\S+/.test(email)) return "صيغة البريد الإلكتروني غير صحيحة.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'email') {
      const emailError = validateEmail(value);
      setErrors(prev => ({ ...prev, email: emailError }));
    }
  };
  
  const handleInterestChange = (interest) => {
    setTouched((prev) => ({ ...prev, interests: true }));
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: null }));
    }
  };

  const nextStep = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "الاسم الأول مطلوب.";
    if (!formData.lastName) newErrors.lastName = "اسم العائلة مطلوب.";
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }
    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة.";
    } else if (formData.password.length < 8) {
      newErrors.password = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين.";
    }

    setErrors(newErrors);
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    
    if (Object.keys(newErrors).length === 0) {
      setDirection(1);
      setStep(2);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;

    const step2Errors = {};
    if (!formData.dateOfBirth) step2Errors.dateOfBirth = "تاريخ الميلاد مطلوب.";
    if (!formData.educationLevel) step2Errors.educationLevel = "المستوى التعليمي مطلوب.";
    if (formData.interests.length === 0) step2Errors.interests = "يرجى اختيار مجال اهتمام واحد على الأقل.";
    if (!termsAccepted) step2Errors.terms = "يجب الموافقة على شروط الخدمة وسياسة الخصوصية.";

    setErrors(step2Errors);
    setTouched(prev => ({ ...prev, dateOfBirth: true, educationLevel: true, interests: true, terms: true }));
    
    if (Object.keys(step2Errors).length > 0) return;
    
    setLoading(true);
    setErrors({});

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          education_level: formData.educationLevel,
          fields_of_interest: formData.interests
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    setLoading(false);
    if (error) {
      setErrors({ submit: `فشل التسجيل. يرجى التحقق من معلوماتك والمحاولة مرة أخرى.` });
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setErrors({ email: 'هذا البريد الإلكتروني مسجل بالفعل.' });
      setTouched(prev => ({...prev, email: true}));
      setDirection(-1);
      setStep(1);
    } else {
      navigate('/check-email', { state: { email: formData.email } });
    }
  };

  const formVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? '50px' : '-50px',
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-50px' : '50px',
      opacity: 0,
      transition: { duration: 0.2 }
    }),
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      
      {/* Back to home link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6 z-20"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <span>الرئيسية</span>
          <FaArrowLeft className="w-4 h-4" />
        </Link>
      </motion.div>
      
      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link to="/" className="inline-block">
            <img 
              src="/GlintFullLogoWhite.png" 
              alt="Glint" 
              className="h-12 w-auto mx-auto"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </Link>
        </motion.div>
        
        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <Badge variant="success" className="mb-3">
                <FaRocket className="w-3 h-3" />
                مجاني للأبد
              </Badge>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                {step === 1 ? 'إنشاء حساب جديد' : 'تخصيص رحلتك'}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm">
                {step === 1 ? 'لنبدأ في بناء مستقبلك المهني' : 'ساعدنا في تخصيص تجربتك'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
                <span>الخطوة {step} من 2</span>
                <span>{step === 1 ? 'معلومات الحساب' : 'التفضيلات'}</span>
              </div>
              <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.form
                key={step}
                custom={direction}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="firstName"
                        label="الاسم الأول"
                        placeholder="أحمد"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        icon={<FaUser className="w-4 h-4" />}
                        error={touched.firstName && errors.firstName}
                        required
                      />
                      <Input
                        name="lastName"
                        label="اسم العائلة"
                        placeholder="محمد"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        icon={<FaUser className="w-4 h-4" />}
                        error={touched.lastName && errors.lastName}
                        required
                      />
                    </div>
                    
                    <Input
                      name="email"
                      type="email"
                      label="البريد الإلكتروني"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      icon={<FaEnvelope className="w-4 h-4" />}
                      error={touched.email && errors.email}
                      required
                    />
                    
                    <div>
                      <Input
                        name="password"
                        type="password"
                        label="كلمة المرور"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        icon={<FaLock className="w-4 h-4" />}
                        error={touched.password && errors.password}
                        required
                      />
                      <PasswordStrengthMeter password={formData.password} />
                    </div>

                    <Input
                      name="confirmPassword"
                      type="password"
                      label="تأكيد كلمة المرور"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      icon={<FaLock className="w-4 h-4" />}
                      error={touched.confirmPassword && errors.confirmPassword}
                      required
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      label="تاريخ الميلاد"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      icon={<FaBirthdayCake className="w-4 h-4" />}
                      error={touched.dateOfBirth && errors.dateOfBirth}
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2 text-right">
                        المستوى التعليمي <span className="text-[var(--color-error)]">*</span>
                      </label>
                      <div className="relative">
                        <FaGraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
                        <select
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`
                            w-full bg-[var(--color-surface-1)] border-2 rounded-lg py-3 px-4 pr-10
                            text-[var(--color-text-primary)] text-right
                            transition-all duration-200 focus:outline-none
                            ${errors.educationLevel 
                              ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' 
                              : 'border-[var(--color-border-default)] focus:border-[var(--color-primary)]'
                            }
                          `}
                        >
                          <option value="" disabled>اختر المستوى التعليمي</option>
                          <option value="middle_school">طالب في المرحلة المتوسطة</option>
                          <option value="high_school">طالب في المرحلة الثانوية</option>
                          <option value="undergraduate">طالب جامعي (بكالوريوس)</option>
                          <option value="postgraduate">طالب دراسات عليا</option>
                          <option value="graduate">خريج / خارج مقاعد الدراسة</option>
                        </select>
                      </div>
                      {touched.educationLevel && errors.educationLevel && (
                        <p className="text-[var(--color-error)] text-sm text-right mt-1">{errors.educationLevel}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3 text-right">
                        مجالات الاهتمام <span className="text-[var(--color-error)]">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {interestOptions.map((interest) => (
                          <InterestChip
                            key={interest.id}
                            interest={interest}
                            selected={formData.interests.includes(interest.label)}
                            onChange={handleInterestChange}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-2 text-right">
                        اختر واحدًا أو أكثر لتخصيص تجربتك
                      </p>
                      {touched.interests && errors.interests && (
                        <p className="text-[var(--color-error)] text-sm text-right mt-1">{errors.interests}</p>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <label className="flex items-center justify-end gap-3 cursor-pointer">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          أوافق على{' '}
                          <Link to="/terms" target="_blank" className="text-[var(--color-primary)] hover:underline">
                            شروط الخدمة
                          </Link>
                          {' '}و{' '}
                          <Link to="/privacy" target="_blank" className="text-[var(--color-primary)] hover:underline">
                            سياسة الخصوصية
                          </Link>
                        </span>
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="w-5 h-5 rounded bg-[var(--color-surface-1)] border-[var(--color-border-default)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                      </label>
                      {touched.terms && errors.terms && (
                        <p className="text-[var(--color-error)] text-sm text-right mt-1">{errors.terms}</p>
                      )}
                    </div>
                  </>
                )}

                {errors.submit && (
                  <Alert variant="error" dismissible onDismiss={() => setErrors(prev => ({ ...prev, submit: null }))}>
                    {errors.submit}
                  </Alert>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-4 gap-4">
                  {step === 1 ? (
                    <div />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      icon={<FaArrowRight className="w-4 h-4" />}
                    >
                      رجوع
                    </Button>
                  )}
                  
                  {step === 1 ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={nextStep}
                      icon={<FaArrowLeft className="w-4 h-4" />}
                      iconPosition="end"
                      className="flex-1"
                    >
                      التالي
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="success"
                      size="lg"
                      onClick={handleSubmit}
                      isLoading={loading}
                      isDisabled={!termsAccepted}
                      className="flex-1"
                    >
                      إنشاء الحساب
                    </Button>
                  )}
                </div>
              </motion.form>
            </AnimatePresence>

            <p className="text-center text-[var(--color-text-secondary)] mt-6 text-sm">
              هل لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
