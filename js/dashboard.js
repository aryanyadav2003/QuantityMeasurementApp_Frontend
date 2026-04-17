document.addEventListener('DOMContentLoaded', async () => {

  // ── Refresh dashboard after login/register ─
  window.onAuthSuccess = async () => {
    updateDashboard();
  };

  updateDashboard();

  async function updateDashboard() {
    const isLoggedIn = TokenManager.isLoggedIn();
    const isAdmin    = TokenManager.isAdmin();

    // Show/hide sections based on auth state
    document.querySelectorAll('.guest-only').forEach(el => {
      el.style.display = isLoggedIn ? 'none' : 'block';
    });
    document.querySelectorAll('.auth-only').forEach(el => {
      el.style.display = isLoggedIn ? 'block' : 'none';
    });
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = isAdmin ? 'block' : 'none';
    });

    if (!isAdmin) return;

    // Load count
    const countRes = await QuantityAPI.getCount();
    if (countRes.success) {
      document.getElementById('totalCount').textContent = countRes.data.TotalCount ?? 0;
    }

    // Load history
    await loadHistory();

    // Filter by operation
    document.getElementById('filterOperation').addEventListener('change', async (e) => {
      const val = e.target.value;
      document.getElementById('filterType').value = 'ALL';
      if (val === 'ALL') await loadHistory();
      else {
        const res = await QuantityAPI.getByOperation(val);
        renderHistoryTable(res.success ? res.data : []);
      }
    });

    // Filter by type
    document.getElementById('filterType').addEventListener('change', async (e) => {
      const val = e.target.value;
      document.getElementById('filterOperation').value = 'ALL';
      if (val === 'ALL') await loadHistory();
      else {
        const res = await QuantityAPI.getByType(val);
        renderHistoryTable(res.success ? res.data : []);
      }
    });
  }
});

async function loadHistory() {
  const res = await QuantityAPI.getHistory();
  renderHistoryTable(res.success ? res.data : []);
}

function renderHistoryTable(data) {
  const tbody = document.getElementById('historyBody');
  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted)">No records found.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(row => `
    <tr>
      <td><span class="op-badge ${row.operation}">${row.operation}</span></td>
      <td>${row.operand1Value} ${row.operand1Unit}</td>
      <td>${row.operand2Value != null ? `${row.operand2Value} ${row.operand2Unit}` : '—'}</td>
      <td>${formatResult(row)}</td>
      <td><span class="badge badge-user" style="font-size:0.7rem">${row.operand1MeasurementType}</span></td>
      <td style="white-space:nowrap">${new Date(row.timestamp).toLocaleTimeString()}</td>
    </tr>
  `).join('');
}

function formatResult(row) {
  if (row.hasError)                return `<span style="color:var(--danger)">⚠ Error</span>`;
  if (row.operation === 'COMPARE') return row.comparisonResult ? '✅ Equal' : '❌ Not Equal';
  if (row.operation === 'DIVIDE')  return `${row.scalarResult?.toFixed(4)} <small>(scalar)</small>`;
  return `${row.resultValue} ${row.resultUnit ?? ''}`;
}