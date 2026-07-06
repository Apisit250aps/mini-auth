'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

import { signupSchema, type BaseSignup } from '@/core/domains/schemas';
import { InputField, PasswordField } from '@/shared';
import { useSession } from '@/shared/hooks/session-provider';

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { signUp, signIn } = useSession();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<BaseSignup>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isLoading = isSubmitting || isSocialLoading;

  const onSubmit = async (data: BaseSignup) => {
    setAuthError(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { error: signUpError } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: `${origin}/`,
    });

    if (signUpError) {
      const msg = signUpError.message || 'An error occurred during sign up.';
      setAuthError(msg);
      toast.error(msg);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSocialLoading(true);
    setAuthError(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { error: signUpError } = await signIn.social({
      provider: 'google',
      callbackURL: `${origin}/`,
    });

    if (signUpError) {
      const msg = signUpError.message || 'Failed to sign up with Google';
      setAuthError(msg);
      toast.error(msg);
      setIsSocialLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputField
              control={control}
              name="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
            />
            <InputField
              control={control}
              name="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              description="We'll use this to contact you. We will not share your email with anyone else."
              disabled={isLoading}
            />
            <PasswordField
              control={control}
              name="password"
              label="Password"
              description="Must be at least 8 characters long."
              disabled={isLoading}
            />
            <PasswordField
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              description="Please confirm your password."
              disabled={isLoading}
            />
            {authError && <FieldError errors={[{ message: authError }]} />}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                >
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
