import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';
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

export default function PrivacyPage() {
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
              <FaShieldAlt className="w-3 h-3" />
              قانوني
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">سياسة الخصوصية</h1>
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
              <Section title="مقدمة">
                <p>
                  نحن في جلينت نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لمنصتنا.
                </p>
              </Section>
              
              <Section title="المعلومات التي نجمعها">
                <p>نجمع المعلومات التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>المعلومات الشخصية: الاسم، البريد الإلكتروني، تاريخ الميلاد</li>
                  <li>المعلومات التعليمية: المستوى التعليمي، مجالات الاهتمام</li>
                  <li>بيانات الاستخدام: تقدمك في المحاكاة، نتائج المهام</li>
                </ul>
              </Section>
              
              <Section title="كيف نستخدم معلوماتك">
                <p>نستخدم معلوماتك لـ:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تخصيص تجربتك على المنصة</li>
                  <li>تقديم توصيات مهنية مناسبة</li>
                  <li>تحسين خدماتنا ومحتوانا</li>
                  <li>التواصل معك بشأن حسابك</li>
                </ul>
              </Section>
              
              <Section title="حماية المعلومات">
                <p>
                  نستخدم إجراءات أمنية متقدمة لحماية معلوماتك، بما في ذلك التشفير والخوادم الآمنة. لن نشارك معلوماتك مع أطراف ثالثة دون موافقتك.
                </p>
              </Section>
              
              <Section title="حقوقك">
                <p>لديك الحق في:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>الوصول إلى معلوماتك الشخصية</li>
                  <li>تصحيح أو تحديث معلوماتك</li>
                  <li>طلب حذف حسابك وبياناتك</li>
                  <li>الانسحاب من الاتصالات التسويقية</li>
                </ul>
              </Section>
              
              <Section title="اتصل بنا">
                <p>
                  إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: 
                  <a href="mailto:privacy@glint.sa" className="text-[var(--color-primary)] hover:underline mr-1">
                    privacy@glint.sa
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