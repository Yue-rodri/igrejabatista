import React, { useState, useEffect } from "react";
import { Postagem } from "@/entities/Postagem";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

import PostagemForm from "../components/programacao/PostagemForm";
import PostagemCard from "../components/programacao/PostagemCard";

export default function Programacao() {
  const [postagens, setPostagens] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPostagem, setEditingPostagem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadPostagens();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const loadPostagens = async () => {
    setIsLoading(true);
    const data = await Postagem.list("-data");
    setPostagens(data);
    setIsLoading(false);
  };

  const handleSubmit = async (postagemData) => {
    if (editingPostagem) {
      await Postagem.update(editingPostagem.id, postagemData);
    } else {
      await Postagem.create(postagemData);
    }
    setShowForm(false);
    setEditingPostagem(null);
    loadPostagens();
  };

  const handleEdit = (postagem) => {
    setEditingPostagem(postagem);
    setShowForm(true);
  };

  const handleDelete = async (postagemId) => {
    if (confirm("Tem certeza que deseja excluir esta postagem?")) {
      await Postagem.delete(postagemId);
      loadPostagens();
    }
  };

  const isAdmin = user?.role === 'admin';
  const postagensDestaque = postagens.filter(p => p.destaque);
  const postagensNormais = postagens.filter(p => !p.destaque);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#D4AF37] text-sm font-medium">Fique por Dentro</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Programação da Igreja
        </h1>
        <p className="text-white/70">
          Acompanhe nossas atividades e eventos especiais
        </p>
      </div>

      {isAdmin && (
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => {
              setEditingPostagem(null);
              setShowForm(true);
            }}
            className="bg-[#D4AF37] hover:bg-[#B8941E] text-[#001B3D]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Postagem
          </Button>
        </div>
      )}

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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {postagensDestaque.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                Em Destaque
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {postagensDestaque.map((postagem) => (
                  <PostagemCard
                    key={postagem.id}
                    postagem={postagem}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDestaque={true}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Todas as Postagens
            </h2>
            {postagensNormais.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-md border-white/10 p-12 text-center">
                <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/50 text-lg">
                  Nenhuma postagem ainda
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postagensNormais.map((postagem) => (
                  <PostagemCard
                    key={postagem.id}
                    postagem={postagem}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}