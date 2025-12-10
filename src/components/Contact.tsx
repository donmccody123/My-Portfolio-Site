
export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Connect
          </h2>
          <p className="text-xl text-blue-100">
            Follow me on social media to stay updated with my latest work
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/bright-borketey/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center gap-4 min-w-[200px]"
          >
            <img src="/public/Icons/in.png" alt="LinkedIn" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-bold text-gray-900">LinkedIn</p>
              <p className="text-sm text-gray-600">Connect with me</p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/don.mccody/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center gap-4 min-w-[200px]"
          >
            <img src="/public/Icons/ig.png" alt="Instagram" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-bold text-gray-900">Instagram</p>
              <p className="text-sm text-gray-600">View my work</p>
            </div>
          </a>

          <a
            href="https://x.com/BrightMccody"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center gap-4 min-w-[200px]"
          >
            <img src="/public/Icons/x.png" alt="X (Twitter)" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-bold text-gray-900">X (Twitter)</p>
              <p className="text-sm text-gray-600">Follow updates</p>
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@bm_tech_solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center gap-4 min-w-[200px]"
          >
            <img src="/public/Icons/tk.png" alt="TikTok" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-bold text-gray-900">TikTok</p>
              <p className="text-sm text-gray-600">Watch videos</p>
            </div>
          </a>

          <a
            href="https://wa.me/233541574050"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center gap-4 min-w-[200px]"
          >
            <img src="/public/Icons/wp.png" alt="WhatsApp" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-bold text-gray-900">WhatsApp</p>
              <p className="text-sm text-gray-600">Chat with me</p>
            </div>
          </a>
        </div>

        <div className="text-center mt-16">
          <p className="text-blue-100 text-lg">
            Ready to start a project?
          </p>
          <a
            href="mailto:donmccody123@gmail.com"
            className="inline-block mt-4 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Send me an Email
          </a>
        </div>
      </div>
    </section>
  );
}
