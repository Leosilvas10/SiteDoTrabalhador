import React from 'react';

const JobCard = ({ job, onApplyClick }) => {
  // Verificações de segurança
  const title = job?.title || 'Título não informado';
  const company = job?.company || {};
  const companyName = company.name || 'Empresa não informada';
  const location = job?.location || 'Local não informado';
  const salary = job?.salary || 'Salário a combinar';
  const type = job?.type || 'Tipo não informado';
  const description = job?.description || 'Descrição não disponível';
  const tags = job?.tags || '';
  const source = job?.source || 'Fonte não informada';
  const timeAgo = job?.timeAgo || 'Recente';

  return (
    <div className="job-card bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
      {/* Cabeçalho com logo e informações da empresa */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-400 text-sm mb-1">{companyName}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>📍 {location}</span>
            <span>⏰ {timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Informações de salário e tipo */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded-full border border-green-700">
          💰 {salary}
        </span>
        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded-full border border-blue-700">
          ⏰ {type}
        </span>
      </div>

      {/* Descrição */}
      <div className="mb-4">
        <p className="text-slate-300 text-sm line-clamp-3">
          {description}
        </p>
      </div>

      {/* Tags */}
      {tags && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(tags) ? tags : tags.split(',')).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
              >
                {typeof tag === 'string' ? tag.trim() : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé com fonte e botão */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">
            📡 {source}
          </span>
          <span className="text-xs text-green-400 font-medium">
            ✅ Verificada
          </span>
        </div>

        {/* Botão de candidatura */}
        <button
          onClick={onApplyClick}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <span>Quero me candidatar</span>
          <span>🔗</span>
        </button>
      </div>
    </div>
  );
};

export default JobCard;