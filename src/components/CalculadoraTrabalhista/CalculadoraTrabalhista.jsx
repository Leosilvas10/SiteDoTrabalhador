
import { useState } from 'react'

const CalculadoraTrabalhista = () => {
  const [activeCalc, setActiveCalc] = useState('rescisao')
  const [results, setResults] = useState({})

  const calculadoras = [
    { 
      id: 'rescisao', 
      icon: '💰', 
      name: 'Rescisão de Contrato', 
      desc: 'Calcule verbas rescisórias' 
    },
    { 
      id: 'ferias', 
      icon: '🏖️', 
      name: 'Férias', 
      desc: 'Valor de férias e terço constitucional' 
    },
    { 
      id: 'horasextras', 
      icon: '⏰', 
      name: 'Horas Extras', 
      desc: 'Cálculo de horas extras' 
    },
    { 
      id: 'adicionalnoturno', 
      icon: '🌙', 
      name: 'Adicional Noturno', 
      desc: 'Valor do trabalho noturno' 
    },
    { 
      id: 'salarioliquido', 
      icon: '📊', 
      name: 'Salário Líquido', 
      desc: 'Descontos e valor líquido' 
    }
  ]

  const calcularRescisao = (dados) => {
    const salario = parseFloat(dados.salario) || 0
    const meses = parseInt(dados.meses) || 0
    const tipo = dados.tipo

    let resultado = {
      saldoSalario: salario,
      aviso13: salario,
      fgts: salario * meses * 0.08,
      multaFgts: 0,
      ferias: salario * (meses / 12),
      tercoFerias: (salario * (meses / 12)) / 3,
      total: 0
    }

    if (tipo === 'demissao-sem-justa-causa') {
      resultado.multaFgts = resultado.fgts * 0.4
    }

    resultado.total = Object.values(resultado).reduce((sum, val) => sum + val, 0) - resultado.total

    return resultado
  }

  const calcularFerias = (dados) => {
    const salario = parseFloat(dados.salario) || 0
    const dias = parseInt(dados.diasTrabalhados) || 0

    const feriasProporcionais = (salario / 12) * (dias / 30)
    const tercoConstitucional = feriasProporcionais / 3

    return {
      feriasProporcionais,
      tercoConstitucional,
      total: feriasProporcionais + tercoConstitucional
    }
  }

  const calcularHorasExtras = (dados) => {
    const salarioHora = parseFloat(dados.salarioHora) || 0
    const horasExtras = parseInt(dados.horasExtras) || 0
    const percentual = parseFloat(dados.percentual) || 50

    const valorHoraExtra = salarioHora * (1 + percentual / 100)
    const total = valorHoraExtra * horasExtras

    return {
      valorHoraExtra,
      total
    }
  }

  const calcularAdicionalNoturno = (dados) => {
    const salarioHora = parseFloat(dados.salarioHora) || 0
    const horasNoturnas = parseInt(dados.horasNoturnas) || 0

    const adicional = salarioHora * 0.2 // 20% de adicional noturno
    const total = adicional * horasNoturnas

    return {
      adicionalPorHora: adicional,
      total
    }
  }

  const calcularSalarioLiquido = (dados) => {
    const salarioBruto = parseFloat(dados.salarioBruto) || 0
    const dependentes = parseInt(dados.dependentes) || 0

    // Cálculos simplificados
    const inss = Math.min(salarioBruto * 0.14, 908.85) // Teto INSS 2024
    const irrf = salarioBruto > 2259.20 ? (salarioBruto - 2259.20) * 0.075 : 0
    const valeTransporte = dados.valeTransporte ? salarioBruto * 0.06 : 0

    const salarioLiquido = salarioBruto - inss - irrf - valeTransporte

    return {
      salarioBruto,
      inss,
      irrf,
      valeTransporte,
      salarioLiquido
    }
  }

  const handleCalculate = (e, calcId) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const dados = Object.fromEntries(formData.entries())

    let resultado
    switch (calcId) {
      case 'rescisao':
        resultado = calcularRescisao(dados)
        break
      case 'ferias':
        resultado = calcularFerias(dados)
        break
      case 'horasextras':
        resultado = calcularHorasExtras(dados)
        break
      case 'adicionalnoturno':
        resultado = calcularAdicionalNoturno(dados)
        break
      case 'salarioliquido':
        resultado = calcularSalarioLiquido(dados)
        break
      default:
        resultado = {}
    }

    setResults(prev => ({ ...prev, [calcId]: resultado }))
  }

  const renderForm = () => {
    switch (activeCalc) {
      case 'rescisao':
        return (
          <form onSubmit={(e) => handleCalculate(e, 'rescisao')} className="space-y-4">
            <div>
              <label className="block text-govblue-800 mb-2 font-medium">Salário Bruto (R$)</label>
              <input 
                type="number" 
                name="salario"
                step="0.01"
                className="form-input w-full" 
                placeholder="3.000,00" 
                required 
              />
            </div>
            <div>
              <label className="block text-govblue-800 mb-2 font-medium">Tempo de Trabalho (meses)</label>
              <input 
                type="number" 
                name="meses"
                className="form-input w-full" 
                placeholder="24" 
                required 
              />
            </div>
            <div>
              <label className="block text-govblue-800 mb-2 font-medium">Tipo de Rescisão</label>
              <select name="tipo" className="form-input w-full" required>
                <option value="demissao-sem-justa-causa">Demissão sem justa causa</option>
                <option value="pedido-demissao">Pedido de demissão</option>
                <option value="demissao-justa-causa">Demissão por justa causa</option>
                <option value="termino-contrato">Término de contrato</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-govblue-600 hover:bg-govblue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md">
              🧮 Calcular Rescisão
            </button>
          </form>
        )

      case 'ferias':
        return (
          <form onSubmit={(e) => handleCalculate(e, 'ferias')} className="space-y-4">
            <div>
              <label className="block text-govblue-800 mb-2 font-medium">Salário Mensal (R$)</label>
              <input 
                type="number" 
                name="salario"
                step="0.01"
                className="form-input w-full" 
                placeholder="3.000,00" 
                required 
              />
            </div>
            <div>
              <label className="block text-govblue-800 mb-2 font-medium">Dias Trabalhados no Período</label>
              <input 
                type="number" 
                name="diasTrabalhados"
                className="form-input w-full" 
                placeholder="365" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md">
              🏖️ Calcular Férias
            </button>
          </form>
        )

      case 'horasextras':
        return (
          <form onSubmit={(e) => handleCalculate(e, 'horasextras')} className="space-y-4">
            <div>
              <label className="block text-govgray-200 mb-2">Valor Hora Normal (R$)</label>
              <input 
                type="number" 
                name="salarioHora"
                step="0.01"
                className="form-input w-full" 
                placeholder="15,00" 
                required 
              />
            </div>
            <div>
              <label className="block text-govgray-200 mb-2">Quantidade de Horas Extras</label>
              <input 
                type="number" 
                name="horasExtras"
                className="form-input w-full" 
                placeholder="20" 
                required 
              />
            </div>
            <div>
              <label className="block text-govgray-200 mb-2">Percentual de Adicional (%)</label>
              <select name="percentual" className="form-input w-full" required>
                <option value="50">50% (dias úteis)</option>
                <option value="100">100% (domingos e feriados)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-govyellow-500 hover:bg-govyellow-600 text-govblue-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md">
              ⏰ Calcular Horas Extras
            </button>
          </form>
        )

      case 'adicionalnoturno':
        return (
          <form onSubmit={(e) => handleCalculate(e, 'adicionalnoturno')} className="space-y-4">
            <div>
              <label className="block text-govgray-200 mb-2">Valor Hora Normal (R$)</label>
              <input 
                type="number" 
                name="salarioHora"
                step="0.01"
                className="form-input w-full" 
                placeholder="15,00" 
                required 
              />
            </div>
            <div>
              <label className="block text-govgray-200 mb-2">Horas Noturnas Trabalhadas</label>
              <input 
                type="number" 
                name="horasNoturnas"
                className="form-input w-full" 
                placeholder="40" 
                required 
              />
            </div>
            <div className="text-sm text-govgray-300 bg-govgray-700/80 p-3 rounded border border-govgray-600">
              💡 Adicional noturno: 20% sobre o valor da hora normal (22h às 5h)
            </div>
            <button type="submit" className="w-full bg-govblue-600 hover:bg-govblue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md">
              🌙 Calcular Adicional Noturno
            </button>
          </form>
        )

      case 'salarioliquido':
        return (
          <form onSubmit={(e) => handleCalculate(e, 'salarioliquido')} className="space-y-4">
            <div>
              <label className="block text-govgray-200 mb-2">Salário Bruto (R$)</label>
              <input 
                type="number" 
                name="salarioBruto"
                step="0.01"
                className="form-input w-full" 
                placeholder="3.000,00" 
                required 
              />
            </div>
            <div>
              <label className="block text-govgray-200 mb-2">Número de Dependentes</label>
              <input 
                type="number" 
                name="dependentes"
                className="form-input w-full" 
                placeholder="0" 
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="valeTransporte"
                id="valeTransporte"
                className="form-checkbox"
              />
              <label htmlFor="valeTransporte" className="text-govgray-200">Desconta Vale Transporte (6%)</label>
            </div>
            <button type="submit" className="w-full bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md">
              📊 Calcular Salário Líquido
            </button>
          </form>
        )

      default:
        return null
    }
  }

  const renderResults = () => {
    const result = results[activeCalc]
    if (!result) return null

    return (
      <div className="mt-6 p-4 bg-govgreen-50 border-2 border-govgreen-600 rounded-lg">
        <h4 className="text-govgreen-700 font-bold mb-3">✅ Resultado do Cálculo</h4>
        <div className="space-y-2 text-sm">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-govblue-700 capitalize font-medium">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
              </span>
              <span className="text-govblue-800 font-bold">
                R$ {typeof value === 'number' ? value.toFixed(2) : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Lista de Calculadoras */}
      <div className="bg-gradient-to-br from-govblue-100 to-govblue-50 p-8 rounded-2xl border border-govblue-200 shadow-lg">
        <h3 className="text-2xl font-bold text-govblue-800 mb-6">Calculadoras Disponíveis</h3>
        <div className="space-y-4">
          {calculadoras.map((calc) => (
            <div 
              key={calc.id}
              onClick={() => setActiveCalc(calc.id)}
              className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                activeCalc === calc.id 
                  ? 'bg-govblue-600 text-white border border-govblue-500 shadow-md' 
                  : 'bg-white hover:bg-govblue-50 text-govgray-700 border border-govgray-200'
              }`}
            >
              <span className="text-2xl">{calc.icon}</span>
              <div>
                <div className="font-medium">{calc.name}</div>
                <div className={`text-sm ${activeCalc === calc.id ? 'text-blue-100' : 'text-govgray-500'}`}>
                  {calc.desc}
                </div>
              </div>
              {activeCalc === calc.id && (
                <span className="ml-auto text-govyellow-400">▶</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulário da Calculadora Ativa */}
      <div className="bg-white p-8 rounded-2xl border-2 border-govblue-600 shadow-lg">
        <h3 className="text-2xl font-bold text-govblue-800 mb-6">
          {calculadoras.find(c => c.id === activeCalc)?.name}
        </h3>
        {renderForm()}
        {renderResults()}
      </div>
    </div>
  )
}

export default CalculadoraTrabalhista
