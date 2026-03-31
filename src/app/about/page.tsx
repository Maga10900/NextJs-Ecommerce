import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#E6FAF0] text-[#093A3E] font-sans">
      
      <Navbar />

      <main className="px-6 lg:px-12 py-10 space-y-20 lg:space-y-32">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto pt-8 animate-fade-in-up">
          <span className="inline-block bg-[#F2E8FA] text-[#8B5CF6] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 animate-fade-in-up delay-100">
            Ethereal Excellence
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#093A3E] tracking-tight mb-6 animate-fade-in-up delay-200">
            Driven by Innovation
          </h1>
          <p className="text-[#618D80] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
            We curate the future of mobility through a digital lens, blending high-end craftsmanship with technological precision.
          </p>
        </section>

        {/* Narrative Section */}
        <section className="max-w-6xl mx-auto bg-[#D5F7E6] rounded-[2.5rem] p-4 lg:p-0 flex flex-col lg:flex-row overflow-hidden shadow-sm animate-fade-in-up delay-400">
          {/* Left Visual */}
          <div className="w-full lg:w-1/2 p-6 lg:p-10">
            <div className="w-full aspect-square bg-gradient-to-br from-[#102B2E] via-[#093A3E] to-[#125345] rounded-3xl relative flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Wooden Ticket / Label */}
              <div className="relative z-10 w-40 h-28 bg-[#DDB98B] rounded-xl flex items-center justify-center transform -translate-x-6 shadow-xl border border-white/10" style={{ background: 'linear-gradient(135deg, #e3c496, #cb9f69)' }}>
                <span className="text-white font-bold text-sm tracking-widest uppercase text-center leading-tight opacity-90">
                  Digital<br/>Curator
                </span>
              </div>
              {/* White Blob */}
              <div className="absolute z-10 text-white transform translate-x-16 translate-y-2 opacity-95">
                <svg width="60" height="60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M42.7,-73.4C55.9,-67.3,67.8,-57.4,76.5,-45.1C85.2,-32.8,90.8,-18.2,90.4,-4.1C90.1,10.1,83.9,23.7,75.3,35.5C66.6,47.4,55.5,57.5,42.5,64.2C29.6,71,14.8,74.5,0.4,73.8C-14,73,-28.1,68.1,-40.4,60.5C-52.7,52.8,-63.3,42.4,-70.7,29.9C-78.2,17.4,-82.5,2.9,-81.2,-10.8C-79.8,-24.5,-72.9,-37.4,-63,-48C-53.1,-58.6,-40.2,-66.8,-26.8,-71.9C-13.5,-77,-0.4,-78.9,13.6,-76.3C27.5,-73.6,33.5,-66.5,42.7,-73.4Z" transform="translate(100 100)" />
                </svg>
                {/* Dot inside blob */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#093A3E] rounded-full transform -translate-x-1/2 -translate-y-[20%]"></div>
              </div>
            </div>
          </div>
          
          {/* Right Text */}
          <div className="w-full lg:w-1/2 p-6 lg:p-12 lg:pl-0 flex flex-col justify-center bg-white rounded-[2.5rem] lg:rounded-l-none lg:-ml-6 shadow-sm z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#093A3E] mb-6">Our Narrative</h2>
            <div className="space-y-6 text-[#618D80] text-sm lg:text-base leading-relaxed">
              <p>
                Born from a desire to redefine the luxury automotive landscape, The Digital Curator began as a collective of visionaries who saw beyond simple transactions. We believe that every vehicle tells a story of engineering prowess and personal expression.
              </p>
              <p>
                Today, we stand as the premier destination for discerning collectors, providing a seamless bridge between the physical thrill of the road and the convenience of the digital era.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-fade-in-up delay-500">
          <div className="bg-[#99F0C9] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-4xl font-bold text-[#093A3E] mb-2">10k+</span>
            <span className="text-[10px] font-bold text-[#0B5141] tracking-widest uppercase">Cars Curated</span>
          </div>
          <div className="bg-[#99F0C9] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-4xl font-bold text-[#093A3E] mb-2">98%</span>
            <span className="text-[10px] font-bold text-[#0B5141] tracking-widest uppercase">Satisfaction</span>
          </div>
          <div className="bg-[#99F0C9] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-4xl font-bold text-[#093A3E] mb-2">24h</span>
            <span className="text-[10px] font-bold text-[#0B5141] tracking-widest uppercase">Concierge</span>
          </div>
          <div className="bg-[#99F0C9] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-4xl font-bold text-[#093A3E] mb-2">15+</span>
            <span className="text-[10px] font-bold text-[#0B5141] tracking-widest uppercase">Global Hubs</span>
          </div>
        </section>

        {/* The Curator's Code */}
        <section className="max-w-6xl mx-auto animate-fade-in-up delay-600">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#093A3E] text-center mb-12">The Curator's Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#A7EBD5]/40 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#0B5141]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#093A3E] mb-3">Electric Future</h3>
              <p className="text-[#618D80] text-sm leading-relaxed">
                Leading the transition to sustainable luxury without compromising on the raw thrill of performance.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FDE6D5] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#093A3E] mb-3">Total Integrity</h3>
              <p className="text-[#618D80] text-sm leading-relaxed">
                Every vehicle undergoes a rigorous 200-point inspection curated by our master engineers.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#EBE4FF] flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#093A3E] mb-3">Digital Delight</h3>
              <p className="text-[#618D80] text-sm leading-relaxed">
                A seamless, paperless experience that respects your time and elevates your purchase journey.
              </p>
            </div>

          </div>
        </section>

        {/* The Visionaries */}
        <section className="max-w-6xl mx-auto mb-20 animate-fade-in-up delay-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div className="max-w-xl mb-6 md:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#093A3E] mb-4">The Visionaries</h2>
              <p className="text-[#618D80] text-sm leading-relaxed">
                The collective mind behind the curation of the world's finest automotive inventory.
              </p>
            </div>
            <button className="bg-[#0B5141] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#084033] hover:-translate-y-1 transition-all shadow-lg">
              Join the Collective
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Person 1 */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full mb-4 bg-gray-200 p-1">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Marcus Chen" className="w-full h-full object-cover rounded-full border-4 border-white" />
                <div className="absolute bottom-2 right-4 w-8 h-8 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </div>
              </div>
              <h4 className="font-bold text-[#093A3E] text-lg">Marcus Chen</h4>
              <p className="text-[#618D80] text-xs">Chief Curator</p>
            </div>

            {/* Person 2 */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full mb-4 bg-gray-200 p-1">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Elena Rodriguez" className="w-full h-full object-cover rounded-full border-4 border-white" />
                <div className="absolute bottom-2 right-4 w-8 h-8 rounded-full bg-[#D97706] border-2 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
              </div>
              <h4 className="font-bold text-[#093A3E] text-lg">Elena Rodriguez</h4>
              <p className="text-[#618D80] text-xs">Experience Lead</p>
            </div>

            {/* Person 3 */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full mb-4 bg-gray-200 p-1">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="David Thorne" className="w-full h-full object-cover rounded-full border-4 border-white" />
                <div className="absolute bottom-2 right-4 w-8 h-8 rounded-full bg-[#6B7280] border-2 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
              </div>
              <h4 className="font-bold text-[#093A3E] text-lg">David Thorne</h4>
              <p className="text-[#618D80] text-xs">Head of Quality</p>
            </div>

            {/* Person 4 */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full mb-4 bg-gray-200 p-1">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Sarah Jenkins" className="w-full h-full object-cover rounded-full border-4 border-white" />
                <div className="absolute bottom-2 right-4 w-8 h-8 rounded-full bg-[#4ADE80] border-2 border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>
              <h4 className="font-bold text-[#093A3E] text-lg">Sarah Jenkins</h4>
              <p className="text-[#618D80] text-xs">Global Strategy</p>
            </div>

          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-[#093A3E]/10 flex flex-col md:flex-row justify-between items-center text-xs text-[#093A3E] bg-transparent pb-10">
        <div className="font-bold mb-4 md:mb-0">
          The Digital Curator
        </div>
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="#" className="hover:text-[#0B5141] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#0B5141] transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-[#0B5141] transition-colors">Sustainability</Link>
          <Link href="#" className="hover:text-[#0B5141] transition-colors">Careers</Link>
        </div>
        <div className="text-[#618D80]">
          © 2024 The Digital Curator. Driven by Innovation.
        </div>
      </footer>
      
    </div>
  );
}
