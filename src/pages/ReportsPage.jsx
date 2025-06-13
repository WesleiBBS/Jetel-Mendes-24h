import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { 
  RatingDistributionChart, 
  OverallSatisfactionChart, 
  DailyResponsesChart,
  AverageRatingsChart 
} from '../components/Admin/Charts';
import { getSurveys, calculateStatistics } from '../services/api';

const ReportsPage = () => {
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

  const exportData = () => {
    const csvContent = [
      ['Data/Hora', 'Recepção', 'Triagem', 'Médico', 'Capacidade Médico', 'Higienização', 'Técnicos/Enfermeiros'],
      ...surveys.map(survey => [
        survey.timestamp.toLocaleString('pt-BR'),
        survey.responses?.atendimento_recepcao || '',
        survey.responses?.atendimento_triagem || '',
        survey.responses?.atendimento_medico || '',
        survey.responses?.capacidade_medico || '',
        survey.responses?.higienizacao || '',
        survey.responses?.atendimento_tecnicos || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pesquisa-satisfacao-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <AdminLayout title="Relatórios">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Relatórios">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end justify-between">
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
          
          <button
            onClick={exportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {statistics && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total de Respostas</h3>
              <p className="text-3xl font-bold text-blue-600">{statistics.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Média Geral</h3>
              <p className="text-3xl font-bold text-green-600">
                {Object.values(statistics.averageRatings).length > 0 
                  ? (Object.values(statistics.averageRatings).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / Object.values(statistics.averageRatings).length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Melhor Avaliação</h3>
              <p className="text-3xl font-bold text-green-600">
                {Object.values(statistics.averageRatings).length > 0 
                  ? Math.max(...Object.values(statistics.averageRatings).map(v => parseFloat(v))).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pior Avaliação</h3>
              <p className="text-3xl font-bold text-red-600">
                {Object.values(statistics.averageRatings).length > 0 
                  ? Math.min(...Object.values(statistics.averageRatings).map(v => parseFloat(v))).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OverallSatisfactionChart statistics={statistics} />
            <AverageRatingsChart averageRatings={statistics.averageRatings} />
          </div>

          {/* Daily Responses Chart */}
          {statistics.dailyResponses.length > 0 && (
            <DailyResponsesChart data={statistics.dailyResponses} />
          )}

          {/* Individual Section Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(statistics.ratingDistribution).map(([section, data]) => (
              <RatingDistributionChart 
                key={section}
                data={data}
                section={getSectionLabel(section)}
              />
            ))}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Comentários Recentes</h3>
            <div className="space-y-4">
              {surveys.slice(0, 5).map((survey) => (
                <div key={survey.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600 mb-1">
                    {survey.timestamp.toLocaleString('pt-BR')}
                  </p>
                  {survey.responses?.ginastica_cloud && (
                    <div className="mb-2">
                      <strong className="text-sm text-gray-700">Ginástica Cloud/HIIT-PA:</strong>
                      <p className="text-sm text-gray-600">{survey.responses.ginastica_cloud}</p>
                    </div>
                  )}
                  {survey.responses?.espaco_colaborativo && (
                    <div className="mb-2">
                      <strong className="text-sm text-gray-700">Espaço Colaborativo:</strong>
                      <p className="text-sm text-gray-600">{survey.responses.espaco_colaborativo}</p>
                    </div>
                  )}
                  {survey.responses?.visita_atendimento && (
                    <div className="mb-2">
                      <strong className="text-sm text-gray-700">Visita de Atendimento:</strong>
                      <p className="text-sm text-gray-600">{survey.responses.visita_atendimento}</p>
                    </div>
                  )}
                  {survey.responses?.gostou_espaco && (
                    <div className="mb-2">
                      <strong className="text-sm text-gray-700">Gostou do Espaço:</strong>
                      <p className="text-sm text-gray-600">{survey.responses.gostou_espaco}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ReportsPage;

