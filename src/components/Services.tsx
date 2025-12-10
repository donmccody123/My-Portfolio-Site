import {
  FileText,
  Award,
  BookOpen,
  Flag,
  Shirt,
  Sparkles,
  Printer,
  HardDrive,
} from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Flyer Design',
    description: 'Eye-catching flyers that grab attention and deliver your message effectively.',
  },
  {
    icon: Award,
    title: 'Logo Design',
    description: 'Memorable logos that represent your brand identity and values.',
  },
  {
    icon: BookOpen,
    title: 'Brochure Design',
    description: 'Professional brochures that showcase your business beautifully.',
  },
  {
    icon: Flag,
    title: 'Banner Design',
    description: 'Impactful banners for events, promotions, and advertising campaigns.',
  },
  {
    icon: Shirt,
    title: 'T-Shirt Design',
    description: 'Creative t-shirt designs that stand out and make a statement.',
  },
  {
    icon: Sparkles,
    title: 'Branding',
    description: 'Complete branding solutions to establish your unique market presence.',
  },
  {
    icon: Printer,
    title: 'Printing Services',
    description: 'High-quality printing and customization for all your needs.',
  },
  {
    icon: HardDrive,
    title: 'Software & Hardware',
    description: 'Professional installation services for software and hardware systems.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Services I Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to execution, I provide comprehensive design and technical services
            to bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-4 inline-block mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
