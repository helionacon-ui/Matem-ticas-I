/* Figuras interactivas de Matemáticas I. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* 1 complejos: forma polar, potencias y raíces */
SIMS.complejos=el=>build(el,{sliders:[{k:'r',l:'módulo |z|',v:1.3,min:0.2,max:2,step:0.01},{k:'th',l:'argumento',v:40,min:-180,max:180,step:1,u:'°'},{k:'n',l:'n (potencia y raíces)',v:3,min:2,max:8,step:1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=70;a.axes(cx,cy,u,-4,4,-2.4,2.4);a.circ(cx,cy,u,C.grid,false);
    const th=s.th*Math.PI/180,re=s.r*Math.cos(th),im=s.r*Math.sin(th);
    a.arrow(cx,cy,cx+re*u,cy-im*u,C.a,3);a.txt('z',cx+re*u+6,cy-im*u-6,C.a,15);
    const rn=Math.pow(s.r,s.n),thn=th*s.n;const zx=rn*Math.cos(thn),zy=rn*Math.sin(thn);
    if(rn<4.5){a.arrow(cx,cy,cx+zx*u,cy-zy*u,C.b,2);a.txt('zⁿ',cx+zx*u+6,cy-zy*u,C.b,13);}
    const rr=Math.pow(s.r,1/s.n);for(let k=0;k<s.n;k++){const t=(th+2*Math.PI*k)/s.n;const px=cx+rr*Math.cos(t)*u,py=cy-rr*Math.sin(t)*u;a.circ(px,py,5,C.c,true);a.line(cx,cy,px,py,C.c,1,[3,3]);}
    a.txt('raíces n-ésimas (verde): polígono regular',12,20,C.c,12);
    a.html(`z = ${F(re)} ${im<0?'−':'+'} ${F(Math.abs(im))} i = ${F(s.r)}<sub>${s.th}°</sub> · zⁿ = ${F(rn)}<sub>${F(((thn*180/Math.PI)%360+540)%360-180)}°</sub> · raíces: módulo ${F(rr)}, argumentos ${Array.from({length:s.n},(_,k)=>F((s.th+360*k)/s.n)+'°').join(', ')}<br><span class="hint">Multiplicar complejos suma argumentos y multiplica módulos (De Moivre). Las n raíces están equiespaciadas 360°/n.</span>`);}});

/* 2 sistemas 2x2: rectas, rango, Rouché-Frobenius */
SIMS.sistemas=el=>build(el,{sliders:[{k:'a',l:'a',v:1,min:-3,max:3,step:0.1},{k:'b',l:'b',v:1,min:-3,max:3,step:0.1},{k:'c',l:'c',v:2,min:-4,max:4,step:0.1},{k:'d',l:'d',v:2,min:-3,max:3,step:0.1},{k:'e',l:'e',v:-1,min:-3,max:3,step:0.1},{k:'f',l:'f',v:1,min:-4,max:4,step:0.1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=40;a.axes(cx,cy,u,-7,7,-4,4);
    const rect=(p,q,k,col)=>{if(Math.abs(q)>1e-6){a.line(cx-7*u,cy-((k-p*(-7))/q)*u,cx+7*u,cy-((k-p*7)/q)*u,col,2.5);}else if(Math.abs(p)>1e-6){a.line(cx+(k/p)*u,cy-4*u,cx+(k/p)*u,cy+4*u,col,2.5);}};
    rect(s.a,s.b,s.c,C.a);rect(s.d,s.e,s.f,C.b);
    const det=s.a*s.e-s.b*s.d;const rA=(Math.abs(det)>1e-6)?2:((Math.abs(s.a)+Math.abs(s.b)+Math.abs(s.d)+Math.abs(s.e))>1e-6?1:0);
    const m3=[s.a*s.f-s.c*s.d, s.b*s.f-s.c*s.e];const rAB=rA===2?2:(Math.abs(m3[0])+Math.abs(m3[1])>1e-6?2:rA);
    let txt;if(rA===2){const X=(s.c*s.e-s.b*s.f)/det,Y=(s.a*s.f-s.c*s.d)/det;a.circ(cx+X*u,cy-Y*u,6,C.c,true);txt=`rg(A)=rg(A|B)=2=n → <b>compatible determinado</b>: (x,y)=(${F(X)}, ${F(Y)})`;}
    else if(rA===rAB)txt=`rg(A)=rg(A|B)=${rA}&lt;2 → <b>compatible indeterminado</b> (rectas coincidentes, ${2-rA} parámetro)`;else txt=`rg(A)=${rA}≠rg(A|B)=${rAB} → <b>incompatible</b> (rectas paralelas)`;
    a.html(`${F(s.a)}x + ${F(s.b)}y = ${F(s.c)} ; ${F(s.d)}x + ${F(s.e)}y = ${F(s.f)} · det A = ${F(det)}<br>${txt}<br><span class="hint">Rouché-Frobenius en imagen: det≠0 un punto de corte; filas proporcionales con términos independientes proporcionales, misma recta; si no, paralelas.</span>`);}});

/* 3 bases y coordenadas en R2 */
SIMS.bases=el=>build(el,{sliders:[{k:'ux',l:'u₁ₓ',v:2,min:-3,max:3,step:0.1},{k:'uy',l:'u₁ᵧ',v:0.5,min:-3,max:3,step:0.1},{k:'vx',l:'u₂ₓ',v:0.5,min:-3,max:3,step:0.1},{k:'vy',l:'u₂ᵧ',v:1.5,min:-3,max:3,step:0.1},{k:'px',l:'vector x (canónica)',v:2,min:-4,max:4,step:0.1},{k:'py',l:'vector y (canónica)',v:3,min:-4,max:4,step:0.1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=42;a.axes(cx,cy,u,-7,7,-4,4);
    const det=s.ux*s.vy-s.uy*s.vx;
    // rejilla de la base B
    if(Math.abs(det)>1e-6){for(let i=-6;i<=6;i++){a.line(cx+(i*s.ux-6*s.vx)*u,cy-(i*s.uy-6*s.vy)*u,cx+(i*s.ux+6*s.vx)*u,cy-(i*s.uy+6*s.vy)*u,'rgba(180,35,47,0.18)',1);a.line(cx+(i*s.vx-6*s.ux)*u,cy-(i*s.vy-6*s.uy)*u,cx+(i*s.vx+6*s.ux)*u,cy-(i*s.vy+6*s.uy)*u,'rgba(180,35,47,0.18)',1);}}
    a.arrow(cx,cy,cx+s.ux*u,cy-s.uy*u,C.a,3);a.txt('u₁',cx+s.ux*u+5,cy-s.uy*u,C.a,14);a.arrow(cx,cy,cx+s.vx*u,cy-s.vy*u,C.a,3);a.txt('u₂',cx+s.vx*u+5,cy-s.vy*u,C.a,14);
    a.arrow(cx,cy,cx+s.px*u,cy-s.py*u,C.c,3);a.txt('v',cx+s.px*u+6,cy-s.py*u-6,C.c,15);
    if(Math.abs(det)<1e-6){a.html('det = 0: u₁ y u₂ son linealmente dependientes, <b>no forman base</b>.');return;}
    const al=(s.px*s.vy-s.py*s.vx)/det, be=(s.ux*s.py-s.uy*s.px)/det;
    a.line(cx,cy,cx+al*s.ux*u,cy-al*s.uy*u,C.b,2,[5,4]);a.line(cx+al*s.ux*u,cy-al*s.uy*u,cx+s.px*u,cy-s.py*u,C.b,2,[5,4]);
    a.html(`M<sub>BC</sub> = (u₁ | u₂) por columnas, det = ${F(det)} · coordenadas de v en B: v = ${F(al)}·u₁ + ${F(be)}·u₂ → <b>(${F(al)}, ${F(be)})<sub>B</sub></b> = M<sub>BC</sub><sup>−1</sup>·v<br><span class="hint">La rejilla roja es la base B. Las coordenadas en B se obtienen resolviendo el sistema (o con la inversa de la matriz de cambio).</span>`);}});

/* 4 aplicación lineal 2x2: imagen de la rejilla, núcleo, determinante */
SIMS.aplicacion=el=>build(el,{sliders:[{k:'a',l:'a₁₁',v:1,min:-2,max:2,step:0.1},{k:'b',l:'a₁₂',v:1,min:-2,max:2,step:0.1},{k:'c',l:'a₂₁',v:0,min:-2,max:2,step:0.1},{k:'d',l:'a₂₂',v:1,min:-2,max:2,step:0.1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=40;a.axes(cx,cy,u,-7,7,-4,4);
    const T=(x,y)=>[s.a*x+s.b*y,s.c*x+s.d*y];
    for(let i=-4;i<=4;i++){for(const [p,q] of [[[i,-4],[i,4]],[[-4,i],[4,i]]]){const A=T(...p),B=T(...q);a.line(cx+A[0]*u,cy-A[1]*u,cx+B[0]*u,cy-B[1]*u,'rgba(180,35,47,0.25)',1);}}
    const e1=T(1,0),e2=T(0,1);a.g.fillStyle='rgba(44,138,82,0.25)';a.g.beginPath();a.g.moveTo(cx,cy);a.g.lineTo(cx+e1[0]*u,cy-e1[1]*u);a.g.lineTo(cx+(e1[0]+e2[0])*u,cy-(e1[1]+e2[1])*u);a.g.lineTo(cx+e2[0]*u,cy-e2[1]*u);a.g.closePath();a.g.fill();
    a.arrow(cx,cy,cx+e1[0]*u,cy-e1[1]*u,C.a,3);a.txt('f(e₁)',cx+e1[0]*u+5,cy-e1[1]*u,C.a,13);a.arrow(cx,cy,cx+e2[0]*u,cy-e2[1]*u,C.b,3);a.txt('f(e₂)',cx+e2[0]*u+5,cy-e2[1]*u,C.b,13);
    const det=s.a*s.d-s.b*s.c;let ker='{0}',im='R² (rango 2)';
    if(Math.abs(det)<1e-6){const r=(Math.abs(s.a)+Math.abs(s.b)+Math.abs(s.c)+Math.abs(s.d))>1e-6?1:0;if(r===1){const k=Math.abs(s.a)>1e-6||Math.abs(s.b)>1e-6?[-s.b,s.a]:[-s.d,s.c];ker=`⟨(${F(k[0])}, ${F(k[1])})⟩ (recta)`;const n=k[0]*k[0]+k[1]*k[1];const kk=[k[0]/Math.sqrt(n)*6,k[1]/Math.sqrt(n)*6];a.line(cx-kk[0]*u,cy+kk[1]*u,cx+kk[0]*u,cy-kk[1]*u,C.d,2.5,[6,4]);im=`recta ⟨(${F(e1[0]||e2[0])}, ${F(e1[1]||e2[1])})⟩ (rango 1)`;}else{ker='R²';im='{0}';}}
    a.html(`det = ${F(det)} → el área del cuadrado unidad pasa a ser |det| = ${F(Math.abs(det))} (verde) · <b>Ker f</b> = ${ker} · <b>Im f</b> = ${im}<br><span class="hint">Las columnas de la matriz son las imágenes de la base. Si det = 0 la rejilla se aplasta sobre una recta: el núcleo (línea discontinua) es lo que va a parar al origen. dim Ker + dim Im = 2.</span>`);}});

/* 5 autovectores */
SIMS.autovectores=el=>build(el,{sliders:[{k:'a',l:'a₁₁',v:2,min:-3,max:3,step:0.1},{k:'b',l:'a₁₂',v:1,min:-3,max:3,step:0.1},{k:'c',l:'a₂₁',v:1,min:-3,max:3,step:0.1},{k:'d',l:'a₂₂',v:2,min:-3,max:3,step:0.1},{k:'th',l:'dirección de v',v:30,min:0,max:180,step:1,u:'°'}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=40;a.axes(cx,cy,u,-7,7,-4,4);
    const th=s.th*Math.PI/180,v=[Math.cos(th),Math.sin(th)],Av=[s.a*v[0]+s.b*v[1],s.c*v[0]+s.d*v[1]];
    const tr=s.a+s.d,det=s.a*s.d-s.b*s.c,disc=tr*tr/4-det;let info;
    if(disc>=0){const l1=tr/2+Math.sqrt(disc),l2=tr/2-Math.sqrt(disc);const ev=l=>{let w=Math.abs(s.b)>1e-6?[s.b,l-s.a]:(Math.abs(s.c)>1e-6?[l-s.d,s.c]:(Math.abs(s.a-l)<1e-6?[1,0]:[0,1]));const n=Math.hypot(...w);return [w[0]/n,w[1]/n];};
      for(const [l,col] of [[l1,C.c],[l2,C.d]]){const w=ev(l);a.line(cx-w[0]*6*u,cy+w[1]*6*u,cx+w[0]*6*u,cy-w[1]*6*u,col,2,[6,4]);a.txt('λ='+F(l),cx+w[0]*3.2*u+4,cy-w[1]*3.2*u,col,12);}
      info=`λ = ${F(l1)}, ${F(l2)} (reales). ${Math.abs(l1-l2)<1e-6&&Math.abs(s.b)+Math.abs(s.c)>1e-6?'Valor doble con un solo vector propio: <b>no diagonalizable</b>.':'<b>Diagonalizable</b>: las rectas discontinuas son los subespacios propios.'}`;}
    else info=`λ complejos (${F(tr/2)} ± ${F(Math.sqrt(-disc))}i): <b>no diagonalizable en R</b> (giro).`;
    a.arrow(cx,cy,cx+v[0]*u*1.5,cy-v[1]*u*1.5,C.a,3);a.txt('v',cx+v[0]*u*1.5+6,cy-v[1]*u*1.5,C.a,14);a.arrow(cx,cy,cx+Av[0]*u,cy-Av[1]*u,C.b,3);a.txt('A·v',cx+Av[0]*u+6,cy-Av[1]*u,C.b,14);
    const cross=Math.abs(v[0]*Av[1]-v[1]*Av[0]);
    a.html(`p(λ) = λ² − ${F(tr)}λ + ${F(det)} · ${info}<br>Para la dirección elegida, A·v ${cross<0.03?'<b>es paralelo</b> a v: es un vector propio':'no es paralelo a v'}.<br><span class="hint">Gira v hasta que A·v quede alineado: esas direcciones son los vectores propios y el factor de escala es λ.</span>`);}});

/* 6 proyección ortogonal y Gram-Schmidt en R2 */
SIMS.proyeccion=el=>build(el,{sliders:[{k:'wx',l:'w₁ₓ',v:2,min:-3,max:3,step:0.1},{k:'wy',l:'w₁ᵧ',v:1,min:-3,max:3,step:0.1},{k:'vx',l:'vₓ',v:1,min:-3,max:3,step:0.1},{k:'vy',l:'vᵧ',v:2.5,min:-3,max:3,step:0.1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=48;a.axes(cx,cy,u,-6,6,-3.4,3.4);
    const ww=s.wx*s.wx+s.wy*s.wy;if(ww<1e-6){a.html('w₁ = 0');return;}
    const k=(s.vx*s.wx+s.vy*s.wy)/ww,p=[k*s.wx,k*s.wy],o=[s.vx-p[0],s.vy-p[1]];
    a.line(cx-s.wx*6*u,cy+s.wy*6*u,cx+s.wx*6*u,cy-s.wy*6*u,C.grid,1.5);
    a.arrow(cx,cy,cx+s.wx*u,cy-s.wy*u,C.a,3);a.txt('w₁',cx+s.wx*u+6,cy-s.wy*u,C.a,14);
    a.arrow(cx,cy,cx+s.vx*u,cy-s.vy*u,C.c,3);a.txt('v',cx+s.vx*u+6,cy-s.vy*u-6,C.c,14);
    a.arrow(cx,cy,cx+p[0]*u,cy-p[1]*u,C.b,3);a.txt('P_W(v)',cx+p[0]*u+6,cy-p[1]*u+14,C.b,13);
    a.arrow(cx+p[0]*u,cy-p[1]*u,cx+s.vx*u,cy-s.vy*u,C.d,2.5);a.txt('v − P_W(v) ∈ W⊥',cx+(p[0]+s.vx)/2*u+8,cy-(p[1]+s.vy)/2*u,C.d,12);
    const n1=Math.sqrt(ww),no=Math.hypot(...o);
    a.html(`P<sub>W</sub>(v) = (⟨v,w₁⟩/⟨w₁,w₁⟩)·w₁ = ${F(k)}·w₁ = (${F(p[0])}, ${F(p[1])}) · distancia d(v,W) = ‖v − P<sub>W</sub>(v)‖ = ${F(no)}<br>Gram-Schmidt: e₁ = w₁/‖w₁‖ = (${F(s.wx/n1)}, ${F(s.wy/n1)}); e₂ = (v − P<sub>W</sub>(v))/‖·‖ = (${no>1e-6?F(o[0]/no)+', '+F(o[1]/no):'—'})<br><span class="hint">La proyección es el punto de W más cercano a v; el resto es ortogonal a W. Esa es toda la idea de Gram-Schmidt.</span>`);}});

/* 7 programación lineal */
SIMS.pl=el=>build(el,{sliders:[{k:'c1',l:'coef. x en z',v:3,min:-5,max:5,step:0.5},{k:'c2',l:'coef. y en z',v:2,min:-5,max:5,step:0.5},{k:'b1',l:'x + y ≤',v:4,min:1,max:8,step:0.5},{k:'b2',l:'x + 3y ≤',v:6,min:1,max:12,step:0.5},{k:'b3',l:'x ≤',v:3,min:0.5,max:8,step:0.5}],
  selects:[{k:'mode',l:'Objetivo',v:'max',opts:[['max','maximizar z'],['min','minimizar z']]}],
  draw(a){a.clear();const s=a.st,ox=60,oy=a.H-40,u=40;a.axes(ox,oy,u,0,13,0,7.5);
    // vértices de la región x,y>=0, x+y<=b1, x+3y<=b2, x<=b3
    const cons=[[1,1,s.b1],[1,3,s.b2],[1,0,s.b3],[-1,0,0],[0,-1,0]];const pts=[];
    for(let i=0;i<cons.length;i++)for(let j=i+1;j<cons.length;j++){const [a1,b1,c1]=cons[i],[a2,b2,c2]=cons[j];const d=a1*b2-a2*b1;if(Math.abs(d)<1e-9)continue;const x=(c1*b2-c2*b1)/d,y=(a1*c2-a2*c1)/d;if(cons.every(([p,q,r])=>p*x+q*y<=r+1e-9))pts.push([x,y]);}
    const cxm=pts.reduce((t,p)=>t+p[0],0)/pts.length,cym=pts.reduce((t,p)=>t+p[1],0)/pts.length;pts.sort((p,q)=>Math.atan2(p[1]-cym,p[0]-cxm)-Math.atan2(q[1]-cym,q[0]-cxm));
    a.g.fillStyle='rgba(180,35,47,0.18)';a.g.beginPath();pts.forEach((p,i)=>i?a.g.lineTo(ox+p[0]*u,oy-p[1]*u):a.g.moveTo(ox+p[0]*u,oy-p[1]*u));a.g.closePath();a.g.fill();
    let best=null;const vals=pts.map(p=>{const z=s.c1*p[0]+s.c2*p[1];if(best===null||(s.mode==='max'?z>best.z:z<best.z))best={p,z};return {p,z};});
    vals.forEach(v=>{a.circ(ox+v.p[0]*u,oy-v.p[1]*u,5,C.a,true);a.txt(`(${F(v.p[0])},${F(v.p[1])}) z=${F(v.z)}`,ox+v.p[0]*u+7,oy-v.p[1]*u-6,C.text,11);});
    if(best){a.circ(ox+best.p[0]*u,oy-best.p[1]*u,9,C.c,false);if(Math.abs(s.c2)>1e-9){const y0=(best.z-s.c1*0)/s.c2,y1=(best.z-s.c1*12)/s.c2;a.line(ox,oy-y0*u,ox+12*u,oy-y1*u,C.c,2,[6,4]);}}
    a.html(`z = ${F(s.c1)}x + ${F(s.c2)}y sujeto a x+y ≤ ${F(s.b1)}, x+3y ≤ ${F(s.b2)}, x ≤ ${F(s.b3)}, x,y ≥ 0 · <b>Óptimo (${s.mode}) en el vértice (${F(best.p[0])}, ${F(best.p[1])}) con z = ${F(best.z)}</b><br><span class="hint">Teorema fundamental: si hay óptimo, se alcanza en un vértice de la región factible. La recta verde es la curva de nivel z = cte óptima.</span>`);}});

/* 8 Taylor */
SIMS.taylor=el=>build(el,{sliders:[{k:'n',l:'grado n',v:1,min:0,max:7,step:1},{k:'x0',l:'centro x₀',v:0,min:-2,max:2,step:0.1},{k:'xe',l:'evaluar en x',v:1.5,min:-3,max:3,step:0.05}],selects:[{k:'f',l:'función',v:'sin',opts:[['sin','sen x'],['exp','eˣ'],['log','ln(1+x)'],['cos','cos x']]}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2+20,u=60;a.axes(cx,cy,u,-5,5,-2.5,3);
    const fs={sin:[Math.sin,k=>[Math.sin,Math.cos,x=>-Math.sin(x),x=>-Math.cos(x)][k%4]],exp:[Math.exp,k=>Math.exp],cos:[Math.cos,k=>[Math.cos,x=>-Math.sin(x),x=>-Math.cos(x),Math.sin][k%4]],log:[x=>Math.log(1+x),k=>k===0?(x=>Math.log(1+x)):(x=>(k%2?1:-1)*fact(k-1)/Math.pow(1+x,k))]};
    function fact(n){let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
    const [f,d]=fs[s.f];const P=x=>{let t=0;for(let k=0;k<=s.n;k++)t+=d(k)(s.x0)*Math.pow(x-s.x0,k)/fact(k);return t;};
    const plot=(fn,col,wd)=>{a.g.strokeStyle=col;a.g.lineWidth=wd;a.g.beginPath();let pen=false;for(let px=0;px<=a.W;px++){const x=(px-cx)/u;const y=fn(x);if(!isFinite(y)||Math.abs(y)>6){pen=false;continue;}const py=cy-y*u;pen?a.g.lineTo(px,py):a.g.moveTo(px,py);pen=true;}a.g.stroke();};
    plot(f,C.muted,2.5);plot(P,C.a,2.5);a.circ(cx+s.x0*u,cy-f(s.x0)*u,5,C.c,true);
    const err=f(s.xe)-P(s.xe);a.line(cx+s.xe*u,cy-f(s.xe)*u,cx+s.xe*u,cy-P(s.xe)*u,C.d,2);
    a.html(`P<sub>${s.n}</sub>(x) de ${s.f==='log'?'ln(1+x)':s.f==='sin'?'sen x':s.f==='cos'?'cos x':'eˣ'} centrado en x₀=${F(s.x0)} · en x=${F(s.xe)}: f = ${F(f(s.xe))}, P = ${F(P(s.xe))}, <b>error = ${F(err)}</b><br><span class="hint">Resto de Lagrange: |f(x) − P<sub>n</sub>(x)| ≤ máx|f⁽ⁿ⁺¹⁾|·|x−x₀|ⁿ⁺¹/(n+1)!. Sube n o acércate a x₀ y el error baja.</span>`);}});

/* 9 sumas de Riemann */
SIMS.riemann=el=>build(el,{sliders:[{k:'n',l:'n subintervalos',v:6,min:1,max:60,step:1},{k:'b',l:'extremo b',v:2,min:0.5,max:3,step:0.1}],selects:[{k:'t',l:'tipo',v:'izq',opts:[['izq','izquierda'],['der','derecha'],['med','punto medio']]},{k:'f',l:'f(x)',v:'x2',opts:[['x2','x²'],['sq','√x'],['sin','1 + sen x']]}],
  draw(a){a.clear();const s=a.st,ox=50,oy=a.H-40,u=140;const f={x2:x=>x*x,sq:Math.sqrt,sin:x=>1+Math.sin(x)}[s.f];const ex={x2:b=>b**3/3,sq:b=>2/3*b**1.5,sin:b=>b+1-Math.cos(b)}[s.f](s.b);
    a.axes(ox,oy,u,0,3.9,0,2.2);const h=s.b/s.n;let S=0;
    for(let i=0;i<s.n;i++){const xl=i*h,xi=s.t==='izq'?xl:s.t==='der'?xl+h:xl+h/2;const y=f(xi);S+=y*h;a.g.fillStyle='rgba(180,35,47,0.25)';a.g.fillRect(ox+xl*u,oy-y*u,h*u,y*u);a.g.strokeStyle=C.a;a.g.lineWidth=1;a.g.strokeRect(ox+xl*u,oy-y*u,h*u,y*u);}
    a.g.strokeStyle=C.text;a.g.lineWidth=2.5;a.g.beginPath();for(let px=0;px<=3.9*u;px++){const x=px/u;const y=f(x);px?a.g.lineTo(ox+px,oy-y*u):a.g.moveTo(ox+px,oy-y*u);}a.g.stroke();
    a.html(`Suma de Riemann (${s.t}) con n=${s.n}: <b>${F(S)}</b> · valor exacto ∫₀<sup>${F(s.b)}</sup> f = ${F(ex)} · error ${F(S-ex)}<br><span class="hint">La integral de Riemann es el límite de estas sumas cuando la anchura máxima tiende a 0. Regla de Barrow: ∫ₐᵇ f = F(b) − F(a).</span>`);}});

/* 10 curvas de nivel */
SIMS.nivel=el=>build(el,{selects:[{k:'f',l:'f(x,y)',v:'parab',opts:[['parab','x² + y²'],['silla','x² − y²'],['t','2x² + y² − y (examen)'],['prod','x·y']]}],sliders:[{k:'k',l:'nivel k',v:1,min:-3,max:4,step:0.1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=60;const f={parab:(x,y)=>x*x+y*y,silla:(x,y)=>x*x-y*y,t:(x,y)=>2*x*x+y*y-y,prod:(x,y)=>x*y}[s.f];
    const img=a.g.createImageData(a.W,a.H);for(let py=0;py<a.H;py++)for(let px=0;px<a.W;px++){const x=(px-cx)/u,y=(cy-py)/u;const v=f(x,y);const t=Math.max(0,Math.min(1,(v+3)/8));const i=(py*a.W+px)*4;img.data[i]=255-120*t;img.data[i+1]=235-160*t;img.data[i+2]=225-180*t;img.data[i+3]=255;}a.g.putImageData(img,0,0);
    a.axes(cx,cy,u,-5,5,-3,3);
    // curva de nivel por marching simple
    a.g.fillStyle=C.a;for(let py=0;py<a.H;py+=2)for(let px=0;px<a.W;px+=2){const x=(px-cx)/u,y=(cy-py)/u;const v=f(x,y),vx=f(x+2/u,y),vy=f(x,y-2/u);if((v-s.k)*(vx-s.k)<=0||(v-s.k)*(vy-s.k)<=0)a.g.fillRect(px,py,2,2);}
    a.html(`Curva de nivel f(x,y) = ${F(s.k)} (en rojo) sobre el mapa de colores de f<br><span class="hint">El gradiente es perpendicular a las curvas de nivel y apunta hacia donde f crece más deprisa. Un extremo interior tiene gradiente nulo; en la silla las curvas se cruzan.</span>`);}});

/* 11 gradiente y derivada direccional */
SIMS.gradiente=el=>build(el,{sliders:[{k:'x',l:'x₀',v:1,min:-2,max:2,step:0.1},{k:'y',l:'y₀',v:0.5,min:-2,max:2,step:0.1},{k:'th',l:'dirección v',v:45,min:0,max:360,step:1,u:'°'}],selects:[{k:'f',l:'f(x,y)',v:'t',opts:[['t','2x² + y² − y'],['parab','x² + y²'],['prod','x·y']]}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=70;const F2={t:[(x,y)=>2*x*x+y*y-y,(x,y)=>[4*x,2*y-1]],parab:[(x,y)=>x*x+y*y,(x,y)=>[2*x,2*y]],prod:[(x,y)=>x*y,(x,y)=>[y,x]]}[s.f];
    const f=F2[0],gr=F2[1](s.x,s.y);a.axes(cx,cy,u,-4.5,4.5,-2.5,2.5);
    const k=f(s.x,s.y);a.g.fillStyle=C.grid;for(let py=0;py<a.H;py+=2)for(let px=0;px<a.W;px+=2){const x=(px-cx)/u,y=(cy-py)/u;const v=f(x,y),vx=f(x+2/u,y),vy=f(x,y-2/u);if((v-k)*(vx-k)<=0||(v-k)*(vy-k)<=0)a.g.fillRect(px,py,2,2);}
    const th=s.th*Math.PI/180,v=[Math.cos(th),Math.sin(th)];const Dv=gr[0]*v[0]+gr[1]*v[1];const gn=Math.hypot(...gr);
    const P=[cx+s.x*u,cy-s.y*u];a.circ(P[0],P[1],5,C.text,true);
    if(gn>1e-6)a.arrow(P[0],P[1],P[0]+gr[0]/gn*1.2*u,P[1]-gr[1]/gn*1.2*u,C.a,3);a.txt('∇f',P[0]+gr[0]/(gn||1)*1.2*u+6,P[1]-gr[1]/(gn||1)*1.2*u,C.a,14);
    a.arrow(P[0],P[1],P[0]+v[0]*u,P[1]-v[1]*u,C.b,3);a.txt('v',P[0]+v[0]*u+6,P[1]-v[1]*u,C.b,14);
    a.html(`∇f(x₀,y₀) = (${F(gr[0])}, ${F(gr[1])}), ‖∇f‖ = ${F(gn)} · D<sub>v</sub>f = ∇f·v = <b>${F(Dv)}</b> (v unitario) · máxima en la dirección de ∇f, nula a lo largo de la curva de nivel (gris)<br><span class="hint">Si f es diferenciable, D<sub>v</sub>f = ∇f·v. En los exámenes se comprueba precisamente cuándo esto falla (funciones definidas a trozos en (0,0)).</span>`);}});

/* 12 integral doble: región y volumen */
SIMS.doble=el=>build(el,{sliders:[{k:'n',l:'celdas por lado',v:12,min:4,max:40,step:1}],selects:[{k:'r',l:'región Ω',v:'tri',opts:[['tri','0 ≤ y ≤ x, 0 ≤ x ≤ 2'],['disc','cuarto de disco r ≤ 1'],['elip','0 ≤ y ≤ x+2, 4x²+9y² ≤ 36 (examen)']]}],
  draw(a){a.clear();const s=a.st,cx=a.W/2-40,cy=a.H/2+20,u=55;a.axes(cx,cy,u,-5,6,-3,3);
    const reg={tri:{box:[0,2,0,2],inn:(x,y)=>y>=0&&y<=x&&x<=2,f:(x,y)=>x*y,ex:2},disc:{box:[0,1,0,1],inn:(x,y)=>x>=0&&y>=0&&x*x+y*y<=1,f:(x,y)=>x*Math.sqrt(Math.max(0,1-x*x-y*y)),ex:Math.PI/16},elip:{box:[-3,3,0,2],inn:(x,y)=>y>=0&&y<=x+2&&4*x*x+9*y*y<=36,f:(x,y)=>x*y,ex:23/6}}[s.r];
    const [x0,x1,y0,y1]=reg.box,h=(x1-x0)/s.n,k=(y1-y0)/s.n;let S=0,cnt=0;
    for(let i=0;i<s.n;i++)for(let j=0;j<s.n;j++){const x=x0+(i+0.5)*h,y=y0+(j+0.5)*k;if(reg.inn(x,y)){const v=reg.f(x,y);S+=v*h*k;cnt++;const t=Math.max(0,Math.min(1,(v+2)/4));a.g.fillStyle=`rgba(180,35,47,${0.15+0.6*t})`;a.g.fillRect(cx+(x0+i*h)*u,cy-(y0+(j+1)*k)*u,h*u,k*u);}}
    a.html(`∬<sub>Ω</sub> f con ${cnt} celdas: <b>${F(S)}</b> · valor exacto ${F(reg.ex)}<br><span class="hint">La integral doble suma f·área sobre la región; en el examen la clave es describir Ω (límites de y en función de x, o pasar a polares) y aplicar Fubini.</span>`);}});

/* 13 campo de direcciones EDO */
SIMS.edo=el=>build(el,{selects:[{k:'e',l:'EDO',v:'lin',opts:[['lin',"y' + 2xy = 2x·e^(−x²)  (examen)"],['sep',"y' = −x/y"],['hom',"y' = −(xy + y² + x²)/x²  (examen)"],['log',"y' = y(1 − y)"]]}],sliders:[{k:'y0',l:'y(0,5)',v:0.5,min:-2,max:2,step:0.05}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=60;a.axes(cx,cy,u,-5,5,-2.8,2.8);
    const fp={lin:(x,y)=>2*x*Math.exp(-x*x)-2*x*y,sep:(x,y)=>-x/(y||1e-6),hom:(x,y)=>-(x*y+y*y+x*x)/((x*x)||1e-6),log:(x,y)=>y*(1-y)}[s.e];
    for(let x=-4.8;x<=4.8;x+=0.4)for(let y=-2.6;y<=2.6;y+=0.4){const m=fp(x,y);const d=Math.hypot(1,m);const dx=0.15/d,dy=0.15*m/d;a.line(cx+(x-dx)*u,cy-(y-dy)*u,cx+(x+dx)*u,cy-(y+dy)*u,C.grid,1.2);}
    // solución numérica (RK4) desde (0.5, y0) hacia ambos lados
    const rk=(dir)=>{let x=0.5,y=s.y0;a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.beginPath();a.g.moveTo(cx+x*u,cy-y*u);const h=0.01*dir;for(let i=0;i<800;i++){const k1=fp(x,y),k2=fp(x+h/2,y+h*k1/2),k3=fp(x+h/2,y+h*k2/2),k4=fp(x+h,y+h*k3);y+=h*(k1+2*k2+2*k3+k4)/6;x+=h;if(!isFinite(y)||Math.abs(y)>3.5||Math.abs(x)>5)break;a.g.lineTo(cx+x*u,cy-y*u);}a.g.stroke();};rk(1);rk(-1);a.circ(cx+0.5*u,cy-s.y0*u,5,C.b,true);
    const sol={lin:'y = (x² + C)·e^(−x²)  (lineal: factor integrante e^(x²))',sep:'x² + y² = C  (variables separadas)',hom:'y = x·(1/(ln|x| + C) − 1)  (homogénea: y = u·x)',log:'y = 1/(1 + C·e^(−x))  (Bernoulli / separable)'}[s.e];
    a.html(`Solución general: <b>${sol}</b> · la curva roja es la solución que pasa por (0,5; ${F(s.y0)})<br><span class="hint">El campo de direcciones dibuja la pendiente y' en cada punto; las soluciones son curvas tangentes a él. Cambia la condición inicial y verás la familia uniparamétrica.</span>`);}});

/* ---- Eliminación gaussiana paso a paso (sistema 3×3 con solución x=2, y=1, z=−1) ---- */
SIMS.gaussPaso=el=>build(el,{w:640,h:370,
 sliders:[{k:'paso',v:0,min:0,max:7,step:1,l:'paso del método (0 = sistema)',u:''}],
 draw(a){a.clear();const p=a.st.paso;
  const MS=[
   [[1,1,1,2],[2,3,1,6],[1,-1,2,-1]],
   [[1,1,1,2],[0,1,-1,2],[1,-1,2,-1]],
   [[1,1,1,2],[0,1,-1,2],[0,-2,1,-3]],
   [[1,1,1,2],[0,1,-1,2],[0,0,-1,1]]];
  const M=MS[Math.min(p,3)];
  const fmt=v=>v<0?'−'+String(-v):String(v);
  const x0=150,y0=70,cw=64,rh=44;
  const hiRow={1:1,2:2,3:2}[p];
  const piv={1:[0,0],2:[0,0],3:[1,1]}[p];
  // marco y barra de la ampliada
  a.g.strokeStyle=a.st.paso>0?'#9aa3b5':'#9aa3b5';a.g.lineWidth=2;
  a.g.strokeRect(x0-8,y0-6,4*cw+16,3*rh+12);
  a.line(x0+3*cw+cw/2-4,y0-6,x0+3*cw+cw/2-4,y0+3*rh+6,C.text,1.5);
  for(let r=0;r<3;r++){
    if(hiRow===r){a.g.fillStyle=C.f;a.g.globalAlpha=0.12;a.g.fillRect(x0-8,y0+r*rh,4*cw+16,rh);a.g.globalAlpha=1;}
    for(let c=0;c<4;c++){
      const isPiv=piv&&piv[0]===r&&piv[1]===c;
      if(isPiv){a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.strokeRect(x0+c*cw+6,y0+r*rh+6,cw-12,rh-12);}
      const v=M[r][c];
      a.txt(fmt(v),x0+c*cw+cw/2,y0+r*rh+rh/2+5,v===0&&p>0&&c<3?C.muted:C.text,16,'center');
    }
  }
  const op={1:'F₂ ← F₂ − 2·F₁',2:'F₃ ← F₃ − F₁',3:'F₃ ← F₃ + 2·F₂'}[p];
  if(op){a.txt(op,x0+4*cw+40,y0+hiRow*rh+rh/2+5,C.a,14);}
  // sustitución hacia atrás
  const sol=[];
  if(p>=4) sol.push('z = −1');
  if(p>=5) sol.push('y = 2 + z = 1');
  if(p>=6) sol.push('x = 2 − y − z = 2');
  sol.forEach((s,k)=>a.txt(s,x0,y0+3*rh+50+k*26,C.c,15));
  const T=[
   'Sistema 3×3 escrito como matriz ampliada [A | b]. Objetivo: que quede triangular y luego despejar de abajo arriba.',
   'Pivote 1 (la x de la primera fila). Anulamos el 2 de la columna x en la fila 2: F₂ ← F₂ − 2·F₁ ⇒ [0 1 −1 | 2].',
   'Anulamos el 1 de la columna x en la fila 3: F₃ ← F₃ − F₁ ⇒ [0 −2 1 | −3].',
   'Pivote 2 (la y de la fila 2). Anulamos el −2 de la fila 3: F₃ ← F₃ + 2·F₂ ⇒ [0 0 −1 | 1]. Ya es triangular.',
   'Sustitución hacia atrás: la última fila dice −z = 1, así que z = −1.',
   'Fila 2: y − z = 2, luego y = 2 + z = 1.',
   'Fila 1: x + y + z = 2, luego x = 2 − y − z = 2.',
   'Comprobación en las tres ecuaciones originales: 2 + 1 − 1 = 2 ✓; 2·2 + 3·1 − 1 = 6 ✓; 2 − 1 + 2·(−1) = −1 ✓.'
  ];
  a.html(`<div>${T[p]}</div>`);
 }});



/* ---- paso2 diagPaso ---- */
SIMS.diagPaso=el=>SIMS.__paso(el,{"w":640,"h":290,"q":"Diagonaliza la matriz A = [[2,1],[1,2]] y úsalo para calcular Aⁿ. Sube el paso.","base":[["t","A = [[2, 1], [1, 2]]",30,26,14,"left"]],"steps":[{"text":"Diagonalizar <b>A = [[2,1],[1,2]]</b> es encontrar una base de vectores propios y escribir A = P·D·P⁻¹ con D diagonal. Sirve, por ejemplo, para calcular Aⁿ con facilidad.","add":[["l",360,170,580,170,1],["l",470,60,470,280,1]]},{"text":"Ecuación característica: <b>det(A − λI) = (2−λ)² − 1 = λ² − 4λ + 3 = (λ−1)(λ−3) = 0</b>, luego los valores propios son <b>λ₁ = 1</b> y <b>λ₂ = 3</b> (distintos ⇒ A es diagonalizable).","add":[["t","(2−λ)² − 1 = (λ−1)(λ−3) = 0",30,64,14,"left"],["t","λ₁ = 1 ,  λ₂ = 3",30,92,15,"left"]]},{"text":"Para <b>λ₁ = 1</b>: (A − I)v = 0 ⇒ x + y = 0 ⇒ vector propio <b>v₁ = (1, −1)</b>.","add":[["t","λ=1:  v₁ = (1, −1)",30,126,15,"left"],["a",470,170,530,230,3]]},{"text":"Para <b>λ₂ = 3</b>: (A − 3I)v = 0 ⇒ −x + y = 0 ⇒ vector propio <b>v₂ = (1, 1)</b>. Son perpendiculares porque A es simétrica.","add":[["t","λ=3:  v₂ = (1, 1)",30,158,15,"left"],["a",470,170,530,110,3]]},{"text":"Se forman <b>P = [v₁ v₂] = [[1,1],[−1,1]]</b> y <b>D = diag(1, 3)</b>. Se comprueba que AP = PD columna a columna: A·v₂ = (3,3) = 3·v₂ ✓.","add":[["t","P = [[1,1],[−1,1]] ,  D = diag(1, 3)",30,192,14,"left"],["t","A·v₂ = (3,3) = 3 v₂  ✓",30,220,14,"left"]]},{"text":"Aplicación: <b>Aⁿ = P·Dⁿ·P⁻¹ = ½·[[1+3ⁿ, 3ⁿ−1],[3ⁿ−1, 1+3ⁿ]]</b>. Para n = 2: ½·[[10,8],[8,10]] = [[5,4],[4,5]] = A² ✓. Solo se eleva a n la diagonal.","add":[["t","Aⁿ = ½ [[1+3ⁿ, 3ⁿ−1],[3ⁿ−1, 1+3ⁿ]]",30,254,14,"left"]]}]});
/* ---- fin paso2 diagPaso ---- */





/* ---- paso a paso declarativo ---- */
SIMS.__paso=(el,D)=>build(el,{w:D.w||660,h:D.h||340,
 sliders:[{k:'paso',v:0,min:0,max:D.steps.length,step:1,l:'paso de la resolución (0 = enunciado)',u:''}],
 draw(a){a.clear();const g=a.g,p=a.st.paso;
  const it=(x,col)=>{const k=x[0];
   if(k==='t')a.txt(x[1],x[2],x[3],col,x[4]||13,x[5]||'left');
   else if(k==='l')a.line(x[1],x[2],x[3],x[4],col,x[5]||1.5,x[6]);
   else if(k==='a')a.arrow(x[1],x[2],x[3],x[4],col,x[5]);
   else if(k==='c')a.circ(x[1],x[2],x[3],col,!!x[4]);
   else if(k==='r'){g.strokeStyle=col;g.lineWidth=1.8;if(x[5]){g.fillStyle=col;g.globalAlpha=.18;g.fillRect(x[1],x[2],x[3],x[4]);g.globalAlpha=1;}g.strokeRect(x[1],x[2],x[3],x[4]);}
   else if(k==='p'){g.strokeStyle=col;g.lineWidth=x[2]||2;g.beginPath();x[1].forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();}};
  (D.base||[]).forEach(x=>it(x,C.muted));
  D.steps.forEach((s,i)=>{if(i+1>p)return;const cur=(i+1===p);(s.add||[]).forEach(x=>it(x,cur?C.d:C.text));if(cur)(s.now||[]).forEach(x=>it(x,C.d));});
  a.html('<div>'+(p===0?D.q:D.steps[p-1].text)+'</div>');}});
/* ---- fin paso a paso declarativo ---- */

/* ---- paso3 lpPaso ---- */
SIMS.lpPaso=el=>SIMS.__paso(el,{"w":660,"h":260,"q":"Resuelve gráficamente el problema de programación lineal y localiza el vértice óptimo. Sube el paso.","base":[["t","Máx Z = 3x + 2y   s.a.  x + y ≤ 4 ,  x + 3y ≤ 6 ,  x, y ≥ 0",30,26,14,"left"],["a",390,230,580,230,1.5],["a",390,230,390,110,1.5],["t","x",584,234,12,"left"],["t","y",386,106,12,"left"]],"steps":[{"text":"Se quiere maximizar <b>Z = 3x + 2y</b> con dos restricciones y x, y ≥ 0. En programación lineal el óptimo está siempre en un <b>vértice</b> de la región factible.","add":[["t","Z = 3x + 2y",30,62,15,"left"]]},{"text":"<b>Paso 1:</b> dibuja las rectas. x + y = 4 pasa por (4,0) y (0,4). x + 3y = 6 pasa por (6,0) y (0,2).","add":[["l",390,78,542,230,2],["l",390,154,618,230,2],["t","x + y = 4      x + 3y = 6",30,96,15,"left"]]},{"text":"<b>Paso 2:</b> la región factible es la zona bajo ambas rectas y en el primer cuadrante: el polígono de vértices (0,0), (4,0), (3,1) y (0,2).","add":[["p",[[390,230],[542,230],[504,192],[390,154],[390,230]],2.5],["t","vértices: (0,0) (4,0) (3,1) (0,2)",30,130,15,"left"]]},{"text":"<b>Paso 3:</b> el vértice (3,1) es la intersección de las rectas: restando, 2y = 2 ⇒ y = 1 y x = 3. Comprobación: 3 + 1 = 4 y 3 + 3·1 = 6 ✓.","add":[["c",504,192,5,1],["t","(3,1): x + y = 4 y x + 3y = 6",30,164,15,"left"]]},{"text":"<b>Paso 4:</b> evalúa Z en cada vértice: Z(0,0) = 0, Z(4,0) = 12, Z(3,1) = 11 y Z(0,2) = 4.","add":[["t","Z: 0 · 12 · 11 · 4",30,198,15,"left"]]},{"text":"<b>Solución:</b> el máximo es <b>Z = 12 en (4,0)</b>. Se hace x = 4, y = 0: la primera restricción queda saturada y la segunda no (4 ≤ 6).","add":[["c",542,230,7,1],["t","Óptimo: x = 4, y = 0, Z = 12",30,232,15,"left"]]}]});
/* ---- fin paso3 lpPaso ---- */
document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
