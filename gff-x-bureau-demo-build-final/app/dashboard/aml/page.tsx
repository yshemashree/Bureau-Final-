"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield, CheckCircle, XCircle, Globe, MapPin, ChevronRight, ChevronLeft,
  AlertTriangle, Search, User, Building2, Newspaper, Send, DollarSign, Wifi, Battery,
  Signal as SignalIcon, Bell, FileText, Scale, Clock, ThumbsUp, ThumbsDown, Flag,
  Users, RotateCcw, ShieldCheck, ShieldAlert, ArrowRight, Banknote, Eye, Info,
  ArrowLeft, Ban, Lock, MessageSquare, CheckCircle2
} from "lucide-react";
import { DemoShell } from "@/components/demo-shell";

const T={primary:"#253B80",teal:"#0D9488",tealBg:"rgba(13,148,136,0.08)",rose:"#E11D48",roseBg:"rgba(225,29,72,0.08)",amber:"#D97706",amberBg:"rgba(217,119,6,0.08)",emerald:"#059669",emeraldBg:"rgba(5,150,105,0.08)",blue:"#2563EB",blueBg:"rgba(37,99,235,0.08)",bg:"#f5f7fa",white:"#fff",border:"#e5e7eb",borderLight:"#f3f4f6",t900:"#111827",t700:"#374151",t500:"#6b7280",t400:"#9ca3af",t300:"#d1d5db",mono:"ui-monospace,SFMono-Regular,'SF Mono',Menlo,monospace",sans:"ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"};

function detectRegion(){try{const z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";if(/Kolkata|Mumbai|Chennai|Delhi/.test(z))return"IN";if(/Singapore|Kuala_Lumpur|Jakarta|Bangkok|Manila|Ho_Chi_Minh/.test(z))return"SEA";return"US";}catch{return"US";}}
const RI={
  US:{flag:"🇺🇸",country:"United States",city:"New York",cur:"USD",sym:"$",sName:"James Anderson",sAddr:"142 West 57th St, New York, NY 10019",sBank:"JPMorgan Chase Bank, N.A.",sAcct:"****7834",dCountry:"United Arab Emirates",dFlag:"🇦🇪",dCur:"AED",dRate:3.67,rName:"Ahmad Al-Rashid",rAddr:"Al Barsha 1, Dubai, UAE",rBank:"Emirates NBD PJSC",rAcct:"****4521",corr:"US → UAE"},
  IN:{flag:"🇮🇳",country:"India",city:"Mumbai",cur:"INR",sym:"₹",sName:"Rajesh Sharma",sAddr:"Bandra West, Mumbai, MH 400050",sBank:"HDFC Bank Ltd.",sAcct:"****6192",dCountry:"Singapore",dFlag:"🇸🇬",dCur:"SGD",dRate:0.016,rName:"Wei Lin Tan",rAddr:"78 Shenton Way, Singapore 079120",rBank:"DBS Bank Ltd.",rAcct:"****8837",corr:"IN → SG"},
  SEA:{flag:"🇸🇬",country:"Singapore",city:"Singapore",cur:"SGD",sym:"S$",sName:"Wei Lin Tan",sAddr:"78 Shenton Way, Singapore 079120",sBank:"DBS Bank Ltd.",sAcct:"****8837",dCountry:"United Kingdom",dFlag:"🇬🇧",dCur:"GBP",dRate:0.58,rName:"Sarah Mitchell",rAddr:"14 Canary Wharf, London E14 5AB",rBank:"Barclays Bank UK PLC",rAcct:"****3319",corr:"SG → UK"},
};
const flagR={name:"Viktor Petrov",addr:"Ulitsa Tverskaya 12, Moscow",bank:"VTB Bank (PJSC)",acct:"****6601",country:"Russia",flag:"🇷🇺"};

const PP_IMG="data:image/png;base64,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";
const PPLogo=({size=80,white=false})=>white?(
  <div style={{display:"flex",alignItems:"baseline",gap:size*0.04}}>
    <span style={{fontSize:size*0.32,fontWeight:800,color:"#fff",letterSpacing:-0.5,fontStyle:"italic",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>Pay</span>
    <span style={{fontSize:size*0.32,fontWeight:800,color:"rgba(255,255,255,0.6)",letterSpacing:-0.5,fontStyle:"italic",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>Pal</span>
  </div>
):(<img src={PP_IMG} alt="PayPal" style={{height:size*0.27,width:"auto",objectFit:"contain"}}/>);

const StatusBar=()=>{const[t,sT]=useState("");useEffect(()=>{const u=()=>sT(new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}));u();const iv=setInterval(u,10000);return()=>clearInterval(iv);},[]);return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 20px 4px",fontSize:11,fontWeight:600,color:"#1a1a1a"}}><span style={{fontWeight:700,letterSpacing:0.3}}>{t}</span><div style={{width:72,height:22,borderRadius:16,background:"#1a1a1a"}}/><div style={{display:"flex",gap:3,alignItems:"center"}}><SignalIcon size={11}/><Wifi size={11}/><div style={{width:18,height:9,borderRadius:2,border:"1.5px solid #1a1a1a",position:"relative",display:"flex",alignItems:"center",padding:1}}><div style={{width:"75%",height:"100%",borderRadius:1,background:"#1a1a1a"}}/><div style={{position:"absolute",right:-3,width:2,height:5,borderRadius:"0 1px 1px 0",background:"#1a1a1a"}}/></div></div></div>);};
const Phone=({children})=>(<div style={{position:"relative",width:266,height:546,flexShrink:0}}><div style={{position:"absolute",right:-2.5,top:130,width:3,height:40,borderRadius:"0 2px 2px 0",background:"#2a2a2a",boxShadow:"1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{position:"absolute",left:-2.5,top:110,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#2a2a2a",boxShadow:"-1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{position:"absolute",left:-2.5,top:148,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#2a2a2a",boxShadow:"-1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{position:"absolute",left:-2.5,top:80,width:3,height:14,borderRadius:"2px 0 0 2px",background:"#2a2a2a",boxShadow:"-1px 0 2px rgba(0,0,0,0.3)"}}/><div style={{width:260,height:540,borderRadius:36,background:"linear-gradient(145deg,#2a2a2a,#1a1a1a 50%,#2a2a2a)",padding:3,boxShadow:"0 20px 60px rgba(0,0,0,0.25),inset 0 1px 1px rgba(255,255,255,0.05)",margin:"0 auto"}}><div style={{width:"100%",height:"100%",borderRadius:33,background:"#000",padding:2}}><div style={{width:"100%",height:"100%",borderRadius:31,background:"#fff",overflow:"hidden",display:"flex",flexDirection:"column"}}><StatusBar/><div style={{flex:1,overflow:"hidden"}}>{children}</div><div style={{padding:"5px 0 7px",display:"flex",justifyContent:"center",background:"#fff"}}><div style={{width:100,height:4,borderRadius:2,background:"#d1d5db"}}/></div></div></div></div></div>);
const Btn=({children,onClick,color=T.primary,outline=false,disabled=false,...p})=>(<div onClick={disabled?undefined:onClick} style={{padding:"11px 16px",borderRadius:24,background:outline?"transparent":color,color:outline?color:"#fff",textAlign:"center",fontSize:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",border:outline?`1.5px solid ${color}`:"none",opacity:disabled?0.4:1,transition:"all 0.2s",...p.style}}>{children}</div>);

/* ═══ SCREENING ═══ */
const clearRes=[{list:"OFAC SDN",icon:Flag,result:"No Match",status:"clear",rec:"12,847 records",time:"42ms"},{list:"UN Sanctions",icon:Globe,result:"No Match",status:"clear",rec:"8,234 records",time:"38ms"},{list:"EU Sanctions",icon:Building2,result:"No Match",status:"clear",rec:"6,891 records",time:"31ms"},{list:"UK HMT",icon:Scale,result:"No Match",status:"clear",rec:"4,567 records",time:"27ms"},{list:"PEP Database",icon:Users,result:"No Match",status:"clear",rec:"1.2M records",time:"64ms"},{list:"Adverse Media",icon:Newspaper,result:"No Match",status:"clear",rec:"50M+ articles",time:"118ms"}];
const flagRes=[{list:"OFAC SDN",icon:Flag,result:"Potential Match",status:"hit",conf:"87%",detail:"Viktor A. Petrov — SDN #14892",time:"45ms"},{list:"UN Sanctions",icon:Globe,result:"Potential Match",status:"hit",conf:"82%",detail:"UNSC Resolution 2231",time:"38ms"},{list:"EU Sanctions",icon:Building2,result:"Potential Match",status:"hit",conf:"79%",detail:"EU Reg. 269/2014 — Annex I",time:"32ms"},{list:"UK HMT",icon:Scale,result:"No Match",status:"clear",rec:"4,567 records",time:"28ms"},{list:"PEP Database",icon:Users,result:"Match — Family",status:"hit",conf:"91%",detail:"Son of Alexei Petrov — fmr. Dep. Min. of Energy",time:"67ms"},{list:"Adverse Media",icon:Newspaper,result:"3 Articles Found",status:"hit",conf:"74%",detail:"Reuters, FT — sanctions evasion (2024)",time:"124ms"}];

const ScrCard=({item,show})=>{const h=item.status==="hit";return(<div style={{opacity:show?1:0,transform:show?"translateX(0)":"translateX(12px)",transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",background:h?T.roseBg:T.emeraldBg,borderLeft:`3px solid ${h?T.rose:T.emerald}`,borderRadius:8,padding:"9px 11px",marginBottom:5}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><div style={{display:"flex",alignItems:"center",gap:5}}><item.icon size={12} color={h?T.rose:T.emerald}/><span style={{fontSize:11,fontWeight:600,color:T.t900}}>{item.list}</span></div><span style={{fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:3,background:h?T.rose:T.emerald,color:"#fff"}}>{h?"HIT":"CLEAR"}</span></div><div style={{fontSize:10.5,fontWeight:600,color:h?T.rose:T.emerald}}>{item.result}</div>{item.detail&&<div style={{fontSize:9.5,color:T.t500,marginTop:1}}>{item.detail}</div>}{item.conf?<div style={{fontSize:9,color:T.t400,marginTop:1}}>Confidence: {item.conf} · {item.time}</div>:<div style={{fontSize:9,color:T.t400,marginTop:1}}>{item.rec} · {item.time}</div>}</div>);};
const Gauge=({score,go})=>{const[n,sN]=useState(0);useEffect(()=>{if(!go){sN(0);return;}let c=0;const iv=setInterval(()=>{c++;if(c>=score){clearInterval(iv);sN(score);}else sN(c);},20);return()=>clearInterval(iv);},[score,go]);const col=n>=80?T.rose:n>=50?T.amber:T.emerald;const ci=2*Math.PI*44;return(<div style={{textAlign:"center"}}><svg width="100" height="100" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="none" stroke={T.border} strokeWidth="5"/><circle cx="48" cy="48" r="44" fill="none" stroke={col} strokeWidth="5" strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={ci-(n/100)*ci} transform="rotate(-90 48 48)" style={{transition:"all 0.2s"}}/><text x="48" y="45" textAnchor="middle" style={{fontSize:22,fontWeight:700,fill:col}}>{n}</text><text x="48" y="59" textAnchor="middle" style={{fontSize:9,fill:T.t400}}>/ 100</text></svg><p style={{fontSize:9,fontWeight:700,color:col,textTransform:"uppercase",letterSpacing:1.2,marginTop:2}}>{n>=80?"Critical":n>=50?"Medium":"Low"}</p></div>);};

/* ═══ MAIN ═══ */
export default function BureauAMLv3(){
  const[reg]=useState(()=>detectRegion());
  const ri=RI[reg]||RI.US;
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
  const[step,setStep]=useState(0);
  const[amount,setAmount]=useState(1500);
  const[fraud,setFraud]=useState(false);
  const[visS,setVisS]=useState([]);
  const[showG,setShowG]=useState(false);
  const[showV,setShowV]=useState(false);
  const[caseAction,setCaseAction]=useState(null);
  const now=new Date();const dateStr=now.toISOString().split("T")[0];const timeStr=now.toLocaleTimeString("en-US",{hour12:false,timeZone:tz});
  const caseId=`BID-${now.getFullYear()}-${String(Math.floor(Math.random()*99999)).padStart(5,"0")}`;
  const isRev=fraud;
  const results=isRev?flagRes:clearRes;
  const rScore=isRev?94:8;
  const rcpt=isRev?flagR:{name:ri.rName,addr:ri.rAddr,bank:ri.rBank,acct:ri.rAcct,country:ri.dCountry,flag:ri.dFlag};
  const corridor=isRev?`${ri.corr.split("→")[0]}→ RU`:ri.corr;
  const steps=["Transfer Details","Sender & Receiver","Screening"];
  const atEnd=step>=3;

  const BtnStyle={padding:12,borderRadius:24,background:T.primary,color:"#fff",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer",width:"100%"};
  const runEval=useCallback((f)=>{
    setVisS([]);setShowG(false);setShowV(false);setCaseAction(null);
    const r=f?flagRes:clearRes;
    r.forEach((_,i)=>setTimeout(()=>setVisS(p=>[...p,i]),300+i*300));
    setTimeout(()=>setShowG(true),300+r.length*300+200);
    setTimeout(()=>setShowV(true),300+r.length*300+500);
  },[]);
  const reset=useCallback(()=>{setStep(0);setFraud(false);setVisS([]);setShowG(false);setShowV(false);setCaseAction(null);},[]);
  const goNext=()=>{if(step<2){setStep(step+1);}else if(step===2){setStep(3);runEval(fraud);}};
  const goBack=()=>{if(step>0)setStep(step-1);};
  const toggleFraud=()=>{const nf=!fraud;setFraud(nf);if(step>=3)runEval(nf);};

  const phoneContent=()=>{
    if(step===1)return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{background:T.primary,padding:"10px 16px",display:"flex",alignItems:"center",gap:6}}><ArrowLeft size={16} color="rgba(255,255,255,0.5)" onClick={goBack} style={{cursor:"pointer"}}/><span style={{color:"#fff",fontSize:13,fontWeight:700,flex:1}}>Send Money</span><Send size={14} color="#fff"/></div>
        <div style={{flex:1,padding:12,overflowY:"auto"}}>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:6,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>From</p><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{ri.flag}</span><div><p style={{fontSize:11,fontWeight:700}}>{ri.country}</p><p style={{fontSize:9,color:T.t400}}>{ri.city} · {ri.cur}</p></div></div></div>
          <div style={{textAlign:"center",padding:"2px 0",color:T.t300,fontSize:14}}>↓</div>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:8,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>To</p><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{ri.dFlag}</span><div><p style={{fontSize:11,fontWeight:700}}>{ri.dCountry}</p><p style={{fontSize:9,color:T.t400}}>{ri.dCur}</p></div></div></div>
          <div style={{textAlign:"center",padding:"8px 0 4px"}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>You Send</p><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2}}><span style={{fontSize:10,color:T.t400}}>{ri.sym}</span><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value)||0)} style={{fontSize:26,fontWeight:800,color:T.t900,border:"none",background:"transparent",width:110,textAlign:"center",outline:"none",fontFamily:T.sans}}/></div><div style={{marginTop:4,padding:"3px 10px",borderRadius:6,background:T.blueBg,display:"inline-block"}}><p style={{fontSize:9,color:T.blue,fontWeight:600}}>≈ {ri.dCur} {(amount*ri.dRate).toFixed(2)}</p></div></div>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginTop:8,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.t400,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>Purpose</p><p style={{fontSize:11,fontWeight:600,color:T.t900}}>Business consulting services</p></div>
        </div>
        <div style={{padding:"0 12px 14px"}}><div onClick={goNext} style={BtnStyle}>Continue →</div></div>
      </div>
    );
    if(step===2)return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{background:T.primary,padding:"10px 16px",display:"flex",alignItems:"center",gap:6}}><ArrowLeft size={16} color="rgba(255,255,255,0.5)" onClick={goBack} style={{cursor:"pointer"}}/><span style={{color:"#fff",fontSize:13,fontWeight:700,flex:1}}>Confirm Details</span><Eye size={14} color="#fff"/></div>
        <div style={{flex:1,padding:12,overflowY:"auto"}}>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:6,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.teal,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:4}}>Sender</p><p style={{fontSize:11,fontWeight:700,color:T.t900}}>{ri.sName}</p><p style={{fontSize:9,color:T.t500,marginTop:2}}>{ri.sAddr}</p><div style={{display:"flex",gap:10,marginTop:6,padding:"6px 0 0",borderTop:`1px solid ${T.border}`}}><div style={{flex:1}}><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Bank</p><p style={{fontSize:9,fontWeight:600,color:T.t700}}>{ri.sBank}</p></div><div><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Account</p><p style={{fontSize:9,fontWeight:700,color:T.t900,fontFamily:T.mono}}>{ri.sAcct}</p></div></div></div>
          <div style={{textAlign:"center",padding:"3px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><div style={{width:24,height:24,borderRadius:"50%",background:T.primary+"10",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowRight size={12} color={T.primary}/></div><span style={{fontSize:11,fontWeight:700,color:T.t900}}>{ri.sym}{amount.toLocaleString()}</span></div>
          <div style={{background:T.bg,borderRadius:10,padding:10,marginBottom:6,border:`1px solid ${T.border}`}}><p style={{fontSize:8,color:T.amber,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:4}}>Recipient</p><p style={{fontSize:11,fontWeight:700,color:T.t900}}>{ri.rName}</p><p style={{fontSize:9,color:T.t500,marginTop:2}}>{ri.rAddr}</p><div style={{display:"flex",gap:10,marginTop:6,padding:"6px 0 0",borderTop:`1px solid ${T.border}`}}><div style={{flex:1}}><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Bank</p><p style={{fontSize:9,fontWeight:600,color:T.t700}}>{ri.rBank}</p></div><div><p style={{fontSize:7,color:T.t400,textTransform:"uppercase"}}>Account</p><p style={{fontSize:9,fontWeight:700,color:T.t900,fontFamily:T.mono}}>{ri.rAcct}</p></div></div></div>
          <div style={{background:T.emeraldBg,borderRadius:8,padding:8,border:`1px solid ${T.emerald}20`}}><p style={{fontSize:9,color:T.emerald,fontWeight:600}}>✓ FX rate locked · {ri.dCur} {(amount*ri.dRate).toFixed(2)} · Fee: {ri.sym}4.99</p></div>
        </div>
        <div style={{padding:"0 12px 14px"}}><div onClick={goNext} style={BtnStyle}>Confirm & Send</div></div>
      </div>
    );
    return(
      <div style={{background:"#fff",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{background:T.primary,padding:"10px 16px",display:"flex",alignItems:"center",gap:6}}><span style={{color:"#fff",fontSize:13,fontWeight:700,flex:1}}>AML Screening</span><Shield size={14} color="#fff"/></div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,textAlign:"center"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:isRev?T.roseBg:T.emeraldBg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,animation:"scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>{isRev?<ShieldAlert size={30} color={T.rose}/>:<ShieldCheck size={30} color={T.emerald}/>}</div>
          <p style={{fontSize:16,fontWeight:800,color:isRev?T.rose:T.emerald}}>{isRev?"Payment Under Review":"Payment Approved"}</p>
          <p style={{fontSize:11,color:T.t500,marginTop:4}}>{ri.sym}{amount.toLocaleString()} to {rcpt.name}</p>
          <p style={{fontSize:10,color:isRev?T.rose:T.emerald,fontWeight:600,marginTop:8,padding:"5px 12px",borderRadius:99,background:isRev?T.roseBg:T.emeraldBg}}>{isRev?"Watchlist matches found":"All parties cleared"}</p>
          <p style={{fontSize:9,color:T.t400,marginTop:14}}>Open Bureau Intelligence for the full breakdown</p>
        </div>
      </div>
    );
  };

  const overviewBody=(<div>
    <div style={{background:T.bg,borderRadius:12,padding:"8px 16px 0px 16px",border:`1px solid ${T.border}`,lineHeight:1.7}}>
      <p style={{fontSize:11,color:T.t500,marginBottom:10}}>Bureau's AML Screening solution provides <strong>real-time sanctions and watchlist screening</strong> for every transaction, customer, and counterparty - with results in under 200ms. No more batch processing or overnight runs. Screen against <strong>OFAC, UN, EU, UK HMT</strong> sanctions lists, global PEP databases, and adverse media simultaneously in a single API call.

</p>
      <p style={{fontSize:11,color:T.t500,marginBottom:10}}><strong>One single API. Global coverage. Real-time results.</strong> Bureau screens senders, beneficiaries, and intermediary institutions across every corridor — with fuzzy name matching, transliteration support, and <strong>configurable match thresholds</strong> to minimize false positives without missing true hits.</p>
    </div>
    <p style={{fontSize:10,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginTop:16,marginBottom:8}}>What You'll See</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,columnGap:20}}>
      {[{icon:Banknote,label:"Transfer Initiation",desc:"Cross-border payment with dynamic FX"},{icon:Search,label:"AML Screening",desc:"Real-time sanctions, PEP & media checks"},{icon:ShieldCheck,label:"Clear Outcome",desc:"All parties cleared — auto-approved"},{icon:ShieldAlert,label:"Hit Outcome",desc:"Watchlist match — case for review"}].map((f,i)=>(<div key={i} style={{background:T.bg,borderRadius:8,padding:12,border:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><f.icon size={14} color={T.teal}/><span style={{fontSize:11,fontWeight:600,color:T.t900}}>{f.label}</span></div><p style={{fontSize:10,color:T.t500}}>{f.desc}</p></div>))}
    </div>
  </div>);

  const resultsBody=(<div>
    <div style={{background:T.bg,borderRadius:10,padding:12,marginBottom:12,border:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[{k:"Recipient",v:rcpt.name},{k:"Country",v:rcpt.country},{k:"Amount",v:`${ri.sym}${amount.toLocaleString()}`},{k:"Corridor",v:corridor}].map((m,i)=>(<div key={i}><p style={{fontSize:9,fontWeight:600,color:T.t400,textTransform:"uppercase"}}>{m.k}</p><p style={{fontSize:10,fontWeight:600,color:T.t900}}>{m.v}</p></div>))}
    </div>
    <p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Watchlist Screened · 300+</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,columnGap:20,marginBottom:14}}>{results.map((s,i)=><ScrCard key={i} item={s} show={visS.includes(i)}/>)}</div>
    <div style={{display:"flex",gap:14,opacity:showG?1:0,transform:showG?"translateY(0)":"translateY(10px)",transition:"all 0.5s",marginBottom:14}}>
      <div style={{background:T.bg,borderRadius:12,padding:14,border:`1px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:"0 0 130px"}}><Gauge score={rScore} go={showG}/></div>
      <div style={{flex:1,background:T.bg,borderRadius:12,padding:14,border:`1px solid ${(isRev?T.rose:T.emerald)}20`,opacity:showV?1:0,transition:"all 0.4s"}}><p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Bureau Decision</p><div style={{display:"flex",alignItems:"center",gap:7,padding:"9px 12px",borderRadius:8,background:isRev?T.roseBg:T.emeraldBg}}>{isRev?<XCircle size={16} color={T.rose}/>:<CheckCircle size={16} color={T.emerald}/>}<span style={{fontSize:12,fontWeight:700,color:isRev?T.rose:T.emerald}}>{isRev?"Payment Blocked — AML Hits":"Payment Approved — No Risk"}</span></div></div>
    </div>
    {showV&&(<div style={{background:T.bg,borderRadius:12,border:`1px solid ${T.border}`,overflow:"hidden",animation:"fadeSlideIn 0.5s ease"}}>
      <div style={{background:T.t900,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Shield size={14} color={T.teal}/><span style={{color:"#fff",fontSize:11,fontWeight:700}}>Bureau Case Manager</span></div><span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4,background:caseAction==="approved"?T.emerald:caseAction==="rejected"?T.rose:caseAction==="info"?T.amber:isRev?T.amber:T.emerald,color:"#fff"}}>{caseAction==="approved"?"APPROVED":caseAction==="rejected"?"REJECTED":caseAction==="info"?"INFO REQUESTED":isRev?"UNDER REVIEW":"AUTO-APPROVED"}</span></div>
      <div style={{padding:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12,padding:10,background:T.white,borderRadius:8,border:`1px solid ${T.border}`}}>
          {[{k:"Case",v:caseId},{k:"Date",v:dateStr},{k:"Time",v:timeStr},{k:"Priority",v:isRev?"HIGH":"LOW"},{k:"Risk Score",v:`${rScore}/100`}].map((m,i)=>(<div key={i}><p style={{fontSize:8,fontWeight:600,color:T.t400,textTransform:"uppercase"}}>{m.k}</p><p style={{fontSize:10,fontWeight:700,color:m.k==="Priority"?(isRev?T.rose:T.emerald):m.k==="Risk Score"?(rScore>=80?T.rose:T.emerald):T.t900,fontFamily:m.k==="Case"?T.mono:"inherit"}}>{m.v}</p></div>))}
        </div>
        <p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Parties Screened · 2</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,columnGap:20,marginBottom:12}}>
          <div style={{background:T.white,borderRadius:8,padding:10,border:`1px solid ${T.border}`,borderLeft:`3px solid ${T.emerald}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,fontWeight:700}}>Sender</span><span style={{fontSize:8,fontWeight:700,color:T.emerald,padding:"1px 5px",borderRadius:3,background:T.emeraldBg}}>✓ Clear</span></div><p style={{fontSize:10,fontWeight:600,color:T.t700}}>{ri.sBank}</p><p style={{fontSize:9,color:T.t400,marginTop:2}}>No watchlist matches</p><p style={{fontSize:9,color:T.emerald,fontWeight:600,marginTop:1}}>0 hits</p></div>
          <div style={{background:T.white,borderRadius:8,padding:10,border:`1px solid ${T.border}`,borderLeft:`3px solid ${isRev?T.rose:T.emerald}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,fontWeight:700}}>Recipient</span><span style={{fontSize:8,fontWeight:700,color:isRev?T.rose:T.emerald,padding:"1px 5px",borderRadius:3,background:isRev?T.roseBg:T.emeraldBg}}>{isRev?"⚠ Flagged":"✓ Clear"}</span></div><p style={{fontSize:10,fontWeight:600,color:T.t700}}>{isRev?flagR.bank:ri.rBank}</p><p style={{fontSize:9,color:T.t400,marginTop:2}}>{isRev?"4 watchlist matches":"No watchlist matches"}</p><p style={{fontSize:9,color:isRev?T.rose:T.emerald,fontWeight:600,marginTop:1}}>{isRev?"4 hits":"0 hits"}</p></div>
        </div>
        <p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Audit Trail</p>
        <div style={{background:T.white,borderRadius:8,padding:10,border:`1px solid ${T.border}`,marginBottom:12}}>
          {[{t:timeStr,l:"Screening initiated",d:"Single API request — all parties"},{t:timeStr,l:"Sender cleared",d:`${ri.sBank} — no matches`},{t:timeStr,l:isRev?"Recipient flagged":"Recipient cleared",d:isRev?`${flagR.bank} — 4 matches`:`${ri.rBank} — no matches`},{t:timeStr,l:caseAction==="approved"?"Case approved":caseAction==="rejected"?"Case rejected — account blocked":caseAction==="info"?"Additional info requested":isRev?"Case created":"Auto-approved",d:`Request: ${caseId}`}].map((a,i)=>(<div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:i<3?`1px solid ${T.borderLight}`:"none"}}><span style={{fontSize:9,color:T.t400,fontFamily:T.mono,flexShrink:0,width:55}}>{a.t}</span><div><p style={{fontSize:10,fontWeight:600,color:T.t900}}>{a.l}</p><p style={{fontSize:9,color:T.t400}}>{a.d}</p></div></div>))}
        </div>
        {!caseAction&&(<><p style={{fontSize:9,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Analyst Decision</p><div style={{display:"flex",gap:8}}>
          <button onClick={()=>setCaseAction("approved")} style={{flex:1,padding:10,borderRadius:8,background:T.emerald,color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}><ThumbsUp size={14}/>Approve</button>
          <button onClick={()=>setCaseAction("rejected")} style={{flex:1,padding:10,borderRadius:8,background:T.rose,color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}><ThumbsDown size={14}/>Reject</button>
          <button onClick={()=>setCaseAction("info")} style={{flex:1,padding:10,borderRadius:8,background:T.white,color:T.t500,border:`1px solid ${T.border}`,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}><FileText size={14}/>Request Info</button>
        </div></>)}
        {caseAction&&(<div style={{padding:"10px 12px",borderRadius:8,background:caseAction==="approved"?T.emeraldBg:caseAction==="rejected"?T.roseBg:T.amberBg,border:`1px solid ${caseAction==="approved"?T.emerald:caseAction==="rejected"?T.rose:T.amber}20`}}><p style={{fontSize:10,fontWeight:600,color:caseAction==="approved"?T.emerald:caseAction==="rejected"?T.rose:T.amber}}>{caseAction==="approved"?"✓ Case approved — payment released":caseAction==="rejected"?"✗ Case rejected — account temporarily blocked":"📋 Additional information requested from client"}</p></div>)}
        <p style={{fontSize:9,color:T.t400,textAlign:"center",marginTop:10}}>Bureau · AML Screening API v2.4</p>
      </div>
    </div>)}
  </div>);

  return (
    <DemoShell
      badge="AML Screening"
      overviewTitle="Cross-Border Payment Screening"
      overview={overviewBody}
      journeySteps={steps}
      currentStep={Math.min(Math.max(step-1,0),steps.length-1)}
      phone={phoneContent()}
      results={resultsBody}
      hasResults={step>=3}
      fraud={fraud}
      onToggleFraud={toggleFraud}
      nextLabel={atEnd?"Request Demo":step===2?"Confirm & Send":"Continue"}
      nextIsRequestDemo={atEnd}
      onStart={()=>setStep(1)}
      onNext={goNext}
      onBack={goBack}
      onReset={reset}
    />
  );
}
