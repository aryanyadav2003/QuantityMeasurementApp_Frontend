document.addEventListener('DOMContentLoaded', () => {

  // ── Tab Switching ──────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b   => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // ── Unit sync helper ───────────────────────
  function syncUnits(typeId, unitIds) {
    const sel = document.getElementById(typeId);
    if (!sel) return;
    const update = () => {
      const units = UNITS[sel.value] || [];
      unitIds.forEach(id => { const u = document.getElementById(id); if (u) populateSelect(u, units); });
    };
    sel.addEventListener('change', update);
    update();
  }

  // ── Show locked notice if not logged in ────
  function requireAuth(formId, alertId) {
    if (!TokenManager.isLoggedIn()) {
      const alertEl = document.getElementById(alertId);
      if (alertEl) showAlert(alertEl, '🔒 Please login to use this operation.', 'info');
      return false;
    }
    return true;
  }

  // ── COMPARE ────────────────────────────────
  syncUnits('compareType', ['compareUnit1', 'compareUnit2']);

  document.getElementById('compareForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAuth('compareForm', 'compareAlert')) return;
    const alertEl  = document.getElementById('compareAlert');
    const resultEl = document.getElementById('compareResult');
    hideAlert(alertEl);

    const type = document.getElementById('compareType').value;
    const q1   = QuantityAPI.buildQ(document.getElementById('compareVal1').value,  document.getElementById('compareUnit1').value, type);
    const q2   = QuantityAPI.buildQ(document.getElementById('compareVal2').value, document.getElementById('compareUnit2').value, type);

    const res = await QuantityAPI.compare(q1, q2);
    if (res.success) {
      const isEqual = res.data.resultString === 'True';
      showResult(resultEl,
        `<div class="result-value">${isEqual ? '✅ EQUAL' : '❌ NOT EQUAL'}</div>
         <div class="result-label">${q1.value} ${q1.unit} ${isEqual ? '==' : '!='} ${q2.value} ${q2.unit}</div>`);
    } else {
      showResult(resultEl, `<div style="color:var(--danger)">${res.error}</div>`, 'error');
    }
  });

  // ── CONVERT ────────────────────────────────
  syncUnits('convertType', ['convertFromUnit', 'convertToUnit']);

  document.getElementById('convertForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAuth('convertForm', 'convertAlert')) return;
    const alertEl  = document.getElementById('convertAlert');
    const resultEl = document.getElementById('convertResult');
    hideAlert(alertEl);

    const type   = document.getElementById('convertType').value;
    const q      = QuantityAPI.buildQ(document.getElementById('convertVal').value, document.getElementById('convertFromUnit').value, type);
    const toUnit = document.getElementById('convertToUnit').value;

    const res = await QuantityAPI.convert(q, toUnit);
    if (res.success) {
      showResult(resultEl,
        `<div class="result-value">${res.data.resultValue} ${res.data.resultUnit}</div>
         <div class="result-label">${q.value} ${q.unit} → ${toUnit}</div>`);
    } else {
      showResult(resultEl, `<div style="color:var(--danger)">${res.error}</div>`, 'error');
    }
  });

  // ── ADD ────────────────────────────────────
  syncUnits('addType', ['addUnit1', 'addUnit2', 'addTargetUnit']);

  document.getElementById('addForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAuth('addForm', 'addAlert')) return;
    const alertEl  = document.getElementById('addAlert');
    const resultEl = document.getElementById('addResult');
    hideAlert(alertEl);

    const type   = document.getElementById('addType').value;
    const q1     = QuantityAPI.buildQ(document.getElementById('addVal1').value, document.getElementById('addUnit1').value, type);
    const q2     = QuantityAPI.buildQ(document.getElementById('addVal2').value, document.getElementById('addUnit2').value, type);
    const target = document.getElementById('addTargetUnit').value;

    const res = await QuantityAPI.add(q1, q2, target);
    if (res.success) {
      showResult(resultEl,
        `<div class="result-value">${res.data.resultValue} ${res.data.resultUnit}</div>
         <div class="result-label">${q1.value} ${q1.unit} + ${q2.value} ${q2.unit}</div>`);
    } else {
      showResult(resultEl, `<div style="color:var(--danger)">${res.error}</div>`, 'error');
    }
  });

  // ── SUBTRACT ───────────────────────────────
  syncUnits('subtractType', ['subtractUnit1', 'subtractUnit2', 'subtractTargetUnit']);

  document.getElementById('subtractForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAuth('subtractForm', 'subtractAlert')) return;
    const alertEl  = document.getElementById('subtractAlert');
    const resultEl = document.getElementById('subtractResult');
    hideAlert(alertEl);

    const type   = document.getElementById('subtractType').value;
    const q1     = QuantityAPI.buildQ(document.getElementById('subtractVal1').value, document.getElementById('subtractUnit1').value, type);
    const q2     = QuantityAPI.buildQ(document.getElementById('subtractVal2').value, document.getElementById('subtractUnit2').value, type);
    const target = document.getElementById('subtractTargetUnit').value;

    const res = await QuantityAPI.subtract(q1, q2, target);
    if (res.success) {
      showResult(resultEl,
        `<div class="result-value">${res.data.resultValue} ${res.data.resultUnit}</div>
         <div class="result-label">${q1.value} ${q1.unit} − ${q2.value} ${q2.unit}</div>`);
    } else {
      showResult(resultEl, `<div style="color:var(--danger)">${res.error}</div>`, 'error');
    }
  });

  // ── DIVIDE ─────────────────────────────────
  syncUnits('divideType', ['divideUnit1', 'divideUnit2']);

  document.getElementById('divideForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAuth('divideForm', 'divideAlert')) return;
    const alertEl  = document.getElementById('divideAlert');
    const resultEl = document.getElementById('divideResult');
    hideAlert(alertEl);

    const type = document.getElementById('divideType').value;
    const q1   = QuantityAPI.buildQ(document.getElementById('divideVal1').value, document.getElementById('divideUnit1').value, type);
    const q2   = QuantityAPI.buildQ(document.getElementById('divideVal2').value, document.getElementById('divideUnit2').value, type);

    const res = await QuantityAPI.divide(q1, q2);
    if (res.success) {
      showResult(resultEl,
        `<div class="result-value">${res.data.scalarResult?.toFixed(4)}
          <small style="font-size:1rem;color:var(--text-muted)">(scalar)</small></div>
         <div class="result-label">${q1.value} ${q1.unit} ÷ ${q2.value} ${q2.unit}</div>`);
    } else {
      showResult(resultEl, `<div style="color:var(--danger)">${res.error}</div>`, 'error');
    }
  });
});