// Categorias de receita disponíveis para lançamento mensal
export const INCOME_CATEGORIES = [
  { key: 'salario', label: 'Salário' },
  { key: 'decimoTerceiro', label: '13° Salário' },
  { key: 'dividendos', label: 'Dividendos' },
  { key: 'plr', label: 'PLR' },
  { key: 'receitaImoveis', label: 'Receita de Imóveis' },
  { key: 'reembolsoMedico', label: 'Reembolso Médico' },
  { key: 'deposito', label: 'Depósito' },
]

// Categorias de despesa — cada uma tem uma cor usada nos gráficos
export const EXPENSE_CATEGORIES = [
  { key: 'fixas', label: 'Despesas Fixas', color: '#ef4444' },
  { key: 'variaveis', label: 'Despesas Variáveis', color: '#f97316' },
  { key: 'extras', label: 'Extras', color: '#eab308' },
  { key: 'adicionais', label: 'Adicionais', color: '#8b5cf6' },
]

// Estrutura vazia de receitas — usada ao criar um novo mês sem dados anteriores
export const EMPTY_INCOME = {
  salario: [],
  decimoTerceiro: [],
  dividendos: [],
  plr: [],
  receitaImoveis: [],
  reembolsoMedico: [],
  deposito: [],
}

// Estrutura vazia de despesas — usada ao criar um novo mês
export const EMPTY_EXPENSES = {
  fixas: [],
  variaveis: [],
  extras: [],
  adicionais: [],
}
