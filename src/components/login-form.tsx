'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { toast } from 'sonner';
import { loginSchema, type BaseLogin } from '@/core/domains/schemas';
import { InputField, PasswordField } from '@/shared';
import { useSession } from '@/shared/hooks/session-provider';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { signIn } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<BaseLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoading = isSubmitting || isSocialLoading;

  const onSubmit = async (data: BaseLogin) => {
    setAuthError(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { error: signInError } = await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: `${origin}/`,
    });

    if (signInError) {
      const msg = signInError.message || 'Invalid email or password';
      setAuthError(msg);
      toast.error(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    setAuthError(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { error: signInError } = await signIn.social({
      provider: 'google',
      callbackURL: `${origin}/`,
    });

    if (signInError) {
      const msg = signInError.message || 'Failed to sign in with Google';
      setAuthError(msg);
      toast.error(msg);
      setIsSocialLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <InputField
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="m@example.com"
                disabled={isLoading}
              />
              <PasswordField
                control={control}
                name="password"
                label="Password"
                labelAccessory={
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm font-normal underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                }
                disabled={isLoading}
              />
              {authError && <FieldError errors={[{ message: authError }]} />}
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
