// src/pages/Membros.jsx

import { useState, useEffect } from 'react';
// Não se preocupe, o roteador e a navegação estão no App.jsx principal

// Componente auxiliar para formatar datas
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// Componente para Formatar Datas no Input (YYYY-MM-DD) para Edição
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Verifica se a data é válida antes de tentar formatar
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function MembrosPage() {
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nome: '',
        dataNascimento: '',
        telefone: '',
        status: 'Ativo'
    });
    const [editingMembro, setEditingMembro] = useState(null); 
    
    const API_URL = 'http://localhost:3001/api/membros';

    // Lida com a mudança nos campos de cadastro e edição
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        
        if (editingMembro) {
            setEditingMembro(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- READ (BUSCAR) ---
    const fetchMembros = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setMembros(data);
        } catch (error) {
            console.error('Erro ao buscar membros:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembros();
    }, []);

    // --- CREATE (CRIAR) ---
    const handleAddMembro = async (e) => {
        e.preventDefault();
        
        if (!formData.nome.trim() || !formData.dataNascimento) {
            alert('Por favor, preencha o Nome e a Data de Nascimento para cadastrar.');
            return;
        }

        try {
            const dataToSend = {};
            for (const key in formData) {
                if (formData[key] && formData[key].trim) {
                    if (formData[key].trim() !== '') {
                        dataToSend[key] = formData[key].trim();
                    }
                } else if (formData[key]) {
                    dataToSend[key] = formData[key];
                }
            }
            if (!dataToSend.status) { dataToSend.status = 'Ativo'; }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });
            const novoMembro = await response.json();
            
            if (response.ok) {
                setMembros([...membros, novoMembro]);
                setFormData({ nome: '', dataNascimento: '', telefone: '', status: 'Ativo' }); 
            } else {
                 console.error('Erro do servidor:', novoMembro.details);
                 alert(`Falha ao cadastrar: ${novoMembro.details || 'Verifique o console.'}`);
            }

        } catch (error) {
            console.error('Erro de rede ao cadastrar membro:', error);
        }
    };
    
    // --- DELETE (DELETAR) ---
    const handleDeleteMembro = async (id) => {
        if (!window.confirm("Tem certeza que deseja deletar este membro?")) return;
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            
            if (response.status === 204) {
                setMembros(membros.filter(m => m._id !== id));
            } else {
                alert('Falha ao deletar o membro.');
            }
        } catch (error) {
            console.error('Erro ao deletar membro:', error);
        }
    };
    
    // --- UPDATE (ATUALIZAR) ---
    // 1. Abre o modo de edição
    const handleEditClick = (membro) => {
        setEditingMembro({ ...membro });
    };

    // 2. Envia a atualização para o Backend
    const handleUpdateMembro = async (e) => {
        e.preventDefault();

        if (!editingMembro.nome.trim() || !editingMembro.dataNascimento) {
            alert('Nome e Data de Nascimento são obrigatórios!');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${editingMembro._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingMembro),
            });
            const membroAtualizado = await response.json();
            
            if (response.ok) {
                // Atualiza a lista de membros no estado local
                setMembros(membros.map(m => 
                    m._id === membroAtualizado._id ? membroAtualizado : m
                ));
                // Sai do modo de edição
                setEditingMembro(null); 
            } else {
                 console.error('Erro do servidor:', membroAtualizado.details);
                 alert(`Falha ao atualizar: ${membroAtualizado.details || 'Verifique o console.'}`);
            }

        } catch (error) {
            console.error('Erro de rede ao atualizar membro:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingMembro(null);
    };


    return (
        <>
            <h1>⛪ Cadastro e Gestão de Membros</h1>
            
            {/* NOVO: Formulário de Edição Condicional */}
            {editingMembro && (
                 <div className="card" style={{ marginBottom: '30px', border: '1px solid #007bff', padding: '20px', backgroundColor: '#e9f7ff' }}>
                    <h2>Editar Membro: {editingMembro.nome}</h2>
                    <form onSubmit={handleUpdateMembro} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        
                        <input type="text" name="nome" placeholder="Nome Completo *" value={editingMembro.nome || ''} onChange={handleFormChange} required />
                        <input 
                            type="date" 
                            name="dataNascimento" 
                            placeholder="Data Nasc. *" 
                            value={formatDateForInput(editingMembro.dataNascimento)} 
                            onChange={handleFormChange} 
                            required 
                        />
                        
                        <input type="tel" name="telefone" placeholder="Telefone (Opcional)" value={editingMembro.telefone || ''} onChange={handleFormChange} />
                        
                        <select name="status" value={editingMembro.status || 'Ativo'} onChange={handleFormChange} style={{ gridColumn: '1 / 2' }}>
                            <option value="Ativo">Status: Ativo</option>
                            <option value="Ausente">Status: Ausente</option>
                            <option value="Afastado">Status: Afastado</option>
                        </select>

                        <div style={{ gridColumn: '2 / 3', display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ flexGrow: 1, backgroundColor: '#28a745', color: 'white' }}>Salvar Edição</button>
                            <button type="button" onClick={handleCancelEdit} style={{ flexGrow: 1, backgroundColor: '#6c757d', color: 'white' }}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}


            {/* Formulário de Cadastro (Escondido durante a edição) */}
            {!editingMembro && (
                <div className="card" style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px' }}>
                    <h2>Cadastrar Novo Membro</h2>
                    <form onSubmit={handleAddMembro} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        
                        <input type="text" name="nome" placeholder="Nome Completo *" value={formData.nome} onChange={handleFormChange} required />
                        <input type="date" name="dataNascimento" placeholder="Data Nasc. *" value={formData.dataNascimento} onChange={handleFormChange} required />
                        
                        <input type="tel" name="telefone" placeholder="Telefone (Opcional)" value={formData.telefone} onChange={handleFormChange} />
                        
                        <select name="status" value={formData.status} onChange={handleFormChange} style={{ gridColumn: '1 / 2' }}>
                            <option value="Ativo">Status: Ativo</option>
                            <option value="Ausente">Status: Ausente</option>
                            <option value="Afastado">Status: Afastado</option>
                        </select>

                        <button type="submit" style={{ gridColumn: '2 / 3' }}>Cadastrar Membro</button>
                    </form>
                    <p style={{fontSize: '0.8em', color: '#666', marginTop: '10px'}}>* Apenas Nome e Data de Nascimento são obrigatórios.</p>
                </div>
            )}
            
            {/* Lista de Membros */}
            <h2>Lista de Membros Atuais</h2>
            <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: '800px' }}>
                {loading ? (
                    <p>Carregando dados dos membros...</p>
                ) : membros.length === 0 ? (
                    <p>Nenhum membro cadastrado. Use o formulário acima para começar!</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Nome</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Nasc.</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Tel.</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membros.map(membro => (
                                <tr key={membro._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '8px' }}>{membro.nome}</td>
                                    <td style={{ padding: '8px' }}>{formatDate(membro.dataNascimento)}</td>
                                    <td style={{ padding: '8px' }}>{membro.telefone || 'N/A'}</td>
                                    <td style={{ padding: '8px' }}>{membro.status}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', display: 'flex', gap: '5px' }}>
                                        {/* NOVO: Botão de Edição */}
                                        <button 
                                            onClick={() => handleEditClick(membro)}
                                            disabled={!!editingMembro} // Desabilita se já estiver editando
                                            style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        {/* Botão de Deletar */}
                                        <button 
                                            onClick={() => handleDeleteMembro(membro._id)}
                                            disabled={!!editingMembro}
                                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default MembrosPage;