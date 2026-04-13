"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  ClipboardList, 
  ChevronRight,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();

    // --- Real-time Stats Updates ---
    const channel = supabase
      .channel('admin-stats-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teacher_applications' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('teacher_applications').select('status');
    if (!error && data) {
      setStats({
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        approved: data.filter(a => a.status === 'approved').length,
        rejected: data.filter(a => a.status === 'rejected').length,
      });
    }
    setLoading(false);
  };

  const menuItems = [
    {
      title: "طلبات الانضمام",
      desc: "مراجعة واعتماد المعلمين الجدد",
      icon: <UserPlus className="w-6 h-6 text-blue-500" />,
      link: "/admin/applications",
      count: stats.pending,
      highlight: true
    },
    {
      title: "قائمة المعلمين",
      desc: "إدارة وتعديل بيانات المعلمين الحاليين",
      icon: <Users className="w-6 h-6 text-purple-500" />,
      link: "/admin/teachers",
      count: stats.approved
    },
    {
      title: "سجل الإشعارات",
      desc: "تتبع الحجوزات والعمليات الأخيرة",
      icon: <Bell className="w-6 h-6 text-emerald-500" />,
      link: "/admin/notifications",
      highlight: true
    },
    {
      title: "الإعدادات",
      desc: "ضبط إعدادات المنصة والعمولات",
      icon: <Settings className="w-6 h-6 text-orange-500" />,
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-[#060607] text-white font-tajawal antialiased p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <ShieldCheck className="text-blue-500 w-10 h-10" />
              لوحة تحكم الإدارة
            </h1>
            <p className="text-white/40">مرحباً بك في مركز إدارة أكاديمية مرتقى.</p>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                <p className="text-[10px] text-white/40 uppercase">حالة النظام</p>
                <p className="text-sm font-bold text-green-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  يعمل بكفاءة
                </p>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "إجمالي الطلبات", val: stats.total, icon: <BarChart3 className="w-4 h-4" /> },
            { label: "قيد الانتظار", val: stats.pending, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "تم قبولهم", val: stats.approved, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "مرفوضين", val: stats.rejected, color: "text-red-500", bg: "bg-red-500/10" },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-[28px] relative overflow-hidden"
            >
              <p className="text-sm text-white/40 mb-1">{s.label}</p>
              <p className={`text-4xl font-black ${s.color || "text-white"}`}>{loading ? "..." : s.val}</p>
              {s.bg && <div className={`absolute top-0 right-0 w-24 h-24 ${s.bg} blur-3xl -z-10`} />}
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, i) => (
            <Link href={item.link} key={i}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group p-8 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between ${
                  item.highlight 
                  ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.highlight ? "bg-white/20" : "bg-white/5"}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className={`text-sm ${item.highlight ? "text-white/70" : "text-white/40"}`}>{item.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {item.count !== undefined && !loading && (
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${item.highlight ? "bg-white text-blue-600" : "bg-white/5 text-white/60"}`}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className={`w-6 h-6 ${item.highlight ? "text-white" : "text-white/20"} group-hover:translate-x-[-4px] transition-transform`} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
