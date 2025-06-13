import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Rating Distribution Chart
export const RatingDistributionChart = ({ data, section }) => {
  const chartData = [
    { name: 'Muito Satisfeito', value: data.muito_satisfeito, color: '#10B981' },
    { name: 'Satisfeito', value: data.satisfeito, color: '#3B82F6' },
    { name: 'Regular', value: data.regular, color: '#F59E0B' },
    { name: 'Ruim', value: data.ruim, color: '#EF4444' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{section}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Overall Satisfaction Pie Chart
export const OverallSatisfactionChart = ({ statistics }) => {
  const totalResponses = Object.values(statistics.ratingDistribution).reduce((acc, section) => {
    return acc + Object.values(section).reduce((sum, count) => sum + count, 0);
  }, 0);

  const overallData = Object.values(statistics.ratingDistribution).reduce((acc, section) => {
    Object.entries(section).forEach(([rating, count]) => {
      acc[rating] = (acc[rating] || 0) + count;
    });
    return acc;
  }, {});

  const pieData = [
    { name: 'Muito Satisfeito', value: overallData.muito_satisfeito || 0, color: '#10B981' },
    { name: 'Satisfeito', value: overallData.satisfeito || 0, color: '#3B82F6' },
    { name: 'Regular', value: overallData.regular || 0, color: '#F59E0B' },
    { name: 'Ruim', value: overallData.ruim || 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const renderLabel = (entry) => {
    const percent = ((entry.value / totalResponses) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição Geral de Satisfação</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Daily Responses Chart
export const DailyResponsesChart = ({ data }) => {
  const chartData = data.slice(-30); // Last 30 days

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Respostas por Dia (Últimos 30 dias)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            formatter={(value) => [value, 'Respostas']}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Average Ratings Comparison Chart
export const AverageRatingsChart = ({ averageRatings }) => {
  const getSectionLabel = (section) => {
    const labels = {
      'atendimento_recepcao': 'Recepção',
      'atendimento_triagem': 'Triagem',
      'atendimento_medico': 'Médico',
      'capacidade_medico': 'Capacidade Médico',
      'higienizacao': 'Higienização',
      'atendimento_tecnicos': 'Técnicos/Enfermeiros'
    };
    return labels[section] || section;
  };

  const chartData = Object.entries(averageRatings).map(([section, average]) => ({
    section: getSectionLabel(section),
    average: parseFloat(average),
    fullSection: section
  }));

  const getBarColor = (average) => {
    if (average >= 3.5) return '#10B981'; // Green
    if (average >= 2.5) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Médias por Seção</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 4]} />
          <YAxis 
            type="category" 
            dataKey="section" 
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip 
            formatter={(value) => [value.toFixed(2), 'Média']}
          />
          <Bar dataKey="average" fill="#3B82F6">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.average)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

