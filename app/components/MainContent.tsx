import Link from "next/link";
import { 
  Newspaper, 
  Users, 
  Calendar, 
  FileText, 
  Trophy, 
  BookOpen, 
  Flag, 
  Clock, 
  User, 
  ArrowRight, 
  Mail,
  GraduationCap
} from "lucide-react";

export default function MainContent() {
  const featuredArticles = [
    {
      id: 1,
      title: "MCS Receives Outstanding Achievement Award for Academic Excellence",
      excerpt: "Malate Catholic School has been recognized with the prestigious Academic Excellence Award for 2024, highlighting our commitment to quality education and student development.",
      category: "News",
      categoryColor: "bg-blue-600",
      date: "December 15, 2024",
      author: "Editorial Team",
      readTime: "3 min read",
      featured: true
    },
    {
      id: 2,
      title: "Basketball Team Clinches Championship Title",
      excerpt: "Our varsity basketball team made history by winning the inter-school championship in a thrilling final match against defending champions.",
      category: "Sports",
      categoryColor: "bg-green-600",
      date: "December 12, 2024",
      author: "Sports Editor",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Annual Literary Contest Showcases Student Creativity",
      excerpt: "Students demonstrate exceptional writing skills in this year's literary competition, with themes ranging from social issues to personal reflections.",
      category: "Literary",
      categoryColor: "bg-purple-600",
      date: "December 10, 2024",
      author: "Literary Editor",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "New Science Laboratory Facilities Unveiled",
      excerpt: "State-of-the-art laboratory equipment enhances hands-on learning experience for students in chemistry, biology, and physics courses.",
      category: "Features",
      categoryColor: "bg-orange-600",
      date: "December 8, 2024",
      author: "Feature Writer",
      readTime: "6 min read"
    }
  ];
  const quickStats = [
    { number: "500+", label: "Students", icon: GraduationCap },
    { number: "50+", label: "Faculty", icon: Users },
    { number: "25+", label: "Years", icon: Calendar },
    { number: "100+", label: "Articles", icon: Newspaper }
  ];

  return (    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="news-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in text-balance">
              Welcome to
              <span className="block text-yellow-300 mt-2">The Clarionette</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-red-100 max-w-4xl mx-auto animate-slide-up text-balance leading-relaxed">
              Malate Catholic School's premier student publication, delivering the latest news, 
              sports updates, and inspiring stories from our vibrant school community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
              <Link
                href="/main/news"
                className="btn-primary bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Newspaper size={20} />
                Latest News
              </Link>
              <Link
                href="/main/features"
                className="btn-secondary border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600"
              >
                <FileText size={20} />
                Feature Stories
              </Link>
            </div>
          </div>
        </div>
      </section>{/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="text-red-600 mb-3 flex justify-center">
                  <stat.icon size={32} />
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Featured Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">Featured Stories</h2>
            <div className="section-divider mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Stay informed with our latest news, sports updates, and feature stories 
              from the MCS community.
            </p>
          </div>

          {/* Main Featured Article */}
          <div className="mb-16">
            <article className="article-card article-featured">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-80 md:h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative">
                    <div className="text-red-300">
                      <Newspaper size={80} />
                    </div>
                    <div className="absolute top-6 left-6">
                      <span className="breaking-news">
                        FEATURED
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center mb-6">
                    <span className={`article-category ${featuredArticles[0].categoryColor} text-white`}>
                      {featuredArticles[0].category}
                    </span>
                    <div className="article-meta ml-4">
                      <Calendar size={14} />
                      <span>{featuredArticles[0].date}</span>
                    </div>
                  </div>
                  <h3 className="article-title text-3xl md:text-4xl mb-6">
                    <Link href="/main/news">
                      {featuredArticles[0].title}
                    </Link>
                  </h3>
                  <p className="article-excerpt text-lg mb-8 leading-relaxed">
                    {featuredArticles[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="article-meta">
                      <User size={14} />
                      <span>{featuredArticles[0].author}</span>
                      <Clock size={14} />
                      <span>{featuredArticles[0].readTime}</span>
                    </div>
                    <Link
                      href="/main/news"
                      className="btn-primary"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.slice(1).map((article) => (
              <article
                key={article.id}
                className="article-card"
              >
                <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <div className="text-gray-400">
                    {article.category === 'Sports' ? <Trophy size={48} /> : 
                     article.category === 'Literary' ? <BookOpen size={48} /> : 
                     article.category === 'Features' ? <FileText size={48} /> : <Newspaper size={48} />}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`article-category ${article.categoryColor} text-white`}>
                      {article.category.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="article-meta mb-4">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="article-title text-xl mb-4 line-clamp-2">
                    <Link href={`/main/${article.category.toLowerCase()}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="article-excerpt mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="article-meta">
                      <User size={14} />
                      <span>{article.author}</span>
                    </div>
                    <Link
                      href={`/main/${article.category.toLowerCase()}`}
                      className="text-red-600 font-semibold hover:text-red-800 transition-colors text-sm flex items-center gap-1"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>      {/* Section Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">Explore Our Sections</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Sports", icon: Trophy, color: "from-green-500 to-green-600", href: "/main/sports" },
              { title: "Literary", icon: BookOpen, color: "from-purple-500 to-purple-600", href: "/main/literary" },
              { title: "Filipino", icon: Flag, color: "from-red-500 to-red-600", href: "/main/filipino" }
            ].map((section, index) => (
              <Link
                key={index}
                href={section.href}
                className="section-card group"
              >
                <div className={`section-icon bg-gradient-to-br ${section.color} text-white`}>
                  <section.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover the latest {section.title.toLowerCase()} content from our talented writers and contributors.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>      {/* Newsletter */}
      <section className="newsletter py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl font-bold mb-6">Stay Connected</h2>
          <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
            Get the latest updates from The Clarionette delivered directly to your inbox. 
            Never miss an important story from our school community.
          </p>
          <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="newsletter-button">
              <Mail size={20} />
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
