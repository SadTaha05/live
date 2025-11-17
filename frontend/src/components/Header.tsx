export default function Header() {
  return (
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
  );
}
