import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Sparkles, Church } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Postagem } from '@/entities/Postagem';
import { useAuth } from '@/context/AuthContext';
import PostagemForm from '../components/programacao/PostagemForm';
import PostagemCard from '../components/programacao/PostagemCard';
import {
  MobilePageHeader,
  LoadingStateCard,
  EmptyStateCard,
  ErrorRetryCard,
  ConfirmDeleteDialog,
} from '@/components/shared/GlassPrimitives';

export default function Programacao() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin, setIsApiConfigOpen } = useAuth();

  const [postagens, setPostagens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPostagem, setEditingPostagem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [postagemToDelete, setPostagemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPostagens = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await Postagem.list();
      setPostagens(data);
    } catch (error) {
      setLoadError(
        error.response?.data?.error ||
          'Não foi possível carregar a programação da igreja.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPostagens();
  }, [loadPostagens]);

  // Suporte a query params vindos do Painel Administrativo (?edit=ID ou ?new=1)
  useEffect(() => {
    if (!isAdmin) return;
    const editId = searchParams.get('edit');
    const isNew = searchParams.get('new');
    if (editId && postagens.length > 0) {
      const found = postagens.find((p) => String(p.id) === String(editId));
      if (found) {
        setEditingPostagem(found);
        setShowForm(true);
        setSearchParams({}, { replace: true });
      }
    } else if (isNew === '1') {
      setEditingPostagem(null);
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [isAdmin, searchParams, postagens, setSearchParams]);

  const handleSubmit = async (postagemData) => {
    if (editingPostagem) {
      await Postagem.update(editingPostagem.id, postagemData);
    } else {
      await Postagem.create(postagemData);
    }
    setShowForm(false);
    setEditingPostagem(null);
    await loadPostagens();
  };

  const handleEdit = (postagem) => {
    setEditingPostagem(postagem);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async () => {
    if (!postagemToDelete) return;
    setIsDeleting(true);
    try {
      await Postagem.delete(postagemToDelete.id);
      setPostagemToDelete(null);
      await loadPostagens();
    } finally {
      setIsDeleting(false);
    }
  };

  const postagensDestaque = postagens.filter((p) => p.destaque);
  const postagensNormais = postagens.filter((p) => !p.destaque);

  return (
    <div className="space-y-6 pb-4">
      <MobilePageHeader
        badge="Fique por Dentro"
        badgeIcon={Sparkles}
        title="Programação da Igreja"
        subtitle="Cultos, atividades regulares e avisos especiais da IBPJ"
        action={
          isAdmin && (
            <Button
              onClick={() => {
                setEditingPostagem(null);
                setShowForm((prev) => !prev);
              }}
              className="h-11 px-4 rounded-2xl btn-gold text-xs font-bold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Nova Postagem
            </Button>
          )
        }
      />

      {/* Card Fixo da Programação Regular de Cultos da IBPJ */}
      <div className="glass-card-gold rounded-3xl p-4 sm:p-5 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-gold">
          <Church className="w-6 h-6 text-[#001B30]" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37]">
            Programação Fixa
          </span>
          <h2 className="text-base font-extrabold text-white">
            Cultos Diários de Adoração e Palavra
          </h2>
          <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            Todos os dias das <strong className="text-[#D4AF37]">18h00 às 20h00</strong>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <PostagemForm
            postagem={editingPostagem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPostagem(null);
            }}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <LoadingStateCard label="Carregando programação..." />
      ) : loadError ? (
        <ErrorRetryCard
          title="Erro ao carregar a programação"
          message={loadError}
          onRetry={loadPostagens}
          onConfigureApi={() => setIsApiConfigOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {postagensDestaque.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 px-0.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                Em Destaque
              </h2>
              <div className="space-y-3.5">
                {postagensDestaque.map((postagem) => (
                  <PostagemCard
                    key={postagem.id}
                    postagem={postagem}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={(p) => setPostagemToDelete(p)}
                    isDestaque={true}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-white px-0.5">
              Todas as Publicações
            </h2>
            {postagensNormais.length === 0 && postagensDestaque.length === 0 ? (
              <EmptyStateCard
                icon={Calendar}
                title="Nenhuma postagem publicada ainda"
                description="Quando a liderança publicar novos avisos ou atividades especiais, eles aparecerão aqui."
                action={
                  isAdmin && (
                    <Button
                      onClick={() => {
                        setEditingPostagem(null);
                        setShowForm(true);
                      }}
                      size="sm"
                      className="btn-gold h-10 px-4 rounded-xl text-xs font-bold"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Criar primeira publicação
                    </Button>
                  )
                }
              />
            ) : postagensNormais.length === 0 ? (
              <p className="text-xs text-white/55 text-center py-4">
                Todas as publicações ativas estão exibidas na seção Em Destaque acima.
              </p>
            ) : (
              <div className="space-y-3.5">
                {postagensNormais.map((postagem) => (
                  <PostagemCard
                    key={postagem.id}
                    postagem={postagem}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={(p) => setPostagemToDelete(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <ConfirmDeleteDialog
        open={Boolean(postagemToDelete)}
        onOpenChange={(open) => !open && setPostagemToDelete(null)}
        title="Excluir Publicação"
        description={
          postagemToDelete
            ? `Tem certeza que deseja excluir "${postagemToDelete.titulo}" da programação?`
            : ''
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
