 const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const SMOOBU_KEY = 'd8cfsjABysSFHumEyPFR1PkzDSPVsCZJW0Y7HGB2Iz';

app.get('/api/:endpoint(*)', async (req, res) => {
  try {
    const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    const url = `https://login.smoobu.com/api/${req.params.endpoint}${qs}`;
    const response = await fetch(url, {
      headers: { 'Api-Key': SMOOBU_KEY, 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AlloConcierge</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(160deg,#0a0a0a,#111008,#0a0a0a);font-family:Georgia,serif;color:#f5f0e8;min-height:100vh}
.header{padding:18px 20px;border-bottom:1px solid rgba(212,175,55,.15);background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:10px}
.logo-icon{width:38px;height:38px;background:linear-gradient(135deg,#d4af37,#f5d77a);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px}
.logo-title{font-size:17px;font-weight:bold;color:#d4af37}
.logo-sub{font-size:10px;color:#a09070;text-transform:uppercase;letter-spacing:.1em}
.btn{padding:8px 14px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);border-radius:20px;color:#d4af37;font-size:12px;cursor:pointer;font-family:Georgia,serif}
.stats{padding:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.stat{background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.15);border-radius:16px;padding:14px 12px}
.stat-icon{font-size:20px;margin-bottom:4px}
.stat-value{font-size:20px;font-weight:bold;color:#d4af37}
.green{color:#4caf50!important}.blue{color:#2196f3!important}.orange{color:#ff9800!important}
.stat-label{font-size:10px;color:#a09070;text-transform:uppercase;letter-spacing:.06em;margin-top:2px}
.tabs{padding:12px 16px 0;display:flex;gap:8px}
.tab{padding:8px 16px;border-radius:20px;border:1px solid rgba(212,175,55,.2);background:transparent;color:#a09070;font-size:13px;cursor:pointer;font-family:Georgia,serif}
.tab.active{border-color:#d4af37;background:rgba(212,175,55,.15);color:#d4af37}
.content{padding:12px 16px;display:flex;flex-direction:column;gap:10px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.12);border-radius:14px;padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start}
.card-name{font-weight:bold;font-size:14px;color:#f5f0e8;margin-bottom:3px}
.card-prop{font-size:12px;color:#a09070;margin-bottom:2px}
.card-dates{font-size:12px;color:#6a5f50}
.card-price{font-size:14px;font-weight:bold;color:#4caf50;margin-bottom:4px;text-align:right}
.badge{font-size:10px;padding:3px 8px;border-radius:10px;display:inline-block}
.error{margin:16px;padding:14px;background:rgba(244,67,54,.1);border:1px solid rgba(244,67,54,.3);border-radius:12px;color:#ef9a9a;font-size:13px}
.empty{text-align:center;padding:40px;color:#6a5f50;font-size:14px}
.hidden{display:none}
</style>
</head>
<body>
<div class="header">
  <div class="logo">
    <div class="logo-icon">🏠</div>
    <div>
      <div class="logo-title">AlloConcierge</div>
      <div class="logo-sub" id="lastUpdate">Dashboard Smoobu</div>
    </div>
  </div>
  <button class="btn" onclick="loadData()">🔄 Actualiser</button>
</div>
<div id="error" class="error hidden"></div>
<div id="stats" class="stats hidden">
  <div class="stat"><div class="stat-icon">📅</div><div class="stat-value" id="s-month">-</div><div class="stat-label">Résas mois</div></div>
  <div class="stat"><div class="stat-icon">💰</div><div class="stat-value green" id="s-revenue">-</div><div class="stat-label">Revenus mois</div></div>
  <div class="stat"><div class="stat-icon">🏠</div><div class="stat-value" id="s-props">-</div><div class="stat-label">Propriétés</div></div>
  <div class="stat"><div class="stat-icon">🛬</div><div class="stat-value blue" id="s-checkin">-</div><div class="stat-label">Arrivées</div></div>
  <div class="stat"><div class="stat-icon">🛫</div><div class="stat-value orange" id="s-checkout">-</div><div class="stat-label">Départs</div></div>
  <div class="stat"><div class="stat-icon">💶</div><div class="stat-value" id="s-total">-</div><div class="stat-label">Revenus total</div></div>
</div>
<div class="tabs">
  <button class="tab active" onclick="showTab('reservations',this)">📅 Réservations</button>
  <button class="tab" onclick="showTab('properties',this)">🏠 Propriétés</button>
</div>
<div id="tab-reservations" class="content"></div>
<div id="tab-properties" class="content hidden"></div>
<script>
function showTab(n,btn){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');document.getElementById('tab-reservations').classList.toggle('hidden',n!=='reservations');document.getElementById('tab-properties').classList.toggle('hidden',n!=='properties')}
function fmt(d){return new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}
function fmtM(n){return Math.round(n).toLocaleString('fr-FR')+' €'}
function nights(r){return Math.round((new Date(r['departure'])-new Date(r['arrival']))/86400000)}
function statusInfo(r){const now=new Date(),arr=new Date(r['arrival']),dep=new Date(r['departure']);if(arr<=now&&dep>now)return{label:'En cours',color:'#4caf50'};if(arr>now)return{label:'À venir',color:'#d4af37'};return{label:'Passée',color:'#666'}}
async function loadData(){
  document.getElementById('lastUpdate').textContent='Chargement...';
  document.getElementById('error').classList.add('hidden');
  try{
    const[rr,ar]=await Promise.all([fetch('/api/reservations?pageSize=100'),fetch('/api/apartments')]);
    const resData=rr.ok?await rr.json():{};
    const aptData=ar.ok?await ar.json():{};
    render(resData,aptData);
    const now=new Date();
    document.getElementById('lastUpdate').textContent='Mis à jour '+now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  }catch(e){
    document.getElementById('error').textContent='Erreur de chargement. Réessaie.';
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('lastUpdate').textContent='Erreur';
  }
}
function render(resData,aptData){
  const bookings=resData.bookings||resData.data||[];
  const apartments=aptData.apartments||aptData.data||[];
  const today=new Date();
  const som=new Date(today.getFullYear(),today.getMonth(),1);
  const eom=new Date(today.getFullYear(),today.getMonth()+1,0);
  const real=bookings.filter(r=>!r['is-blocked-booking']);
  const thisMonth=real.filter(r=>{const d=new Date(r['arrival']);return d>=som&&d<=eom});
  const revenue=thisMonth.reduce((s,r)=>s+(r['price']||0),0);
  const totalRevenue=real.reduce((s,r)=>s+(r['price']||0),0);
  const ci=real.filter(r=>new Date(r['arrival']).toDateString()===today.toDateString());
  const co=real.filter(r=>new Date(r['departure']).toDateString()===today.toDateString());
  const upcoming=real.filter(r=>new Date(r['departure'])>=today).sort((a,b)=>new Date(a['arrival'])-new Date(b['arrival']));
  document.getElementById('s-month').textContent=thisMonth.length;
  document.getElementById('s-revenue').textContent=fmtM(revenue);
  document.getElementById('s-props').textContent=apartments.length;
  document.getElementById('s-checkin').textContent=ci.length;
  document.getElementById('s-checkout').textContent=co.length;
  document.getElementById('s-total').textContent=fmtM(totalRevenue);
  document.getElementById('stats').classList.remove('hidden');
  const rd=document.getElementById('tab-reservations');
  rd.innerHTML=upcoming.length===0?'<div class="empty">Aucune réservation</div>':upcoming.map(r=>{const s=statusInfo(r);const name=(r['guest-name']||(r['firstname']?r['firstname']+' '+(r['lastname']||''):'Guest')).trim()||'Guest';const prop=r['apartment']?r['apartment']['name']:'Propriété';const channel=r['channel']?r['channel']['name']:'';return'<div class="card"><div style="flex:1;min-width:0"><div class="card-name">'+name+'</div><div class="card-prop">'+prop+(channel?' · '+channel:'')+'</div><div class="card-dates">'+fmt(r['arrival'])+' → '+fmt(r['departure'])+' · '+nights(r)+' nuit'+(nights(r)>1?'s':'')+'</div></div><div style="flex-shrink:0;margin-left:12px;text-align:right"><div class="card-price">'+(r['price']?fmtM(r['price']):'N/A')+'</div><span class="badge" style="background:'+s.color+'20;color:'+s.color+';border:1px solid '+s.color+'40">'+s.label+'</span></div></div>'}).join('');
  const ad=document.getElementById('tab-properties');
  ad.innerHTML=apartments.length===0?'<div class="empty">Aucune propriété</div>':apartments.map(apt=>'<div class="card" style="flex-direction:column"><div style="font-weight:bold;font-size:14px;color:#d4af37;margin-bottom:4px">'+(apt.name||'Propriété')+'</div><div style="font-size:12px;color:#a09070">'+(apt.location||apt.city||'Rouen')+'</div>'+(apt.maxPersons?'<div style="font-size:12px;color:#6a5f50;margin-top:2px">👤 '+apt.maxPersons+' personnes max</div>':'')+'</div>').join('');
}
loadData();
</script>
</body>
</html>`);
});

app.listen(process.env.PORT || 3000); document.getElementById('s-month