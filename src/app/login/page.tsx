"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loginEmail = formData.identifier.includes("@")
        ? formData.identifier.trim()
        : `${formData.identifier.trim()}@murtaqa.com`.toLowerCase();

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: formData.password,
      });
      if (loginError) throw loginError;
      if (data.user) { router.push("/dashboard"); router.refresh(); }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل تسجيل الدخول";
      if (msg.includes("Invalid login")) setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex font-tajawal antialiased text-white" dir="rtl">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute top-[20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 text-center px-16">
          <div className="relative h-20 w-56 mx-auto mb-8">
            <Image src="/logos/Profile-Photoroom.png" alt="مرتقى" fill className="object-contain" />
          </div>
          <h2 className="text-3xl font-black mb-4">مرحباً بعودتك!</h2>
          <p className="text-white/40 text-lg leading-relaxed max-w-md mx-auto">
            سجّل دخولك للمتابعة في رحلتك التعليمية مع أفضل المعلمين في المملكة.
          </p>
          <div className="flex items-center justify-center gap-8 mt-12">
            {[
              { val: "+90", label: "معلم معتمد" },
              { val: "+1200", label: "طالب مسجل" },
              { val: "4.9★", label: "تقييم" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-blue-400">{s.val}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12  ">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="relative h-14 w-48 mx-auto mb-2">
              <Image src="/logos/Profile-Photoroom.png" alt="مرتقى" fill className="object-contain" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black mb-2">تسجيل الدخول</h1>
            <p className="text-white/40 text-sm">أدخل بياناتك للوصول إلى حسابك</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Google */}
          <button type="button" onClick={handleGoogleLogin} disabled={loading}
            className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-bold">الدخول باستخدام جوجل</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <span className="relative px-4 text-white/20 bg-[#0a0a0b] text-[10px] uppercase tracking-widest">أو</span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input required name="identifier" value={formData.identifier} onChange={handleInputChange} type="text"
                  placeholder="example@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 pl-12 outline-none focus:border-blue-500/50 transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input required name="password" value={formData.password} onChange={handleInputChange} type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 pl-12 outline-none focus:border-blue-500/50 transition-all text-sm" />
              </div>
            </div>

            <button disabled={loading} type="submit"
              className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تسجيل الدخول"}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-sm text-white/40">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-blue-400 hover:underline font-bold">إنشاء حساب جديد</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
