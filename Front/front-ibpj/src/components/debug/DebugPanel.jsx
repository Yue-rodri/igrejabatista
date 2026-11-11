import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/entities/User';
import { Evento } from '@/entities/Evento';
import { Postagem } from '@/entities/Postagem';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trash2,
  Edit,
  Calendar,
  Sparkles,
  Users,
  CheckCircle2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/shared/GlassPrimitives';
import { formatLocalDate } from '@/utils';

export default function DebugPanel({ closePanel }) {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusBanner, setStatusBanner] = useState(null);
  const navigate = useNavigate();

  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    type: null,
    id: null,
    label: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [usersData, eventsData, postsData] = await Promise.all([
        User.listAll().catch(() => []),
        Evento.list().catch(() => []),
        Postagem.list().catch(() => []),
      ]);
      setUsers(usersData);
      setEvents(eventsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Falha ao carregar dados administrativos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg, isError = false) => {
    setStatusBanner({ message: msg, isError });
    setTimeout(() => setStatusBanner(null), 3500);
  };

  const handleNavigate = (path) => {
    navigate(path);
    closePanel?.();
  };

  const handleDeleteRequest = (type, id, label) => {
    setDeleteAlert({ isOpen: true, type, id, label });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteAlert;
    try {
      if (type === 'usuário') await User.deleteUser(id);
      if (type === 'evento') await Evento.delete(id);
      if (type === 'postagem') await Postagem.delete(id);

      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} excluído com sucesso.`);
      await loadAllData();
    } catch {
      showToast(`Não foi possível excluir o ${type}.`, true);
    } finally {
      setDeleteAlert({ isOpen: false, type: null, id: null, label: '' });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await User.updateRole(userId, newRole);
      showToast('Permissão do usuário atualizada!');
      await loadAllData();
    } catch {
      showToast('Falha ao atualizar permissão.', true);
    }
  };

  const handleEdit = (type, id) => {
    if (type === 'evento') navigate(`/eventos?edit=${id}`);
    if (type === 'postagem') navigate(`/programacao?edit=${id}`);
    closePanel?.();
  };

  return (
    <div className="text-white space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-2 flex-1 text-center">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg font-extrabold text-[#D4AF37]">{events.length}</div>
            <div className="text-[11px] text-white/65">Eventos</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg font-extrabold text-[#D4AF37]">{posts.length}</div>
            <div className="text-[11px] text-white/65">Postagens</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg font-extrabold text-[#D4AF37]">{users.length}</div>
            <div className="text-[11px] text-white/65">Membros</div>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={loadAllData}
          title="Recarregar dados"
          className="h-12 w-12 rounded-2xl bg-white/5 border-white/15 text-white hover:bg-white/10 flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
        </Button>
      </div>

      {statusBanner && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 border ${
            statusBanner.isError
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusBanner.message}</span>
        </div>
      )}

      <Tabs defaultValue="conteudo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-2xl p-1 h-11">
          <TabsTrigger
            value="conteudo"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#001B30]"
          >
            Conteúdo
          </TabsTrigger>
          <TabsTrigger
            value="usuarios"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#001B30]"
          >
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="atalhos"
            className="rounded-xl text-xs font-bold data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#001B30]"
          >
            Ações Rápidas
          </TabsTrigger>
        </TabsList>

        {/* ABA CONTEÚDO */}
        <TabsContent value="conteudo" className="mt-3">
          <ScrollArea className="h-[52vh] max-h-80 pr-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Eventos ({events.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleNavigate('/eventos?new=1')}
                    className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Novo
                  </button>
                </div>
                {events.length === 0 ? (
                  <p className="text-xs text-white/50 py-3 text-center bg-white/5 rounded-xl">
                    Nenhum evento cadastrado.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {events.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{item.titulo}</p>
                          <p className="text-[11px] text-white/60">
                            {formatLocalDate(item.data, "dd/MM/yyyy")} • {item.hora}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit('evento', item.id)}
                            className="h-9 w-9 rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteRequest('evento', item.id, item.titulo)}
                            className="h-9 w-9 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Programação ({posts.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleNavigate('/programacao?new=1')}
                    className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nova
                  </button>
                </div>
                {posts.length === 0 ? (
                  <p className="text-xs text-white/50 py-3 text-center bg-white/5 rounded-xl">
                    Nenhuma postagem cadastrada.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {posts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{item.titulo}</p>
                          <p className="text-[11px] text-white/60">
                            {formatLocalDate(item.data, "dd/MM/yyyy")}
                            {item.destaque ? ' • Destaque' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit('postagem', item.id)}
                            className="h-9 w-9 rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteRequest('postagem', item.id, item.titulo)}
                            className="h-9 w-9 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ABA USUÁRIOS */}
        <TabsContent value="usuarios" className="mt-3">
          <ScrollArea className="h-[52vh] max-h-80 pr-2">
            <div className="space-y-2.5">
              {users.length === 0 ? (
                <p className="text-xs text-white/50 py-6 text-center">
                  Nenhum usuário retornado pela API.
                </p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {u.full_name || 'Sem nome'}
                      </p>
                      <p className="text-xs text-white/60 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Select
                        value={u.role}
                        onValueChange={(role) => handleRoleChange(u.id, role)}
                      >
                        <SelectTrigger className="w-32 h-9 rounded-xl bg-white/10 border-white/20 text-xs text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#07152D] border-white/20 text-white">
                          <SelectItem value="DESENVOLVEDOR">DEV</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Membro</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteRequest('usuário', u.id, u.full_name || u.email)}
                        className="h-9 w-9 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ABA ATALHOS */}
        <TabsContent value="atalhos" className="mt-3">
          <div className="grid grid-cols-1 gap-2.5">
            <Button
              onClick={() => handleNavigate('/eventos?new=1')}
              className="h-12 rounded-2xl btn-gold justify-start px-4 text-xs font-bold"
            >
              <Plus className="w-4 h-4 mr-2" /> Criar Novo Evento na Agenda
            </Button>
            <Button
              onClick={() => handleNavigate('/programacao?new=1')}
              className="h-12 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 justify-start px-4 text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[#D4AF37]" /> Publicar na Programação
            </Button>
            <Button
              onClick={() => handleNavigate('/aniversariantes')}
              variant="outline"
              className="h-11 rounded-2xl bg-white/5 border-white/15 text-white hover:bg-white/10 justify-start px-4 text-xs"
            >
              <Users className="w-4 h-4 mr-2 text-[#D4AF37]" /> Ver Mural de Aniversariantes
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDeleteDialog
        open={deleteAlert.isOpen}
        onOpenChange={(isOpen) => setDeleteAlert((prev) => ({ ...prev, isOpen }))}
        title={`Excluir ${deleteAlert.type || 'item'}`}
        description={`Tem certeza que deseja excluir "${deleteAlert.label}"? Esta operação é permanente no banco de dados.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
