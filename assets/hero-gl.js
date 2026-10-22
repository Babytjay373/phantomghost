/* Phantom Ghost — live WebGL hero.
   A ray-marched studio scene (chrome torus, two spheres, glossy floor) rendered in real time
   on the GPU. Follows the pointer. Falls back to the canvas ring in motion.js when WebGL is missing.
   Sets window.PG_HERO_GL = true when it takes over the hero. */
(function () {
  "use strict";
  const host = document.getElementById("hero3d");
  if (!host) return;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cv = document.createElement("canvas");
  cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none";
  const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) return;
  host.appendChild(cv);
  window.PG_HERO_GL = true;

  const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const FS = `
precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform float WIDE;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 C1; // torus centre
float sdTorus(vec3 p){vec2 q=vec2(length(p.xz)-.78,p.y);return length(q)-.26;}
vec4 map(vec3 p){
  vec3 q=p-C1;
  q.xz*=rot(T*.45); q.yz*=rot(1.15+.25*sin(T*.3));
  float t=sdTorus(q);
  float s1=length(p-vec3(1.45,.42+.06*sin(T*.9),-1.4))-.42;
  float s2=length(p-vec3(1.15,.30+.05*sin(T*1.1+1.),1.05))-.30;
  float f=p.y;
  vec4 r=vec4(t,0.,0.,0.);
  if(s1<r.x)r=vec4(s1,1.,0.,0.);
  if(s2<r.x)r=vec4(s2,2.,0.,0.);
  if(f<r.x)r=vec4(f,3.,0.,0.);
  return r;
}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x));}
vec3 env(vec3 d){
  vec3 c=mix(vec3(.035,.04,.055),vec3(.09,.10,.13),clamp(d.y*1.5+.2,0.,1.));
  c+=vec3(.95,.97,1.)*3.2*exp(-(pow(d.x-.1,2.)*6.+pow(d.y-.9,2.)*30.));
  c+=vec3(.35,.65,1.)*2.4*exp(-(pow(d.x+.85,2.)*40.+pow(d.y-.25,2.)*6.));
  c+=vec3(1.,.35,.45)*2.2*exp(-(pow(d.x-.85,2.)*40.+pow(d.y-.2,2.)*6.));
  return c;
}
vec3 bg(vec3 d){return mix(vec3(.002,.0024,.0035),vec3(.014,.016,.022),clamp(d.y*1.5+.3,0.,1.));}
float shadow(vec3 ro,vec3 rd){float r=1.,t=.03;for(int i=0;i<28;i++){float h=map(ro+rd*t).x;r=min(r,10.*h/t);t+=clamp(h,.02,.4);if(r<.01)break;}return clamp(r,0.,1.);}
vec3 shadeBasic(vec3 p,vec3 rd,float m){
  vec3 n=nrm(p); vec3 L=normalize(vec3(.35,.9,.25));
  float d=clamp(dot(n,L),0.,1.);
  vec3 rf=env(reflect(rd,n));
  if(m<.5) return rf*.9;
  if(m<1.5) return vec3(.95,.42,.2)*(.12+d)+rf*.08;
  if(m<2.5) return vec3(.62,.8,.9)*(.12+d)+rf*.2;
  return vec3(.05,.055,.065)*(.3+d)+rf*.22;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
  // frame the object on the right on wide screens, centred and lower on narrow ones
  // wide: object sits right of the copy; narrow: zoom out and drop it into the band under the copy
  uv=mix(uv*2.8+vec2(0.,1.17),uv*1.55-vec2(.70,.02),WIDE);
  C1=vec3(0.,1.05+.08*sin(T*.7),0.);
  vec3 ro=vec3(M.x*.9,1.55+M.y*.35,5.4);
  vec3 ta=vec3(0.,.8,0.);
  vec3 fw=normalize(ta-ro),rt=normalize(cross(fw,vec3(0,1,0))),up=cross(rt,fw);
  vec3 rd=normalize(fw*1.9+rt*uv.x+up*uv.y);
  float t=.02; vec4 h; bool hit=false;
  for(int i=0;i<80;i++){h=map(ro+rd*t);if(h.x<.001){hit=true;break;}t+=h.x*.9;if(t>30.)break;}
  vec3 col=bg(rd);
  if(hit){
    vec3 p=ro+rd*t,n=nrm(p); float m=h.y;
    vec3 L=normalize(vec3(.35,.9,.25));
    float sh=shadow(p+n*.01,L);
    float dif=clamp(dot(n,L),0.,1.)*sh;
    float spec=pow(clamp(dot(n,normalize(L-rd)),0.,1.),60.)*sh;
    float fr=pow(1.-clamp(-dot(n,rd),0.,1.),4.);
    vec3 rr=reflect(rd,n);
    // one reflection bounce
    float t2=.02; vec4 h2; bool hit2=false; vec3 ro2=p+n*.01;
    for(int i=0;i<40;i++){h2=map(ro2+rr*t2);if(h2.x<.002){hit2=true;break;}t2+=h2.x;if(t2>15.)break;}
    vec3 rc=hit2?shadeBasic(ro2+rr*t2,rr,h2.y):env(rr)*.6;
    if(m<.5){ col=rc*vec3(.9,.9,.92)+spec*1.6; }
    else if(m<1.5){ col=vec3(.95,.42,.2)*(.06+dif)+rc*(.04+fr*.8)+spec*.6; }
    else if(m<2.5){ col=vec3(.62,.8,.9)*(.06+dif)+rc*(.15+fr*.6)+spec*.6; }
    else {
      float fd=exp(-.06*t*t);
      vec3 fc=vec3(.05,.055,.065)*(.25+.75*dif)+rc*.28*fd;
      col=fc*fd+bg(rd)*(1.-fd);
    }
  }
  col=col/(1.+col*.85);
  col=pow(clamp(col,0.,1.),vec3(1./2.2));
  vec2 q=gl_FragCoord.xy/R;
  col*=1.-.5*clamp(length((q-.5)*vec2(1.2,1.))*1.1-.3,0.,1.);
  gl_FragColor=vec4(col,1.);
}`;

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    console.warn("hero-gl:", e);
    cv.remove();
    window.PG_HERO_GL = false;
    return;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, "R"), uT = gl.getUniformLocation(prog, "T"),
        uM = gl.getUniformLocation(prog, "M"), uW = gl.getUniformLocation(prog, "WIDE");

  // render below native resolution; the scene is soft, and this keeps phones smooth
  let scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
  function resize() {
    const r = host.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(r.width * scale));
    cv.height = Math.max(1, Math.round(r.height * scale));
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform2f(uR, cv.width, cv.height);
    gl.uniform1f(uW, r.width > 880 ? 1 : 0);
  }
  resize();
  window.addEventListener("resize", resize);

  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * -2;
  }, { passive: true });

  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(host);

  const t0 = performance.now();
  let slow = 0, last = t0;
  function frame(now) {
    // adaptive quality: drop resolution if frames are slow
    const dt = now - last; last = now;
    if (dt > 40) { if (++slow > 20 && scale > 0.4) { scale *= 0.8; resize(); slow = 0; } } else slow = Math.max(0, slow - 1);
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    if (visible) {
      gl.uniform1f(uT, REDUCE ? 2.0 : (now - t0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (!REDUCE) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
