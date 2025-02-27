'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import loadImage from '@/public/loading.gif';
import Image from 'next/image';


const signInWithToken = async (token: string) => {
  const result = await signIn('credentials', { token, redirect: false });
  if (!result?.error) {
    return result;
  } else {
    throw new Error(result.error);
  }
};

const OAuthContent = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [message, setMessage] = useState('Carregando...');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutate, isPending } = useMutation({
    mutationFn: signInWithToken,
    onSuccess: () => {
      setMessage('Login efetuado com sucesso! redirecionando');
      window.location.href = '/home';
    },
    onError: () => {
      toast.error('Erro ao efetuar login, por favor tente novamente!');
      router.push('/login');
    },
  });

  useEffect(() => {
    if (token && !session) {
      mutate(token);
    }
  }, [token, session, mutate]);

  if (!token) {
    toast.error('Erro ao efetuar login, por favor tente novamente!');
    router.push('/login');
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {isPending ? <Image src={loadImage.src} alt="Carregando..." /> : message}
    </div>
  );
};

const OAuthPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <img src={loadImage.src} alt="Carregando..." />
        </div>
      }
    >
      <OAuthContent />
    </Suspense>
  );
};

export default OAuthPage;
