"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Loader2,
  Lock,
  Unlock,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { handleApplicationApproval, toggleTeacherPublish, deleteTeacherAccount } from "@/actions/admin";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchApplications();

    // --- Real-time Subscription (Phase 4) ---
    const channel = supabase
      .channel('admin-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teacher_applications' },
        () => fetchApplications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url,
            phone,
            city,
            teacher_public_profiles (
              is_published
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => app.status === activeTab);

  const handleAction = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setProcessingId(id);
    // userId is no longer passed — the server action fetches it
    // from the DB using applicationId to prevent IDOR attacks.
    const res = await handleApplicationApproval(id, status);
    
    if (res.success) {
      await fetchApplications();
    } else {
      alert("حدث خطأ: " + res.error);
    }
    setProcessingId(null);
  };

  const togglePublish = async (userId: string, currentStatus: boolean) => {
    const res = await toggleTeacherPublish(userId, !currentStatus);
    if (res.success) {
      await fetchApplications();
    } else {
      alert("خطأ في تغيير حالة النشر: " + res.error);
    }
  };

  const deleteProfile = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف الملف العام لهذا المعلم؟ (سيتم سحب اعتماده أيضاً)")) return;
    
    const res = await deleteTeacherAccount(userId);
    if (res.success) {
      await fetchApplications();
      if (activeTab === 'approved') setActiveTab('rejected');
    } else {
      alert("خطأ أثناء الحذف: " + res.error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060607] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060607] text-white font-tajawal antialiased p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
           <Link href="/admin" className="hover:text-blue-500 transition-colors">لوحة التحكم</Link>
           <span>/</span>
           <span className="text-white/60">إدارة المعلمين</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Users className="text-blue-500" />
              إدارة المعلمين
            </h1>
            <p className="text-white/40">مراجعة والتحكم في طلبات الانضمام والملفات العامة.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-8 w-fit">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            الطلبات ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'approved' ? 'bg-green-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            المعتمدون ({applications.filter(a => a.status === 'approved').length})
          </button>
          <button 
            onClick={() => setActiveTab('rejected')}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'rejected' ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'text-white/40 hover:text-white'}`}
          >
            المرفوضون
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => (
              <motion.div 
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="group bg-white/5 border border-white/10 hover:border-white/20 rounded-[28px] p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                      {app.profiles?.avatar_url && (
                        <img src={app.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{app.profiles?.full_name}</h3>
                      <p className="text-sm text-white/40">{app.profiles?.email}</p>
                    </div>
                  </div>

                  <div className="flex-1 lg:px-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-blue-400 font-bold">{app.subject}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-sm text-white/60">{app.years_of_experience} سنوات خبرة</span>
                    </div>
                    <p className="text-xs text-white/40 line-clamp-1">{app.bio}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                      href={app.certificates_url} 
                      target="_blank" 
                      className="p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/60 flex items-center gap-2 text-xs"
                    >
                      <FileText className="w-4 h-4" />
                      الشهادة
                    </a>

                    {activeTab === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(app.id, 'approved')}
                          disabled={processingId === app.id}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          اعتماد
                        </button>
                        <button 
                          onClick={() => handleAction(app.id, 'rejected')}
                          disabled={processingId === app.id}
                          className="bg-white/5 hover:bg-white/10 text-white/60 px-5 py-2.5 rounded-xl text-sm font-bold border border-white/10 flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </button>
                      </div>
                    )}

                    {activeTab === 'approved' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => togglePublish(app.user_id, app.profiles?.teacher_public_profiles?.[0]?.is_published)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                            app.profiles?.teacher_public_profiles?.[0]?.is_published 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20' 
                            : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                          }`}
                        >
                          {app.profiles?.teacher_public_profiles?.[0]?.is_published ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          {app.profiles?.teacher_public_profiles?.[0]?.is_published ? 'تجميد' : 'تنشيط'}
                        </button>
                        <button 
                          onClick={() => deleteProfile(app.user_id)}
                          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      </div>
                    )}

                    {activeTab === 'rejected' && (
                      <button 
                        onClick={() => handleAction(app.id, 'pending')}
                        className="text-white/20 hover:text-blue-400 text-xs transition-all underline"
                      >
                        إعادة للمراجعة
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredApps.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/10 border-dashed">
              <p className="text-white/40">لا توجد طلبات في هذا القسم.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
