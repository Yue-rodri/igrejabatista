import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User } from '@/entities/User';
import {
  LogIn,
  Eye,
  EyeOff,
  UserPlus,
  Church,
  Mail,
  Lock,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AuthForm({ onLoginSuccess }) {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showAniversario, setShowAniversario] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const loggedUser = await User.login(email, password);
      onLoginSuccess?.(loggedUser);
    } catch (err) {
      const apiMsg = err.response?.data?.error;
      setError(apiMsg || 'Credenciais inválidas ou servidor indisponível.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await User.register({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        data_nascimento: birthDate || null,
        show_in_aniversariantes: showAniversario,
      });
      setMessage('Conta criada com sucesso! Faça login para continuar.');
      setView('login');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Erro ao registrar. Verifique os dados informados.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setError(null);
    setMessage(null);
    setShowPassword(false);
  };

  return (
    <div className="flex flex-col text-white">
      {/* Identidade Visual IBPJ */}
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B89416] flex items-center justify-center mx-auto mb-3 shadow-gold">
          <Church className="w-7 h-7 text-[#001B30]" />
        </div>
        <h2 className="text-xl font-extrabold text-white">
          {view === 'login' ? 'Bem-vindo de volta' : 'Criar conta na IBPJ'}
        </h2>
        <p className="text-xs text-white/65 mt-1">
          {view === 'login'
            ? 'Acesse sua conta de membro ou administração'
            : 'Faça parte da comunidade digital da Igreja Batista Parque Jandaia'}
        </p>
      </div>

      {/* Seletor de Modo (Login / Cadastro) */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-5">
        <button
          type="button"
          onClick={() => switchView('login')}
          className={`h-10 rounded-xl text-xs font-bold transition-all ${
            view === 'login'
              ? 'bg-[#D4AF37] text-[#001B30] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => switchView('register')}
          className={`h-10 rounded-xl text-xs font-bold transition-all ${
            view === 'register'
              ? 'bg-[#D4AF37] text-[#001B30] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Criar Conta
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login_email" className="text-xs font-semibold text-white/80">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="login_email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seuemail@exemplo.com"
                className="h-12 pl-10 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login_password" className="text-xs font-semibold text-white/80">
              Senha
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="login_password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite sua senha"
                className="h-12 pl-10 pr-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
              <button
                type="button"
                aria-label="Alternar visibilidade da senha"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-[#D4AF37]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl btn-gold text-sm font-bold mt-2"
          >
            {isLoading ? (
              'Autenticando...'
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar na Conta
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <Label htmlFor="reg_fullname" className="text-xs font-semibold text-white/80">
              Nome Completo
            </Label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg_fullname"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Seu nome completo"
                className="h-11 pl-10 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="reg_email" className="text-xs font-semibold text-white/80">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg_email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seuemail@exemplo.com"
                className="h-11 pl-10 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="reg_birthdate" className="text-xs font-semibold text-white/80">
              Data de Nascimento
            </Label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg_birthdate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="h-11 pl-10 rounded-xl bg-white/10 border-white/20 text-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="reg_password" className="text-xs font-semibold text-white/80">
              Senha
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="reg_password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
                className="h-11 pl-10 pr-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
              />
              <button
                type="button"
                aria-label="Alternar visibilidade da senha"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-[#D4AF37]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/15 p-3.5 rounded-2xl">
            <div className="min-w-0">
              <Label htmlFor="show-aniversario" className="text-xs font-semibold text-white block">
                Aparecer nos Aniversariantes do Mês?
              </Label>
              <span className="text-[11px] text-white/55 block mt-0.5">
                Exibe apenas seu nome e dia/mês para a igreja celebrar com você.
              </span>
            </div>
            <Switch
              id="show-aniversario"
              checked={showAniversario}
              onCheckedChange={setShowAniversario}
              className="data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-white/20 flex-shrink-0"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl btn-gold text-sm font-bold mt-1"
          >
            {isLoading ? (
              'Registrando...'
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Concluir Cadastro
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
