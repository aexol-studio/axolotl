import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { query, mutation, subscription, todoSelector, type TodoType } from '@/api';
import { useAuthStore } from '@/stores';

import { changePasswordSchema, type ChangePasswordValues } from '../../Examples.schema';

export const useGraphQLShowcase = () => {
  // --- Auth ---
  const token = useAuthStore((s) => s.token);

  // --- Change Password ---
  const changePasswordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '' },
  });

  const onChangePasswordSubmit = async (values: ChangePasswordValues) => {
    try {
      await mutation()({
        user: { changePassword: [{ newPassword: values.password }, true] },
      });
      toast.success('Password changed successfully!');
      changePasswordForm.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      toast.error(message);
    }
  };

  // --- User Query Demo ---
  const [userData, setUserData] = useState<{ _id: string; username: string } | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsUserLoading(true);
    setUserError(null);
    try {
      const data = await query()({
        user: { me: { _id: true, username: true } },
      });
      setUserData(data.user?.me ?? null);
      toast.success('Profile fetched successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setUserError(message);
      toast.error(message);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  // --- Todos Query Demo ---
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [isTodosLoading, setIsTodosLoading] = useState(false);
  const [todosError, setTodosError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsTodosLoading(true);
    setTodosError(null);
    try {
      const data = await query()({
        user: { todos: todoSelector },
      });
      setTodos(data.user?.todos ?? []);
      toast.success(`Fetched ${data.user?.todos?.length ?? 0} todos`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos';
      setTodosError(message);
      toast.error(message);
    } finally {
      setIsTodosLoading(false);
    }
  }, []);

  // --- Countdown Subscription ---
  const [startFrom, setStartFrom] = useState(10);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [isCountdownDone, setIsCountdownDone] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countdownSubRef = useRef<any>(null);

  const cleanupCountdown = useCallback(() => {
    if (countdownSubRef.current) {
      countdownSubRef.current.close();
      countdownSubRef.current = null;
    }
  }, []);

  useEffect(() => cleanupCountdown, [cleanupCountdown]);

  const startCountdown = useCallback(() => {
    cleanupCountdown();
    setCurrentValue(startFrom);
    setIsCountdownRunning(true);
    setIsCountdownDone(false);

    try {
      const sub = subscription()({
        countdown: [{ from: startFrom }, true],
      });

      sub.on((data) => {
        const value = (data as { countdown: number }).countdown;
        setCurrentValue(value);
        if (value <= 0) {
          setIsCountdownRunning(false);
          setIsCountdownDone(true);
        }
      });

      sub.error((err: unknown) => {
        console.error('[CountdownDemo] Subscription error:', err);
        setIsCountdownRunning(false);
        toast.error('Countdown subscription failed');
      });

      sub.off(() => {
        setIsCountdownRunning(false);
      });

      sub.open();
      countdownSubRef.current = sub;
    } catch (err) {
      console.error('[CountdownDemo] Failed to start subscription:', err);
      setIsCountdownRunning(false);
      toast.error('Failed to start countdown');
    }
  }, [startFrom, cleanupCountdown]);

  const stopCountdown = useCallback(() => {
    cleanupCountdown();
    setIsCountdownRunning(false);
  }, [cleanupCountdown]);

  const countdownProgress = currentValue !== null && startFrom > 0 ? ((startFrom - currentValue) / startFrom) * 100 : 0;

  // --- AI Chat Subscription ---
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiStreaming, setIsAiStreaming] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiSubRef = useRef<any>(null);

  const cleanupAiChat = useCallback(() => {
    if (aiSubRef.current) {
      aiSubRef.current.close();
      aiSubRef.current = null;
    }
  }, []);

  useEffect(() => cleanupAiChat, [cleanupAiChat]);

  const sendAiMessage = useCallback(() => {
    if (!aiMessage.trim()) return;

    cleanupAiChat();
    setAiResponse('');
    setIsAiStreaming(true);
    setAiError(null);

    try {
      const sub = subscription()({
        aiChat: [{ messages: [{ role: 'user', content: aiMessage.trim() }] }, { content: true, done: true }],
      });

      let accumulated = '';

      sub.on((data) => {
        const chunk = (data as { aiChat: { content: string; done: boolean } }).aiChat;
        if (chunk.content) {
          accumulated += chunk.content;
          setAiResponse(accumulated);
        }
        if (chunk.done) {
          setIsAiStreaming(false);
        }
      });

      sub.error((err: unknown) => {
        console.error('[AiChatDemo] Subscription error:', err);
        setIsAiStreaming(false);
        setAiError('AI endpoint not configured or unavailable.');
      });

      sub.off(() => {
        setIsAiStreaming(false);
      });

      sub.open();
      aiSubRef.current = sub;
    } catch (err) {
      console.error('[AiChatDemo] Failed to start subscription:', err);
      setIsAiStreaming(false);
      setAiError('AI endpoint not configured or unavailable.');
    }
  }, [aiMessage, cleanupAiChat]);

  const stopAiStreaming = useCallback(() => {
    cleanupAiChat();
    setIsAiStreaming(false);
  }, [cleanupAiChat]);

  return {
    // Auth
    token,
    // Change password
    changePasswordForm,
    onChangePasswordSubmit,
    // User query
    userData,
    isUserLoading,
    userError,
    fetchProfile,
    // Todos query
    todos,
    isTodosLoading,
    todosError,
    fetchTodos,
    // Countdown subscription
    startFrom,
    setStartFrom,
    currentValue,
    isCountdownRunning,
    isCountdownDone,
    startCountdown,
    stopCountdown,
    countdownProgress,
    // AI chat subscription
    aiMessage,
    setAiMessage,
    aiResponse,
    isAiStreaming,
    aiError,
    sendAiMessage,
    stopAiStreaming,
  };
};
