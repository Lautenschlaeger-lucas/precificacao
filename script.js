/* ============================================================
   CONFIG MARKETPLACES
   ============================================================ */
const MP = {
  mlclassico:    { comissao:14, impostos:0,  fixoMp:0, labelCom:'Comissão ML Clássico',      labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  mlpremium:     { comissao:19, impostos:0,  fixoMp:0, labelCom:'Comissão ML Premium',       labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  amazon:        { comissao:20, impostos:0,  fixoMp:0, labelCom:'Comissão Amazon',           labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  magalu:        { comissao:16, impostos:0,  fixoMp:0, labelCom:'Comissão Magalu',           labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  aliexpress:    { comissao:8,  impostos:0,  fixoMp:0, labelCom:'Comissão AliExpress',       labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  americanas:    { comissao:19, impostos:0,  fixoMp:0, labelCom:'Comissão Americanas',       labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  carrefour:     { comissao:16, impostos:0,  fixoMp:0, labelCom:'Comissão Carrefour',        labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  casasbahia:    { comissao:21, impostos:0,  fixoMp:0, labelCom:'Comissão Casas Bahia',      labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  kabum:         { comissao:14, impostos:0,  fixoMp:0, labelCom:'Comissão KaBuM!',           labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  leroymerlin:   { comissao:18, impostos:0,  fixoMp:0, labelCom:'Comissão Leroy Merlin',     labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  colombo:       { comissao:20, impostos:0,  fixoMp:0, labelCom:'Comissão Lojas Colombo',    labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  madeiramadeira:{ comissao:20, impostos:0,  fixoMp:0, labelCom:'Comissão Madeira-Madeira',  labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  netshoes:      { comissao:20, impostos:0,  fixoMp:0, labelCom:'Comissão Netshoes',         labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  olist:         { comissao:21, impostos:0,  fixoMp:0, labelCom:'Comissão Olist',            labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  shein:         { comissao:16, impostos:0,  fixoMp:0, labelCom:'Comissão Shein',            labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  shopify:       { comissao:2,  impostos:0,  fixoMp:0, labelCom:'Comissão Shopify',          labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  tiktok:        { comissao:12, impostos:0,  fixoMp:0, labelCom:'Comissão TikTok Shop',      labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  wish:          { comissao:5,  impostos:0,  fixoMp:0, labelCom:'Comissão Wish',             labelImpostos:'Impostos (%)', labelFixoMp:'Fixo Marketplace (R$)' },
  shopee: {
    labelCom: 'Comissão (definida pela faixa)',
    labelImpostos: 'Impostos (%)',
    labelFixoMp: 'Fixo Marketplace (R$)',
    tipo: 'faixas',
    faixas: [
      { id:0, min:0,    max:7.99,      com:0,  tar:0,  tarifaPct:50, pixPct:0 },
      { id:1, min:8,    max:79.99,     com:20, tar:4,  tarifaPct:0,  pixPct:0 },
      { id:2, min:80,   max:99.99,     com:14, tar:16, tarifaPct:0,  pixPct:5 },
      { id:3, min:100,  max:199.99,    com:14, tar:20, tarifaPct:0,  pixPct:5 },
      { id:4, min:200,  max:499.99,    com:14, tar:26, tarifaPct:0,  pixPct:5 },
      { id:5, min:500,  max:Infinity,  com:14, tar:26, tarifaPct:0,  pixPct:8 }
    ]
  }
};

/* ============================================================
   HELPERS
   ============================================================ */
const R$   = n => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(n);
const pct  = n => n.toFixed(1).replace('.', ',') + '%';
const dec3 = n => n.toFixed(3).replace('.', ',');
const val  = id => parseFloat(document.getElementById(id).value) || 0;
const el   = id => document.getElementById(id);
const txt  = (id, v) => el(id).textContent = v;
const html = (id, v) => el(id).innerHTML = v;

const bdShow = (liId, labelId, labelTxt, valId, valor) => {
  el(liId).classList.add('ativo');
  txt(labelId, labelTxt);
  txt(valId, R$(valor));
};
const bdHide = liId => el(liId).classList.remove('ativo');

/* ============================================================
   SHOPEE
   ============================================================ */
function shopeeFaixa(preco) {
  const f = MP.shopee.faixas;
  return f.find(x => preco >= x.min && preco <= x.max) || f[f.length - 1];
}

function calcPrecoFaixa(custoBase, margemPct, faixa, adicPct) {
  if (faixa.tarifaPct > 0) {
    const soma = margemPct + faixa.com + faixa.tarifaPct + adicPct;
    if (soma >= 100) return null;
    return custoBase / (1 - soma / 100);
  } else {
    const soma = margemPct + faixa.com + adicPct;
    if (soma >= 100) return null;
    return (custoBase + faixa.tar) / (1 - soma / 100);
  }
}

function shopeeCalc(custoBase, margemPct, adicPct) {
  const faixas = MP.shopee.faixas;

  for (const f of faixas) {
    const preco = calcPrecoFaixa(custoBase, margemPct, f, adicPct);
    if (preco === null || preco <= 0 || !isFinite(preco)) continue;
    if (preco >= f.min && preco <= f.max) return { preco, faixa: f };
  }

  let faixa = faixas[3];
  for (let i = 0; i < 15; i++) {
    const preco = calcPrecoFaixa(custoBase, margemPct, faixa, adicPct);
    if (preco === null || preco <= 0 || !isFinite(preco)) { faixa = faixas[faixas.length - 1]; continue; }
    const nova = shopeeFaixa(preco);
    if (nova === faixa) return { preco, faixa };
    faixa = nova;
  }

  const f = faixas[faixas.length - 1];
  const preco = calcPrecoFaixa(custoBase, margemPct, f, adicPct);
  if (!preco || preco <= 0) return null;
  return { preco, faixa: f };
}

/* ============================================================
   APLICAR CONFIG DO MARKETPLACE
   ============================================================ */
function aplicarMP() {
  const mpId    = el('calcMp').value;
  const cfg     = MP[mpId];
  const isShopee = mpId === 'shopee';

  txt('labelComissao', cfg.labelCom);
  txt('labelImpostos', cfg.labelImpostos);
  txt('labelFixoMp',   cfg.labelFixoMp);

  if (!isShopee) {
    el('comissao').value = cfg.comissao;
    el('fixoMp').value   = cfg.fixoMp;
  }

  el('comissao').disabled = isShopee;
  el('fixoMp').disabled   = isShopee;
  el('pixToggleWrap').classList.toggle('ativo', isShopee);
}

/* ============================================================
   LIMPAR ELEMENTOS SHOPEE
   ============================================================ */
function limparShopee() {
  el('badgeTier').classList.remove('ativo');
  el('badgePix').classList.remove('ativo');
  el('precoPix').classList.remove('ativo');
  el('liPix').classList.remove('ativo');
  el('dt05Pix').classList.remove('ativo');
}

/* ============================================================
   CALCULAR
   ============================================================ */
function calcular() {
  const mpId     = el('calcMp').value;
  const isShopee = mpId === 'shopee';
  const warn     = el('calcWarning');
  const method   = el('methodToggle').checked ? 'custo' : 'venda';

  limparShopee();

  const custo       = val('custo');
  const frete       = val('frete');
  const margem      = val('margem');
  const impostos    = val('impostos');
  const outrasPct   = val('outrasPct');
  const operacional = val('operacional');

  /* ══════════════════════════════════════════════
     SHOPEE
     ══════════════════════════════════════════════ */
  if (isShopee) {
    const custoBase = custo + frete + operacional;

    const margemLucro = method === 'custo' ? custo * margem / 100 : null;
    const margemEff   = method === 'custo' ? 0 : margem;
    const precoBase   = method === 'custo' ? custoBase + margemLucro : custoBase;
    const result      = shopeeCalc(precoBase, margemEff, impostos + outrasPct);

    if (!result || !isFinite(result.preco) || result.preco <= 0) {
      warn.hidden = false;
      warn.textContent = 'Não foi possível calcular com a margem desejada. Reduza a margem ou verifique os dados.';
      txt('precoFinal', '—');
      ['bdCusto','bdComissao','bdMargem','bdImpostos','bdTarifaFixa'].forEach(id => txt(id, '—'));
      bdHide('liTarifaFixa'); bdHide('liImpostos');
      limparShopee();
      return;
    }

    warn.hidden = true;
    const { preco, faixa } = result;
    const tarifaVar = faixa.tarifaPct > 0;

    const comPct = tarifaVar ? faixa.tarifaPct : faixa.com;
    const comV   = preco * comPct / 100;

    const tarifaV = tarifaVar ? 0 : faixa.tar;

    const impostosV = preco * impostos / 100;
    const outrasV   = preco * outrasPct / 100;
    const impostosOutrasV = impostosV + outrasV;

    const pixPct   = el('pixToggle').checked ? faixa.pixPct : 0;
    const precoPixV = preco * (1 - pixPct / 100);
    const descPix  = preco - precoPixV;
    const temPix   = pixPct > 0;

    const margemV = method === 'custo'
      ? margemLucro
      : preco * margem / 100;

    txt('precoFinal', R$(preco));

    if (temPix) {
      el('precoPix').classList.add('ativo');
      txt('precoPixVal',  R$(precoPixV));
      txt('precoPixNota', `desconto de ${pct(pixPct)} absorvido pelo vendedor = ${R$(descPix)}`);
    }

    el('badgeTier').classList.add('ativo');
    txt('badgeTierTag',  `Faixa ${faixa.id}`);
    txt('badgeTierInfo', tarifaVar
      ? `${faixa.tarifaPct}% do preço`
      : `${faixa.com}% + R$ ${faixa.tar.toFixed(2).replace('.', ',')}`);

    if (temPix) {
      el('badgePix').classList.add('ativo');
      txt('badgePixInfo', `${pixPct}% descontado no Pix`);
    }

    txt('bdCusto', R$(custoBase));

    txt('bdLabelComissao', tarifaVar
      ? `Comissão + Tarifa Faixa ${faixa.id} (${faixa.tarifaPct}%)`
      : `Comissão Shopee (${faixa.com}%)`);
    txt('bdComissao', R$(comV));

    if (!tarifaVar && tarifaV > 0) {
      bdShow('liTarifaFixa', 'bdLabelTarifaFixa', `Tarifa fixa Faixa ${faixa.id}`, 'bdTarifaFixa', tarifaV);
    } else {
      bdHide('liTarifaFixa');
    }

    if (impostosOutrasV > 0) {
      const impLabel = outrasPct > 0
        ? `Impostos ${pct(impostos)} + Outras ${pct(outrasPct)}`
        : `Impostos (${pct(impostos)})`;
      bdShow('liImpostos', 'bdLabelImpostos', impLabel, 'bdImpostos', impostosOutrasV);
    } else {
      bdHide('liImpostos');
    }

    if (temPix) {
      el('liPix').classList.add('ativo');
      txt('bdPix', `− ${R$(descPix)}`);
    } else {
      el('liPix').classList.remove('ativo');
    }

    txt('bdMargem', R$(margemV));

    if (tarifaVar) {
      const pctDiv  = margemEff + faixa.tarifaPct + impostos + outrasPct;
      const divisor = 1 - pctDiv / 100;

      if (method === 'custo') {
        html('dt01Desc',
          `Custo base = <strong>${R$(custo)}</strong> (custo) + <strong>${R$(frete)}</strong> (frete) + <strong>${R$(operacional)}</strong> (operacional)<br>`+
          `<small style="color:var(--texto-painel-mudo)">⚠️ Faixa ${faixa.id}: comissão de <strong style="color:var(--texto-painel)">${faixa.tarifaPct}% do preço</strong> — variável, entra no divisor</small>`);
        txt('dt01Res', R$(custoBase));

        html('dt02Desc',
          `Margem s/ produto = ${R$(custo)} × ${pct(margem)} = <strong>${R$(margemLucro)}</strong><br>`+
          `Preço base = ${R$(custoBase)} + ${R$(margemLucro)} = <strong>${R$(precoBase)}</strong><br>`+
          `<small style="color:var(--texto-painel-mudo)">Margem de ${pct(margem)} aplicada <strong>apenas sobre o custo do produto</strong>, frete/operacional sem margem</small>`);
        txt('dt02Res', R$(precoBase));

        html('dt03Desc',
          `Divisor = 1 − (${pct(faixa.tarifaPct)} + ${pct(impostos)} + ${pct(outrasPct)}) ÷ 100 = 1 − ${dec3(pctDiv / 100)}<br>`+
          `<small style="color:var(--texto-painel-mudo)">Comissão ${pct(faixa.tarifaPct)} + impostos + outras% — margem já está no numerador</small>`);
        txt('dt03Res', dec3(divisor));

        html('dt04Desc',
          `Preço de venda = ${R$(precoBase)} ÷ ${dec3(divisor)}`);
        txt('dt04Res', R$(preco));

      } else {
        html('dt01Desc',
          `Custo base = <strong>${R$(custo)}</strong> (custo) + <strong>${R$(frete)}</strong> (frete) + <strong>${R$(operacional)}</strong> (operacional)`);
        txt('dt01Res', R$(custoBase));

        html('dt02Desc',
          `Soma dos percentuais = <strong>${pct(margem)}</strong> (margem) + <strong>${pct(faixa.tarifaPct)}</strong> (comissão Faixa ${faixa.id})`+
          `${impostos ? ` + <strong>${pct(impostos)}</strong> (impostos)` : ''}${outrasPct ? ` + <strong>${pct(outrasPct)}</strong> (outras)` : ''}`);
        txt('dt02Res', pct(pctDiv));

        html('dt03Desc', `Divisor = 1 − ${dec3(pctDiv / 100)}`);
        txt('dt03Res', dec3(divisor));

        html('dt04Desc', `Preço de venda = ${R$(custoBase)} ÷ ${dec3(divisor)}`);
        txt('dt04Res', R$(preco));
      }

    } else {
      const pctDiv  = margemEff + faixa.com + impostos + outrasPct;
      const divisor = 1 - pctDiv / 100;

      if (method === 'custo') {
        const totalComMargem = precoBase + faixa.tar;
        html('dt01Desc',
          `Custo base = <strong>${R$(custo)}</strong> (custo) + <strong>${R$(frete)}</strong> (frete) + <strong>${R$(operacional)}</strong> (operacional)<br>`+
          `<small style="color:var(--texto-painel-mudo)">Tarifa fixa de <strong>${R$(faixa.tar)}</strong> (Faixa ${faixa.id}) é somada após a margem</small>`);
        txt('dt01Res', R$(custoBase));

        html('dt02Desc',
          `Margem s/ produto = ${R$(custo)} × ${pct(margem)} = <strong>${R$(margemLucro)}</strong><br>`+
          `Preço base = ${R$(custoBase)} + ${R$(margemLucro)} = <strong>${R$(precoBase)}</strong><br>`+
          `+ tarifa fixa Faixa ${faixa.id} = ${R$(precoBase)} + ${R$(faixa.tar)} = <strong>${R$(totalComMargem)}</strong><br>`+
          `<small style="color:var(--texto-painel-mudo)">Margem de ${pct(margem)} apenas sobre o custo do produto</small>`);
        txt('dt02Res', R$(totalComMargem));

        html('dt03Desc',
          `Divisor = 1 − (${pct(faixa.com)} comissão${impostos ? ` + ${pct(impostos)} impostos` : ''}${outrasPct ? ` + ${pct(outrasPct)} outras` : ''}) ÷ 100 = 1 − ${dec3(pctDiv / 100)}<br>`+
          `<small style="color:var(--texto-painel-mudo)">Tarifa fixa já está no numerador; só % entram no divisor</small>`);
        txt('dt03Res', dec3(divisor));

        html('dt04Desc', `Preço de venda = ${R$(totalComMargem)} ÷ ${dec3(divisor)}`);
        txt('dt04Res', R$(preco));

      } else {
        const ctBase = custoBase + faixa.tar;
        html('dt01Desc',
          `Custo base = <strong>${R$(custo)}</strong> + <strong>${R$(frete)}</strong> (frete) + <strong>${R$(operacional)}</strong> (operacional) + <strong>${R$(faixa.tar)}</strong> (tarifa fixa Faixa ${faixa.id})<br>`+
          `<small style="color:var(--texto-painel-mudo)">Tarifa fixa não varia com o preço → entra no numerador como custo</small>`);
        txt('dt01Res', R$(ctBase));

        html('dt02Desc',
          `Soma dos percentuais = <strong>${pct(margem)}</strong> (margem) + <strong>${pct(faixa.com)}</strong> (comissão Faixa ${faixa.id})`+
          `${impostos ? ` + <strong>${pct(impostos)}</strong> (impostos)` : ''}${outrasPct ? ` + <strong>${pct(outrasPct)}</strong> (outras)` : ''}`);
        txt('dt02Res', pct(pctDiv));

        html('dt03Desc',
          `Divisor = 1 − (${pct(pctDiv)} ÷ 100) = 1 − ${dec3(pctDiv / 100)}`);
        txt('dt03Res', dec3(divisor));

        html('dt04Desc', `Preço de venda = ${R$(ctBase)} ÷ ${dec3(divisor)}`);
        txt('dt04Res', R$(preco));
      }
    }

    if (temPix) {
      el('dt05Pix').classList.add('ativo');
      html('dt05Desc',
        `Preço com Pix = ${R$(preco)} × (1 − ${pct(pixPct)}) = ${R$(preco)} × ${dec3(1 - pixPct / 100)}<br>`+
        `<small style="color:var(--texto-painel-mudo)">Subsídio Pix de ${pct(pixPct)} absorvido pelo vendedor</small>`);
      txt('dt05Res', R$(precoPixV));
      html('dt05Nota',
        `<span style="color:var(--texto-painel-mudo)">Diferença: ${R$(descPix)} | Faixa ${faixa.id}: ${faixa.com}% + R$ ${faixa.tar.toFixed(2).replace('.', ',')}</span>`);
    }

    return;
  }

  /* ══════════════════════════════════════════════
     MARKETPLACE SIMPLES
     ══════════════════════════════════════════════ */
  const comissao   = val('comissao');
  const fixoMp     = val('fixoMp');
  const custoTotal = custo + frete + fixoMp + operacional;

  const pctNoDivisor = method === 'custo'
    ? comissao + impostos + outrasPct
    : margem + comissao + impostos + outrasPct;

  if (pctNoDivisor >= 100) {
    warn.hidden = false;
    warn.textContent = method === 'custo'
      ? `Comissão + impostos + outros somam ${pct(pctNoDivisor)} — igual ou acima de 100%. Reduza.`
      : `Margem + comissão + impostos + outros somam ${pct(pctNoDivisor)} — igual ou acima de 100%. Reduza.`;
    txt('precoFinal', '—');
    ['bdCusto','bdComissao','bdMargem','bdImpostos','bdTarifaFixa'].forEach(id => txt(id, '—'));
    bdHide('liTarifaFixa'); bdHide('liImpostos');
    return;
  }

  warn.hidden = true;

  const divisor   = 1 - pctNoDivisor / 100;

  const margemLucro = method === 'custo' ? custo * margem / 100 : null;
  const precoBase   = method === 'custo' ? custoTotal + margemLucro : null;
  const preco       = method === 'custo' ? precoBase / divisor : custoTotal / divisor;

  const comV            = preco * comissao / 100;
  const impostosOutrasV = preco * (impostos + outrasPct) / 100;
  const margemV         = method === 'custo'
    ? margemLucro
    : preco * margem / 100;

  txt('precoFinal', R$(preco));

  txt('bdCusto',    R$(custoTotal));
  txt('bdLabelComissao', `Comissão (${pct(comissao)})`);
  txt('bdComissao',     R$(comV));

  if (fixoMp > 0) {
    bdShow('liTarifaFixa', 'bdLabelTarifaFixa', 'Fixo Marketplace (R$)', 'bdTarifaFixa', fixoMp);
  } else {
    bdHide('liTarifaFixa');
  }

  if (impostosOutrasV > 0) {
    const impLabel = outrasPct > 0
      ? `Impostos ${pct(impostos)} + Outras ${pct(outrasPct)}`
      : `Impostos (${pct(impostos)})`;
    bdShow('liImpostos', 'bdLabelImpostos', impLabel, 'bdImpostos', impostosOutrasV);
  } else {
    bdHide('liImpostos');
  }

  txt('bdMargem', R$(margemV));

  if (method === 'custo') {
    html('dt01Desc',
      `Custo total = <strong>${R$(custo)}</strong> (custo) + <strong>${R$(frete)}</strong> (frete) + <strong>${R$(fixoMp)}</strong> (fixo MP) + <strong>${R$(operacional)}</strong> (operacional)<br>`+
      `<small style="color:var(--texto-painel-mudo)">Valores fixos somam na base — margem incide apenas sobre o custo do produto</small>`);
    txt('dt01Res', R$(custoTotal));

    html('dt02Desc',
      `Margem s/ produto = ${R$(custo)} × ${pct(margem)} = <strong>${R$(margemLucro)}</strong><br>`+
      `Preço base = ${R$(custoTotal)} + ${R$(margemLucro)} = <strong>${R$(precoBase)}</strong><br>`+
      `<small style="color:var(--texto-painel-mudo)">Margem de ${pct(margem)} aplicada <strong>apenas sobre o custo do produto</strong></small>`);
    txt('dt02Res', R$(precoBase));

    html('dt03Desc',
      `Divisor = 1 − (${pct(comissao)} comissão${impostos ? ` + ${pct(impostos)} impostos` : ''}${outrasPct ? ` + ${pct(outrasPct)} outras` : ''}) ÷ 100 = 1 − ${dec3(pctNoDivisor / 100)}<br>`+
      `<small style="color:var(--texto-painel-mudo)">Apenas % no divisor — margem já embutida no preço base</small>`);
    txt('dt03Res', dec3(divisor));

    html('dt04Desc',
      `Preço de venda = ${R$(precoBase)} ÷ ${dec3(divisor)}<br>`+
      `<small style="color:var(--texto-painel-mudo)">Resultado: ${pct(margem)} de margem sobre o custo do produto, taxas sobre o preço final</small>`);
    txt('dt04Res', R$(preco));

  } else {
    html('dt01Desc',
      `Custo total = <strong>${R$(custo)}</strong> (custo) + <strong>${R$(frete)}</strong> (frete) + <strong>${R$(fixoMp)}</strong> (fixo MP) + <strong>${R$(operacional)}</strong> (operacional)<br>`+
      `<small style="color:var(--texto-painel-mudo)">Valores fixos somam na base — não variam com o preço de venda</small>`);
    txt('dt01Res', R$(custoTotal));

    html('dt02Desc',
      `Soma dos percentuais = <strong>${pct(margem)}</strong> (margem) + <strong>${pct(comissao)}</strong> (comissão)`+
      `${impostos ? ` + <strong>${pct(impostos)}</strong> (impostos)` : ''}${outrasPct ? ` + <strong>${pct(outrasPct)}</strong> (outras %)` : ''}`);
    txt('dt02Res', pct(pctNoDivisor));

    html('dt03Desc',
      `Divisor = 1 − (${pct(pctNoDivisor)} ÷ 100) = 1 − ${dec3(pctNoDivisor / 100)}<br>`+
      `<small style="color:var(--texto-painel-mudo)">A fatia do preço que sobra depois de tirar todas as % é o divisor</small>`);
    txt('dt03Res', dec3(divisor));

    html('dt04Desc',
      `Preço de venda = ${R$(custoTotal)} ÷ ${dec3(divisor)}<br>`+
      `<small style="color:var(--texto-painel-mudo)">Resultado: a margem de ${pct(margem)} agora incide sobre o preço, não sobre o custo</small>`);
    txt('dt04Res', R$(preco));
  }
}

/* ============================================================
   LISTENERS
   ============================================================ */
document.querySelectorAll('#calculadora input').forEach(e => e.addEventListener('input', calcular));
el('calcMp').addEventListener('change', () => { aplicarMP(); calcular(); });
el('pixToggle').addEventListener('change', calcular);
el('methodToggle').addEventListener('change', function () {
  const isCusto = this.checked;
  el('methodLblVenda').classList.toggle('ativo', !isCusto);
  el('methodLblCusto').classList.toggle('ativo', isCusto);
  txt('labelMargem', isCusto
    ? 'Margem de Lucro (%) (Por preço de custo)'
    : 'Margem de Lucro (%) (Por preço de venda)');
  calcular();
});
el('btnDetalhar').addEventListener('click', function () {
  const open = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', String(!open));
  el('detalheCalculo').classList.toggle('aberto', !open);
});

el('methodLblVenda').classList.add('ativo');
window.scrollTo(0, 0);
aplicarMP();
calcular();
