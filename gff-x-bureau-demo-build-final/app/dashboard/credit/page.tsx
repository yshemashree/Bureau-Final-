"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Shield, CheckCircle, XCircle, ChevronRight, ChevronLeft, AlertTriangle, User, Wifi, Signal as SignalIcon, Clock, RotateCcw, ShieldCheck, Smartphone, Mail, Phone, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Network, Hash, Globe, Search, Fingerprint, Activity, Zap, Eye } from "lucide-react";
import { DemoShell } from "@/components/demo-shell";
import * as d3 from "d3";

const BUREAU_LOGO="/bureau-logo.png";

const PP_COLOR="#253B80";
const PPLogo=({h=22})=>(<svg height={h} viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg"><path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/><path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/><path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/><path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/><path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/></svg>);
const PPLogoWhite=({h=20})=>(<svg height={h} viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/><path fill="#fff" opacity="0.7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/><path fill="#fff" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/><path fill="#fff" opacity="0.7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/><path fill="#fff" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/></svg>);
const T={primary:"#253B80",primaryBg:"rgba(37,59,128,0.06)",rose:"#E11D48",roseBg:"rgba(225,29,72,0.08)",amber:"#D97706",amberBg:"rgba(217,119,6,0.08)",emerald:"#059669",emeraldBg:"rgba(5,150,105,0.08)",blue:"#2563EB",blueBg:"rgba(37,99,235,0.08)",violet:"#7C3AED",violetBg:"rgba(124,58,237,0.08)",teal:"#0D9488",tealBg:"rgba(13,148,136,0.08)",bg:"#f5f7fa",white:"#fff",border:"#e5e7eb",borderLight:"#f3f4f6",t900:"#111827",t700:"#374151",t500:"#6b7280",t400:"#9ca3af",t300:"#d1d5db",mono:"'JetBrains Mono',ui-monospace,monospace",sans:"'DM Sans',ui-sans-serif,system-ui,sans-serif"};
function detectRegion(){try{const z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";if(/Kolkata|Mumbai|Chennai|Delhi/.test(z))return"IN";if(/Singapore|Kuala_Lumpur|Jakarta|Bangkok|Manila/.test(z))return"SEA";return"US";}catch{return"US";}}
const RI={
  US:{flag:"🇺🇸",country:"United States",phone:"+1 332-847-9012",email:"james.anderson@gmail.com",name:"James Anderson",carrier:"T-Mobile",city:"New York",state:"NY",
    emailSocial:["Google","Facebook","Instagram","LinkedIn","Amazon","Apple","Microsoft","GitHub","Netflix","Spotify","Twitter","Adobe","Airbnb","Pinterest","Discord","Reddit","Uber","Slack","Zoom","Dropbox"],
    emailNotFound:["TikTok","Snapchat","WhatsApp","Telegram","Viber","WeChat","Skype","Twitch","YouTube","Tumblr"],
    phoneSocial:["Google","Facebook","WhatsApp","Instagram","Twitter","Microsoft","LinkedIn","Telegram","Uber","Signal"],
    phoneNotFound:["Amazon","Snapchat","TikTok","Skype","Viber","WeChat","Line","Kakao","Venmo","CashApp","Robinhood","Coinbase","PayPal","DoorDash","Lyft"]},
  IN:{flag:"🇮🇳",country:"India",phone:"+91 98567-73220",email:"rajesh.kumar@gmail.com",name:"Rajesh Kumar",carrier:"Jio",city:"Mumbai",state:"Maharashtra",
    emailSocial:["Google","Facebook","Instagram","LinkedIn","Amazon","Microsoft","GitHub","Twitter","Adobe","Airbnb","Netflix","Paytm","Flipkart","Swiggy","WhatsApp","Discord","Reddit","Spotify","Pinterest","IndiaMART"],
    emailNotFound:["Snapchat","TikTok","Telegram","Viber","WeChat","Skype","Twitch","Tumblr","Line","Kakao"],
    phoneSocial:["WhatsApp","Google","Facebook","Instagram","Paytm","Twitter","Microsoft","Telegram","Truecaller","PhonePe","GPay","Swiggy"],
    phoneNotFound:["Amazon","Snapchat","TikTok","Skype","Viber","WeChat","Line","Kakao","Zalo","Grab","Shopee","Lazada","Bukalapak","Tokopedia","GoJek"]},
  SEA:{flag:"🇸🇬",country:"Singapore",phone:"+65 9123-4567",email:"wei.tan@gmail.com",name:"Wei Lin Tan",carrier:"Singtel",city:"Singapore",state:"Central",
    emailSocial:["Google","Facebook","Instagram","LinkedIn","Amazon","Microsoft","GitHub","Twitter","Adobe","Netflix","Spotify","Grab","Shopee","Discord","Reddit","Pinterest","Airbnb","Apple","Lazada","LINE"],
    emailNotFound:["TikTok","Snapchat","Telegram","Viber","WeChat","Skype","Twitch","Tumblr","Kakao","Zalo"],
    phoneSocial:["WhatsApp","Google","Facebook","Instagram","Twitter","Grab","Microsoft","Telegram","LINE","Shopee","Lazada","GoPay"],
    phoneNotFound:["Amazon","Snapchat","TikTok","Skype","Viber","WeChat","Kakao","Zalo","Paytm","Flipkart","Swiggy","IndiaMART","Bukalapak","Tokopedia","GoJek"]}
};
const NC={phone:"#253B80",email:"#E07A5F",name:"#7C3AED",device:"#D97706",identity:"#059669",ip:"#F472B6"};

/* Phone components */
const StatusBar=()=>{const[t,sT]=useState("");useEffect(()=>{const u=()=>sT(new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}));u();const iv=setInterval(u,10000);return()=>clearInterval(iv);},[]);return(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 20px 4px",fontSize:11,fontWeight:600,color:"#1a1a1a"}}><span style={{fontWeight:700}}>{t}</span><div style={{width:72,height:22,borderRadius:16,background:"#1a1a1a"}}/><div style={{display:"flex",gap:3,alignItems:"center"}}><SignalIcon size={11}/><Wifi size={11}/><div style={{width:18,height:9,borderRadius:2,border:"1.5px solid #1a1a1a",position:"relative",display:"flex",alignItems:"center",padding:1}}><div style={{width:"75%",height:"100%",borderRadius:1,background:"#1a1a1a"}}/></div></div></div>);};
const PhoneFrame=({children})=>(<div style={{position:"relative",width:266,height:546,flexShrink:0}}><div style={{position:"absolute",right:-2.5,top:130,width:3,height:40,borderRadius:"0 2px 2px 0",background:"#2a2a2a"}}/><div style={{position:"absolute",left:-2.5,top:110,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#2a2a2a"}}/><div style={{position:"absolute",left:-2.5,top:148,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#2a2a2a"}}/><div style={{width:260,height:540,borderRadius:36,background:"linear-gradient(145deg,#2a2a2a,#1a1a1a 50%,#2a2a2a)",padding:3,boxShadow:"0 20px 60px rgba(0,0,0,0.25)",margin:"0 auto"}}><div style={{width:"100%",height:"100%",borderRadius:33,background:"#000",padding:2}}><div style={{width:"100%",height:"100%",borderRadius:31,background:"#fff",overflow:"hidden",display:"flex",flexDirection:"column"}}><StatusBar/><div style={{flex:1,overflow:"hidden"}}>{children}</div><div style={{padding:"5px 0 7px",display:"flex",justifyContent:"center",background:"#fff"}}><div style={{width:100,height:4,borderRadius:2,background:"#d1d5db"}}/></div></div></div></div></div>);
const Badge=({text,color})=>(<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,background:color+"18",color}}>{text}</span>);
const CheckRow=({label,value,pass,show=true})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.borderLight}`,opacity:show?1:0,transition:"all 0.3s"}}><span style={{fontSize:13,color:T.t700}}>{label}</span><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:600,color:pass?T.emerald:T.rose}}>{value}</span>{pass?<CheckCircle size={14} color={T.emerald}/>:<XCircle size={14} color={T.rose}/>}</div></div>);

/* Interactive Graph */
function GraphViz({fraud,ri}){
  const svgRef=useRef(null);const[tooltip,setTooltip]=useState(null);
  useEffect(()=>{
    if(!svgRef.current)return;
    const W=svgRef.current.parentElement?.clientWidth||600,H=420;
    d3.select(svgRef.current).selectAll("*").remove();
    const svg=d3.select(svgRef.current).attr("viewBox",`0 0 ${W} ${H}`).attr("width","100%").attr("height",H);
    const g=svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.3,5]).on("zoom",(e)=>g.attr("transform",e.transform)));
    const ph=ri.phone.replace(/[\s\-\+\(\)]/g,"").slice(-6);
    const initNodes=fraud?[
      {id:ph,type:"phone",label:ph,r:24,fx:W/2,fy:H/2,depth:0},
      {id:"e1",type:"email",label:"ba***12@",r:16,depth:1},{id:"e2",type:"email",label:"pr***k@",r:16,depth:1},{id:"e3",type:"email",label:"ga***sh@",r:16,depth:1},{id:"e4",type:"email",label:"ba***sh@",r:14,depth:1},{id:"e5",type:"email",label:"br***12@",r:14,depth:1},
      {id:"n1",type:"name",label:"Anil",r:14,depth:1},{id:"n2",type:"name",label:"Barjesh",r:14,depth:1},{id:"n3",type:"name",label:"Priyanka",r:13,depth:1},{id:"n4",type:"name",label:"Ganesh",r:13,depth:1},
      {id:"d1",type:"device",label:"A81c***",r:15,depth:1},{id:"d2",type:"device",label:"8b0d***",r:15,depth:1},
      {id:"ip1",type:"ip",label:"103.21.***",r:11,depth:1},
    ]:[
      {id:ph,type:"phone",label:ph,r:24,fx:W/2,fy:H/2,depth:0},
      {id:"e1",type:"email",label:ri.email.split("@")[0].slice(0,5)+"***",r:16,depth:1},
      {id:"n1",type:"name",label:ri.name.split(" ")[0],r:14,depth:1},
      {id:"d1",type:"device",label:"ffbe5***",r:15,depth:1},
    ];
    const initLinks=fraud?[
      {source:ph,target:"e1"},{source:ph,target:"e2"},{source:ph,target:"e3"},{source:ph,target:"e4"},{source:ph,target:"e5"},
      {source:ph,target:"n1"},{source:ph,target:"n2"},{source:ph,target:"n3"},{source:ph,target:"n4"},
      {source:ph,target:"d1"},{source:ph,target:"d2"},{source:ph,target:"ip1"},
      {source:"d1",target:"e3"},{source:"d2",target:"e5"},
    ]:[
      {source:ph,target:"e1"},{source:ph,target:"n1"},{source:ph,target:"d1"},
    ];
    // Expandable nodes for fraud case
    const expandData=fraud?{
      "d1":{nodes:[{id:"d1_e1",type:"email",label:"fs***24@",r:11,depth:2},{id:"d1_e2",type:"email",label:"mk***9@",r:11,depth:2},{id:"d1_n1",type:"name",label:"Suresh",r:11,depth:2},{id:"d1_n2",type:"name",label:"Ravi K",r:11,depth:2},{id:"d1_id1",type:"identity",label:"ID***82",r:10,depth:2}],links:[{source:"d1",target:"d1_e1"},{source:"d1",target:"d1_e2"},{source:"d1",target:"d1_n1"},{source:"d1",target:"d1_n2"},{source:"d1",target:"d1_id1"}]},
      "d2":{nodes:[{id:"d2_e1",type:"email",label:"xk***7@",r:11,depth:2},{id:"d2_n1",type:"name",label:"Anil T",r:11,depth:2},{id:"d2_ip1",type:"ip",label:"45.33.***",r:10,depth:2}],links:[{source:"d2",target:"d2_e1"},{source:"d2",target:"d2_n1"},{source:"d2",target:"d2_ip1"}]},
      "n2":{nodes:[{id:"n2_e1",type:"email",label:"bm***@",r:11,depth:2},{id:"n2_d1",type:"device",label:"c4f2***",r:11,depth:2}],links:[{source:"n2",target:"n2_e1"},{source:"n2",target:"n2_d1"}]},
    }:{};
    let nodes=[...initNodes],links=[...initLinks];const expanded=new Set();
    function render(){
      g.selectAll("*").remove();
      const sim=d3.forceSimulation(nodes).force("link",d3.forceLink(links).id(d=>d.id).distance(d=>d.source?.depth===0?80:60)).force("charge",d3.forceManyBody().strength(-100)).force("center",d3.forceCenter(W/2,H/2)).force("collision",d3.forceCollide().radius(d=>d.r+6));
      const link=g.append("g").selectAll("line").data(links).join("line").attr("stroke","#c4c9d4").attr("stroke-width",1.5).attr("stroke-opacity",0.5);
      const node=g.append("g").selectAll("g").data(nodes).join("g").style("cursor","pointer").call(d3.drag().on("start",(e,d)=>{if(!e.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;}).on("drag",(e,d)=>{d.fx=e.x;d.fy=e.y;}).on("end",(e,d)=>{if(!e.active)sim.alphaTarget(0);if(d.depth!==0){d.fx=null;d.fy=null;}}));
      node.append("circle").attr("r",d=>d.r).attr("fill",d=>NC[d.type]||"#888").attr("stroke","#fff").attr("stroke-width",2).attr("opacity",0.9);
      node.append("text").text(d=>d.label).attr("text-anchor","middle").attr("dy","0.35em").attr("font-size",d=>d.r>16?8:7).attr("font-weight",600).attr("fill","#fff").attr("pointer-events","none");
      node.on("click",(e,d)=>{
        if(d.depth===0)return;
        if(expandData[d.id]&&!expanded.has(d.id)){
          expanded.add(d.id);
          const ex=expandData[d.id];
          ex.nodes.forEach(n=>{n.x=d.x+(Math.random()-0.5)*40;n.y=d.y+(Math.random()-0.5)*40;nodes.push(n);});
          ex.links.forEach(l=>links.push({...l}));
          sim.stop();render();
        }else if(!expandData[d.id]&&d.depth>=1){
          // Show tooltip "No more connections"
          const tt=g.append("g").attr("transform",`translate(${d.x},${d.y-d.r-12})`);
          tt.append("rect").attr("x",-55).attr("y",-10).attr("width",110).attr("height",20).attr("rx",4).attr("fill","#1f2937").attr("opacity",0.9);
          tt.append("text").text("No more connections").attr("text-anchor","middle").attr("dy","0.35em").attr("font-size",7).attr("fill","#fff");
          setTimeout(()=>tt.remove(),1500);
        }
      });
      sim.on("tick",()=>{link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y).attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);node.attr("transform",d=>`translate(${d.x},${d.y})`);});
    }
    render();
    return()=>{};
  },[fraud,ri]);
  return(<svg ref={svgRef} style={{width:"100%",borderRadius:10,background:T.bg,border:`1px solid ${T.border}`}}/>);
}

const SocialGrid=({found,notFound,label})=>(<div style={{marginBottom:10}}>
  <p style={{fontSize:11,color:T.t400,marginBottom:6,fontWeight:600}}>Top Signals</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{found.map((s,i)=>(<span key={i} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:6,background:T.primaryBg,color:T.primary,border:`1px solid ${T.primary}20`}}>{s}</span>))}{notFound.slice(0,8).map((s,i)=>(<span key={"n"+i} style={{fontSize:11,fontWeight:500,padding:"5px 10px",borderRadius:6,background:T.bg,color:T.t300,border:`1px solid ${T.borderLight}`}}>{s}</span>))}</div>
  <p style={{fontSize:10,color:T.t500,marginTop:6}}><strong>* Bureau checks 100+ social and digital signals</strong></p>
</div>);

export default function BureauCreditDemo(){
  const[reg]=useState(()=>detectRegion());const ri=RI[reg]||RI.US;const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
  const[time,setTime]=useState("");useEffect(()=>{const u=()=>setTime(new Date().toLocaleTimeString("en-US",{hour12:false,timeZone:tz}));u();const iv=setInterval(u,10000);return()=>clearInterval(iv);},[tz]);
  const[step,setStep]=useState(0);const[fraud,setFraud]=useState(false);const[loading,setLoading]=useState(false);const[exp,setExp]=useState({});const[anim,setAnim]=useState(0);const rightRef=useRef(null);const[showDemoModal,setShowDemoModal]=useState(false);
  const togExp=(k)=>setExp(p=>({...p,[k]:!p[k]}));
  const steps=["Welcome","Credit Assessment"];
  useEffect(()=>{setAnim(0);if(step<1)return;const timers=[];for(let i=1;i<=5;i++){timers.push(setTimeout(()=>{setAnim(i);},i*700));}return()=>timers.forEach(clearTimeout);},[step]);
  const goNext=()=>{if(step<1&&!loading){setLoading(true);setStep(1);setTimeout(()=>{setLoading(false);},3000);}};const reset=()=>{setStep(0);setExp({});setAnim(0);setLoading(false);};
  const atEnd=step>=1;
  const ESection=({title,icon:Icon,color=T.primary,children,show=true})=>{const open=exp[title]===undefined?true:exp[title];return(<div style={{background:T.white,borderRadius:12,border:`1px solid ${T.border}`,marginBottom:10,overflow:"hidden",opacity:show?1:0,transition:"all 0.5s"}}><div onClick={()=>togExp(title)} style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><div style={{width:32,height:32,borderRadius:8,background:color+"14",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={16} color={color}/></div><span style={{fontSize:14,fontWeight:600,flex:1}}>{title}</span>{open?<ChevronUp size={16} color={T.t400}/>:<ChevronDown size={16} color={T.t400}/>}</div>{open&&<div style={{padding:"0 18px 18px",borderTop:`1px solid ${T.borderLight}`}}>{children}</div>}</div>);};

  const phoneScreen=()=>{
    if(step===0)return(<div style={{height:"100%",display:"flex",flexDirection:"column",background:"#fff"}}><div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e5e7eb"}}><PPLogo h={32}/></div><div style={{flex:1,background:"#fff",padding:"24px 16px 14px",display:"flex",flexDirection:"column"}}><p style={{fontSize:16,fontWeight:800,color:T.t900,marginBottom:2}}>Apply for Credit</p><p style={{fontSize:10,color:T.t400,marginBottom:16}}>Bureau will assess your credit risk instantly</p><div style={{flex:1}}><div style={{marginBottom:12}}><label style={{fontSize:9,fontWeight:600,color:T.t500,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Mobile Number</label><div style={{padding:"11px 12px",borderRadius:10,border:"1.5px solid #e5e7eb",fontSize:12,color:T.t900,display:"flex",alignItems:"center",gap:8,background:"#fafafa"}}><div style={{width:22,height:22,borderRadius:6,background:PP_COLOR,display:"flex",alignItems:"center",justifyContent:"center"}}><Phone size={11} color="#fff"/></div>{ri.phone}</div></div><div style={{marginBottom:12}}><label style={{fontSize:9,fontWeight:600,color:T.t500,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Email Address</label><div style={{padding:"11px 12px",borderRadius:10,border:"1.5px solid #e5e7eb",fontSize:12,color:T.t900,display:"flex",alignItems:"center",gap:8,background:"#fafafa"}}><div style={{width:22,height:22,borderRadius:6,background:PP_COLOR,display:"flex",alignItems:"center",justifyContent:"center"}}><Mail size={11} color="#fff"/></div>{ri.email}</div></div><div style={{marginBottom:16}}><label style={{fontSize:9,fontWeight:600,color:T.t500,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>Full Name</label><div style={{padding:"11px 12px",borderRadius:10,border:"1.5px solid #e5e7eb",fontSize:12,color:T.t900,display:"flex",alignItems:"center",gap:8,background:"#fafafa"}}><div style={{width:22,height:22,borderRadius:6,background:T.primary,display:"flex",alignItems:"center",justifyContent:"center"}}><User size={11} color="#fff"/></div>{ri.name}</div></div></div><div onClick={goNext} style={{padding:12,borderRadius:10,background:T.primary,color:"#fff",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer"}}>Continue →</div></div></div>);
    if(loading)return(<div style={{height:"100%",display:"flex",flexDirection:"column",background:"#fff"}}><div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e5e7eb"}}><PPLogo h={28}/></div><div style={{flex:1,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}><div style={{width:48,height:48,borderRadius:"50%",border:`3px solid ${T.border}`,borderTopColor:PP_COLOR,animation:"spin 1s linear infinite",marginBottom:16}}/><p style={{fontSize:14,fontWeight:700,color:T.t900}}>Verifying...</p><p style={{fontSize:10,color:T.t400,marginTop:6,textAlign:"center"}}>Please wait while we assess your credit</p></div></div>);
    return(<div style={{height:"100%",display:"flex",flexDirection:"column",background:"#fff"}}><div style={{padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e5e7eb"}}><PPLogo h={28}/></div><div style={{flex:1,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}><div style={{width:90,height:90,borderRadius:"50%",background:fraud?"#FEE2E2":"#D1FAE5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,animation:"scaleIn 0.5s ease"}}>{fraud?<XCircle size={44} color={T.rose}/>:<CheckCircle size={44} color={T.emerald}/>}</div><p style={{fontSize:20,fontWeight:800,color:fraud?T.rose:T.emerald}}>{fraud?"Credit Declined":"Credit Approved"}</p><p style={{fontSize:11,color:T.t400,marginTop:6,textAlign:"center"}}>{fraud?"Your credit application was not approved at this time.":"Congratulations! Your PayPal Credit line is approved."}</p></div></div>);
  };

  const overviewBody=(<div><div style={{background:T.bg,borderRadius:12,padding:"8px 16px 0px 16px",border:`1px solid ${T.border}`,lineHeight:1.8,marginBottom:18}}><p style={{fontSize:11,color:T.t500}}>Bureau's Credit Risk Score assesses creditworthiness in under 500ms using alternate data - phone intelligence, email intelligence, social footprint, and Bureau's Graph Intelligence Network (GIN). Built for thin-file and new-to-credit customers.</p><p style={{fontSize:11,color:T.t500,marginTop:10}}>One API. Bureau's GIN maps 1B+ identities and 100+ signals to fill gaps traditional bureaus miss - ideal for gig workers and emerging markets. Works alongside bureau scores to cut default rates by 25% while approving more genuine applicants.</p></div><p style={{fontSize:11,fontWeight:700,color:T.t400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>Signals Evaluated</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[{i:Mail,l:"Email Intelligence"},{i:Globe,l:"Email Social Footprint"},{i:Phone,l:"Phone Intelligence"},{i:Globe,l:"Phone Social Footprint"},{i:Network,l:"Graph Network Score"},{i:Fingerprint,l:"Device Fingerprint"}].map((c,i)=>(<div key={i} style={{background:T.white,borderRadius:8,padding:10,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:6}}><c.i size={14} color={T.primary}/><span style={{fontSize:11,fontWeight:600}}>{c.l}</span></div>))}</div></div>);

  const resultsBody=(<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"14px 18px",borderRadius:12,background:fraud?T.roseBg:T.emeraldBg,border:`1px solid ${fraud?T.rose:T.emerald}20`,marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:10}}>{fraud?<AlertTriangle size={22} color={T.rose}/>:<CheckCircle size={22} color={T.emerald}/>}<p style={{fontSize:16,fontWeight:700,color:fraud?T.rose:T.emerald}}>{fraud?"Credit Application Declined":"Credit Approved"}</p></div><p style={{fontSize:13,fontWeight:600,color:fraud?T.rose:T.emerald}}>{fraud?"High Risk":"Low Risk"}</p></div>

      <ESection title="Email Intelligence" icon={Mail} color={T.blue} show={anim>=1}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 28px",paddingTop:8}}>{[{l:"Domain Valid",v:"Yes",p:true},{l:"Email Valid",v:fraud?"No":"Yes",p:!fraud},{l:"Domain Age",v:fraud?"12 days":"2,156 days",p:!fraud},{l:"Domain Risk",v:fraud?"High":"Low",p:!fraud},{l:"Deliverable",v:fraud?"No":"Yes",p:!fraud},{l:"Corporate Email",v:fraud?"No":"Yes",p:!fraud},{l:"Digital Age",v:fraud?"5 days":"1,847 days",p:!fraud},{l:"Unique Hits",v:fraud?"2":"47",p:!fraud},{l:"Data Breaches",v:fraud?"4":"0",p:!fraud},{l:"First Seen",v:fraud?"2 weeks":"6 years",p:!fraud}].map((c,i)=><CheckRow key={i} label={c.l} value={c.v} pass={c.p} show={anim>=1}/>)}</div></ESection>
      <ESection title="Email Social Footprint" icon={Globe} color={T.violet} show={anim>=2}><div style={{paddingTop:8}}><SocialGrid found={fraud?ri.emailSocial.slice(0,3):ri.emailSocial} notFound={fraud?[...ri.emailSocial.slice(3),...ri.emailNotFound]:ri.emailNotFound}/></div></ESection>
      <ESection title="Phone Intelligence" icon={Phone} color={T.emerald} show={anim>=3}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 28px",paddingTop:8}}>{[{l:"Phone Type",v:"Mobile",p:true},{l:"Carrier",v:ri.carrier,p:true},{l:"Blocklisting",v:fraud?"True":"False",p:!fraud},{l:"State",v:ri.state,p:true},{l:"Country",v:ri.country,p:true},{l:"City",v:ri.city,p:true},{l:"Status",v:fraud?"Inactive":"Active",p:!fraud},{l:"SIM Swap",v:fraud?"Detected":"Clear",p:!fraud},{l:"Name Match",v:fraud?"No Match":"Full Match",p:!fraud},{l:"Phone Age",v:fraud?"8 days":"4.2 years",p:!fraud}].map((c,i)=><CheckRow key={i} label={c.l} value={c.v} pass={c.p} show={anim>=3}/>)}</div></ESection>
      <ESection title="Phone Social Footprint" icon={Globe} color={T.teal} show={anim>=3}><div style={{paddingTop:8}}><SocialGrid found={fraud?ri.phoneSocial.slice(0,2):ri.phoneSocial} notFound={fraud?[...ri.phoneSocial.slice(2),...ri.phoneNotFound]:ri.phoneNotFound}/></div></ESection>
      <ESection title="Bureau Graph Network" icon={Network} color={T.primary} show={anim>=4}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 28px",paddingTop:8}}>{[{l:"Alt Credit Score",v:fraud?"220 (Poor)":"780 (Excellent)",p:!fraud},{l:"Credit History",v:fraud?"No history":"5+ years",p:!fraud},{l:"Income Stability",v:fraud?"Unstable":"Stable",p:!fraud},{l:"Debt-to-Income",v:fraud?"85%":"32%",p:!fraud},{l:"Identity Consistency",v:fraud?"Mismatch":"Consistent",p:!fraud},{l:"Application Velocity",v:fraud?"6 apps/month":"Normal",p:!fraud}].map((c,i)=><CheckRow key={i} label={c.l} value={c.v} pass={c.p} show={anim>=4}/>)}</div></ESection>

      {anim>=5&&<div style={{marginTop:6}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700}}>Identity Graph Network</span><span style={{fontSize:9,color:T.t400}}>Click nodes to expand · Scroll to zoom · Drag to pan</span></div>
        <GraphViz fraud={fraud} ri={ri}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:8,padding:8,background:T.bg,borderRadius:8,border:`1px solid ${T.border}`}}>{[{l:"Phone",c:NC.phone},{l:"Email",c:NC.email},{l:"Name",c:NC.name},{l:"Device",c:NC.device},{l:"Identity",c:NC.identity},{l:"IP Address",c:NC.ip}].map((n,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:"50%",background:n.c}}/><span style={{fontSize:9,color:T.t500}}>{n.l}</span></div>))}</div>
      </div>}
    </div>);
  return (
    <DemoShell
      badge="Credit Risk Score"
      overviewTitle="Bureau Credit Risk Score"
      overview={overviewBody}
      journeySteps={steps}
      currentStep={step}
      phone={phoneScreen()}
      results={resultsBody}
      hasResults={atEnd && !loading}
      region={{ flag: ri.flag, country: ri.country }}
      fraud={fraud}
      onToggleFraud={() => setFraud(!fraud)}
      nextLabel={loading ? "Verifying" : step === 0 ? "Assess Credit" : "Request Demo"}
      nextDisabled={loading}
      nextIsRequestDemo={atEnd && !loading}
      onNext={goNext}
      onBack={reset}
      onReset={reset}
    />
  );
}
