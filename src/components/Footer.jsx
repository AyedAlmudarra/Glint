import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">جلينت</h3>
            <p>جرب مسارك المهني المستقبلي واتخذ قرارات واثقة بشأن مسارك الأكاديمي والمهني.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul>
              <li className="mb-2"><Link to="/#features" className="hover:text-white">المميزات</Link></li>
              <li className="mb-2"><Link to="/login" className="hover:text-white">تسجيل الدخول</Link></li>
              <li className="mb-2"><Link to="/signup" className="hover:text-white">إنشاء حساب</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">قانوني</h3>
            <ul>
              <li className="mb-2"><Link to="/privacy" className="hover:text-white">سياسة الخصوصية</Link></li>
              <li className="mb-2"><Link to="/terms" className="hover:text-white">شروط الخدمة</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} جلينت. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
} 