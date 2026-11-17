/* Matemáticas I: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function grid(D,cx,cy,s,m,n,col,al){n=n||4;for(var i=-n;i<=n;i++){var a=[m[0][0]*i+m[0][1]*-n,m[1][0]*i+m[1][1]*-n],b=[m[0][0]*i+m[0][1]*n,m[1][0]*i+m[1][1]*n];D.line(cx+s*a[0],cy-s*a[1],cx+s*b[0],cy-s*b[1],col,1.2,null,al);
  var c=[m[0][0]*-n+m[0][1]*i,m[1][0]*-n+m[1][1]*i],d=[m[0][0]*n+m[0][1]*i,m[1][0]*n+m[1][1]*i];D.line(cx+s*c[0],cy-s*c[1],cx+s*d[0],cy-s*d[1],col,1.2,null,al);}}
function clip(D,x,y,w,h,f){var c=D.ctx;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();f();c.restore();}

/* T1 números complejos */
M.reg('mat1-t1',M.fasor({title:'Multiplicar por i es girar 90°',H:520,dur:18,w:1.1,S:85,cy:220,
 vec:function(t){var a=1.1*t;return [{m:1,a:a,l:'z',c:0},{m:1,a:a+Math.PI/2,l:'i·z',c:1}];},
 read:function(t){var a=(1.1*t)%(2*Math.PI);return ['z = e^{jθ} = cos θ + j sen θ,   θ = '+nf(a,2)+' rad','i·z = e^{j(θ+π/2)}: mismo módulo, 90° más'];},
 caps:[[6,'Un complejo de módulo 1 es un punto que gira en la circunferencia unidad: <i>e<sup>jθ</sup> = cos θ + j sen θ</i>. A la derecha, su parte imaginaria dibuja un seno.'],
       [12,'Multiplicar por <i>i = e<sup>jπ/2</sup></i> suma 90° al ángulo y deja igual el módulo: la onda de <i>i·z</i> va un cuarto de periodo adelantada.'],
       [99,'Regla general: al multiplicar complejos <b>se multiplican los módulos y se suman los argumentos</b>. Por eso las potencias <i>zⁿ</i> giran n veces más rápido.']]}));

/* T2 determinante = área */
M.reg('mat1-t2',M.base({title:'El determinante mide el área',H:600,dur:18,caps:[[5,'La matriz <i>A</i> transforma el cuadrado unidad (azul) en un paralelogramo (morado). Su área es <i>|det A|</i>.'],[11,'Al aumentar <i>p</i>, las dos columnas de A se van alineando y el paralelogramo se aplasta.'],[99,'En <i>p = 2</i> el determinante vale 0: las columnas son proporcionales, el área es nula y el sistema <i>A·x = b</i> deja de tener solución única.']]},
 function(D,t){var p=lerp(0,3,U.pp(t,18)),A=[[1,p],[0.5,1]],det=1-0.5*p,cx=230,cy=310,s=62;
  grid(D,cx,cy,s,[[1,0],[0,1]],3,C.grid,1);
  var sq=[[0,0],[1,0],[1,1],[0,1]];D.path(sq.map(function(q){return [cx+s*q[0],cy-s*q[1]];}),C.f,1.6,RG(C.f,.12));
  var pg=sq.map(function(q){return [cx+s*(A[0][0]*q[0]+A[0][1]*q[1]),cy-s*(A[1][0]*q[0]+A[1][1]*q[1])];});
  D.path(pg,C.m,2.6,RG(Math.abs(det)<0.04?C.bad:C.m,.25));
  D.arrow(cx,cy,cx+s*A[0][0],cy-s*A[1][0],C.g,2.6);D.arrow(cx,cy,cx+s*A[0][1],cy-s*A[1][1],C.hl,2.6);
  D.text('A = [ 1   '+nf(p,2)+' ;  0,5   1 ]      det A = 1 − 0,5·p = '+nf(det,2),W/2,535,{it:true,s:22,a:'center',c:C.m});
  D.text(Math.abs(det)<0.04?'área nula: columnas proporcionales':(det<0?'det < 0: la figura se ha dado la vuelta':'área = '+nf(Math.abs(det),2)),W/2,570,{s:18,a:'center',c:Math.abs(det)<0.04?C.bad:C.mut});
  D.text('col. 1',cx+s*A[0][0]+8,cy-s*A[1][0]+16,{s:15,c:C.g});D.text('col. 2',cx+s*A[0][1]+8,cy-s*A[1][1]-6,{s:15,c:C.hl});}));

/* T3 combinación lineal y subespacio generado */
var trail=[];
M.reg('mat1-t3',M.base({title:'Combinaciones lineales: el plano generado',H:560,dur:20,caps:[[6,'Con dos vectores <i>u</i> y <i>v</i> no proporcionales, cualquier punto del plano se alcanza como <i>a·u + b·v</i>.'],[14,'Al mover los coeficientes <i>a</i> y <i>b</i>, la punta de la suma va rellenando el plano: <i>⟨u, v⟩ = ℝ²</i>.'],[99,'Si <i>u</i> y <i>v</i> fueran proporcionales solo generarían una recta: serían <b>linealmente dependientes</b> y no formarían base.']]},
 function(D,t){var cx=300,cy=300,s=46,u=[2,0.6],v=[0.5,1.6],a=1.6*Math.sin(0.9*t)+0.2*Math.sin(2.3*t),b=1.3*Math.cos(0.63*t);
  grid(D,cx,cy,s,[[1,0],[0,1]],5,C.grid,1);if(t<0.1)trail=[];var P=[a*u[0]+b*v[0],a*u[1]+b*v[1]];trail.push([cx+s*P[0],cy-s*P[1]]);if(trail.length>420)trail.shift();
  trail.forEach(function(q,i){D.dot(q[0],q[1],2.2,C.m,0.15+0.6*i/trail.length);});
  D.arrow(cx,cy,cx+s*u[0],cy-s*u[1],C.f,2);D.arrow(cx,cy,cx+s*v[0],cy-s*v[1],C.g,2);D.text('u',cx+s*u[0]+6,cy-s*u[1]+16,{it:true,s:20,c:C.f});D.text('v',cx+s*v[0]+6,cy-s*v[1],{it:true,s:20,c:C.g});
  var Au=[cx+s*a*u[0],cy-s*a*u[1]];D.arrow(cx,cy,Au[0],Au[1],C.f,3);D.arrow(Au[0],Au[1],cx+s*P[0],cy-s*P[1],C.g,3);D.dot(cx+s*P[0],cy-s*P[1],6,C.m);
  D.text('a = '+nf(a,2)+'    b = '+nf(b,2),W/2,500,{it:true,s:22,a:'center',c:C.m});D.text('a·u + b·v = ('+nf(P[0],2)+', '+nf(P[1],2)+')',W/2,532,{it:true,s:20,a:'center'});}));

/* T4 aplicación lineal: la cuadrícula se deforma */
function morph(D,t,dur,A,extra){var u=U.pp(t,dur),m=[[lerp(1,A[0][0],u),lerp(0,A[0][1],u)],[lerp(0,A[1][0],u),lerp(1,A[1][1],u)]],cx=320,cy=290,s=44;
  clip(D,40,70,560,420,function(){grid(D,cx,cy,s,[[1,0],[0,1]],7,C.grid,1);grid(D,cx,cy,s,m,7,C.f,0.55);});
  D.arrow(cx,cy,cx+s*m[0][0],cy-s*m[1][0],C.g,3);D.arrow(cx,cy,cx+s*m[0][1],cy-s*m[1][1],C.hl,3);
  D.text('f(e₁)',cx+s*m[0][0]+8,cy-s*m[1][0]+18,{it:true,s:17,c:C.g});D.text('f(e₂)',cx+s*m[0][1]+8,cy-s*m[1][1]-6,{it:true,s:17,c:C.hl});
  if(extra)extra(m,u,cx,cy,s);return m;}
M.reg('mat1-t4',M.base({title:'Una aplicación lineal deforma la cuadrícula',H:560,dur:16,caps:[[6,'Una aplicación lineal lleva rectas en rectas y deja fijo el origen: la cuadrícula se deforma, pero sus líneas siguen paralelas y equiespaciadas.'],[11,'Basta saber dónde van <i>e₁</i> y <i>e₂</i>: sus imágenes son las <b>columnas de la matriz</b> asociada.'],[99,'Aquí <i>A = [2 1; 0 1]</i>: <i>f(e₁) = (2, 0)</i> y <i>f(e₂) = (1, 1)</i>. Cualquier vector se transforma combinando esas dos columnas.']]},
 function(D,t){var m=morph(D,t,16,[[2,1],[0,1]]);D.text('A = [ '+nf(m[0][0],2)+'  '+nf(m[0][1],2)+' ;  '+nf(m[1][0],2)+'  '+nf(m[1][1],2)+' ]',W/2,530,{it:true,s:22,a:'center',c:C.m});}));

/* T5 diagonalización: los autovectores no giran */
M.reg('mat1-t5',M.base({title:'Autovectores: las direcciones que no giran',H:560,dur:18,caps:[[6,'La matriz <i>A = [2 1; 1 2]</i> deforma el plano. Casi todos los vectores cambian de dirección…'],[12,'…salvo dos: <i>(1, 1)</i> se estira ×3 y <i>(1, −1)</i> se queda igual (×1). Son los <b>autovectores</b> y 3 y 1 los <b>autovalores</b>.'],[99,'En la base de autovectores la matriz es diagonal: <i>A = P·D·P⁻¹</i> con <i>D = diag(3, 1)</i>. Diagonalizar es elegir los ejes en los que A solo estira.']]},
 function(D,t){var m=morph(D,t,18,[[2,1],[1,2]],function(m,u,cx,cy,s){
   var l1=lerp(1,3,u),l2=1;D.line(cx-s*6,cy+s*6,cx+s*6,cy-s*6,C.m,1.2,[5,5],0.6);D.line(cx-s*6,cy-s*6,cx+s*6,cy+s*6,C.ok,1.2,[5,5],0.6);
   D.arrow(cx,cy,cx+s*l1,cy-s*l1,C.m,3.4);D.arrow(cx,cy,cx+s*l2,cy+s*l2,C.ok,3.4);
   D.text('λ = '+nf(l1,2),cx+s*l1+8,cy-s*l1,{it:true,s:18,c:C.m});D.text('λ = 1',cx+s+8,cy+s+18,{it:true,s:18,c:C.ok});});}));

/* T6 proyección ortogonal */
M.reg('mat1-t6',M.base({title:'Proyección ortogonal y producto escalar',H:560,dur:18,caps:[[6,'La proyección de <i>v</i> sobre <i>u</i> es la «sombra» de <i>v</i> en la recta de <i>u</i>: <i>proy = (v·u / u·u)·u</i>.'],[12,'Lo que sobra, <i>v − proy</i>, es siempre <b>perpendicular</b> a <i>u</i>: así se construyen las bases ortogonales (Gram-Schmidt).'],[99,'Cuando <i>v ⟂ u</i> el producto escalar es 0 y la proyección desaparece; cuando son paralelos, <i>v</i> coincide con su proyección.']]},
 function(D,t){var cx=200,cy=330,s=60,u=[1,0.35],ang=0.4+0.5*t,v=[2.2*Math.cos(ang),2.2*Math.sin(ang)],uu=u[0]*u[0]+u[1]*u[1],dt=v[0]*u[0]+v[1]*u[1],k=dt/uu,pr=[k*u[0],k*u[1]];
  grid(D,cx,cy,s,[[1,0],[0,1]],4,C.grid,1);var L=4.5;D.line(cx-s*u[0]*L,cy+s*u[1]*L,cx+s*u[0]*L,cy-s*u[1]*L,C.mut,1.2,[4,4]);
  D.arrow(cx,cy,cx+s*u[0],cy-s*u[1],C.f,3);D.text('u',cx+s*u[0]+4,cy-s*u[1]+18,{it:true,s:20,c:C.f});
  D.arrow(cx,cy,cx+s*v[0],cy-s*v[1],C.m,3);D.text('v',cx+s*v[0]+6,cy-s*v[1]-4,{it:true,s:20,c:C.m});
  D.arrow(cx,cy,cx+s*pr[0],cy-s*pr[1],C.hl,4);D.line(cx+s*pr[0],cy-s*pr[1],cx+s*v[0],cy-s*v[1],C.g,2,[5,4]);
  D.text('v·u = '+nf(dt,2),470,170,{it:true,s:22,a:'center'});D.text('proy_{u} v = '+nf(k,2)+'·u',470,210,{it:true,s:22,a:'center',c:C.hl});D.text('(v − proy) ⟂ u',470,250,{it:true,s:20,a:'center',c:C.g});}));

/* T7 programación lineal */
M.reg('mat1-t7',M.base({title:'Programación lineal: la recta de nivel',H:580,dur:18,caps:[[5,'La región factible (sombreada) cumple todas las restricciones: <i>x, y ≥ 0</i>, <i>x ≤ 3</i>, <i>x + y ≤ 4</i>, <i>x + 3y ≤ 6</i>.'],[12,'Para maximizar <i>z = 2x + 3y</i> se desplaza la recta <i>2x + 3y = z</i> en la dirección en que crece <i>z</i>.'],[99,'El último punto de la región que toca la recta es el óptimo: un <b>vértice</b>, aquí <i>(3, 1)</i> con <i>z = 9</i>. Por eso basta evaluar los vértices.']]},
 function(D,t){var A=U.axes(D,{xr:[-0.3,5],yr:[-0.3,3.4],xt:[1,2,3,4],yt:[1,2,3],xd:0,yd:0,xl:'x',yl:'y'},{x:80,y:90,w:480,h:340,grid:true});
  var poly=[[0,0],[3,0],[3,1],[0,2]];D.path(poly.map(function(p){return [A.X(p[0]),A.Y(p[1])];}),C.m,2,RG(C.m,.2));
  D.line(A.X(0),A.Y(4),A.X(4),A.Y(0),C.mut,1,[4,4]);D.line(A.X(0),A.Y(2),A.X(5),A.Y(1/3),C.mut,1,[4,4]);D.line(A.X(3),A.Y(-0.3),A.X(3),A.Y(3.4),C.mut,1,[4,4]);
  var z=lerp(0,11,ease(seg(t,1,14))),zz=Math.min(z,9);
  U.clipA(D,A,function(){D.line(A.X(-0.3),A.Y((z+0.6)/3),A.X(5),A.Y((z-10)/3),z>9.01?C.bad:C.f,2.6);});
  poly.forEach(function(p){var v=2*p[0]+3*p[1];D.dot(A.X(p[0]),A.Y(p[1]),5,C.w);D.text(nf(v,0),A.X(p[0])+8,A.Y(p[1])-8,{s:14,c:C.mut});});
  if(z>=9)D.dot(A.X(3),A.Y(1),9,C.hl);
  D.text('z = 2x + 3y = '+nf(z,1),W/2,490,{it:true,s:24,a:'center',c:z>9.01?C.bad:C.f});
  D.text(z>9.01?'la recta ya no toca la región: el máximo era z = 9 en (3, 1)':(z>=8.95?'último contacto: vértice (3, 1)':'la recta aún corta la región'),W/2,526,{s:18,a:'center',c:C.mut});}));

/* T8 derivada */
var f8=function(x){return 0.25*x*x*x-x;},d8=function(x){return 0.75*x*x-1;};
M.reg('mat1-t8',M.traza({title:'La derivada es la pendiente de la tangente',H:540,dur:16,f:f8,tangent:true,ax:{xr:[-3,3],yr:[-3,3],xt:[-2,-1,1,2],yt:[-2,-1,1,2],xd:0,yd:0,xl:'x',yl:'f(x)'},h:300,
 extra:function(D,A,x){var p=[];for(var s=-3;s<=x;s+=0.02){var y=d8(s);if(y<=3)p.push([A.X(s),A.Y(y)]);}D.path(p,C.g,2.2,null,0.85);D.text("f '(x)",A.X(-2.2),A.Y(2.6),{it:true,s:18,c:C.g});},
 read:function(x){return ['x = '+nf(x,2)+'      f(x) = '+nf(f8(x),2),"f '(x) = 0,75x² − 1 = "+nf(d8(x),2)];},
 caps:[[5,'La recta amarilla es la tangente a <i>f(x) = x³/4 − x</i> en el punto. Su pendiente es la derivada.'],[11,'Donde la tangente es horizontal (<i>f\'(x) = 0</i>, en <i>x = ±1,15</i>) la función tiene un máximo o un mínimo relativo.'],[99,'La curva rosa es <i>f\'(x)</i>: positiva donde <i>f</i> crece, negativa donde decrece y nula en los extremos.']]}));

/* T9 integral de Riemann */
M.reg('mat1-t9',M.base({title:'Sumas de Riemann',H:560,dur:18,caps:[[6,'Se aproxima el área bajo <i>f(x) = x²</i> en [0, 2] con rectángulos de base <i>Δx = 2/n</i> y altura el valor a la izquierda.'],[13,'Al aumentar <i>n</i> los rectángulos se ajustan cada vez mejor a la curva y la suma se acerca al área.'],[99,'El límite de las sumas es la integral: <i>∫₀² x² dx = 8/3 ≈ 2,667</i>. Si el límite existe y no depende de cómo partas, la función es integrable.']]},
 function(D,t){var n=Math.max(2,Math.round(lerp(2,60,Math.pow(ease(seg(t,1,15)),2)))),A=U.axes(D,{xr:[-0.1,2.2],yr:[-0.2,4.4],xt:[0.5,1,1.5,2],yt:[1,2,3,4],yd:0,xl:'x',yl:'y'},{x:80,y:90,w:480,h:320,grid:true});
  var dx=2/n,S=0;for(var i=0;i<n;i++){var x=i*dx,h=x*x;S+=h*dx;D.rect(A.X(x),A.Y(h),A.X(x+dx)-A.X(x),A.Y(0)-A.Y(h),n<30?C.m:null,RG(C.m,.3),1.2);}
  U.plotf(D,A,function(x){return x>=0?x*x:NaN;},C.f,2.8);
  D.text('n = '+n,W/2,474,{it:true,s:24,a:'center'});D.text('suma = '+nf(S,3)+'   →   8/3 = 2,667',W/2,510,{it:true,s:22,a:'center',c:C.m});}));

/* T10 límite que depende del camino */
M.reg('mat1-t10',M.base({title:'Un límite doble que no existe',H:560,dur:20,caps:[[6,'<i>f(x, y) = xy/(x² + y²)</i>. Nos acercamos al origen por la recta <i>y = m·x</i>.'],[14,'Por cada recta, <i>f</i> vale siempre <i>m/(1 + m²)</i>: el valor al que llegamos <b>depende de la dirección</b>.'],[99,'Como caminos distintos dan límites distintos, el límite en (0, 0) no existe y la función no puede ser continua allí.']]},
 function(D,t){var cx=230,cy=290,R=170,k=Math.floor(t/4),fr=(t%4)/4,ms=[0,0.5,1,-1,3],m=ms[k%ms.length],ang=Math.atan(m);
  for(var a=0;a<Math.PI;a+=Math.PI/36){var mm=Math.tan(a),val=Math.abs(Math.cos(a))<1e-6?0:Math.sin(a)*Math.cos(a);D.line(cx-R*Math.cos(a),cy+R*Math.sin(a),cx+R*Math.cos(a),cy-R*Math.sin(a),val>=0?C.m:C.f,2,null,0.15+0.7*Math.abs(val)*2);}
  D.line(cx-R,cy,cx+R,cy,C.ax,1.2);D.line(cx,cy-R,cx,cy+R,C.ax,1.2);
  var r=R*(1-ease(fr))*0.95,px=cx+r*Math.cos(ang),py=cy-r*Math.sin(ang);D.line(cx-R*Math.cos(ang),cy+R*Math.sin(ang),cx+R*Math.cos(ang),cy-R*Math.sin(ang),C.hl,2.4);D.dot(px,py,7,C.hl);
  var val=m/(1+m*m);D.text('y = '+nf(m,1)+'·x',480,200,{it:true,s:22,a:'center',c:C.hl});D.text('f = m/(1 + m²) = '+nf(val,2),480,240,{it:true,s:22,a:'center',c:C.m});
  D.text('color: valor de f en cada dirección',480,300,{s:15,a:'center',c:C.mut});}));

/* T11 gradiente */
M.reg('mat1-t11',M.campo({title:'El gradiente y el descenso',H:540,dur:20,ax:{xr:[-3,3],yr:[-2,2],xt:[-2,-1,1,2],yt:[-1,1],xd:0,yd:0,xl:'x',yl:'y'},h:320,fm:6,step:0.006,np:14,
 field:function(x,y){return [-2*x,-4*y];},
 extra:function(D,A){for(var c=0.5;c<=9;c+=1.5){var p=[];for(var a=0;a<=6.3;a+=0.05)p.push([A.X(Math.sqrt(c)*Math.cos(a)),A.Y(Math.sqrt(c/2)*Math.sin(a))]);D.path(p,C.hl,1.2,null,0.55);}},
 read:function(){return ['f(x, y) = x² + 2y²    −∇f = (−2x, −4y)'];},
 caps:[[7,'Las elipses son curvas de nivel de <i>f = x² + 2y²</i>. Las flechas son <i>−∇f</i>: la dirección en la que <i>f</i> baja más rápido.'],[14,'El gradiente es siempre <b>perpendicular a las curvas de nivel</b>. Las partículas que lo siguen caen hacia el mínimo.'],[99,'Como <i>f</i> crece más deprisa en <i>y</i>, las partículas recorren antes la dirección vertical: el descenso no va en línea recta al mínimo.']]}));

/* T12 integral doble por secciones */
M.reg('mat1-t12',M.base({title:'Integral doble por secciones (Fubini)',H:560,dur:18,caps:[[6,'Región <i>D</i> entre <i>y = x²</i> y <i>y = 2x</i>, para <i>0 ≤ x ≤ 2</i>.'],[13,'Para cada <i>x</i>, la sección vertical va de <i>x²</i> a <i>2x</i>: su longitud es <i>2x − x²</i>. Sumando secciones se acumula el área.'],[99,'<i>Área = ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3</i>. Integrar primero en <i>y</i> y luego en <i>x</i> es aplicar Fubini.']]},
 function(D,t){var A=U.axes(D,{xr:[-0.2,2.4],yr:[-0.3,4.6],xt:[1,2],yt:[1,2,3,4],xd:0,yd:0,xl:'x',yl:'y'},{x:110,y:90,w:440,h:330,grid:true});
  var xx=lerp(0,2,ease(seg(t,1,15))),p=[[A.X(0),A.Y(0)]];for(var s=0;s<=xx;s+=0.01)p.push([A.X(s),A.Y(2*s)]);for(var s2=xx;s2>=0;s2-=0.01)p.push([A.X(s2),A.Y(s2*s2)]);
  D.path(p,null,0,RG(C.m,.3));U.plotf(D,A,function(x){return x>=0&&x<=2.2?x*x:NaN;},C.f,2.6);U.plotf(D,A,function(x){return x>=0&&x<=2.2?2*x:NaN;},C.g,2.6);
  D.line(A.X(xx),A.Y(xx*xx),A.X(xx),A.Y(2*xx),C.hl,3.4);var ar=xx*xx-xx*xx*xx/3;
  D.text('y = 2x',A.X(1.75),A.Y(4.1),{it:true,s:18,c:C.g});D.text('y = x²',A.X(2.0),A.Y(3.2),{it:true,s:18,c:C.f});
  D.text('x = '+nf(xx,2)+'     sección = '+nf(2*xx-xx*xx,2),W/2,484,{it:true,s:22,a:'center',c:C.hl});D.text('área acumulada = x² − x³/3 = '+nf(ar,3),W/2,520,{it:true,s:22,a:'center',c:C.m});}));

/* T13 ecuación diferencial: campo de direcciones */
M.reg('mat1-t13',M.campo({title:'Campo de direcciones: y′ = y(1 − y)',H:540,dur:20,ax:{xr:[0,6],yr:[-0.4,1.8],xt:[1,2,3,4,5],yt:[1],xd:0,yd:0,xl:'x',yl:'y'},h:320,nx:16,ny:10,fm:0.6,norm:true,step:0.004,np:12,
 field:function(x,y){return [1,y*(1-y)];},
 extra:function(D,A){[0.05,0.2,1.6].forEach(function(y0){U.plotf(D,A,function(x){return 1/(1+(1/y0-1)*Math.exp(-x));},C.hl,2,0.8);});D.line(A.X(0),A.Y(1),A.X(6),A.Y(1),C.ok,2,[6,4]);D.line(A.X(0),A.Y(0),A.X(6),A.Y(0),C.bad,2,[6,4]);},
 read:function(){return ['soluciones: y = 1/(1 + C·e^{−x})'];},
 caps:[[7,'En cada punto, la flecha tiene la pendiente que marca la ecuación: <i>y′ = y(1 − y)</i>. Las partículas siguen esas pendientes.'],[14,'Las soluciones (amarillo) son curvas tangentes a las flechas en todos sus puntos. Una condición inicial elige una de ellas.'],[99,'<i>y = 1</i> es un equilibrio estable (verde): las soluciones cercanas se acercan. <i>y = 0</i> es inestable (rojo): se alejan de él.']]}));
})();
