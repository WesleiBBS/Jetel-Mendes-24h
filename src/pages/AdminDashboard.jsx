import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { getSurveys, calculateStatistics } from '../services/api';

const AdminDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async (startDate = null, endDate = null) => {
    setLoading(true);
    setError('');

    try {
      const result = await getSurveys(startDate, endDate);
      
      if (result.success) {
        setSurveys(result.data);
        setStatistics(calculateStatistics(result.data));
      } else {
        setError(result.error || 'Erro ao carregar pesquisas');
      }
    } catch (error) {
      setError('Erro ao carregar pesquisas');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    loadSurveys(startDate, endDate);
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    loadSurveys();
  };

  const getRatingLabel = (rating) => {
    const labels = {
      'muito_satisfeito': 'Muito Satisfeito',
      'satisfeito': 'Satisfeito',
      'regular': 'Regular',
      'ruim': 'Ruim'
    };
    return labels[rating] || rating;
  };

  const getSectionLabel = (section) => {
    const labels = {
      'atendimento_recepcao': 'Atendimento da Recepção',
      'atendimento_triagem': 'Atendimento da Triagem',
      'atendimento_medico': 'Atendimento Médico',
      'capacidade_medico': 'Capacidade e conhecimento do Médico',
      'higienizacao': 'Higienização/Limpeza da unidade',
      'atendimento_tecnicos': 'Atendimento da equipe de Técnicos e Enfermeiros'
    };
    return labels[section] || section;
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDateFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Filtrar
            </button>
            <button
              onClick={clearDateFilter}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {statistics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Respostas</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(statistics.averageRatings).length > 0 
                      ? (Object.values(statistics.averageRatings).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / Object.values(statistics.averageRatings).length).toFixed(2)
                      : '0.00'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {surveys.filter(s => {
                      const today = new Date().toDateString();
                      return s.timestamp.toDateString() === today;
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {surveys.filter(s => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return s.timestamp >= weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Average Ratings */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Médias por Seção</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(statistics.averageRatings).map(([section, average]) => (
                <div key={section} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {getSectionLabel(section)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{average}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      parseFloat(average) >= 3.5 ? 'bg-green-500' :
                      parseFloat(average) >= 2.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Surveys */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Respostas Recentes</h3>
            {surveys.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recepção
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Triagem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Higienização
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {surveys.slice(0, 10).map((survey) => (
                      <tr key={survey.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {survey.timestamp.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRatingLabel(survey.responses?.atendimento_recepcao)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRatingLabel(survey.responses?.atendimento_triagem)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRatingLabel(survey.responses?.atendimento_medico)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRatingLabel(survey.responses?.higienizacao)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma resposta encontrada</p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;

