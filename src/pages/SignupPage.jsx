import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaGraduationCap, FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '../components/Spinner';
import InputField from '../components/forms/InputField';

const interestOptions = [
  "التكنولوجيا والبرمجة",
  "الأعمال والمالية",
  "الفنون والتصميم الإبداعي",
  "الرعاية الصحية والعلوم",
  "الهندسة والتصنيع",
  "التسويق والتواصل"
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

  const { strength } = checkPasswordStrength();
  
  if (!password) return null;

  const strengthLevels = [
    { text: 'ضعيف جداً', color: 'text-red-500', bgColor: 'bg-red-500' },
    { text: 'ضعيف', color: 'text-red-500', bgColor: 'bg-red-500' },
    { text: 'مقبول', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { text: 'جيد', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { text: 'قوي', color: 'text-green-500', bgColor: 'bg-green-500' },
    { text: 'قوي جداً', color: 'text-green-500', bgColor: 'bg-green-500' },
  ];

  const level = strengthLevels[strength];

  return (
    <div className="space-y-2 mt-2 text-right">
       <div className="flex justify-between items-center">
        <p className={`text-xs font-bold ${level.color}`}>{level.text}</p>
        <div className="w-2/3 bg-gray-600 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${level.bgColor}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) {
      return "البريد الإلكتروني مطلوب.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "صيغة البريد الإلكتروني غير صحيحة.";
    }
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    
    if (Object.keys(step2Errors).length > 0) {
      return;
    }
    
    setLoading(true);
    setErrors({}); // Clear previous errors

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
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.4 }
    }),
    visible: {
      x: '0%',
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.4 }
    }),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 animated-gradient">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-6">
           <h1 className="text-4xl font-bold text-white">Glint</h1>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full transition-all duration-500 overflow-hidden">
            <h2 className="text-3xl font-bold text-center mb-2 text-blue-400">
              {step === 1 ? 'إنشاء حساب جديد' : 'تخصيص رحلتك'}
            </h2>
            <p className="text-center text-gray-300 mb-6">
              {step === 1 ? 'لنبدأ في بناء مستقبلك المهني.' : 'ساعدنا في تخصيص تجربتك.'}
            </p>

            <div className="relative h-2 bg-gray-700 rounded-full mb-8">
              <motion.div
                className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField name="firstName" type="text" placeholder="الاسم الأول" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} icon={<FaUser />} error={errors.firstName} touched={touched.firstName} />
                    <InputField name="lastName" type="text" placeholder="اسم العائلة" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} icon={<FaUser />} error={errors.lastName} touched={touched.lastName} />
                  </div>
                  <InputField name="email" type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} onBlur={handleBlur} icon={<FaEnvelope />} error={errors.email} touched={touched.email} />
                  
                  <div>
                    <InputField 
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      icon={<FaLock />}
                      error={errors.password}
                      touched={touched.password}
                      isPassword={true}
                      showPassword={showPassword}
                      onToggleShowPassword={() => setShowPassword(!showPassword)}
                    />
                    <PasswordStrengthMeter password={formData.password} />
                  </div>

                  <div>
                    <InputField 
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="تأكيد كلمة المرور"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      icon={<FaLock />}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      isPassword={true}
                      showPassword={showConfirmPassword}
                      onToggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <InputField name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} icon={<FaBirthdayCake />} label="تاريخ الميلاد" error={errors.dateOfBirth} touched={touched.dateOfBirth} onBlur={handleBlur} />
                  
                  <div>
                    <div className="relative">
                      <FaGraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} onBlur={handleBlur}
                        className={`w-full bg-gray-700/50 border rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 text-right ${errors.educationLevel ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}`} >
                        <option value="" disabled>المستوى التعليمي</option>
                        <option value="middle_school">طالب في المرحلة المتوسطة</option>
                        <option value="high_school">طالب في المرحلة الثانوية</option>
                        <option value="undergraduate">طالب جامعي (بكالوريوس)</option>
                        <option value="postgraduate">طالب دراسات عليا</option>
                        <option value="graduate">خريج / خارج مقاعد الدراسة</option>
                      </select>
                    </div>
                    {touched.educationLevel && errors.educationLevel && <p className="text-red-400 text-xs text-right mt-1">{errors.educationLevel}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-right">مجالات الاهتمام</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {interestOptions.map((interest) => (
                        <InterestChip key={interest} interest={interest} selected={formData.interests.includes(interest)} onChange={handleInterestChange} />
                      ))}
                    </div>
                     <p className="text-xs text-gray-500 mt-2 text-right">اختر واحدًا أو أكثر. يساعدنا هذا فيแนะนำ المحاكاة المناسبة لك.</p>
                     {touched.interests && errors.interests && <p className="text-red-400 text-xs text-right mt-1">{errors.interests}</p>}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-end gap-2">
                      <label htmlFor="terms" className="text-sm text-gray-300">
                        أوافق على <Link to="/terms" target="_blank" className="text-blue-400 hover:underline">شروط الخدمة</Link> و <Link to="/privacy" target="_blank" className="text-blue-400 hover:underline">سياسة الخصوصية</Link>
                      </label>
                      <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500" />
                    </div>
                    {touched.terms && errors.terms && <p className="text-red-400 text-xs text-right mt-1">{errors.terms}</p>}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-4">
                {step === 1 ? ( <div></div> ) : (
                  <motion.button type="button" onClick={prevStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
                    <FaArrowRight /> <span>رجوع</span>
                  </motion.button>
                )}
                
                {step === 1 && (
                  <motion.button type="button" onClick={nextStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-1/2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2">
                    <span>التالي</span> <FaArrowLeft />
                  </motion.button>
                )}
                
                {step === 2 && (
                  <motion.button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !termsAccepted} 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                    className="w-1/2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    {loading ? <Spinner /> : 'إنشاء الحساب'}
                  </motion.button>
                )}
              </div>
              </motion.form>
            </AnimatePresence>

            <p className="text-center text-gray-400 mt-6 text-sm">
              هل لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-bold text-blue-400 hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}

const InterestChip = ({ interest, selected, onChange }) => (
  <motion.button
    type="button"
    onClick={() => onChange(interest)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`w-full text-sm text-center p-2 rounded-full border-2 transition-all duration-300 ${
      selected ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-gray-500'
    }`}
  >
    {interest}
  </motion.button>
); 