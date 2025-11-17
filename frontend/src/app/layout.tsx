import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SportStream - البث المباشر للمباريات',
  description: 'شاهد المباريات الرياضية مباشرة وبجودة عالية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">SS</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  SportStream
                </h1>
              </div>

              <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
                <a href="/" className="hover:text-green-400 transition-colors font-semibold">الرئيسية</a>
                <a href="/matches" className="hover:text-green-400 transition-colors">المباريات</a>
                <a href="/live" className="hover:text-green-400 transition-colors">البث المباشر</a>
                <a href="/about" className="hover:text-green-400 transition-colors">حول</a>
                <a href="/admin" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors font-semibold">
                  لوحة التحكم
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white text-sm">SS</span>
                  </div>
                  <h3 className="text-xl font-bold">SportStream</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  منصة البث المباشر الرائدة للمباريات الرياضية. شاهد أفضل الأحداث الرياضية من حول العالم.
                </p>
                <div className="flex space-x-4 space-x-reverse">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">تويتر</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">فيسبوك</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">يوتيوب</a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">روابط سريعة</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/" className="hover:text-white transition-colors">الرئيسية</a></li>
                  <li><a href="/matches" className="hover:text-white transition-colors">جميع المباريات</a></li>
                  <li><a href="/live" className="hover:text-white transition-colors">البث المباشر</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">حول الموقع</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">الدعم</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/contact" className="hover:text-white transition-colors">اتصل بنا</a></li>
                  <li><a href="/help" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">شروط الخدمة</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>© 2024 SportStream. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
