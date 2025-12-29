import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-1)] border-t border-[var(--color-border-default)]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/GlintFullLogoWhite.png" 
                alt="Glint" 
                className="h-8 w-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
              جرب مسارك المهني المستقبلي واتخذ قرارات واثقة بشأن مسارك الأكاديمي والمهني.
            </p>
            <div className="flex gap-3 justify-end">
              <SocialLink href="#" icon={FaTwitter} label="Twitter" />
              <SocialLink href="#" icon={FaLinkedin} label="LinkedIn" />
              <SocialLink href="#" icon={FaInstagram} label="Instagram" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--color-text-primary)] font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/#features">المميزات</FooterLink>
              <FooterLink to="/#simulations">المحاكاة</FooterLink>
              <FooterLink to="/login">تسجيل الدخول</FooterLink>
              <FooterLink to="/signup">إنشاء حساب</FooterLink>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-[var(--color-text-primary)] font-semibold mb-4">الموارد</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/#">المدونة</FooterLink>
              <FooterLink to="/#">الأسئلة الشائعة</FooterLink>
              <FooterLink to="/#">الدعم</FooterLink>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-[var(--color-text-primary)] font-semibold mb-4">قانوني</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/privacy">سياسة الخصوصية</FooterLink>
              <FooterLink to="/terms">شروط الخدمة</FooterLink>
            </ul>
            
            {/* Contact */}
            <div className="mt-6">
              <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">تواصل معنا</h4>
              <a 
                href="mailto:hello@glint.sa"
                className="flex items-center justify-end gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                <span>hello@glint.sa</span>
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-border-default)] mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
            <p>&copy; {new Date().getFullYear()} جلينت. جميع الحقوق محفوظة.</p>
            <p className="flex items-center gap-1">
              صنع بـ ❤️ في السعودية 🇸🇦
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
