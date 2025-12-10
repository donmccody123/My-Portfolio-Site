import { Award, Target, Users } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Me
          </h2>
          <p className="text-xl text-gray-600">
            Creating meaningful designs that make an impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch mb-16">
          <div className="relative flex items-center justify-center">
            <img
              src="/fullpic.png"
              alt="BRIGHT BORTEI BORKETEY"
              className="h-full w-auto object-contain"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <img
                src="/hdshot.png"
                alt="BRIGHT BORTEI BORKETEY Headshot"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Hi, I'm BRIGHT BORTEI BORKETEY
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founder and Creative Director of <strong>BM TECH SOLUTIONS</strong>. With years of experience in the design and technology industry, I specialize in transforming ideas
              into stunning visual experiences and technical solutions. My passion lies in creating designs that not only
              look beautiful but also communicate effectively and drive results.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From brand identity to print materials, software installations to hardware setup, I bring creativity, precision, and strategic
              thinking to every project. I believe that great design and technology solutions are about solving problems and
              creating connections between brands and their audiences.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="bg-blue-600 rounded-lg p-4 mb-2 inline-block">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-2xl text-gray-900">100+</p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
              <div className="text-center">
                <div className="bg-cyan-600 rounded-lg p-4 mb-2 inline-block">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-2xl text-gray-900">50+</p>
                <p className="text-sm text-gray-600">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500 rounded-lg p-4 mb-2 inline-block">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-2xl text-gray-900">5+</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
