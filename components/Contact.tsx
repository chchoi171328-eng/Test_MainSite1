import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-brand-dark text-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Contact Info */}
          <div>
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-2 block">Contact Us</span>
            <h2 className="text-4xl font-serif font-bold mb-8">상담 안내</h2>
            <p className="text-gray-400 mb-12 leading-relaxed">
              법적 문제로 고민하고 계신가요? <br />
              법무법인 명의 전문가들이 당신의 편에서 함께하겠습니다.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="bg-brand-gold/20 p-3 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Office</h4>
                  <p className="text-gray-400 font-light group-hover:text-white transition-colors">
                    경기도 평택시 평남로 1029-1, <br />
                    SJ프라자 5층
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-brand-gold/20 p-3 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Phone</h4>
                  <p className="text-gray-400 font-light group-hover:text-white transition-colors">031-658-6100</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-brand-gold/20 p-3 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Email</h4>
                  <p className="text-gray-400 font-light group-hover:text-white transition-colors">sllaw@sllaw.co.kr</p>
                </div>
              </div>
              
               <div className="flex items-start gap-4 group">
                <div className="bg-brand-gold/20 p-3 rounded-full text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Hours</h4>
                  <p className="text-gray-400 font-light group-hover:text-white transition-colors">평일: 09:00 - 18:00</p>
                  <p className="text-gray-400 font-light group-hover:text-white transition-colors">주말/공휴일: 예약제 운영</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map Section */}
          <div className="h-80 md:h-[500px] w-full bg-gray-200 rounded-sm overflow-hidden relative shadow-2xl border-4 border-white/5">
             <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?q=경기도+평택시+평남로+1029-1&hl=ko&z=17&output=embed"
                className="filter grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                title="Office Location"
             >
             </iframe>
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-sm shadow-md text-brand-dark pointer-events-none hidden md:block">
                <p className="font-bold text-sm">법무법인 명 (SOL & LUNA)</p>
                <p className="text-xs text-gray-600">경기도 평택시 평남로 1029-1</p>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};