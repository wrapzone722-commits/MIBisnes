/**
 * Формирует HTML-отчёт за месяц и возвращает строку для скачивания.
 * @param {Object} params
 * @param {Array} params.cars - массив авто (работ)
 * @param {string} params.yearMonth - "YYYY-MM"
 * @param {string} params.currency - валюта
 * @param {number} params.cardDiscountPercent - процент вычета при безнале
 */
export function buildMonthReportHtml({ cars, yearMonth, currency = '₽', cardDiscountPercent = 10 }) {
  const [year, month] = yearMonth.split('-').map(Number)
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month - 1 + 1, 0)
  const monthStartStr = monthStart.toISOString().slice(0, 10)
  const monthEndStr = monthEnd.toISOString().slice(0, 10)

  const percent = Math.min(50, Math.max(0, Number(cardDiscountPercent) || 0))

  const inMonth = (car) => {
    const d = car.date || car.expenses?.[0]?.date?.slice(0, 10)
    if (!d) return false
    return d >= monthStartStr && d <= monthEndStr
  }

  const getEffectivePrice = (car) => {
    if (car.paymentType !== 'card') return car.price
    return car.price * (1 - percent / 100)
  }

  const filtered = cars.filter(inMonth)
  let totalIncome = 0
  let totalExpenses = 0

  const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  const monthTitle = `${monthNames[month - 1]} ${year}`

  const formatMoney = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n))
  const formatDate = (s) => s ? new Date(s + 'T12:00:00').toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

  const rows = filtered.map((car, i) => {
    const income = getEffectivePrice(car)
    const expTotal = car.expenses.reduce((s, e) => s + e.amount, 0)
    const balance = income - expTotal
    totalIncome += income
    totalExpenses += expTotal
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${formatDate(car.date)}</td>
        <td>${escapeHtml(car.brand)} ${escapeHtml(car.model)}</td>
        <td>${escapeHtml(car.phone || '—')}</td>
        <td>${car.paymentType === 'card' ? 'Безнал' : 'Нал'}</td>
        <td class="num">${formatMoney(income)} ${currency}</td>
        <td class="num">${formatMoney(expTotal)} ${currency}</td>
        <td class="num">${formatMoney(balance)} ${currency}</td>
      </tr>`
  }).join('')

  const totalBalance = totalIncome - totalExpenses

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Отчёт за ${monthTitle} — MIbisnes</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 24px; color: #1a1a1a; background: #fff; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    .subtitle { color: #666; font-size: 0.95rem; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    .num { text-align: right; }
    .totals { font-weight: 600; background: #f9f9f9; }
    .foot { margin-top: 24px; font-size: 0.9rem; color: #666; }
  </style>
</head>
<body>
  <h1>Отчёт за месяц</h1>
  <p class="subtitle">${monthTitle} · MIbisnes</p>
  <table>
    <thead>
      <tr>
        <th>№</th>
        <th>Дата</th>
        <th>Авто</th>
        <th>Телефон</th>
        <th>Оплата</th>
        <th>Доход</th>
        <th>Расход</th>
        <th>Остаток</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="8">Нет данных за выбранный месяц</td></tr>'}
    </tbody>
    <tfoot>
      <tr class="totals">
        <td colspan="5">Итого</td>
        <td class="num">${formatMoney(totalIncome)} ${currency}</td>
        <td class="num">${formatMoney(totalExpenses)} ${currency}</td>
        <td class="num">${formatMoney(totalBalance)} ${currency}</td>
      </tr>
    </tfoot>
  </table>
  <p class="foot">Сформировано: ${new Date().toLocaleString('ru-RU')}</p>
</body>
</html>`

  return html
}

function escapeHtml(s) {
  if (s == null) return '—'
  const str = String(s)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Скачивает HTML-файл отчёта за месяц.
 */
export function downloadMonthReportHtml(params) {
  const html = buildMonthReportHtml(params)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mibisnes-otchet-${params.yearMonth}.html`
  a.click()
  URL.revokeObjectURL(url)
}
