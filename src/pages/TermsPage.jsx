import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFileContract } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 text-right">{title}</h2>
    <div className="text-[var(--color-text-secondary)] leading-relaxed text-right space-y-3">
      {children}
    </div>
  </div>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm"
            >
              <span>الرئيسية</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" className="mb-4">
              <FaFileContract className="w-3 h-3" />
              قانوني
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">شروط الخدمة</h1>
            <p className="text-[var(--color-text-secondary)]">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </motion.div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Section title="قبول الشروط">
                <p>
                  باستخدامك لمنصة جلينت، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
                </p>
              </Section>
              
              <Section title="وصف الخدمة">
                <p>
                  جلينت هي منصة تعليمية تفاعلية تقدم محاكاة مهنية لمساعدة المستخدمين على استكشاف المسارات المهنية المختلفة. نحتفظ بالحق في تعديل أو إيقاف أي جزء من الخدمة في أي وقت.
                </p>
              </Section>
              
              <Section title="حساب المستخدم">
                <p>عند إنشاء حساب، أنت مسؤول عن:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>الحفاظ على سرية كلمة المرور</li>
                  <li>جميع الأنشطة التي تحدث تحت حسابك</li>
                  <li>تقديم معلومات دقيقة وحديثة</li>
                </ul>
              </Section>
              
              <Section title="الاستخدام المقبول">
                <p>أنت توافق على عدم:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>استخدام المنصة لأي غرض غير قانوني</li>
                  <li>محاولة الوصول غير المصرح به إلى أي جزء من النظام</li>
                  <li>نشر محتوى مسيء أو غير لائق</li>
                  <li>انتحال شخصية أي شخص آخر</li>
                </ul>
              </Section>
              
              <Section title="الملكية الفكرية">
                <p>
                  جميع المحتويات على المنصة، بما في ذلك النصوص والصور والرسومات والمحاكاة، هي ملك لجلينت ومحمية بموجب قوانين حقوق النشر.
                </p>
              </Section>
              
              <Section title="إخلاء المسؤولية">
                <p>
                  المحاكاة المقدمة هي لأغراض تعليمية فقط ولا تمثل ضمانًا للتوظيف أو النجاح المهني. يجب اعتبار التوصيات كإرشادات وليست نصائح مهنية رسمية.
                </p>
              </Section>
              
              <Section title="التعديلات">
                <p>
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة.
                </p>
              </Section>
              
              <Section title="اتصل بنا">
                <p>
                  إذا كانت لديك أي أسئلة حول شروط الخدمة، يرجى التواصل معنا عبر البريد الإلكتروني: 
                  <a href="mailto:support@glint.sa" className="text-[var(--color-primary)] hover:underline mr-1">
                    support@glint.sa
                  </a>
                </p>
              </Section>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}