
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminLayout from '../../../src/components/Admin/AdminLayout'

export default function AdminUsuarios() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'admin',
    active: true
  })

  useEffect(() => {
    // Verificar autenticação
    const adminToken = localStorage.getItem('admin_token')
    if (!adminToken) {
      router.push('/admin/login')
      return
    }
    
    setIsAuthenticated(true)
    loadUsuarios()
    setLoading(false)
  }, [])

  const loadUsuarios = () => {
    // Simular carregamento de usuários do localStorage
    const savedUsers = localStorage.getItem('admin_users')
    if (savedUsers) {
      setUsuarios(JSON.parse(savedUsers))
    } else {
      // Usuário padrão
      const defaultUsers = [
        {
          id: 1,
          name: 'Administrador',
          username: 'admin',
          email: 'admin@sitedotrabalhador.com.br',
          role: 'super_admin',
          active: true,
          created_at: new Date().toISOString()
        }
      ]
      setUsuarios(defaultUsers)
      localStorage.setItem('admin_users', JSON.stringify(defaultUsers))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingUser) {
      // Editar usuário existente
      const updatedUsers = usuarios.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, updated_at: new Date().toISOString() }
          : user
      )
      setUsuarios(updatedUsers)
      localStorage.setItem('admin_users', JSON.stringify(updatedUsers))
    } else {
      // Criar novo usuário
      const newUser = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString()
      }
      const updatedUsers = [...usuarios, newUser]
      setUsuarios(updatedUsers)
      localStorage.setItem('admin_users', JSON.stringify(updatedUsers))
    }

    // Reset form
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'admin',
      active: true
    })
    setEditingUser(null)
    setShowModal(false)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      active: user.active
    })
    setShowModal(true)
  }

  const handleDelete = (userId) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = usuarios.filter(user => user.id !== userId)
      setUsuarios(updatedUsers)
      localStorage.setItem('admin_users', JSON.stringify(updatedUsers))
    }
  }

  const toggleUserStatus = (userId) => {
    const updatedUsers = usuarios.map(user => 
      user.id === userId 
        ? { ...user, active: !user.active, updated_at: new Date().toISOString() }
        : user
    )
    setUsuarios(updatedUsers)
    localStorage.setItem('admin_users', JSON.stringify(updatedUsers))
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <Head>
        <title>Usuários - Painel Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">👥 Gerenciar Usuários</h1>
            <p className="text-slate-400 mt-2">Crie e gerencie usuários administrativos</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null)
              setFormData({
                name: '',
                username: '',
                email: '',
                password: '',
                role: 'admin',
                active: true
              })
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ➕ Novo Usuário
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{usuarios.length}</p>
                <p className="text-slate-400">Total de Usuários</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{usuarios.filter(u => u.active).length}</p>
                <p className="text-slate-400">Usuários Ativos</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600 rounded-lg">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{usuarios.filter(u => u.role === 'super_admin').length}</p>
                <p className="text-slate-400">Super Admins</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-600 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{usuarios.filter(u => !u.active).length}</p>
                <p className="text-slate-400">Usuários Inativos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de usuários */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Papel</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Criado em</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {usuario.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{usuario.name}</div>
                          <div className="text-sm text-slate-400">@{usuario.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.role === 'super_admin' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {usuario.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(usuario.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                          usuario.active 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {usuario.active ? '✅ Ativo' : '❌ Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        {usuario.role !== 'super_admin' && (
                          <button
                            onClick={() => handleDelete(usuario.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            🗑️ Excluir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingUser ? '✏️ Editar Usuário' : '➕ Novo Usuário'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Usuário</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Papel</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">🛡️ Admin</option>
                    <option value="super_admin">👑 Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-slate-300">
                    Usuário ativo
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingUser ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
