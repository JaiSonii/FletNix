"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { loginUser, registerUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', age: 18 });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await loginUser({ email: formData.email, password: formData.password });
        Cookies.set('token', data.access_token);
        router.push('/');
      } else {
        await registerUser(formData);
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      alert('Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-[400px] z-10 bg-black/80 text-white border-none backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="email" placeholder="Email" 
              className="bg-[#333] border-none text-white h-12"
              onChange={(e) => setFormData({...formData, email: e.target.value})} required 
            />
            <Input 
              type="password" placeholder="Password" 
              className="bg-[#333] border-none text-white h-12"
              onChange={(e) => setFormData({...formData, password: e.target.value})} required 
            />
            {!isLogin && (
              <Input 
                type="number" placeholder="Age" 
                className="bg-[#333] border-none text-white h-12"
                onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} required 
              />
            )}
            <Button type="submit" className="w-full bg-netflixRed hover:bg-red-700 h-12 text-lg font-bold">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-gray-400 text-sm">
            <span onClick={() => setIsLogin(!isLogin)} className="text-white cursor-pointer hover:underline">
              {isLogin ? 'New to FletNix? Sign up now.' : 'Already have an account? Sign in.'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}