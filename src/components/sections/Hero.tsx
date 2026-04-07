"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, GraduationCap, Star, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-32 lg:pt-30 pb-12 lg:pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(195,90,40,0.05),transparent_50%)]" />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 md:-mr-48" 
        />
        <motion.div 
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-0 w-72 h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-[100px] -ml-32 md:-ml-48" 
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right"
          >


            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-foreground leading-[1.2] mb-6 sm:mb-8">
              درس أبنائك مع <br className="hidden sm:block" />
              <span className="text-primary glow-text">أفضل المدرسين</span> <br className="sm:hidden" />
              الخصوصيين في <span className="text-accent relative inline-block">السعودية <div className="absolute -bottom-2 right-0 w-full h-1 bg-accent/30 rounded-full blur-[1px]" /></span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-xl mx-auto lg:ml-auto lg:mr-0 text-center lg:text-right leading-relaxed">
              نضمن لك أفضل الكوادر التعليمية المعتمدة لمتابعة أكاديمية مستمرة ونتائج مضمونة <span className="text-foreground font-black">100%</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 sm:mb-16 justify-center lg:justify-end px-4 sm:px-0">
              <Button 
                onClick={() => { 
                  window.dispatchEvent(new CustomEvent('teacherSelected', { detail: { name: '', subject: '' } }));
                  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); 
                }}
                size="lg" 
                className="hidden sm:flex group relative rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-black bg-primary hover:bg-primary/90 shadow-[0_20px_50px_-15px_rgba(199,90,48,0.4)] transition-all hover:translate-y-[-4px] active:translate-y-[0px] overflow-hidden cursor-pointer w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
                <CalendarCheck className="ml-3 w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                <span className="relative z-10">اضمن مستقبل ابنك</span>
              </Button>
              <Button 
                onClick={() => { document.getElementById("teachers")?.scrollIntoView({ behavior: "smooth" }); }}
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-black bg-primary sm:bg-transparent text-primary-foreground sm:text-foreground border-primary sm:border-primary/30 hover:bg-primary/90 sm:hover:bg-primary/5 shadow-[0_15px_40px_-10px_rgba(199,90,48,0.4)] sm:shadow-none cursor-pointer w-full sm:w-auto backdrop-blur-sm transition-all"
              >
                <GraduationCap className="ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                تصفح المدرسين
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-foreground">+70</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">مدرس خبير</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl sm:text-3xl font-black text-foreground">+1200</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">طالب مستفيد</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-foreground">4.9</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
                  تقييم الأهالي <Star className="w-3 h-3 fill-accent text-accent" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:block mx-auto w-full max-w-lg mt-8 lg:mt-0"
          >
            <div className="relative z-10 p-4 min-h-[350px] sm:min-h-[450px] max-h-[500px] lg:max-h-[600px] flex items-center justify-center">
              {/* Main Decorative Base */}
              <div className="absolute w-[70%] h-[70%] lg:w-[80%] lg:h-[80%] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-full border border-primary/20 shadow-[0_0_80px_rgba(199,90,48,0.15)] overflow-hidden animate-[pulse_4s_easeInOut_infinite]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(199,90,48,0.2),transparent_70%)]" />
              </div>
              
              {/* Complex Rotating Rings */}
              <div className="absolute w-[90%] h-[90%] lg:w-[100%] lg:h-[100%] border border-primary/10 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-[80%] h-[80%] lg:w-[90%] lg:h-[90%] border border-accent/10 rounded-full animate-[spin_25s_linear_infinite_reverse] border-dashed" />
              
              {/* The Image (Emerging) */}
              <div className="relative z-20 w-full h-full flex items-end justify-center pt-8 overflow-hidden pointer-events-none">
                <motion.img
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                  src="/assets/imgs/male-Photoroom.png"
                  alt="BeboCademy Education"
                  className="w-auto h-auto max-h-[350px] sm:max-h-[450px] lg:max-h-[550px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] z-20"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=2070";
                  }}
                />
              </div>

              {/* Floating Status Cards */}
              <motion.div
                 animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute top-10 -right-4 sm:-right-8 z-30 bg-card/80 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">تقييم ممتاز</div>
                  <div className="text-xs sm:text-sm font-black text-foreground">4.9/5.0</div>
                </div>
              </motion.div>

              <motion.div
                 animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                 transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                 className="absolute bottom-20 -left-4 sm:-left-12 z-30 bg-card/80 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] sm:text-xs text-muted-foreground">متاح الآن</div>
                  <div className="text-xs sm:text-sm font-black text-foreground">احجز جلستك</div>
                </div>
              </motion.div>

              {/* Decorative Glows */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-primary/30 blur-[40px] -z-10" />
            </div>

            {/* Extra Background shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] -z-10 opacity-30">
               <div className="absolute inset-0 border border-primary/10 rounded-full animate-[spin_35s_linear_infinite]" />
               <div className="absolute inset-x-20 inset-y-10 border border-accent/10 rounded-3xl rotate-45 animate-[pulse_8s_easeInOut_infinite]" />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary/40 animate-bounce cursor-pointer opacity-0 lg:opacity-100 transition-opacity"
           onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">اكتشف المزيد</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
