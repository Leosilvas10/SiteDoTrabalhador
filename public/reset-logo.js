// Script para limpar localStorage e resetar logo
console.log('🔄 Limpando configurações antigas...')
localStorage.removeItem('site_config')
console.log('✅ Configurações limpas! Recarregando página...')
window.location.reload()
