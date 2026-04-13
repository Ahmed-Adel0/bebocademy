"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  MapPin, 
  BookOpen, 
  Users, 
  Award, 
  ArrowRight,
  Loader2,
  Send,
  CheckCircle2,
  Calendar,
  DollarSign,
  Bell
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createBooking } from "@/actions/bookings";

export default function TeacherProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: teacherId } = use(params);
  const [teacher, setTeacher] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // New Review Form State
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Teacher Profile
      const { data: profile, error: pError } = await supabase
        .from('teacher_public_profiles')
        .select(`
          *,
          profiles:teacher_id (
            full_name,
            avatar_url
          )
        `)
        .eq('teacher_id', teacherId)
        .single();

      if (pError) throw pError;
      setTeacher(profile);

      // 2. Fetch Reviews (Phase 2)
      const { data: revs } = await supabase
        .from('reviews')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });
      
      setReviews(revs || []);

      // 3. Fetch Bookings Count (Phase 3)
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', teacherId);
      
      setBookingCount(count || 0);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          teacher_id: teacherId,
          student_name: reviewForm.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });
      
      if (error) throw error;
      setReviewForm({ name: "", rating: 5, comment: "" });
      fetchTeacherData(); // Refresh reviews and average
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      const res = await createBooking(teacherId, teacher.profiles?.full_name);
      
      if (!res.success) throw new Error(res.error);
      
      alert("تم إرسال طلب الحجز بنجاح! سيتواصل معك المعلم قريباً.");
      fetchTeacherData(); // Refresh count
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  // Calculate Average Rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 5.0;

  if (loading) return (
    <div className="min-h-screen bg-[#060607] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
    </div>
  );

  if (!teacher) return <div className="min-h-screen bg-[#060607] flex items-center justify-center text-white">المعلم غير موجود</div>;

  return (
    <div className="min-h-screen bg-[#060607] text-white font-tajawal antialiased pb-20" dir="rtl">
      
      {/* Hero Header */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-[#060607] z-10" />
        <div className="absolute inset-0 bg-[url('/assets/imgs/grid.png')] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Right Sidebar: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0f0f11] border border-white/10 p-8 rounded-[40px] text-center shadow-2xl">
              <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden border-4 border-blue-500/20 mb-6 relative group">
                <Image 
                  src={teacher.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${teacher.profiles?.full_name}&background=random&color=fff`} 
                  alt={teacher.profiles?.full_name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl font-black mb-2">{teacher.profiles?.full_name}</h1>
              <div className="flex items-center justify-center gap-2 mb-6 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-white/20 text-xs">({reviews.length} تقييم)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <span className="block text-lg font-black">{bookingCount}</span>
                  <span className="text-[10px] text-white/40 uppercase">طالب حجز</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <span className="block text-lg font-black">{teacher.hourly_rate}</span>
                  <span className="text-[10px] text-white/40 uppercase">ريال / ساعة</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                احجز درسك الآن
              </button>
            </div>

            {/* Teaching Locations */}
            <div className="bg-[#0f0f11] border border-white/10 p-8 rounded-[40px]">
              <h3 className="flex items-center gap-3 font-bold mb-6">
                <MapPin className="w-5 h-5 text-red-500" />
                أماكن التغطية في تبوك
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.districts?.map((d: string) => (
                  <span key={d} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs">{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About & Bio */}
            <div className="bg-[#0f0f11] border border-white/10 p-10 rounded-[40px]">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-500" />
                النبذة التعريفية والتخصص العلمي
              </h2>
              <div className="flex flex-wrap gap-3 mb-8">
                {teacher.subjects?.map((s: string) => (
                  <span key={s} className="px-5 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full font-bold">{s}</span>
                ))}
              </div>
              <p className="text-white/60 leading-relaxed text-lg whitespace-pre-wrap">{teacher.bio}</p>
            </div>

            {/* Certificates Gallery (from Phase 1) */}
            {teacher.certificates?.length > 0 && (
              <div className="bg-[#0f0f11] border border-white/10 p-10 rounded-[40px]">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  معرض الشهادات والخبرات
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {teacher.certificates.map((url: string, idx: number) => (
                    <a key={idx} href={url} target="_blank" rel="noreferrer" className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500 transition-all group">
                      <Image src={url} alt="Certificate" fill className="object-cover group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section (Phase 2) */}
            <div className="space-y-6">
               <h2 className="text-xl font-black flex items-center gap-3 px-4">
                 <Star className="w-6 h-6 text-yellow-500" />
                 تقييمات أولياء الأمور والطلاب
               </h2>

               {/* Review Form */}
               <form onSubmit={submitReview} className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs text-white/40 px-2 font-bold uppercase">اسم الطالب أو ولي الأمر</label>
                       <input 
                         required
                         type="text" 
                         value={reviewForm.name}
                         onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                         placeholder="أدخل اسمك هنا..."
                         className="w-full bg-[#060607] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-white/40 px-2 font-bold uppercase">التقييم (1 - 5 نجوم)</label>
                       <select 
                         value={reviewForm.rating}
                         onChange={e => setReviewForm(p => ({ ...p, rating: parseInt(e.target.value) }))}
                         className="w-full bg-[#060607] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all appearance-none"
                       >
                         {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} نجوم</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-white/40 px-2 font-bold uppercase">رسالة التقييم أو التعليق</label>
                    <textarea 
                      required
                      rows={3}
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                      placeholder="كيف كانت تجربة التدريس مع هذا المعلم؟"
                      className="w-full bg-[#060607] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                 </div>
                 <button 
                   type="submit" 
                   disabled={submittingReview}
                   className="bg-white text-black px-8 py-3 rounded-xl font-black flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
                 >
                   {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                   إرسال التقييم
                 </button>
               </form>

               {/* Reviews List */}
               <div className="space-y-4">
                 {reviews.map((rev) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={rev.id} 
                     className="bg-[#0f0f11] border border-white/5 p-6 rounded-3xl"
                   >
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500">
                             {rev.student_name[0]}
                           </div>
                           <div>
                              <h4 className="font-bold text-sm">{rev.student_name}</h4>
                              <p className="text-[10px] text-white/20">{new Date(rev.created_at).toLocaleDateString('ar-EG')}</p>
                           </div>
                        </div>
                        <div className="flex text-yellow-500">
                           {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                     </div>
                     <p className="text-sm text-white/60 leading-relaxed font-medium mb-4">{rev.comment}</p>
                     
                     {rev.teacher_reply && (
                       <div className="mt-4 bg-blue-500/5 border-r-4 border-blue-500 p-5 rounded-2xl">
                         <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase mb-2">رد المعلم</div>
                         <p className="text-sm text-white/80 leading-relaxed">{rev.teacher_reply}</p>
                       </div>
                     )}
                   </motion.div>
                 ))}
                 
                 {reviews.length === 0 && (
                   <div className="text-center py-12 text-white/20 border-2 border-dashed border-white/5 rounded-[40px]">
                      لا توجد تقييمات بعد. كن أول من يقييم!
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
