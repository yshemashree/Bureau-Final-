"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield, CheckCircle, XCircle, Globe, MapPin, ChevronRight, ChevronLeft,
  AlertTriangle, Search, User, Building2, Send, DollarSign, Wifi, Battery,
  Signal as SignalIcon, Bell, FileText, Scale, Clock, ThumbsUp, ThumbsDown, Flag,
  Users, RotateCcw, ShieldCheck, ShieldAlert, ArrowRight, Banknote, Eye,
  ArrowLeft, Ban, MessageSquare, Zap, Activity, Smartphone, TrendingUp,
  Timer, Gauge as GaugeIcon, Fingerprint, MapPinOff
} from "lucide-react";
import { DemoShell } from "@/components/demo-shell";

const T={primary:"#253B80",orange:"#EA580C",orangeBg:"rgba(234,88,12,0.08)",rose:"#E11D48",roseBg:"rgba(225,29,72,0.08)",amber:"#D97706",amberBg:"rgba(217,119,6,0.08)",emerald:"#059669",emeraldBg:"rgba(5,150,105,0.08)",blue:"#2563EB",blueBg:"rgba(37,99,235,0.08)",teal:"#0D9488",tealBg:"rgba(13,148,136,0.08)",bg:"#f5f7fa",white:"#fff",border:"#e5e7eb",borderLight:"#f3f4f6",t900:"#111827",t700:"#374151",t500:"#6b7280",t400:"#9ca3af",t300:"#d1d5db",mono:"ui-monospace,SFMono-Regular,'SF Mono',Menlo,monospace",sans:"ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"};

function detectRegion(){try{const z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";if(/Kolkata|Mumbai|Chennai|Calcutta|Delhi/.test(z))return"IN";if(/Singapore|Kuala_Lumpur|Jakarta|Bangkok|Manila|Ho_Chi_Minh/.test(z))return"SEA";return"US";}catch{return"US";}}
const RI={
  US:{flag:"🇺🇸",country:"United States",city:"New York",cur:"USD",sym:"$",sName:"James Anderson",sAddr:"142 West 57th St, New York, NY 10019",sBank:"JPMorgan Chase Bank, N.A.",sAcct:"****7834",dCountry:"United Kingdom",dFlag:"🇬🇧",dCur:"GBP",dRate:0.79,rName:"Sarah Mitchell",rAddr:"14 Canary Wharf, London E14 5AB",rBank:"Barclays Bank UK PLC",rAcct:"****3319",corr:"US → UK"},
  IN:{flag:"🇮🇳",country:"India",city:"Mumbai",cur:"INR",sym:"₹",sName:"Rajesh Sharma",sAddr:"Bandra West, Mumbai, MH 400050",sBank:"HDFC Bank Ltd.",sAcct:"****6192",dCountry:"Singapore",dFlag:"🇸🇬",dCur:"SGD",dRate:0.016,rName:"Wei Lin Tan",rAddr:"78 Shenton Way, Singapore 079120",rBank:"DBS Bank Ltd.",rAcct:"****8837",corr:"IN → SG"},
  SEA:{flag:"🇸🇬",country:"Singapore",city:"Singapore",cur:"SGD",sym:"S$",sName:"Wei Lin Tan",sAddr:"78 Shenton Way, Singapore 079120",sBank:"DBS Bank Ltd.",sAcct:"****8837",dCountry:"Australia",dFlag:"🇦🇺",dCur:"AUD",dRate:1.01,rName:"Emma Clarke",rAddr:"200 George St, Sydney NSW 2000",rBank:"Commonwealth Bank",rAcct:"****5512",corr:"SG → AU"},
};
const flagR={name:"Unknown Recipient",addr:"Lagos, Nigeria",bank:"First Bank of Nigeria",acct:"****9087",country:"Nigeria",flag:"🇳🇬"};

/* PP Logo */
const PP_IMG="data:image/png;base64,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";
const PPLogo=({size=80,white=false})=>white?(<div style={{display:"flex",alignItems:"baseline",gap:size*0.04}}><span style={{fontSize:size*0.32,fontWeight:800,color:"#fff",letterSpacing:-0.5,fontStyle:"italic",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>Pay</span><span style={{fontSize:size*0.32,fontWeight:800,color:"rgba(255,255,255,0.6)",letterSpacing:-0.5,fontStyle:"italic",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>Pal</span></div>):(<img src={PP_IMG} alt="PayPal" style={{height:size*0.27,width:"auto",objectFit:"contain"}}/>);

/* Phone */
const StatusBar=()=>{const[t,sT]=useState("");useEffect(()=>{const u=()=>sT(new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}));u();const iv=setInterval(u,10000);return()=>clearInterval(iv);},[]);return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 20px 4px",fontSize:11,fontWeight:600,color:"#1a1a1a"}}><span style={{fontWeight:700,letterSpacing:0.3}}>{t}</span><div style={{width:72,height:22,borderRadius:16,background:"#1a1a1a"}}/><div style={{display:"flex",gap:3,alignItems:"center"}}><SignalIcon size={11}/><Wifi size={11}/><div style={{width:18,height:9,borderRadius:2,border:"1.5px solid #1a1a1a",position:"relative",display:"flex",alignItems:"center",padding:1}}><div style={{width:"75%",height:"100%",borderRadius:1,background:"#1a1a1a"}}/><div style={{position:"absolute",right:-3,width:2,height:5,borderRadius:"0 1px 1px 0",background:"#1a1a1a"}}/></div></div></div>);};
const Phone=({children})=>(<div style={{position:"relative",width:266,height:546,flexShrink:0}}><div style={{position:"absolute",right:-2.5,top:130,width:3,height:40,borderRadius:"0 2px 2px 0",background:"#2a2a2a",boxShadow:"1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{position:"absolute",left:-2.5,top:110,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#2a2a2a",boxShadow:"-1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{position:"absolute",left:-2.5,top:148,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#2a2a2a",boxShadow:"-1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{position:"absolute",left:-2.5,top:80,width:3,height:14,borderRadius:"2px 0 0 2px",background:"#2a2a2a",boxShadow:"-1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{width:260,height:540,borderRadius:36,background:"linear-gradient(145deg,#2a2a2a,#1a1a1a 50%,#2a2a2a)",padding:3,boxShadow:"0 20px 60px rgba(0,0,0,0.25),inset 0 1px 1px rgba(255,255,255,0.05)",margin:"0 auto"}}><div style={{width:"100%",height:"100%",borderRadius:33,background:"#000",padding:2}}><div style={{width:"100%",height:"100%",borderRadius:31,background:"#fff",overflow:"hidden",display:"flex",flexDirection:"column"}}><StatusBar/><div style={{flex:1,overflow:"hidden"}}>{children}</div><div style={{padding:"5px 0 7px",display:"flex",justifyContent:"center",background:"#fff"}}><div style={{width:100,height:4,borderRadius:2,background:"#d1d5db"}}/></div></div></div></div></div>);

/* Rule results */
const clearRules=[
  {rule:"Velocity Check",icon:Timer,result:"2 txns / 24h — Normal",status:"pass",detail:"Below threshold of 5 txns per hour",time:"12ms"},
  {rule:"Amount Threshold",icon:TrendingUp,result:"Within normal range",status:"pass",detail:"Amount consistent with 90-day average",time:"8ms"},
  {rule:"Geo-Anomaly",icon:Globe,result:"No anomaly detected",status:"pass",detail:"Transaction origin matches user profile",time:"15ms"},
  {rule:"Behavioral Score",icon:Activity,result:"Normal pattern",status:"pass",detail:"Time of day, merchant category within baseline",time:"22ms"},
  {rule:"Mule Score",icon:Users,result:"Low risk — Score: 12",status:"pass",detail:"No mule network associations detected",time:"45ms"},
  {rule:"Device Risk",icon:Smartphone,result:"Trusted device",status:"pass",detail:"Known device · iOS 18.2 · No anomalies",time:"18ms"},
];
const flagRules=[
  {rule:"Velocity Check",icon:Timer,result:"8 txns in 12 minutes",status:"fail",conf:"94%",detail:"5x above normal velocity — rapid-fire pattern",time:"12ms"},
  {rule:"Amount Threshold",icon:TrendingUp,result:"$8,500 — 340% above avg",status:"fail",conf:"89%",detail:"90-day avg: $1,950 · Sudden spike flagged",time:"8ms"},
  {rule:"Geo-Anomaly",icon:Globe,result:"Nigeria — new corridor",status:"fail",conf:"92%",detail:"First transaction to high-risk jurisdiction",time:"15ms"},
  {rule:"Behavioral Score",icon:Activity,result:"3:47 AM — off-pattern",status:"fail",conf:"86%",detail:"User typically transacts 9AM–6PM weekdays",time:"22ms"},
  {rule:"Mule Score",icon:Users,result:"High risk — Score: 847",status:"fail",conf:"91%",detail:"Recipient linked to 3 known mule accounts",time:"45ms"},
  {rule:"Device Risk",icon:Smartphone,result:"New device + VPN",status:"warn",conf:"72%",detail:"First-time device · NordVPN detected · jailbroken",time:"18ms"},
];

const RuleCard=({item,show})=>{const h=item.status==="fail";const w=item.status==="warn";return(<div style={{opacity:show?1:0,transform:show?"translateX(0)":"translateX(12px)",transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",background:h?T.roseBg:w?T.amberBg:T.emeraldBg,borderLeft:`3px solid ${h?T.rose:w?T.amber:T.emerald}`,borderRadius:8,padding:"9px 11px",marginBottom:5}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><div style={{display:"flex",alignItems:"center",gap:5}}><item.icon size={12} color={h?T.rose:w?T.amber:T.emerald}/><span style={{fontSize:11,fontWeight:600,color:T.t900}}>{item.rule}</span></div><span style={{fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:3,background:h?T.rose:w?T.amber:T.emerald,color:"#fff"}}>{h?"FAIL":w?"WARN":"PASS"}</span></div>
  <div style={{fontSize:10.5,fontWeight:600,color:h?T.rose:w?T.amber:T.emerald}}>{item.result}</div>
  <div style={{fontSize:9.5,color:T.t500,marginTop:1}}>{item.detail}</div>
  {item.conf?<div style={{fontSize:9,color:T.t400,marginTop:1}}>Confidence: {item.conf} · {item.time}</div>:<div style={{fontSize:9,color:T.t400,marginTop:1}}>Latency: {item.time}</div>}
</div>);};

const RiskGauge=({score,go})=>{const[n,sN]=useState(0);useEffect(()=>{if(!go){sN(0);return;}let c=0;const iv=setInterval(()=>{c++;if(c>=score){clearInterval(iv);sN(score);}else sN(c);},20);return()=>clearInterval(iv);},[score,go]);const col=n>=80?T.rose:n>=50?T.amber:T.emerald;const ci=2*Math.PI*44;return(<div style={{textAlign:"center"}}><svg width="100" height="100" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="none" stroke={T.border} strokeWidth="5"/><circle cx="48" cy="48" r="44" fill="none" stroke={col} strokeWidth="5" strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={ci-(n/100)*ci} transform="rotate(-90 48 48)" style={{transition:"all 0.2s"}}/><text x="48" y="45" textAnchor="middle" style={{fontSize:22,fontWeight:700,fill:col}}>{n}</text><text x="48" y="59" textAnchor="middle" style={{fontSize:9,fill:T.t400}}>/ 100</text></svg><p style={{fontSize:9,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:1.2,marginTop:2}}>{n>=80?"Critical":n>=50?"Medium":"Low"}</p></div>);};

/* ═══ MAIN ═══ */
export default function BureauFRMDemo(){
  const[reg]=useState(()=>detectRegion());
  const ri=RI[reg]||RI.US;
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
  const[step,setStep]=useState(0);
  const[amount,setAmount]=useState(850);
  const[fraud,setFraud]=useState(false);
  const[visR,setVisR]=useState([]);
  const[showG,setShowG]=useState(false);
  const[showV,setShowV]=useState(false);
  const[caseAction,setCaseAction]=useState(null);
  const now=new Date();const dateStr=now.toISOString().split("T")[0];const timeStr=now.toLocaleTimeString("en-US",{hour12:false,timeZone:tz});
  const caseId=`BID-FRM-${now.getFullYear()}-${String(Math.floor(Math.random()*99999)).padStart(5,"0")}`;
  const isFlag=fraud;
  const rules=isFlag?flagRules:clearRules;
  const rScore=isFlag?91:6;
  const rcpt=isFlag?flagR:{name:ri.rName,addr:ri.rAddr,bank:ri.rBank,acct:ri.rAcct,country:ri.dCountry,flag:ri.dFlag};
  const corridor=isFlag?`${ri.corr.split("→")[0]}→ NG`:ri.corr;
  const txAmount=isFlag?`${ri.sym}8,500`:(`${ri.sym}${amount.toLocaleString()}`);
  const steps=["Transaction Details","Sender & Receiver","Confirm & Pay","Rule Evaluation"];
  const atEnd=step>=3;

  const BtnStyle={padding:12,borderRadius:24,background:T.primary,color:"#fff",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"};
  const runEval=useCallback((f)=>{
    setVisR([]);setShowG(false);setShowV(false);setCaseAction(null);
    const r=f?flagRules:clearRules;
    r.forEach((_,i)=>setTimeout(()=>setVisR(p=>[...p,i]),300+i*300));
    setTimeout(()=>setShowG(true),300+r.length*300+200);
    setTimeout(()=>setShowV(true),300+r.length*300+500);
  },[]);
  const reset=useCallback(()=>{setStep(0);setVisR([]);setShowG(false);setShowV(false);setCaseAction(null);},[]);
  const goNext=()=>{if(step<2){setStep(step+1);}else if(step===2){setStep(3);runEval(fraud);}};
  const goBack=()=>{if(step>0)setStep(step-1);};
  const toggleFraud=()=>{const nf=!fraud;setFraud(nf);if(step>=3)runEval(nf);};

  const phoneContent=()=>{
    if(step===0)return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{marginBottom:16}}><PPLogo size={160}/></div><p style={{fontSize:9,color:T.t400,letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>Secure Payments</p><div style={{width:44,height:44,borderRadius:"50%",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",marginTop:20}}><Banknote size={20} color={T.t300}/></div><p style={{fontSize:11,color:T.t500,marginTop:10}}>Transaction monitoring demo</p></div>
        <div style={{padding:"0 16px 14px"}}><div onClick={goNext} style={BtnStyle}>Start Demo →</div></div>
      </div>
    );
    if(step===1)return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{background:T.primary,padding:"10px 16px",display:"flex",alignItems:"center",gap:6}}><ArrowLeft size={16} color="rgba(255,255,255,0.5)" onClick={goBack} style={{cursor:"pointer"}}/><span style={{color:"#fff",fontSize:13,fontWeight:700,flex:1}}>Send Money</span><Send size={14} color="#fff"/></div>
        <div style={{flex:1,padding:12,overflowY:"auto"}}>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:6,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>From</p><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{ri.flag}</span><div><p style={{fontSize:11,fontWeight:700}}>{ri.country}</p><p style={{fontSize:9,color:T.t400}}>{ri.city} · {ri.cur}</p></div></div></div>
          <div style={{textAlign:"center",padding:"2px 0",color:T.t300,fontSize:14}}>↓</div>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:8,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>To</p><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{ri.dFlag}</span><div><p style={{fontSize:11,fontWeight:700}}>{ri.dCountry}</p><p style={{fontSize:9,color:T.t400}}>{ri.dCur}</p></div></div></div>
          <div style={{textAlign:"center",padding:"8px 0 4px"}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Amount</p><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2}}><span style={{fontSize:10,color:T.t400}}>{ri.sym}</span><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value)||0)} style={{fontSize:26,fontWeight:800,color:T.t900,border:"none",background:"transparent",width:110,textAlign:"center",outline:"none",fontFamily:T.sans}}/></div><div style={{marginTop:4,padding:"3px 10px",borderRadius:6,background:T.blueBg,display:"inline-block"}}><p style={{fontSize:9,color:T.blue,fontWeight:600}}>≈ {ri.dCur} {(amount*ri.dRate).toFixed(2)}</p></div></div>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginTop:8,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>Purpose</p><p style={{fontSize:11,fontWeight:600,color:T.t900}}>Online purchase</p></div>
        </div>
        <div style={{padding:"0 12px 14px"}}><div onClick={goNext} style={BtnStyle}>Continue →</div></div>
      </div>
    );
    if(step===2)return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{background:T.primary,padding:"10px 16px",display:"flex",alignItems:"center",gap:6}}><ArrowLeft size={16} color="rgba(255,255,255,0.5)" onClick={goBack} style={{cursor:"pointer"}}/><span style={{color:"#fff",fontSize:13,fontWeight:700,flex:1}}>Confirm Details</span><Eye size={14} color="#fff"/></div>
        <div style={{flex:1,padding:12,overflowY:"auto"}}>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:6,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.orange,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:4}}>Sender</p><p style={{fontSize:11,fontWeight:700,color:T.t900}}>{ri.sName}</p><p style={{fontSize:9,color:T.t500,marginTop:2}}>{ri.sAddr}</p><div style={{display:"flex",gap:10,marginTop:6,padding:"6px 0 0",borderTop:`1px solid ${T.border}`}}><div style={{flex:1}}><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Bank</p><p style={{fontSize:9,fontWeight:600,color:T.t700}}>{ri.sBank}</p></div><div><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Account</p><p style={{fontSize:9,fontWeight:700,color:T.t900,fontFamily:T.mono}}>{ri.sAcct}</p></div></div></div>
          <div style={{textAlign:"center",padding:"3px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><div style={{width:24,height:24,borderRadius:"50%",background:T.primary+"10",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowRight size={12} color={T.primary}/></div><span style={{fontSize:11,fontWeight:700,color:T.t900}}>{ri.sym}{amount.toLocaleString()}</span></div>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:6,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.amber,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:4}}>Recipient</p><p style={{fontSize:11,fontWeight:700,color:T.t900}}>{ri.rName}</p><p style={{fontSize:9,color:T.t500,marginTop:2}}>{ri.rAddr}</p><div style={{display:"flex",gap:10,marginTop:6,padding:"6px 0 0",borderTop:`1px solid ${T.border}`}}><div style={{flex:1}}><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Bank</p><p style={{fontSize:9,fontWeight:600,color:T.t700}}>{ri.rBank}</p></div><div><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Account</p><p style={{fontSize:9,fontWeight:700,color:T.t900,fontFamily:T.mono}}>{ri.rAcct}</p></div></div></div>
          <div style={{background:T.emeraldBg,borderRadius:8,padding:8,border:`1px solid ${T.emerald}20`}}><p style={{fontSize:9,color:T.emerald,fontWeight:600}}>✓ FX locked · {ri.dCur} {(amount*ri.dRate).toFixed(2)} · Fee: {ri.sym}2.99</p></div>
        </div>
        <div style={{padding:"0 12px 14px"}}><div onClick={goNext} style={BtnStyle}>Confirm & Pay</div></div>
      </div>
    );
    return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{background:T.primary,padding:"10px 16px",display:"flex",alignItems:"center",gap:6}}><span style={{color:"#fff",fontSize:13,fontWeight:700,flex:1}}>Rule Evaluation</span><Shield size={14} color="#fff"/></div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,textAlign:"center"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:isFlag?T.roseBg:T.emeraldBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,animation:"scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>{isFlag?<ShieldAlert size={30} color={T.rose}/>:<ShieldCheck size={30} color={T.emerald}/>}</div>
          <p style={{fontSize:16,fontWeight:800,color:isFlag?T.rose:T.emerald}}>{isFlag?"Transaction Flagged":"Transaction Approved"}</p>
          <p style={{fontSize:11,color:T.t500,marginTop:4}}>{txAmount} to {rcpt.name}</p>
          <p style={{fontSize:10,color:isFlag?T.rose:T.emerald,fontWeight:600,marginTop:8,padding:"5px 12px",borderRadius:99,background:isFlag?T.roseBg:T.emeraldBg}}>{isFlag?"5 of 250 rules triggered":"All 250 rules passed"}</p>
          <p style={{fontSize:9,color:T.t400,marginTop:14}}>Open Bureau Intelligence for the full breakdown</p>
        </div>
      </div>
    );
  };


  const overviewBody=(<div>
    <div style={{background:T.bg,borderRadius:12,padding:"8px 16px 0px 16px",border:`1px solid ${T.border}`,lineHeight:1.7}}>
      <p style={{fontSize:11,color:T.t500,marginBottom:10}}>Bureau's Transaction Monitoring solution evaluates <strong>every transaction in real time</strong> against 250+ configurable fraud rules — velocity, amount thresholds, geographic anomalies, behavioral baselines, mule intelligence, and device risk. All rules execute simultaneously in <strong>under 500ms</strong>.</p>
      <p style={{fontSize:11,color:T.t500}}><strong>One API. Real-time decisioning. Full case management.</strong> Bureau's FRM engine returns a risk score, recommended action, and rule-level breakdown — routing flagged transactions to the built-in Case Manager.</p>
    </div>
    <p style={{fontSize:10,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginTop:16,marginBottom:8}}>Rules Evaluated</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[{icon:Timer,label:"Velocity",desc:"Transaction frequency"},{icon:TrendingUp,label:"Amount",desc:"Spending patterns"},{icon:Globe,label:"Geo-Anomaly",desc:"Location analysis"},{icon:Activity,label:"Behavioral",desc:"Time & pattern"},{icon:Users,label:"Mule Score",desc:"Network analysis"},{icon:Smartphone,label:"Device Risk",desc:"Device signals"}].map((f,i)=>(<div key={i} style={{background:T.bg,borderRadius:8,padding:10,border:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><f.icon size={13} color={T.orange}/><span style={{fontSize:10,fontWeight:600,color:T.t900}}>{f.label}</span></div><p style={{fontSize:9,color:T.t500}}>{f.desc}</p></div>))}
    </div>
  </div>);

  const resultsBody=(<div>
    <div style={{background:T.bg,borderRadius:10,padding:12,marginBottom:12,border:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[{k:"Recipient",v:rcpt.name},{k:"Country",v:rcpt.country},{k:"Amount",v:txAmount},{k:"Corridor",v:corridor}].map((m,i)=>(<div key={i}><p style={{fontSize:9,fontWeight:600,color:T.t400,textTransform:"uppercase"}}>{m.k}</p><p style={{fontSize:10,fontWeight:600,color:T.t900}}>{m.v}</p></div>))}
    </div>
    <p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Top Rule Evaluation · {visR.length}/{rules.length} shown (250 total)</p>
    <div style={{marginBottom:14}}>{rules.map((r,i)=><RuleCard key={i} item={r} show={visR.includes(i)}/>)}</div>
    <div style={{display:"flex",gap:12,opacity:showG?1:0,transform:showG?"translateY(0)":"translateY(10px)",transition:"all 0.5s",marginBottom:14}}>
      <div style={{background:T.bg,borderRadius:12,padding:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flex:"0 0 120px"}}><RiskGauge score={rScore} go={showG}/></div>
      <div style={{flex:1,background:T.bg,borderRadius:12,padding:14,border:`1px solid ${(isFlag?T.rose:T.emerald)}20`,opacity:showV?1:0,transition:"all 0.4s"}}><p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Bureau Decision</p><div style={{display:"flex",alignItems:"center",gap:7,padding:"9px 10px",borderRadius:8,background:isFlag?T.roseBg:T.emeraldBg}}>{isFlag?<XCircle size={16} color={T.rose}/>:<CheckCircle size={16} color={T.emerald}/>}<span style={{fontSize:11,fontWeight:700,color:isFlag?T.rose:T.emerald}}>{isFlag?"BLOCK — Rules Triggered":"ALLOW — Rules Passed"}</span></div></div>
    </div>
    {showV&&(<div style={{background:T.bg,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden",animation:"fadeSlideIn 0.5s ease"}}>
      <div style={{background:T.t900,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Shield size={14} color={T.orange}/><span style={{color:"#fff",fontSize:11,fontWeight:700}}>Bureau Case Manager</span></div><span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:caseAction==="approved"?T.emerald:caseAction==="rejected"?T.rose:caseAction==="info"?T.amber:isFlag?T.rose:T.emerald,color:"#fff"}}>{caseAction==="approved"?"APPROVED":caseAction==="rejected"?"BLOCKED":caseAction==="info"?"ESCALATED":isFlag?"FLAGGED":"AUTO-APPROVED"}</span></div>
      <div style={{padding:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12,padding:10,background:T.white,borderRadius:8,border:`1px solid ${T.border}`}}>
          {[{k:"Case",v:caseId},{k:"Priority",v:isFlag?"HIGH":"LOW"},{k:"Risk Score",v:`${rScore}/100`}].map((m,i)=>(<div key={i}><p style={{fontSize:8,fontWeight:600,color:T.t400,textTransform:"uppercase"}}>{m.k}</p><p style={{fontSize:10,fontWeight:700,color:m.k==="Priority"?(isFlag?T.rose:T.emerald):m.k==="Risk Score"?(rScore>=80?T.rose:T.emerald):T.t900,fontFamily:m.k==="Case"?T.mono:"inherit"}}>{m.v}</p></div>))}
        </div>
        <p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Rule Evaluation · Total Rules 250</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {[{l:"Passed",v:isFlag?"244":"250",c:T.emerald},{l:"Failed",v:isFlag?"5":"0",c:isFlag?T.rose:T.emerald},{l:"Warnings",v:isFlag?"1":"0",c:isFlag?T.amber:T.emerald}].map((s,i)=>(<div key={i} style={{background:T.white,borderRadius:8,padding:8,border:`1px solid ${T.border}`,textAlign:"center"}}><p style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</p><p style={{fontSize:8,color:T.t400,textTransform:"uppercase"}}>{s.l}</p></div>))}
        </div>
        {!caseAction&&(<><p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Analyst Decision</p><div style={{display:"flex",gap:8}}>
          <button onClick={()=>setCaseAction("approved")} style={{flex:1,padding:10,borderRadius:8,background:T.emerald,color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}><ThumbsUp size={14}/>Approve</button>
          <button onClick={()=>setCaseAction("rejected")} style={{flex:1,padding:10,borderRadius:8,background:T.rose,color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}><ThumbsDown size={14}/>Reject</button>
          <button onClick={()=>setCaseAction("info")} style={{flex:1,padding:10,borderRadius:8,background:T.white,color:T.t500,border:`1px solid ${T.border}`,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}><FileText size={14}/>Escalate</button>
        </div></>)}
        {caseAction&&(<div style={{padding:"10px 12px",borderRadius:8,background:caseAction==="approved"?T.emeraldBg:caseAction==="rejected"?T.roseBg:T.amberBg,border:`1px solid ${caseAction==="approved"?T.emerald:caseAction==="rejected"?T.rose:T.amber}20`}}><p style={{fontSize:10,fontWeight:600,color:caseAction==="approved"?T.emerald:caseAction==="rejected"?T.rose:T.amber}}>{caseAction==="approved"?"✓ Transaction approved — released to payment network":caseAction==="rejected"?"✗ Transaction blocked — account frozen for review":"📋 Escalated to L2 analyst — customer notified"}</p></div>)}
        <p style={{fontSize:9,color:T.t400,textAlign:"center",marginTop:10}}>Bureau · FRM Rule Engine v3.1</p>
      </div>
    </div>)}
  </div>);

  return (
    <DemoShell
      badge="Transaction Monitoring"
      overviewTitle="Real-Time Transaction Monitoring"
      overview={overviewBody}
      journeySteps={steps}
      currentStep={Math.min(step, steps.length - 1)}
      phone={phoneContent()}
      results={resultsBody}
      hasResults={step >= 3}
      fraud={fraud}
      onToggleFraud={toggleFraud}
      nextLabel={atEnd ? "Request Demo" : step === 2 ? "Confirm & Pay" : "Continue"}
      nextIsRequestDemo={atEnd}
      onNext={goNext}
      onBack={goBack}
      onReset={reset}
    />
  );
}
