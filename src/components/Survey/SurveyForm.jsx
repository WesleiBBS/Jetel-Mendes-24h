import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SatisfactionScale from './SatisfactionScale';
import { submitSurvey } from '../../services/api';

const SurveyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  const watchedValues = watch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await submitSurvey({ responses: data });
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Pesquisa enviada com sucesso! Obrigado pela sua participação.' });
        reset();
      } else {
        setSubmitStatus({ type: 'error', message: 'Erro ao enviar pesquisa. Tente novamente.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Erro ao enviar pesquisa. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    reset();
    setSubmitStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">JETEL MENDES</h1>
              <p className="text-sm text-gray-600">Posto Avançado 24h</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Pesquisa de Satisfação - PA Jetel Mendes
          </h2>
          <p className="text-gray-600 text-sm">
            Sua opinião é muito importante para nós! Por favor, avalie nossos serviços e nos ajude a melhorar continuamente.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Satisfaction Ratings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Avaliação dos Serviços</h3>
            
            <div className="space-y-8">
              <SatisfactionScale
                name="atendimento_recepcao"
                label="Atendimento da Recepção"
                value={watchedValues.atendimento_recepcao}
                onChange={(value) => setValue('atendimento_recepcao', value)}
                required
              />

              <SatisfactionScale
                name="atendimento_triagem"
                label="Atendimento da Triagem"
                value={watchedValues.atendimento_triagem}
                onChange={(value) => setValue('atendimento_triagem', value)}
                required
              />

              <SatisfactionScale
                name="atendimento_medico"
                label="Atendimento Médico"
                value={watchedValues.atendimento_medico}
                onChange={(value) => setValue('atendimento_medico', value)}
                required
              />

              <SatisfactionScale
                name="capacidade_medico"
                label="Capacidade e conhecimento do Médico"
                value={watchedValues.capacidade_medico}
                onChange={(value) => setValue('capacidade_medico', value)}
                required
              />

              <SatisfactionScale
                name="higienizacao"
                label="Higienização/Limpeza da unidade"
                value={watchedValues.higienizacao}
                onChange={(value) => setValue('higienizacao', value)}
                required
              />

              <SatisfactionScale
                name="atendimento_tecnicos"
                label="Atendimento da equipe de Técnicos e Enfermeiros"
                value={watchedValues.atendimento_tecnicos}
                onChange={(value) => setValue('atendimento_tecnicos', value)}
                required
              />
            </div>
          </div>

          {/* Open Questions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Comentários Adicionais</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gostou deste espaço GINÁSTICA CLOUD ou HIIT-PA?
                </label>
                <textarea
                  {...register('ginastica_cloud')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua resposta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gostou deste espaço colaborativo? Por quê?
                </label>
                <textarea
                  {...register('espaco_colaborativo')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua resposta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gostou da sua visita de atendimento?
                </label>
                <textarea
                  {...register('visita_atendimento')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua resposta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gostou deste o espaço?
                </label>
                <textarea
                  {...register('gostou_espaco')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sua resposta..."
                />
              </div>
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div className={`p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {submitStatus.message}
            </div>
          )}

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
                
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="text-blue-600 hover:text-blue-800 px-4 py-3 font-medium transition-colors"
                >
                  Limpar formulário
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Página 1 de 1
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;

