(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const xl="185",_g={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},yg={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Mm=0,mu=1,bm=2,vg=3,Mg=0,ya=1,Ou=2,Tr=3,Ci=0,gn=1,ii=2,ci=0,Ns=1,Ia=2,gu=3,xu=4,Sm=5,bg=6,Ji=100,wm=101,Am=102,Tm=103,Em=104,Cm=200,Rm=201,Im=202,Pm=203,vc=204,Mc=205,Lm=206,Dm=207,Nm=208,Um=209,Fm=210,Om=211,Bm=212,zm=213,km=214,bc=0,Sc=1,wc=2,Fs=3,Ac=4,Tc=5,Ec=6,Cc=7,Za=0,Vm=1,Gm=2,Jn=0,Bu=1,zu=2,ku=3,_l=4,Vu=5,Gu=6,Hu=7,_u="attached",Hm="detached",yl=300,li=301,ns=302,va=303,Ma=304,Br=306,Pa=1e3,on=1001,La=1002,Wt=1003,Wu=1004,Sg=1004,Er=1005,wg=1005,It=1006,ba=1007,Ag=1007,si=1008,Tg=1008,Mn=1009,Xu=1010,qu=1011,Pr=1012,vl=1013,Bn=1014,mn=1015,hi=1016,Ml=1017,bl=1018,Lr=1020,Yu=35902,$u=35899,Zu=1021,Ju=1022,cn=1023,ui=1026,Ki=1027,Sl=1028,Ja=1029,is=1030,wl=1031,Eg=1032,Al=1033,Sa=33776,wa=33777,Aa=33778,Ta=33779,Rc=35840,Ic=35841,Pc=35842,Lc=35843,Dc=36196,Nc=37492,Uc=37496,Fc=37488,Oc=37489,Da=37490,Bc=37491,zc=37808,kc=37809,Vc=37810,Gc=37811,Hc=37812,Wc=37813,Xc=37814,qc=37815,Yc=37816,$c=37817,Zc=37818,Jc=37819,Kc=37820,jc=37821,Qc=36492,el=36494,tl=36495,nl=36283,il=36284,Na=36285,sl=36286,Wm=2200,Xm=2201,qm=2202,Ua=2300,rl=2301,xc=2302,yu=2303,Ps=2400,Ls=2401,Fa=2402,Tl=2500,Ku=2501,Cg=0,Rg=1,Ig=2,Ym=3200,Pg=3201,Lg=3202,Dg=3203,Ri=0,$m=1,Ai="",fn="srgb",Oa="srgb-linear",Ba="linear",Et="srgb",Ng="",Ug="rg",Fg="ga",Og=0,Rs=7680,Bg=7681,zg=7682,kg=7683,Vg=34055,Gg=34056,Hg=5386,Wg=512,Xg=513,qg=514,Yg=515,$g=516,Zg=517,Jg=518,vu=519,Zm=512,Jm=513,Km=514,El=515,jm=516,Qm=517,Cl=518,e0=519,za=35044,Kg=35048,jg=35040,Qg=35045,ex=35049,tx=35041,nx=35046,ix=35050,sx=35042,rx="100",Mu="300 es",In=2e3,Os=2001,ax={COMPUTE:"compute",RENDER:"render"},ox={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},cx={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},lx={TEXTURE_COMPARE:"depthTextureCompare"};function hx(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}const ux={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Cr(s,e){return new ux[s](e)}function t0(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function ka(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function n0(){const s=ka("canvas");return s.style.display="block",s}const Nd={};let ss=null;function dx(s){ss=s}function fx(){return ss}function Va(...s){const e="THREE."+s.shift();ss?ss("log",e,...s):console.log(e,...s)}function i0(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ve(...s){s=i0(s);const e="THREE."+s.shift();if(ss)ss("warn",e,...s);else{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function at(...s){s=i0(s);const e="THREE."+s.shift();if(ss)ss("error",e,...s);else{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function ts(...s){const e=s.join(" ");e in Nd||(Nd[e]=!0,Ve(...s))}function px(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const mx={[bc]:Sc,[wc]:Ec,[Ac]:Cc,[Fs]:Tc,[Sc]:bc,[Ec]:wc,[Cc]:Ac,[Tc]:Fs};class Kn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ud=1234567;const Us=Math.PI/180,Dr=180/Math.PI;function Pn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[s&255]+sn[s>>8&255]+sn[s>>16&255]+sn[s>>24&255]+"-"+sn[e&255]+sn[e>>8&255]+"-"+sn[e>>16&15|64]+sn[e>>24&255]+"-"+sn[t&63|128]+sn[t>>8&255]+"-"+sn[t>>16&255]+sn[t>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function ut(s,e,t){return Math.max(e,Math.min(t,s))}function ju(s,e){return(s%e+e)%e}function gx(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function xx(s,e,t){return s!==e?(t-s)/(e-s):0}function Ea(s,e,t){return(1-t)*s+t*e}function _x(s,e,t,n){return Ea(s,e,1-Math.exp(-t*n))}function yx(s,e=1){return e-Math.abs(ju(s,e*2)-e)}function vx(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Mx(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function bx(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Sx(s,e){return s+Math.random()*(e-s)}function wx(s){return s*(.5-Math.random())}function Ax(s){s!==void 0&&(Ud=s);let e=Ud+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tx(s){return s*Us}function Ex(s){return s*Dr}function Cx(s){return(s&s-1)===0&&s!==0}function Rx(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Ix(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Px(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":s.set(o*h,c*d,c*u,o*l);break;case"YZY":s.set(c*u,o*h,c*d,o*l);break;case"ZXZ":s.set(c*d,c*u,o*h,o*l);break;case"XZX":s.set(o*h,c*p,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*p,o*l);break;case"ZYZ":s.set(c*p,c*f,o*h,o*l);break;default:Ve("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function pn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function gt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Lx={DEG2RAD:Us,RAD2DEG:Dr,generateUUID:Pn,clamp:ut,euclideanModulo:ju,mapLinear:gx,inverseLerp:xx,lerp:Ea,damp:_x,pingpong:yx,smoothstep:vx,smootherstep:Mx,randInt:bx,randFloat:Sx,randFloatSpread:wx,seededRandom:Ax,degToRad:Tx,radToDeg:Ex,isPowerOfTwo:Cx,ceilPowerOfTwo:Rx,floorPowerOfTwo:Ix,setQuaternionFromProperEuler:Px,normalize:gt,denormalize:pn},Cd=class Cd{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Cd.prototype.isVector2=!0;let Ie=Cd;class Xt{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],p=r[a+2],x=r[a+3];if(d!==x||c!==u||l!==f||h!==p){let m=c*u+l*f+h*p+d*x;m<0&&(u=-u,f=-f,p=-p,x=-x,m=-m);let g=1-o;if(m<.9995){const v=Math.acos(m),b=Math.sin(v);g=Math.sin(g*v)/b,o=Math.sin(o*v)/b,c=c*g+u*o,l=l*g+f*o,h=h*g+p*o,d=d*g+x*o}else{c=c*g+u*o,l=l*g+f*o,h=h*g+p*o,d=d*g+x*o;const v=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=v,l*=v,h*=v,d*=v}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+h*d+c*f-l*u,e[t+1]=c*p+h*u+l*d-o*f,e[t+2]=l*p+h*f+o*u-c*d,e[t+3]=h*p-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),d=o(r/2),u=c(n/2),f=c(i/2),p=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d+u*f*p;break;case"YZX":this._x=u*h*d+l*f*p,this._y=l*f*d+u*h*p,this._z=l*h*p-u*f*d,this._w=l*h*d-u*f*p;break;case"XZY":this._x=u*h*d-l*f*p,this._y=l*f*d-u*h*p,this._z=l*h*p+u*f*d,this._w=l*h*d+u*f*p;break;default:Ve("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ut(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Rd=class Rd{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-r*i),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=i+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this.z=ut(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this.z=ut(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return sh.copy(this).projectOnVector(e),this.sub(sh)}reflect(e){return this.sub(sh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Rd.prototype.isVector3=!0;let I=Rd;const sh=new I,Fd=new Xt,Id=class Id{constructor(e,t,n,i,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l)}set(e,t,n,i,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],x=i[0],m=i[3],g=i[6],v=i[1],b=i[4],y=i[7],w=i[2],S=i[5],C=i[8];return r[0]=a*x+o*v+c*w,r[3]=a*m+o*b+c*S,r[6]=a*g+o*y+c*C,r[1]=l*x+h*v+d*w,r[4]=l*m+h*b+d*S,r[7]=l*g+h*y+d*C,r[2]=u*x+f*v+p*w,r[5]=u*m+f*b+p*S,r[8]=u*g+f*y+p*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,p=t*d+n*u+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return e[0]=d*x,e[1]=(i*l-h*n)*x,e[2]=(o*n-i*a)*x,e[3]=u*x,e[4]=(h*t-i*c)*x,e[5]=(i*r-o*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(rh.makeScale(e,t)),this}rotate(e){return ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(rh.makeRotation(-e)),this}translate(e,t){return ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(rh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Id.prototype.isMatrix3=!0;let pt=Id;const rh=new pt,Od=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bd=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Dx(){const s={enabled:!0,workingColorSpace:Oa,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Et&&(i.r=Ei(i.r),i.g=Ei(i.g),i.b=Ei(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Et&&(i.r=Ir(i.r),i.g=Ir(i.g),i.b=Ir(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ai?Ba:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Oa]:{primaries:e,whitePoint:n,transfer:Ba,toXYZ:Od,fromXYZ:Bd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:fn},outputColorSpaceConfig:{drawingBufferColorSpace:fn}},[fn]:{primaries:e,whitePoint:n,transfer:Et,toXYZ:Od,fromXYZ:Bd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:fn}}}),s}const yt=Dx();function Ei(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ir(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ys;class s0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ys===void 0&&(Ys=ka("canvas")),Ys.width=e.width,Ys.height=e.height;const i=Ys.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ys}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ka("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Ei(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ei(t[n]/255)*255):t[n]=Ei(t[n]);return{data:t,width:e.width,height:e.height}}else return Ve("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Nx=0;class ji{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Nx++}),this.uuid=Pn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(ah(i[a].image)):r.push(ah(i[a]))}else r=ah(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function ah(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?s0.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ve("Texture: Unable to serialize Texture."),{})}let Ux=0;const oh=new I;class Ot extends Kn{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,n=on,i=on,r=It,a=si,o=cn,c=Mn,l=Ot.DEFAULT_ANISOTROPY,h=Ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ux++}),this.uuid=Pn(),this.name="",this.source=new ji(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(oh).x}get height(){return this.source.getSize(oh).y}get depth(){return this.source.getSize(oh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ve(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ve(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==yl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pa:e.x=e.x-Math.floor(e.x);break;case on:e.x=e.x<0?0:1;break;case La:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pa:e.y=e.y-Math.floor(e.y);break;case on:e.y=e.y<0?0:1;break;case La:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=yl;Ot.DEFAULT_ANISOTROPY=1;const Pd=class Pd{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],p=c[9],x=c[2],m=c[6],g=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,y=(f+1)/2,w=(g+1)/2,S=(h+u)/4,C=(d+x)/4,_=(p+m)/4;return b>y&&b>w?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=S/n,r=C/n):y>w?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=S/i,r=_/i):w<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(w),n=C/r,i=_/r),this.set(n,i,r,t),this}let v=Math.sqrt((m-p)*(m-p)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(d-x)/v,this.z=(u-h)/v,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this.z=ut(this.z,e.z,t.z),this.w=ut(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this.z=ut(this.z,e,t),this.w=ut(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Pd.prototype.isVector4=!0;let Ct=Pd;class Qu extends Kn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:It,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Ot(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:It,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new ji(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ln extends Qu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Rl extends Ot{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Fx extends Ln{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Rl(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class Il extends Ot{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ox extends Ln{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Il(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}const gl=class gl{constructor(e,t,n,i,r,a,o,c,l,h,d,u,f,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l,h,d,u,f,p,x,m)}set(e,t,n,i,r,a,o,c,l,h,d,u,f,p,x,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new gl().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/$s.setFromMatrixColumn(e,0).length(),r=1/$s.setFromMatrixColumn(e,1).length(),a=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,p=o*h,x=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+p*l,t[5]=u-x*l,t[9]=-o*c,t[2]=x-u*l,t[6]=p+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,p=l*h,x=l*d;t[0]=u+x*o,t[4]=p*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=x+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,p=l*h,x=l*d;t[0]=u-x*o,t[4]=-a*d,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=x-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,p=o*h,x=o*d;t[0]=c*h,t[4]=p*l-f,t[8]=u*l+x,t[1]=c*d,t[5]=x*l+u,t[9]=f*l-p,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,p=o*c,x=o*l;t[0]=c*h,t[4]=x-u*d,t[8]=p*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+p,t[10]=u-x*d}else if(e.order==="XZY"){const u=a*c,f=a*l,p=o*c,x=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+x,t[5]=a*h,t[9]=f*d-p,t[2]=p*d-f,t[6]=o*h,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bx,e,zx)}lookAt(e,t,n){const i=this.elements;return Cn.subVectors(e,t),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),Ui.crossVectors(n,Cn),Ui.lengthSq()===0&&(Math.abs(n.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),Ui.crossVectors(n,Cn)),Ui.normalize(),ro.crossVectors(Cn,Ui),i[0]=Ui.x,i[4]=ro.x,i[8]=Cn.x,i[1]=Ui.y,i[5]=ro.y,i[9]=Cn.y,i[2]=Ui.z,i[6]=ro.z,i[10]=Cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],x=n[6],m=n[10],g=n[14],v=n[3],b=n[7],y=n[11],w=n[15],S=i[0],C=i[4],_=i[8],E=i[12],A=i[1],P=i[5],D=i[9],H=i[13],W=i[2],B=i[6],$=i[10],X=i[14],he=i[3],ie=i[7],ae=i[11],Y=i[15];return r[0]=a*S+o*A+c*W+l*he,r[4]=a*C+o*P+c*B+l*ie,r[8]=a*_+o*D+c*$+l*ae,r[12]=a*E+o*H+c*X+l*Y,r[1]=h*S+d*A+u*W+f*he,r[5]=h*C+d*P+u*B+f*ie,r[9]=h*_+d*D+u*$+f*ae,r[13]=h*E+d*H+u*X+f*Y,r[2]=p*S+x*A+m*W+g*he,r[6]=p*C+x*P+m*B+g*ie,r[10]=p*_+x*D+m*$+g*ae,r[14]=p*E+x*H+m*X+g*Y,r[3]=v*S+b*A+y*W+w*he,r[7]=v*C+b*P+y*B+w*ie,r[11]=v*_+b*D+y*$+w*ae,r[15]=v*E+b*H+y*X+w*Y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],p=e[3],x=e[7],m=e[11],g=e[15],v=c*f-l*u,b=o*f-l*d,y=o*u-c*d,w=a*f-l*h,S=a*u-c*h,C=a*d-o*h;return t*(x*v-m*b+g*y)-n*(p*v-m*w+g*S)+i*(p*b-x*w+g*C)-r*(p*y-x*S+m*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+i*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],p=e[12],x=e[13],m=e[14],g=e[15],v=t*o-n*a,b=t*c-i*a,y=t*l-r*a,w=n*c-i*o,S=n*l-r*o,C=i*l-r*c,_=h*x-d*p,E=h*m-u*p,A=h*g-f*p,P=d*m-u*x,D=d*g-f*x,H=u*g-f*m,W=v*H-b*D+y*P+w*A-S*E+C*_;if(W===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/W;return e[0]=(o*H-c*D+l*P)*B,e[1]=(i*D-n*H-r*P)*B,e[2]=(x*C-m*S+g*w)*B,e[3]=(u*S-d*C-f*w)*B,e[4]=(c*A-a*H-l*E)*B,e[5]=(t*H-i*A+r*E)*B,e[6]=(m*y-p*C-g*b)*B,e[7]=(h*C-u*y+f*b)*B,e[8]=(a*D-o*A+l*_)*B,e[9]=(n*A-t*D-r*_)*B,e[10]=(p*S-x*y+g*v)*B,e[11]=(d*y-h*S-f*v)*B,e[12]=(o*E-a*P-c*_)*B,e[13]=(t*P-n*E+i*_)*B,e[14]=(x*b-p*w-m*v)*B,e[15]=(h*w-d*b+u*v)*B,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,p=r*d,x=a*h,m=a*d,g=o*d,v=c*l,b=c*h,y=c*d,w=n.x,S=n.y,C=n.z;return i[0]=(1-(x+g))*w,i[1]=(f+y)*w,i[2]=(p-b)*w,i[3]=0,i[4]=(f-y)*S,i[5]=(1-(u+g))*S,i[6]=(m+v)*S,i[7]=0,i[8]=(p+b)*C,i[9]=(m-v)*C,i[10]=(1-(u+x))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=$s.set(i[0],i[1],i[2]).length();const o=$s.set(i[4],i[5],i[6]).length(),c=$s.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Wn.copy(this);const l=1/a,h=1/o,d=1/c;return Wn.elements[0]*=l,Wn.elements[1]*=l,Wn.elements[2]*=l,Wn.elements[4]*=h,Wn.elements[5]*=h,Wn.elements[6]*=h,Wn.elements[8]*=d,Wn.elements[9]*=d,Wn.elements[10]*=d,t.setFromRotationMatrix(Wn),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,i,r,a,o=In,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let p,x;if(c)p=r/(a-r),x=a*r/(a-r);else if(o===In)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Os)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=In,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-i),u=-(t+e)/(t-e),f=-(n+i)/(n-i);let p,x;if(c)p=1/(a-r),x=a/(a-r);else if(o===In)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===Os)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};gl.prototype.isMatrix4=!0;let dt=gl;const $s=new I,Wn=new dt,Bx=new I(0,0,0),zx=new I(1,1,1),Ui=new I,ro=new I,Cn=new I,zd=new dt,kd=new Xt;class zn{constructor(e=0,t=0,n=0,i=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ut(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ut(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ut(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ut(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ve("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return zd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kd.setFromEuler(this),this.setFromQuaternion(kd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class Pl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let kx=0;const Vd=new I,Zs=new Xt,xi=new dt,ao=new I,Gr=new I,Vx=new I,Gx=new Xt,Gd=new I(1,0,0),Hd=new I(0,1,0),Wd=new I(0,0,1),Xd={type:"added"},Hx={type:"removed"},Js={type:"childadded",child:null},ch={type:"childremoved",child:null};class bt extends Kn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kx++}),this.uuid=Pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new I,t=new zn,n=new Xt,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new dt},normalMatrix:{value:new pt}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zs.setFromAxisAngle(e,t),this.quaternion.multiply(Zs),this}rotateOnWorldAxis(e,t){return Zs.setFromAxisAngle(e,t),this.quaternion.premultiply(Zs),this}rotateX(e){return this.rotateOnAxis(Gd,e)}rotateY(e){return this.rotateOnAxis(Hd,e)}rotateZ(e){return this.rotateOnAxis(Wd,e)}translateOnAxis(e,t){return Vd.copy(e).applyQuaternion(this.quaternion),this.position.add(Vd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gd,e)}translateY(e){return this.translateOnAxis(Hd,e)}translateZ(e){return this.translateOnAxis(Wd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ao.copy(e):ao.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(Gr,ao,this.up):xi.lookAt(ao,Gr,this.up),this.quaternion.setFromRotationMatrix(xi),i&&(xi.extractRotation(i.matrixWorld),Zs.setFromRotationMatrix(xi),this.quaternion.premultiply(Zs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(at("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xd),Js.child=e,this.dispatchEvent(Js),Js.child=null):at("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hx),ch.child=e,this.dispatchEvent(ch),ch.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xd),Js.child=e,this.dispatchEvent(Js),Js.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,e,Vx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,Gx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}bt.DEFAULT_UP=new I(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ri extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wx={type:"move"};class _c{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ri,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ri,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ri,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,n),g=this._getHandJoint(l,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;l.inputState.pinching&&u>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wx)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ri;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const r0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},oo={h:0,s:0,l:0};function lh(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=fn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,yt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=yt.workingColorSpace){return this.r=e,this.g=t,this.b=n,yt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=yt.workingColorSpace){if(e=ju(e,1),t=ut(t,0,1),n=ut(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=lh(a,r,e+1/3),this.g=lh(a,r,e),this.b=lh(a,r,e-1/3)}return yt.colorSpaceToWorking(this,i),this}setStyle(e,t=fn){function n(r){r!==void 0&&parseFloat(r)<1&&Ve("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ve("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ve("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=fn){const n=r0[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ve("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ei(e.r),this.g=Ei(e.g),this.b=Ei(e.b),this}copyLinearToSRGB(e){return this.r=Ir(e.r),this.g=Ir(e.g),this.b=Ir(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=fn){return yt.workingToColorSpace(rn.copy(this),e),Math.round(ut(rn.r*255,0,255))*65536+Math.round(ut(rn.g*255,0,255))*256+Math.round(ut(rn.b*255,0,255))}getHexString(e=fn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=yt.workingColorSpace){yt.workingToColorSpace(rn.copy(this),t);const n=rn.r,i=rn.g,r=rn.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(i-r)/d+(i<r?6:0);break;case i:c=(r-n)/d+2;break;case r:c=(n-i)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=yt.workingColorSpace){return yt.workingToColorSpace(rn.copy(this),t),e.r=rn.r,e.g=rn.g,e.b=rn.b,e}getStyle(e=fn){yt.workingToColorSpace(rn.copy(this),e);const t=rn.r,n=rn.g,i=rn.b;return e!==fn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+t,Fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fi),e.getHSL(oo);const n=Ea(Fi.h,oo.h,t),i=Ea(Fi.s,oo.s,t),r=Ea(Fi.l,oo.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const rn=new ke;ke.NAMES=r0;class Ll{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ke(e),this.density=t}clone(){return new Ll(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Ka{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ke(e),this.near=t,this.far=n}clone(){return new Ka(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ed extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Xn=new I,_i=new I,hh=new I,yi=new I,Ks=new I,js=new I,qd=new I,uh=new I,dh=new I,fh=new I,ph=new Ct,mh=new Ct,gh=new Ct;class bn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Xn.subVectors(e,t),i.cross(Xn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Xn.subVectors(i,t),_i.subVectors(n,t),hh.subVectors(e,t);const a=Xn.dot(Xn),o=Xn.dot(_i),c=Xn.dot(hh),l=_i.dot(_i),h=_i.dot(hh),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,p=(a*h-o*c)*u;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,yi)===null?!1:yi.x>=0&&yi.y>=0&&yi.x+yi.y<=1}static getInterpolation(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,yi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,yi.x),c.addScaledVector(a,yi.y),c.addScaledVector(o,yi.z),c)}static getInterpolatedAttribute(e,t,n,i,r,a){return ph.setScalar(0),mh.setScalar(0),gh.setScalar(0),ph.fromBufferAttribute(e,t),mh.fromBufferAttribute(e,n),gh.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ph,r.x),a.addScaledVector(mh,r.y),a.addScaledVector(gh,r.z),a}static isFrontFacing(e,t,n,i){return Xn.subVectors(n,t),_i.subVectors(e,t),Xn.cross(_i).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Xn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return bn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return bn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Ks.subVectors(i,n),js.subVectors(r,n),uh.subVectors(e,n);const c=Ks.dot(uh),l=js.dot(uh);if(c<=0&&l<=0)return t.copy(n);dh.subVectors(e,i);const h=Ks.dot(dh),d=js.dot(dh);if(h>=0&&d<=h)return t.copy(i);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Ks,a);fh.subVectors(e,r);const f=Ks.dot(fh),p=js.dot(fh);if(p>=0&&f<=p)return t.copy(r);const x=f*l-c*p;if(x<=0&&l>=0&&p<=0)return o=l/(l-p),t.copy(n).addScaledVector(js,o);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return qd.subVectors(r,i),o=(d-h)/(d-h+(f-p)),t.copy(i).addScaledVector(qd,o);const g=1/(m+x+u);return a=x*g,o=u*g,t.copy(n).addScaledVector(Ks,a).addScaledVector(js,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ln{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,qn):qn.fromBufferAttribute(r,a),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),co.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),co.copy(n.boundingBox)),co.applyMatrix4(e.matrixWorld),this.union(co)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hr),lo.subVectors(this.max,Hr),Qs.subVectors(e.a,Hr),er.subVectors(e.b,Hr),tr.subVectors(e.c,Hr),Oi.subVectors(er,Qs),Bi.subVectors(tr,er),ds.subVectors(Qs,tr);let t=[0,-Oi.z,Oi.y,0,-Bi.z,Bi.y,0,-ds.z,ds.y,Oi.z,0,-Oi.x,Bi.z,0,-Bi.x,ds.z,0,-ds.x,-Oi.y,Oi.x,0,-Bi.y,Bi.x,0,-ds.y,ds.x,0];return!xh(t,Qs,er,tr,lo)||(t=[1,0,0,0,1,0,0,0,1],!xh(t,Qs,er,tr,lo))?!1:(ho.crossVectors(Oi,Bi),t=[ho.x,ho.y,ho.z],xh(t,Qs,er,tr,lo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const vi=[new I,new I,new I,new I,new I,new I,new I,new I],qn=new I,co=new ln,Qs=new I,er=new I,tr=new I,Oi=new I,Bi=new I,ds=new I,Hr=new I,lo=new I,ho=new I,fs=new I;function xh(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){fs.fromArray(s,r);const o=i.x*Math.abs(fs.x)+i.y*Math.abs(fs.y)+i.z*Math.abs(fs.z),c=e.dot(fs),l=t.dot(fs),h=n.dot(fs);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Ti=Xx();function Xx(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,i[c]=24,i[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,i[c]=-l-1,i[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,i[c]=13,i[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,i[c]=24,i[c|256]=24):(n[c]=31744,n[c|256]=64512,i[c]=13,i[c|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function vn(s){Math.abs(s)>65504&&Ve("DataUtils.toHalfFloat(): Value out of range."),s=ut(s,-65504,65504),Ti.floatView[0]=s;const e=Ti.uint32View[0],t=e>>23&511;return Ti.baseTable[t]+((e&8388607)>>Ti.shiftTable[t])}function pa(s){const e=s>>10;return Ti.uint32View[0]=Ti.mantissaTable[Ti.offsetTable[e]+(s&1023)]+Ti.exponentTable[e],Ti.floatView[0]}class qx{static toHalfFloat(e){return vn(e)}static fromHalfFloat(e){return pa(e)}}const qt=new I,uo=new Ie;let Yx=0;class At extends Kn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yx++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=za,this.updateRanges=[],this.gpuType=mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)uo.fromBufferAttribute(this,t),uo.applyMatrix3(e),this.setXY(t,uo.x,uo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=gt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),i=gt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),i=gt(i,this.array),r=gt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==za&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class $x extends At{constructor(e,t,n){super(new Int8Array(e),t,n)}}class Zx extends At{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class Jx extends At{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class Kx extends At{constructor(e,t,n){super(new Int16Array(e),t,n)}}class td extends At{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class jx extends At{constructor(e,t,n){super(new Int32Array(e),t,n)}}class nd extends At{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Qx extends At{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=pa(this.array[e*this.itemSize]);return this.normalized&&(t=pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize]=vn(t),this}getY(e){let t=pa(this.array[e*this.itemSize+1]);return this.normalized&&(t=pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+1]=vn(t),this}getZ(e){let t=pa(this.array[e*this.itemSize+2]);return this.normalized&&(t=pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+2]=vn(t),this}getW(e){let t=pa(this.array[e*this.itemSize+3]);return this.normalized&&(t=pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=gt(t,this.array)),this.array[e*this.itemSize+3]=vn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array)),this.array[e+0]=vn(t),this.array[e+1]=vn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),i=gt(i,this.array)),this.array[e+0]=vn(t),this.array[e+1]=vn(n),this.array[e+2]=vn(i),this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),i=gt(i,this.array),r=gt(r,this.array)),this.array[e+0]=vn(t),this.array[e+1]=vn(n),this.array[e+2]=vn(i),this.array[e+3]=vn(r),this}}class tt extends At{constructor(e,t,n){super(new Float32Array(e),t,n)}}const e_=new ln,Wr=new I,_h=new I;class en{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):e_.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wr.subVectors(e,this.center);const t=Wr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Wr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_h.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wr.copy(e.center).add(_h)),this.expandByPoint(Wr.copy(e.center).sub(_h))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let t_=0;const Un=new dt,yh=new bt,nr=new I,Rn=new ln,Xr=new ln,Kt=new I;class mt extends Kn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:t_++}),this.uuid=Pn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hx(e)?nd:td)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new pt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,t,n){return Un.makeTranslation(e,t,n),this.applyMatrix4(Un),this}scale(e,t,n){return Un.makeScale(e,t,n),this.applyMatrix4(Un),this}lookAt(e){return yh.lookAt(e),yh.updateMatrix(),this.applyMatrix4(yh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(nr).negate(),this.translate(nr.x,nr.y,nr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new tt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Ve("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ln);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){at("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Kt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(Kt),Kt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(Kt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&at('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new en);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){at("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Xr.setFromBufferAttribute(o),this.morphTargetsRelative?(Kt.addVectors(Rn.min,Xr.min),Rn.expandByPoint(Kt),Kt.addVectors(Rn.max,Xr.max),Rn.expandByPoint(Kt)):(Rn.expandByPoint(Xr.min),Rn.expandByPoint(Xr.max))}Rn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Kt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Kt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Kt.fromBufferAttribute(o,l),c&&(nr.fromBufferAttribute(e,l),Kt.add(nr)),i=Math.max(i,n.distanceToSquared(Kt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&at('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){at("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new At(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let _=0;_<n.count;_++)o[_]=new I,c[_]=new I;const l=new I,h=new I,d=new I,u=new Ie,f=new Ie,p=new Ie,x=new I,m=new I;function g(_,E,A){l.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,A),u.fromBufferAttribute(r,_),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,A),h.sub(l),d.sub(l),f.sub(u),p.sub(u);const P=1/(f.x*p.y-p.x*f.y);isFinite(P)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(P),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(P),o[_].add(x),o[E].add(x),o[A].add(x),c[_].add(m),c[E].add(m),c[A].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let _=0,E=v.length;_<E;++_){const A=v[_],P=A.start,D=A.count;for(let H=P,W=P+D;H<W;H+=3)g(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const b=new I,y=new I,w=new I,S=new I;function C(_){w.fromBufferAttribute(i,_),S.copy(w);const E=o[_];b.copy(E),b.sub(w.multiplyScalar(w.dot(E))).normalize(),y.crossVectors(S,E);const P=y.dot(c[_])<0?-1:1;a.setXYZW(_,b.x,b.y,b.z,P)}for(let _=0,E=v.length;_<E;++_){const A=v[_],P=A.start,D=A.count;for(let H=P,W=P+D;H<W;H+=3)C(e.getX(H+0)),C(e.getX(H+1)),C(e.getX(H+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new At(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new I,r=new I,a=new I,o=new I,c=new I,l=new I,h=new I,d=new I;if(e)for(let u=0,f=e.count;u<f;u+=3){const p=e.getX(u+0),x=e.getX(u+1),m=e.getX(u+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Kt.fromBufferAttribute(e,t),Kt.normalize(),e.setXYZ(t,Kt.x,Kt.y,Kt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,p=0;for(let x=0,m=c.length;x<m;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let g=0;g<h;g++)u[p++]=l[f++]}return new At(u,h,d)}if(this.index===null)return Ve("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new mt,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Dl{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=za,this.updateRanges=[],this.version=0,this.uuid=Pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const un=new I;class Bs{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyMatrix4(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyNormalMatrix(e),this.setXYZ(t,un.x,un.y,un.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.transformDirection(e),this.setXYZ(t,un.x,un.y,un.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=gt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=gt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),i=gt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=gt(t,this.array),n=gt(n,this.array),i=gt(i,this.array),r=gt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Va("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new At(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Bs(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Va("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let n_=0;class tn extends Kn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=Pn(),this.name="",this.type="Material",this.blending=Ns,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vc,this.blendDst=Mc,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ve(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Ve(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ns&&(n.blending=this.blending),this.side!==Ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==vc&&(n.blendSrc=this.blendSrc),this.blendDst!==Mc&&(n.blendDst=this.blendDst),this.blendEquation!==Ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ie().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ie().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ga extends tn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ir;const qr=new I,sr=new I,rr=new I,ar=new Ie,Yr=new Ie,a0=new dt,fo=new I,$r=new I,po=new I,Yd=new Ie,vh=new Ie,$d=new Ie;class al extends bt{constructor(e=new Ga){if(super(),this.isSprite=!0,this.type="Sprite",ir===void 0){ir=new mt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Dl(t,5);ir.setIndex([0,1,2,0,2,3]),ir.setAttribute("position",new Bs(n,3,0,!1)),ir.setAttribute("uv",new Bs(n,2,3,!1))}this.geometry=ir,this.material=e,this.center=new Ie(.5,.5),this.count=1}raycast(e,t){e.camera===null&&at('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),sr.setFromMatrixScale(this.matrixWorld),a0.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),rr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&sr.multiplyScalar(-rr.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;mo(fo.set(-.5,-.5,0),rr,a,sr,i,r),mo($r.set(.5,-.5,0),rr,a,sr,i,r),mo(po.set(.5,.5,0),rr,a,sr,i,r),Yd.set(0,0),vh.set(1,0),$d.set(1,1);let o=e.ray.intersectTriangle(fo,$r,po,!1,qr);if(o===null&&(mo($r.set(-.5,.5,0),rr,a,sr,i,r),vh.set(0,1),o=e.ray.intersectTriangle(fo,po,$r,!1,qr),o===null))return;const c=e.ray.origin.distanceTo(qr);c<e.near||c>e.far||t.push({distance:c,point:qr.clone(),uv:bn.getInterpolation(qr,fo,$r,po,Yd,vh,$d,new Ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function mo(s,e,t,n,i,r){ar.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Yr.x=r*ar.x-i*ar.y,Yr.y=i*ar.x+r*ar.y):Yr.copy(ar),s.copy(e),s.x+=Yr.x,s.y+=Yr.y,s.applyMatrix4(a0)}const go=new I,Zd=new I;class o0 extends bt{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const r=t[n];this.addLevel(r.object.clone(),r.distance,r.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let r;for(r=0;r<i.length&&!(t<i[r].distance);r++);return i.splice(r,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let r=t[n].distance;if(t[n].object.visible&&(r-=r*t[n].hysteresis),e<r)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){go.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(go);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){go.setFromMatrixPosition(e.matrixWorld),Zd.setFromMatrixPosition(this.matrixWorld);const n=go.distanceTo(Zd)/e.zoom;t[0].object.visible=!0;let i,r;for(i=1,r=t.length;i<r;i++){let a=t[i].distance;if(t[i].object.visible&&(a-=a*t[i].hysteresis),n>=a)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<r;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,r=n.length;i<r;i++){const a=n[i];t.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return t}}const Mi=new I,Mh=new I,xo=new I,zi=new I,bh=new I,_o=new I,Sh=new I;class zr{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Mh.copy(e).add(t).multiplyScalar(.5),xo.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(Mh);const r=e.distanceTo(t)*.5,a=-this.direction.dot(xo),o=zi.dot(this.direction),c=-zi.dot(xo),l=zi.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*c-o,u=a*o-c,p=r*h,d>=0)if(u>=-p)if(u<=p){const x=1/h;d*=x,u*=x,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=p?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Mh).addScaledVector(xo,u),f}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);const n=Mi.dot(this.direction),i=Mi.dot(Mi)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,i=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,i=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,n,i,r){bh.subVectors(t,e),_o.subVectors(n,e),Sh.crossVectors(bh,_o);let a=this.direction.dot(Sh),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,e);const c=o*this.direction.dot(_o.crossVectors(zi,_o));if(c<0)return null;const l=o*this.direction.dot(bh.cross(zi));if(l<0||c+l>a)return null;const h=-o*zi.dot(Sh);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class as extends tn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Za,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Jd=new dt,ps=new zr,yo=new en,Kd=new I,vo=new I,Mo=new I,bo=new I,wh=new I,So=new I,jd=new I,wo=new I;class Bt extends bt{constructor(e=new mt,t=new as){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){So.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(wh.fromBufferAttribute(d,e),a?So.addScaledVector(wh,h):So.addScaledVector(wh.sub(t),h))}t.add(So)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),yo.copy(n.boundingSphere),yo.applyMatrix4(r),ps.copy(e.ray).recast(e.near),!(yo.containsPoint(ps.origin)===!1&&(ps.intersectSphere(yo,Kd)===null||ps.origin.distanceToSquared(Kd)>(e.far-e.near)**2))&&(Jd.copy(r).invert(),ps.copy(e.ray).applyMatrix4(Jd),!(n.boundingBox!==null&&ps.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ps)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){const m=u[p],g=a[m.materialIndex],v=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,w=b;y<w;y+=3){const S=o.getX(y),C=o.getX(y+1),_=o.getX(y+2);i=Ao(this,g,e,n,l,h,d,S,C,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const v=o.getX(m),b=o.getX(m+1),y=o.getX(m+2);i=Ao(this,a,e,n,l,h,d,v,b,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){const m=u[p],g=a[m.materialIndex],v=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,w=b;y<w;y+=3){const S=y,C=y+1,_=y+2;i=Ao(this,g,e,n,l,h,d,S,C,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const v=m,b=m+1,y=m+2;i=Ao(this,a,e,n,l,h,d,v,b,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function i_(s,e,t,n,i,r,a,o){let c;if(e.side===gn?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===Ci,o),c===null)return null;wo.copy(o),wo.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(wo);return l<t.near||l>t.far?null:{distance:l,point:wo.clone(),object:s}}function Ao(s,e,t,n,i,r,a,o,c,l){s.getVertexPosition(o,vo),s.getVertexPosition(c,Mo),s.getVertexPosition(l,bo);const h=i_(s,e,t,n,vo,Mo,bo,jd);if(h){const d=new I;bn.getBarycoord(jd,vo,Mo,bo,d),i&&(h.uv=bn.getInterpolatedAttribute(i,o,c,l,d,new Ie)),r&&(h.uv1=bn.getInterpolatedAttribute(r,o,c,l,d,new Ie)),a&&(h.normal=bn.getInterpolatedAttribute(a,o,c,l,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new I,materialIndex:0};bn.getNormal(vo,Mo,bo,u.normal),h.face=u,h.barycoord=d}return h}const Zr=new Ct,Qd=new Ct,ef=new Ct,s_=new Ct,tf=new dt,To=new I,Ah=new en,nf=new dt,Th=new zr;class c0 extends Bt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=_u,this.bindMatrix=new dt,this.bindMatrixInverse=new dt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ln),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,To),this.boundingBox.expandByPoint(To)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new en),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,To),this.boundingSphere.expandByPoint(To)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ah.copy(this.boundingSphere),Ah.applyMatrix4(i),e.ray.intersectsSphere(Ah)!==!1&&(nf.copy(i).invert(),Th.copy(e.ray).applyMatrix4(nf),!(this.boundingBox!==null&&Th.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Th)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ct,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===_u?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Hm?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ve("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Qd.fromBufferAttribute(i.attributes.skinIndex,e),ef.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Zr.copy(t),t.set(0,0,0,0)):(Zr.set(...t,1),t.set(0,0,0)),Zr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=ef.getComponent(r);if(a!==0){const o=Qd.getComponent(r);tf.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(s_.copy(Zr).applyMatrix4(tf),a)}}return t.isVector4&&(t.w=Zr.w),t.applyMatrix4(this.bindMatrixInverse)}}class id extends bt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Dn extends Ot{constructor(e=null,t=1,n=1,i,r,a,o,c,l=Wt,h=Wt,d,u){super(null,a,o,c,l,h,i,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const sf=new dt,r_=new dt;class Nl{constructor(e=[],t=[]){this.uuid=Pn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ve("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new dt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new dt;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:r_;sf.multiplyMatrices(o,t[r]),sf.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Nl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Dn(t,e,e,cn,mn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Ve("Skeleton: No bone found with UUID:",r),a=new id),this.bones.push(a),this.boneInverses.push(new dt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Nr extends At{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const or=new dt,rf=new dt,Eo=[],af=new ln,a_=new dt,Jr=new Bt,Kr=new en;class l0 extends Bt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Nr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,a_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ln),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),af.copy(e.boundingBox).applyMatrix4(or),this.boundingBox.union(af)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new en),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),Kr.copy(e.boundingSphere).applyMatrix4(or),this.boundingSphere.union(Kr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Jr.geometry=this.geometry,Jr.material=this.material,Jr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Kr.copy(this.boundingSphere),Kr.applyMatrix4(n),e.ray.intersectsSphere(Kr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,or),rf.multiplyMatrices(n,or),Jr.matrixWorld=rf,Jr.raycast(e,Eo);for(let a=0,o=Eo.length;a<o;a++){const c=Eo[a];c.instanceId=r,c.object=this,t.push(c)}Eo.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Nr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Dn(new Float32Array(i*this.count),i,this.count,Sl,mn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Eh=new I,o_=new I,c_=new pt;class Zi{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Eh.subVectors(n,t).cross(o_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(Eh),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||c_.getNormalMatrix(e),i=this.coplanarPoint(Eh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ms=new en,l_=new Ie(.5,.5),Co=new I;class zs{constructor(e=new Zi,t=new Zi,n=new Zi,i=new Zi,r=new Zi,a=new Zi){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=In,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],p=r[8],x=r[9],m=r[10],g=r[11],v=r[12],b=r[13],y=r[14],w=r[15];if(i[0].setComponents(l-a,f-h,g-p,w-v).normalize(),i[1].setComponents(l+a,f+h,g+p,w+v).normalize(),i[2].setComponents(l+o,f+d,g+x,w+b).normalize(),i[3].setComponents(l-o,f-d,g-x,w-b).normalize(),n)i[4].setComponents(c,u,m,y).normalize(),i[5].setComponents(l-c,f-u,g-m,w-y).normalize();else if(i[4].setComponents(l-c,f-u,g-m,w-y).normalize(),t===In)i[5].setComponents(l+c,f+u,g+m,w+y).normalize();else if(t===Os)i[5].setComponents(c,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ms.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ms.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ms)}intersectsSprite(e){ms.center.set(0,0,0);const t=l_.distanceTo(e.center);return ms.radius=.7071067811865476+t,ms.applyMatrix4(e.matrixWorld),this.intersectsSphere(ms)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Co.x=i.normal.x>0?e.max.x:e.min.x,Co.y=i.normal.y>0?e.max.y:e.min.y,Co.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Co)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const of=new dt;class Ul{constructor(){this.coordinateSystem=In,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){const r=t[i];of.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new zs),n[i].setFromProjectionMatrix(of,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}intersectsObject(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new zs),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new Ul().copy(this)}}function Ch(s,e){return s-e}function h_(s,e){return s.z-e.z}function u_(s,e){return e.z-s.z}class d_{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){const r=this.pool,a=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});const o=r[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}}const yn=new dt,f_=new ke(1,1,1),p_=new zs,m_=new Ul,Ro=new ln,gs=new en,jr=new I,cf=new I,g_=new I,Rh=new d_,an=new Bt,Io=[];function x_(s,e,t=0){const n=e.itemSize;if(s.isInterleavedBufferAttribute||s.array.constructor!==e.array.constructor){const i=s.count;for(let r=0;r<i;r++)for(let a=0;a<n;a++)e.setComponent(r+t,a,s.getComponent(r,a))}else e.array.set(s.array,t*n);e.needsUpdate=!0}function xs(s,e){if(s.constructor!==e.constructor){const t=Math.min(s.length,e.length);for(let n=0;n<t;n++)e[n]=s[n]}else{const t=Math.min(s.length,e.length);e.set(new s.constructor(s.buffer,0,t))}}class h0 extends Bt{constructor(e,t,n=t*2,i){super(new mt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new Dn(t,e,e,cn,mn);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new Dn(t,e,e,Ja,Bn);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new Dn(t,e,e,cn,mn);n.colorSpace=yt.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const r in e.attributes){const a=e.getAttribute(r),{array:o,itemSize:c,normalized:l}=a,h=new o.constructor(n*c),d=new At(h,c,l);t.setAttribute(r,d)}if(e.getIndex()!==null){const r=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new At(r,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),r=t.getAttribute(n);if(i.itemSize!==r.itemSize||i.normalized!==r.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){const t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){const t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ln);const e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,yn),this.getBoundingBoxAt(r,Ro).applyMatrix4(yn),e.union(Ro)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new en);const e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const r=t[n].geometryIndex;this.getMatrixAt(n,yn),this.getBoundingSphereAt(r,gs).applyMatrix4(yn),e.union(gs)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Ch),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));const r=this._matricesTexture;yn.identity().toArray(r.image.data,i*16),r.needsUpdate=!0;const a=this._colorsTexture;return a&&(f_.toArray(a.image.data,i*4),a.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);const i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;const a=e.getIndex();if(a!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?a.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let c;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Ch),c=this._availableGeometryIds.shift(),r[c]=i):(c=this._geometryCount,this._geometryCount++,r.push(i)),this.setGeometryAt(c,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,c}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,r=n.getIndex(),a=t.getIndex(),o=this._geometryInfo[e];if(i&&a.count>o.reservedIndexCount||t.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const c=o.vertexStart,l=o.reservedVertexCount;o.vertexCount=t.getAttribute("position").count;for(const h in n.attributes){const d=t.getAttribute(h),u=n.getAttribute(h);x_(d,u,c);const f=d.itemSize;for(let p=d.count,x=l;p<x;p++){const m=c+p;for(let g=0;g<f;g++)u.setComponent(m,g,0)}u.needsUpdate=!0,u.addUpdateRange(c*f,l*f)}if(i){const h=o.indexStart,d=o.reservedIndexCount;o.indexCount=t.getIndex().count;for(let u=0;u<a.count;u++)r.setX(h+u,c+a.getX(u));for(let u=a.count,f=d;u<f;u++)r.setX(h+u,c);r.needsUpdate=!0,r.addUpdateRange(h,o.reservedIndexCount)}return o.start=i?o.indexStart:o.vertexStart,o.count=i?o.indexCount:o.vertexCount,o.boundingBox=null,t.boundingBox!==null&&(o.boundingBox=t.boundingBox.clone()),o.boundingSphere=null,t.boundingSphere!==null&&(o.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){const t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;const n=this._instanceInfo;for(let i=0,r=n.length;i<r;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0;const n=this._geometryInfo,i=n.map((a,o)=>o).sort((a,o)=>n[a].vertexStart-n[o].vertexStart),r=this.geometry;for(let a=0,o=n.length;a<o;a++){const c=i[a],l=n[c];if(l.active!==!1){if(r.index!==null){if(l.indexStart!==t){const{indexStart:h,vertexStart:d,reservedIndexCount:u}=l,f=r.index,p=f.array,x=e-d;for(let m=h;m<h+u;m++)p[m]=p[m]+x;f.array.copyWithin(t,h,h+u),f.addUpdateRange(t,u),f.needsUpdate=!0,l.indexStart=t}t+=l.reservedIndexCount}if(l.vertexStart!==e){const{vertexStart:h,reservedVertexCount:d}=l,u=r.attributes;for(const f in u){const p=u[f],{array:x,itemSize:m}=p;x.copyWithin(e*m,h*m,(h+d)*m),p.addUpdateRange(e*m,d*m),p.needsUpdate=!0}l.vertexStart=e}e+=l.reservedVertexCount,l.start=r.index?l.indexStart:l.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){const r=new ln,a=n.index,o=n.attributes.position;for(let c=i.start,l=i.start+i.count;c<l;c++){let h=c;a&&(h=a.getX(h)),r.expandByPoint(jr.fromBufferAttribute(o,h))}i.boundingBox=r}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){const r=new en;this.getBoundingBoxAt(e,Ro),Ro.getCenter(r.center);const a=n.index,o=n.attributes.position;let c=0;for(let l=i.start,h=i.start+i.count;l<h;l++){let d=l;a&&(d=a.getX(d)),jr.fromBufferAttribute(o,d),c=Math.max(c,r.center.distanceToSquared(jr))}r.radius=Math.sqrt(c),i.boundingSphere=r}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);const n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);const n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){const t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Ch);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);const i=new Int32Array(e),r=new Int32Array(e);xs(this._multiDrawCounts,i),xs(this._multiDrawStarts,r),this._multiDrawCounts=i,this._multiDrawStarts=r,this._maxInstanceCount=e;const a=this._indirectTexture,o=this._matricesTexture,c=this._colorsTexture;a.dispose(),this._initIndirectTexture(),xs(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),xs(o.image.data,this._matricesTexture.image.data),c&&(c.dispose(),this._initColorsTexture(),xs(c.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){const n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(c=>c.indexStart+c.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);const r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new mt,this._initializeGeometry(r));const a=this.geometry;r.index&&xs(r.index.array,a.index.array);for(const o in r.attributes)xs(r.attributes[o].array,a.attributes[o].array)}raycast(e,t){const n=this._instanceInfo,i=this._geometryInfo,r=this.matrixWorld,a=this.geometry;an.material=this.material,an.geometry.index=a.index,an.geometry.attributes=a.attributes,an.geometry.boundingBox===null&&(an.geometry.boundingBox=new ln),an.geometry.boundingSphere===null&&(an.geometry.boundingSphere=new en);for(let o=0,c=n.length;o<c;o++){if(!n[o].visible||!n[o].active)continue;const l=n[o].geometryIndex,h=i[l];an.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(o,an.matrixWorld).premultiply(r),this.getBoundingBoxAt(l,an.geometry.boundingBox),this.getBoundingSphereAt(l,an.geometry.boundingSphere),an.raycast(e,Io);for(let d=0,u=Io.length;d<u;d++){const f=Io[d];f.object=this,f.batchId=o,t.push(f)}Io.length=0}an.material=null,an.geometry.index=null,an.geometry.attributes={},an.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,r){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const a=i.getIndex();let o=a===null?1:a.array.BYTES_PER_ELEMENT,c=1;r.wireframe&&(c=2,o=i.attributes.position.count>65535?4:2);const l=this._instanceInfo,h=this._multiDrawStarts,d=this._multiDrawCounts,u=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,x=p.image.data,m=n.isArrayCamera?m_:p_;f&&(n.isArrayCamera?m.setFromArrayCamera(n):(yn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),m.setFromProjectionMatrix(yn,n.coordinateSystem,n.reversedDepth)));let g=0;if(this.sortObjects){yn.copy(this.matrixWorld).invert(),jr.setFromMatrixPosition(n.matrixWorld).applyMatrix4(yn),cf.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(yn);for(let y=0,w=l.length;y<w;y++)if(l[y].visible&&l[y].active){const S=l[y].geometryIndex;this.getMatrixAt(y,yn),this.getBoundingSphereAt(S,gs).applyMatrix4(yn);let C=!1;if(f&&(C=!m.intersectsSphere(gs)),!C){const _=u[S],E=g_.subVectors(gs.center,jr).dot(cf);Rh.push(_.start,_.count,E,y)}}const v=Rh.list,b=this.customSort;b===null?v.sort(r.transparent?u_:h_):b.call(this,v,n);for(let y=0,w=v.length;y<w;y++){const S=v[y];h[g]=S.start*o*c,d[g]=S.count*c,x[g]=S.index,g++}Rh.reset()}else for(let v=0,b=l.length;v<b;v++)if(l[v].visible&&l[v].active){const y=l[v].geometryIndex;let w=!1;if(f&&(this.getMatrixAt(v,yn),this.getBoundingSphereAt(y,gs).applyMatrix4(yn),w=!m.intersectsSphere(gs)),!w){const S=u[y];h[g]=S.start*o*c,d[g]=S.count*c,x[g]=v,g++}}p.needsUpdate=!0,this._multiDrawCount=g,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,r,a){this.onBeforeRender(e,null,i,r,a)}}class xn extends tn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ol=new I,cl=new I,lf=new dt,Qr=new zr,Po=new en,Ih=new I,hf=new I;class rs extends bt{constructor(e=new mt,t=new xn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ol.fromBufferAttribute(t,i-1),cl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ol.distanceTo(cl);e.setAttribute("lineDistance",new tt(n,1))}else Ve("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Po.copy(n.boundingSphere),Po.applyMatrix4(i),Po.radius+=r,e.ray.intersectsSphere(Po)===!1)return;lf.copy(i).invert(),Qr.copy(e.ray).applyMatrix4(lf);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=f,m=p-1;x<m;x+=l){const g=h.getX(x),v=h.getX(x+1),b=Lo(this,e,Qr,c,g,v,x);b&&t.push(b)}if(this.isLineLoop){const x=h.getX(p-1),m=h.getX(f),g=Lo(this,e,Qr,c,x,m,p-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let x=f,m=p-1;x<m;x+=l){const g=Lo(this,e,Qr,c,x,x+1,x);g&&t.push(g)}if(this.isLineLoop){const x=Lo(this,e,Qr,c,p-1,f,p-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Lo(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(ol.fromBufferAttribute(o,i),cl.fromBufferAttribute(o,r),t.distanceSqToSegment(ol,cl,Ih,hf)>n)return;Ih.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Ih);if(!(l<e.near||l>e.far))return{distance:l,point:hf.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const uf=new I,df=new I;class di extends rs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)uf.fromBufferAttribute(t,i),df.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+uf.distanceTo(df);e.setAttribute("lineDistance",new tt(n,1))}else Ve("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class u0 extends rs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class sd extends tn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ff=new dt,bu=new zr,Do=new en,No=new I;class d0 extends bt{constructor(e=new mt,t=new sd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Do.copy(n.boundingSphere),Do.applyMatrix4(i),Do.radius+=r,e.ray.intersectsSphere(Do)===!1)return;ff.copy(i).invert(),bu.copy(e.ray).applyMatrix4(ff);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=u,x=f;p<x;p++){const m=l.getX(p);No.fromBufferAttribute(d,m),pf(No,m,c,i,e,t,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,x=f;p<x;p++)No.fromBufferAttribute(d,p),pf(No,p,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pf(s,e,t,n,i,r,a){const o=bu.distanceSqToPoint(s);if(o<t){const c=new I;bu.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class f0 extends Ot{constructor(e,t,n,i,r=It,a=It,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function d(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=e.requestVideoFrameCallback(d)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(d))}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class __ extends f0{constructor(e,t,n,i,r,a,o,c){super({},e,t,n,i,r,a,o,c),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(e){this.image=e,this.needsUpdate=!0}}class y_ extends Ot{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Wt,this.minFilter=Wt,this.generateMipmaps=!1,this.needsUpdate=!0}}class Fl extends Ot{constructor(e,t,n,i,r,a,o,c,l,h,d,u){super(null,a,o,c,l,h,i,r,d,u),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class v_ extends Fl{constructor(e,t,n,i,r,a){super(e,t,n,r,a),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=on,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class M_ extends Fl{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,li),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class ja extends Ot{constructor(e=[],t=li,n,i,r,a,o,c,l,h){super(e,t,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class b_ extends Ot{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class S_ extends Ot{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;const h=e?e.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){const e=this.image?this.image.parentNode:null;e!==null&&"onpaint"in e&&(e.onpaint=null),super.dispose()}}class ks extends Ot{constructor(e,t,n=Bn,i,r,a,o=Wt,c=Wt,l,h=ui,d=1){if(h!==ui&&h!==Ki)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ji(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class p0 extends ks{constructor(e,t=Bn,n=li,i,r,a=Wt,o=Wt,c,l=ui){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class rd extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class os extends mt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new tt(l,3)),this.setAttribute("normal",new tt(h,3)),this.setAttribute("uv",new tt(d,2));function p(x,m,g,v,b,y,w,S,C,_,E){const A=y/C,P=w/_,D=y/2,H=w/2,W=S/2,B=C+1,$=_+1;let X=0,he=0;const ie=new I;for(let ae=0;ae<$;ae++){const Y=ae*P-H;for(let O=0;O<B;O++){const U=O*A-D;ie[x]=U*v,ie[m]=Y*b,ie[g]=W,l.push(ie.x,ie.y,ie.z),ie[x]=0,ie[m]=0,ie[g]=S>0?1:-1,h.push(ie.x,ie.y,ie.z),d.push(O/C),d.push(1-ae/_),X+=1}}for(let ae=0;ae<_;ae++)for(let Y=0;Y<C;Y++){const O=u+Y+B*ae,U=u+Y+B*(ae+1),J=u+(Y+1)+B*(ae+1),ne=u+(Y+1)+B*ae;c.push(O,U,ne),c.push(U,J,ne),he+=6}o.addGroup(f,he,E),f+=he,u+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new os(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ol extends mt{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,p=n*2+r,x=i+1,m=new I,g=new I;for(let v=0;v<=p;v++){let b=0,y=0,w=0,S=0;if(v<=n){const E=v/n,A=E*Math.PI/2;y=-h-e*Math.cos(A),w=e*Math.sin(A),S=-e*Math.cos(A),b=E*d}else if(v<=n+r){const E=(v-n)/r;y=-h+E*t,w=e,S=0,b=d+E*u}else{const E=(v-n-r)/n,A=E*Math.PI/2;y=h+e*Math.sin(A),w=e*Math.cos(A),S=e*Math.sin(A),b=d+u+E*d}const C=Math.max(0,Math.min(1,b/f));let _=0;v===0?_=.5/i:v===p&&(_=-.5/i);for(let E=0;E<=i;E++){const A=E/i,P=A*Math.PI*2,D=Math.sin(P),H=Math.cos(P);g.x=-w*H,g.y=y,g.z=w*D,o.push(g.x,g.y,g.z),m.set(-w*H,S,w*D),m.normalize(),c.push(m.x,m.y,m.z),l.push(A+_,C)}if(v>0){const E=(v-1)*x;for(let A=0;A<i;A++){const P=E+A,D=E+A+1,H=v*x+A,W=v*x+A+1;a.push(P,D,H),a.push(D,W,H)}}}this.setIndex(a),this.setAttribute("position",new tt(o,3)),this.setAttribute("normal",new tt(c,3)),this.setAttribute("uv",new tt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ol(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class Bl extends mt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new I,h=new Ie;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new tt(a,3)),this.setAttribute("normal",new tt(o,3)),this.setAttribute("uv",new tt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bl(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Qa extends mt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const x=[],m=n/2;let g=0;v(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new tt(d,3)),this.setAttribute("normal",new tt(u,3)),this.setAttribute("uv",new tt(f,2));function v(){const y=new I,w=new I;let S=0;const C=(t-e)/n;for(let _=0;_<=r;_++){const E=[],A=_/r,P=A*(t-e)+e;for(let D=0;D<=i;D++){const H=D/i,W=H*c+o,B=Math.sin(W),$=Math.cos(W);w.x=P*B,w.y=-A*n+m,w.z=P*$,d.push(w.x,w.y,w.z),y.set(B,C,$).normalize(),u.push(y.x,y.y,y.z),f.push(H,1-A),E.push(p++)}x.push(E)}for(let _=0;_<i;_++)for(let E=0;E<r;E++){const A=x[E][_],P=x[E+1][_],D=x[E+1][_+1],H=x[E][_+1];(e>0||E!==0)&&(h.push(A,P,H),S+=3),(t>0||E!==r-1)&&(h.push(P,D,H),S+=3)}l.addGroup(g,S,0),g+=S}function b(y){const w=p,S=new Ie,C=new I;let _=0;const E=y===!0?e:t,A=y===!0?1:-1;for(let D=1;D<=i;D++)d.push(0,m*A,0),u.push(0,A,0),f.push(.5,.5),p++;const P=p;for(let D=0;D<=i;D++){const W=D/i*c+o,B=Math.cos(W),$=Math.sin(W);C.x=E*$,C.y=m*A,C.z=E*B,d.push(C.x,C.y,C.z),u.push(0,A,0),S.x=B*.5+.5,S.y=$*.5*A+.5,f.push(S.x,S.y),p++}for(let D=0;D<i;D++){const H=w+D,W=P+D;y===!0?h.push(W,W+1,H):h.push(W+1,W,H),_+=3}l.addGroup(g,_,y===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qa(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class eo extends Qa{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new eo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class cs extends mt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new tt(r,3)),this.setAttribute("normal",new tt(r.slice(),3)),this.setAttribute("uv",new tt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const b=new I,y=new I,w=new I;for(let S=0;S<t.length;S+=3)f(t[S+0],b),f(t[S+1],y),f(t[S+2],w),c(b,y,w,v)}function c(v,b,y,w){const S=w+1,C=[];for(let _=0;_<=S;_++){C[_]=[];const E=v.clone().lerp(y,_/S),A=b.clone().lerp(y,_/S),P=S-_;for(let D=0;D<=P;D++)D===0&&_===S?C[_][D]=E:C[_][D]=E.clone().lerp(A,D/P)}for(let _=0;_<S;_++)for(let E=0;E<2*(S-_)-1;E++){const A=Math.floor(E/2);E%2===0?(u(C[_][A+1]),u(C[_+1][A]),u(C[_][A])):(u(C[_][A+1]),u(C[_+1][A+1]),u(C[_+1][A]))}}function l(v){const b=new I;for(let y=0;y<r.length;y+=3)b.x=r[y+0],b.y=r[y+1],b.z=r[y+2],b.normalize().multiplyScalar(v),r[y+0]=b.x,r[y+1]=b.y,r[y+2]=b.z}function h(){const v=new I;for(let b=0;b<r.length;b+=3){v.x=r[b+0],v.y=r[b+1],v.z=r[b+2];const y=m(v)/2/Math.PI+.5,w=g(v)/Math.PI+.5;a.push(y,1-w)}p(),d()}function d(){for(let v=0;v<a.length;v+=6){const b=a[v+0],y=a[v+2],w=a[v+4],S=Math.max(b,y,w),C=Math.min(b,y,w);S>.9&&C<.1&&(b<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),w<.2&&(a[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function f(v,b){const y=v*3;b.x=e[y+0],b.y=e[y+1],b.z=e[y+2]}function p(){const v=new I,b=new I,y=new I,w=new I,S=new Ie,C=new Ie,_=new Ie;for(let E=0,A=0;E<r.length;E+=9,A+=6){v.set(r[E+0],r[E+1],r[E+2]),b.set(r[E+3],r[E+4],r[E+5]),y.set(r[E+6],r[E+7],r[E+8]),S.set(a[A+0],a[A+1]),C.set(a[A+2],a[A+3]),_.set(a[A+4],a[A+5]),w.copy(v).add(b).add(y).divideScalar(3);const P=m(w);x(S,A+0,v,P),x(C,A+2,b,P),x(_,A+4,y,P)}}function x(v,b,y,w){w<0&&v.x===1&&(a[b]=v.x-1),y.x===0&&y.z===0&&(a[b]=w/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function g(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cs(e.vertices,e.indices,e.radius,e.detail)}}class zl extends cs{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new zl(e.radius,e.detail)}}const Uo=new I,Fo=new I,Ph=new I,Oo=new bn;class m0 extends mt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(Us*t),a=e.getIndex(),o=e.getAttribute("position"),c=a?a.count:o.count,l=[0,0,0],h=["a","b","c"],d=new Array(3),u={},f=[];for(let p=0;p<c;p+=3){a?(l[0]=a.getX(p),l[1]=a.getX(p+1),l[2]=a.getX(p+2)):(l[0]=p,l[1]=p+1,l[2]=p+2);const{a:x,b:m,c:g}=Oo;if(x.fromBufferAttribute(o,l[0]),m.fromBufferAttribute(o,l[1]),g.fromBufferAttribute(o,l[2]),Oo.getNormal(Ph),d[0]=`${Math.round(x.x*i)},${Math.round(x.y*i)},${Math.round(x.z*i)}`,d[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,d[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let v=0;v<3;v++){const b=(v+1)%3,y=d[v],w=d[b],S=Oo[h[v]],C=Oo[h[b]],_=`${y}_${w}`,E=`${w}_${y}`;E in u&&u[E]?(Ph.dot(u[E].normal)<=r&&(f.push(S.x,S.y,S.z),f.push(C.x,C.y,C.z)),u[E]=null):_ in u||(u[_]={index0:l[v],index1:l[b],normal:Ph.clone()})}}for(const p in u)if(u[p]){const{index0:x,index1:m}=u[p];Uo.fromBufferAttribute(o,x),Fo.fromBufferAttribute(o,m),f.push(Uo.x,Uo.y,Uo.z),f.push(Fo.x,Fo.y,Fo.z)}this.setAttribute("position",new tt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class jn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ve("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);const h=n[i],u=n[i+1]-h,f=(a-h)/u;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),c=t||(a.isVector2?new Ie:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new I,i=[],r=[],a=[],o=new I,c=new dt;for(let f=0;f<=e;f++){const p=f/e;i[f]=this.getTangentAt(p,new I)}r[0]=new I,a[0]=new I;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(ut(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(ut(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(c.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class kl extends jn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ie){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class g0 extends kl{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ad(){let s=0,e=0,t=0,n=0;function i(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,d){let u=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+d)+(c-o)/d;u*=h,f*=h,i(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const mf=new I,gf=new I,Lh=new ad,Dh=new ad,Nh=new ad;class x0 extends jn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new I){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(gf.subVectors(i[0],i[1]).add(i[0]),l=gf);const d=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(mf.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=mf),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(l.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),Lh.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,p,x,m),Dh.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,p,x,m),Nh.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,p,x,m)}else this.curveType==="catmullrom"&&(Lh.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),Dh.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Nh.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(Lh.calc(c),Dh.calc(c),Nh.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new I().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function xf(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,c=s*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*s+t}function w_(s,e){const t=1-s;return t*t*e}function A_(s,e){return 2*(1-s)*s*e}function T_(s,e){return s*s*e}function Ca(s,e,t,n){return w_(s,e)+A_(s,t)+T_(s,n)}function E_(s,e){const t=1-s;return t*t*t*e}function C_(s,e){const t=1-s;return 3*t*t*s*e}function R_(s,e){return 3*(1-s)*s*s*e}function I_(s,e){return s*s*s*e}function Ra(s,e,t,n,i){return E_(s,e)+C_(s,t)+R_(s,n)+I_(s,i)}class od extends jn{constructor(e=new Ie,t=new Ie,n=new Ie,i=new Ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new Ie){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ra(e,i.x,r.x,a.x,o.x),Ra(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class _0 extends jn{constructor(e=new I,t=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ra(e,i.x,r.x,a.x,o.x),Ra(e,i.y,r.y,a.y,o.y),Ra(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class cd extends jn{constructor(e=new Ie,t=new Ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ie){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class y0 extends jn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ld extends jn{constructor(e=new Ie,t=new Ie,n=new Ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ie){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Ca(e,i.x,r.x,a.x),Ca(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hd extends jn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Ca(e,i.x,r.x,a.x),Ca(e,i.y,r.y,a.y),Ca(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ud extends jn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ie){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(xf(o,c.x,l.x,h.x,d.x),xf(o,c.y,l.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new Ie().fromArray(i))}return this}}var ll=Object.freeze({__proto__:null,ArcCurve:g0,CatmullRomCurve3:x0,CubicBezierCurve:od,CubicBezierCurve3:_0,EllipseCurve:kl,LineCurve:cd,LineCurve3:y0,QuadraticBezierCurve:ld,QuadraticBezierCurve3:hd,SplineCurve:ud});class v0 extends jn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ll[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new ll[i.type]().fromJSON(i))}return this}}class Ha extends v0{constructor(e){super(),this.type="Path",this.currentPoint=new Ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new cd(this.currentPoint.clone(),new Ie(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new ld(this.currentPoint.clone(),new Ie(e,t),new Ie(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new od(this.currentPoint.clone(),new Ie(e,t),new Ie(n,i),new Ie(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new ud(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,r,a,o,c),this}absellipse(e,t,n,i,r,a,o,c){const l=new kl(e,t,n,i,r,a,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class to extends Ha{constructor(e){super(e),this.uuid=Pn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Ha().fromJSON(i))}return this}}function P_(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=M0(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=F_(s,e,r,t)),s.length>80*t){o=s[0],c=s[1];let h=o,d=c;for(let u=t;u<i;u+=t){const f=s[u],p=s[u+1];f<o&&(o=f),p<c&&(c=p),f>h&&(h=f),p>d&&(d=p)}l=Math.max(h-o,d-c),l=l!==0?32767/l:0}return Wa(r,a,t,o,c,l,0),a}function M0(s,e,t,n,i){let r;if(i===Y_(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=_f(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=_f(a/n|0,s[a],s[a+1],r);return r&&Ur(r,r.next)&&(qa(r),r=r.next),r}function Vs(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Ur(t,t.next)||Ft(t.prev,t,t.next)===0)){if(qa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Wa(s,e,t,n,i,r,a){if(!s)return;!a&&r&&V_(s,n,i,r);let o=s;for(;s.prev!==s.next;){const c=s.prev,l=s.next;if(r?D_(s,n,i,r):L_(s)){e.push(c.i,s.i,l.i),qa(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=N_(Vs(s),e),Wa(s,e,t,n,i,r,2)):a===2&&U_(s,e,t,n,i,r):Wa(Vs(s),e,t,n,i,r,1);break}}}function L_(s){const e=s.prev,t=s,n=s.next;if(Ft(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(i,r,a),d=Math.min(o,c,l),u=Math.max(i,r,a),f=Math.max(o,c,l);let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&ma(i,o,r,c,a,l,p.x,p.y)&&Ft(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function D_(s,e,t,n){const i=s.prev,r=s,a=s.next;if(Ft(i,r,a)>=0)return!1;const o=i.x,c=r.x,l=a.x,h=i.y,d=r.y,u=a.y,f=Math.min(o,c,l),p=Math.min(h,d,u),x=Math.max(o,c,l),m=Math.max(h,d,u),g=Su(f,p,e,t,n),v=Su(x,m,e,t,n);let b=s.prevZ,y=s.nextZ;for(;b&&b.z>=g&&y&&y.z<=v;){if(b.x>=f&&b.x<=x&&b.y>=p&&b.y<=m&&b!==i&&b!==a&&ma(o,h,c,d,l,u,b.x,b.y)&&Ft(b.prev,b,b.next)>=0||(b=b.prevZ,y.x>=f&&y.x<=x&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&ma(o,h,c,d,l,u,y.x,y.y)&&Ft(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;b&&b.z>=g;){if(b.x>=f&&b.x<=x&&b.y>=p&&b.y<=m&&b!==i&&b!==a&&ma(o,h,c,d,l,u,b.x,b.y)&&Ft(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=x&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&ma(o,h,c,d,l,u,y.x,y.y)&&Ft(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function N_(s,e){let t=s;do{const n=t.prev,i=t.next.next;!Ur(n,i)&&S0(n,t,t.next,i)&&Xa(n,i)&&Xa(i,n)&&(e.push(n.i,t.i,i.i),qa(t),qa(t.next),t=s=i),t=t.next}while(t!==s);return Vs(t)}function U_(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&W_(a,o)){let c=w0(a,o);a=Vs(a,a.next),c=Vs(c,c.next),Wa(a,e,t,n,i,r,0),Wa(c,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function F_(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:s.length,l=M0(s,o,c,n,!1);l===l.next&&(l.steiner=!0),i.push(H_(l))}i.sort(O_);for(let r=0;r<i.length;r++)t=B_(i[r],t);return t}function O_(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function B_(s,e){const t=z_(s,e);if(!t)return e;const n=w0(t,s);return Vs(n,n.next),Vs(t,t.next)}function z_(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(Ur(s,t))return t;do{if(Ur(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&b0(i<l?n:r,i,c,l,i<l?r:n,i,t.x,t.y)){const d=Math.abs(i-t.y)/(n-t.x);Xa(t,s)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&k_(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function k_(s,e){return Ft(s.prev,s,e.prev)<0&&Ft(e.next,s,s.next)<0}function V_(s,e,t,n){let i=s;do i.z===0&&(i.z=Su(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,G_(i)}function G_(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function Su(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function H_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function b0(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function ma(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&b0(s,e,t,n,i,r,a,o)}function W_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!X_(s,e)&&(Xa(s,e)&&Xa(e,s)&&q_(s,e)&&(Ft(s.prev,s,e.prev)||Ft(s,e.prev,e))||Ur(s,e)&&Ft(s.prev,s,s.next)>0&&Ft(e.prev,e,e.next)>0)}function Ft(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Ur(s,e){return s.x===e.x&&s.y===e.y}function S0(s,e,t,n){const i=zo(Ft(s,e,t)),r=zo(Ft(s,e,n)),a=zo(Ft(t,n,s)),o=zo(Ft(t,n,e));return!!(i!==r&&a!==o||i===0&&Bo(s,t,e)||r===0&&Bo(s,n,e)||a===0&&Bo(t,s,n)||o===0&&Bo(t,e,n))}function Bo(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function zo(s){return s>0?1:s<0?-1:0}function X_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&S0(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Xa(s,e){return Ft(s.prev,s,s.next)<0?Ft(s,e,s.next)>=0&&Ft(s,s.prev,e)>=0:Ft(s,e,s.prev)<0||Ft(s,s.next,e)<0}function q_(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function w0(s,e){const t=wu(s.i,s.x,s.y),n=wu(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function _f(s,e,t,n){const i=wu(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function qa(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function wu(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Y_(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class $_{static triangulate(e,t,n=2){return P_(e,t,n)}}class Zn{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Zn.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];yf(e),vf(n,e);let a=e.length;t.forEach(yf);for(let c=0;c<t.length;c++)i.push(a),a+=t[c].length,vf(n,t[c]);const o=$_.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function yf(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function vf(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Vl extends mt{constructor(e=new to([new Ie(.5,.5),new Ie(-.5,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new tt(i,3)),this.setAttribute("uv",new tt(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const g=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:Z_;let b,y=!1,w,S,C,_;if(g){b=g.getSpacedPoints(h),y=!0,u=!1;const F=g.isCatmullRomCurve3?g.closed:!1;w=g.computeFrenetFrames(h,F),S=new I,C=new I,_=new I}u||(m=0,f=0,p=0,x=0);const E=o.extractPoints(l);let A=E.shape;const P=E.holes;if(!Zn.isClockWise(A)){A=A.reverse();for(let F=0,N=P.length;F<N;F++){const G=P[F];Zn.isClockWise(G)&&(P[F]=G.reverse())}}function H(F){const G=10000000000000001e-36;let k=F[0];for(let q=1;q<=F.length;q++){const de=q%F.length,oe=F[de],Me=oe.x-k.x,we=oe.y-k.y,L=Me*Me+we*we,Ke=Math.max(Math.abs(oe.x),Math.abs(oe.y),Math.abs(k.x),Math.abs(k.y)),qe=G*Ke*Ke;if(L<=qe){F.splice(de,1),q--;continue}k=oe}}H(A),P.forEach(H);const W=P.length,B=A;for(let F=0;F<W;F++){const N=P[F];A=A.concat(N)}function $(F,N,G){return N||at("ExtrudeGeometry: vec does not exist"),F.clone().addScaledVector(N,G)}const X=A.length;function he(F,N,G){let k,q,de;const oe=F.x-N.x,Me=F.y-N.y,we=G.x-F.x,L=G.y-F.y,Ke=oe*oe+Me*Me,qe=oe*L-Me*we;if(Math.abs(qe)>Number.EPSILON){const R=Math.sqrt(Ke),M=Math.sqrt(we*we+L*L),K=N.x-Me/R,te=N.y+oe/R,ce=G.x-L/M,Re=G.y+we/M,Ce=((ce-K)*L-(Re-te)*we)/(oe*L-Me*we);k=K+oe*Ce-F.x,q=te+Me*Ce-F.y;const ge=k*k+q*q;if(ge<=2)return new Ie(k,q);de=Math.sqrt(ge/2)}else{let R=!1;oe>Number.EPSILON?we>Number.EPSILON&&(R=!0):oe<-Number.EPSILON?we<-Number.EPSILON&&(R=!0):Math.sign(Me)===Math.sign(L)&&(R=!0),R?(k=-Me,q=oe,de=Math.sqrt(Ke)):(k=oe,q=Me,de=Math.sqrt(Ke/2))}return new Ie(k/de,q/de)}const ie=[];for(let F=0,N=B.length,G=N-1,k=F+1;F<N;F++,G++,k++)G===N&&(G=0),k===N&&(k=0),ie[F]=he(B[F],B[G],B[k]);const ae=[];let Y,O=ie.concat();for(let F=0,N=W;F<N;F++){const G=P[F];Y=[];for(let k=0,q=G.length,de=q-1,oe=k+1;k<q;k++,de++,oe++)de===q&&(de=0),oe===q&&(oe=0),Y[k]=he(G[k],G[de],G[oe]);ae.push(Y),O=O.concat(Y)}let U;if(m===0)U=Zn.triangulateShape(B,P);else{const F=[],N=[];for(let G=0;G<m;G++){const k=G/m,q=f*Math.cos(k*Math.PI/2),de=p*Math.sin(k*Math.PI/2)+x;for(let oe=0,Me=B.length;oe<Me;oe++){const we=$(B[oe],ie[oe],de);_e(we.x,we.y,-q),k===0&&F.push(we)}for(let oe=0,Me=W;oe<Me;oe++){const we=P[oe];Y=ae[oe];const L=[];for(let Ke=0,qe=we.length;Ke<qe;Ke++){const R=$(we[Ke],Y[Ke],de);_e(R.x,R.y,-q),k===0&&L.push(R)}k===0&&N.push(L)}}U=Zn.triangulateShape(F,N)}const J=U.length,ne=p+x;for(let F=0;F<X;F++){const N=u?$(A[F],O[F],ne):A[F];y?(C.copy(w.normals[0]).multiplyScalar(N.x),S.copy(w.binormals[0]).multiplyScalar(N.y),_.copy(b[0]).add(C).add(S),_e(_.x,_.y,_.z)):_e(N.x,N.y,0)}for(let F=1;F<=h;F++)for(let N=0;N<X;N++){const G=u?$(A[N],O[N],ne):A[N];y?(C.copy(w.normals[F]).multiplyScalar(G.x),S.copy(w.binormals[F]).multiplyScalar(G.y),_.copy(b[F]).add(C).add(S),_e(_.x,_.y,_.z)):_e(G.x,G.y,d/h*F)}for(let F=m-1;F>=0;F--){const N=F/m,G=f*Math.cos(N*Math.PI/2),k=p*Math.sin(N*Math.PI/2)+x;for(let q=0,de=B.length;q<de;q++){const oe=$(B[q],ie[q],k);_e(oe.x,oe.y,d+G)}for(let q=0,de=P.length;q<de;q++){const oe=P[q];Y=ae[q];for(let Me=0,we=oe.length;Me<we;Me++){const L=$(oe[Me],Y[Me],k);y?_e(L.x,L.y+b[h-1].y,b[h-1].x+G):_e(L.x,L.y,d+G)}}}V(),re();function V(){const F=i.length/3;if(u){let N=0,G=X*N;for(let k=0;k<J;k++){const q=U[k];Ae(q[2]+G,q[1]+G,q[0]+G)}N=h+m*2,G=X*N;for(let k=0;k<J;k++){const q=U[k];Ae(q[0]+G,q[1]+G,q[2]+G)}}else{for(let N=0;N<J;N++){const G=U[N];Ae(G[2],G[1],G[0])}for(let N=0;N<J;N++){const G=U[N];Ae(G[0]+X*h,G[1]+X*h,G[2]+X*h)}}n.addGroup(F,i.length/3-F,0)}function re(){const F=i.length/3;let N=0;se(B,N),N+=B.length;for(let G=0,k=P.length;G<k;G++){const q=P[G];se(q,N),N+=q.length}n.addGroup(F,i.length/3-F,1)}function se(F,N){let G=F.length;for(;--G>=0;){const k=G;let q=G-1;q<0&&(q=F.length-1);for(let de=0,oe=h+m*2;de<oe;de++){const Me=X*de,we=X*(de+1),L=N+k+Me,Ke=N+q+Me,qe=N+q+we,R=N+k+we;Pe(L,Ke,qe,R)}}}function _e(F,N,G){c.push(F),c.push(N),c.push(G)}function Ae(F,N,G){Ue(F),Ue(N),Ue(G);const k=i.length/3,q=v.generateTopUV(n,i,k-3,k-2,k-1);Fe(q[0]),Fe(q[1]),Fe(q[2])}function Pe(F,N,G,k){Ue(F),Ue(N),Ue(k),Ue(N),Ue(G),Ue(k);const q=i.length/3,de=v.generateSideWallUV(n,i,q-6,q-3,q-2,q-1);Fe(de[0]),Fe(de[1]),Fe(de[3]),Fe(de[1]),Fe(de[2]),Fe(de[3])}function Ue(F){i.push(c[F*3+0]),i.push(c[F*3+1]),i.push(c[F*3+2])}function Fe(F){r.push(F.x),r.push(F.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return J_(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new ll[i.type]().fromJSON(i)),new Vl(n,e.options)}}const Z_={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[i*3],h=e[i*3+1];return[new Ie(r,a),new Ie(o,c),new Ie(l,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],d=e[n*3+2],u=e[i*3],f=e[i*3+1],p=e[i*3+2],x=e[r*3],m=e[r*3+1],g=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new Ie(a,1-c),new Ie(l,1-d),new Ie(u,1-p),new Ie(x,1-g)]:[new Ie(o,1-c),new Ie(h,1-d),new Ie(f,1-p),new Ie(m,1-g)]}};function J_(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gl extends cs{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Gl(e.radius,e.detail)}}class Hl extends mt{constructor(e=[new Ie(0,-.5),new Ie(.5,0),new Ie(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=ut(i,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/t,d=new I,u=new Ie,f=new I,p=new I,x=new I;let m=0,g=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:m=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,f.x=g*1,f.y=-m,f.z=g*0,x.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(x.x,x.y,x.z);break;default:m=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,f.x=g*1,f.y=-m,f.z=g*0,p.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),c.push(f.x,f.y,f.z),x.copy(p)}for(let v=0;v<=t;v++){const b=n+v*h*i,y=Math.sin(b),w=Math.cos(b);for(let S=0;S<=e.length-1;S++){d.x=e[S].x*y,d.y=e[S].y,d.z=e[S].x*w,a.push(d.x,d.y,d.z),u.x=v/t,u.y=S/(e.length-1),o.push(u.x,u.y);const C=c[3*S+0]*y,_=c[3*S+1],E=c[3*S+0]*w;l.push(C,_,E)}}for(let v=0;v<t;v++)for(let b=0;b<e.length-1;b++){const y=b+v*e.length,w=y,S=y+e.length,C=y+e.length+1,_=y+1;r.push(w,S,_),r.push(C,_,S)}this.setIndex(r),this.setAttribute("position",new tt(a,3)),this.setAttribute("uv",new tt(o,2)),this.setAttribute("normal",new tt(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hl(e.points,e.segments,e.phiStart,e.phiLength)}}class no extends cs{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new no(e.radius,e.detail)}}class Hs extends mt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,d=e/o,u=t/c,f=[],p=[],x=[],m=[];for(let g=0;g<h;g++){const v=g*u-a;for(let b=0;b<l;b++){const y=b*d-r;p.push(y,-v,0),x.push(0,0,1),m.push(b/o),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let v=0;v<o;v++){const b=v+l*g,y=v+l*(g+1),w=v+1+l*(g+1),S=v+1+l*g;f.push(b,y,S),f.push(y,w,S)}this.setIndex(f),this.setAttribute("position",new tt(p,3)),this.setAttribute("normal",new tt(x,3)),this.setAttribute("uv",new tt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hs(e.width,e.height,e.widthSegments,e.heightSegments)}}class Wl extends mt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/i,f=new I,p=new Ie;for(let x=0;x<=i;x++){for(let m=0;m<=n;m++){const g=r+m/n*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,h.push(p.x,p.y)}d+=u}for(let x=0;x<i;x++){const m=x*(n+1);for(let g=0;g<n;g++){const v=g+m,b=v,y=v+n+1,w=v+n+2,S=v+1;o.push(b,y,S),o.push(y,w,S)}}this.setIndex(o),this.setAttribute("position",new tt(c,3)),this.setAttribute("normal",new tt(l,3)),this.setAttribute("uv",new tt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Xl extends mt{constructor(e=new to([new Ie(0,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new tt(i,3)),this.setAttribute("normal",new tt(r,3)),this.setAttribute("uv",new tt(a,2));function l(h){const d=i.length/3,u=h.extractPoints(t);let f=u.shape;const p=u.holes;Zn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const v=p[m];Zn.isClockWise(v)===!0&&(p[m]=v.reverse())}const x=Zn.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const v=p[m];f=f.concat(v)}for(let m=0,g=f.length;m<g;m++){const v=f[m];i.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let m=0,g=x.length;m<g;m++){const v=x[m],b=v[0]+d,y=v[1]+d,w=v[2]+d;n.push(b,y,w),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return K_(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new Xl(n,e.curveSegments)}}function K_(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Gs extends mt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new I,u=new I,f=[],p=[],x=[],m=[];for(let g=0;g<=n;g++){const v=[],b=g/n,y=a+b*o,w=e*Math.cos(y),S=Math.sqrt(e*e-w*w);let C=0;g===0&&a===0?C=.5/t:g===n&&c===Math.PI&&(C=-.5/t);for(let _=0;_<=t;_++){const E=_/t,A=i+E*r;d.x=-S*Math.cos(A),d.y=w,d.z=S*Math.sin(A),p.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),m.push(E+C,1-b),v.push(l++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<t;v++){const b=h[g][v+1],y=h[g][v],w=h[g+1][v],S=h[g+1][v+1];(g!==0||a>0)&&f.push(b,y,S),(g!==n-1||c<Math.PI)&&f.push(y,w,S)}this.setIndex(f),this.setAttribute("position",new tt(p,3)),this.setAttribute("normal",new tt(x,3)),this.setAttribute("uv",new tt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ql extends cs{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ql(e.radius,e.detail)}}class Yl extends mt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const c=[],l=[],h=[],d=[],u=new I,f=new I,p=new I;for(let x=0;x<=n;x++){const m=a+x/n*o;for(let g=0;g<=i;g++){const v=g/i*r;f.x=(e+t*Math.cos(m))*Math.cos(v),f.y=(e+t*Math.cos(m))*Math.sin(v),f.z=t*Math.sin(m),l.push(f.x,f.y,f.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(g/i),d.push(x/n)}}for(let x=1;x<=n;x++)for(let m=1;m<=i;m++){const g=(i+1)*x+m-1,v=(i+1)*(x-1)+m-1,b=(i+1)*(x-1)+m,y=(i+1)*x+m;c.push(g,v,y),c.push(v,b,y)}this.setIndex(c),this.setAttribute("position",new tt(l,3)),this.setAttribute("normal",new tt(h,3)),this.setAttribute("uv",new tt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yl(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class $l extends mt{constructor(e=1,t=.4,n=64,i=8,r=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:r,q:a},n=Math.floor(n),i=Math.floor(i);const o=[],c=[],l=[],h=[],d=new I,u=new I,f=new I,p=new I,x=new I,m=new I,g=new I;for(let b=0;b<=n;++b){const y=b/n*r*Math.PI*2;v(y,r,a,e,f),v(y+.01,r,a,e,p),m.subVectors(p,f),g.addVectors(p,f),x.crossVectors(m,g),g.crossVectors(x,m),x.normalize(),g.normalize();for(let w=0;w<=i;++w){const S=w/i*Math.PI*2,C=-t*Math.cos(S),_=t*Math.sin(S);d.x=f.x+(C*g.x+_*x.x),d.y=f.y+(C*g.y+_*x.y),d.z=f.z+(C*g.z+_*x.z),c.push(d.x,d.y,d.z),u.subVectors(d,f).normalize(),l.push(u.x,u.y,u.z),h.push(b/n),h.push(w/i)}}for(let b=1;b<=n;b++)for(let y=1;y<=i;y++){const w=(i+1)*(b-1)+(y-1),S=(i+1)*b+(y-1),C=(i+1)*b+y,_=(i+1)*(b-1)+y;o.push(w,S,_),o.push(S,C,_)}this.setIndex(o),this.setAttribute("position",new tt(c,3)),this.setAttribute("normal",new tt(l,3)),this.setAttribute("uv",new tt(h,2));function v(b,y,w,S,C){const _=Math.cos(b),E=Math.sin(b),A=w/y*b,P=Math.cos(A);C.x=S*(2+P)*.5*_,C.y=S*(2+P)*E*.5,C.z=S*Math.sin(A)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $l(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Zl extends mt{constructor(e=new hd(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new I,c=new I,l=new Ie;let h=new I;const d=[],u=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new tt(d,3)),this.setAttribute("normal",new tt(u,3)),this.setAttribute("uv",new tt(f,2));function x(){for(let b=0;b<t;b++)m(b);m(r===!1?t:0),v(),g()}function m(b){h=e.getPointAt(b/t,h);const y=a.normals[b],w=a.binormals[b];for(let S=0;S<=i;S++){const C=S/i*Math.PI*2,_=Math.sin(C),E=-Math.cos(C);c.x=E*y.x+_*w.x,c.y=E*y.y+_*w.y,c.z=E*y.z+_*w.z,c.normalize(),u.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,d.push(o.x,o.y,o.z)}}function g(){for(let b=1;b<=t;b++)for(let y=1;y<=i;y++){const w=(i+1)*(b-1)+(y-1),S=(i+1)*b+(y-1),C=(i+1)*b+y,_=(i+1)*(b-1)+y;p.push(w,S,_),p.push(S,C,_)}}function v(){for(let b=0;b<=t;b++)for(let y=0;y<=i;y++)l.x=b/t,l.y=y/i,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Zl(new ll[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class A0 extends mt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new I,r=new I;if(e.index!==null){const a=e.attributes.position,o=e.index;let c=e.groups;c.length===0&&(c=[{start:0,count:o.count,materialIndex:0}]);for(let l=0,h=c.length;l<h;++l){const d=c[l],u=d.start,f=d.count;for(let p=u,x=u+f;p<x;p+=3)for(let m=0;m<3;m++){const g=o.getX(p+m),v=o.getX(p+(m+1)%3);i.fromBufferAttribute(a,g),r.fromBufferAttribute(a,v),Mf(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}}else{const a=e.attributes.position;for(let o=0,c=a.count/3;o<c;o++)for(let l=0;l<3;l++){const h=3*o+l,d=3*o+(l+1)%3;i.fromBufferAttribute(a,h),r.fromBufferAttribute(a,d),Mf(i,r,n)===!0&&(t.push(i.x,i.y,i.z),t.push(r.x,r.y,r.z))}}this.setAttribute("position",new tt(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function Mf(s,e,t){const n=`${s.x},${s.y},${s.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${s.x},${s.y},${s.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var bf=Object.freeze({__proto__:null,BoxGeometry:os,CapsuleGeometry:Ol,CircleGeometry:Bl,ConeGeometry:eo,CylinderGeometry:Qa,DodecahedronGeometry:zl,EdgesGeometry:m0,ExtrudeGeometry:Vl,IcosahedronGeometry:Gl,LatheGeometry:Hl,OctahedronGeometry:no,PlaneGeometry:Hs,PolyhedronGeometry:cs,RingGeometry:Wl,ShapeGeometry:Xl,SphereGeometry:Gs,TetrahedronGeometry:ql,TorusGeometry:Yl,TorusKnotGeometry:$l,TubeGeometry:Zl,WireframeGeometry:A0});class T0 extends tn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ke(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}function Fr(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Sf(i))i.isRenderTargetTexture?(Ve("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Sf(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function dn(s){const e={};for(let t=0;t<s.length;t++){const n=Fr(s[t]);for(const i in n)e[i]=n[i]}return e}function Sf(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function j_(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function E0(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:yt.workingColorSpace}const C0={clone:Fr,merge:dn};var Q_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ey=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kn extends tn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Q_,this.fragmentShader=ey,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fr(e.uniforms),this.uniformsGroups=j_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new ke().setHex(i.value);break;case"v2":this.uniforms[n].value=new Ie().fromArray(i.value);break;case"v3":this.uniforms[n].value=new I().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ct().fromArray(i.value);break;case"m3":this.uniforms[n].value=new pt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new dt().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class dd extends kn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Jl extends tn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ri,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class R0 extends Jl{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ie(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ut(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class I0 extends tn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new ke(16777215),this.specular=new ke(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ri,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Za,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class P0 extends tn{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ke(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ri,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class L0 extends tn{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ri,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class hl extends tn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ri,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Za,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class fd extends tn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ym,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pd extends tn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class D0 extends tn{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new ke(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ri,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this.fog=e.fog,this}}class N0 extends xn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function Ds(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function U0(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Au(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let c=0;c!==e;++c)i[a++]=s[o+c]}return i}function F0(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}function ty(s,e,t,n,i=30){const r=s.clone();r.name=e;const a=[];for(let c=0;c<r.tracks.length;++c){const l=r.tracks[c],h=l.getValueSize(),d=[],u=[];for(let f=0;f<l.times.length;++f){const p=l.times[f]*i;if(!(p<t||p>=n)){d.push(l.times[f]);for(let x=0;x<h;++x)u.push(l.values[f*h+x])}}d.length!==0&&(l.times=Ds(d,l.times.constructor),l.values=Ds(u,l.values.constructor),a.push(l))}r.tracks=a;let o=1/0;for(let c=0;c<r.tracks.length;++c)o>r.tracks[c].times[0]&&(o=r.tracks[c].times[0]);for(let c=0;c<r.tracks.length;++c)r.tracks[c].shift(-1*o);return r.resetDuration(),r}function ny(s,e=0,t=s,n=30){n<=0&&(n=30);const i=t.tracks.length,r=e/n;for(let a=0;a<i;++a){const o=t.tracks[a],c=o.ValueTypeName;if(c==="bool"||c==="string")continue;const l=s.tracks.find(function(g){return g.name===o.name&&g.ValueTypeName===c});if(l===void 0)continue;let h=0;const d=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=d/3);let u=0;const f=l.getValueSize();l.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=f/3);const p=o.times.length-1;let x;if(r<=o.times[0]){const g=h,v=d-h;x=o.values.slice(g,v)}else if(r>=o.times[p]){const g=p*d+h,v=g+d-h;x=o.values.slice(g,v)}else{const g=o.createInterpolant(),v=h,b=d-h;g.evaluate(r),x=g.resultBuffer.slice(v,b)}c==="quaternion"&&new Xt().fromArray(x).normalize().conjugate().toArray(x);const m=l.times.length;for(let g=0;g<m;++g){const v=g*f+u;if(c==="quaternion")Xt.multiplyQuaternionsFlat(l.values,v,x,0,l.values,v);else{const b=f-u*2;for(let y=0;y<b;++y)l.values[v+y]-=x[y]}}}return s.blendMode=Ku,s}class iy{static convertArray(e,t){return Ds(e,t)}static isTypedArray(e){return t0(e)}static getKeyframeOrder(e){return U0(e)}static sortedArray(e,t,n){return Au(e,t,n)}static flattenJSON(e,t,n,i){F0(e,t,n,i)}static subclip(e,t,n,i,r=30){return ty(e,t,n,i,r)}static makeClipAdditive(e,t=0,n=e,i=30){return ny(e,t,n,i)}}class kr{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class O0 extends kr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ps,endingEnd:Ps}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ls:r=e,o=2*t-n;break;case Fa:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ls:a=e,c=2*n-t;break;case Fa:a=1,c=n+i[1]-i[0];break;default:a=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),x=p*p,m=x*p,g=-u*m+2*u*x-u*p,v=(1+u)*m+(-1.5-2*u)*x+(-.5+u)*p+1,b=(-1-f)*m+(1.5+f)*x+.5*p,y=f*m-f*x;for(let w=0;w!==o;++w)r[w]=g*a[h+w]+v*a[l+w]+b*a[c+w]+y*a[d+w];return r}}class md extends kr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(i-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[l+u]*d+a[c+u]*h;return r}}class B0 extends kr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class z0 extends kr{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const p=(n-t)/(i-t),x=1-p;for(let m=0;m!==o;++m)r[m]=a[l+m]*x+a[c+m]*p;return r}const u=o*2,f=e-1;for(let p=0;p!==o;++p){const x=a[l+p],m=a[c+p],g=f*u+p*2,v=d[g],b=d[g+1],y=e*u+p*2,w=h[y],S=h[y+1];let C=(n-t)/(i-t),_,E,A,P,D;for(let H=0;H<8;H++){_=C*C,E=_*C,A=1-C,P=A*A,D=P*A;const B=D*t+3*P*C*v+3*A*_*w+E*i-n;if(Math.abs(B)<1e-10)break;const $=3*P*(v-t)+6*A*C*(w-v)+3*_*(i-w);if(Math.abs($)<1e-10)break;C=C-B/$,C=Math.max(0,Math.min(1,C))}r[p]=D*x+3*P*C*b+3*A*_*S+E*m}return r}}class Vn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ds(t,this.TimeBufferType),this.values=Ds(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ds(e.times,Array),values:Ds(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new B0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new md(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new O0(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new z0(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ua:t=this.InterpolantFactoryMethodDiscrete;break;case rl:t=this.InterpolantFactoryMethodLinear;break;case xc:t=this.InterpolantFactoryMethodSmooth;break;case yu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ve("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ua;case this.InterpolantFactoryMethodLinear:return rl;case this.InterpolantFactoryMethodSmooth:return xc;case this.InterpolantFactoryMethodBezier:return yu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(at("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(at("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){at("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){at("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(i!==void 0&&t0(i))for(let o=0,c=i.length;o!==c;++o){const l=i[o];if(isNaN(l)){at("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===xc,r=e.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(i)c=!0;else{const d=o*n,u=d-n,f=d+n;for(let p=0;p!==n;++p){const x=t[d+p];if(x!==t[u+p]||x!==t[f+p]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const d=o*n,u=a*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Vn.prototype.ValueTypeName="";Vn.prototype.TimeBufferType=Float32Array;Vn.prototype.ValueBufferType=Float32Array;Vn.prototype.DefaultInterpolation=rl;class Ws extends Vn{constructor(e,t,n){super(e,t,n)}}Ws.prototype.ValueTypeName="bool";Ws.prototype.ValueBufferType=Array;Ws.prototype.DefaultInterpolation=Ua;Ws.prototype.InterpolantFactoryMethodLinear=void 0;Ws.prototype.InterpolantFactoryMethodSmooth=void 0;class gd extends Vn{constructor(e,t,n,i){super(e,t,n,i)}}gd.prototype.ValueTypeName="color";class Kl extends Vn{constructor(e,t,n,i){super(e,t,n,i)}}Kl.prototype.ValueTypeName="number";class k0 extends kr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(i-t);let l=e*o;for(let h=l+o;l!==h;l+=4)Xt.slerpFlat(r,0,a,l-o,a,l,c);return r}}class jl extends Vn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new k0(this.times,this.values,this.getValueSize(),e)}}jl.prototype.ValueTypeName="quaternion";jl.prototype.InterpolantFactoryMethodSmooth=void 0;class Xs extends Vn{constructor(e,t,n){super(e,t,n)}}Xs.prototype.ValueTypeName="string";Xs.prototype.ValueBufferType=Array;Xs.prototype.DefaultInterpolation=Ua;Xs.prototype.InterpolantFactoryMethodLinear=void 0;Xs.prototype.InterpolantFactoryMethodSmooth=void 0;class xd extends Vn{constructor(e,t,n,i){super(e,t,n,i)}}xd.prototype.ValueTypeName="vector";class Ya{constructor(e="",t=-1,n=[],i=Tl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Pn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(ry(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Vn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const h=U0(c);c=Au(c,1,h),l=Au(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new Kl(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(r);if(h&&h.length>1){const d=h[1];let u=i[d];u||(i[d]=u=[]),u.push(l)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function sy(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Kl;case"vector":case"vector2":case"vector3":case"vector4":return xd;case"color":return gd;case"quaternion":return jl;case"bool":case"boolean":return Ws;case"string":return Xs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function ry(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=sy(s.type);if(s.times===void 0){const t=[],n=[];F0(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const ai={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(wf(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!wf(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function wf(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class _d{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const f=l[d],p=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const V0=new _d;class wn{constructor(e){this.manager=e!==void 0?e:V0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}wn.DEFAULT_MATERIAL_NAME="__DEFAULT";const bi={};class ay extends Error{constructor(e,t){super(e),this.response=t}}class Ii extends wn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ai.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(bi[e]!==void 0){bi[e].push({onLoad:t,onProgress:n,onError:i});return}bi[e]=[],bi[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ve("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=bi[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=u?parseInt(u):0,p=f!==0;let x=0;const m=new ReadableStream({start(g){v();function v(){d.read().then(({done:b,value:y})=>{if(b)g.close();else{x+=y.byteLength;const w=new ProgressEvent("progress",{lengthComputable:p,loaded:x,total:f});for(let S=0,C=h.length;S<C;S++){const _=h[S];_.onProgress&&_.onProgress(w)}g.enqueue(y),v()}},b=>{g.error(b)})}}});return new Response(m)}else throw new ay(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return l.arrayBuffer().then(p=>f.decode(p))}}}).then(l=>{ai.add(`file:${e}`,l);const h=bi[e];delete bi[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=bi[e];if(h===void 0)throw this.manager.itemError(e),l;delete bi[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class oy extends wn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Ii(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){try{t(r.parse(JSON.parse(o)))}catch(c){i?i(c):at(c),r.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=Ya.parse(e[n]);t.push(i)}return t}}class cy extends wn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=[],o=new Fl,c=new Ii(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(r.withCredentials);let l=0;function h(d){c.load(e[d],function(u){const f=r.parse(u,!0);a[d]={width:f.width,height:f.height,format:f.format,mipmaps:f.mipmaps},l+=1,l===6&&(f.mipmapCount===1&&(o.minFilter=It),o.image=a,o.format=f.format,o.needsUpdate=!0,t&&t(o))},n,i)}if(Array.isArray(e))for(let d=0,u=e.length;d<u;++d)h(d);else c.load(e,function(d){const u=r.parse(d,!0);if(u.isCubemap){const f=u.mipmaps.length/u.mipmapCount;for(let p=0;p<f;p++){a[p]={mipmaps:[]};for(let x=0;x<u.mipmapCount;x++)a[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+x]),a[p].format=u.format,a[p].width=u.width,a[p].height=u.height}o.image=a}else o.image.width=u.width,o.image.height=u.height,o.mipmaps=u.mipmaps;u.mipmapCount===1&&(o.minFilter=It),o.format=u.format,o.needsUpdate=!0,t&&t(o)},n,i);return o}}const cr=new WeakMap;class $a extends wn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ai.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=cr.get(a);d===void 0&&(d=[],cr.set(a,d)),d.push({onLoad:t,onError:i})}return a}const o=ka("img");function c(){h(),t&&t(this);const d=cr.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}cr.delete(this),r.manager.itemEnd(e)}function l(d){h(),i&&i(d),ai.remove(`image:${e}`);const u=cr.get(this)||[];for(let f=0;f<u.length;f++){const p=u[f];p.onError&&p.onError(d)}cr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ai.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class ly extends wn{constructor(e){super(e)}load(e,t,n,i){const r=new ja;r.colorSpace=fn;const a=new $a(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function c(l){a.load(e[l],function(h){r.images[l]=h,o++,o===6&&(r.needsUpdate=!0,t&&t(r))},void 0,i)}for(let l=0;l<e.length;++l)c(l);return r}}class hy extends wn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Dn,o=new Ii(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(c){let l;try{l=r.parse(c)}catch(h){i!==void 0?i(h):at(h);return}r._applyTexData(a,l),t&&t(a,l)},n,i),a}createDataTexture(e){const t=new Dn;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:on,e.wrapT=t.wrapT!==void 0?t.wrapT:on,e.magFilter=t.magFilter!==void 0?t.magFilter:It,e.minFilter=t.minFilter!==void 0?t.minFilter:It,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=si),t.mipmapCount===1&&(e.minFilter=It),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}}class uy extends wn{constructor(e){super(e)}load(e,t,n,i){const r=new Ot,a=new $a(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class ls extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ul extends ls{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Uh=new dt,Af=new I,Tf=new I;class yd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.mapType=Mn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zs,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Af.setFromMatrixPosition(e.matrixWorld),t.position.copy(Af),Tf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Tf),t.updateMatrixWorld(),Uh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uh,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Os||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Uh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ko=new I,Vo=new Xt,Qn=new I;class Ql extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=In,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ko,Vo,Qn),Qn.x===1&&Qn.y===1&&Qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ko,Vo,Qn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ko,Vo,Qn),Qn.x===1&&Qn.y===1&&Qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ko,Vo,Qn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ki=new I,Ef=new Ie,Cf=new Ie;class $t extends Ql{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Dr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Dr*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,t){return this.getViewBounds(e,Ef,Cf),t.subVectors(Cf,Ef)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Us*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class dy extends yd{constructor(){super(new $t(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Dr*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class G0 extends ls{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new dy}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class fy extends yd{constructor(){super(new $t(90,1,.5,500)),this.isPointLightShadow=!0}}class H0 extends ls{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new fy}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class io extends Ql{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class py extends yd{constructor(){super(new io(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class dl extends ls{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new py}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class W0 extends ls{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class X0 extends ls{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class vd{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new I)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,r=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*i),t.addScaledVector(a[2],.488603*r),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],1.092548*(n*i)),t.addScaledVector(a[5],1.092548*(i*r)),t.addScaledVector(a[6],.315392*(3*r*r-1)),t.addScaledVector(a[7],1.092548*(n*r)),t.addScaledVector(a[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,r=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*i),t.addScaledVector(a[2],2*.511664*r),t.addScaledVector(a[3],2*.511664*n),t.addScaledVector(a[4],2*.429043*n*i),t.addScaledVector(a[5],2*.429043*i*r),t.addScaledVector(a[6],.743125*r*r-.247708),t.addScaledVector(a[7],2*.429043*n*r),t.addScaledVector(a[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,r=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*r,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*r,t[6]=.315392*(3*r*r-1),t[7]=1.092548*n*r,t[8]=.546274*(n*n-i*i)}}class q0 extends ls{constructor(e=new vd,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}const Rf={};class eh extends wn{constructor(e){super(e),this.textures={}}load(e,t,n,i){const r=this,a=new Ii(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(o){try{t(r.parse(JSON.parse(o)))}catch(c){i?i(c):at(c),r.manager.itemError(e)}},n,i)}parse(e){const t=this.createMaterialFromType(e.type);return t.fromJSON(e,this.textures),t}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return eh.createMaterialFromType(e)}static createMaterialFromType(e){const n={ShadowMaterial:T0,SpriteMaterial:Ga,RawShaderMaterial:dd,ShaderMaterial:kn,PointsMaterial:sd,MeshPhysicalMaterial:R0,MeshStandardMaterial:Jl,MeshPhongMaterial:I0,MeshToonMaterial:P0,MeshNormalMaterial:L0,MeshLambertMaterial:hl,MeshDepthMaterial:fd,MeshDistanceMaterial:pd,MeshBasicMaterial:as,MeshMatcapMaterial:D0,LineDashedMaterial:N0,LineBasicMaterial:xn,Material:tn,...Rf}[e];let i;return n===void 0?(ts(`MaterialLoader: Unknown material type "${e}". Use .registerMaterial() before starting the deserialization process.`),i=new tn):i=new n,i}static registerMaterial(e,t){Rf[e]=t}}class Tu{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Y0 extends mt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class $0 extends wn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Ii(r.manager);a.setPath(r.path),a.setRequestHeader(r.requestHeader),a.setWithCredentials(r.withCredentials),a.load(e,function(o){try{t(r.parse(JSON.parse(o)))}catch(c){i?i(c):at(c),r.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(f,p){if(t[p]!==void 0)return t[p];const m=f.interleavedBuffers[p],g=r(f,m.buffer),v=Cr(m.type,g),b=new Dl(v,m.stride);return b.uuid=m.uuid,t[p]=b,b}function r(f,p){if(n[p]!==void 0)return n[p];const m=f.arrayBuffers[p],g=new Uint32Array(m).buffer;return n[p]=g,g}const a=e.isInstancedBufferGeometry?new Y0:new mt,o=e.data.index;if(o!==void 0){const f=Cr(o.type,o.array);a.setIndex(new At(f,1))}const c=e.data.attributes;for(const f in c){const p=c[f];let x;if(p.isInterleavedBufferAttribute){const m=i(e.data,p.data);x=new Bs(m,p.itemSize,p.offset,p.normalized)}else{const m=Cr(p.type,p.array),g=p.isInstancedBufferAttribute?Nr:At;x=new g(m,p.itemSize,p.normalized)}p.name!==void 0&&(x.name=p.name),p.usage!==void 0&&x.setUsage(p.usage),a.setAttribute(f,x)}const l=e.data.morphAttributes;if(l)for(const f in l){const p=l[f],x=[];for(let m=0,g=p.length;m<g;m++){const v=p[m];let b;if(v.isInterleavedBufferAttribute){const y=i(e.data,v.data);b=new Bs(y,v.itemSize,v.offset,v.normalized)}else{const y=Cr(v.type,v.array);b=new At(y,v.itemSize,v.normalized)}v.name!==void 0&&(b.name=v.name),x.push(b)}a.morphAttributes[f]=x}e.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);const d=e.data.groups||e.data.drawcalls||e.data.offsets;if(d!==void 0)for(let f=0,p=d.length;f!==p;++f){const x=d[f];a.addGroup(x.start,x.count,x.materialIndex)}const u=e.data.boundingSphere;return u!==void 0&&(a.boundingSphere=new en().fromJSON(u)),e.name&&(a.name=e.name),e.userData&&(a.userData=e.userData),a}}const Fh={};class my extends wn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=this.path===""?Tu.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||a;const o=new Ii(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(c){let l=null;try{l=JSON.parse(c)}catch(d){i!==void 0&&i(d),at("ObjectLoader: Can't parse "+e+".",d.message);return}const h=l.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),at("ObjectLoader: Can't load "+e);return}r.parse(l,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?Tu.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const r=new Ii(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials);const a=await r.loadAsync(e,t);let o;try{o=JSON.parse(a)}catch(l){throw new Error("THREE.ObjectLoader: Can't parse "+e+". "+l.message)}const c=o.metadata;if(c===void 0||c.type===void 0||c.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(o)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),a=this.parseImages(e.images,function(){t!==void 0&&t(l)}),o=this.parseTextures(e.textures,a),c=this.parseMaterials(e.materials,o),l=this.parseObject(e.object,r,c,o,n),h=this.parseSkeletons(e.skeletons,l);if(this.bindSkeletons(l,h),this.bindLightTargets(l),t!==void 0){let d=!1;for(const u in a)if(a[u].data instanceof HTMLImageElement){d=!0;break}d===!1&&t(l)}return l}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),r=await this.parseImagesAsync(e.images),a=this.parseTextures(e.textures,r),o=this.parseMaterials(e.materials,a),c=this.parseObject(e.object,i,o,a,t),l=this.parseSkeletons(e.skeletons,c);return this.bindSkeletons(c,l),this.bindLightTargets(c),c}static registerGeometry(e,t){Fh[e]=t}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const r=new to().fromJSON(e[n]);t[r.uuid]=r}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(r){r.isBone&&(i[r.uuid]=r)}),e!==void 0)for(let r=0,a=e.length;r<a;r++){const o=new Nl().fromJSON(e[r],i);n[o.uuid]=o}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new $0;for(let r=0,a=e.length;r<a;r++){let o;const c=e[r];switch(c.type){case"BufferGeometry":case"InstancedBufferGeometry":o=i.parse(c);break;default:c.type in bf?o=bf[c.type].fromJSON(c,t):c.type in Fh?o=Fh[c.type].fromJSON(c,t):Ve(`ObjectLoader: Unknown geometry type "${c.type}". Use .registerGeometry() before starting the deserialization process.`)}o.uuid=c.uuid,c.name!==void 0&&(o.name=c.name),c.userData!==void 0&&(o.userData=c.userData),n[c.uuid]=o}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const r=new eh;r.setTextures(t);for(let a=0,o=e.length;a<o;a++){const c=e[a];n[c.uuid]===void 0&&(n[c.uuid]=r.parse(c)),i[c.uuid]=n[c.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],r=Ya.parse(i);t[r.uuid]=r}return t}parseImages(e,t){const n=this,i={};let r;function a(c){return c=n.manager.resolveURL(c),n.manager.itemStart(c),r.load(c,function(){n.manager.itemEnd(c)},void 0,function(){n.manager.itemError(c),n.manager.itemEnd(c)})}function o(c){if(typeof c=="string"){const l=c,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(l)?l:n.resourcePath+l;return a(h)}else return c.data?{data:Cr(c.type,c.data),width:c.width,height:c.height}:null}if(e!==void 0&&e.length>0){const c=new _d(t);r=new $a(c),r.setCrossOrigin(this.crossOrigin);for(let l=0,h=e.length;l<h;l++){const d=e[l],u=d.url;if(Array.isArray(u)){const f=[];for(let p=0,x=u.length;p<x;p++){const m=u[p],g=o(m);g!==null&&(g instanceof HTMLImageElement?f.push(g):f.push(new Dn(g.data,g.width,g.height)))}i[d.uuid]=new ji(f)}else{const f=o(d.url);i[d.uuid]=new ji(f)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function r(a){if(typeof a=="string"){const o=a,c=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:t.resourcePath+o;return await i.loadAsync(c)}else return a.data?{data:Cr(a.type,a.data),width:a.width,height:a.height}:null}if(e!==void 0&&e.length>0){i=new $a(this.manager),i.setCrossOrigin(this.crossOrigin);for(let a=0,o=e.length;a<o;a++){const c=e[a],l=c.url;if(Array.isArray(l)){const h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d],p=await r(f);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Dn(p.data,p.width,p.height)))}n[c.uuid]=new ji(h)}else{const h=await r(c.url);n[c.uuid]=new ji(h)}}}return n}parseTextures(e,t){function n(r,a){return typeof r=="number"?r:(Ve("ObjectLoader.parseTexture: Constant should be in numeric form.",r),a[r])}const i={};if(e!==void 0)for(let r=0,a=e.length;r<a;r++){const o=e[r];o.image===void 0&&Ve('ObjectLoader: No "image" specified for',o.uuid),t[o.image]===void 0&&Ve("ObjectLoader: Undefined image",o.image);const c=t[o.image],l=c.data;let h;Array.isArray(l)?(h=new ja,l.length===6&&(h.needsUpdate=!0)):(l&&l.data?h=new Dn:h=new Ot,l&&(h.needsUpdate=!0)),h.source=c,h.uuid=o.uuid,o.name!==void 0&&(h.name=o.name),o.mapping!==void 0&&(h.mapping=n(o.mapping,gy)),o.channel!==void 0&&(h.channel=o.channel),o.offset!==void 0&&h.offset.fromArray(o.offset),o.repeat!==void 0&&h.repeat.fromArray(o.repeat),o.center!==void 0&&h.center.fromArray(o.center),o.rotation!==void 0&&(h.rotation=o.rotation),o.wrap!==void 0&&(h.wrapS=n(o.wrap[0],If),h.wrapT=n(o.wrap[1],If)),o.format!==void 0&&(h.format=o.format),o.internalFormat!==void 0&&(h.internalFormat=o.internalFormat),o.type!==void 0&&(h.type=o.type),o.colorSpace!==void 0&&(h.colorSpace=o.colorSpace),o.minFilter!==void 0&&(h.minFilter=n(o.minFilter,Pf)),o.magFilter!==void 0&&(h.magFilter=n(o.magFilter,Pf)),o.anisotropy!==void 0&&(h.anisotropy=o.anisotropy),o.flipY!==void 0&&(h.flipY=o.flipY),o.generateMipmaps!==void 0&&(h.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(h.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(h.compareFunction=o.compareFunction),o.normalized!==void 0&&(h.normalized=o.normalized),o.userData!==void 0&&(h.userData=o.userData),i[o.uuid]=h}return i}parseObject(e,t,n,i,r){let a;function o(u){return t[u]===void 0&&Ve("ObjectLoader: Undefined geometry",u),t[u]}function c(u){if(u!==void 0){if(Array.isArray(u)){const f=[];for(let p=0,x=u.length;p<x;p++){const m=u[p];n[m]===void 0&&Ve("ObjectLoader: Undefined material",m),f.push(n[m])}return f}return n[u]===void 0&&Ve("ObjectLoader: Undefined material",u),n[u]}}function l(u){return i[u]===void 0&&Ve("ObjectLoader: Undefined texture",u),i[u]}let h,d;switch(e.type){case"Scene":a=new ed,e.background!==void 0&&(Number.isInteger(e.background)?a.background=new ke(e.background):a.background=l(e.background)),e.environment!==void 0&&(a.environment=l(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?a.fog=new Ka(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(a.fog=new Ll(e.fog.color,e.fog.density)),e.fog.name!==""&&(a.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(a.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(a.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&a.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":a=new $t(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(a.focus=e.focus),e.zoom!==void 0&&(a.zoom=e.zoom),e.filmGauge!==void 0&&(a.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(a.filmOffset=e.filmOffset),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"OrthographicCamera":a=new io(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(a.zoom=e.zoom),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"AmbientLight":a=new W0(e.color,e.intensity);break;case"DirectionalLight":a=new dl(e.color,e.intensity),a.target=e.target||"";break;case"PointLight":a=new H0(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":a=new X0(e.color,e.intensity,e.width,e.height);break;case"SpotLight":a=new G0(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),a.target=e.target||"";break;case"HemisphereLight":a=new ul(e.color,e.groundColor,e.intensity);break;case"LightProbe":const u=new vd().fromArray(e.sh);a=new q0(u,e.intensity);break;case"SkinnedMesh":h=o(e.geometry),d=c(e.material),a=new c0(h,d),e.bindMode!==void 0&&(a.bindMode=e.bindMode),e.bindMatrix!==void 0&&a.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(a.skeleton=e.skeleton);break;case"Mesh":h=o(e.geometry),d=c(e.material),a=new Bt(h,d);break;case"InstancedMesh":h=o(e.geometry),d=c(e.material);const f=e.count,p=e.instanceMatrix,x=e.instanceColor;a=new l0(h,d,f),a.instanceMatrix=new Nr(new Float32Array(p.array),16),x!==void 0&&(a.instanceColor=new Nr(new Float32Array(x.array),x.itemSize));break;case"BatchedMesh":h=o(e.geometry),d=c(e.material),a=new h0(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,d),a.geometry=h,a.perObjectFrustumCulled=e.perObjectFrustumCulled,a.sortObjects=e.sortObjects,a._drawRanges=e.drawRanges,a._reservedRanges=e.reservedRanges,a._geometryInfo=e.geometryInfo.map(m=>{let g=null,v=null;return m.boundingBox!==void 0&&(g=new ln().fromJSON(m.boundingBox)),m.boundingSphere!==void 0&&(v=new en().fromJSON(m.boundingSphere)),{...m,boundingBox:g,boundingSphere:v}}),a._instanceInfo=e.instanceInfo,a._availableInstanceIds=e._availableInstanceIds,a._availableGeometryIds=e._availableGeometryIds,a._nextIndexStart=e.nextIndexStart,a._nextVertexStart=e.nextVertexStart,a._geometryCount=e.geometryCount,a._maxInstanceCount=e.maxInstanceCount,a._maxVertexCount=e.maxVertexCount,a._maxIndexCount=e.maxIndexCount,a._geometryInitialized=e.geometryInitialized,a._matricesTexture=l(e.matricesTexture.uuid),a._indirectTexture=l(e.indirectTexture.uuid),e.colorsTexture!==void 0&&(a._colorsTexture=l(e.colorsTexture.uuid)),e.boundingSphere!==void 0&&(a.boundingSphere=new en().fromJSON(e.boundingSphere)),e.boundingBox!==void 0&&(a.boundingBox=new ln().fromJSON(e.boundingBox));break;case"LOD":a=new o0;break;case"Line":a=new rs(o(e.geometry),c(e.material));break;case"LineLoop":a=new u0(o(e.geometry),c(e.material));break;case"LineSegments":a=new di(o(e.geometry),c(e.material));break;case"PointCloud":case"Points":a=new d0(o(e.geometry),c(e.material));break;case"Sprite":a=new al(c(e.material));break;case"Group":a=new ri;break;case"Bone":a=new id;break;default:a=new bt}if(a.uuid=e.uuid,e.name!==void 0&&(a.name=e.name),e.matrix!==void 0?(a.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=e.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(e.position!==void 0&&a.position.fromArray(e.position),e.rotation!==void 0&&a.rotation.fromArray(e.rotation),e.quaternion!==void 0&&a.quaternion.fromArray(e.quaternion),e.scale!==void 0&&a.scale.fromArray(e.scale)),e.up!==void 0&&a.up.fromArray(e.up),e.pivot!==void 0&&(a.pivot=new I().fromArray(e.pivot)),e.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),e.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=e.morphTargetInfluences.slice()),e.castShadow!==void 0&&(a.castShadow=e.castShadow),e.receiveShadow!==void 0&&(a.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(a.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(a.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(a.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(a.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(a.visible=e.visible),e.frustumCulled!==void 0&&(a.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(a.renderOrder=e.renderOrder),e.static!==void 0&&(a.static=e.static),e.userData!==void 0&&(a.userData=e.userData),e.layers!==void 0&&(a.layers.mask=e.layers),e.children!==void 0){const u=e.children;for(let f=0;f<u.length;f++)a.add(this.parseObject(u[f],t,n,i,r))}if(e.animations!==void 0){const u=e.animations;for(let f=0;f<u.length;f++){const p=u[f];a.animations.push(r[p])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(a.autoUpdate=e.autoUpdate);const u=e.levels;for(let f=0;f<u.length;f++){const p=u[f],x=a.getObjectByProperty("uuid",p.object);x!==void 0&&a.addLevel(x,p.distance,p.hysteresis)}}return a}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?Ve("ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new bt}})}}const gy={UVMapping:yl,CubeReflectionMapping:li,CubeRefractionMapping:ns,EquirectangularReflectionMapping:va,EquirectangularRefractionMapping:Ma,CubeUVReflectionMapping:Br},If={RepeatWrapping:Pa,ClampToEdgeWrapping:on,MirroredRepeatWrapping:La},Pf={NearestFilter:Wt,NearestMipmapNearestFilter:Wu,NearestMipmapLinearFilter:Er,LinearFilter:It,LinearMipmapNearestFilter:ba,LinearMipmapLinearFilter:si},Oh=new WeakMap;class xy extends wn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ve("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ve("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ai.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{Oh.has(a)===!0?(i&&i(Oh.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){ai.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e)}).catch(function(l){i&&i(l),Oh.set(c,l),ai.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ai.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let Go;class Md{static getContext(){return Go===void 0&&(Go=new(window.AudioContext||window.webkitAudioContext)),Go}static setContext(e){Go=e}}class _y extends wn{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Ii(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(c){try{const l=c.slice(0),h=Md.getContext(),d=e+"#decode";r.manager.itemStart(d),h.decodeAudioData(l,function(u){t(u),r.manager.itemEnd(d)}).catch(function(u){o(u),r.manager.itemEnd(d)})}catch(l){o(l)}},n,i);function o(c){i?i(c):at(c),r.manager.itemError(e)}}}const Lf=new dt,Df=new dt,_s=new dt;class yy{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new $t,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new $t,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,_s.copy(e.projectionMatrix);const i=t.eyeSep/2,r=i*t.near/t.focus,a=t.near*Math.tan(Us*t.fov*.5)/t.zoom;let o,c;Df.elements[12]=-i,Lf.elements[12]=i,o=-a*t.aspect+r,c=a*t.aspect+r,_s.elements[0]=2*t.near/(c-o),_s.elements[8]=(c+o)/(c-o),this.cameraL.projectionMatrix.copy(_s),o=-a*t.aspect-r,c=a*t.aspect-r,_s.elements[0]=2*t.near/(c-o),_s.elements[8]=(c+o)/(c-o),this.cameraR.projectionMatrix.copy(_s)}this.cameraL.matrix.copy(e.matrixWorld).multiply(Df),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(e.matrixWorld).multiply(Lf),this.cameraR.matrixWorldNeedsUpdate=!0}}const lr=-90,hr=1;class Z0 extends bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new $t(lr,hr,e,t);i.layers=this.layers,this.add(i);const r=new $t(lr,hr,e,t);r.layers=this.layers,this.add(r);const a=new $t(lr,hr,e,t);a.layers=this.layers,this.add(a);const o=new $t(lr,hr,e,t);o.layers=this.layers,this.add(o);const c=new $t(lr,hr,e,t);c.layers=this.layers,this.add(c);const l=new $t(lr,hr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===In)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Os)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class J0 extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class K0{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=vy.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function vy(){this._document.hidden===!1&&this.reset()}const ys=new I,Bh=new Xt,My=new I,vs=new I,Ms=new I;class by extends bt{constructor(){super(),this.type="AudioListener",this.context=Md.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new K0}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e),this._timer.update();const t=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(ys,Bh,My),vs.set(0,0,-1).applyQuaternion(Bh),Ms.set(0,1,0).applyQuaternion(Bh),t.positionX){const n=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(ys.x,n),t.positionY.linearRampToValueAtTime(ys.y,n),t.positionZ.linearRampToValueAtTime(ys.z,n),t.forwardX.linearRampToValueAtTime(vs.x,n),t.forwardY.linearRampToValueAtTime(vs.y,n),t.forwardZ.linearRampToValueAtTime(vs.z,n),t.upX.linearRampToValueAtTime(Ms.x,n),t.upY.linearRampToValueAtTime(Ms.y,n),t.upZ.linearRampToValueAtTime(Ms.z,n)}else t.setPosition(ys.x,ys.y,ys.z),t.setOrientation(vs.x,vs.y,vs.z,Ms.x,Ms.y,Ms.z)}}class j0 extends bt{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){Ve("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){Ve("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){Ve("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){Ve("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){Ve("Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(Ve("Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){Ve("Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,t){return super.copy(e,t),e.sourceType!=="buffer"?(Ve("Audio: Audio source type cannot be copied."),this):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice(),this)}clone(e){return new this.constructor(this.listener).copy(this,e)}}const bs=new I,Nf=new Xt,Sy=new I,Ss=new I;class wy extends j0{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(bs,Nf,Sy),Ss.set(0,0,1).applyQuaternion(Nf);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(bs.x,n),t.positionY.linearRampToValueAtTime(bs.y,n),t.positionZ.linearRampToValueAtTime(bs.z,n),t.orientationX.linearRampToValueAtTime(Ss.x,n),t.orientationY.linearRampToValueAtTime(Ss.y,n),t.orientationZ.linearRampToValueAtTime(Ss.z,n)}else t.setPosition(bs.x,bs.y,bs.z),t.setOrientation(Ss.x,Ss.y,Ss.z)}}class Ay{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class Q0{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const c=t*this._origIndex;this._mixBufferRegion(n,i,c,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let c=t,l=t+t;c!==l;++c)if(n[c]!==n[c+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Xt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const a=this._workIndex*r;Xt.multiplyQuaternionsFlat(e,a,e,t,e,n),Xt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const c=t+o;e[c]=e[c]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const bd="\\[\\]\\.:\\/",Ty=new RegExp("["+bd+"]","g"),Sd="[^"+bd+"]",Ey="[^"+bd.replace("\\.","")+"]",Cy=/((?:WC+[\/:])*)/.source.replace("WC",Sd),Ry=/(WCOD+)?/.source.replace("WCOD",Ey),Iy=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sd),Py=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sd),Ly=new RegExp("^"+Cy+Ry+Iy+Py+"$"),Dy=["material","materials","bones","map"];class Ny{constructor(e,t,n){const i=n||Mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Mt{constructor(e,t,n){this.path=t,this.parsedPath=n||Mt.parseTrackName(t),this.node=Mt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Mt.Composite(e,t,n):new Mt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ty,"")}static parseTrackName(e){const t=Ly.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Dy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=Mt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ve("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){at("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){at("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){at("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){at("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){at("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){at("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){at("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[i];if(a===void 0){const l=t.nodeName;at("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){at("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){at("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Mt.Composite=Ny;Mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Mt.prototype.GetterByBindingType=[Mt.prototype._getValue_direct,Mt.prototype._getValue_array,Mt.prototype._getValue_arrayElement,Mt.prototype._getValue_toArray];Mt.prototype.SetterByBindingTypeAndVersioning=[[Mt.prototype._setValue_direct,Mt.prototype._setValue_direct_setNeedsUpdate,Mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_array,Mt.prototype._setValue_array_setNeedsUpdate,Mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_arrayElement,Mt.prototype._setValue_arrayElement_setNeedsUpdate,Mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_fromArray,Mt.prototype._setValue_fromArray_setNeedsUpdate,Mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Uy{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Pn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,r=this._bindings,a=r.length;let o,c=e.length,l=this.nCachedObjects_;for(let h=0,d=arguments.length;h!==d;++h){const u=arguments[h],f=u.uuid;let p=t[f];if(p===void 0){p=c++,t[f]=p,e.push(u);for(let x=0,m=a;x!==m;++x)r[x].push(new Mt(u,n[x],i[x]))}else if(p<l){o=e[p];const x=--l,m=e[x];t[m.uuid]=p,e[p]=m,t[f]=x,e[x]=u;for(let g=0,v=a;g!==v;++g){const b=r[g],y=b[x];let w=b[p];b[p]=y,w===void 0&&(w=new Mt(u,n[g],i[g])),b[x]=w}}else e[p]!==o&&at("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=l}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){const c=arguments[a],l=c.uuid,h=t[l];if(h!==void 0&&h>=r){const d=r++,u=e[d];t[u.uuid]=h,e[h]=u,t[l]=d,e[d]=c;for(let f=0,p=i;f!==p;++f){const x=n[f],m=x[d],g=x[h];x[h]=m,x[d]=g}}}this.nCachedObjects_=r}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let r=this.nCachedObjects_,a=e.length;for(let o=0,c=arguments.length;o!==c;++o){const l=arguments[o],h=l.uuid,d=t[h];if(d!==void 0)if(delete t[h],d<r){const u=--r,f=e[u],p=--a,x=e[p];t[f.uuid]=d,e[d]=f,t[x.uuid]=u,e[u]=x,e.pop();for(let m=0,g=i;m!==g;++m){const v=n[m],b=v[u],y=v[p];v[d]=b,v[u]=y,v.pop()}}else{const u=--a,f=e[u];u>0&&(t[f.uuid]=d),e[d]=f,e.pop();for(let p=0,x=i;p!==x;++p){const m=n[p];m[d]=m[u],m.pop()}}}this.nCachedObjects_=r}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const r=this._bindings;if(i!==void 0)return r[i];const a=this._paths,o=this._parsedPaths,c=this._objects,l=c.length,h=this.nCachedObjects_,d=new Array(l);i=r.length,n[e]=i,a.push(e),o.push(t),r.push(d);for(let u=h,f=c.length;u!==f;++u){const p=c[u];d[u]=new Mt(p,e,t)}return d}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,r=this._parsedPaths,a=this._bindings,o=a.length-1,c=a[o],l=e[o];t[l]=n,a[n]=c,a.pop(),r[n]=r[o],r.pop(),i[n]=i[o],i.pop()}}}class eg{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,a=r.length,o=new Array(a),c={endingStart:Ps,endingEnd:Ps};for(let l=0;l!==a;++l){const h=r[l].createInterpolant(null);o[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Xm,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const c=o.parameterPositions,l=o.sampleValues;return c[0]=r,c[1]=r+n,l[0]=e/a,l[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const c=(e-r)*n;c<0||n===0?t=0:(this._startTime=null,t=n*c)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Ku:for(let h=0,d=c.length;h!==d;++h)c[h].evaluate(a),l[h].accumulateAdditive(o);break;case Tl:default:for(let h=0,d=c.length;h!==d;++h)c[h].evaluate(a),l[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const a=n===qm;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===Wm){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);const c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(c===1){const l=e<0;this._setEndings(l,!l,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=Ls,i.endingEnd=Ls):(e?i.endingStart=this.zeroSlopeAtStart?Ls:Ps:i.endingStart=Fa,t?i.endingEnd=this.zeroSlopeAtEnd?Ls:Ps:i.endingEnd=Fa)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,c=a.sampleValues;return o[0]=r,c[0]=t,o[1]=r+e,c[1]=n,this}}const Fy=new Float32Array(1);class Oy extends Kn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,c=n.uuid,l=this._bindingsByRootAndName;let h=l[c];h===void 0&&(h={},l[c]=h);for(let d=0;d!==r;++d){const u=i[d],f=u.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[d]=p;else{if(p=a[d],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,c,f));continue}const x=t&&t._propertyBindings[d].binding.parsedPath;p=new Q0(Mt.create(n,f,x),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,c,f),a[d]=p}o[d].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],c=o.knownActions,l=c[c.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),e._byClipCacheIndex=null;const d=o.actionByRoot,u=(e._localRoot||this._root).uuid;delete d[u],c.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],c=t[t.length-1],l=e._cacheIndex;c._cacheIndex=l,t[l]=c,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new md(new Float32Array(2),new Float32Array(2),1,Fy),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let a=typeof e=="string"?Ya.findByName(i,e):e;const o=a!==null?a.uuid:e,c=this._actionsByClip[o];let l=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Tl),c!==void 0){const d=c.actionByRoot[r];if(d!==void 0&&d.blendMode===n)return d;l=c.knownActions[0],a===null&&(a=l._clip)}if(a===null)return null;const h=new eg(this,a,t,n);return this._bindAction(h,l),this._addInactiveAction(h,o,r),h}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?Ya.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let l=0;l!==n;++l)t[l]._update(i,e,r,a);const o=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)o[l].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,c=a.length;o!==c;++o){const l=a[o];this._deactivateAction(l);const h=l._cacheIndex,d=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,d._cacheIndex=h,t[h]=d,t.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,c=o[t];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class By extends Qu{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isRenderTarget3D=!0,this.depth=n,this.texture=new Il(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class wd{constructor(e){this.value=e}clone(){return new wd(this.value.clone===void 0?this.value:this.value.clone())}}let zy=0;class ky extends Kn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:zy++}),this.name="",this.usage=za,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const r=Array.isArray(t[n])?t[n]:[t[n]];for(let a=0;a<r.length;a++)this.uniforms.push(r[a].clone())}return this}clone(){return new this.constructor().copy(this)}}class Vy extends Dl{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class Gy{constructor(e,t,n,i,r,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=r,this.normalized=a,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const Uf=new dt;class Hy{constructor(e,t,n=0,i=1/0){this.ray=new zr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Pl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):at("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Uf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uf),this}intersectObject(e,t=!0,n=[]){return Eu(e,this,n,t),n.sort(Ff),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Eu(e[i],this,n,t);return n.sort(Ff),n}}function Ff(s,e){return s.distance-e.distance}function Eu(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Eu(r[a],e,t,!0)}}class Wy{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ve("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class Xy{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ut(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ut(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class qy{constructor(e=1,t=0,n=0){this.radius=e,this.theta=t,this.y=n}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}const Ld=class Ld{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};Ld.prototype.isMatrix2=!0;let Cu=Ld;const Of=new Ie;class tg{constructor(e=new Ie(1/0,1/0),t=new Ie(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Of.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Of).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Bf=new I,Ho=new I,ur=new I,dr=new I,zh=new I,Yy=new I,$y=new I;class Zy{constructor(e=new I,t=new I){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Bf.subVectors(e,this.start),Ho.subVectors(this.end,this.start);const n=Ho.dot(Ho);if(n===0)return 0;let r=Ho.dot(Bf)/n;return t&&(r=ut(r,0,1)),r}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=Yy,n=$y){const i=10000000000000001e-32;let r,a;const o=this.start,c=e.start,l=this.end,h=e.end;ur.subVectors(l,o),dr.subVectors(h,c),zh.subVectors(o,c);const d=ur.dot(ur),u=dr.dot(dr),f=dr.dot(zh);if(d<=i&&u<=i)return t.copy(o),n.copy(c),t.sub(n),t.dot(t);if(d<=i)r=0,a=f/u,a=ut(a,0,1);else{const p=ur.dot(zh);if(u<=i)a=0,r=ut(-p/d,0,1);else{const x=ur.dot(dr),m=d*u-x*x;m!==0?r=ut((x*f-p*u)/m,0,1):r=0,a=(x*r+f)/u,a<0?(a=0,r=ut(-p/d,0,1)):a>1&&(a=1,r=ut((x-p)/d,0,1))}}return t.copy(o).addScaledVector(ur,r),n.copy(c).addScaledVector(dr,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const zf=new I;class Jy extends bt{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new mt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,c=32;a<c;a++,o++){const l=a/c*Math.PI*2,h=o/c*Math.PI*2;i.push(Math.cos(l),Math.sin(l),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new tt(i,3));const r=new xn({fog:!1,toneMapped:!1});this.cone=new di(n,r),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),zf.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(zf),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Vi=new I,Wo=new dt,kh=new dt;class Ky extends di{constructor(e){const t=ng(e),n=new mt,i=[],r=[];for(let l=0;l<t.length;l++){const h=t[l];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),r.push(0,0,0),r.push(0,0,0))}n.setAttribute("position",new tt(i,3)),n.setAttribute("color",new tt(r,3));const a=new xn({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1;const o=new ke(255),c=new ke(65280);this.setColors(o,c)}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");kh.copy(this.root.matrixWorld).invert();for(let r=0,a=0;r<t.length;r++){const o=t[r];o.parent&&o.parent.isBone&&(Wo.multiplyMatrices(kh,o.matrixWorld),Vi.setFromMatrixPosition(Wo),i.setXYZ(a,Vi.x,Vi.y,Vi.z),Wo.multiplyMatrices(kh,o.parent.matrixWorld),Vi.setFromMatrixPosition(Wo),i.setXYZ(a+1,Vi.x,Vi.y,Vi.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}setColors(e,t){const i=this.geometry.getAttribute("color");for(let r=0;r<i.count;r+=2)i.setXYZ(r,e.r,e.g,e.b),i.setXYZ(r+1,t.r,t.g,t.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function ng(s){const e=[];s.isBone===!0&&e.push(s);for(let t=0;t<s.children.length;t++)e.push(...ng(s.children[t]));return e}class jy extends Bt{constructor(e,t,n){const i=new Gs(t,4,2),r=new as({wireframe:!0,fog:!1,toneMapped:!1});super(i,r),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const Qy=new I,kf=new ke,Vf=new ke;class ev extends bt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new no(t);i.rotateY(Math.PI*.5),this.material=new as({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const r=i.getAttribute("position"),a=new Float32Array(r.count*3);i.setAttribute("color",new At(a,3)),this.add(new Bt(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");kf.copy(this.light.color),Vf.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const r=n<i/2?kf:Vf;t.setXYZ(n,r.r,r.g,r.b)}t.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),e.lookAt(Qy.setFromMatrixPosition(this.light.matrixWorld).negate())}}class tv extends di{constructor(e=10,t=10,n=4473924,i=8947848){n=new ke(n),i=new ke(i);const r=t/2,a=e/t,o=e/2,c=[],l=[];for(let u=0,f=0,p=-o;u<=t;u++,p+=a){c.push(-o,0,p,o,0,p),c.push(p,0,-o,p,0,o);const x=u===r?n:i;x.toArray(l,f),f+=3,x.toArray(l,f),f+=3,x.toArray(l,f),f+=3,x.toArray(l,f),f+=3}const h=new mt;h.setAttribute("position",new tt(c,3)),h.setAttribute("color",new tt(l,3));const d=new xn({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class nv extends di{constructor(e=10,t=16,n=8,i=64,r=4473924,a=8947848){r=new ke(r),a=new ke(a);const o=[],c=[];if(t>1)for(let d=0;d<t;d++){const u=d/t*(Math.PI*2),f=Math.sin(u)*e,p=Math.cos(u)*e;o.push(0,0,0),o.push(f,0,p);const x=d&1?r:a;c.push(x.r,x.g,x.b),c.push(x.r,x.g,x.b)}for(let d=0;d<n;d++){const u=d&1?r:a,f=e-e/n*d;for(let p=0;p<i;p++){let x=p/i*(Math.PI*2),m=Math.sin(x)*f,g=Math.cos(x)*f;o.push(m,0,g),c.push(u.r,u.g,u.b),x=(p+1)/i*(Math.PI*2),m=Math.sin(x)*f,g=Math.cos(x)*f,o.push(m,0,g),c.push(u.r,u.g,u.b)}}const l=new mt;l.setAttribute("position",new tt(o,3)),l.setAttribute("color",new tt(c,3));const h=new xn({vertexColors:!0,toneMapped:!1});super(l,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Gf=new I,Xo=new I,Hf=new I;class iv extends bt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new mt;i.setAttribute("position",new tt([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const r=new xn({fog:!1,toneMapped:!1});this.lightPlane=new rs(i,r),this.add(this.lightPlane),i=new mt,i.setAttribute("position",new tt([0,0,0,0,0,1],3)),this.targetLine=new rs(i,r),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Gf.setFromMatrixPosition(this.light.matrixWorld),Xo.setFromMatrixPosition(this.light.target.matrixWorld),Hf.subVectors(Xo,Gf),this.lightPlane.lookAt(Xo),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Xo),this.targetLine.scale.z=Hf.length()}}const qo=new I,zt=new Ql;class sv extends di{constructor(e){const t=new mt,n=new xn({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],r=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(p,x){c(p),c(x)}function c(p){i.push(0,0,0),r.push(0,0,0),a[p]===void 0&&(a[p]=[]),a[p].push(i.length/3-1)}t.setAttribute("position",new tt(i,3)),t.setAttribute("color",new tt(r,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const l=new ke(16755200),h=new ke(16711680),d=new ke(43775),u=new ke(16777215),f=new ke(3355443);this.setColors(l,h,d,u,f)}setColors(e,t,n,i,r){const o=this.geometry.getAttribute("color");return o.setXYZ(0,e.r,e.g,e.b),o.setXYZ(1,e.r,e.g,e.b),o.setXYZ(2,e.r,e.g,e.b),o.setXYZ(3,e.r,e.g,e.b),o.setXYZ(4,e.r,e.g,e.b),o.setXYZ(5,e.r,e.g,e.b),o.setXYZ(6,e.r,e.g,e.b),o.setXYZ(7,e.r,e.g,e.b),o.setXYZ(8,e.r,e.g,e.b),o.setXYZ(9,e.r,e.g,e.b),o.setXYZ(10,e.r,e.g,e.b),o.setXYZ(11,e.r,e.g,e.b),o.setXYZ(12,e.r,e.g,e.b),o.setXYZ(13,e.r,e.g,e.b),o.setXYZ(14,e.r,e.g,e.b),o.setXYZ(15,e.r,e.g,e.b),o.setXYZ(16,e.r,e.g,e.b),o.setXYZ(17,e.r,e.g,e.b),o.setXYZ(18,e.r,e.g,e.b),o.setXYZ(19,e.r,e.g,e.b),o.setXYZ(20,e.r,e.g,e.b),o.setXYZ(21,e.r,e.g,e.b),o.setXYZ(22,e.r,e.g,e.b),o.setXYZ(23,e.r,e.g,e.b),o.setXYZ(24,t.r,t.g,t.b),o.setXYZ(25,t.r,t.g,t.b),o.setXYZ(26,t.r,t.g,t.b),o.setXYZ(27,t.r,t.g,t.b),o.setXYZ(28,t.r,t.g,t.b),o.setXYZ(29,t.r,t.g,t.b),o.setXYZ(30,t.r,t.g,t.b),o.setXYZ(31,t.r,t.g,t.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,i.r,i.g,i.b),o.setXYZ(39,i.r,i.g,i.b),o.setXYZ(40,r.r,r.g,r.b),o.setXYZ(41,r.r,r.g,r.b),o.setXYZ(42,r.r,r.g,r.b),o.setXYZ(43,r.r,r.g,r.b),o.setXYZ(44,r.r,r.g,r.b),o.setXYZ(45,r.r,r.g,r.b),o.setXYZ(46,r.r,r.g,r.b),o.setXYZ(47,r.r,r.g,r.b),o.setXYZ(48,r.r,r.g,r.b),o.setXYZ(49,r.r,r.g,r.b),o.needsUpdate=!0,this}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;let r,a;if(zt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)r=1,a=0;else if(this.camera.coordinateSystem===In)r=-1,a=1;else if(this.camera.coordinateSystem===Os)r=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);Ht("c",t,e,zt,0,0,r),Ht("t",t,e,zt,0,0,a),Ht("n1",t,e,zt,-n,-i,r),Ht("n2",t,e,zt,n,-i,r),Ht("n3",t,e,zt,-n,i,r),Ht("n4",t,e,zt,n,i,r),Ht("f1",t,e,zt,-n,-i,a),Ht("f2",t,e,zt,n,-i,a),Ht("f3",t,e,zt,-n,i,a),Ht("f4",t,e,zt,n,i,a),Ht("u1",t,e,zt,n*.7,i*1.1,r),Ht("u2",t,e,zt,-n*.7,i*1.1,r),Ht("u3",t,e,zt,0,i*2,r),Ht("cf1",t,e,zt,-n,0,a),Ht("cf2",t,e,zt,n,0,a),Ht("cf3",t,e,zt,0,-i,a),Ht("cf4",t,e,zt,0,i,a),Ht("cn1",t,e,zt,-n,0,r),Ht("cn2",t,e,zt,n,0,r),Ht("cn3",t,e,zt,0,-i,r),Ht("cn4",t,e,zt,0,i,r),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function Ht(s,e,t,n,i,r,a){qo.set(i,r,a).unproject(n);const o=e[s];if(o!==void 0){const c=t.getAttribute("position");for(let l=0,h=o.length;l<h;l++)c.setXYZ(o[l],qo.x,qo.y,qo.z)}}const Yo=new ln;class rv extends di{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),r=new mt;r.setIndex(new At(n,1)),r.setAttribute("position",new At(i,3)),super(r,new xn({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Yo.setFromObject(this.object),Yo.isEmpty())return;const e=Yo.min,t=Yo.max,n=this.geometry.attributes.position,i=n.array;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=e.x,i[4]=t.y,i[5]=t.z,i[6]=e.x,i[7]=e.y,i[8]=t.z,i[9]=t.x,i[10]=e.y,i[11]=t.z,i[12]=t.x,i[13]=t.y,i[14]=e.z,i[15]=e.x,i[16]=t.y,i[17]=e.z,i[18]=e.x,i[19]=e.y,i[20]=e.z,i[21]=t.x,i[22]=e.y,i[23]=e.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class av extends di{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new mt;r.setIndex(new At(n,1)),r.setAttribute("position",new tt(i,3)),super(r,new xn({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class ov extends rs{constructor(e,t=1,n=16776960){const i=n,r=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new mt;a.setAttribute("position",new tt(r,3)),a.computeBoundingSphere(),super(a,new xn({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],c=new mt;c.setAttribute("position",new tt(o,3)),c.computeBoundingSphere(),this.add(new Bt(c,new as({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const Wf=new I;let $o,Vh;class cv extends bt{constructor(e=new I(0,0,1),t=new I(0,0,0),n=1,i=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",$o===void 0&&($o=new mt,$o.setAttribute("position",new tt([0,0,0,0,1,0],3)),Vh=new eo(.5,1,5,1),Vh.translate(0,-.5,0)),this.position.copy(t),this.line=new rs($o,new xn({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Bt(Vh,new as({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,a)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Wf.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Wf,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class lv extends di{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new mt;i.setAttribute("position",new tt(t,3)),i.setAttribute("color",new tt(n,3));const r=new xn({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(e,t,n){const i=new ke,r=this.geometry.attributes.color.array;return i.set(e),i.toArray(r,0),i.toArray(r,3),i.set(t),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class hv{constructor(){this.type="ShapePath",this.color=new ke,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(e,t){return this.currentPath=new Ha,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,r,a){return this.currentPath.bezierCurveTo(e,t,n,i,r,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(){function e(c,l){let h=!1;const d=l.length;for(let u=0,f=d-1;u<d;f=u++){const p=l[u],x=l[f];p.y>c.y!=x.y>c.y&&c.x<(x.x-p.x)*(c.y-p.y)/(x.y-p.y)+p.x&&(h=!h)}return h}function t(c,l){const h=l.getCenter(new Ie);if(e(h,c))return h;const d=h.y,u=[],f=c.length;for(let p=0;p<f;p++){const x=c[p],m=c[(p+1)%f];if(x.y>d!=m.y>d){const g=x.x+(d-x.y)*(m.x-x.x)/(m.y-x.y);u.push(g)}}return u.length>1&&(u.sort((p,x)=>p-x),h.x=(u[0]+u[1])/2),h}let n=this.userData.style&&this.userData.style.fillRule||"nonzero";n!=="nonzero"&&n!=="evenodd"&&(Ve('Fill-rule "'+n+'" is not supported, falling back to "nonzero".'),n="nonzero");const i=n==="nonzero"?(c=>c!==0):(c=>(c&1)!==0),r=[];for(const c of this.subPaths){const l=c.getPoints();if(l.length<3)continue;const h=Zn.area(l);if(h===0)continue;const d=new tg;for(let u=0;u<l.length;u++)d.expandByPoint(l[u]);r.push({subPath:c,points:l,boundingBox:d,interiorPoint:t(l,d),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}r.sort((c,l)=>l.absArea-c.absArea);for(let c=0;c<r.length;c++){const l=r[c];let h=0;for(let d=c-1;d>=0;d--){const u=r[d];if(u.boundingBox.containsBox(l.boundingBox)&&e(l.interiorPoint,u.points)){l.container=u.exclude?u.container:u,h=u.winding,l.winding+=h;break}}i(l.winding)===i(h)&&(l.exclude=!0)}for(const c of r)c.exclude||(c.role=c.container===null||c.container.role==="hole"?"outer":"hole");const a=[],o=new Map;for(const c of r){if(c.exclude||c.role!=="outer")continue;const l=new to;l.curves=c.subPath.curves,a.push(l),o.set(c,l)}for(const c of r){if(c.exclude||c.role!=="hole")continue;const l=o.get(c.container);if(!l)continue;const h=new Ha;h.curves=c.subPath.curves,l.holes.push(h)}return a}}class uv extends Kn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ve("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function dv(s,e){const t=s.image&&s.image.width?s.image.width/s.image.height:1;return t>e?(s.repeat.x=1,s.repeat.y=t/e,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2):(s.repeat.x=e/t,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0),s}function fv(s,e){const t=s.image&&s.image.width?s.image.width/s.image.height:1;return t>e?(s.repeat.x=e/t,s.repeat.y=1,s.offset.x=(1-s.repeat.x)/2,s.offset.y=0):(s.repeat.x=1,s.repeat.y=t/e,s.offset.x=0,s.offset.y=(1-s.repeat.y)/2),s}function pv(s){return s.repeat.x=1,s.repeat.y=1,s.offset.x=0,s.offset.y=0,s}function Ru(s,e,t,n){const i=mv(n);switch(t){case Zu:return s*e;case Sl:return s*e/i.components*i.byteLength;case Ja:return s*e/i.components*i.byteLength;case is:return s*e*2/i.components*i.byteLength;case wl:return s*e*2/i.components*i.byteLength;case Ju:return s*e*3/i.components*i.byteLength;case cn:return s*e*4/i.components*i.byteLength;case Al:return s*e*4/i.components*i.byteLength;case Sa:case wa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Aa:case Ta:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Ic:case Lc:return Math.max(s,16)*Math.max(e,8)/4;case Rc:case Pc:return Math.max(s,8)*Math.max(e,8)/2;case Dc:case Nc:case Fc:case Oc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Uc:case Da:case Bc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case zc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case kc:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Vc:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Gc:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Hc:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Wc:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Xc:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case qc:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Yc:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case $c:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Zc:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Jc:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Kc:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case jc:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Qc:case el:case tl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case nl:case il:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Na:case sl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mv(s){switch(s){case Mn:case Xu:return{byteLength:1,components:1};case Pr:case qu:case hi:return{byteLength:2,components:1};case Ml:case bl:return{byteLength:2,components:4};case Bn:case vl:case mn:return{byteLength:4,components:1};case Yu:case $u:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}class gv{static contain(e,t){return dv(e,t)}static cover(e,t){return fv(e,t)}static fill(e){return pv(e)}static getByteLength(e,t,n,i){return Ru(e,t,n,i)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xl}}));typeof window<"u"&&(window.__THREE__?Ve("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xl);function ig(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function xv(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=s.createBuffer();s.bindBuffer(c,u),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(s.bindBuffer(l,o),d.length===0)s.bufferSubData(l,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],x=d[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const x=d[f];s.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}var _v=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,vv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Av=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ev=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Iv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Lv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Dv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Nv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Uv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Fv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ov=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Bv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,kv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Vv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Gv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Hv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Wv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$v="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Kv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,jv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Qv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,eM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,tM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,nM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,iM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,aM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,oM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,hM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,uM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,gM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_M=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,yM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vM=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,MM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,SM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,AM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,TM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,EM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,CM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,RM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,IM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,PM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,LM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,DM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,NM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,UM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,FM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,OM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,BM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,VM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,GM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,HM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,WM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,XM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,YM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,$M=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ZM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,JM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,KM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,QM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eb=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,tb=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,nb=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ib=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sb=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ab=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ob=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cb=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hb=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ub=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,db=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,fb=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,pb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _b=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ab=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Tb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Eb=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Cb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ib=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Lb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Db=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ub=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ob=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,kb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Hb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Yb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$b=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Kb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,xt={alphahash_fragment:_v,alphahash_pars_fragment:yv,alphamap_fragment:vv,alphamap_pars_fragment:Mv,alphatest_fragment:bv,alphatest_pars_fragment:Sv,aomap_fragment:wv,aomap_pars_fragment:Av,batching_pars_vertex:Tv,batching_vertex:Ev,begin_vertex:Cv,beginnormal_vertex:Rv,bsdfs:Iv,iridescence_fragment:Pv,bumpmap_pars_fragment:Lv,clipping_planes_fragment:Dv,clipping_planes_pars_fragment:Nv,clipping_planes_pars_vertex:Uv,clipping_planes_vertex:Fv,color_fragment:Ov,color_pars_fragment:Bv,color_pars_vertex:zv,color_vertex:kv,common:Vv,cube_uv_reflection_fragment:Gv,defaultnormal_vertex:Hv,displacementmap_pars_vertex:Wv,displacementmap_vertex:Xv,emissivemap_fragment:qv,emissivemap_pars_fragment:Yv,colorspace_fragment:$v,colorspace_pars_fragment:Zv,envmap_fragment:Jv,envmap_common_pars_fragment:Kv,envmap_pars_fragment:jv,envmap_pars_vertex:Qv,envmap_physical_pars_fragment:hM,envmap_vertex:eM,fog_vertex:tM,fog_pars_vertex:nM,fog_fragment:iM,fog_pars_fragment:sM,gradientmap_pars_fragment:rM,lightmap_pars_fragment:aM,lights_lambert_fragment:oM,lights_lambert_pars_fragment:cM,lights_pars_begin:lM,lights_toon_fragment:uM,lights_toon_pars_fragment:dM,lights_phong_fragment:fM,lights_phong_pars_fragment:pM,lights_physical_fragment:mM,lights_physical_pars_fragment:gM,lights_fragment_begin:xM,lights_fragment_maps:_M,lights_fragment_end:yM,lightprobes_pars_fragment:vM,logdepthbuf_fragment:MM,logdepthbuf_pars_fragment:bM,logdepthbuf_pars_vertex:SM,logdepthbuf_vertex:wM,map_fragment:AM,map_pars_fragment:TM,map_particle_fragment:EM,map_particle_pars_fragment:CM,metalnessmap_fragment:RM,metalnessmap_pars_fragment:IM,morphinstance_vertex:PM,morphcolor_vertex:LM,morphnormal_vertex:DM,morphtarget_pars_vertex:NM,morphtarget_vertex:UM,normal_fragment_begin:FM,normal_fragment_maps:OM,normal_pars_fragment:BM,normal_pars_vertex:zM,normal_vertex:kM,normalmap_pars_fragment:VM,clearcoat_normal_fragment_begin:GM,clearcoat_normal_fragment_maps:HM,clearcoat_pars_fragment:WM,iridescence_pars_fragment:XM,opaque_fragment:qM,packing:YM,premultiplied_alpha_fragment:$M,project_vertex:ZM,dithering_fragment:JM,dithering_pars_fragment:KM,roughnessmap_fragment:jM,roughnessmap_pars_fragment:QM,shadowmap_pars_fragment:eb,shadowmap_pars_vertex:tb,shadowmap_vertex:nb,shadowmask_pars_fragment:ib,skinbase_vertex:sb,skinning_pars_vertex:rb,skinning_vertex:ab,skinnormal_vertex:ob,specularmap_fragment:cb,specularmap_pars_fragment:lb,tonemapping_fragment:hb,tonemapping_pars_fragment:ub,transmission_fragment:db,transmission_pars_fragment:fb,uv_pars_fragment:pb,uv_pars_vertex:mb,uv_vertex:gb,worldpos_vertex:xb,background_vert:_b,background_frag:yb,backgroundCube_vert:vb,backgroundCube_frag:Mb,cube_vert:bb,cube_frag:Sb,depth_vert:wb,depth_frag:Ab,distance_vert:Tb,distance_frag:Eb,equirect_vert:Cb,equirect_frag:Rb,linedashed_vert:Ib,linedashed_frag:Pb,meshbasic_vert:Lb,meshbasic_frag:Db,meshlambert_vert:Nb,meshlambert_frag:Ub,meshmatcap_vert:Fb,meshmatcap_frag:Ob,meshnormal_vert:Bb,meshnormal_frag:zb,meshphong_vert:kb,meshphong_frag:Vb,meshphysical_vert:Gb,meshphysical_frag:Hb,meshtoon_vert:Wb,meshtoon_frag:Xb,points_vert:qb,points_frag:Yb,shadow_vert:$b,shadow_frag:Zb,sprite_vert:Jb,sprite_frag:Kb},Xe={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},$n={basic:{uniforms:dn([Xe.common,Xe.specularmap,Xe.envmap,Xe.aomap,Xe.lightmap,Xe.fog]),vertexShader:xt.meshbasic_vert,fragmentShader:xt.meshbasic_frag},lambert:{uniforms:dn([Xe.common,Xe.specularmap,Xe.envmap,Xe.aomap,Xe.lightmap,Xe.emissivemap,Xe.bumpmap,Xe.normalmap,Xe.displacementmap,Xe.fog,Xe.lights,{emissive:{value:new ke(0)},envMapIntensity:{value:1}}]),vertexShader:xt.meshlambert_vert,fragmentShader:xt.meshlambert_frag},phong:{uniforms:dn([Xe.common,Xe.specularmap,Xe.envmap,Xe.aomap,Xe.lightmap,Xe.emissivemap,Xe.bumpmap,Xe.normalmap,Xe.displacementmap,Xe.fog,Xe.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:xt.meshphong_vert,fragmentShader:xt.meshphong_frag},standard:{uniforms:dn([Xe.common,Xe.envmap,Xe.aomap,Xe.lightmap,Xe.emissivemap,Xe.bumpmap,Xe.normalmap,Xe.displacementmap,Xe.roughnessmap,Xe.metalnessmap,Xe.fog,Xe.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag},toon:{uniforms:dn([Xe.common,Xe.aomap,Xe.lightmap,Xe.emissivemap,Xe.bumpmap,Xe.normalmap,Xe.displacementmap,Xe.gradientmap,Xe.fog,Xe.lights,{emissive:{value:new ke(0)}}]),vertexShader:xt.meshtoon_vert,fragmentShader:xt.meshtoon_frag},matcap:{uniforms:dn([Xe.common,Xe.bumpmap,Xe.normalmap,Xe.displacementmap,Xe.fog,{matcap:{value:null}}]),vertexShader:xt.meshmatcap_vert,fragmentShader:xt.meshmatcap_frag},points:{uniforms:dn([Xe.points,Xe.fog]),vertexShader:xt.points_vert,fragmentShader:xt.points_frag},dashed:{uniforms:dn([Xe.common,Xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xt.linedashed_vert,fragmentShader:xt.linedashed_frag},depth:{uniforms:dn([Xe.common,Xe.displacementmap]),vertexShader:xt.depth_vert,fragmentShader:xt.depth_frag},normal:{uniforms:dn([Xe.common,Xe.bumpmap,Xe.normalmap,Xe.displacementmap,{opacity:{value:1}}]),vertexShader:xt.meshnormal_vert,fragmentShader:xt.meshnormal_frag},sprite:{uniforms:dn([Xe.sprite,Xe.fog]),vertexShader:xt.sprite_vert,fragmentShader:xt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xt.background_vert,fragmentShader:xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:xt.backgroundCube_vert,fragmentShader:xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xt.cube_vert,fragmentShader:xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xt.equirect_vert,fragmentShader:xt.equirect_frag},distance:{uniforms:dn([Xe.common,Xe.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xt.distance_vert,fragmentShader:xt.distance_frag},shadow:{uniforms:dn([Xe.lights,Xe.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:xt.shadow_vert,fragmentShader:xt.shadow_frag}};$n.physical={uniforms:dn([$n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag};const Zo={r:0,b:0,g:0},jb=new dt,sg=new pt;sg.set(-1,0,0,0,1,0,0,0,1);function Qb(s,e,t,n,i,r){const a=new ke(0);let o=i===!0?0:1,c,l,h=null,d=0,u=null;function f(v){let b=v.isScene===!0?v.background:null;if(b&&b.isTexture){const y=v.backgroundBlurriness>0;b=e.get(b,y)}return b}function p(v){let b=!1;const y=f(v);y===null?m(a,o):y&&y.isColor&&(m(y,1),b=!0);const w=s.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(v,b){const y=f(b);y&&(y.isCubeTexture||y.mapping===Br)?(l===void 0&&(l=new Bt(new os(1,1,1),new kn({name:"BackgroundCubeMaterial",uniforms:Fr($n.backgroundCube.uniforms),vertexShader:$n.backgroundCube.vertexShader,fragmentShader:$n.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(w,S,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(jb.makeRotationFromEuler(b.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(sg),l.material.toneMapped=yt.getTransfer(y.colorSpace)!==Et,(h!==y||d!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Bt(new Hs(2,2),new kn({name:"BackgroundMaterial",uniforms:Fr($n.background.uniforms),vertexShader:$n.background.vertexShader,fragmentShader:$n.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=yt.getTransfer(y.colorSpace)!==Et,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,b){v.getRGB(Zo,E0(s)),t.buffers.color.setClear(Zo.r,Zo.g,Zo.b,b,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,b=1){a.set(v),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:p,addToRenderList:x,dispose:g}}function eS(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,a=!1;function o(P,D,H,W,B){let $=!1;const X=d(P,W,H,D);r!==X&&(r=X,l(r.object)),$=f(P,W,H,B),$&&p(P,W,H,B),B!==null&&e.update(B,s.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,y(P,D,H,W),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function c(){return s.createVertexArray()}function l(P){return s.bindVertexArray(P)}function h(P){return s.deleteVertexArray(P)}function d(P,D,H,W){const B=W.wireframe===!0;let $=n[D.id];$===void 0&&($={},n[D.id]=$);const X=P.isInstancedMesh===!0?P.id:0;let he=$[X];he===void 0&&(he={},$[X]=he);let ie=he[H.id];ie===void 0&&(ie={},he[H.id]=ie);let ae=ie[B];return ae===void 0&&(ae=u(c()),ie[B]=ae),ae}function u(P){const D=[],H=[],W=[];for(let B=0;B<t;B++)D[B]=0,H[B]=0,W[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:W,object:P,attributes:{},index:null}}function f(P,D,H,W){const B=r.attributes,$=D.attributes;let X=0;const he=H.getAttributes();for(const ie in he)if(he[ie].location>=0){const Y=B[ie];let O=$[ie];if(O===void 0&&(ie==="instanceMatrix"&&P.instanceMatrix&&(O=P.instanceMatrix),ie==="instanceColor"&&P.instanceColor&&(O=P.instanceColor)),Y===void 0||Y.attribute!==O||O&&Y.data!==O.data)return!0;X++}return r.attributesNum!==X||r.index!==W}function p(P,D,H,W){const B={},$=D.attributes;let X=0;const he=H.getAttributes();for(const ie in he)if(he[ie].location>=0){let Y=$[ie];Y===void 0&&(ie==="instanceMatrix"&&P.instanceMatrix&&(Y=P.instanceMatrix),ie==="instanceColor"&&P.instanceColor&&(Y=P.instanceColor));const O={};O.attribute=Y,Y&&Y.data&&(O.data=Y.data),B[ie]=O,X++}r.attributes=B,r.attributesNum=X,r.index=W}function x(){const P=r.newAttributes;for(let D=0,H=P.length;D<H;D++)P[D]=0}function m(P){g(P,0)}function g(P,D){const H=r.newAttributes,W=r.enabledAttributes,B=r.attributeDivisors;H[P]=1,W[P]===0&&(s.enableVertexAttribArray(P),W[P]=1),B[P]!==D&&(s.vertexAttribDivisor(P,D),B[P]=D)}function v(){const P=r.newAttributes,D=r.enabledAttributes;for(let H=0,W=D.length;H<W;H++)D[H]!==P[H]&&(s.disableVertexAttribArray(H),D[H]=0)}function b(P,D,H,W,B,$,X){X===!0?s.vertexAttribIPointer(P,D,H,B,$):s.vertexAttribPointer(P,D,H,W,B,$)}function y(P,D,H,W){x();const B=W.attributes,$=H.getAttributes(),X=D.defaultAttributeValues;for(const he in $){const ie=$[he];if(ie.location>=0){let ae=B[he];if(ae===void 0&&(he==="instanceMatrix"&&P.instanceMatrix&&(ae=P.instanceMatrix),he==="instanceColor"&&P.instanceColor&&(ae=P.instanceColor)),ae!==void 0){const Y=ae.normalized,O=ae.itemSize,U=e.get(ae);if(U===void 0)continue;const J=U.buffer,ne=U.type,V=U.bytesPerElement,re=ne===s.INT||ne===s.UNSIGNED_INT||ae.gpuType===vl;if(ae.isInterleavedBufferAttribute){const se=ae.data,_e=se.stride,Ae=ae.offset;if(se.isInstancedInterleavedBuffer){for(let Pe=0;Pe<ie.locationSize;Pe++)g(ie.location+Pe,se.meshPerAttribute);P.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Pe=0;Pe<ie.locationSize;Pe++)m(ie.location+Pe);s.bindBuffer(s.ARRAY_BUFFER,J);for(let Pe=0;Pe<ie.locationSize;Pe++)b(ie.location+Pe,O/ie.locationSize,ne,Y,_e*V,(Ae+O/ie.locationSize*Pe)*V,re)}else{if(ae.isInstancedBufferAttribute){for(let se=0;se<ie.locationSize;se++)g(ie.location+se,ae.meshPerAttribute);P.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let se=0;se<ie.locationSize;se++)m(ie.location+se);s.bindBuffer(s.ARRAY_BUFFER,J);for(let se=0;se<ie.locationSize;se++)b(ie.location+se,O/ie.locationSize,ne,Y,O*V,O/ie.locationSize*se*V,re)}}else if(X!==void 0){const Y=X[he];if(Y!==void 0)switch(Y.length){case 2:s.vertexAttrib2fv(ie.location,Y);break;case 3:s.vertexAttrib3fv(ie.location,Y);break;case 4:s.vertexAttrib4fv(ie.location,Y);break;default:s.vertexAttrib1fv(ie.location,Y)}}}}v()}function w(){E();for(const P in n){const D=n[P];for(const H in D){const W=D[H];for(const B in W){const $=W[B];for(const X in $)h($[X].object),delete $[X];delete W[B]}}delete n[P]}}function S(P){if(n[P.id]===void 0)return;const D=n[P.id];for(const H in D){const W=D[H];for(const B in W){const $=W[B];for(const X in $)h($[X].object),delete $[X];delete W[B]}}delete n[P.id]}function C(P){for(const D in n){const H=n[D];for(const W in H){const B=H[W];if(B[P.id]===void 0)continue;const $=B[P.id];for(const X in $)h($[X].object),delete $[X];delete B[P.id]}}}function _(P){for(const D in n){const H=n[D],W=P.isInstancedMesh===!0?P.id:0,B=H[W];if(B!==void 0){for(const $ in B){const X=B[$];for(const he in X)h(X[he].object),delete X[he];delete B[$]}delete H[W],Object.keys(H).length===0&&delete n[D]}}}function E(){A(),a=!0,r!==i&&(r=i,l(r.object))}function A(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:E,resetDefaultState:A,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:v}}function tS(s,e,t){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(s.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function nS(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(C){return!(C!==cn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const _=C===hi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Mn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==mn&&!_)}function c(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ve("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ve("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),w=s.getParameter(s.MAX_SAMPLES),S=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:y,maxSamples:w,samples:S}}function iS(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Zi,o=new pt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,g=s.get(d);if(!i||p===null||p.length===0||r&&!m)r?h(null):l();else{const v=r?0:n,b=v*4;let y=g.clippingState||null;c.value=y,y=h(p,u,b,f);for(let w=0;w!==b;++w)y[w]=t[w];g.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,p){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=c.value,p!==!0||m===null){const g=f+x*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<g)&&(m=new Float32Array(g));for(let b=0,y=f;b!==x;++b,y+=4)a.copy(d[b]).applyMatrix4(v,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}const Qi=4,Xf=[.125,.215,.35,.446,.526,.582],Is=20,sS=256,ea=new io,qf=new ke;let Gh=null,Hh=0,Wh=0,Xh=!1;const rS=new I;class Iu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=rS}=r;Gh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Wh=this._renderer.getActiveMipmapLevel(),Xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$f(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Gh,Hh,Wh),this._renderer.xr.enabled=Xh,e.scissorTest=!1,fr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===li||e.mapping===ns?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Gh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Wh=this._renderer.getActiveMipmapLevel(),Xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:It,minFilter:It,generateMipmaps:!1,type:hi,format:cn,colorSpace:Oa,depthBuffer:!1},i=Yf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yf(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=aS(r)),this._blurMaterial=cS(r,e,t),this._ggxMaterial=oS(r,e,t)}return i}_compileMaterial(e){const t=new Bt(new mt,e);this._renderer.compile(t,ea)}_sceneToCubeUV(e,t,n,i,r){const c=new $t(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(qf),d.toneMapping=Jn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Bt(new os,new as({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let g=!1;const v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,g=!0):(m.color.copy(qf),g=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[b],r.y,r.z)):y===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[b]));const w=this._cubeSize;fr(i,y*w,b>2?w:0,w,w),d.setRenderTarget(i),g&&d.render(x,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=v}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===li||e.mapping===ns;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$f());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;fr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,ea)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=0+l*1.25,f=d*u,{_lodMax:p}=this,x=this._sizeLods[n],m=3*x*(n>p-Qi?n-p+Qi:0),g=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=p-t,fr(r,m,g,3*x,2*x),i.setRenderTarget(r),i.render(o,ea),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-n,fr(e,m,g,3*x,2*x),i.setRenderTarget(e),i.render(o,ea)}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&at("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[i];d.material=l;const u=l.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Is-1),x=r/p,m=isFinite(r)?1+Math.floor(h*x):Is;m>Is&&Ve(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Is}`);const g=[];let v=0;for(let C=0;C<Is;++C){const _=C/x,E=Math.exp(-_*_/2);g.push(E),C===0?v+=E:C<m&&(v+=2*E)}for(let C=0;C<g.length;C++)g[C]=g[C]/v;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=g,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:b}=this;u.dTheta.value=p,u.mipInt.value=b-n;const y=this._sizeLods[i],w=3*y*(i>b-Qi?i-b+Qi:0),S=4*(this._cubeSize-y);fr(t,w,S,3*y,2*y),c.setRenderTarget(t),c.render(d,ea)}}function aS(s){const e=[],t=[],n=[];let i=s;const r=s-Qi+1+Xf.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let c=1/o;a>s-Qi?c=Xf[a-s+Qi-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,x=3,m=2,g=1,v=new Float32Array(x*p*f),b=new Float32Array(m*p*f),y=new Float32Array(g*p*f);for(let S=0;S<f;S++){const C=S%3*2/3-1,_=S>2?0:-1,E=[C,_,0,C+2/3,_,0,C+2/3,_+1,0,C,_,0,C+2/3,_+1,0,C,_+1,0];v.set(E,x*p*S),b.set(u,m*p*S);const A=[S,S,S,S,S,S];y.set(A,g*p*S)}const w=new mt;w.setAttribute("position",new At(v,x)),w.setAttribute("uv",new At(b,m)),w.setAttribute("faceIndex",new At(y,g)),n.push(new Bt(w,null)),i>Qi&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Yf(s,e,t){const n=new Ln(s,e,t);return n.texture.mapping=Br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function oS(s,e,t){return new kn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:sS,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:th(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function cS(s,e,t){const n=new Float32Array(Is),i=new I(0,1,0);return new kn({name:"SphericalGaussianBlur",defines:{n:Is,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:th(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function $f(){return new kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:th(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function Zf(){return new kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:th(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function th(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Ad extends Ln{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ja(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new os(5,5,5),r=new kn({name:"CubemapFromEquirect",uniforms:Fr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:gn,blending:ci});r.uniforms.tEquirect.value=t;const a=new Bt(i,r),o=t.minFilter;return t.minFilter===si&&(t.minFilter=It),new Z0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function lS(s){let e=new WeakMap,t=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===va||f===Ma)if(e.has(u)){const p=e.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const x=new Ad(p.height);return x.fromEquirectangularTexture(s,u),e.set(u,x),u.addEventListener("dispose",l),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,p=f===va||f===Ma,x=f===li||f===ns;if(p||x){let m=t.get(u);const g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new Iu(s)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const v=u.image;return p&&v&&v.height>0||x&&v&&c(v)?(n===null&&(n=new Iu(s)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===va?u.mapping=li:f===Ma&&(u.mapping=ns),u}function c(u){let f=0;const p=6;for(let x=0;x<p;x++)u[x]!==void 0&&f++;return f===p}function l(u){const f=u.target;f.removeEventListener("dispose",l);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function hS(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&ts("WebGLRenderer: "+n+" extension not supported."),i}}}function uS(s,e,t,n){const i={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const p in u.attributes)e.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete i[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],s.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,p=d.attributes.position;let x=0;if(p===void 0)return;if(f!==null){const v=f.array;x=f.version;for(let b=0,y=v.length;b<y;b+=3){const w=v[b+0],S=v[b+1],C=v[b+2];u.push(w,S,S,C,C,w)}}else{const v=p.array;x=p.version;for(let b=0,y=v.length/3-1;b<y;b+=3){const w=b+0,S=b+1,C=b+2;u.push(w,S,S,C,C,w)}}const m=new(p.count>=65535?nd:td)(u,1);m.version=x;const g=r.get(d);g&&e.remove(g),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function dS(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){s.drawElements(n,u,r,d*a),t.update(u,n,1)}function l(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let x=0;for(let m=0;m<f;m++)x+=u[m];t.update(x,n,1)}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function fS(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:at("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function pS(s,e,t){const n=new WeakMap,i=new Ct;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let A=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",A)};var f=A;u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),x===!0&&(y=2),m===!0&&(y=3);let w=o.attributes.position.count*y,S=1;w>e.maxTextureSize&&(S=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const C=new Float32Array(w*S*4*d),_=new Rl(C,w,S,d);_.type=mn,_.needsUpdate=!0;const E=y*4;for(let P=0;P<d;P++){const D=g[P],H=v[P],W=b[P],B=w*S*4*P;for(let $=0;$<D.count;$++){const X=$*E;p===!0&&(i.fromBufferAttribute(D,$),C[B+X+0]=i.x,C[B+X+1]=i.y,C[B+X+2]=i.z,C[B+X+3]=0),x===!0&&(i.fromBufferAttribute(H,$),C[B+X+4]=i.x,C[B+X+5]=i.y,C[B+X+6]=i.z,C[B+X+7]=0),m===!0&&(i.fromBufferAttribute(W,$),C[B+X+8]=i.x,C[B+X+9]=i.y,C[B+X+10]=i.z,C[B+X+11]=W.itemSize===4?i.w:1)}}u={count:d,texture:_,size:new Ie(w,S)},n.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<l.length;m++)p+=l[m];const x=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(s,"morphTargetBaseInfluence",x),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function mS(s,e,t,n,i){let r=new WeakMap;function a(l){const h=i.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const gS={[Bu]:"LINEAR_TONE_MAPPING",[zu]:"REINHARD_TONE_MAPPING",[ku]:"CINEON_TONE_MAPPING",[_l]:"ACES_FILMIC_TONE_MAPPING",[Gu]:"AGX_TONE_MAPPING",[Hu]:"NEUTRAL_TONE_MAPPING",[Vu]:"CUSTOM_TONE_MAPPING"};function xS(s,e,t,n,i,r){const a=new Ln(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new ks(e,t):void 0}),o=new Ln(e,t,{type:hi,depthBuffer:!1,stencilBuffer:!1}),c=new mt;c.setAttribute("position",new tt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new tt([0,2,0,0,2,0],2));const l=new dd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Bt(c,l),d=new io(-1,1,1,-1,0,1);let u=null,f=null,p=!1,x,m=null,g=[],v=!1;this.setSize=function(b,y){a.setSize(b,y),o.setSize(b,y);for(let w=0;w<g.length;w++){const S=g[w];S.setSize&&S.setSize(b,y)}},this.setEffects=function(b){g=b,v=g.length>0&&g[0].isRenderPass===!0;const y=a.width,w=a.height;for(let S=0;S<g.length;S++){const C=g[S];C.setSize&&C.setSize(y,w)}},this.begin=function(b,y){if(p||b.toneMapping===Jn&&g.length===0)return!1;if(m=y,y!==null){const w=y.width,S=y.height;(a.width!==w||a.height!==S)&&this.setSize(w,S)}return v===!1&&b.setRenderTarget(a),x=b.toneMapping,b.toneMapping=Jn,!0},this.hasRenderPass=function(){return v},this.end=function(b,y){b.toneMapping=x,p=!0;let w=a,S=o;for(let C=0;C<g.length;C++){const _=g[C];if(_.enabled!==!1&&(_.render(b,S,w,y),_.needsSwap!==!1)){const E=w;w=S,S=E}}if(u!==b.outputColorSpace||f!==b.toneMapping){u=b.outputColorSpace,f=b.toneMapping,l.defines={},yt.getTransfer(u)===Et&&(l.defines.SRGB_TRANSFER="");const C=gS[f];C&&(l.defines[C]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=w.texture,b.setRenderTarget(m),b.render(h,d),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const rg=new Ot,Pu=new ks(1,1),ag=new Rl,og=new Il,cg=new ja,Jf=[],Kf=[],jf=new Float32Array(16),Qf=new Float32Array(9),ep=new Float32Array(4);function Vr(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Jf[i];if(r===void 0&&(r=new Float32Array(i),Jf[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Zt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Jt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function nh(s,e){let t=Kf[e];t===void 0&&(t=new Int32Array(e),Kf[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function _S(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function yS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;s.uniform2fv(this.addr,e),Jt(t,e)}}function vS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Zt(t,e))return;s.uniform3fv(this.addr,e),Jt(t,e)}}function MS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;s.uniform4fv(this.addr,e),Jt(t,e)}}function bS(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Jt(t,e)}else{if(Zt(t,n))return;ep.set(n),s.uniformMatrix2fv(this.addr,!1,ep),Jt(t,n)}}function SS(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Jt(t,e)}else{if(Zt(t,n))return;Qf.set(n),s.uniformMatrix3fv(this.addr,!1,Qf),Jt(t,n)}}function wS(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Zt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Jt(t,e)}else{if(Zt(t,n))return;jf.set(n),s.uniformMatrix4fv(this.addr,!1,jf),Jt(t,n)}}function AS(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function TS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;s.uniform2iv(this.addr,e),Jt(t,e)}}function ES(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;s.uniform3iv(this.addr,e),Jt(t,e)}}function CS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;s.uniform4iv(this.addr,e),Jt(t,e)}}function RS(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function IS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Zt(t,e))return;s.uniform2uiv(this.addr,e),Jt(t,e)}}function PS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Zt(t,e))return;s.uniform3uiv(this.addr,e),Jt(t,e)}}function LS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Zt(t,e))return;s.uniform4uiv(this.addr,e),Jt(t,e)}}function DS(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Pu.compareFunction=t.isReversedDepthBuffer()?Cl:El,r=Pu):r=rg,t.setTexture2D(e||r,i)}function NS(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||og,i)}function US(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||cg,i)}function FS(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||ag,i)}function OS(s){switch(s){case 5126:return _S;case 35664:return yS;case 35665:return vS;case 35666:return MS;case 35674:return bS;case 35675:return SS;case 35676:return wS;case 5124:case 35670:return AS;case 35667:case 35671:return TS;case 35668:case 35672:return ES;case 35669:case 35673:return CS;case 5125:return RS;case 36294:return IS;case 36295:return PS;case 36296:return LS;case 35678:case 36198:case 36298:case 36306:case 35682:return DS;case 35679:case 36299:case 36307:return NS;case 35680:case 36300:case 36308:case 36293:return US;case 36289:case 36303:case 36311:case 36292:return FS}}function BS(s,e){s.uniform1fv(this.addr,e)}function zS(s,e){const t=Vr(e,this.size,2);s.uniform2fv(this.addr,t)}function kS(s,e){const t=Vr(e,this.size,3);s.uniform3fv(this.addr,t)}function VS(s,e){const t=Vr(e,this.size,4);s.uniform4fv(this.addr,t)}function GS(s,e){const t=Vr(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function HS(s,e){const t=Vr(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function WS(s,e){const t=Vr(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function XS(s,e){s.uniform1iv(this.addr,e)}function qS(s,e){s.uniform2iv(this.addr,e)}function YS(s,e){s.uniform3iv(this.addr,e)}function $S(s,e){s.uniform4iv(this.addr,e)}function ZS(s,e){s.uniform1uiv(this.addr,e)}function JS(s,e){s.uniform2uiv(this.addr,e)}function KS(s,e){s.uniform3uiv(this.addr,e)}function jS(s,e){s.uniform4uiv(this.addr,e)}function QS(s,e,t){const n=this.cache,i=e.length,r=nh(t,i);Zt(n,r)||(s.uniform1iv(this.addr,r),Jt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Pu:a=rg;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function e1(s,e,t){const n=this.cache,i=e.length,r=nh(t,i);Zt(n,r)||(s.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||og,r[a])}function t1(s,e,t){const n=this.cache,i=e.length,r=nh(t,i);Zt(n,r)||(s.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||cg,r[a])}function n1(s,e,t){const n=this.cache,i=e.length,r=nh(t,i);Zt(n,r)||(s.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||ag,r[a])}function i1(s){switch(s){case 5126:return BS;case 35664:return zS;case 35665:return kS;case 35666:return VS;case 35674:return GS;case 35675:return HS;case 35676:return WS;case 5124:case 35670:return XS;case 35667:case 35671:return qS;case 35668:case 35672:return YS;case 35669:case 35673:return $S;case 5125:return ZS;case 36294:return JS;case 36295:return KS;case 36296:return jS;case 35678:case 36198:case 36298:case 36306:case 35682:return QS;case 35679:case 36299:case 36307:return e1;case 35680:case 36300:case 36308:case 36293:return t1;case 36289:case 36303:case 36311:case 36292:return n1}}class s1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=OS(t.type)}}class r1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=i1(t.type)}}class a1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const qh=/(\w+)(\])?(\[|\.)?/g;function tp(s,e){s.seq.push(e),s.map[e.id]=e}function o1(s,e,t){const n=s.name,i=n.length;for(qh.lastIndex=0;;){const r=qh.exec(n),a=qh.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){tp(t,l===void 0?new s1(o,s,e):new r1(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new a1(o),tp(t,d)),t=d}}}class yc{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);o1(o,c,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function np(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const c1=37297;let l1=0;function h1(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ip=new pt;function u1(s){yt._getMatrix(ip,yt.workingColorSpace,s);const e=`mat3( ${ip.elements.map(t=>t.toFixed(4))} )`;switch(yt.getTransfer(s)){case Ba:return[e,"LinearTransferOETF"];case Et:return[e,"sRGBTransferOETF"];default:return Ve("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function sp(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+h1(s.getShaderSource(e),o)}else return r}function d1(s,e){const t=u1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const f1={[Bu]:"Linear",[zu]:"Reinhard",[ku]:"Cineon",[_l]:"ACESFilmic",[Gu]:"AgX",[Hu]:"Neutral",[Vu]:"Custom"};function p1(s,e){const t=f1[e];return t===void 0?(Ve("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Jo=new I;function m1(){yt.getLuminanceCoefficients(Jo);const s=Jo.x.toFixed(4),e=Jo.y.toFixed(4),t=Jo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function g1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ga).join(`
`)}function x1(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function _1(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function ga(s){return s!==""}function rp(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ap(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const y1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lu(s){return s.replace(y1,M1)}const v1=new Map;function M1(s,e){let t=xt[e];if(t===void 0){const n=v1.get(e);if(n!==void 0)t=xt[n],Ve('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Lu(t)}const b1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function op(s){return s.replace(b1,S1)}function S1(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function cp(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const w1={[ya]:"SHADOWMAP_TYPE_PCF",[Tr]:"SHADOWMAP_TYPE_VSM"};function A1(s){return w1[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const T1={[li]:"ENVMAP_TYPE_CUBE",[ns]:"ENVMAP_TYPE_CUBE",[Br]:"ENVMAP_TYPE_CUBE_UV"};function E1(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":T1[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const C1={[ns]:"ENVMAP_MODE_REFRACTION"};function R1(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":C1[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const I1={[Za]:"ENVMAP_BLENDING_MULTIPLY",[Vm]:"ENVMAP_BLENDING_MIX",[Gm]:"ENVMAP_BLENDING_ADD"};function P1(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":I1[s.combine]||"ENVMAP_BLENDING_NONE"}function L1(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function D1(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=A1(t),l=E1(t),h=R1(t),d=P1(t),u=L1(t),f=g1(t),p=x1(r),x=i.createProgram();let m,g,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ga).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ga).join(`
`),g.length>0&&(g+=`
`)):(m=[cp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ga).join(`
`),g=[cp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Jn?"#define TONE_MAPPING":"",t.toneMapping!==Jn?xt.tonemapping_pars_fragment:"",t.toneMapping!==Jn?p1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",xt.colorspace_pars_fragment,d1("linearToOutputTexel",t.outputColorSpace),m1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ga).join(`
`)),a=Lu(a),a=rp(a,t),a=ap(a,t),o=Lu(o),o=rp(o,t),o=ap(o,t),a=op(a),o=op(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===Mu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Mu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const b=v+m+a,y=v+g+o,w=np(i,i.VERTEX_SHADER,b),S=np(i,i.FRAGMENT_SHADER,y);i.attachShader(x,w),i.attachShader(x,S),t.index0AttributeName!==void 0?i.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function C(P){if(s.debug.checkShaderErrors){const D=i.getProgramInfoLog(x)||"",H=i.getShaderInfoLog(w)||"",W=i.getShaderInfoLog(S)||"",B=D.trim(),$=H.trim(),X=W.trim();let he=!0,ie=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(he=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,w,S);else{const ae=sp(i,w,"vertex"),Y=sp(i,S,"fragment");at("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+ae+`
`+Y)}else B!==""?Ve("WebGLProgram: Program Info Log:",B):($===""||X==="")&&(ie=!1);ie&&(P.diagnostics={runnable:he,programLog:B,vertexShader:{log:$,prefix:m},fragmentShader:{log:X,prefix:g}})}i.deleteShader(w),i.deleteShader(S),_=new yc(i,x),E=_1(i,x)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=i.getProgramParameter(x,c1)),A},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=l1++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=S,this}let N1=0;class U1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new F1(e),t.set(e,n)),n}}class F1{constructor(e){this.id=N1++,this.code=e,this.usedTimes=0}}function O1(s){return s===is||s===Da||s===Na}function B1(s,e,t,n,i,r){const a=new Pl,o=new U1,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return c.add(_),_===0?"uv":`uv${_}`}function x(_,E,A,P,D,H){const W=P.fog,B=D.geometry,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,he=e.get(_.envMap||$,X),ie=he&&he.mapping===Br?he.image.height:null,ae=f[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Ve("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const Y=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,O=Y!==void 0?Y.length:0;let U=0;B.morphAttributes.position!==void 0&&(U=1),B.morphAttributes.normal!==void 0&&(U=2),B.morphAttributes.color!==void 0&&(U=3);let J,ne,V,re;if(ae){const We=$n[ae];J=We.vertexShader,ne=We.fragmentShader}else{J=_.vertexShader,ne=_.fragmentShader;const We=o.getVertexShaderStage(_),Tt=o.getFragmentShaderStage(_);o.update(_,We,Tt),V=We.id,re=Tt.id}const se=s.getRenderTarget(),_e=s.state.buffers.depth.getReversed(),Ae=D.isInstancedMesh===!0,Pe=D.isBatchedMesh===!0,Ue=!!_.map,Fe=!!_.matcap,F=!!he,N=!!_.aoMap,G=!!_.lightMap,k=!!_.bumpMap&&_.wireframe===!1,q=!!_.normalMap,de=!!_.displacementMap,oe=!!_.emissiveMap,Me=!!_.metalnessMap,we=!!_.roughnessMap,L=_.anisotropy>0,Ke=_.clearcoat>0,qe=_.dispersion>0,R=_.iridescence>0,M=_.sheen>0,K=_.transmission>0,te=L&&!!_.anisotropyMap,ce=Ke&&!!_.clearcoatMap,Re=Ke&&!!_.clearcoatNormalMap,Ce=Ke&&!!_.clearcoatRoughnessMap,ge=R&&!!_.iridescenceMap,be=R&&!!_.iridescenceThicknessMap,Le=M&&!!_.sheenColorMap,Ze=M&&!!_.sheenRoughnessMap,Ne=!!_.specularMap,Be=!!_.specularColorMap,Je=!!_.specularIntensityMap,rt=K&&!!_.transmissionMap,ct=K&&!!_.thicknessMap,Z=!!_.gradientMap,De=!!_.alphaMap,le=_.alphaTest>0,ze=!!_.alphaHash,Ge=!!_.extensions;let Te=Jn;_.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(Te=s.toneMapping);const Qe={shaderID:ae,shaderType:_.type,shaderName:_.name,vertexShader:J,fragmentShader:ne,defines:_.defines,customVertexShaderID:V,customFragmentShaderID:re,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:Pe,batchingColor:Pe&&D._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&D.instanceColor!==null,instancingMorph:Ae&&D.morphTexture!==null,outputColorSpace:se===null?s.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:yt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ue,matcap:Fe,envMap:F,envMapMode:F&&he.mapping,envMapCubeUVHeight:ie,aoMap:N,lightMap:G,bumpMap:k,normalMap:q,displacementMap:de,emissiveMap:oe,normalMapObjectSpace:q&&_.normalMapType===$m,normalMapTangentSpace:q&&_.normalMapType===Ri,packedNormalMap:q&&_.normalMapType===Ri&&O1(_.normalMap.format),metalnessMap:Me,roughnessMap:we,anisotropy:L,anisotropyMap:te,clearcoat:Ke,clearcoatMap:ce,clearcoatNormalMap:Re,clearcoatRoughnessMap:Ce,dispersion:qe,iridescence:R,iridescenceMap:ge,iridescenceThicknessMap:be,sheen:M,sheenColorMap:Le,sheenRoughnessMap:Ze,specularMap:Ne,specularColorMap:Be,specularIntensityMap:Je,transmission:K,transmissionMap:rt,thicknessMap:ct,gradientMap:Z,opaque:_.transparent===!1&&_.blending===Ns&&_.alphaToCoverage===!1,alphaMap:De,alphaTest:le,alphaHash:ze,combine:_.combine,mapUv:Ue&&p(_.map.channel),aoMapUv:N&&p(_.aoMap.channel),lightMapUv:G&&p(_.lightMap.channel),bumpMapUv:k&&p(_.bumpMap.channel),normalMapUv:q&&p(_.normalMap.channel),displacementMapUv:de&&p(_.displacementMap.channel),emissiveMapUv:oe&&p(_.emissiveMap.channel),metalnessMapUv:Me&&p(_.metalnessMap.channel),roughnessMapUv:we&&p(_.roughnessMap.channel),anisotropyMapUv:te&&p(_.anisotropyMap.channel),clearcoatMapUv:ce&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:Re&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ce&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:be&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:Ze&&p(_.sheenRoughnessMap.channel),specularMapUv:Ne&&p(_.specularMap.channel),specularColorMapUv:Be&&p(_.specularColorMap.channel),specularIntensityMapUv:Je&&p(_.specularIntensityMap.channel),transmissionMapUv:rt&&p(_.transmissionMap.channel),thicknessMapUv:ct&&p(_.thicknessMap.channel),alphaMapUv:De&&p(_.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(q||L),vertexNormals:!!B.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!B.attributes.uv&&(Ue||De),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||B.attributes.normal===void 0&&q===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:_e,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:O,morphTextureStride:U,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&A.length>0,shadowMapType:s.shadowMap.type,toneMapping:Te,decodeVideoTexture:Ue&&_.map.isVideoTexture===!0&&yt.getTransfer(_.map.colorSpace)===Et,decodeVideoTextureEmissive:oe&&_.emissiveMap.isVideoTexture===!0&&yt.getTransfer(_.emissiveMap.colorSpace)===Et,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===ii,flipSided:_.side===gn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ge&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&_.extensions.multiDraw===!0||Pe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Qe.vertexUv1s=c.has(1),Qe.vertexUv2s=c.has(2),Qe.vertexUv3s=c.has(3),c.clear(),Qe}function m(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const A in _.defines)E.push(A),E.push(_.defines[A]);return _.isRawShaderMaterial===!1&&(g(E,_),v(E,_),E.push(s.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function g(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function v(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function b(_){const E=f[_.type];let A;if(E){const P=$n[E];A=C0.clone(P.uniforms)}else A=_.uniforms;return A}function y(_,E){let A=h.get(E);return A!==void 0?++A.usedTimes:(A=new D1(s,E,_,i),l.push(A),h.set(E,A)),A}function w(_){if(--_.usedTimes===0){const E=l.indexOf(_);l[E]=l[l.length-1],l.pop(),h.delete(_.cacheKey),_.destroy()}}function S(_){o.remove(_)}function C(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:b,acquireProgram:y,releaseProgram:w,releaseShaderCache:S,programs:l,dispose:C}}function z1(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function k1(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function lp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function hp(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,x,m,g){let v=s[e];return v===void 0?(v={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:m,group:g},s[e]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=p,v.materialVariant=a(u),v.groupOrder=x,v.renderOrder=u.renderOrder,v.z=m,v.group=g),e++,v}function c(u,f,p,x,m,g){const v=o(u,f,p,x,m,g);p.transmission>0?n.push(v):p.transparent===!0?i.push(v):t.push(v)}function l(u,f,p,x,m,g){const v=o(u,f,p,x,m,g);p.transmission>0?n.unshift(v):p.transparent===!0?i.unshift(v):t.unshift(v)}function h(u,f,p){t.length>1&&t.sort(u||k1),n.length>1&&n.sort(f||lp),i.length>1&&i.sort(f||lp),p&&(t.reverse(),n.reverse(),i.reverse())}function d(){for(let u=e,f=s.length;u<f;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:d,sort:h}}function V1(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new hp,s.set(n,[a])):i>=r.length?(a=new hp,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function G1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new ke};break;case"SpotLight":t={position:new I,direction:new I,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function H1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let W1=0;function X1(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function q1(s){const e=new G1,t=H1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);const i=new I,r=new dt,a=new dt;function o(l){let h=0,d=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,v=0,b=0,y=0,w=0,S=0,C=0;l.sort(X1);for(let E=0,A=l.length;E<A;E++){const P=l[E],D=P.color,H=P.intensity,W=P.distance;let B=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===is?B=P.shadow.map.texture:B=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=D.r*H,d+=D.g*H,u+=D.b*H;else if(P.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(P.sh.coefficients[$],H);C++}else if(P.isDirectionalLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,he=t.get(P);he.shadowIntensity=X.intensity,he.shadowBias=X.bias,he.shadowNormalBias=X.normalBias,he.shadowRadius=X.radius,he.shadowMapSize=X.mapSize,n.directionalShadow[f]=he,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=P.shadow.matrix,v++}n.directional[f]=$,f++}else if(P.isSpotLight){const $=e.get(P);$.position.setFromMatrixPosition(P.matrixWorld),$.color.copy(D).multiplyScalar(H),$.distance=W,$.coneCos=Math.cos(P.angle),$.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),$.decay=P.decay,n.spot[x]=$;const X=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,X.updateMatrices(P),P.castShadow&&S++),n.spotLightMatrix[x]=X.matrix,P.castShadow){const he=t.get(P);he.shadowIntensity=X.intensity,he.shadowBias=X.bias,he.shadowNormalBias=X.normalBias,he.shadowRadius=X.radius,he.shadowMapSize=X.mapSize,n.spotShadow[x]=he,n.spotShadowMap[x]=B,y++}x++}else if(P.isRectAreaLight){const $=e.get(P);$.color.copy(D).multiplyScalar(H),$.halfWidth.set(P.width*.5,0,0),$.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=$,m++}else if(P.isPointLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),$.distance=P.distance,$.decay=P.decay,P.castShadow){const X=P.shadow,he=t.get(P);he.shadowIntensity=X.intensity,he.shadowBias=X.bias,he.shadowNormalBias=X.normalBias,he.shadowRadius=X.radius,he.shadowMapSize=X.mapSize,he.shadowCameraNear=X.camera.near,he.shadowCameraFar=X.camera.far,n.pointShadow[p]=he,n.pointShadowMap[p]=B,n.pointShadowMatrix[p]=P.shadow.matrix,b++}n.point[p]=$,p++}else if(P.isHemisphereLight){const $=e.get(P);$.skyColor.copy(P.color).multiplyScalar(H),$.groundColor.copy(P.groundColor).multiplyScalar(H),n.hemi[g]=$,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Xe.LTC_FLOAT_1,n.rectAreaLTC2=Xe.LTC_FLOAT_2):(n.rectAreaLTC1=Xe.LTC_HALF_1,n.rectAreaLTC2=Xe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const _=n.hash;(_.directionalLength!==f||_.pointLength!==p||_.spotLength!==x||_.rectAreaLength!==m||_.hemiLength!==g||_.numDirectionalShadows!==v||_.numPointShadows!==b||_.numSpotShadows!==y||_.numSpotMaps!==w||_.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=y+w-S,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=C,_.directionalLength=f,_.pointLength=p,_.spotLength=x,_.rectAreaLength=m,_.hemiLength=g,_.numDirectionalShadows=v,_.numPointShadows=b,_.numSpotShadows=y,_.numSpotMaps=w,_.numLightProbes=C,n.version=W1++)}function c(l,h){let d=0,u=0,f=0,p=0,x=0;const m=h.matrixWorldInverse;for(let g=0,v=l.length;g<v;g++){const b=l[g];if(b.isDirectionalLight){const y=n.directional[d];y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),d++}else if(b.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const y=n.rectArea[p];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),p++}else if(b.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),u++}else if(b.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:o,setupView:c,state:n}}function up(s){const e=new q1(s),t=[],n=[],i=[];function r(u){d.camera=u,t.length=0,n.length=0,i.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function c(u){i.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Y1(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new up(s),e.set(i,[o])):r>=a.length?(o=new up(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const $1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Z1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,J1=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],K1=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],dp=new dt,ta=new I,Yh=new I;function j1(s,e,t){let n=new zs;const i=new Ie,r=new Ie,a=new Ct,o=new fd,c=new pd,l={},h=t.maxTextureSize,d={[Ci]:gn,[gn]:Ci,[ii]:ii},u=new kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:$1,fragmentShader:Z1}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new mt;p.setAttribute("position",new At(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Bt(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ya;let g=this.type;this.render=function(S,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;this.type===Ou&&(Ve("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=ya);const E=s.getRenderTarget(),A=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),D=s.state;D.setBlending(ci),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const H=g!==this.type;H&&C.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(B=>B.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,B=S.length;W<B;W++){const $=S[W],X=$.shadow;if(X===void 0){Ve("WebGLShadowMap:",$,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const he=X.getFrameExtents();i.multiply(he),r.copy(X.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/he.x),i.x=r.x*he.x,X.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/he.y),i.y=r.y*he.y,X.mapSize.y=r.y));const ie=s.state.buffers.depth.getReversed();if(X.camera._reversedDepth=ie,X.map===null||H===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Tr){if($.isPointLight){Ve("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Ln(i.x,i.y,{format:is,type:hi,minFilter:It,magFilter:It,generateMipmaps:!1}),X.map.texture.name=$.name+".shadowMap",X.map.depthTexture=new ks(i.x,i.y,mn),X.map.depthTexture.name=$.name+".shadowMapDepth",X.map.depthTexture.format=ui,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Wt,X.map.depthTexture.magFilter=Wt}else $.isPointLight?(X.map=new Ad(i.x),X.map.depthTexture=new p0(i.x,Bn)):(X.map=new Ln(i.x,i.y),X.map.depthTexture=new ks(i.x,i.y,Bn)),X.map.depthTexture.name=$.name+".shadowMap",X.map.depthTexture.format=ui,this.type===ya?(X.map.depthTexture.compareFunction=ie?Cl:El,X.map.depthTexture.minFilter=It,X.map.depthTexture.magFilter=It):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Wt,X.map.depthTexture.magFilter=Wt);X.camera.updateProjectionMatrix()}const ae=X.map.isWebGLCubeRenderTarget?6:1;for(let Y=0;Y<ae;Y++){if(X.map.isWebGLCubeRenderTarget)s.setRenderTarget(X.map,Y),s.clear();else{Y===0&&(s.setRenderTarget(X.map),s.clear());const O=X.getViewport(Y);a.set(r.x*O.x,r.y*O.y,r.x*O.z,r.y*O.w),D.viewport(a)}if($.isPointLight){const O=X.camera,U=X.matrix,J=$.distance||O.far;J!==O.far&&(O.far=J,O.updateProjectionMatrix()),ta.setFromMatrixPosition($.matrixWorld),O.position.copy(ta),Yh.copy(O.position),Yh.add(J1[Y]),O.up.copy(K1[Y]),O.lookAt(Yh),O.updateMatrixWorld(),U.makeTranslation(-ta.x,-ta.y,-ta.z),dp.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),X._frustum.setFromProjectionMatrix(dp,O.coordinateSystem,O.reversedDepth)}else X.updateMatrices($);n=X.getFrustum(),y(C,_,X.camera,$,this.type)}X.isPointLightShadow!==!0&&this.type===Tr&&v(X,_),X.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(E,A,P)};function v(S,C){const _=e.update(x);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ln(i.x,i.y,{format:is,type:hi})),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(C,null,_,u,x,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(C,null,_,f,x,null)}function b(S,C,_,E){let A=null;const P=_.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)A=P;else if(A=_.isPointLight===!0?c:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const D=A.uuid,H=C.uuid;let W=l[D];W===void 0&&(W={},l[D]=W);let B=W[H];B===void 0&&(B=A.clone(),W[H]=B,C.addEventListener("dispose",w)),A=B}if(A.visible=C.visible,A.wireframe=C.wireframe,E===Tr?A.side=C.shadowSide!==null?C.shadowSide:C.side:A.side=C.shadowSide!==null?C.shadowSide:d[C.side],A.alphaMap=C.alphaMap,A.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,A.map=C.map,A.clipShadows=C.clipShadows,A.clippingPlanes=C.clippingPlanes,A.clipIntersection=C.clipIntersection,A.displacementMap=C.displacementMap,A.displacementScale=C.displacementScale,A.displacementBias=C.displacementBias,A.wireframeLinewidth=C.wireframeLinewidth,A.linewidth=C.linewidth,_.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const D=s.properties.get(A);D.light=_}return A}function y(S,C,_,E,A){if(S.visible===!1)return;if(S.layers.test(C.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&A===Tr)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,S.matrixWorld);const H=e.update(S),W=S.material;if(Array.isArray(W)){const B=H.groups;for(let $=0,X=B.length;$<X;$++){const he=B[$],ie=W[he.materialIndex];if(ie&&ie.visible){const ae=b(S,ie,E,A);S.onBeforeShadow(s,S,C,_,H,ae,he),s.renderBufferDirect(_,null,H,ae,S,he),S.onAfterShadow(s,S,C,_,H,ae,he)}}}else if(W.visible){const B=b(S,W,E,A);S.onBeforeShadow(s,S,C,_,H,B,null),s.renderBufferDirect(_,null,H,B,S,null),S.onAfterShadow(s,S,C,_,H,B,null)}}const D=S.children;for(let H=0,W=D.length;H<W;H++)y(D[H],C,_,E,A)}function w(S){S.target.removeEventListener("dispose",w);for(const _ in l){const E=l[_],A=S.target.uuid;A in E&&(E[A].dispose(),delete E[A])}}}function Q1(s,e){function t(){let Z=!1;const De=new Ct;let le=null;const ze=new Ct(0,0,0,0);return{setMask:function(Ge){le!==Ge&&!Z&&(s.colorMask(Ge,Ge,Ge,Ge),le=Ge)},setLocked:function(Ge){Z=Ge},setClear:function(Ge,Te,Qe,We,Tt){Tt===!0&&(Ge*=We,Te*=We,Qe*=We),De.set(Ge,Te,Qe,We),ze.equals(De)===!1&&(s.clearColor(Ge,Te,Qe,We),ze.copy(De))},reset:function(){Z=!1,le=null,ze.set(-1,0,0,0)}}}function n(){let Z=!1,De=!1,le=null,ze=null,Ge=null;return{setReversed:function(Te){if(De!==Te){const Qe=e.get("EXT_clip_control");Te?Qe.clipControlEXT(Qe.LOWER_LEFT_EXT,Qe.ZERO_TO_ONE_EXT):Qe.clipControlEXT(Qe.LOWER_LEFT_EXT,Qe.NEGATIVE_ONE_TO_ONE_EXT),De=Te;const We=Ge;Ge=null,this.setClear(We)}},getReversed:function(){return De},setTest:function(Te){Te?se(s.DEPTH_TEST):_e(s.DEPTH_TEST)},setMask:function(Te){le!==Te&&!Z&&(s.depthMask(Te),le=Te)},setFunc:function(Te){if(De&&(Te=mx[Te]),ze!==Te){switch(Te){case bc:s.depthFunc(s.NEVER);break;case Sc:s.depthFunc(s.ALWAYS);break;case wc:s.depthFunc(s.LESS);break;case Fs:s.depthFunc(s.LEQUAL);break;case Ac:s.depthFunc(s.EQUAL);break;case Tc:s.depthFunc(s.GEQUAL);break;case Ec:s.depthFunc(s.GREATER);break;case Cc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ze=Te}},setLocked:function(Te){Z=Te},setClear:function(Te){Ge!==Te&&(Ge=Te,De&&(Te=1-Te),s.clearDepth(Te))},reset:function(){Z=!1,le=null,ze=null,Ge=null,De=!1}}}function i(){let Z=!1,De=null,le=null,ze=null,Ge=null,Te=null,Qe=null,We=null,Tt=null;return{setTest:function(je){Z||(je?se(s.STENCIL_TEST):_e(s.STENCIL_TEST))},setMask:function(je){De!==je&&!Z&&(s.stencilMask(je),De=je)},setFunc:function(je,lt,ot){(le!==je||ze!==lt||Ge!==ot)&&(s.stencilFunc(je,lt,ot),le=je,ze=lt,Ge=ot)},setOp:function(je,lt,ot){(Te!==je||Qe!==lt||We!==ot)&&(s.stencilOp(je,lt,ot),Te=je,Qe=lt,We=ot)},setLocked:function(je){Z=je},setClear:function(je){Tt!==je&&(s.clearStencil(je),Tt=je)},reset:function(){Z=!1,De=null,le=null,ze=null,Ge=null,Te=null,Qe=null,We=null,Tt=null}}}const r=new t,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},d={},u={},f=new WeakMap,p=[],x=null,m=!1,g=null,v=null,b=null,y=null,w=null,S=null,C=null,_=new ke(0,0,0),E=0,A=!1,P=null,D=null,H=null,W=null,B=null;const $=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,he=0;const ie=s.getParameter(s.VERSION);ie.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(ie)[1]),X=he>=1):ie.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),X=he>=2);let ae=null,Y={};const O=s.getParameter(s.SCISSOR_BOX),U=s.getParameter(s.VIEWPORT),J=new Ct().fromArray(O),ne=new Ct().fromArray(U);function V(Z,De,le,ze){const Ge=new Uint8Array(4),Te=s.createTexture();s.bindTexture(Z,Te),s.texParameteri(Z,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(Z,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Qe=0;Qe<le;Qe++)Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY?s.texImage3D(De,0,s.RGBA,1,1,ze,0,s.RGBA,s.UNSIGNED_BYTE,Ge):s.texImage2D(De+Qe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ge);return Te}const re={};re[s.TEXTURE_2D]=V(s.TEXTURE_2D,s.TEXTURE_2D,1),re[s.TEXTURE_CUBE_MAP]=V(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[s.TEXTURE_2D_ARRAY]=V(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),re[s.TEXTURE_3D]=V(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(s.DEPTH_TEST),a.setFunc(Fs),k(!1),q(mu),se(s.CULL_FACE),N(ci);function se(Z){h[Z]!==!0&&(s.enable(Z),h[Z]=!0)}function _e(Z){h[Z]!==!1&&(s.disable(Z),h[Z]=!1)}function Ae(Z,De){return u[Z]!==De?(s.bindFramebuffer(Z,De),u[Z]=De,Z===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=De),Z===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=De),!0):!1}function Pe(Z,De){let le=p,ze=!1;if(Z){le=f.get(De),le===void 0&&(le=[],f.set(De,le));const Ge=Z.textures;if(le.length!==Ge.length||le[0]!==s.COLOR_ATTACHMENT0){for(let Te=0,Qe=Ge.length;Te<Qe;Te++)le[Te]=s.COLOR_ATTACHMENT0+Te;le.length=Ge.length,ze=!0}}else le[0]!==s.BACK&&(le[0]=s.BACK,ze=!0);ze&&s.drawBuffers(le)}function Ue(Z){return x!==Z?(s.useProgram(Z),x=Z,!0):!1}const Fe={[Ji]:s.FUNC_ADD,[wm]:s.FUNC_SUBTRACT,[Am]:s.FUNC_REVERSE_SUBTRACT};Fe[Tm]=s.MIN,Fe[Em]=s.MAX;const F={[Cm]:s.ZERO,[Rm]:s.ONE,[Im]:s.SRC_COLOR,[vc]:s.SRC_ALPHA,[Fm]:s.SRC_ALPHA_SATURATE,[Nm]:s.DST_COLOR,[Lm]:s.DST_ALPHA,[Pm]:s.ONE_MINUS_SRC_COLOR,[Mc]:s.ONE_MINUS_SRC_ALPHA,[Um]:s.ONE_MINUS_DST_COLOR,[Dm]:s.ONE_MINUS_DST_ALPHA,[Om]:s.CONSTANT_COLOR,[Bm]:s.ONE_MINUS_CONSTANT_COLOR,[zm]:s.CONSTANT_ALPHA,[km]:s.ONE_MINUS_CONSTANT_ALPHA};function N(Z,De,le,ze,Ge,Te,Qe,We,Tt,je){if(Z===ci){m===!0&&(_e(s.BLEND),m=!1);return}if(m===!1&&(se(s.BLEND),m=!0),Z!==Sm){if(Z!==g||je!==A){if((v!==Ji||w!==Ji)&&(s.blendEquation(s.FUNC_ADD),v=Ji,w=Ji),je)switch(Z){case Ns:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ia:s.blendFunc(s.ONE,s.ONE);break;case gu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case xu:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:at("WebGLState: Invalid blending: ",Z);break}else switch(Z){case Ns:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ia:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case gu:at("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xu:at("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:at("WebGLState: Invalid blending: ",Z);break}b=null,y=null,S=null,C=null,_.set(0,0,0),E=0,g=Z,A=je}return}Ge=Ge||De,Te=Te||le,Qe=Qe||ze,(De!==v||Ge!==w)&&(s.blendEquationSeparate(Fe[De],Fe[Ge]),v=De,w=Ge),(le!==b||ze!==y||Te!==S||Qe!==C)&&(s.blendFuncSeparate(F[le],F[ze],F[Te],F[Qe]),b=le,y=ze,S=Te,C=Qe),(We.equals(_)===!1||Tt!==E)&&(s.blendColor(We.r,We.g,We.b,Tt),_.copy(We),E=Tt),g=Z,A=!1}function G(Z,De){Z.side===ii?_e(s.CULL_FACE):se(s.CULL_FACE);let le=Z.side===gn;De&&(le=!le),k(le),Z.blending===Ns&&Z.transparent===!1?N(ci):N(Z.blending,Z.blendEquation,Z.blendSrc,Z.blendDst,Z.blendEquationAlpha,Z.blendSrcAlpha,Z.blendDstAlpha,Z.blendColor,Z.blendAlpha,Z.premultipliedAlpha),a.setFunc(Z.depthFunc),a.setTest(Z.depthTest),a.setMask(Z.depthWrite),r.setMask(Z.colorWrite);const ze=Z.stencilWrite;o.setTest(ze),ze&&(o.setMask(Z.stencilWriteMask),o.setFunc(Z.stencilFunc,Z.stencilRef,Z.stencilFuncMask),o.setOp(Z.stencilFail,Z.stencilZFail,Z.stencilZPass)),oe(Z.polygonOffset,Z.polygonOffsetFactor,Z.polygonOffsetUnits),Z.alphaToCoverage===!0?se(s.SAMPLE_ALPHA_TO_COVERAGE):_e(s.SAMPLE_ALPHA_TO_COVERAGE)}function k(Z){P!==Z&&(Z?s.frontFace(s.CW):s.frontFace(s.CCW),P=Z)}function q(Z){Z!==Mm?(se(s.CULL_FACE),Z!==D&&(Z===mu?s.cullFace(s.BACK):Z===bm?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):_e(s.CULL_FACE),D=Z}function de(Z){Z!==H&&(X&&s.lineWidth(Z),H=Z)}function oe(Z,De,le){Z?(se(s.POLYGON_OFFSET_FILL),(W!==De||B!==le)&&(W=De,B=le,a.getReversed()&&(De=-De),s.polygonOffset(De,le))):_e(s.POLYGON_OFFSET_FILL)}function Me(Z){Z?se(s.SCISSOR_TEST):_e(s.SCISSOR_TEST)}function we(Z){Z===void 0&&(Z=s.TEXTURE0+$-1),ae!==Z&&(s.activeTexture(Z),ae=Z)}function L(Z,De,le){le===void 0&&(ae===null?le=s.TEXTURE0+$-1:le=ae);let ze=Y[le];ze===void 0&&(ze={type:void 0,texture:void 0},Y[le]=ze),(ze.type!==Z||ze.texture!==De)&&(ae!==le&&(s.activeTexture(le),ae=le),s.bindTexture(Z,De||re[Z]),ze.type=Z,ze.texture=De)}function Ke(){const Z=Y[ae];Z!==void 0&&Z.type!==void 0&&(s.bindTexture(Z.type,null),Z.type=void 0,Z.texture=void 0)}function qe(){try{s.compressedTexImage2D(...arguments)}catch(Z){at("WebGLState:",Z)}}function R(){try{s.compressedTexImage3D(...arguments)}catch(Z){at("WebGLState:",Z)}}function M(){try{s.texSubImage2D(...arguments)}catch(Z){at("WebGLState:",Z)}}function K(){try{s.texSubImage3D(...arguments)}catch(Z){at("WebGLState:",Z)}}function te(){try{s.compressedTexSubImage2D(...arguments)}catch(Z){at("WebGLState:",Z)}}function ce(){try{s.compressedTexSubImage3D(...arguments)}catch(Z){at("WebGLState:",Z)}}function Re(){try{s.texStorage2D(...arguments)}catch(Z){at("WebGLState:",Z)}}function Ce(){try{s.texStorage3D(...arguments)}catch(Z){at("WebGLState:",Z)}}function ge(){try{s.texImage2D(...arguments)}catch(Z){at("WebGLState:",Z)}}function be(){try{s.texImage3D(...arguments)}catch(Z){at("WebGLState:",Z)}}function Le(Z){return d[Z]!==void 0?d[Z]:s.getParameter(Z)}function Ze(Z,De){d[Z]!==De&&(s.pixelStorei(Z,De),d[Z]=De)}function Ne(Z){J.equals(Z)===!1&&(s.scissor(Z.x,Z.y,Z.z,Z.w),J.copy(Z))}function Be(Z){ne.equals(Z)===!1&&(s.viewport(Z.x,Z.y,Z.z,Z.w),ne.copy(Z))}function Je(Z,De){let le=l.get(De);le===void 0&&(le=new WeakMap,l.set(De,le));let ze=le.get(Z);ze===void 0&&(ze=s.getUniformBlockIndex(De,Z.name),le.set(Z,ze))}function rt(Z,De){const ze=l.get(De).get(Z);c.get(De)!==ze&&(s.uniformBlockBinding(De,ze,Z.__bindingPointIndex),c.set(De,ze))}function ct(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},ae=null,Y={},u={},f=new WeakMap,p=[],x=null,m=!1,g=null,v=null,b=null,y=null,w=null,S=null,C=null,_=new ke(0,0,0),E=0,A=!1,P=null,D=null,H=null,W=null,B=null,J.set(0,0,s.canvas.width,s.canvas.height),ne.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:se,disable:_e,bindFramebuffer:Ae,drawBuffers:Pe,useProgram:Ue,setBlending:N,setMaterial:G,setFlipSided:k,setCullFace:q,setLineWidth:de,setPolygonOffset:oe,setScissorTest:Me,activeTexture:we,bindTexture:L,unbindTexture:Ke,compressedTexImage2D:qe,compressedTexImage3D:R,texImage2D:ge,texImage3D:be,pixelStorei:Ze,getParameter:Le,updateUBOMapping:Je,uniformBlockBinding:rt,texStorage2D:Re,texStorage3D:Ce,texSubImage2D:M,texSubImage3D:K,compressedTexSubImage2D:te,compressedTexSubImage3D:ce,scissor:Ne,viewport:Be,reset:ct}}function ew(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ie,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,M){return p?new OffscreenCanvas(R,M):ka("canvas")}function m(R,M,K){let te=1;const ce=qe(R);if((ce.width>K||ce.height>K)&&(te=K/Math.max(ce.width,ce.height)),te<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Re=Math.floor(te*ce.width),Ce=Math.floor(te*ce.height);u===void 0&&(u=x(Re,Ce));const ge=M?x(Re,Ce):u;return ge.width=Re,ge.height=Ce,ge.getContext("2d").drawImage(R,0,0,Re,Ce),Ve("WebGLRenderer: Texture has been resized from ("+ce.width+"x"+ce.height+") to ("+Re+"x"+Ce+")."),ge}else return"data"in R&&Ve("WebGLRenderer: Image in DataTexture is too big ("+ce.width+"x"+ce.height+")."),R;return R}function g(R){return R.generateMipmaps}function v(R){s.generateMipmap(R)}function b(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(R,M,K,te,ce,Re=!1){if(R!==null){if(s[R]!==void 0)return s[R];Ve("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Ce;te&&(Ce=e.get("EXT_texture_norm16"),Ce||Ve("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ge=M;if(M===s.RED&&(K===s.FLOAT&&(ge=s.R32F),K===s.HALF_FLOAT&&(ge=s.R16F),K===s.UNSIGNED_BYTE&&(ge=s.R8),K===s.UNSIGNED_SHORT&&Ce&&(ge=Ce.R16_EXT),K===s.SHORT&&Ce&&(ge=Ce.R16_SNORM_EXT)),M===s.RED_INTEGER&&(K===s.UNSIGNED_BYTE&&(ge=s.R8UI),K===s.UNSIGNED_SHORT&&(ge=s.R16UI),K===s.UNSIGNED_INT&&(ge=s.R32UI),K===s.BYTE&&(ge=s.R8I),K===s.SHORT&&(ge=s.R16I),K===s.INT&&(ge=s.R32I)),M===s.RG&&(K===s.FLOAT&&(ge=s.RG32F),K===s.HALF_FLOAT&&(ge=s.RG16F),K===s.UNSIGNED_BYTE&&(ge=s.RG8),K===s.UNSIGNED_SHORT&&Ce&&(ge=Ce.RG16_EXT),K===s.SHORT&&Ce&&(ge=Ce.RG16_SNORM_EXT)),M===s.RG_INTEGER&&(K===s.UNSIGNED_BYTE&&(ge=s.RG8UI),K===s.UNSIGNED_SHORT&&(ge=s.RG16UI),K===s.UNSIGNED_INT&&(ge=s.RG32UI),K===s.BYTE&&(ge=s.RG8I),K===s.SHORT&&(ge=s.RG16I),K===s.INT&&(ge=s.RG32I)),M===s.RGB_INTEGER&&(K===s.UNSIGNED_BYTE&&(ge=s.RGB8UI),K===s.UNSIGNED_SHORT&&(ge=s.RGB16UI),K===s.UNSIGNED_INT&&(ge=s.RGB32UI),K===s.BYTE&&(ge=s.RGB8I),K===s.SHORT&&(ge=s.RGB16I),K===s.INT&&(ge=s.RGB32I)),M===s.RGBA_INTEGER&&(K===s.UNSIGNED_BYTE&&(ge=s.RGBA8UI),K===s.UNSIGNED_SHORT&&(ge=s.RGBA16UI),K===s.UNSIGNED_INT&&(ge=s.RGBA32UI),K===s.BYTE&&(ge=s.RGBA8I),K===s.SHORT&&(ge=s.RGBA16I),K===s.INT&&(ge=s.RGBA32I)),M===s.RGB&&(K===s.UNSIGNED_SHORT&&Ce&&(ge=Ce.RGB16_EXT),K===s.SHORT&&Ce&&(ge=Ce.RGB16_SNORM_EXT),K===s.UNSIGNED_INT_5_9_9_9_REV&&(ge=s.RGB9_E5),K===s.UNSIGNED_INT_10F_11F_11F_REV&&(ge=s.R11F_G11F_B10F)),M===s.RGBA){const be=Re?Ba:yt.getTransfer(ce);K===s.FLOAT&&(ge=s.RGBA32F),K===s.HALF_FLOAT&&(ge=s.RGBA16F),K===s.UNSIGNED_BYTE&&(ge=be===Et?s.SRGB8_ALPHA8:s.RGBA8),K===s.UNSIGNED_SHORT&&Ce&&(ge=Ce.RGBA16_EXT),K===s.SHORT&&Ce&&(ge=Ce.RGBA16_SNORM_EXT),K===s.UNSIGNED_SHORT_4_4_4_4&&(ge=s.RGBA4),K===s.UNSIGNED_SHORT_5_5_5_1&&(ge=s.RGB5_A1)}return(ge===s.R16F||ge===s.R32F||ge===s.RG16F||ge===s.RG32F||ge===s.RGBA16F||ge===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ge}function w(R,M){let K;return R?M===null||M===Bn||M===Lr?K=s.DEPTH24_STENCIL8:M===mn?K=s.DEPTH32F_STENCIL8:M===Pr&&(K=s.DEPTH24_STENCIL8,Ve("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Bn||M===Lr?K=s.DEPTH_COMPONENT24:M===mn?K=s.DEPTH_COMPONENT32F:M===Pr&&(K=s.DEPTH_COMPONENT16),K}function S(R,M){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Wt&&R.minFilter!==It?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function C(R){const M=R.target;M.removeEventListener("dispose",C),E(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&d.delete(M)}function _(R){const M=R.target;M.removeEventListener("dispose",_),P(M)}function E(R){const M=n.get(R);if(M.__webglInit===void 0)return;const K=R.source,te=f.get(K);if(te){const ce=te[M.__cacheKey];ce.usedTimes--,ce.usedTimes===0&&A(R),Object.keys(te).length===0&&f.delete(K)}n.remove(R)}function A(R){const M=n.get(R);s.deleteTexture(M.__webglTexture);const K=R.source,te=f.get(K);delete te[M.__cacheKey],a.memory.textures--}function P(R){const M=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(M.__webglFramebuffer[te]))for(let ce=0;ce<M.__webglFramebuffer[te].length;ce++)s.deleteFramebuffer(M.__webglFramebuffer[te][ce]);else s.deleteFramebuffer(M.__webglFramebuffer[te]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[te])}else{if(Array.isArray(M.__webglFramebuffer))for(let te=0;te<M.__webglFramebuffer.length;te++)s.deleteFramebuffer(M.__webglFramebuffer[te]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let te=0;te<M.__webglColorRenderbuffer.length;te++)M.__webglColorRenderbuffer[te]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[te]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const K=R.textures;for(let te=0,ce=K.length;te<ce;te++){const Re=n.get(K[te]);Re.__webglTexture&&(s.deleteTexture(Re.__webglTexture),a.memory.textures--),n.remove(K[te])}n.remove(R)}let D=0;function H(){D=0}function W(){return D}function B(R){D=R}function $(){const R=D;return R>=i.maxTextures&&Ve("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+i.maxTextures),D+=1,R}function X(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function he(R,M){const K=n.get(R);if(R.isVideoTexture&&L(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&K.__version!==R.version){const te=R.image;if(te===null)Ve("WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)Ve("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(K,R,M);return}}else R.isExternalTexture&&(K.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,K.__webglTexture,s.TEXTURE0+M)}function ie(R,M){const K=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&K.__version!==R.version){_e(K,R,M);return}else R.isExternalTexture&&(K.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,K.__webglTexture,s.TEXTURE0+M)}function ae(R,M){const K=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&K.__version!==R.version){_e(K,R,M);return}t.bindTexture(s.TEXTURE_3D,K.__webglTexture,s.TEXTURE0+M)}function Y(R,M){const K=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&K.__version!==R.version){Ae(K,R,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture,s.TEXTURE0+M)}const O={[Pa]:s.REPEAT,[on]:s.CLAMP_TO_EDGE,[La]:s.MIRRORED_REPEAT},U={[Wt]:s.NEAREST,[Wu]:s.NEAREST_MIPMAP_NEAREST,[Er]:s.NEAREST_MIPMAP_LINEAR,[It]:s.LINEAR,[ba]:s.LINEAR_MIPMAP_NEAREST,[si]:s.LINEAR_MIPMAP_LINEAR},J={[Zm]:s.NEVER,[e0]:s.ALWAYS,[Jm]:s.LESS,[El]:s.LEQUAL,[Km]:s.EQUAL,[Cl]:s.GEQUAL,[jm]:s.GREATER,[Qm]:s.NOTEQUAL};function ne(R,M){if(M.type===mn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===It||M.magFilter===ba||M.magFilter===Er||M.magFilter===si||M.minFilter===It||M.minFilter===ba||M.minFilter===Er||M.minFilter===si)&&Ve("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,O[M.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,O[M.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,O[M.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,U[M.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,U[M.minFilter]),M.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,J[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Wt||M.minFilter!==Er&&M.minFilter!==si||M.type===mn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const K=e.get("EXT_texture_filter_anisotropic");s.texParameterf(R,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function V(R,M){let K=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",C));const te=M.source;let ce=f.get(te);ce===void 0&&(ce={},f.set(te,ce));const Re=X(M);if(Re!==R.__cacheKey){ce[Re]===void 0&&(ce[Re]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,K=!0),ce[Re].usedTimes++;const Ce=ce[R.__cacheKey];Ce!==void 0&&(ce[R.__cacheKey].usedTimes--,Ce.usedTimes===0&&A(M)),R.__cacheKey=Re,R.__webglTexture=ce[Re].texture}return K}function re(R,M,K){return Math.floor(Math.floor(R/K)/M)}function se(R,M,K,te){const Re=R.updateRanges;if(Re.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,K,te,M.data);else{Re.sort((Ze,Ne)=>Ze.start-Ne.start);let Ce=0;for(let Ze=1;Ze<Re.length;Ze++){const Ne=Re[Ce],Be=Re[Ze],Je=Ne.start+Ne.count,rt=re(Be.start,M.width,4),ct=re(Ne.start,M.width,4);Be.start<=Je+1&&rt===ct&&re(Be.start+Be.count-1,M.width,4)===rt?Ne.count=Math.max(Ne.count,Be.start+Be.count-Ne.start):(++Ce,Re[Ce]=Be)}Re.length=Ce+1;const ge=t.getParameter(s.UNPACK_ROW_LENGTH),be=t.getParameter(s.UNPACK_SKIP_PIXELS),Le=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let Ze=0,Ne=Re.length;Ze<Ne;Ze++){const Be=Re[Ze],Je=Math.floor(Be.start/4),rt=Math.ceil(Be.count/4),ct=Je%M.width,Z=Math.floor(Je/M.width),De=rt,le=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,ct),t.pixelStorei(s.UNPACK_SKIP_ROWS,Z),t.texSubImage2D(s.TEXTURE_2D,0,ct,Z,De,le,K,te,M.data)}R.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,ge),t.pixelStorei(s.UNPACK_SKIP_PIXELS,be),t.pixelStorei(s.UNPACK_SKIP_ROWS,Le)}}function _e(R,M,K){let te=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(te=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(te=s.TEXTURE_3D);const ce=V(R,M),Re=M.source;t.bindTexture(te,R.__webglTexture,s.TEXTURE0+K);const Ce=n.get(Re);if(Re.version!==Ce.__version||ce===!0){if(t.activeTexture(s.TEXTURE0+K),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const le=yt.getPrimaries(yt.workingColorSpace),ze=M.colorSpace===Ai?null:yt.getPrimaries(M.colorSpace),Ge=M.colorSpace===Ai||le===ze?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge)}t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment);let be=m(M.image,!1,i.maxTextureSize);be=Ke(M,be);const Le=r.convert(M.format,M.colorSpace),Ze=r.convert(M.type);let Ne=y(M.internalFormat,Le,Ze,M.normalized,M.colorSpace,M.isVideoTexture);ne(te,M);let Be;const Je=M.mipmaps,rt=M.isVideoTexture!==!0,ct=Ce.__version===void 0||ce===!0,Z=Re.dataReady,De=S(M,be);if(M.isDepthTexture)Ne=w(M.format===Ki,M.type),ct&&(rt?t.texStorage2D(s.TEXTURE_2D,1,Ne,be.width,be.height):t.texImage2D(s.TEXTURE_2D,0,Ne,be.width,be.height,0,Le,Ze,null));else if(M.isDataTexture)if(Je.length>0){rt&&ct&&t.texStorage2D(s.TEXTURE_2D,De,Ne,Je[0].width,Je[0].height);for(let le=0,ze=Je.length;le<ze;le++)Be=Je[le],rt?Z&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,Be.width,Be.height,Le,Ze,Be.data):t.texImage2D(s.TEXTURE_2D,le,Ne,Be.width,Be.height,0,Le,Ze,Be.data);M.generateMipmaps=!1}else rt?(ct&&t.texStorage2D(s.TEXTURE_2D,De,Ne,be.width,be.height),Z&&se(M,be,Le,Ze)):t.texImage2D(s.TEXTURE_2D,0,Ne,be.width,be.height,0,Le,Ze,be.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){rt&&ct&&t.texStorage3D(s.TEXTURE_2D_ARRAY,De,Ne,Je[0].width,Je[0].height,be.depth);for(let le=0,ze=Je.length;le<ze;le++)if(Be=Je[le],M.format!==cn)if(Le!==null)if(rt){if(Z)if(M.layerUpdates.size>0){const Ge=Ru(Be.width,Be.height,M.format,M.type);for(const Te of M.layerUpdates){const Qe=Be.data.subarray(Te*Ge/Be.data.BYTES_PER_ELEMENT,(Te+1)*Ge/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,Te,Be.width,Be.height,1,Le,Qe)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,Be.width,Be.height,be.depth,Le,Be.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,le,Ne,Be.width,Be.height,be.depth,0,Be.data,0,0);else Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else rt?Z&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,Be.width,Be.height,be.depth,Le,Ze,Be.data):t.texImage3D(s.TEXTURE_2D_ARRAY,le,Ne,Be.width,Be.height,be.depth,0,Le,Ze,Be.data)}else{rt&&ct&&t.texStorage2D(s.TEXTURE_2D,De,Ne,Je[0].width,Je[0].height);for(let le=0,ze=Je.length;le<ze;le++)Be=Je[le],M.format!==cn?Le!==null?rt?Z&&t.compressedTexSubImage2D(s.TEXTURE_2D,le,0,0,Be.width,Be.height,Le,Be.data):t.compressedTexImage2D(s.TEXTURE_2D,le,Ne,Be.width,Be.height,0,Be.data):Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):rt?Z&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,Be.width,Be.height,Le,Ze,Be.data):t.texImage2D(s.TEXTURE_2D,le,Ne,Be.width,Be.height,0,Le,Ze,Be.data)}else if(M.isDataArrayTexture)if(rt){if(ct&&t.texStorage3D(s.TEXTURE_2D_ARRAY,De,Ne,be.width,be.height,be.depth),Z)if(M.layerUpdates.size>0){const le=Ru(be.width,be.height,M.format,M.type);for(const ze of M.layerUpdates){const Ge=be.data.subarray(ze*le/be.data.BYTES_PER_ELEMENT,(ze+1)*le/be.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ze,be.width,be.height,1,Le,Ze,Ge)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,be.width,be.height,be.depth,Le,Ze,be.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Ne,be.width,be.height,be.depth,0,Le,Ze,be.data);else if(M.isData3DTexture)rt?(ct&&t.texStorage3D(s.TEXTURE_3D,De,Ne,be.width,be.height,be.depth),Z&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,be.width,be.height,be.depth,Le,Ze,be.data)):t.texImage3D(s.TEXTURE_3D,0,Ne,be.width,be.height,be.depth,0,Le,Ze,be.data);else if(M.isFramebufferTexture){if(ct)if(rt)t.texStorage2D(s.TEXTURE_2D,De,Ne,be.width,be.height);else{let le=be.width,ze=be.height;for(let Ge=0;Ge<De;Ge++)t.texImage2D(s.TEXTURE_2D,Ge,Ne,le,ze,0,Le,Ze,null),le>>=1,ze>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in s){const le=s.canvas;if(le.hasAttribute("layoutsubtree")||le.setAttribute("layoutsubtree","true"),be.parentNode!==le){le.appendChild(be),d.add(M),le.onpaint=ze=>{const Ge=ze.changedElements;for(const Te of d)Ge.includes(Te.image)&&(Te.needsUpdate=!0)},le.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,be);else{const Ge=s.RGBA,Te=s.RGBA,Qe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Ge,Te,Qe,be)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Je.length>0){if(rt&&ct){const le=qe(Je[0]);t.texStorage2D(s.TEXTURE_2D,De,Ne,le.width,le.height)}for(let le=0,ze=Je.length;le<ze;le++)Be=Je[le],rt?Z&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,Le,Ze,Be):t.texImage2D(s.TEXTURE_2D,le,Ne,Le,Ze,Be);M.generateMipmaps=!1}else if(rt){if(ct){const le=qe(be);t.texStorage2D(s.TEXTURE_2D,De,Ne,le.width,le.height)}Z&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Le,Ze,be)}else t.texImage2D(s.TEXTURE_2D,0,Ne,Le,Ze,be);g(M)&&v(te),Ce.__version=Re.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Ae(R,M,K){if(M.image.length!==6)return;const te=V(R,M),ce=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+K);const Re=n.get(ce);if(ce.version!==Re.__version||te===!0){t.activeTexture(s.TEXTURE0+K);const Ce=yt.getPrimaries(yt.workingColorSpace),ge=M.colorSpace===Ai?null:yt.getPrimaries(M.colorSpace),be=M.colorSpace===Ai||Ce===ge?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Le=M.isCompressedTexture||M.image[0].isCompressedTexture,Ze=M.image[0]&&M.image[0].isDataTexture,Ne=[];for(let Te=0;Te<6;Te++)!Le&&!Ze?Ne[Te]=m(M.image[Te],!0,i.maxCubemapSize):Ne[Te]=Ze?M.image[Te].image:M.image[Te],Ne[Te]=Ke(M,Ne[Te]);const Be=Ne[0],Je=r.convert(M.format,M.colorSpace),rt=r.convert(M.type),ct=y(M.internalFormat,Je,rt,M.normalized,M.colorSpace),Z=M.isVideoTexture!==!0,De=Re.__version===void 0||te===!0,le=ce.dataReady;let ze=S(M,Be);ne(s.TEXTURE_CUBE_MAP,M);let Ge;if(Le){Z&&De&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ze,ct,Be.width,Be.height);for(let Te=0;Te<6;Te++){Ge=Ne[Te].mipmaps;for(let Qe=0;Qe<Ge.length;Qe++){const We=Ge[Qe];M.format!==cn?Je!==null?Z?le&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe,0,0,We.width,We.height,Je,We.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe,ct,We.width,We.height,0,We.data):Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Z?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe,0,0,We.width,We.height,Je,rt,We.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe,ct,We.width,We.height,0,Je,rt,We.data)}}}else{if(Ge=M.mipmaps,Z&&De){Ge.length>0&&ze++;const Te=qe(Ne[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ze,ct,Te.width,Te.height)}for(let Te=0;Te<6;Te++)if(Ze){Z?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,Ne[Te].width,Ne[Te].height,Je,rt,Ne[Te].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,ct,Ne[Te].width,Ne[Te].height,0,Je,rt,Ne[Te].data);for(let Qe=0;Qe<Ge.length;Qe++){const Tt=Ge[Qe].image[Te].image;Z?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe+1,0,0,Tt.width,Tt.height,Je,rt,Tt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe+1,ct,Tt.width,Tt.height,0,Je,rt,Tt.data)}}else{Z?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,Je,rt,Ne[Te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,ct,Je,rt,Ne[Te]);for(let Qe=0;Qe<Ge.length;Qe++){const We=Ge[Qe];Z?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe+1,0,0,Je,rt,We.image[Te]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Qe+1,ct,Je,rt,We.image[Te])}}}g(M)&&v(s.TEXTURE_CUBE_MAP),Re.__version=ce.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Pe(R,M,K,te,ce,Re){const Ce=r.convert(K.format,K.colorSpace),ge=r.convert(K.type),be=y(K.internalFormat,Ce,ge,K.normalized,K.colorSpace),Le=n.get(M),Ze=n.get(K);if(Ze.__renderTarget=M,!Le.__hasExternalTextures){const Ne=Math.max(1,M.width>>Re),Be=Math.max(1,M.height>>Re);ce===s.TEXTURE_3D||ce===s.TEXTURE_2D_ARRAY?t.texImage3D(ce,Re,be,Ne,Be,M.depth,0,Ce,ge,null):t.texImage2D(ce,Re,be,Ne,Be,0,Ce,ge,null)}t.bindFramebuffer(s.FRAMEBUFFER,R),we(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,te,ce,Ze.__webglTexture,0,Me(M)):(ce===s.TEXTURE_2D||ce>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ce<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,te,ce,Ze.__webglTexture,Re),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ue(R,M,K){if(s.bindRenderbuffer(s.RENDERBUFFER,R),M.depthBuffer){const te=M.depthTexture,ce=te&&te.isDepthTexture?te.type:null,Re=w(M.stencilBuffer,ce),Ce=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;we(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Me(M),Re,M.width,M.height):K?s.renderbufferStorageMultisample(s.RENDERBUFFER,Me(M),Re,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,Re,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ce,s.RENDERBUFFER,R)}else{const te=M.textures;for(let ce=0;ce<te.length;ce++){const Re=te[ce],Ce=r.convert(Re.format,Re.colorSpace),ge=r.convert(Re.type),be=y(Re.internalFormat,Ce,ge,Re.normalized,Re.colorSpace);we(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Me(M),be,M.width,M.height):K?s.renderbufferStorageMultisample(s.RENDERBUFFER,Me(M),be,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,be,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Fe(R,M,K){const te=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ce=n.get(M.depthTexture);if(ce.__renderTarget=M,(!ce.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),te){if(ce.__webglInit===void 0&&(ce.__webglInit=!0,M.depthTexture.addEventListener("dispose",C)),ce.__webglTexture===void 0){ce.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,ce.__webglTexture),ne(s.TEXTURE_CUBE_MAP,M.depthTexture);const Le=r.convert(M.depthTexture.format),Ze=r.convert(M.depthTexture.type);let Ne;M.depthTexture.format===ui?Ne=s.DEPTH_COMPONENT24:M.depthTexture.format===Ki&&(Ne=s.DEPTH24_STENCIL8);for(let Be=0;Be<6;Be++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Be,0,Ne,M.width,M.height,0,Le,Ze,null)}}else he(M.depthTexture,0);const Re=ce.__webglTexture,Ce=Me(M),ge=te?s.TEXTURE_CUBE_MAP_POSITIVE_X+K:s.TEXTURE_2D,be=M.depthTexture.format===Ki?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===ui)we(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,be,ge,Re,0,Ce):s.framebufferTexture2D(s.FRAMEBUFFER,be,ge,Re,0);else if(M.depthTexture.format===Ki)we(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,be,ge,Re,0,Ce):s.framebufferTexture2D(s.FRAMEBUFFER,be,ge,Re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function F(R){const M=n.get(R),K=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const te=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),te){const ce=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,te.removeEventListener("dispose",ce)};te.addEventListener("dispose",ce),M.__depthDisposeCallback=ce}M.__boundDepthTexture=te}if(R.depthTexture&&!M.__autoAllocateDepthBuffer)if(K)for(let te=0;te<6;te++)Fe(M.__webglFramebuffer[te],R,te);else{const te=R.texture.mipmaps;te&&te.length>0?Fe(M.__webglFramebuffer[0],R,0):Fe(M.__webglFramebuffer,R,0)}else if(K){M.__webglDepthbuffer=[];for(let te=0;te<6;te++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[te]),M.__webglDepthbuffer[te]===void 0)M.__webglDepthbuffer[te]=s.createRenderbuffer(),Ue(M.__webglDepthbuffer[te],R,!1);else{const ce=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Re=M.__webglDepthbuffer[te];s.bindRenderbuffer(s.RENDERBUFFER,Re),s.framebufferRenderbuffer(s.FRAMEBUFFER,ce,s.RENDERBUFFER,Re)}}else{const te=R.texture.mipmaps;if(te&&te.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),Ue(M.__webglDepthbuffer,R,!1);else{const ce=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Re=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Re),s.framebufferRenderbuffer(s.FRAMEBUFFER,ce,s.RENDERBUFFER,Re)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function N(R,M,K){const te=n.get(R);M!==void 0&&Pe(te.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),K!==void 0&&F(R)}function G(R){const M=R.texture,K=n.get(R),te=n.get(M);R.addEventListener("dispose",_);const ce=R.textures,Re=R.isWebGLCubeRenderTarget===!0,Ce=ce.length>1;if(Ce||(te.__webglTexture===void 0&&(te.__webglTexture=s.createTexture()),te.__version=M.version,a.memory.textures++),Re){K.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(M.mipmaps&&M.mipmaps.length>0){K.__webglFramebuffer[ge]=[];for(let be=0;be<M.mipmaps.length;be++)K.__webglFramebuffer[ge][be]=s.createFramebuffer()}else K.__webglFramebuffer[ge]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){K.__webglFramebuffer=[];for(let ge=0;ge<M.mipmaps.length;ge++)K.__webglFramebuffer[ge]=s.createFramebuffer()}else K.__webglFramebuffer=s.createFramebuffer();if(Ce)for(let ge=0,be=ce.length;ge<be;ge++){const Le=n.get(ce[ge]);Le.__webglTexture===void 0&&(Le.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&we(R)===!1){K.__webglMultisampledFramebuffer=s.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let ge=0;ge<ce.length;ge++){const be=ce[ge];K.__webglColorRenderbuffer[ge]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,K.__webglColorRenderbuffer[ge]);const Le=r.convert(be.format,be.colorSpace),Ze=r.convert(be.type),Ne=y(be.internalFormat,Le,Ze,be.normalized,be.colorSpace,R.isXRRenderTarget===!0),Be=Me(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,Be,Ne,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ge,s.RENDERBUFFER,K.__webglColorRenderbuffer[ge])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(K.__webglDepthRenderbuffer=s.createRenderbuffer(),Ue(K.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Re){t.bindTexture(s.TEXTURE_CUBE_MAP,te.__webglTexture),ne(s.TEXTURE_CUBE_MAP,M);for(let ge=0;ge<6;ge++)if(M.mipmaps&&M.mipmaps.length>0)for(let be=0;be<M.mipmaps.length;be++)Pe(K.__webglFramebuffer[ge][be],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be);else Pe(K.__webglFramebuffer[ge],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);g(M)&&v(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ce){for(let ge=0,be=ce.length;ge<be;ge++){const Le=ce[ge],Ze=n.get(Le);let Ne=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Ne=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Ne,Ze.__webglTexture),ne(Ne,Le),Pe(K.__webglFramebuffer,R,Le,s.COLOR_ATTACHMENT0+ge,Ne,0),g(Le)&&v(Ne)}t.unbindTexture()}else{let ge=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ge=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ge,te.__webglTexture),ne(ge,M),M.mipmaps&&M.mipmaps.length>0)for(let be=0;be<M.mipmaps.length;be++)Pe(K.__webglFramebuffer[be],R,M,s.COLOR_ATTACHMENT0,ge,be);else Pe(K.__webglFramebuffer,R,M,s.COLOR_ATTACHMENT0,ge,0);g(M)&&v(ge),t.unbindTexture()}R.depthBuffer&&F(R)}function k(R){const M=R.textures;for(let K=0,te=M.length;K<te;K++){const ce=M[K];if(g(ce)){const Re=b(R),Ce=n.get(ce).__webglTexture;t.bindTexture(Re,Ce),v(Re),t.unbindTexture()}}}const q=[],de=[];function oe(R){if(R.samples>0){if(we(R)===!1){const M=R.textures,K=R.width,te=R.height;let ce=s.COLOR_BUFFER_BIT;const Re=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ce=n.get(R),ge=M.length>1;if(ge)for(let Le=0;Le<M.length;Le++)t.bindFramebuffer(s.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ce.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer);const be=R.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer);for(let Le=0;Le<M.length;Le++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ce|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ce|=s.STENCIL_BUFFER_BIT)),ge){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ce.__webglColorRenderbuffer[Le]);const Ze=n.get(M[Le]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ze,0)}s.blitFramebuffer(0,0,K,te,0,0,K,te,ce,s.NEAREST),c===!0&&(q.length=0,de.length=0,q.push(s.COLOR_ATTACHMENT0+Le),R.depthBuffer&&R.resolveDepthBuffer===!1&&(q.push(Re),de.push(Re),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,de)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,q))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ge)for(let Le=0;Le<M.length;Le++){t.bindFramebuffer(s.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.RENDERBUFFER,Ce.__webglColorRenderbuffer[Le]);const Ze=n.get(M[Le]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ce.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.TEXTURE_2D,Ze,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const M=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function Me(R){return Math.min(i.maxSamples,R.samples)}function we(R){const M=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function L(R){const M=a.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function Ke(R,M){const K=R.colorSpace,te=R.format,ce=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||K!==Oa&&K!==Ai&&(yt.getTransfer(K)===Et?(te!==cn||ce!==Mn)&&Ve("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):at("WebGLTextures: Unsupported texture color space:",K)),M}function qe(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=H,this.getTextureUnits=W,this.setTextureUnits=B,this.setTexture2D=he,this.setTexture2DArray=ie,this.setTexture3D=ae,this.setTextureCube=Y,this.rebindTextures=N,this.setupRenderTarget=G,this.updateRenderTargetMipmap=k,this.updateMultisampleRenderTarget=oe,this.setupDepthRenderbuffer=F,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=we,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function lg(s,e){function t(n,i=Ai){let r;const a=yt.getTransfer(i);if(n===Mn)return s.UNSIGNED_BYTE;if(n===Ml)return s.UNSIGNED_SHORT_4_4_4_4;if(n===bl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Yu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===$u)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Xu)return s.BYTE;if(n===qu)return s.SHORT;if(n===Pr)return s.UNSIGNED_SHORT;if(n===vl)return s.INT;if(n===Bn)return s.UNSIGNED_INT;if(n===mn)return s.FLOAT;if(n===hi)return s.HALF_FLOAT;if(n===Zu)return s.ALPHA;if(n===Ju)return s.RGB;if(n===cn)return s.RGBA;if(n===ui)return s.DEPTH_COMPONENT;if(n===Ki)return s.DEPTH_STENCIL;if(n===Sl)return s.RED;if(n===Ja)return s.RED_INTEGER;if(n===is)return s.RG;if(n===wl)return s.RG_INTEGER;if(n===Al)return s.RGBA_INTEGER;if(n===Sa||n===wa||n===Aa||n===Ta)if(a===Et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Sa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Sa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===wa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ta)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Rc||n===Ic||n===Pc||n===Lc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Rc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ic)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Lc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dc||n===Nc||n===Uc||n===Fc||n===Oc||n===Da||n===Bc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dc||n===Nc)return a===Et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Uc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Fc)return r.COMPRESSED_R11_EAC;if(n===Oc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Da)return r.COMPRESSED_RG11_EAC;if(n===Bc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===zc||n===kc||n===Vc||n===Gc||n===Hc||n===Wc||n===Xc||n===qc||n===Yc||n===$c||n===Zc||n===Jc||n===Kc||n===jc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===zc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===kc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Gc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Hc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===qc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$c)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Kc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===jc)return a===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qc||n===el||n===tl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qc)return a===Et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===el)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===tl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nl||n===il||n===Na||n===sl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===nl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===il)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Na)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Lr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const tw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class iw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new rd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new kn({vertexShader:tw,fragmentShader:nw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Bt(new Hs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class sw extends Kn{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,p=null;const x=typeof XRWebGLBinding<"u",m=new iw,g={},v=t.getContextAttributes();let b=null,y=null;const w=[],S=[],C=new Ie;let _=null;const E=new $t;E.viewport=new Ct;const A=new $t;A.viewport=new Ct;const P=[E,A],D=new J0;let H=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let re=w[V];return re===void 0&&(re=new _c,w[V]=re),re.getTargetRaySpace()},this.getControllerGrip=function(V){let re=w[V];return re===void 0&&(re=new _c,w[V]=re),re.getGripSpace()},this.getHand=function(V){let re=w[V];return re===void 0&&(re=new _c,w[V]=re),re.getHandSpace()};function B(V){const re=S.indexOf(V.inputSource);if(re===-1)return;const se=w[re];se!==void 0&&(se.update(V.inputSource,V.frame,l||a),se.dispatchEvent({type:V.type,data:V.inputSource}))}function $(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",X);for(let V=0;V<w.length;V++){const re=S[V];re!==null&&(S[V]=null,w[V].disconnect(re))}H=null,W=null,m.reset();for(const V in g)delete g[V];e.setRenderTarget(b),f=null,u=null,d=null,i=null,y=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&Ve("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&Ve("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(V){l=V},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",$),i.addEventListener("inputsourceschange",X),v.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let se=null,_e=null,Ae=null;v.depth&&(Ae=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=v.stencil?Ki:ui,_e=v.stencil?Lr:Bn);const Pe={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Pe),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new Ln(u.textureWidth,u.textureHeight,{format:cn,type:Mn,depthTexture:new ks(u.textureWidth,u.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const se={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,se),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Ln(f.framebufferWidth,f.framebufferHeight,{format:cn,type:Mn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(V){for(let re=0;re<V.removed.length;re++){const se=V.removed[re],_e=S.indexOf(se);_e>=0&&(S[_e]=null,w[_e].disconnect(se))}for(let re=0;re<V.added.length;re++){const se=V.added[re];let _e=S.indexOf(se);if(_e===-1){for(let Pe=0;Pe<w.length;Pe++)if(Pe>=S.length){S.push(se),_e=Pe;break}else if(S[Pe]===null){S[Pe]=se,_e=Pe;break}if(_e===-1)break}const Ae=w[_e];Ae&&Ae.connect(se)}}const he=new I,ie=new I;function ae(V,re,se){he.setFromMatrixPosition(re.matrixWorld),ie.setFromMatrixPosition(se.matrixWorld);const _e=he.distanceTo(ie),Ae=re.projectionMatrix.elements,Pe=se.projectionMatrix.elements,Ue=Ae[14]/(Ae[10]-1),Fe=Ae[14]/(Ae[10]+1),F=(Ae[9]+1)/Ae[5],N=(Ae[9]-1)/Ae[5],G=(Ae[8]-1)/Ae[0],k=(Pe[8]+1)/Pe[0],q=Ue*G,de=Ue*k,oe=_e/(-G+k),Me=oe*-G;if(re.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Me),V.translateZ(oe),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Ae[10]===-1)V.projectionMatrix.copy(re.projectionMatrix),V.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const we=Ue+oe,L=Fe+oe,Ke=q-Me,qe=de+(_e-Me),R=F*Fe/L*we,M=N*Fe/L*we;V.projectionMatrix.makePerspective(Ke,qe,R,M,we,L),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function Y(V,re){re===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(re.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;let re=V.near,se=V.far;m.texture!==null&&(m.depthNear>0&&(re=m.depthNear),m.depthFar>0&&(se=m.depthFar)),D.near=A.near=E.near=re,D.far=A.far=E.far=se,(H!==D.near||W!==D.far)&&(i.updateRenderState({depthNear:D.near,depthFar:D.far}),H=D.near,W=D.far),D.layers.mask=V.layers.mask|6,E.layers.mask=D.layers.mask&-5,A.layers.mask=D.layers.mask&-3;const _e=V.parent,Ae=D.cameras;Y(D,_e);for(let Pe=0;Pe<Ae.length;Pe++)Y(Ae[Pe],_e);Ae.length===2?ae(D,E,A):D.projectionMatrix.copy(E.projectionMatrix),O(V,D,_e)};function O(V,re,se){se===null?V.matrix.copy(re.matrixWorld):(V.matrix.copy(se.matrixWorld),V.matrix.invert(),V.matrix.multiply(re.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(re.projectionMatrix),V.projectionMatrixInverse.copy(re.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=Dr*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(V){c=V,u!==null&&(u.fixedFoveation=V),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=V)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(V){return g[V]};let U=null;function J(V,re){if(h=re.getViewerPose(l||a),p=re,h!==null){const se=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let _e=!1;se.length!==D.cameras.length&&(D.cameras.length=0,_e=!0);for(let Fe=0;Fe<se.length;Fe++){const F=se[Fe];let N=null;if(f!==null)N=f.getViewport(F);else{const k=d.getViewSubImage(u,F);N=k.viewport,Fe===0&&(e.setRenderTargetTextures(y,k.colorTexture,k.depthStencilTexture),e.setRenderTarget(y))}let G=P[Fe];G===void 0&&(G=new $t,G.layers.enable(Fe),G.viewport=new Ct,P[Fe]=G),G.matrix.fromArray(F.transform.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale),G.projectionMatrix.fromArray(F.projectionMatrix),G.projectionMatrixInverse.copy(G.projectionMatrix).invert(),G.viewport.set(N.x,N.y,N.width,N.height),Fe===0&&(D.matrix.copy(G.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),_e===!0&&D.cameras.push(G)}const Ae=i.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const Fe=d.getDepthInformation(se[0]);Fe&&Fe.isValid&&Fe.texture&&m.init(Fe,i.renderState)}if(Ae&&Ae.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let Fe=0;Fe<se.length;Fe++){const F=se[Fe].camera;if(F){let N=g[F];N||(N=new rd,g[F]=N);const G=d.getCameraImage(F);N.sourceTexture=G}}}}for(let se=0;se<w.length;se++){const _e=S[se],Ae=w[se];_e!==null&&Ae!==void 0&&Ae.update(_e,re,l||a)}U&&U(V,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),p=null}const ne=new ig;ne.setAnimationLoop(J),this.setAnimationLoop=function(V){U=V},this.dispose=function(){}}}const rw=new dt,hg=new pt;hg.set(-1,0,0,0,1,0,0,0,1);function aw(s,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,E0(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,v,b,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),d(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),u(m,g),g.isMeshPhysicalMaterial&&f(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),x(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?c(m,g,v,b):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===gn&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===gn&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const v=e.get(g),b=v.envMap,y=v.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(rw.makeRotationFromEuler(y)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(hg),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,v,b){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*v,m.scale.value=b*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,v){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===gn&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const v=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function ow(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,w){const S=w.program;n.uniformBlockBinding(y,S)}function l(y,w){let S=i[y.id];S===void 0&&(m(y),S=h(y),i[y.id]=S,y.addEventListener("dispose",v));const C=w.program;n.updateUBOMapping(y,C);const _=e.render.frame;r[y.id]!==_&&(u(y),r[y.id]=_)}function h(y){const w=d();y.__bindingPointIndex=w;const S=s.createBuffer(),C=y.__size,_=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,S),s.bufferData(s.UNIFORM_BUFFER,C,_),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,w,S),S}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return at("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const w=i[y.id],S=y.uniforms,C=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,w);for(let _=0,E=S.length;_<E;_++){const A=S[_];if(Array.isArray(A))for(let P=0,D=A.length;P<D;P++)f(A[P],_,P,C);else f(A,_,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,w,S,C){if(x(y,w,S,C)===!0){const _=y.__offset,E=y.value;if(Array.isArray(E)){let A=0;for(let P=0;P<E.length;P++){const D=E[P],H=g(D);p(D,y.__data,A),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(A+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,_,y.__data)}}function p(y,w,S){typeof y=="number"||typeof y=="boolean"?w[0]=y:y.isMatrix3?(w[0]=y.elements[0],w[1]=y.elements[1],w[2]=y.elements[2],w[3]=0,w[4]=y.elements[3],w[5]=y.elements[4],w[6]=y.elements[5],w[7]=0,w[8]=y.elements[6],w[9]=y.elements[7],w[10]=y.elements[8],w[11]=0):ArrayBuffer.isView(y)?w.set(new y.constructor(y.buffer,y.byteOffset,w.length)):y.toArray(w,S)}function x(y,w,S,C){const _=y.value,E=w+"_"+S;if(C[E]===void 0)return typeof _=="number"||typeof _=="boolean"?C[E]=_:ArrayBuffer.isView(_)?C[E]=_.slice():C[E]=_.clone(),!0;{const A=C[E];if(typeof _=="number"||typeof _=="boolean"){if(A!==_)return C[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(A.equals(_)===!1)return A.copy(_),!0}}return!1}function m(y){const w=y.uniforms;let S=0;const C=16;for(let E=0,A=w.length;E<A;E++){const P=Array.isArray(w[E])?w[E]:[w[E]];for(let D=0,H=P.length;D<H;D++){const W=P[D],B=Array.isArray(W.value)?W.value:[W.value];for(let $=0,X=B.length;$<X;$++){const he=B[$],ie=g(he),ae=S%C,Y=ae%ie.boundary,O=ae+Y;S+=Y,O!==0&&C-O<ie.storage&&(S+=C-O),W.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=S,S+=ie.storage}}}const _=S%C;return _>0&&(S+=C-_),y.__size=S,y.__cache={},this}function g(y){const w={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(w.boundary=4,w.storage=4):y.isVector2?(w.boundary=8,w.storage=8):y.isVector3||y.isColor?(w.boundary=16,w.storage=12):y.isVector4?(w.boundary=16,w.storage=16):y.isMatrix3?(w.boundary=48,w.storage=48):y.isMatrix4?(w.boundary=64,w.storage=64):y.isTexture?Ve("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(w.boundary=16,w.storage=y.byteLength):Ve("WebGLRenderer: Unsupported uniform value type.",y),w}function v(y){const w=y.target;w.removeEventListener("dispose",v);const S=a.indexOf(w.__bindingPointIndex);a.splice(S,1),s.deleteBuffer(i[w.id]),delete i[w.id],delete r[w.id]}function b(){for(const y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:c,update:l,dispose:b}}const cw=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ei=null;function lw(){return ei===null&&(ei=new Dn(cw,16,16,is,hi),ei.name="DFG_LUT",ei.minFilter=It,ei.magFilter=It,ei.wrapS=on,ei.wrapT=on,ei.generateMipmaps=!1,ei.needsUpdate=!0),ei}class ug{constructor(e={}){const{canvas:t=n0(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Mn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const x=f,m=new Set([Al,wl,Ja]),g=new Set([Mn,Bn,Pr,Lr,Ml,bl]),v=new Uint32Array(4),b=new Int32Array(4),y=new I;let w=null,S=null;const C=[],_=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const A=this;let P=!1,D=null,H=null,W=null,B=null;this._outputColorSpace=fn;let $=0,X=0,he=null,ie=-1,ae=null;const Y=new Ct,O=new Ct;let U=null;const J=new ke(0);let ne=0,V=t.width,re=t.height,se=1,_e=null,Ae=null;const Pe=new Ct(0,0,V,re),Ue=new Ct(0,0,V,re);let Fe=!1;const F=new zs;let N=!1,G=!1;const k=new dt,q=new I,de=new Ct,oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Me=!1;function we(){return he===null?se:1}let L=n;function Ke(T,Q){return t.getContext(T,Q)}try{const T={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${xl}`),t.addEventListener("webglcontextlost",Tt,!1),t.addEventListener("webglcontextrestored",je,!1),t.addEventListener("webglcontextcreationerror",lt,!1),L===null){const Q="webgl2";if(L=Ke(Q,T),L===null)throw Ke(Q)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(T){throw at("WebGLRenderer: "+T.message),T}let qe,R,M,K,te,ce,Re,Ce,ge,be,Le,Ze,Ne,Be,Je,rt,ct,Z,De,le,ze,Ge,Te;function Qe(){qe=new hS(L),qe.init(),ze=new lg(L,qe),R=new nS(L,qe,e,ze),M=new Q1(L,qe),R.reversedDepthBuffer&&u&&M.buffers.depth.setReversed(!0),H=L.createFramebuffer(),W=L.createFramebuffer(),B=L.createFramebuffer(),K=new fS(L),te=new z1,ce=new ew(L,qe,M,te,R,ze,K),Re=new lS(A),Ce=new xv(L),Ge=new eS(L,Ce),ge=new uS(L,Ce,K,Ge),be=new mS(L,ge,Ce,Ge,K),Z=new pS(L,R,ce),Je=new iS(te),Le=new B1(A,Re,qe,R,Ge,Je),Ze=new aw(A,te),Ne=new V1,Be=new Y1(qe),ct=new Qb(A,Re,M,be,p,c),rt=new j1(A,be,R),Te=new ow(L,K,R,M),De=new tS(L,qe,K),le=new dS(L,qe,K),K.programs=Le.programs,A.capabilities=R,A.extensions=qe,A.properties=te,A.renderLists=Ne,A.shadowMap=rt,A.state=M,A.info=K}Qe(),x!==Mn&&(E=new xS(x,t.width,t.height,o,i,r));const We=new sw(A,L);this.xr=We,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const T=qe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=qe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(T){T!==void 0&&(se=T,this.setSize(V,re,!1))},this.getSize=function(T){return T.set(V,re)},this.setSize=function(T,Q,xe=!0){if(We.isPresenting){Ve("WebGLRenderer: Can't change size while VR device is presenting.");return}V=T,re=Q,t.width=Math.floor(T*se),t.height=Math.floor(Q*se),xe===!0&&(t.style.width=T+"px",t.style.height=Q+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,T,Q)},this.getDrawingBufferSize=function(T){return T.set(V*se,re*se).floor()},this.setDrawingBufferSize=function(T,Q,xe){V=T,re=Q,se=xe,t.width=Math.floor(T*xe),t.height=Math.floor(Q*xe),this.setViewport(0,0,T,Q)},this.setEffects=function(T){if(x===Mn){at("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let Q=0;Q<T.length;Q++)if(T[Q].isOutputPass===!0){Ve("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(Y)},this.getViewport=function(T){return T.copy(Pe)},this.setViewport=function(T,Q,xe,pe){T.isVector4?Pe.set(T.x,T.y,T.z,T.w):Pe.set(T,Q,xe,pe),M.viewport(Y.copy(Pe).multiplyScalar(se).round())},this.getScissor=function(T){return T.copy(Ue)},this.setScissor=function(T,Q,xe,pe){T.isVector4?Ue.set(T.x,T.y,T.z,T.w):Ue.set(T,Q,xe,pe),M.scissor(O.copy(Ue).multiplyScalar(se).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(T){M.setScissorTest(Fe=T)},this.setOpaqueSort=function(T){_e=T},this.setTransparentSort=function(T){Ae=T},this.getClearColor=function(T){return T.copy(ct.getClearColor())},this.setClearColor=function(){ct.setClearColor(...arguments)},this.getClearAlpha=function(){return ct.getClearAlpha()},this.setClearAlpha=function(){ct.setClearAlpha(...arguments)},this.clear=function(T=!0,Q=!0,xe=!0){let pe=0;if(T){let me=!1;if(he!==null){const z=he.texture.format;me=m.has(z)}if(me){const z=he.texture.type,ee=g.has(z),j=ct.getClearColor(),ue=ct.getClearAlpha(),fe=j.r,ye=j.g,Se=j.b;ee?(v[0]=fe,v[1]=ye,v[2]=Se,v[3]=ue,L.clearBufferuiv(L.COLOR,0,v)):(b[0]=fe,b[1]=ye,b[2]=Se,b[3]=ue,L.clearBufferiv(L.COLOR,0,b))}else pe|=L.COLOR_BUFFER_BIT}Q&&(pe|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),xe&&(pe|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),pe!==0&&L.clear(pe)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),D=T},this.dispose=function(){t.removeEventListener("webglcontextlost",Tt,!1),t.removeEventListener("webglcontextrestored",je,!1),t.removeEventListener("webglcontextcreationerror",lt,!1),ct.dispose(),Ne.dispose(),Be.dispose(),te.dispose(),Re.dispose(),be.dispose(),Ge.dispose(),Te.dispose(),Le.dispose(),We.dispose(),We.removeEventListener("sessionstart",_n),We.removeEventListener("sessionend",Gn),nn.stop()};function Tt(T){T.preventDefault(),Va("WebGLRenderer: Context Lost."),P=!0}function je(){Va("WebGLRenderer: Context Restored."),P=!1;const T=K.autoReset,Q=rt.enabled,xe=rt.autoUpdate,pe=rt.needsUpdate,me=rt.type;Qe(),K.autoReset=T,rt.enabled=Q,rt.autoUpdate=xe,rt.needsUpdate=pe,rt.type=me}function lt(T){at("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ot(T){const Q=T.target;Q.removeEventListener("dispose",ot),Vt(Q)}function Vt(T){hn(T),te.remove(T)}function hn(T){const Q=te.get(T).programs;Q!==void 0&&(Q.forEach(function(xe){Le.releaseProgram(xe)}),T.isShaderMaterial&&Le.releaseShaderCache(T))}this.renderBufferDirect=function(T,Q,xe,pe,me,z){Q===null&&(Q=oe);const ee=me.isMesh&&me.matrixWorld.determinantAffine()<0,j=Nn(T,Q,xe,pe,me);M.setMaterial(pe,ee);let ue=xe.index,fe=1;if(pe.wireframe===!0){if(ue=ge.getWireframeAttribute(xe),ue===void 0)return;fe=2}const ye=xe.drawRange,Se=xe.attributes.position;let ve=ye.start*fe,Oe=(ye.start+ye.count)*fe;z!==null&&(ve=Math.max(ve,z.start*fe),Oe=Math.min(Oe,(z.start+z.count)*fe)),ue!==null?(ve=Math.max(ve,0),Oe=Math.min(Oe,ue.count)):Se!=null&&(ve=Math.max(ve,0),Oe=Math.min(Oe,Se.count));const st=Oe-ve;if(st<0||st===1/0)return;Ge.setup(me,pe,j,xe,ue);let nt,it=De;if(ue!==null&&(nt=Ce.get(ue),it=le,it.setIndex(nt)),me.isMesh)pe.wireframe===!0?(M.setLineWidth(pe.wireframeLinewidth*we()),it.setMode(L.LINES)):it.setMode(L.TRIANGLES);else if(me.isLine){let et=pe.linewidth;et===void 0&&(et=1),M.setLineWidth(et*we()),me.isLineSegments?it.setMode(L.LINES):me.isLineLoop?it.setMode(L.LINE_LOOP):it.setMode(L.LINE_STRIP)}else me.isPoints?it.setMode(L.POINTS):me.isSprite&&it.setMode(L.TRIANGLES);if(me.isBatchedMesh)if(qe.get("WEBGL_multi_draw"))it.renderMultiDraw(me._multiDrawStarts,me._multiDrawCounts,me._multiDrawCount);else{const et=me._multiDrawStarts,Ee=me._multiDrawCounts,ft=me._multiDrawCount,ht=ue?Ce.get(ue).bytesPerElement:1,St=te.get(pe).currentProgram.getUniforms();for(let Ut=0;Ut<ft;Ut++)St.setValue(L,"_gl_DrawID",Ut),it.render(et[Ut]/ht,Ee[Ut])}else if(me.isInstancedMesh)it.renderInstances(ve,st,me.count);else if(xe.isInstancedBufferGeometry){const et=xe._maxInstanceCount!==void 0?xe._maxInstanceCount:1/0,Ee=Math.min(xe.instanceCount,et);it.renderInstances(ve,st,Ee)}else it.render(ve,st)};function fi(T,Q,xe){T.transparent===!0&&T.side===ii&&T.forceSinglePass===!1?(T.side=gn,T.needsUpdate=!0,_t(T,Q,xe),T.side=Ci,T.needsUpdate=!0,_t(T,Q,xe),T.side=ii):_t(T,Q,xe)}this.compile=function(T,Q,xe=null){xe===null&&(xe=T),S=Be.get(xe),S.init(Q),_.push(S),xe.traverseVisible(function(me){me.isLight&&me.layers.test(Q.layers)&&(S.pushLight(me),me.castShadow&&S.pushShadow(me))}),T!==xe&&T.traverseVisible(function(me){me.isLight&&me.layers.test(Q.layers)&&(S.pushLight(me),me.castShadow&&S.pushShadow(me))}),S.setupLights();const pe=new Set;return T.traverse(function(me){if(!(me.isMesh||me.isPoints||me.isLine||me.isSprite))return;const z=me.material;if(z)if(Array.isArray(z))for(let ee=0;ee<z.length;ee++){const j=z[ee];fi(j,xe,me),pe.add(j)}else fi(z,xe,me),pe.add(z)}),S=_.pop(),pe},this.compileAsync=function(T,Q,xe=null){const pe=this.compile(T,Q,xe);return new Promise(me=>{function z(){if(pe.forEach(function(ee){te.get(ee).currentProgram.isReady()&&pe.delete(ee)}),pe.size===0){me(T);return}setTimeout(z,10)}qe.get("KHR_parallel_shader_compile")!==null?z():setTimeout(z,10)})};let An=null;function Pi(T){An&&An(T)}function _n(){nn.stop()}function Gn(){nn.start()}const nn=new ig;nn.setAnimationLoop(Pi),typeof self<"u"&&nn.setContext(self),this.setAnimationLoop=function(T){An=T,We.setAnimationLoop(T),T===null?nn.stop():nn.start()},We.addEventListener("sessionstart",_n),We.addEventListener("sessionend",Gn),this.render=function(T,Q){if(Q!==void 0&&Q.isCamera!==!0){at("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(T,Q);const xe=We.enabled===!0&&We.isPresenting===!0,pe=E!==null&&(he===null||xe)&&E.begin(A,he);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),Q.parent===null&&Q.matrixWorldAutoUpdate===!0&&Q.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(We.cameraAutoUpdate===!0&&We.updateCamera(Q),Q=We.getCamera()),T.isScene===!0&&T.onBeforeRender(A,T,Q,he),S=Be.get(T,_.length),S.init(Q),S.state.textureUnits=ce.getTextureUnits(),_.push(S),k.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),F.setFromProjectionMatrix(k,In,Q.reversedDepth),G=this.localClippingEnabled,N=Je.init(this.clippingPlanes,G),w=Ne.get(T,C.length),w.init(),C.push(w),We.enabled===!0&&We.isPresenting===!0){const ee=A.xr.getDepthSensingMesh();ee!==null&&pi(ee,Q,-1/0,A.sortObjects)}pi(T,Q,0,A.sortObjects),w.finish(),A.sortObjects===!0&&w.sort(_e,Ae,Q.reversedDepth),Me=We.enabled===!1||We.isPresenting===!1||We.hasDepthSensing()===!1,Me&&ct.addToRenderList(w,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),N===!0&&Je.beginShadows();const me=S.state.shadowsArray;if(rt.render(me,T,Q),N===!0&&Je.endShadows(),(pe&&E.hasRenderPass())===!1){const ee=w.opaque,j=w.transmissive;if(S.setupLights(),Q.isArrayCamera){const ue=Q.cameras;if(j.length>0)for(let fe=0,ye=ue.length;fe<ye;fe++){const Se=ue[fe];mi(ee,j,T,Se)}Me&&ct.render(T);for(let fe=0,ye=ue.length;fe<ye;fe++){const Se=ue[fe];Li(w,T,Se,Se.viewport)}}else j.length>0&&mi(ee,j,T,Q),Me&&ct.render(T),Li(w,T,Q)}he!==null&&X===0&&(ce.updateMultisampleRenderTarget(he),ce.updateRenderTargetMipmap(he)),pe&&E.end(A),T.isScene===!0&&T.onAfterRender(A,T,Q),Ge.resetDefaultState(),ie=-1,ae=null,_.pop(),_.length>0?(S=_[_.length-1],ce.setTextureUnits(S.state.textureUnits),N===!0&&Je.setGlobalState(A.clippingPlanes,S.state.camera)):S=null,C.pop(),C.length>0?w=C[C.length-1]:w=null,D!==null&&D.renderEnd()};function pi(T,Q,xe,pe){if(T.visible===!1)return;if(T.layers.test(Q.layers)){if(T.isGroup)xe=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(Q);else if(T.isLightProbeGrid)S.pushLightProbeGrid(T);else if(T.isLight)S.pushLight(T),T.castShadow&&S.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||F.intersectsSprite(T)){pe&&de.setFromMatrixPosition(T.matrixWorld).applyMatrix4(k);const ee=be.update(T),j=T.material;j.visible&&w.push(T,ee,j,xe,de.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||F.intersectsObject(T))){const ee=be.update(T),j=T.material;if(pe&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),de.copy(T.boundingSphere.center)):(ee.boundingSphere===null&&ee.computeBoundingSphere(),de.copy(ee.boundingSphere.center)),de.applyMatrix4(T.matrixWorld).applyMatrix4(k)),Array.isArray(j)){const ue=ee.groups;for(let fe=0,ye=ue.length;fe<ye;fe++){const Se=ue[fe],ve=j[Se.materialIndex];ve&&ve.visible&&w.push(T,ee,ve,xe,de.z,Se)}}else j.visible&&w.push(T,ee,j,xe,de.z,null)}}const z=T.children;for(let ee=0,j=z.length;ee<j;ee++)pi(z[ee],Q,xe,pe)}function Li(T,Q,xe,pe){const{opaque:me,transmissive:z,transparent:ee}=T;S.setupLightsView(xe),N===!0&&Je.setGlobalState(A.clippingPlanes,xe),pe&&M.viewport(Y.copy(pe)),me.length>0&&Tn(me,Q,xe),z.length>0&&Tn(z,Q,xe),ee.length>0&&Tn(ee,Q,xe),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function mi(T,Q,xe,pe){if((xe.isScene===!0?xe.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[pe.id]===void 0){const ve=qe.has("EXT_color_buffer_half_float")||qe.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[pe.id]=new Ln(1,1,{generateMipmaps:!0,type:ve?hi:Mn,minFilter:si,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:yt.workingColorSpace})}const z=S.state.transmissionRenderTarget[pe.id],ee=pe.viewport||Y;z.setSize(ee.z*A.transmissionResolutionScale,ee.w*A.transmissionResolutionScale);const j=A.getRenderTarget(),ue=A.getActiveCubeFace(),fe=A.getActiveMipmapLevel();A.setRenderTarget(z),A.getClearColor(J),ne=A.getClearAlpha(),ne<1&&A.setClearColor(16777215,.5),A.clear(),Me&&ct.render(xe);const ye=A.toneMapping;A.toneMapping=Jn;const Se=pe.viewport;if(pe.viewport!==void 0&&(pe.viewport=void 0),S.setupLightsView(pe),N===!0&&Je.setGlobalState(A.clippingPlanes,pe),Tn(T,xe,pe),ce.updateMultisampleRenderTarget(z),ce.updateRenderTargetMipmap(z),qe.has("WEBGL_multisampled_render_to_texture")===!1){let ve=!1;for(let Oe=0,st=Q.length;Oe<st;Oe++){const nt=Q[Oe],{object:it,geometry:et,material:Ee,group:ft}=nt;if(Ee.side===ii&&it.layers.test(pe.layers)){const ht=Ee.side;Ee.side=gn,Ee.needsUpdate=!0,gi(it,xe,pe,et,Ee,ft),Ee.side=ht,Ee.needsUpdate=!0,ve=!0}}ve===!0&&(ce.updateMultisampleRenderTarget(z),ce.updateRenderTargetMipmap(z))}A.setRenderTarget(j,ue,fe),A.setClearColor(J,ne),Se!==void 0&&(pe.viewport=Se),A.toneMapping=ye}function Tn(T,Q,xe){const pe=Q.isScene===!0?Q.overrideMaterial:null;for(let me=0,z=T.length;me<z;me++){const ee=T[me],{object:j,geometry:ue,group:fe}=ee;let ye=ee.material;ye.allowOverride===!0&&pe!==null&&(ye=pe),j.layers.test(xe.layers)&&gi(j,Q,xe,ue,ye,fe)}}function gi(T,Q,xe,pe,me,z){T.onBeforeRender(A,Q,xe,pe,me,z),T.modelViewMatrix.multiplyMatrices(xe.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),me.onBeforeRender(A,Q,xe,pe,T,z),me.transparent===!0&&me.side===ii&&me.forceSinglePass===!1?(me.side=gn,me.needsUpdate=!0,A.renderBufferDirect(xe,Q,pe,me,T,z),me.side=Ci,me.needsUpdate=!0,A.renderBufferDirect(xe,Q,pe,me,T,z),me.side=ii):A.renderBufferDirect(xe,Q,pe,me,T,z),T.onAfterRender(A,Q,xe,pe,me,z)}function _t(T,Q,xe){Q.isScene!==!0&&(Q=oe);const pe=te.get(T),me=S.state.lights,z=S.state.shadowsArray,ee=me.state.version,j=Le.getParameters(T,me.state,z,Q,xe,S.state.lightProbeGridArray),ue=Le.getProgramCacheKey(j);let fe=pe.programs;pe.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?Q.environment:null,pe.fog=Q.fog;const ye=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;pe.envMap=Re.get(T.envMap||pe.environment,ye),pe.envMapRotation=pe.environment!==null&&T.envMap===null?Q.environmentRotation:T.envMapRotation,fe===void 0&&(T.addEventListener("dispose",ot),fe=new Map,pe.programs=fe);let Se=fe.get(ue);if(Se!==void 0){if(pe.currentProgram===Se&&pe.lightsStateVersion===ee)return Dt(T,j),Se}else j.uniforms=Le.getUniforms(T),D!==null&&T.isNodeMaterial&&D.build(T,xe,j),T.onBeforeCompile(j,A),Se=Le.acquireProgram(j,ue),fe.set(ue,Se),pe.uniforms=j.uniforms;const ve=pe.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(ve.clippingPlanes=Je.uniform),Dt(T,j),pe.needsLights=us(T),pe.lightsStateVersion=ee,pe.needsLights&&(ve.ambientLightColor.value=me.state.ambient,ve.lightProbe.value=me.state.probe,ve.directionalLights.value=me.state.directional,ve.directionalLightShadows.value=me.state.directionalShadow,ve.spotLights.value=me.state.spot,ve.spotLightShadows.value=me.state.spotShadow,ve.rectAreaLights.value=me.state.rectArea,ve.ltc_1.value=me.state.rectAreaLTC1,ve.ltc_2.value=me.state.rectAreaLTC2,ve.pointLights.value=me.state.point,ve.pointLightShadows.value=me.state.pointShadow,ve.hemisphereLights.value=me.state.hemi,ve.directionalShadowMatrix.value=me.state.directionalShadowMatrix,ve.spotLightMatrix.value=me.state.spotLightMatrix,ve.spotLightMap.value=me.state.spotLightMap,ve.pointShadowMatrix.value=me.state.pointShadowMatrix),pe.lightProbeGrid=S.state.lightProbeGridArray.length>0,pe.currentProgram=Se,pe.uniformsList=null,Se}function Yt(T){if(T.uniformsList===null){const Q=T.currentProgram.getUniforms();T.uniformsList=yc.seqWithValue(Q.seq,T.uniforms)}return T.uniformsList}function Dt(T,Q){const xe=te.get(T);xe.outputColorSpace=Q.outputColorSpace,xe.batching=Q.batching,xe.batchingColor=Q.batchingColor,xe.instancing=Q.instancing,xe.instancingColor=Q.instancingColor,xe.instancingMorph=Q.instancingMorph,xe.skinning=Q.skinning,xe.morphTargets=Q.morphTargets,xe.morphNormals=Q.morphNormals,xe.morphColors=Q.morphColors,xe.morphTargetsCount=Q.morphTargetsCount,xe.numClippingPlanes=Q.numClippingPlanes,xe.numIntersection=Q.numClipIntersection,xe.vertexAlphas=Q.vertexAlphas,xe.vertexTangents=Q.vertexTangents,xe.toneMapping=Q.toneMapping}function En(T,Q){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;y.setFromMatrixPosition(Q.matrixWorld);for(let xe=0,pe=T.length;xe<pe;xe++){const me=T[xe];if(me.texture!==null&&me.boundingBox.containsPoint(y))return me}return null}function Nn(T,Q,xe,pe,me){Q.isScene!==!0&&(Q=oe),ce.resetTextureUnits();const z=Q.fog,ee=pe.isMeshStandardMaterial||pe.isMeshLambertMaterial||pe.isMeshPhongMaterial?Q.environment:null,j=he===null?A.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:yt.workingColorSpace,ue=pe.isMeshStandardMaterial||pe.isMeshLambertMaterial&&!pe.envMap||pe.isMeshPhongMaterial&&!pe.envMap,fe=Re.get(pe.envMap||ee,ue),ye=pe.vertexColors===!0&&!!xe.attributes.color&&xe.attributes.color.itemSize===4,Se=!!xe.attributes.tangent&&(!!pe.normalMap||pe.anisotropy>0),ve=!!xe.morphAttributes.position,Oe=!!xe.morphAttributes.normal,st=!!xe.morphAttributes.color;let nt=Jn;pe.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(nt=A.toneMapping);const it=xe.morphAttributes.position||xe.morphAttributes.normal||xe.morphAttributes.color,et=it!==void 0?it.length:0,Ee=te.get(pe),ft=S.state.lights;if(N===!0&&(G===!0||T!==ae)){const Pt=T===ae&&pe.id===ie;Je.setState(pe,T,Pt)}let ht=!1;pe.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==ft.state.version||Ee.outputColorSpace!==j||me.isBatchedMesh&&Ee.batching===!1||!me.isBatchedMesh&&Ee.batching===!0||me.isBatchedMesh&&Ee.batchingColor===!0&&me.colorTexture===null||me.isBatchedMesh&&Ee.batchingColor===!1&&me.colorTexture!==null||me.isInstancedMesh&&Ee.instancing===!1||!me.isInstancedMesh&&Ee.instancing===!0||me.isSkinnedMesh&&Ee.skinning===!1||!me.isSkinnedMesh&&Ee.skinning===!0||me.isInstancedMesh&&Ee.instancingColor===!0&&me.instanceColor===null||me.isInstancedMesh&&Ee.instancingColor===!1&&me.instanceColor!==null||me.isInstancedMesh&&Ee.instancingMorph===!0&&me.morphTexture===null||me.isInstancedMesh&&Ee.instancingMorph===!1&&me.morphTexture!==null||Ee.envMap!==fe||pe.fog===!0&&Ee.fog!==z||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==Je.numPlanes||Ee.numIntersection!==Je.numIntersection)||Ee.vertexAlphas!==ye||Ee.vertexTangents!==Se||Ee.morphTargets!==ve||Ee.morphNormals!==Oe||Ee.morphColors!==st||Ee.toneMapping!==nt||Ee.morphTargetsCount!==et||!!Ee.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,Ee.__version=pe.version);let St=Ee.currentProgram;ht===!0&&(St=_t(pe,Q,me),D&&pe.isNodeMaterial&&D.onUpdateProgram(pe,St,Ee));let Ut=!1,Qt=!1,Hn=!1;const vt=St.getUniforms(),Gt=Ee.uniforms;if(M.useProgram(St.program)&&(Ut=!0,Qt=!0,Hn=!0),pe.id!==ie&&(ie=pe.id,Qt=!0),Ee.needsLights){const Pt=En(S.state.lightProbeGridArray,me);Ee.lightProbeGrid!==Pt&&(Ee.lightProbeGrid=Pt,Qt=!0)}if(Ut||ae!==T){M.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),vt.setValue(L,"projectionMatrix",T.projectionMatrix),vt.setValue(L,"viewMatrix",T.matrixWorldInverse);const Ni=vt.map.cameraPosition;Ni!==void 0&&Ni.setValue(L,q.setFromMatrixPosition(T.matrixWorld)),R.logarithmicDepthBuffer&&vt.setValue(L,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(pe.isMeshPhongMaterial||pe.isMeshToonMaterial||pe.isMeshLambertMaterial||pe.isMeshBasicMaterial||pe.isMeshStandardMaterial||pe.isShaderMaterial)&&vt.setValue(L,"isOrthographic",T.isOrthographicCamera===!0),ae!==T&&(ae=T,Qt=!0,Hn=!0)}if(Ee.needsLights&&(ft.state.directionalShadowMap.length>0&&vt.setValue(L,"directionalShadowMap",ft.state.directionalShadowMap,ce),ft.state.spotShadowMap.length>0&&vt.setValue(L,"spotShadowMap",ft.state.spotShadowMap,ce),ft.state.pointShadowMap.length>0&&vt.setValue(L,"pointShadowMap",ft.state.pointShadowMap,ce)),me.isSkinnedMesh){vt.setOptional(L,me,"bindMatrix"),vt.setOptional(L,me,"bindMatrixInverse");const Pt=me.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),vt.setValue(L,"boneTexture",Pt.boneTexture,ce))}me.isBatchedMesh&&(vt.setOptional(L,me,"batchingTexture"),vt.setValue(L,"batchingTexture",me._matricesTexture,ce),vt.setOptional(L,me,"batchingIdTexture"),vt.setValue(L,"batchingIdTexture",me._indirectTexture,ce),vt.setOptional(L,me,"batchingColorTexture"),me._colorsTexture!==null&&vt.setValue(L,"batchingColorTexture",me._colorsTexture,ce));const Di=xe.morphAttributes;if((Di.position!==void 0||Di.normal!==void 0||Di.color!==void 0)&&Z.update(me,xe,St),(Qt||Ee.receiveShadow!==me.receiveShadow)&&(Ee.receiveShadow=me.receiveShadow,vt.setValue(L,"receiveShadow",me.receiveShadow)),(pe.isMeshStandardMaterial||pe.isMeshLambertMaterial||pe.isMeshPhongMaterial)&&pe.envMap===null&&Q.environment!==null&&(Gt.envMapIntensity.value=Q.environmentIntensity),Gt.dfgLUT!==void 0&&(Gt.dfgLUT.value=lw()),Qt){if(vt.setValue(L,"toneMappingExposure",A.toneMappingExposure),Ee.needsLights&&Nt(Gt,Hn),z&&pe.fog===!0&&Ze.refreshFogUniforms(Gt,z),Ze.refreshMaterialUniforms(Gt,pe,se,re,S.state.transmissionRenderTarget[T.id]),Ee.needsLights&&Ee.lightProbeGrid){const Pt=Ee.lightProbeGrid;Gt.probesSH.value=Pt.texture,Gt.probesMin.value.copy(Pt.boundingBox.min),Gt.probesMax.value.copy(Pt.boundingBox.max),Gt.probesResolution.value.copy(Pt.resolution)}yc.upload(L,Yt(Ee),Gt,ce)}if(pe.isShaderMaterial&&pe.uniformsNeedUpdate===!0&&(yc.upload(L,Yt(Ee),Gt,ce),pe.uniformsNeedUpdate=!1),pe.isSpriteMaterial&&vt.setValue(L,"center",me.center),vt.setValue(L,"modelViewMatrix",me.modelViewMatrix),vt.setValue(L,"normalMatrix",me.normalMatrix),vt.setValue(L,"modelMatrix",me.matrixWorld),pe.uniformsGroups!==void 0){const Pt=pe.uniformsGroups;for(let Ni=0,qs=Pt.length;Ni<qs;Ni++){const Dd=Pt[Ni];Te.update(Dd,St),Te.bind(Dd,St)}}return St}function Nt(T,Q){T.ambientLightColor.needsUpdate=Q,T.lightProbe.needsUpdate=Q,T.directionalLights.needsUpdate=Q,T.directionalLightShadows.needsUpdate=Q,T.pointLights.needsUpdate=Q,T.pointLightShadows.needsUpdate=Q,T.spotLights.needsUpdate=Q,T.spotLightShadows.needsUpdate=Q,T.rectAreaLights.needsUpdate=Q,T.hemisphereLights.needsUpdate=Q}function us(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return he},this.setRenderTargetTextures=function(T,Q,xe){const pe=te.get(T);pe.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,pe.__autoAllocateDepthBuffer===!1&&(pe.__useRenderToTexture=!1),te.get(T.texture).__webglTexture=Q,te.get(T.depthTexture).__webglTexture=pe.__autoAllocateDepthBuffer?void 0:xe,pe.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,Q){const xe=te.get(T);xe.__webglFramebuffer=Q,xe.__useDefaultFramebuffer=Q===void 0},this.setRenderTarget=function(T,Q=0,xe=0){he=T,$=Q,X=xe;let pe=null,me=!1,z=!1;if(T){const j=te.get(T);if(j.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(L.FRAMEBUFFER,j.__webglFramebuffer),Y.copy(T.viewport),O.copy(T.scissor),U=T.scissorTest,M.viewport(Y),M.scissor(O),M.setScissorTest(U),ie=-1;return}else if(j.__webglFramebuffer===void 0)ce.setupRenderTarget(T);else if(j.__hasExternalTextures)ce.rebindTextures(T,te.get(T.texture).__webglTexture,te.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const ye=T.depthTexture;if(j.__boundDepthTexture!==ye){if(ye!==null&&te.has(ye)&&(T.width!==ye.image.width||T.height!==ye.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ce.setupDepthRenderbuffer(T)}}const ue=T.texture;(ue.isData3DTexture||ue.isDataArrayTexture||ue.isCompressedArrayTexture)&&(z=!0);const fe=te.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(fe[Q])?pe=fe[Q][xe]:pe=fe[Q],me=!0):T.samples>0&&ce.useMultisampledRTT(T)===!1?pe=te.get(T).__webglMultisampledFramebuffer:Array.isArray(fe)?pe=fe[xe]:pe=fe,Y.copy(T.viewport),O.copy(T.scissor),U=T.scissorTest}else Y.copy(Pe).multiplyScalar(se).floor(),O.copy(Ue).multiplyScalar(se).floor(),U=Fe;if(xe!==0&&(pe=H),M.bindFramebuffer(L.FRAMEBUFFER,pe)&&M.drawBuffers(T,pe),M.viewport(Y),M.scissor(O),M.setScissorTest(U),me){const j=te.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+Q,j.__webglTexture,xe)}else if(z){const j=Q;for(let ue=0;ue<T.textures.length;ue++){const fe=te.get(T.textures[ue]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+ue,fe.__webglTexture,xe,j)}}else if(T!==null&&xe!==0){const j=te.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,j.__webglTexture,xe)}ie=-1},this.readRenderTargetPixels=function(T,Q,xe,pe,me,z,ee,j=0){if(!(T&&T.isWebGLRenderTarget)){at("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ue=te.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ee!==void 0&&(ue=ue[ee]),ue){M.bindFramebuffer(L.FRAMEBUFFER,ue);try{const fe=T.textures[j],ye=fe.format,Se=fe.type;if(T.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+j),!R.textureFormatReadable(ye)){at("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Se)){at("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Q>=0&&Q<=T.width-pe&&xe>=0&&xe<=T.height-me&&L.readPixels(Q,xe,pe,me,ze.convert(ye),ze.convert(Se),z)}finally{const fe=he!==null?te.get(he).__webglFramebuffer:null;M.bindFramebuffer(L.FRAMEBUFFER,fe)}}},this.readRenderTargetPixelsAsync=async function(T,Q,xe,pe,me,z,ee,j=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ue=te.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ee!==void 0&&(ue=ue[ee]),ue)if(Q>=0&&Q<=T.width-pe&&xe>=0&&xe<=T.height-me){M.bindFramebuffer(L.FRAMEBUFFER,ue);const fe=T.textures[j],ye=fe.format,Se=fe.type;if(T.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+j),!R.textureFormatReadable(ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ve=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,ve),L.bufferData(L.PIXEL_PACK_BUFFER,z.byteLength,L.STREAM_READ),L.readPixels(Q,xe,pe,me,ze.convert(ye),ze.convert(Se),0);const Oe=he!==null?te.get(he).__webglFramebuffer:null;M.bindFramebuffer(L.FRAMEBUFFER,Oe);const st=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await px(L,st,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,ve),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,z),L.deleteBuffer(ve),L.deleteSync(st),z}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,Q=null,xe=0){const pe=Math.pow(2,-xe),me=Math.floor(T.image.width*pe),z=Math.floor(T.image.height*pe),ee=Q!==null?Q.x:0,j=Q!==null?Q.y:0;ce.setTexture2D(T,0),L.copyTexSubImage2D(L.TEXTURE_2D,xe,0,0,ee,j,me,z),M.unbindTexture()},this.copyTextureToTexture=function(T,Q,xe=null,pe=null,me=0,z=0){let ee,j,ue,fe,ye,Se,ve,Oe,st;const nt=T.isCompressedTexture?T.mipmaps[z]:T.image;if(xe!==null)ee=xe.max.x-xe.min.x,j=xe.max.y-xe.min.y,ue=xe.isBox3?xe.max.z-xe.min.z:1,fe=xe.min.x,ye=xe.min.y,Se=xe.isBox3?xe.min.z:0;else{const Gt=Math.pow(2,-me);ee=Math.floor(nt.width*Gt),j=Math.floor(nt.height*Gt),T.isDataArrayTexture?ue=nt.depth:T.isData3DTexture?ue=Math.floor(nt.depth*Gt):ue=1,fe=0,ye=0,Se=0}pe!==null?(ve=pe.x,Oe=pe.y,st=pe.z):(ve=0,Oe=0,st=0);const it=ze.convert(Q.format),et=ze.convert(Q.type);let Ee;Q.isData3DTexture?(ce.setTexture3D(Q,0),Ee=L.TEXTURE_3D):Q.isDataArrayTexture||Q.isCompressedArrayTexture?(ce.setTexture2DArray(Q,0),Ee=L.TEXTURE_2D_ARRAY):(ce.setTexture2D(Q,0),Ee=L.TEXTURE_2D),M.activeTexture(L.TEXTURE0),M.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,Q.flipY),M.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),M.pixelStorei(L.UNPACK_ALIGNMENT,Q.unpackAlignment);const ft=M.getParameter(L.UNPACK_ROW_LENGTH),ht=M.getParameter(L.UNPACK_IMAGE_HEIGHT),St=M.getParameter(L.UNPACK_SKIP_PIXELS),Ut=M.getParameter(L.UNPACK_SKIP_ROWS),Qt=M.getParameter(L.UNPACK_SKIP_IMAGES);M.pixelStorei(L.UNPACK_ROW_LENGTH,nt.width),M.pixelStorei(L.UNPACK_IMAGE_HEIGHT,nt.height),M.pixelStorei(L.UNPACK_SKIP_PIXELS,fe),M.pixelStorei(L.UNPACK_SKIP_ROWS,ye),M.pixelStorei(L.UNPACK_SKIP_IMAGES,Se);const Hn=T.isDataArrayTexture||T.isData3DTexture,vt=Q.isDataArrayTexture||Q.isData3DTexture;if(T.isDepthTexture){const Gt=te.get(T),Di=te.get(Q),Pt=te.get(Gt.__renderTarget),Ni=te.get(Di.__renderTarget);M.bindFramebuffer(L.READ_FRAMEBUFFER,Pt.__webglFramebuffer),M.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ni.__webglFramebuffer);for(let qs=0;qs<ue;qs++)Hn&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,te.get(T).__webglTexture,me,Se+qs),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,te.get(Q).__webglTexture,z,st+qs)),L.blitFramebuffer(fe,ye,ee,j,ve,Oe,ee,j,L.DEPTH_BUFFER_BIT,L.NEAREST);M.bindFramebuffer(L.READ_FRAMEBUFFER,null),M.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(me!==0||T.isRenderTargetTexture||te.has(T)){const Gt=te.get(T),Di=te.get(Q);M.bindFramebuffer(L.READ_FRAMEBUFFER,W),M.bindFramebuffer(L.DRAW_FRAMEBUFFER,B);for(let Pt=0;Pt<ue;Pt++)Hn?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Gt.__webglTexture,me,Se+Pt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Gt.__webglTexture,me),vt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Di.__webglTexture,z,st+Pt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Di.__webglTexture,z),me!==0?L.blitFramebuffer(fe,ye,ee,j,ve,Oe,ee,j,L.COLOR_BUFFER_BIT,L.NEAREST):vt?L.copyTexSubImage3D(Ee,z,ve,Oe,st+Pt,fe,ye,ee,j):L.copyTexSubImage2D(Ee,z,ve,Oe,fe,ye,ee,j);M.bindFramebuffer(L.READ_FRAMEBUFFER,null),M.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else vt?T.isDataTexture||T.isData3DTexture?L.texSubImage3D(Ee,z,ve,Oe,st,ee,j,ue,it,et,nt.data):Q.isCompressedArrayTexture?L.compressedTexSubImage3D(Ee,z,ve,Oe,st,ee,j,ue,it,nt.data):L.texSubImage3D(Ee,z,ve,Oe,st,ee,j,ue,it,et,nt):T.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,z,ve,Oe,ee,j,it,et,nt.data):T.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,z,ve,Oe,nt.width,nt.height,it,nt.data):L.texSubImage2D(L.TEXTURE_2D,z,ve,Oe,ee,j,it,et,nt);M.pixelStorei(L.UNPACK_ROW_LENGTH,ft),M.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ht),M.pixelStorei(L.UNPACK_SKIP_PIXELS,St),M.pixelStorei(L.UNPACK_SKIP_ROWS,Ut),M.pixelStorei(L.UNPACK_SKIP_IMAGES,Qt),z===0&&Q.generateMipmaps&&L.generateMipmap(Ee),M.unbindTexture()},this.initRenderTarget=function(T){te.get(T).__webglFramebuffer===void 0&&ce.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?ce.setTextureCube(T,0):T.isData3DTexture?ce.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?ce.setTexture2DArray(T,0):ce.setTexture2D(T,0),M.unbindTexture()},this.resetState=function(){$=0,X=0,he=null,M.reset(),Ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return In}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=yt._getDrawingBufferColorSpace(e),t.unpackColorSpace=yt._getUnpackColorSpace()}}const so=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:_l,AddEquation:Ji,AddOperation:Gm,AdditiveAnimationBlendMode:Ku,AdditiveBlending:Ia,AgXToneMapping:Gu,AlphaFormat:Zu,AlwaysCompare:e0,AlwaysDepth:Sc,AlwaysStencilFunc:vu,AmbientLight:W0,AnimationAction:eg,AnimationClip:Ya,AnimationLoader:oy,AnimationMixer:Oy,AnimationObjectGroup:Uy,AnimationUtils:iy,ArcCurve:g0,ArrayCamera:J0,ArrowHelper:cv,AttachedBindMode:_u,Audio:j0,AudioAnalyser:Ay,AudioContext:Md,AudioListener:by,AudioLoader:_y,AxesHelper:lv,BackSide:gn,BasicDepthPacking:Ym,BasicShadowMap:Mg,BatchedMesh:h0,BezierInterpolant:z0,Bone:id,BooleanKeyframeTrack:Ws,Box2:tg,Box3:ln,Box3Helper:av,BoxGeometry:os,BoxHelper:rv,BufferAttribute:At,BufferGeometry:mt,BufferGeometryLoader:$0,ByteType:Xu,Cache:ai,Camera:Ql,CameraHelper:sv,CanvasTexture:b_,CapsuleGeometry:Ol,CatmullRomCurve3:x0,CineonToneMapping:ku,CircleGeometry:Bl,ClampToEdgeWrapping:on,Clock:Wy,Color:ke,ColorKeyframeTrack:gd,ColorManagement:yt,Compatibility:lx,CompressedArrayTexture:v_,CompressedCubeTexture:M_,CompressedTexture:Fl,CompressedTextureLoader:cy,ConeGeometry:eo,ConstantAlphaFactor:zm,ConstantColorFactor:Om,Controls:uv,CubeCamera:Z0,CubeDepthTexture:p0,CubeReflectionMapping:li,CubeRefractionMapping:ns,CubeTexture:ja,CubeTextureLoader:ly,CubeUVReflectionMapping:Br,CubicBezierCurve:od,CubicBezierCurve3:_0,CubicInterpolant:O0,CullFaceBack:mu,CullFaceFront:bm,CullFaceFrontBack:vg,CullFaceNone:Mm,Curve:jn,CurvePath:v0,CustomBlending:Sm,CustomToneMapping:Vu,CylinderGeometry:Qa,Cylindrical:qy,Data3DTexture:Il,DataArrayTexture:Rl,DataTexture:Dn,DataTextureLoader:hy,DataUtils:qx,DecrementStencilOp:kg,DecrementWrapStencilOp:Gg,DefaultLoadingManager:V0,DepthFormat:ui,DepthStencilFormat:Ki,DepthTexture:ks,DetachedBindMode:Hm,DirectionalLight:dl,DirectionalLightHelper:iv,DiscreteInterpolant:B0,DodecahedronGeometry:zl,DoubleSide:ii,DstAlphaFactor:Lm,DstColorFactor:Nm,DynamicCopyUsage:ix,DynamicDrawUsage:Kg,DynamicReadUsage:ex,EdgesGeometry:m0,EllipseCurve:kl,EqualCompare:Km,EqualDepth:Ac,EqualStencilFunc:qg,EquirectangularReflectionMapping:va,EquirectangularRefractionMapping:Ma,Euler:zn,EventDispatcher:Kn,ExternalTexture:rd,ExtrudeGeometry:Vl,FileLoader:Ii,Float16BufferAttribute:Qx,Float32BufferAttribute:tt,FloatType:mn,Fog:Ka,FogExp2:Ll,FramebufferTexture:y_,FrontSide:Ci,Frustum:zs,FrustumArray:Ul,GLBufferAttribute:Gy,GLSL1:rx,GLSL3:Mu,GreaterCompare:jm,GreaterDepth:Ec,GreaterEqualCompare:Cl,GreaterEqualDepth:Tc,GreaterEqualStencilFunc:Jg,GreaterStencilFunc:$g,GridHelper:tv,Group:ri,HTMLTexture:S_,HalfFloatType:hi,HemisphereLight:ul,HemisphereLightHelper:ev,IcosahedronGeometry:Gl,ImageBitmapLoader:xy,ImageLoader:$a,ImageUtils:s0,IncrementStencilOp:zg,IncrementWrapStencilOp:Vg,InstancedBufferAttribute:Nr,InstancedBufferGeometry:Y0,InstancedInterleavedBuffer:Vy,InstancedMesh:l0,Int16BufferAttribute:Kx,Int32BufferAttribute:jx,Int8BufferAttribute:$x,IntType:vl,InterleavedBuffer:Dl,InterleavedBufferAttribute:Bs,Interpolant:kr,InterpolateBezier:yu,InterpolateDiscrete:Ua,InterpolateLinear:rl,InterpolateSmooth:xc,InterpolationSamplingMode:cx,InterpolationSamplingType:ox,InvertStencilOp:Hg,KeepStencilOp:Rs,KeyframeTrack:Vn,LOD:o0,LatheGeometry:Hl,Layers:Pl,LessCompare:Jm,LessDepth:wc,LessEqualCompare:El,LessEqualDepth:Fs,LessEqualStencilFunc:Yg,LessStencilFunc:Xg,Light:ls,LightProbe:q0,Line:rs,Line3:Zy,LineBasicMaterial:xn,LineCurve:cd,LineCurve3:y0,LineDashedMaterial:N0,LineLoop:u0,LineSegments:di,LinearFilter:It,LinearInterpolant:md,LinearMipMapLinearFilter:Tg,LinearMipMapNearestFilter:Ag,LinearMipmapLinearFilter:si,LinearMipmapNearestFilter:ba,LinearSRGBColorSpace:Oa,LinearToneMapping:Bu,LinearTransfer:Ba,Loader:wn,LoaderUtils:Tu,LoadingManager:_d,LoopOnce:Wm,LoopPingPong:qm,LoopRepeat:Xm,MOUSE:_g,Material:tn,MaterialBlending:bg,MaterialLoader:eh,MathUtils:Lx,Matrix2:Cu,Matrix3:pt,Matrix4:dt,MaxEquation:Em,Mesh:Bt,MeshBasicMaterial:as,MeshDepthMaterial:fd,MeshDistanceMaterial:pd,MeshLambertMaterial:hl,MeshMatcapMaterial:D0,MeshNormalMaterial:L0,MeshPhongMaterial:I0,MeshPhysicalMaterial:R0,MeshStandardMaterial:Jl,MeshToonMaterial:P0,MinEquation:Tm,MirroredRepeatWrapping:La,MixOperation:Vm,MultiplyBlending:xu,MultiplyOperation:Za,NearestFilter:Wt,NearestMipMapLinearFilter:wg,NearestMipMapNearestFilter:Sg,NearestMipmapLinearFilter:Er,NearestMipmapNearestFilter:Wu,NeutralToneMapping:Hu,NeverCompare:Zm,NeverDepth:bc,NeverStencilFunc:Wg,NoBlending:ci,NoColorSpace:Ai,NoNormalPacking:Ng,NoToneMapping:Jn,NormalAnimationBlendMode:Tl,NormalBlending:Ns,NormalGAPacking:Fg,NormalRGPacking:Ug,NotEqualCompare:Qm,NotEqualDepth:Cc,NotEqualStencilFunc:Zg,NumberKeyframeTrack:Kl,Object3D:bt,ObjectLoader:my,ObjectSpaceNormalMap:$m,OctahedronGeometry:no,OneFactor:Rm,OneMinusConstantAlphaFactor:km,OneMinusConstantColorFactor:Bm,OneMinusDstAlphaFactor:Dm,OneMinusDstColorFactor:Um,OneMinusSrcAlphaFactor:Mc,OneMinusSrcColorFactor:Pm,OrthographicCamera:io,PCFShadowMap:ya,PCFSoftShadowMap:Ou,PMREMGenerator:Iu,Path:Ha,PerspectiveCamera:$t,Plane:Zi,PlaneGeometry:Hs,PlaneHelper:ov,PointLight:H0,PointLightHelper:jy,Points:d0,PointsMaterial:sd,PolarGridHelper:nv,PolyhedronGeometry:cs,PositionalAudio:wy,PropertyBinding:Mt,PropertyMixer:Q0,QuadraticBezierCurve:ld,QuadraticBezierCurve3:hd,Quaternion:Xt,QuaternionKeyframeTrack:jl,QuaternionLinearInterpolant:k0,R11_EAC_Format:Fc,RED_GREEN_RGTC2_Format:Na,RED_RGTC1_Format:nl,REVISION:xl,RG11_EAC_Format:Da,RGBADepthPacking:Pg,RGBAFormat:cn,RGBAIntegerFormat:Al,RGBA_ASTC_10x10_Format:Jc,RGBA_ASTC_10x5_Format:Yc,RGBA_ASTC_10x6_Format:$c,RGBA_ASTC_10x8_Format:Zc,RGBA_ASTC_12x10_Format:Kc,RGBA_ASTC_12x12_Format:jc,RGBA_ASTC_4x4_Format:zc,RGBA_ASTC_5x4_Format:kc,RGBA_ASTC_5x5_Format:Vc,RGBA_ASTC_6x5_Format:Gc,RGBA_ASTC_6x6_Format:Hc,RGBA_ASTC_8x5_Format:Wc,RGBA_ASTC_8x6_Format:Xc,RGBA_ASTC_8x8_Format:qc,RGBA_BPTC_Format:Qc,RGBA_ETC2_EAC_Format:Uc,RGBA_PVRTC_2BPPV1_Format:Lc,RGBA_PVRTC_4BPPV1_Format:Pc,RGBA_S3TC_DXT1_Format:wa,RGBA_S3TC_DXT3_Format:Aa,RGBA_S3TC_DXT5_Format:Ta,RGBDepthPacking:Lg,RGBFormat:Ju,RGBIntegerFormat:Eg,RGB_BPTC_SIGNED_Format:el,RGB_BPTC_UNSIGNED_Format:tl,RGB_ETC1_Format:Dc,RGB_ETC2_Format:Nc,RGB_PVRTC_2BPPV1_Format:Ic,RGB_PVRTC_4BPPV1_Format:Rc,RGB_S3TC_DXT1_Format:Sa,RGDepthPacking:Dg,RGFormat:is,RGIntegerFormat:wl,RawShaderMaterial:dd,Ray:zr,Raycaster:Hy,RectAreaLight:X0,RedFormat:Sl,RedIntegerFormat:Ja,ReinhardToneMapping:zu,RenderTarget:Qu,RenderTarget3D:By,RepeatWrapping:Pa,ReplaceStencilOp:Bg,ReverseSubtractEquation:Am,RingGeometry:Wl,SIGNED_R11_EAC_Format:Oc,SIGNED_RED_GREEN_RGTC2_Format:sl,SIGNED_RED_RGTC1_Format:il,SIGNED_RG11_EAC_Format:Bc,SRGBColorSpace:fn,SRGBTransfer:Et,Scene:ed,ShaderChunk:xt,ShaderLib:$n,ShaderMaterial:kn,ShadowMaterial:T0,Shape:to,ShapeGeometry:Xl,ShapePath:hv,ShapeUtils:Zn,ShortType:qu,Skeleton:Nl,SkeletonHelper:Ky,SkinnedMesh:c0,Source:ji,Sphere:en,SphereGeometry:Gs,Spherical:Xy,SphericalHarmonics3:vd,SplineCurve:ud,SpotLight:G0,SpotLightHelper:Jy,Sprite:al,SpriteMaterial:Ga,SrcAlphaFactor:vc,SrcAlphaSaturateFactor:Fm,SrcColorFactor:Im,StaticCopyUsage:nx,StaticDrawUsage:za,StaticReadUsage:Qg,StereoCamera:yy,StreamCopyUsage:sx,StreamDrawUsage:jg,StreamReadUsage:tx,StringKeyframeTrack:Xs,SubtractEquation:wm,SubtractiveBlending:gu,TOUCH:yg,TangentSpaceNormalMap:Ri,TetrahedronGeometry:ql,Texture:Ot,TextureLoader:uy,TextureUtils:gv,Timer:K0,TimestampQuery:ax,TorusGeometry:Yl,TorusKnotGeometry:$l,Triangle:bn,TriangleFanDrawMode:Ig,TriangleStripDrawMode:Rg,TrianglesDrawMode:Cg,TubeGeometry:Zl,UVMapping:yl,Uint16BufferAttribute:td,Uint32BufferAttribute:nd,Uint8BufferAttribute:Zx,Uint8ClampedBufferAttribute:Jx,Uniform:wd,UniformsGroup:ky,UniformsLib:Xe,UniformsUtils:C0,UnsignedByteType:Mn,UnsignedInt101111Type:$u,UnsignedInt248Type:Lr,UnsignedInt5999Type:Yu,UnsignedIntType:Bn,UnsignedShort4444Type:Ml,UnsignedShort5551Type:bl,UnsignedShortType:Pr,VSMShadowMap:Tr,Vector2:Ie,Vector3:I,Vector4:Ct,VectorKeyframeTrack:xd,VideoFrameTexture:__,VideoTexture:f0,WebGL3DRenderTarget:Ox,WebGLArrayRenderTarget:Fx,WebGLCoordinateSystem:In,WebGLCubeRenderTarget:Ad,WebGLRenderTarget:Ln,WebGLRenderer:ug,WebGLUtils:lg,WebGPUCoordinateSystem:Os,WebXRController:_c,WireframeGeometry:A0,WrapAroundEnding:Fa,ZeroCurvatureEnding:Ps,ZeroFactor:Cm,ZeroSlopeEnding:Ls,ZeroStencilOp:Og,createCanvasElement:n0,error:at,getConsoleFunction:fx,log:Va,setConsoleFunction:dx,warn:Ve,warnOnce:ts},Symbol.toStringTag,{value:"Module"})),He={player:{radius:.45,height:1.5,walkSpeed:7.2,airControl:.55,accel:55,friction:12,jumpVelocity:8.4,gravity:-24,maxFallSpeed:-38,coyoteTime:.12,jumpBuffer:.15,reachSlowdown:.38,turnLerp:14,spawnHeight:2,reachOpenRate:7,pinchSnapRate:34,pinchHoldTime:.26,pinchHeight:.96,pinchReleaseRate:3.4},camera:{fov:68,near:.1,far:260,distance:5.4,height:2.9,lookAhead:3.4,followLerp:6.5,lookLerp:9,shakeDecay:5},world:{chunkSize:32,viewChunks:3,groundY:0,obstaclesPerChunkBase:7,obstaclesPerChunkPerLevel:2.6,obstaclesPerChunkMax:26,propMix:{tree:.44,rock:.26,bush:.3},obstacleMinSize:1.1,obstacleMaxSize:4.2,obstacleMaxHeight:6,spawnClearRadius:7,fogNear:26,fogFar:150},emeem:{radius:.22,pickupRadius:1.25,perChunk:14,bobHeight:.28,bobSpeed:2.1,spinSpeed:1.4,hoverY:.34,magnetRadius:2.4,magnetStrength:7,respawnDelay:.6,reachRadius:5.2,kinds:{emeem:{points:1,radius:.22,weight:.72,pickupRadius:1.25,glow:7.5},runner:{points:3,radius:.15,weight:.11,pickupRadius:1.15,glow:9.5,speed:4.2,wanderSpeed:1.1,fleeRadius:7,turnRate:3.4},amaam:{points:-2,radius:.4,weight:.17,pickupRadius:1.45,glow:5}}},monster:{spawnDistance:34,minSpawnDistance:22,catchRadius:1.35,baseSpeed:4.6,turnRate:3.2,baseScale:1,heightOffset:0,obstacleSlowdown:.55,stuckUnstickForce:6,roarInterval:9,roarIntervalMin:3},levels:[{score:0,speed:4.6,scale:1,dread:0,name:"Watching"},{score:5,speed:5.4,scale:1.1,dread:.14,name:"Stirring"},{score:12,speed:6.1,scale:1.22,dread:.28,name:"Hunting"},{score:22,speed:6.7,scale:1.36,dread:.42,name:"Furious"},{score:35,speed:7.3,scale:1.52,dread:.56,name:"Ravenous"},{score:50,speed:7.9,scale:1.7,dread:.7,name:"Nightmare"},{score:70,speed:8.5,scale:1.9,dread:.84,name:"Devourer"},{score:95,speed:9.2,scale:2.1,dread:1,name:"THE END"}],palette:{skyCalm:9356799,skyDread:1705224,fogCalm:12574975,fogDread:2753545,groundCalm:4877119,groundDread:2759714,obstacleCalm:7033408,obstacleDread:3811376,foliageCalm:4160058,foliageDread:2365988,rockCalm:9079430,rockDread:4536898,sunCalm:16774358,sunDread:16734780,emeems:[15910067,15247508,14257270,12873818,11034184,9062453,7025959,4858906],emeemTipShade:.78,runners:[16773336,16769200,16765583],amaams:[7305810,6056776,8225618],amaamTipShade:.62,hand:16173480,handShadow:14263427,monster:2822688,monsterEye:16722714},render:{maxPixelRatio:2,shadows:!0,shadowMapSize:1024,targetFps:60,maxDelta:.05},audio:{masterVolume:.55}};function hw(s){const e=He.levels;let t=e[0];for(let n=0;n<e.length;n++)s>=e[n].score&&(t=e[n]);return t}function uw(s){const e=He.levels;let t=0;for(let n=0;n<e.length;n++)s>=e[n].score&&(t=n);return t}const $e={phase:"menu",time:0,dt:0,score:0,best:0,levelIndex:0,level:He.levels[0],dread:0,player:{pos:new I(0,He.player.spawnHeight,0),vel:new I(0,0,0),yaw:0,grounded:!1,groundY:0,pinch:0,reach:0,grabPoint:new I,nearestEmeem:new I,nearestEmeemDist:1/0,hasNearestEmeem:!1,distanceRun:0},monster:{pos:new I(0,0,-He.monster.spawnDistance),vel:new I(0,0,0),yaw:0,speed:He.monster.baseSpeed,scale:He.monster.baseScale,distanceToPlayer:He.monster.spawnDistance,proximity:0},input:{x:0,z:0,jump:!1,jumpPressed:!1},camera:{yaw:0,shake:0},stats:{emeems:0,jumps:0,runTime:0}};function dw(){$e.phase="playing",$e.time=0,$e.score=0,$e.levelIndex=0,$e.level=He.levels[0],$e.dread=0,$e.player.pos.set(0,He.player.spawnHeight,0),$e.player.vel.set(0,0,0),$e.player.yaw=0,$e.player.grounded=!1,$e.player.groundY=0,$e.player.pinch=0,$e.player.reach=0,$e.player.grabPoint.set(0,0,0),$e.player.nearestEmeem.set(0,0,0),$e.player.nearestEmeemDist=1/0,$e.player.hasNearestEmeem=!1,$e.player.distanceRun=0,$e.monster.pos.set(0,0,-He.monster.spawnDistance),$e.monster.vel.set(0,0,0),$e.monster.yaw=0,$e.monster.speed=He.monster.baseSpeed,$e.monster.scale=He.monster.baseScale,$e.monster.distanceToPlayer=He.monster.spawnDistance,$e.monster.proximity=0,$e.input.x=0,$e.input.z=0,$e.input.jump=!1,$e.input.jumpPressed=!1,$e.camera.yaw=0,$e.camera.shake=0,$e.stats.emeems=0,$e.stats.jumps=0,$e.stats.runTime=0}function fw(s,e=1){const t=$e.score;$e.score=Math.max(0,$e.score+e);const n=$e.score-t,i=uw($e.score);if(i!==$e.levelIndex){const r=i>$e.levelIndex;$e.levelIndex=i,$e.level=hw($e.score),r&&s.emit("levelup",{index:i,level:$e.level})}return n}function pw(){const s=new Map;return{on(e,t){return s.has(e)||s.set(e,new Set),s.get(e).add(t),()=>s.get(e)?.delete(t)},off(e,t){s.get(e)?.delete(t)},emit(e,t){const n=s.get(e);if(n)for(const i of Array.from(n))try{i(t)}catch(r){console.error(`[bus:${e}]`,r)}},clear(){s.clear()}}}const fp=new I,pp=new I,mp=new I,gp=new I,$h=new I,xp=new I(-16,30,22).normalize(),Zh=42,na=20,_p=2.7,yp=1.15,vp=.8,Mp=.22,mw=.11,gw=5,xw=4,_w=.6;function bp(s,e,t,n){return s+(e-s)*(1-Math.exp(-t*n))}function ia(s,e,t){return s+(e-s)*t}function Jh(s){return s<0?0:s>1?1:s}function Kh(s,e){return Math.sin(s*(1+e*.31)+e*2.399)*Math.sin(s*(.37+e*.17)+e*5.113)}function yw(s){const e=He.palette,t=new ug({canvas:s||void 0,antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1,depth:!0});t.outputColorSpace=fn,t.toneMapping=_l,t.toneMappingExposure=1.05,t.autoClear=!0,He.render.shadows?(t.shadowMap.enabled=!0,t.shadowMap.type=Ou):t.shadowMap.enabled=!1;const n=new ed;n.background=new ke(e.skyCalm),n.fog=new Ka(e.fogCalm,He.world.fogNear,He.world.fogFar);const i=new ul(e.skyCalm,e.groundCalm,yp);i.position.set(0,50,0),n.add(i);const r=new dl(e.sunCalm,_p);r.position.copy(xp).multiplyScalar(Zh),r.castShadow=!!He.render.shadows;const a=r.shadow.camera;a.left=-na,a.right=na,a.top=na,a.bottom=-na,a.near=1,a.far=Zh*2.2,a.updateProjectionMatrix();const o=Number.isFinite(He.render.shadowMapSize)&&He.render.shadowMapSize>0?He.render.shadowMapSize:1024,c=na*2/o*8;r.shadow.mapSize.set(o,o),r.shadow.bias=-6e-4,r.shadow.normalBias=.035,r.shadow.radius=1.5,n.add(r),n.add(r.target);const l=new $t(He.camera.fov,typeof window<"u"&&window.innerHeight>0?window.innerWidth/window.innerHeight:16/9,He.camera.near,He.camera.far);n.add(l);const h=new I,d=new I;let u=He.camera.fov,f=He.camera.fov,p=0,x=-1;const m=new ke(e.skyCalm),g=new ke(e.skyDread),v=new ke(e.fogCalm),b=new ke(e.fogDread),y=new ke(e.sunCalm),w=new ke(e.sunDread),S=new ke(e.groundCalm),C=new ke(e.groundDread);function _(N){const G=Jh(N);Math.abs(G-x)<5e-4||(x=G,n.background&&n.background.isColor&&n.background.copy(m).lerp(g,Math.pow(G,.68)),n.fog&&(n.fog.color.copy(v).lerp(b,G),n.fog.near=ia(He.world.fogNear,He.world.fogNear*.42,G),n.fog.far=ia(He.world.fogFar,He.world.fogFar*.5,G)),r.color.copy(y).lerp(w,G),r.intensity=_p*ia(1,.42,G),i.color.copy(m).lerp(g,G),i.groundColor.copy(S).lerp(C,G),i.intensity=yp*ia(1,.5,G),t.toneMappingExposure=ia(1.05,1.18,G))}function E(N){h.set(N.x,N.y+He.camera.height,N.z+He.camera.distance),d.set(N.x,N.y+vp,N.z-He.camera.lookAhead),l.position.copy(h),l.lookAt(d)}function A(N){if(!r.castShadow)return;const G=Math.round(N.x/c)*c,k=Math.round(N.z/c)*c;$h.set(G,0,k-4),gp.copy(xp).multiplyScalar(Zh),r.target.position.copy($h),r.position.copy($h).add(gp),r.target.updateMatrixWorld()}let P=-1,D=-1,H=-1;function W(){if(typeof window>"u")return;const N=Math.max(1,window.innerWidth|0),G=Math.max(1,window.innerHeight|0),k=Math.min(typeof window.devicePixelRatio=="number"&&window.devicePixelRatio>0?window.devicePixelRatio:1,He.render.maxPixelRatio);N===P&&G===D&&k===H||(P=N,D=G,H=k,t.setPixelRatio(k),t.setSize(N,G,!1),l.aspect=N/G,l.updateProjectionMatrix())}function B(){if(typeof window>"u"||typeof window.addEventListener!="function")return;const N=()=>W();try{window.addEventListener("orientationchange",N);const G=window.visualViewport;G&&typeof G.addEventListener=="function"&&G.addEventListener("resize",N)}catch{}}function $(N,G){const k=G&&G.state||$e,q=Number.isFinite(N)&&N>0?Math.min(N,He.render.maxDelta):0;p+=q;const de=Jh(k.level&&k.level.dread||0);k.dread=q>0?bp(k.dread||0,de,_w,q):k.dread||0,Math.abs(k.dread-de)<.001&&(k.dread=de),_(k.dread);const oe=k.player.pos;if(fp.set(oe.x,oe.y+He.camera.height,oe.z+He.camera.distance),pp.set(oe.x,oe.y+vp,oe.z-He.camera.lookAhead),q>0){const Ke=1-Math.exp(-He.camera.followLerp*q),qe=1-Math.exp(-He.camera.lookLerp*q);h.lerp(fp,Ke),d.lerp(pp,qe)}const Me=Jh(k.monster&&k.monster.proximity||0),we=He.camera.fov+gw*Me*Me;u=q>0?bp(u,we,xw,q):we,Math.abs(u-f)>.01&&(f=u,l.fov=u,l.updateProjectionMatrix()),l.position.copy(h),l.lookAt(d);let L=k.camera.shake||0;if(L>5e-4){const Ke=Math.min(L,1.6),qe=Ke*Ke,R=p*46;mp.set(Kh(R,0)*Mp*qe,Kh(R,1)*Mp*qe,Kh(R,2)*mw*qe),l.position.add(mp),q>0&&(L*=Math.exp(-He.camera.shakeDecay*q),k.camera.shake=L<.002?0:L)}else L!==0&&(k.camera.shake=0);A(oe)}const X=1,he=-.34,ie=3.1,ae=1.5,Y=new $t(30,1,.05,40);Y.layers.set(X);const O=new ke(1313298),U=new dl(16773602,0);U.layers.set(X),n.add(U),n.add(U.target);const J=new ul(14214911,4202540,0);J.layers.set(X),n.add(J);let ne=null,V=null;const re=new I,se=new I,_e=new ke;function Ae(N,G){ne=N?{obj:N,height:G&&G.height||2.9}:null}function Pe(N){V=N&&N.w>0&&N.h>0?N:null}function Ue(){if(!V||!ne||!ne.obj)return;const N=ne.obj;if(!N.parent)return;N.updateWorldMatrix(!0,!1),re.setFromMatrixPosition(N.matrixWorld);const G=N.parent,k=G.scale?G.scale.y:1,q=G.rotation?G.rotation.y:0;re.y+=ne.height*k;const de=3.1*k,oe=q+he;se.set(-Math.sin(oe)*de,.3*k,-Math.cos(oe)*de),Y.position.copy(re).add(se),Y.lookAt(re);const Me=t.domElement.width/t.getPixelRatio(),we=t.domElement.height/t.getPixelRatio(),L=Math.round(V.x),Ke=Math.round(we-V.y-V.h),qe=Math.round(V.w),R=Math.round(V.h);if(qe<2||R<2||L+qe<0||Ke+R<0)return;Y.aspect=qe/R,Y.updateProjectionMatrix();const M=n.fog,K=n.background,te=t.autoClear,ce=t.shadowMap.autoUpdate;t.shadowMap.autoUpdate=!1,U.position.copy(Y.position),U.position.y+=1.4*k,U.target.position.copy(re),U.target.updateMatrixWorld(),U.intensity=ie,J.intensity=ae,t.getClearColor(_e);const Re=t.getClearAlpha();n.fog=null,n.background=null,t.autoClear=!1,t.setScissorTest(!0),t.setViewport(L,Ke,qe,R),t.setScissor(L,Ke,qe,R),t.setClearColor(O,1),t.clear(!0,!0,!1),t.render(n,Y),t.setScissorTest(!1),t.setViewport(0,0,Me,we),t.setScissor(0,0,Me,we),t.setClearColor(_e,Re),t.autoClear=te,t.shadowMap.autoUpdate=ce,U.intensity=0,J.intensity=0,n.fog=M,n.background=K}function Fe(){t.render(n,l),Ue()}function F(){x=-1,_(0),u=He.camera.fov,f=He.camera.fov,l.fov=He.camera.fov,l.updateProjectionMatrix(),$e.camera.shake=0,E($e.player.pos),A($e.player.pos)}return _(0),E($e.player.pos),A($e.player.pos),W(),B(),{renderer:t,scene:n,camera:l,sun:r,hemi:i,resize:W,render:Fe,reset:F,update:$,setDread:_,setPortraitSubject:Ae,setPortraitRect:Pe,PORTRAIT_LAYER:X}}function dg(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,c=new mt;let l=0;for(let h=0;h<s.length;++h){const d=s[h];let u=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in d.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0;const d=[];for(let u=0;u<s.length;++u){const f=s[u].index;for(let p=0;p<f.count;++p)d.push(f.getX(p)+h);h+=s[u].attributes.position.count}c.setIndex(d)}for(const h in r){const d=Sp(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,d)}for(const h in a){const d=a[h][0].length;if(d!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let u=0;u<d;++u){const f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][u]);const p=Sp(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(p)}}}return c}function Sp(s){let e,t,n,i=-1,r=0;for(let l=0;l<s.length;++l){const h=s[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new At(a,t,n);let c=0;for(let l=0;l<s.length;++l){const h=s[l];if(h.isInterleavedBufferAttribute){const d=c/t;for(let u=0,f=h.count;u<f;u++)for(let p=0;p<t;p++){const x=h.getComponent(u,p);o.setComponent(u+d,p,x)}}else a.set(h.array,c);c+=h.count*t}return i!==void 0&&(o.gpuType=i),o}const vw=2,Mw=2,wp=.08,Ap=.74,bw=1.06,Ko=.35,Sw=6,Du=16384,ww=32768,jh=new dt,Tp=new ke,Ep=new ke,ws=[];function Aw(s){let e=s>>>0;return function(){e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Tw(s,e){let t=Math.imul(s|0,668265261)^Math.imul(e|0,374761393);return t=Math.imul(t^t>>>15,625341585),t^=t>>>13,t=Math.imul(t,668265261),(t^t>>>16)>>>0}function pr(s,e){return(s+Du)*ww+(e+Du)}function Fn(s,e,t){return e+(t-e)*s()}function Cp(s){return typeof s=="number"&&Number.isFinite(s)}const Or=new os(1,1,1);Or.deleteAttribute("uv");Or.translate(0,.5,0);Or.setAttribute("color",new At(new Float32Array(Or.attributes.position.count*3).fill(1),3));const Rp=(()=>{const s=Or.attributes.position,e=new Float32Array(s.count);for(let t=0;t<s.count;t++)e[t]=s.array[t*3+1];return e})();function Ew(s,e,t){s.onBeforeCompile=n=>{n.uniforms.uCell={value:e},n.uniforms.uChunk={value:t},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWorldPos;`).replace("#include <begin_vertex>",`#include <begin_vertex>
	vWorldPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWorldPos;
uniform float uCell;
uniform float uChunk;`).replace("#include <color_fragment>",`#include <color_fragment>
	{
		// Analytic anti-aliased grid: distance to the nearest cell line measured
		// in pixels via screen-space derivatives.
		vec2 p = vWorldPos.xz / uCell;
		vec2 w = max( fwidth( p ), vec2( 1e-5 ) );
		vec2 g = abs( fract( p - 0.5 ) - 0.5 ) / w;
		float line = 1.0 - min( min( g.x, g.y ), 1.0 );
		// Kill the grid before it turns into moire in the distance; fog takes over.
		float fade = 1.0 - smoothstep( 25.0, 80.0, distance( vWorldPos, cameraPosition ) );
		// Chunk-sized checker gives the eye a sense of speed and scale.
		vec2 cc = floor( vWorldPos.xz / uChunk );
		float checker = mod( cc.x + cc.y, 2.0 );
		diffuseColor.rgb *= ( 1.0 + ( checker - 0.5 ) * 0.055 ) * ( 1.0 - line * 0.22 * fade );
	}`)},s.customProgramCacheKey=()=>"emeem-ground-grid"}function Cw(s){const e=s.CONFIG,t=e.world,n=e.palette,i=t.chunkSize,r=t.viewChunks,a=new ri;a.name="world",a.matrixAutoUpdate=!1;const o=new hl({color:n.obstacleCalm,vertexColors:!0,dithering:!0}),c=new hl({color:n.groundCalm,dithering:!0});Ew(c,i/8,i);const l=Math.max((r*2+5)*i,Math.ceil((t.fogFar+i)*2/i)*i),h=new Hs(l,l,1,1);h.rotateX(-Math.PI/2);const d=new Bt(h,c);d.name="ground",d.receiveShadow=!0,d.castShadow=!1,d.matrixAutoUpdate=!1,d.frustumCulled=!1,d.position.set(0,t.groundY,0),d.updateMatrix(),a.add(d);const u=new Map,f=[];let p=!1;const x=[];for(let O=-r;O<=r;O++)for(let U=-r;U<=r;U++)x.push({dx:O,dz:U,d2:O*O+U*U,ring:Math.max(Math.abs(O),Math.abs(U))});x.sort((O,U)=>O.d2-U.d2);let m=-1,g=NaN,v=NaN,b=0,y=0;const w=(Du-2)*i;function S(O){O&&(Cp(O.x)&&Math.abs(O.x)<w&&(b=O.x),Cp(O.z)&&Math.abs(O.z)<w&&(y=O.z))}function C(O,U){const J=t.obstaclesPerChunkBase+O*t.obstaclesPerChunkPerLevel,ne=Math.min(Math.max(J,t.obstaclesPerChunkBase),t.obstaclesPerChunkMax),V=Math.floor(ne);return V+(U()<ne-V?1:0)}function _(O,U,J,ne){const V=Math.max(0,Math.abs(O)-J),re=Math.max(0,Math.abs(U)-ne);return V*V+re*re<t.spawnClearRadius*t.spawnClearRadius}function E(O,U,J,ne,V){for(let re=0;re<O.length;re++){const se=O[re];if(!(U+ne+Ko<se.min.x||U-ne-Ko>se.max.x)&&!(J+V+Ko<se.min.z||J-V-Ko>se.max.z))return!0}return!1}function A(O,U,J){const ne=Aw(Tw(O,U)),V=C(J,ne),re=O*i,se=U*i,_e=[];ws.length=0;for(let Ue=0;Ue<V;Ue++){const Fe=ne();let F,N,G;Fe<.45?(F=Fn(ne,2,t.obstacleMaxSize),N=Fn(ne,2,t.obstacleMaxSize),G=Fn(ne,.45,1.15)):Fe<.78?(F=Fn(ne,1.6,3.4),N=Fn(ne,1.6,3.4),G=Fn(ne,1.7,3.2)):(F=Fn(ne,t.obstacleMinSize,2),N=Fn(ne,t.obstacleMinSize,2),G=Fn(ne,3.4,t.obstacleMaxHeight)),F=Math.min(Math.max(F,t.obstacleMinSize),t.obstacleMaxSize),N=Math.min(Math.max(N,t.obstacleMinSize),t.obstacleMaxSize),G=Math.min(G,t.obstacleMaxHeight);const k=F*.5,q=N*.5;let de=0,oe=0,Me=!1;for(let M=0;M<Sw;M++)if(de=re+k+ne()*(i-F),oe=se+q+ne()*(i-N),!_(de,oe,k,q)&&!E(_e,de,oe,k,q)){Me=!0;break}if(!Me)continue;_e.push({min:new I(de-k,t.groundY,oe-q),max:new I(de+k,t.groundY+G,oe+q)});const we=Or.clone(),L=Fn(ne,.86,1.12),Ke=Fn(ne,.96,1.05),qe=Fn(ne,.94,1.03),R=we.attributes.color.array;for(let M=0;M<Rp.length;M++){const K=L*(Ap+(bw-Ap)*Rp[M]);R[M*3]=K*Ke,R[M*3+1]=K,R[M*3+2]=K*qe}jh.makeScale(F,G+wp,N),jh.setPosition(de,t.groundY-wp,oe),we.applyMatrix4(jh),ws.push(we)}let Ae=null;if(ws.length>0){const Ue=dg(ws,!1);for(let Fe=0;Fe<ws.length;Fe++)ws[Fe].dispose();ws.length=0,Ue&&(Ue.computeBoundingSphere(),Ae=new Bt(Ue,o),Ae.name=`chunk ${O},${U}`,Ae.castShadow=!0,Ae.receiveShadow=!0,Ae.matrixAutoUpdate=!1,Ae.updateMatrix(),a.add(Ae))}const Pe={cx:O,cz:U,id:`${O},${U}`,mesh:Ae,colliders:_e,builtLevel:J};return u.set(pr(O,U),Pe),p=!0,Pe}function P(O){O.mesh&&(a.remove(O.mesh),O.mesh.geometry.dispose(),O.mesh=null),O.colliders.length=0,u.delete(pr(O.cx,O.cz)),p=!0}function D(){for(const O of u.values())P(O);u.clear(),f.length=0,p=!1}function H(){f.length=0;for(const O of u.values()){const U=O.colliders;for(let J=0;J<U.length;J++)f.push(U[J])}p=!1}function W(O,U,J,ne){const V=Math.floor(O/i),re=Math.floor(U/i);for(const _e of u.values())(Math.abs(_e.cx-V)>r||Math.abs(_e.cz-re)>r)&&P(_e);let se=0;for(let _e=0;_e<x.length&&se<J;_e++){const Ae=x[_e],Pe=V+Ae.dx,Ue=re+Ae.dz;u.has(pr(Pe,Ue))||(A(Pe,Ue,ne),se++)}for(let _e=x.length-1;_e>=0&&se<J;_e--){const Ae=x[_e];if(Ae.ring<r)continue;const Pe=u.get(pr(V+Ae.dx,re+Ae.dz));if(!Pe||Pe.builtLevel>=ne)continue;const Ue=Pe.cx,Fe=Pe.cz;P(Pe),A(Ue,Fe,ne),se++}p&&H()}function B(O,U){const J=Math.round(O/i)*i,ne=Math.round(U/i)*i;J===g&&ne===v||(g=J,v=ne,d.position.set(J,t.groundY,ne),d.updateMatrix())}function $(O){const U=Math.min(Math.max(O||0,0),1);Math.abs(U-m)<.002||(m=U,o.color.copy(Tp.setHex(n.obstacleCalm).lerp(Ep.setHex(n.obstacleDread),U)),c.color.copy(Tp.setHex(n.groundCalm).lerp(Ep.setHex(n.groundDread),U)))}function X(O,U,J){const ne=Math.floor(O/i),V=Math.floor(U/i),re=Math.min(Mw,r);for(let se=0;se<x.length;se++){const _e=x[se];if(_e.ring>re)continue;const Ae=ne+_e.dx,Pe=V+_e.dz;u.has(pr(Ae,Pe))||A(Ae,Pe,J)}H(),B(O,U)}function he(O,U,J=[]){J.length=0;const ne=Math.floor(O.x/i),V=Math.floor(O.z/i),re=Math.min(Math.floor(U.x/i),ne+8),se=Math.min(Math.floor(U.z/i),V+8);for(let _e=ne;_e<=re;_e++)for(let Ae=V;Ae<=se;Ae++){const Pe=u.get(pr(_e,Ae));if(Pe===void 0)continue;const Ue=Pe.colliders;for(let Fe=0;Fe<Ue.length;Fe++){const F=Ue[Fe];F.max.x<O.x||F.min.x>U.x||F.max.y<O.y||F.min.y>U.y||F.max.z<O.z||F.min.z>U.z||J.push(F)}}return J}function ie(O,U){return t.groundY}function ae(O,U){const J=U&&U.state||s.state;S(J.player&&J.player.pos),W(b,y,vw,J.levelIndex|0),B(b,y),$(J.dread)}function Y(){D(),m=-1,g=NaN,v=NaN;const O=s.state;S(O.player&&O.player.pos),$(O.dread),X(b,y,O.levelIndex|0)}return s.scene&&s.scene.add(a),$(s.state.dread),S(s.state.player&&s.state.player.pos),X(b,y,s.state.levelIndex|0),{group:a,colliders:f,queryAABB:he,sampleGroundY:ie,update:ae,reset:Y}}const On=new I,mr=new I,jo=new I,As=new I,gr=new I,sa=new I,Qo=new I,Ip=new dt,ra=new Xt,ec=new Xt,xr=new Xt,Pp=new Xt,Lp=new Xt,Dp=new zn,tc=new I(1,0,0),Qh=new I(0,1,0),Rw=new I(0,0,1),Np={},es=Math.PI*2,Iw=.41,Pw=1.25,Lw=.42,Dw=4.6,Nw=.26,Uw=.17,Fw=[0,es*.4,es*.8,es*.2,es*.6],Ow=.25,Bw=2.4,zw=.035,kw=.055,Vw=.055,Gw=.2,Hw=.055,Ww=.045,Xw=.03,qw=.045,Yw=.012,$w=5.5,Zw=.2,Jw=.26,Kw=.46,jw=.58,Qw=-1.02,eA=-2.05,tA=.16,nA=13,iA=30,sA=11,rA=27,aA=.011,oA=.024,Ts=0,fg=1;function aa(s,e,t){return s<e?e:s>t?t:s}function Ar(s){return s<0?0:s>1?1:s}function eu(s,e,t,n){return n>0?s+(e-s)*(1-Math.exp(-t*n)):s}function cA(s,e,t){const n=Ar((t-s)/(e-s));return n*n*(3-2*n)}function _r(s,e){return Math.sin(s*(1+e*.29)+e*2.13)*Math.sin(s*(.41+e*.19)+e*4.77)}function nc(s,e){let t=0,n=0;for(let d=0;d<e.length;d++){const u=e[d];t+=u.attributes.position.count,n+=u.index?u.index.count:u.attributes.position.count}const i=new Float32Array(t*3),r=new Float32Array(t*3),a=new Float32Array(t*2),o=t>65535?new Uint32Array(n):new Uint16Array(n);let c=0,l=0;for(let d=0;d<e.length;d++){const u=e[d],f=u.attributes.position;i.set(f.array,c*3),u.attributes.normal&&r.set(u.attributes.normal.array,c*3),u.attributes.uv&&a.set(u.attributes.uv.array,c*2);const p=u.index;if(p){for(let x=0;x<p.count;x++)o[l+x]=p.getX(x)+c;l+=p.count}else{for(let x=0;x<f.count;x++)o[l+x]=x+c;l+=f.count}c+=f.count}const h=new s.BufferGeometry;return h.setAttribute("position",new s.BufferAttribute(i,3)),h.setAttribute("normal",new s.BufferAttribute(r,3)),h.setAttribute("uv",new s.BufferAttribute(a,2)),h.setIndex(new s.BufferAttribute(o,1)),h.computeBoundingSphere(),h}function Up(s,e,t,n,i,r,a,o,c,l){On.copy(n).sub(t);let h=On.length();h<1e-5?(On.set(0,-1,0),h=1e-5):On.multiplyScalar(1/h);const d=Math.abs(i-r)+1e-4,u=(i+r)*.999;h=aa(h,d,u);const f=Math.acos(aa((i*i+h*h-r*r)/(2*i*h),-1,1)),p=Math.acos(aa((i*i+r*r-h*h)/(2*i*r),-1,1));if(o===fg){const x=Math.acos(aa(-On.y,-1,1)),m=Math.atan2(-On.x,-On.z);ra.setFromAxisAngle(Qh,m),l?(ec.setFromAxisAngle(tc,x),Pp.setFromAxisAngle(Qh,l),xr.setFromAxisAngle(tc,a*f),s.quaternion.copy(ra).multiply(ec).multiply(Pp).multiply(xr)):(xr.setFromAxisAngle(tc,x+a*f),s.quaternion.copy(ra).multiply(xr))}else{const x=Math.cos(c),m=Math.sin(c),g=On.x*x-On.z*m,v=On.x*m+On.z*x,b=Math.asin(aa(-v,-1,1)),y=Math.atan2(g,-On.y);ra.setFromAxisAngle(Qh,c),ec.setFromAxisAngle(Rw,y),xr.setFromAxisAngle(tc,b+a*f),s.quaternion.copy(ra).multiply(ec).multiply(xr)}e.rotation.x=-a*(Math.PI-p)}function lA(s,e){const t=s||so,n=e||He,i=n.palette,r=n.player.radius/.45,a=n.player.height*Iw,o=new t.MeshStandardMaterial({color:i.hand,roughness:.58,metalness:0});o.emissive=new t.Color(i.hand),o.emissiveIntensity=.09;const c=new t.MeshStandardMaterial({color:i.handShadow,roughness:.82,metalness:0}),l=.38*r,h=.135*r,d=.42*r,u=a-.09*r,f=a-.11*r,p=a-.145*r,x=Math.max(.02,u*.77),m=Math.max(.02,u*.69),g=.078*r,v=.062*r,b=[new t.CapsuleGeometry(g,Math.max(.01,x-2*g),4,10).translate(0,-x*.5,0),new t.SphereGeometry(g*1.15,8,6)],y=[new t.CapsuleGeometry(v,Math.max(.01,m-2*v),4,10).translate(0,-m*.5,0),new t.SphereGeometry(v*1.2,8,6),new t.SphereGeometry(v*1.25,8,6).translate(0,-m,0)],w=nc(t,b),S=nc(t,y);for(let k=0;k<b.length;k++)b[k].dispose();for(let k=0;k<y.length;k++)y[k].dispose();const C=new t.Group;C.name="hand";const _=new t.Group;_.name="hand-rig",C.add(_);const E=new t.SphereGeometry(1,20,13);E.scale(l,h,d);{const k=E.attributes.position;for(let q=0;q<k.count;q++){const de=Ar((k.getZ(q)/d+1)*.5);k.setX(q,k.getX(q)*(1-.3*de)),k.setY(q,k.getY(q)*(1+.18*de))}E.computeVertexNormals()}const A=.87,P=.43*r,D=.15*r,H=a+.16*r,W=d*.98,B=H+P*.5*Math.cos(A),$=W+P*.5*Math.sin(A),X=[E.clone().translate(0,a,0),new t.SphereGeometry(.2*r,12,9).scale(.85,.62,1.15).translate(-.26*r,a-.03*r,-.02*r),new t.CapsuleGeometry(D,Math.max(.01,P-2*D),5,12).rotateX(A).translate(0,H,W)],he=[E.clone().scale(.88,.6,.88).translate(0,a-h*.62,0),new t.CylinderGeometry(D*1.32,D*1.22,.11*r,12,1).rotateX(A).translate(0,B,$)],ie=a-.02*r,ae=a-.05*r,Y=[{id:"thumb",hip:new t.Vector3(-.34*r,ae,-.02*r),scale:.82,thick:1.58,darkTip:!1,bendSign:1,mode:Ts,planeYaw:.95,home:new t.Vector3(-.52*r,0,-.04*r),tuck:new t.Vector3(-.1*r,-.26*r,.12*r),fist:new t.Vector3(-.1*r,-.18*r,.16*r),reachOpenTip:new t.Vector3(-.62*r,.44*r,-.42*r),reachShutTip:new t.Vector3(-.42*r,.55*r,-.58*r)},{id:"index",hip:new t.Vector3(-.34*r,ie,-.34*r),scale:1.05,thick:1.05,darkTip:!1,bendSign:1,mode:Ts,planeYaw:.14,home:new t.Vector3(-.44*r,0,-.54*r),tuck:new t.Vector3(-.06*r,-.3*r,.14*r),fist:new t.Vector3(-.06*r,-.2*r,.2*r),reachOpenTip:new t.Vector3(-.34*r,.62*r,-.72*r),reachShutTip:new t.Vector3(-.42*r,.55*r,-.58*r)},{id:"middle",hip:new t.Vector3(-.1*r,u,-.34*r),scale:1,thick:1,darkTip:!0,bendSign:1,mode:Ts,planeYaw:0,home:new t.Vector3(-.13*r,0,-.58*r),tuck:new t.Vector3(-.04*r,-.3*r,.16*r),fist:new t.Vector3(-.04*r,-.2*r,.2*r)},{id:"ring",hip:new t.Vector3(.16*r,f,-.28*r),scale:.93,thick:.94,darkTip:!0,bendSign:1,mode:Ts,planeYaw:-.2,home:new t.Vector3(.22*r,0,-.5*r),tuck:new t.Vector3(.06*r,-.28*r,.16*r),fist:new t.Vector3(.08*r,-.19*r,.2*r)},{id:"pinky",hip:new t.Vector3(.38*r,p,-.12*r),scale:.85,thick:.86,darkTip:!0,bendSign:1,mode:Ts,planeYaw:-.42,home:new t.Vector3(.5*r,0,-.3*r),tuck:new t.Vector3(.12*r,-.26*r,.14*r),fist:new t.Vector3(.16*r,-.18*r,.18*r)}],O=[],U=[];let J=0;for(let k=0;k<Y.length;k++){const q=Y[k],de=new t.Group;de.name="finger-"+q.id,de.position.copy(q.hip),de.scale.setScalar(q.scale);const oe=new t.Mesh(w,o);oe.scale.set(q.thick,1,q.thick*.88),oe.castShadow=!0,de.add(oe);const Me=new t.Group;Me.position.set(0,-x,0);const we=new t.Mesh(S,q.darkTip?c:o);we.scale.set(q.thick*.95,1,q.thick*.85),we.castShadow=!0,Me.add(we),de.add(Me),_.add(de);const L={root:de,knee:Me,hip:q.hip,l1:x*q.scale,l2:m*q.scale,bendSign:q.bendSign,mode:q.mode,planeYaw:q.planeYaw};q.mode===Ts?(L.home=q.home,L.tuck=q.tuck,L.fist=q.fist,L.strideScale=q.scale,L.fistSide=O.length===0?-1:O.length===2?1:0,L.alwaysCurled=!!q.alwaysCurled,L.reachOpenTip=q.reachOpenTip,L.reachShutTip=q.reachShutTip,L.phase=q.alwaysCurled?0:Fw[J]||0,q.alwaysCurled||J++,O.push(L),he.push(new t.SphereGeometry(.075*r,8,6).translate(q.hip.x,q.hip.y-.02*r,q.hip.z))):(L.openTip=q.openTip,L.closedTip=q.closedTip,L.bendRoll=q.bendRoll||0,L.reachOpenTip=q.reachOpenTip,L.reachShutTip=q.reachShutTip,L.airTip=q.airTip,L.swayPhase=q.swayPhase,U.push(L)),q.id!=="thumb"&&he.push(new t.SphereGeometry(.082*r,8,6).scale(1,.7,1).translate(q.hip.x,a+h*.42,q.hip.z*.86))}const ne=new t.Mesh(nc(t,X),o);ne.castShadow=!0,ne.receiveShadow=!0,_.add(ne);const V=new t.Mesh(nc(t,he),c);V.castShadow=!0,V.receiveShadow=!0,_.add(V);for(let k=0;k<X.length;k++)X[k].dispose();for(let k=0;k<he.length;k++)he[k].dispose();E.dispose();let re=0,se=0,_e=0,Ae=0,Pe=0,Ue=0,Fe=0;function F(k){Pe=Ar(Number.isFinite(k)?k:0)}function N(k){Fe=Ar(Number.isFinite(k)?k:0)}function G(k,q){const de=q||Np;let oe=Number.isFinite(k)?k:0;oe<0?oe=0:oe>.05&&(oe=.05),re+=oe;const Me=Number.isFinite(de.time)?de.time:re,we=Number.isFinite(de.speed)?Math.max(0,de.speed):0,L=Ar(Number.isFinite(de.dread)?de.dread:0),Ke=de.grounded===void 0?!0:!!de.grounded;_e=eu(_e,Ke?0:1,nA,oe),_e<5e-4?_e=0:_e>.9995&&(_e=1),Ue=eu(Ue,Fe,$w,oe),Ue<5e-4?Ue=0:Ue>.9995&&(Ue=1),Ae=eu(Ae,Pe,Pe>Ae?iA:sA,oe);const qe=1-Ae,R=1-qe*qe,M=Ae*Ae,K=Ar(we/(n.player.walkSpeed||1)),te=cA(Ow,Bw,we)*(1-_e),ce=Math.min(Pw+Lw*we,Dw);se+=es*ce*oe*(1-_e*.85),se>=es&&(se-=es*Math.floor(se/es));const Re=Math.min(we/(4*ce),Nw*r)*te,Ce=Uw*r*te,ge=se*3,be=zw*r*te*Math.sin(ge)-kw*r*K*(1-_e),Le=-.09*K*(1-_e)+Gw*_e,Ze=Hw*te*Math.sin(se+.8),Ne=Ww*te*Math.sin(se+2.1),Be=L*L,Je=Me*rA,rt=aA*r*Be,ct=oA*Be;_.rotation.set(Le+Kw*Ue+_r(Je,3)*ct,Ne+_r(Je,4)*ct,Ze+_r(Je,5)*ct);const Z=Zw*Ue-Jw*R;_.scale.set(1-Z*.55,1+Z,1-Z*.55),Qo.set(0,a,0).applyQuaternion(_.quaternion),_.position.set(-Qo.x+_r(Je,0)*rt,a-Qo.y+be+jw*r*Ue+_r(Je,1)*rt,-Qo.z-Vw*r*K*(1-_e)+_r(Je,2)*rt*.7),_.updateMatrix(),Ip.copy(_.matrix).invert();for(let De=0;De<O.length;De++){const le=O[De],ze=se+le.phase,Ge=Math.sin(ze),Te=Math.cos(ze),Qe=le.alwaysCurled?0:Re*le.strideScale;mr.set(le.home.x,Math.max(0,-Ge)*Ce,le.home.z-Te*Qe),mr.applyMatrix4(Ip),le.reachOpenTip&&Ue>0&&(gr.copy(le.reachOpenTip),sa.copy(le.reachShutTip),As.copy(gr).lerp(sa,R),mr.lerp(As,Ue));const We=le.alwaysCurled?1:M;We>0&&le.fist&&(jo.copy(le.hip).add(le.fist),mr.lerp(jo,We)),_e>0&&(jo.copy(le.hip).add(le.tuck),mr.lerp(jo,_e)),Up(le.root,le.knee,le.hip,mr,le.l1,le.l2,le.bendSign,Ts,le.planeYaw),We>0&&!le.reachOpenTip&&(Dp.set(Qw,le.planeYaw-tA*le.fistSide,0),Lp.setFromEuler(Dp),le.root.quaternion.slerp(Lp,We),le.knee.rotation.x+=(eA-le.knee.rotation.x)*We)}for(let De=0;De<U.length;De++){const le=U[De];gr.copy(le.openTip),_e>0&&gr.lerp(le.airTip,_e),Ue>0&&gr.lerp(le.reachOpenTip,Ue),sa.copy(le.closedTip),Ue>0&&sa.lerp(le.reachShutTip,Ue),As.copy(gr).lerp(sa,R),As.y+=Xw*r*te*Math.sin(ge+le.swayPhase),As.z+=qw*r*te*Math.sin(se+le.swayPhase),As.y+=Yw*r*(1-te)*(1-R)*Math.sin(Me*1.7+le.swayPhase),Up(le.root,le.knee,le.hip,As,le.l1,le.l2,le.bendSign,fg,0,le.bendRoll)}}return G(0,Np),{group:C,setPinch:F,setReach:N,update:G}}const Fp=Math.PI*2,Gi=.02,oa=.0015,hA=.35,Op=.06,uA=.4,Bp=.3,dA=.45,ic=.3,fA=2.2,zp=.46,kp=-1,Vp=12,sc=new I,rc=new I,Gp=new I,Hp=new I,Wp=[],pA=[];function mA(s){return s<0?0:s>1?1:s}function ac(s,e,t,n){return s+(e-s)*(1-Math.exp(-t*n))}function oc(s){let e=(s+Math.PI)%Fp;return e<0&&(e+=Fp),e-Math.PI}function gA(s){const e=s.state,t=s.bus,n=He.player,i=n.radius,r=n.height,a=lA(s.THREE||so,s.CONFIG||He),o=a&&a.group||new ri;o.name="player";const c=!!(a&&typeof a.update=="function"),l=!!(a&&typeof a.setPinch=="function"),h=!!(a&&typeof a.setReach=="function");s.scene&&s.scene.add(o);const d={speed:0,grounded:!1,dread:0,time:0};let u=0,f=0,p=!1,x=!1,m=0,g=0,v=0,b=0,y=0,w=0,S=0,C=0,_=0,E=!1,A=0;function P(ie){const ae=e.player;ae.grabPoint.set(ae.pos.x+kp*Math.sin(ie)*zp,ae.pos.y+He.emeem.hoverY+(He.player.pinchHeight-He.emeem.hoverY)*ae.reach,ae.pos.z+kp*Math.cos(ie)*zp)}function D(){sc.set(b-i,y+Gi,w-i),rc.set(b+i,y+r-Gi,w+i)}function H(ie,ae){let Y=-1/0;for(let U=0;U<ae.length;U++)ae[U].max.y>Y&&(Y=ae[U].max.y);const O=Y-y;return!(O>1e-4)||O>hA||(Gp.set(b-i,Y+Gi,w-i),Hp.set(b+i,Y+r-Gi,w+i),ie.queryAABB(Gp,Hp,pA).length>0)?!1:(y=Y,C<0&&(C=0),E=!0,Y>A&&(A=Y),!0)}function W(ie,ae,Y,O){D();const U=ie.queryAABB(sc,rc,Wp);if(U.length!==0&&!(O&&H(ie,U)))if(Y>0){let J=1/0;for(let ne=0;ne<U.length;ne++){const V=U[ne],re=(ae?V.min.x:V.min.z)-i-oa;re<J&&(J=re)}ae?b>J&&(b=J,S>0&&(S=0)):w>J&&(w=J,_>0&&(_=0))}else if(Y<0){let J=-1/0;for(let ne=0;ne<U.length;ne++){const V=U[ne],re=(ae?V.max.x:V.max.z)+i+oa;re>J&&(J=re)}ae?b<J&&(b=J,S<0&&(S=0)):w<J&&(w=J,_<0&&(_=0))}else for(let J=0;J<U.length;J++){const ne=U[J],V=ae?b:w,re=(ae?ne.max.x:ne.max.z)+i+oa-V,se=V-((ae?ne.min.x:ne.min.z)-i-oa),_e=re<se?re:-se;ae?b+=_e:w+=_e}}function B(ie,ae){sc.set(b-i+Gi,y,w-i+Gi),rc.set(b+i-Gi,y+r,w+i-Gi);const Y=ie.queryAABB(sc,rc,Wp);if(Y.length!==0)if(C<=0){let O=-1/0;for(let U=0;U<Y.length;U++){const J=Y[U].max.y;ae>=J-Op&&J>O&&(O=J)}if(O===-1/0){let U=-1/0;for(let J=0;J<Y.length;J++)Y[J].max.y>U&&(U=Y[J].max.y);U-y>0&&U-y<=r*.75&&(O=U)}O>-1/0&&(y=O,C=0,E=!0,O>A&&(A=O))}else{let O=1/0;for(let U=0;U<Y.length;U++){const J=Y[U].min.y;ae+r<=J+Op&&J<O&&(O=J)}O<1/0&&(y=O-r-oa,C=0)}}function $(ie,ae){const Y=ae&&ae.world||s.world,O=e.player,U=e.input;if(!(ie>0))return;const J=ie;let ne=U.x||0,V=-(U.z||0);const re=Math.hypot(ne,V);re>1&&(ne/=re,V/=re);const se=re>.001,_e=O.grounded;if(b=O.pos.x,y=O.pos.y,w=O.pos.z,S=O.vel.x,C=O.vel.y,_=O.vel.z,E=!1,A=-1/0,se){const Me=n.accel*(_e?1:n.airControl),we=n.walkSpeed*(1-n.reachSlowdown*e.player.reach),L=ne*we-S,Ke=V*we-_,qe=Math.hypot(L,Ke);if(qe>1e-6){const R=Me*J,M=qe>R?R/qe:1;S+=L*M,_+=Ke*M}}else if(_e){const Me=Math.exp(-n.friction*J);S*=Me,_*=Me,Math.abs(S)<.01&&(S=0),Math.abs(_)<.01&&(_=0)}C+=n.gravity*J,C<n.maxFallSpeed&&(C=n.maxFallSpeed),u=_e?n.coyoteTime:Math.max(0,u-J);const Ae=U.jump===!0,Pe=U.jumpPressed===!0||Ae&&!p;p=Ae,U.jumpPressed=!1,f=Pe?n.jumpBuffer:Math.max(0,f-J);let Ue=!1;f>0&&u>0&&(C=n.jumpVelocity,f=0,u=0,Ue=!0);const Fe=b,F=w,N=(_e||u>0)&&C<=.01,G=S*J;b+=G,Y&&W(Y,!0,G,N);const k=_*J;w+=k,Y&&W(Y,!1,k,N);const q=y,de=C;y+=C*J;const oe=Y?Y.sampleGroundY(b,w):He.world.groundY;if(Y&&B(Y,q),y<=oe&&(y=oe,C<0&&(C=0),E=!0,oe>A&&(A=oe)),Number.isFinite(A)||(A=oe),(!Number.isFinite(b)||!Number.isFinite(y)||!Number.isFinite(w))&&(b=0,y=oe+n.spawnHeight,w=0,S=0,C=0,_=0,E=!1),O.pos.set(b,y,w),O.vel.set(S,C,_),O.grounded=E,O.groundY=A,O.distanceRun+=Math.hypot(b-Fe,w-F),Ue&&t&&t.emit("jump",{position:O.pos.clone()}),E&&!x){const Me=de<0?-de:0;if(t&&(t.emit("land",{position:O.pos.clone(),impact:Me}),Me>Vp)){const we=Math.min(.45,(Me-Vp)/26);t.emit("shake",{amount:we})}}x=E}function X(ie,ae){const Y=e.player,O=ie>0?ie:0;m+=O;const U=Math.hypot(Y.vel.x,Y.vel.z);if(U>uA){const se=Math.atan2(-Y.vel.x,-Y.vel.z),_e=oc(se-Y.yaw);Y.yaw=oc(Y.yaw+_e*(1-Math.exp(-n.turnLerp*O)))}const J=He.emeem;let ne=0;if(Y.hasNearestEmeem&&Number.isFinite(Y.nearestEmeemDist)){const se=J.pickupRadius*fA,_e=Math.max(.001,J.reachRadius-se);ne=mA((J.reachRadius-Y.nearestEmeemDist)/_e)}Y.reach=ac(Y.reach,ne,n.reachOpenRate,O),Y.reach<.001&&(Y.reach=0),g>0?(g-=O,Y.pinch=ac(Y.pinch,1,n.pinchSnapRate,O)):(Y.pinch=ac(Y.pinch,0,n.pinchReleaseRate,O),Y.pinch<.002&&(Y.pinch=0));let V=0;if(Y.reach>.01&&Y.hasNearestEmeem){const se=Y.nearestEmeem.x-Y.pos.x,_e=Y.nearestEmeem.z-Y.pos.z;if(se*se+_e*_e>1e-4){const Ae=Math.atan2(-se,-_e);V=oc(Ae-Y.yaw)*dA*Y.reach,V>ic?V=ic:V<-ic&&(V=-ic)}}v=ac(v,V,n.turnLerp,O),v<1e-4&&v>-1e-4&&(v=0);const re=oc(Y.yaw+v);P(re),o.position.copy(Y.pos),o.rotation.y=re,h&&a.setReach(Y.reach),l&&a.setPinch(Math.max(Bp*(1-Y.reach),Y.pinch)),c&&(d.speed=e.phase==="playing"?U:0,d.grounded=Y.grounded,d.dread=e.dread,d.time=m,a.update(O,d))}function he(){const ie=s.world,ae=e.player,Y=ie?ie.sampleGroundY(0,0):He.world.groundY;ae.pos.set(0,Y+n.spawnHeight,0),ae.vel.set(0,0,0),ae.yaw=0,ae.grounded=!1,ae.groundY=Y,ae.pinch=0,ae.reach=0,ae.distanceRun=0,P(0),e.input.jumpPressed=!1,u=0,f=0,p=e.input.jump===!0,x=!1,g=0,v=0,h&&a.setReach(0),o.position.copy(ae.pos),o.rotation.set(0,0,0),l&&a.setPinch(Bp)}return t&&t.on("collect",()=>{g=He.player.pinchHoldTime}),he(),{object3D:o,fixedUpdate:$,update:X,reset:he}}const xA=Math.PI*2,Xp=new I,qp=new I,_A=[],Yp=new I(0,1,0),$p=new Xt().setFromAxisAngle(new I(0,0,1),.42),ca=He.palette.emeems,Lt=He.emeem,Si=Math.max(32,Math.min(120,He.emeem.perChunk*(He.world.viewChunks*2+1)**2)),Nu=12,Uu=Math.max(Nu+8,He.world.fogFar*.3),pg=Nu*Nu,mg=Uu*Uu,Zp=5,yA=Zp*Zp,Jp=Uu+25,vA=Jp*Jp,MA=Math.PI*(mg-pg),bA=He.emeem.perChunk/(He.world.chunkSize*He.world.chunkSize),Kp=Math.max(12,Math.min(Si-8,Math.round(bA*MA))),SA=3,wA=5,AA=12,cc=Lt.radius+.55,TA=Lt.hoverY+Lt.bobHeight+Lt.radius,EA=-(Lt.hoverY+He.player.radius),CA=He.player.height+Lt.hoverY,RA=Lt.pickupRadius*Lt.pickupRadius,Fu=Lt.magnetRadius,IA=Fu*Fu,tu=Lt.radius*7.5,nu=.24,la=8,jp=.38,iu=Lt.radius*2.4,PA=Lt.radius*9;let su=null;function LA(){if(su)return su;const s=64,e=new Uint8Array(s*s*4),t=(s-1)*.5,n=1/t;for(let r=0;r<s;r++)for(let a=0;a<s;a++){const o=(a-t)*n,c=(r-t)*n,l=Math.sqrt(o*o+c*c);let h=0;if(l<1){const u=(1-l)**2.2*.7,f=Math.max(0,1-l*2.6)**3*.55;h=Math.min(1,u+f)}const d=(r*s+a)*4;e[d]=255,e[d+1]=255,e[d+2]=255,e[d+3]=h*255|0}const i=new Dn(e,s,s,cn);return i.minFilter=It,i.magFilter=It,i.wrapS=on,i.wrapT=on,i.generateMipmaps=!1,i.needsUpdate=!0,su=i,i}function Qp(s,e){const t=s.attributes.position.count,n=new Float32Array(t*3);n.fill(e),s.setAttribute("color",new At(n,3))}function DA(s){const e=new ri;e.name="emeems";const t=new Gs(Lt.radius,20,12);t.scale(1,.3,1);const n=Lt.radius*.3,i=new Gs(n,14,10);i.scale(1,1.25,1),i.translate(0,Lt.radius*.3*.72,0),Qp(t,1),Qp(i,He.palette.emeemTipShade);const r=dg([t,i],!1);t.dispose(),i.dispose(),r.computeBoundingSphere();const a=LA(),o=ca.map(A=>new Jl({color:A,vertexColors:!0,roughness:.62,metalness:0,emissive:A,emissiveIntensity:.16})),c=ca.map(A=>new Ga({map:a,color:A,transparent:!0,opacity:.3,blending:Ia,depthWrite:!1,fog:!1,toneMapped:!1})),l=new Array(Si);for(let A=0;A<Si;A++){const P=A%ca.length,D=new Bt(r,o[P]);D.castShadow=!1,D.receiveShadow=!1,D.visible=!1;const H=new al(c[P]);H.visible=!1,H.renderOrder=2,e.add(D),e.add(H),l[A]={mesh:D,glow:H,active:!1,basePos:new I,phase:0,colorIndex:P,respawnAt:0,pop:0}}const h=new Array(la);for(let A=0;A<la;A++){const P=new Ga({map:a,transparent:!0,opacity:0,blending:Ia,depthWrite:!1,fog:!1,toneMapped:!1}),D=new al(P);D.visible=!1,D.renderOrder=3,e.add(D),h[A]={sprite:D,mat:P,life:0}}let d=0,u=0,f=0,p=0,x=!1,m=-1;function g(A,P,D,H){A.colorIndex=Math.random()*ca.length|0,A.mesh.material=o[A.colorIndex],A.glow.material=c[A.colorIndex],A.basePos.set(P,D+Lt.hoverY,H),A.phase=Math.random()*xA,A.active=!0,A.pop=0,A.mesh.scale.setScalar(1),A.mesh.position.copy(A.basePos),A.mesh.visible=!0,A.glow.position.copy(A.basePos),A.glow.scale.setScalar(tu),A.glow.visible=!0,d++}function v(A){A.active&&d--,A.active=!1,A.pop=0,A.mesh.visible=!1,A.glow.visible=!1,A.mesh.scale.setScalar(1)}function b(A,P,D,H,W,B,$){const X=H.monster.pos.x,he=H.monster.pos.z,ie=He.monster.catchRadius*4,ae=ie*ie;for(let Y=0;Y<$;Y++){const U=(Math.random()+Math.random()-1)*Math.PI,J=Math.sqrt(B+Math.random()*(mg-B)),ne=P+Math.sin(U)*J,V=D-Math.cos(U)*J,re=ne-X,se=V-he;if(re*re+se*se<ae)continue;const _e=W?W.sampleGroundY(ne,V):He.world.groundY;if(!(W&&(Xp.set(ne-cc,_e+.05,V-cc),qp.set(ne+cc,_e+TA,V+cc),W.queryAABB(Xp,qp,_A).length>0)))return g(A,ne,_e,V),!0}return!1}function y(A,P,D,H){const W=h[f];f=(f+1)%la,W.life<=0&&p++,W.life=jp,W.mat.color.setHex(H),W.mat.opacity=.95,W.sprite.position.set(A,P,D),W.sprite.scale.setScalar(iu),W.sprite.visible=!0}function w(A,P){const D=A.mesh.position,H=ca[A.colorIndex];y(D.x,D.y,D.z,H),d--,A.active=!1,A.pop=nu,A.respawnAt=P.time+Math.max(Lt.respawnDelay,nu+.05),typeof s.addScore=="function"&&s.addScore(1),s.bus&&s.bus.emit("collect",{position:new I(D.x,D.y,D.z),color:H,score:P.score})}function S(A,P){x=!0;for(let D=0;D<Si&&d<Kp;D++){const H=l[u];u=(u+1)%Si,!(H.active||H.pop>0)&&(H.respawnAt=0,b(H,A.player.pos.x,A.player.pos.z,A,P,yA,AA))}}function C(A){if(Math.abs(A-m)<.01)return;m=A;const P=.38+.72*A,D=.42+.36*A;for(let H=0;H<o.length;H++)o[H].emissiveIntensity=P,c[H].opacity=D}function _(A,P){const D=P&&P.state||s.state,H=P&&P.world||s.world;x||S(D,H),C(D.dread);const W=D.player.pos.x,B=D.player.pos.y,$=D.player.pos.z,X=D.time;let he=1/0,ie=null;for(let Y=0;Y<Si;Y++){const O=l[Y];if(O.pop>0){if(O.pop-=A,O.pop<=0){O.pop=0,O.mesh.visible=!1,O.glow.visible=!1,O.mesh.scale.setScalar(1);continue}const Ae=1-O.pop/nu;if(O.mesh.scale.setScalar((1+.5*Ae)*(1-Ae*Ae)),D.player.grabPoint){const Pe=1-Math.exp(-20*A);O.mesh.position.x+=(D.player.grabPoint.x-O.mesh.position.x)*Pe,O.mesh.position.y+=(D.player.grabPoint.y-O.mesh.position.y)*Pe,O.mesh.position.z+=(D.player.grabPoint.z-O.mesh.position.z)*Pe}else O.mesh.position.y+=A*1.6;O.mesh.quaternion.setFromAxisAngle(Yp,X*Lt.spinSpeed*4+O.phase).multiply($p),O.glow.position.copy(O.mesh.position),O.glow.scale.setScalar(tu*(1+1.6*Ae)*(1-Ae*Ae*Ae));continue}if(!O.active)continue;const U=O.basePos;let J=W-U.x,ne=$-U.z,V=J*J+ne*ne;if(V>vA){v(O),O.respawnAt=0;continue}const re=U.y-B,se=re>EA&&re<CA;if(se&&V<IA){const Ae=Math.sqrt(V),Pe=D.player.grabPoint?D.player.grabPoint.x:W,Ue=D.player.grabPoint?D.player.grabPoint.z:$,Fe=D.player.grabPoint?D.player.grabPoint.y:B+Lt.hoverY,F=1-Ae/Fu,N=1-Math.exp(-Lt.magnetStrength*F*A);U.x+=(Pe-U.x)*N,U.z+=(Ue-U.z)*N,U.y+=(Fe-U.y)*N,J=W-U.x,ne=$-U.z,V=J*J+ne*ne}if(se&&V<he&&(he=V,ie=O),se&&V<RA){O.mesh.position.set(U.x,U.y+Math.sin(X*Lt.bobSpeed+O.phase)*Lt.bobHeight,U.z),w(O,D);continue}const _e=U.y+Math.sin(X*Lt.bobSpeed+O.phase)*Lt.bobHeight;O.mesh.position.set(U.x,_e,U.z),O.mesh.quaternion.setFromAxisAngle(Yp,X*Lt.spinSpeed+O.phase).multiply($p),O.glow.position.set(U.x,_e,U.z),O.glow.scale.setScalar(tu*(1+.07*Math.sin(X*Lt.bobSpeed*1.7+O.phase)))}ie?(D.player.hasNearestEmeem=!0,D.player.nearestEmeemDist=Math.sqrt(he),D.player.nearestEmeem.copy(ie.mesh.position)):(D.player.hasNearestEmeem=!1,D.player.nearestEmeemDist=1/0);let ae=SA;for(let Y=0;Y<Si&&d<Kp&&ae>0;Y++){const O=l[u];if(u=(u+1)%Si,!(O.active||O.pop>0||X<O.respawnAt))if(b(O,W,$,D,H,pg,wA))ae--;else break}if(p>0)for(let Y=0;Y<la;Y++){const O=h[Y];if(O.life<=0)continue;if(O.life-=A,O.life<=0){O.life=0,O.mat.opacity=0,O.sprite.visible=!1,p--;continue}const U=1-O.life/jp;O.sprite.scale.setScalar(iu+(PA-iu)*Math.sqrt(U)),O.sprite.position.y+=A*.9,O.mat.opacity=(1-U)*(1-U)*.95}}function E(){for(let A=0;A<Si;A++){const P=l[A];v(P),P.respawnAt=0}d=0,u=0;for(let A=0;A<la;A++){const P=h[A];P.life=0,P.mat.opacity=0,P.sprite.visible=!1}p=0,f=0,m=-1,x=!1,S(s.state,s.world),C(s.state.dread)}return s.scene&&s.scene.add(e),{group:e,update:_,reset:E}}const hs=so,NA=new hs.Color,UA=new hs.Color,em=new hs.Vector3,tm=new hs.Quaternion,nm=new hs.Euler,im=new hs.Matrix4,sm=new hs.Vector3,FA={},yr=Math.PI*2,Yn=s=>s<0?0:s>1?1:s,$i=(s,e,t)=>s+(e-s)*t,Es=s=>s*s,Rt=(s,e)=>Math.exp(-(s*s/(e*e)));function kt(s,e,t){const n=e-s,i=Yn(n===0?t>=e?1:0:(t-s)/n);return i*i*(3-2*i)}const OA=(s,e,t,n)=>$i(s,e,1-Math.exp(-6*n));function ru(s,e){let t=Math.imul(s|0,374761393)+Math.imul(e|0,668265263)|0;return t=Math.imul(t^t>>>13,1274126177),((t^t>>>16)>>>0)/4294967296}function lc(s,e,t,n,i){const r=i*i,a=r*i;return .5*(2*e+(-s+t)*i+(2*s-5*e+4*t-n)*r+(-s+3*e-3*t+n)*a)}const BA=3.4,ti=1.4,rm=.7,zA=.12,am=2.98,vr=2.92,ha=2.36,Rr=2.03,Hi=.344,ua=.52,da=.325,au=.046,hc=.035,wi=[[1.26,.3,.24,.24,.9],[1.44,.56,.42,.38,.88],[1.64,.64,.5,.44,.86],[1.84,.67,.55,.46,.86],[2.04,.685,.575,.47,.85],[2.24,.665,.555,.46,.84],[2.46,.645,.505,.455,.82],[2.7,.665,.475,.45,.8],[2.9,.735,.465,.44,.78],[3.1,.7,.432,.408,.8],[3.34,.34,.245,.26,.88]],fa=wi[0][0],uc=wi[wi.length-1][0],jt=34,ni=32,kA=.62,ou={mouthY:Rr,mouthArc:.132,mouthHalfW:.492,creaseDepth:.064,creaseSig:.044,lipUp:.024,lipDn:.048,lipOff:.09,lipSig:.076,cornerPull:.046,cornerDepth:.034,cornerPinch:.018,mawDepth:0,jawDrop:0,lipFlare:0,mawRx:.47,mawRy:.21,browFurrow:0,browRidge:0,navelDepth:.072,noseRidge:.024,nostril:.006,sternum:.02,pecCrease:.022,chestSwell:0,bellySwell:0,flankSwell:0,trapRise:0,crane:0},VA={mouthY:Rr-.015,mouthArc:.19,mouthHalfW:.62,creaseDepth:.105,creaseSig:.05,lipUp:.052,lipDn:.082,lipOff:.105,lipSig:.082,cornerPull:.092,cornerDepth:.062,cornerPinch:.115,browFurrow:.052,browRidge:.048,navelDepth:.105,noseRidge:.072,nostril:.042,sternum:.038,pecCrease:.034,chestSwell:.07,bellySwell:.055,flankSwell:.098,trapRise:.075,crane:.07},om={mawDepth:.48,jawDrop:.25,lipFlare:.105,mouthHalfW:.55,creaseDepth:.012,lipUp:.045,lipDn:.06,lipOff:.155,lipSig:.09},GA=0,HA=1,WA=.045,XA=.24,qA=.085,YA=1.35,$A=.34;function ZA(s=hs,e=He){const t=e&&e.palette||{},n=!!(e&&e.render&&e.render.shadows),i=[],r=[],a=z=>(i.push(z),z),o=z=>(r.push(z),z),c={hw:0,front:0,back:0,exp:.85};function l(z){const ee=wi.length;let j=0;for(;j<ee-2&&z>wi[j+1][0];)j++;const ue=wi[j],fe=wi[j+1],ye=fe[0]-ue[0],Se=ye>1e-6?Yn((z-ue[0])/ye):0,ve=wi[j>0?j-1:0],Oe=wi[j+2<ee?j+2:ee-1];return c.hw=lc(ve[1],ue[1],fe[1],Oe[1],Se),c.front=lc(ve[2],ue[2],fe[2],Oe[2],Se),c.back=lc(ve[3],ue[3],fe[3],Oe[3],Se),c.exp=lc(ve[4],ue[4],fe[4],Oe[4],Se),c}const h={x:0,y:0,z:0};function d(z,ee,j){const ue=l(ee),fe=Math.sin(z),ye=Math.cos(z),Se=ue.exp;j.x=ue.hw*Math.sign(fe)*Math.pow(Math.abs(fe),Se);const ve=ye>=0?ue.front:ue.back;return j.z=-ve*Math.sign(ye)*Math.pow(Math.abs(ye),Se),j.y=ee,j}const u={x:0,y:0,z:0},f={x:0,y:0,z:0},p={x:0,y:0,z:0},x={x:0,y:0,z:0},m={x:0,y:0,z:0};function g(z,ee,j){d(z+.012,ee,u),d(z-.012,ee,f),d(z,ee+.012,p),d(z,ee-.012,x);const fe=u.x-f.x,ye=0,Se=u.z-f.z,ve=p.x-x.x,Oe=p.y-x.y,st=p.z-x.z;let nt=ye*st-Se*Oe,it=Se*ve-fe*st,et=fe*Oe-ye*ve;nt*u.x+et*u.z<0&&(nt=-nt,it=-it,et=-et);const Ee=Math.hypot(nt,it,et)||1;return j.x=nt/Ee,j.y=it/Ee,j.z=et/Ee,j}const v={x:0,y:0,z:0};function b(z,ee,j,ue,fe){v.x=0,v.y=0,v.z=0;let ye=0;const Se=z.mouthHalfW,ve=ee/Se,Oe=Math.abs(ve),st=z.mouthY-z.mouthArc*Math.min(ve*ve,1.35),nt=j-st,it=1-kt(.92,1.38,Oe);ye-=z.creaseDepth*Rt(nt,z.creaseSig)*it*ue,ye+=(z.lipUp*Rt(nt-z.lipOff,z.lipSig)+z.lipDn*Rt(nt+z.lipOff,z.lipSig))*it*ue;const et=Rt(Oe-1,.3)*Rt(nt,.14)*fe;if(v.y-=z.cornerPull*et,v.x-=z.cornerPinch*et*Math.sign(ee),ye-=z.cornerDepth*et,z.mawDepth>0||z.jawDrop>0){const ht=ee/z.mawRx,St=(j-(z.mouthY-.02))/z.mawRy,Ut=Math.sqrt(ht*ht+St*St),Qt=Math.max(0,1-Ut*Ut);ye-=z.mawDepth*Math.pow(Qt,1.1)*ue;const Hn=St<-1?-1:St>1?1:St,vt=Hn>0?1.12:.88;v.y+=z.jawDrop*Hn*vt*(1-kt(1,2.1,Ut))*ue,ye+=z.lipFlare*Rt(Ut-1.05,.42)*ue}z.browFurrow>0&&(ye-=z.browFurrow*Rt(Math.abs(ee)-.075,.055)*Rt(j-vr,.115)*ue),z.browRidge>0&&(ye+=z.browRidge*Rt(j-(vr+.16),.115)*(1-kt(.18,.62,Math.abs(ee)))*ue);const Ee=Math.sqrt(Es(ee/.085)+Es((j-ha)/.105));ye-=z.navelDepth*Math.exp(-Ee*Ee)*ue,ye+=z.noseRidge*Rt(ee,.14)*Rt(j-(ha+.17),.2)*ue,ye-=z.nostril*Rt(Math.abs(ee)-.13,.055)*Rt(j-(ha+.015),.065)*ue,ye-=z.sternum*Rt(ee,.055)*(kt(2.4,2.62,j)-kt(3.06,3.26,j))*ue;const ft=2.66+.16*Es(Math.min(1,Math.abs(ee)/.55));return ye-=z.pecCrease*Rt(j-ft,.055)*kt(.12,.34,Math.abs(ee))*(1-kt(.5,.7,Math.abs(ee)))*ue,ye+=z.chestSwell*Rt(j-2.86,.3)*ue,ye+=z.bellySwell*Rt(j-2.1,.34)*ue,ye+=z.flankSwell*Rt(j-2.24,.6)*(1-ue),v.y+=z.trapRise*kt(2.92,3.3,j),v.z-=z.crane*kt(2.8,uc,j),ye}const y=ou,w=Object.assign({},ou,VA),S=Object.assign({},ou,om),C=new Float64Array(ni+1);{const ee=new Float64Array(513),j=(uc-fa)/512;let ue=0;for(let Se=0;Se<=512;Se++){const ve=fa+Se*j,Oe=1+2.4*Rt(ve-Rr,.2)+1.2*Rt(ve-ha,.16)+.9*Rt(ve-vr,.22);ue+=Oe,ee[Se]=ue}const fe=ee[512];let ye=0;for(let Se=0;Se<=ni;Se++){const ve=Se/ni*fe;for(;ye<512&&ee[ye]<ve;)ye++;const Oe=ye>0?ee[ye-1]:0,st=ee[ye],nt=st>Oe?(ve-Oe)/(st-Oe):0;C[Se]=fa+(ye-1+nt)*j}C[0]=fa,C[ni]=uc}const _=new Float64Array(jt);for(let z=0;z<jt;z++){const ee=yr*z/jt;_[z]=ee-kA*Math.sin(ee)}const E=(ni+1)*jt,A=E+2,P=new Float32Array(A*3),D=new Float32Array(A*3),H=new Float32Array(A*3),W=new Float32Array(A*3);function B(z,ee,j,ue,fe,ye,Se,ve,Oe,st,nt){const it=b(Oe,j,ue,st,nt);z[ee]=j+ye*it+v.x,z[ee+1]=ue+Se*it+v.y,z[ee+2]=fe+ve*it+v.z}function $(z,ee,j,ue,fe,ye){let Se=1;Se*=.78+.22*kt(1.25,3.05,j),Se*=1-.24*(1-ue);const ve=ee/y.mouthHalfW,Oe=y.mouthY-y.mouthArc*Math.min(ve*ve,1.35),st=j-Oe,nt=1-kt(.92,1.38,Math.abs(ve)),it=.46*Rt(st,.045)*nt*ue;Se*=1-.74*Math.exp(-(Es(ee/.1)+Es((j-ha)/.12))),Se*=1-.3*Rt(ee,.05)*(kt(2.42,2.62,j)-kt(3.06,3.26,j))*ue;const et=Math.sqrt(Es(ee/S.mawRx)+Es((j-(Rr-.02))/S.mawRy)),Ee=.7*Math.pow(Math.max(0,1-et*et),2.4)*ue;Se*=1-Math.max(it,Ee);let ft=Rt(ee,.3)*Rt(j-3.06,.16)*1.1;ft+=Rt(ee,.055)*(kt(1.6,1.92,j)-kt(2.28,2.5,j))*1.05,ft+=Rt(st+.015,.052)*nt*.45*ue,ft+=Rt(j-2.2,.3)*.22*ue,ft*=.55+.9*ru(fe*7+3,ye*13+5),ft=Yn(ft);const ht=.9+.1*ru(fe+91,ye+17),St=Yn(Se*ht);W[z]=$i(St,St*.36,ft),W[z+1]=$i(St,St*.31,ft),W[z+2]=$i(St,St*.28,ft)}for(let z=0;z<=ni;z++){const ee=C[z];for(let j=0;j<jt;j++){const ue=_[j];d(ue,ee,h),g(ue,ee,m);const fe=kt(.1,.58,-m.z),ye=kt(-.34,.24,-m.z),Se=(z*jt+j)*3;B(P,Se,h.x,h.y,h.z,m.x,m.y,m.z,y,fe,ye),B(D,Se,h.x,h.y,h.z,m.x,m.y,m.z,w,fe,ye),B(H,Se,h.x,h.y,h.z,m.x,m.y,m.z,S,fe,ye),$(Se,h.x,h.y,fe,z,j)}}const X=E,he=E+1;{const z=[[P,y],[D,w],[H,S]];for(let ee=0;ee<z.length;ee++){const j=z[ee][0],ue=z[ee][1];B(j,X*3,0,fa-.06,0,0,-1,0,ue,0,0),B(j,he*3,0,uc+.04,-.02,0,1,0,ue,0,0)}W[X*3]=.55,W[X*3+1]=.5,W[X*3+2]=.48,W[he*3]=.62,W[he*3+1]=.56,W[he*3+2]=.54}const ie=new Uint16Array(ni*jt*6+jt*6);let ae=0;for(let z=0;z<ni;z++)for(let ee=0;ee<jt;ee++){const j=(ee+1)%jt,ue=z*jt+ee,fe=z*jt+j,ye=(z+1)*jt+ee,Se=(z+1)*jt+j;ie[ae++]=ue,ie[ae++]=ye,ie[ae++]=fe,ie[ae++]=fe,ie[ae++]=ye,ie[ae++]=Se}for(let z=0;z<jt;z++){const ee=(z+1)%jt;ie[ae++]=X,ie[ae++]=z,ie[ae++]=ee,ie[ae++]=he,ie[ae++]=ni*jt+ee,ie[ae++]=ni*jt+z}const Y=a(new s.BufferGeometry);Y.setIndex(new s.BufferAttribute(ie,1)),Y.setAttribute("position",new s.BufferAttribute(P,3)),Y.setAttribute("color",new s.BufferAttribute(W,3)),Y.computeVertexNormals();const O=Y.attributes.normal.array;function U(z,ee){const j=new s.BufferGeometry;j.setIndex(new s.BufferAttribute(ie,1)),j.setAttribute("position",new s.BufferAttribute(z,3)),j.computeVertexNormals();const ue=j.attributes.normal.array,fe=new Float32Array(A*3),ye=new Float32Array(A*3);for(let Oe=0;Oe<A*3;Oe++)fe[Oe]=z[Oe]-P[Oe],ye[Oe]=ue[Oe]-O[Oe];j.dispose();const Se=new s.BufferAttribute(fe,3),ve=new s.BufferAttribute(ye,3);return Se.name=ee,ve.name=ee,{pa:Se,na:ve}}const J=U(D,"scowl"),ne=U(H,"maw");Y.morphTargetsRelative=!0,Y.morphAttributes.position=[J.pa,ne.pa],Y.morphAttributes.normal=[J.na,ne.na],Y.computeBoundingSphere(),Y.boundingSphere&&(Y.boundingSphere.radius+=.45);const V=new s.Color(t.hand!==void 0?t.hand:16173480);V.multiplyScalar(.92);const re=V.clone().lerp(new s.Color(t.monsterEye!==void 0?t.monsterEye:16722714),.46),se=V.clone().multiplyScalar(.88),_e=re.clone().multiplyScalar(.88),Ae=new s.Color(t.monsterEye!==void 0?t.monsterEye:16722714),Pe=new s.Color(t.monster!==void 0?t.monster:2822688),Ue=o(new s.MeshStandardMaterial({color:V.clone(),vertexColors:!0,roughness:.88,metalness:0})),Fe=o(new s.MeshStandardMaterial({color:se.clone(),roughness:.92,metalness:0})),F=o(new s.MeshStandardMaterial({color:Pe.clone(),roughness:.98,metalness:0})),N=o(new s.MeshStandardMaterial({color:Pe.clone().multiplyScalar(1.9),roughness:.95,metalness:0})),G=o(new s.MeshStandardMaterial({color:1315866,roughness:.42,metalness:.05})),k=o(new s.MeshStandardMaterial({color:724242,roughness:.14,metalness:.45,emissive:Ae.clone(),emissiveIntensity:0,transparent:!0,opacity:.4,depthWrite:!1})),q=t.emeems||[],de=q[0]??15910067,oe=q[1]??15247508;t.emeemTipShade;const Me=.2;function we(z){return o(new s.MeshStandardMaterial({color:z,roughness:.52,metalness:0,emissive:new s.Color(z),emissiveIntensity:.5}))}function L(z){const ee=new s.Color(z).multiplyScalar(Me);return o(new s.MeshStandardMaterial({color:ee,roughness:.62,metalness:0,emissive:ee.clone(),emissiveIntensity:.05}))}const Ke=we(de),qe=we(oe),R=L(de),M=L(oe),K=o(new s.MeshBasicMaterial({color:Ae.clone(),transparent:!0,opacity:0,depthWrite:!1,blending:s.AdditiveBlending,fog:!1,side:s.DoubleSide})),te=o(new s.MeshStandardMaterial({color:14207408,roughness:.55,metalness:0,flatShading:!0})),ce=new s.Group;ce.name="monsterFace";const Re=new s.Group;ce.add(Re);const Ce=new s.Group;Ce.position.y=ti,Re.add(Ce);const ge=new s.Mesh(Y,Ue);ge.position.y=-ti,ge.castShadow=n,Ce.add(ge);const be=ge.morphTargetInfluences;function Le(z,ee){const j=z.length,ue=new Float32Array(j*ee*3),fe=new Uint16Array((j-1)*ee*6);let ye=0;for(let ve=0;ve<j;ve++){const Oe=z[ve];for(let st=0;st<ee;st++){const nt=yr*st/ee,it=nt-.25*Math.sin(nt),et=Math.sin(it),Ee=Math.cos(it),ft=(ve*ee+st)*3;ue[ft]=Oe[1]*Math.sign(et)*Math.pow(Math.abs(et),Oe[4]),ue[ft+1]=Oe[0],ue[ft+2]=-(Ee>=0?Oe[2]:Oe[3])*Math.sign(Ee)*Math.pow(Math.abs(Ee),Oe[4])}}for(let ve=0;ve<j-1;ve++)for(let Oe=0;Oe<ee;Oe++){const st=(Oe+1)%ee,nt=ve*ee+Oe,it=ve*ee+st,et=(ve+1)*ee+Oe,Ee=(ve+1)*ee+st;fe[ye++]=nt,fe[ye++]=it,fe[ye++]=et,fe[ye++]=it,fe[ye++]=Ee,fe[ye++]=et}const Se=new s.BufferGeometry;return Se.setIndex(new s.BufferAttribute(fe,1)),Se.setAttribute("position",new s.BufferAttribute(ue,3)),Se.computeVertexNormals(),a(Se)}const Ze=Le([[1.48,.7,.56,.52,.85],[1.32,.72,.575,.535,.86],[1.14,.7,.55,.51,.88],[1,.64,.5,.475,.9],[.88,.59,.455,.445,.92]],20),Ne=new s.Mesh(Ze,F);Ne.castShadow=n,Re.add(Ne);const Be=Le([[1.5,.712,.572,.532,.85],[1.4,.722,.58,.54,.85],[1.34,.706,.566,.526,.85]],20),Je=new s.Mesh(Be,N);Je.castShadow=!1,Re.add(Je);const rt=ti-rm,ct=rm-zA,Z=a(new s.CapsuleGeometry(.215,rt-.1,3,8)),De=a(new s.CapsuleGeometry(.17,ct-.08,3,8)),le=a(new s.BoxGeometry(.3,.16,.56)),ze=a(new s.CapsuleGeometry(.19,.6,3,8)),Ge=a(new s.CapsuleGeometry(.158,.54,3,8)),Te=a(new s.SphereGeometry(1,8,6));function Qe(z){const ee=new s.Group;ee.position.set(z*.285,ti,.02),Re.add(ee);const j=new s.Mesh(Z,Fe);j.position.y=-rt*.5,j.castShadow=n,ee.add(j);const ue=new s.Group;ue.position.y=-rt,ee.add(ue);const fe=new s.Mesh(De,Fe);fe.position.y=-ct*.5,fe.castShadow=n,ue.add(fe);const ye=new s.Mesh(le,Fe);return ye.position.set(0,-ct-.03,-.14),ye.castShadow=n,ue.add(ye),{hip:ee,knee:ue,foot:ye}}const We=Qe(-1),Tt=Qe(1);function je(z){const ee=new s.Group;ee.position.set(z*.735,am-ti,-.02),Ce.add(ee);const j=new s.Mesh(ze,Fe);j.position.y=-.36,j.castShadow=n,ee.add(j);const ue=new s.Group;ue.position.y=-.72,ee.add(ue);const fe=new s.Mesh(Ge,Fe);fe.position.y=-.33,fe.castShadow=n,ue.add(fe);const ye=new s.Mesh(Te,Fe);return ye.scale.set(.155,.22,.12),ye.position.y=-.78,ye.castShadow=n,ue.add(ye),{shoulder:ee,elbow:ue}}const lt=je(-1),ot=je(1);function Vt(z,ee,j,ue){const fe=ee*.5,ye=j*.5,Se=Math.min(ue,fe,ye);return z.moveTo(-fe+Se,-ye),z.lineTo(fe-Se,-ye),z.absarc(fe-Se,-ye+Se,Se,-Math.PI*.5,0,!1),z.lineTo(fe,ye-Se),z.absarc(fe-Se,ye-Se,Se,0,Math.PI*.5,!1),z.lineTo(-fe+Se,ye),z.absarc(-fe+Se,ye-Se,Se,Math.PI*.5,Math.PI,!1),z.lineTo(-fe,-ye+Se),z.absarc(-fe+Se,-ye+Se,Se,Math.PI,Math.PI*1.5,!1),z}function hn(z,ee,j,ue){const fe=Vt(new s.Shape,z,ee,j).getPoints(5),ye=fe[0],Se=fe[fe.length-1];fe.length>1&&Math.abs(ye.x-Se.x)<1e-6&&Math.abs(ye.y-Se.y)<1e-6&&fe.pop();const ve=fe.length,Oe=new Float32Array((ve*ue+1)*3);for(let et=1;et<=ue;et++){const Ee=et/ue;for(let ft=0;ft<ve;ft++){const ht=(1+(et-1)*ve+ft)*3;Oe[ht]=fe[ft].x*Ee,Oe[ht+1]=fe[ft].y*Ee}}const st=new Uint16Array(ve*3+(ue-1)*ve*6);let nt=0;for(let et=0;et<ve;et++){const Ee=(et+1)%ve;st[nt++]=0,st[nt++]=1+Ee,st[nt++]=1+et}for(let et=1;et<ue;et++)for(let Ee=0;Ee<ve;Ee++){const ft=(Ee+1)%ve,ht=1+(et-1)*ve+Ee,St=1+(et-1)*ve+ft,Ut=1+et*ve+Ee,Qt=1+et*ve+ft;st[nt++]=ht,st[nt++]=St,st[nt++]=Ut,st[nt++]=St,st[nt++]=Qt,st[nt++]=Ut}const it=new s.BufferGeometry;return it.setIndex(new s.BufferAttribute(st,1)),it.setAttribute("position",new s.BufferAttribute(Oe,3)),it}function fi(z,ee){const j=l(ee),ue=Math.min(.985,Math.abs(z)/Math.max(1e-4,j.hw)),fe=Math.pow(ue,1/j.exp),ye=Math.sqrt(Math.max(0,1-fe*fe));return-j.front*Math.pow(ye,j.exp)}function An(z,ee,j){const ue=z.attributes.position;for(let fe=0;fe<ue.count;fe++){const ye=fi(ue.getX(fe)+ee,ue.getY(fe)+vr);ue.setZ(fe,ue.getZ(fe)+ye-j)}return ue.needsUpdate=!0,z.computeVertexNormals(),z}function Pi(z){const ee=new s.Group;ee.position.set(z*Hi,vr-ti,0),Ce.add(ee);const j=new s.Shape;Vt(j,ua+au*2,da+au*2,.095);const ue=new s.Path;Vt(ue,ua,da,.062),j.holes.push(ue);const fe=new s.Shape,ye=.085,Se=-z*(ua*.5+au+ye*.5-.006);fe.moveTo(Se-ye*.5,-.03),fe.lineTo(Se+ye*.5,-.03),fe.lineTo(Se+ye*.5,.03),fe.lineTo(Se-ye*.5,.03),fe.closePath();const ve=a(An(new s.ExtrudeGeometry([j,fe],{depth:.062,bevelEnabled:!1,curveSegments:5}),z*Hi,hc)),Oe=new s.Mesh(ve,G);Oe.castShadow=n,ee.add(Oe);const st=a(An(hn(ua+.006,da+.006,.058,4),z*Hi,hc-.011)),nt=da*.44,it=new s.SphereGeometry(nt,16,12);it.scale(1,1,.45);const et=new s.SphereGeometry(nt*.37,12,9);et.scale(1,1,.55),et.translate(0,0,-nt*.34);const Ee=hc-.076,ft=a(An(it,z*Hi,Ee)),ht=new s.Mesh(ft,z<0?Ke:qe);ht.castShadow=!1,ee.add(ht);const St=a(An(et,z*Hi,Ee)),Ut=new s.Mesh(St,z<0?R:M);Ut.castShadow=!1,ee.add(Ut);const Qt=new s.Mesh(st,k);Qt.renderOrder=2,ee.add(Qt);const Hn=a(An(new s.PlaneGeometry(ua*.98,da*1.02,3,3),z*Hi,hc-.017)),vt=new s.Mesh(Hn,K);return vt.renderOrder=3,ee.add(vt),{brow:ee,glow:vt}}const _n=Pi(-1),Gn=Pi(1),nn=vr-ti,pi=6,Li=a(new s.ConeGeometry(.5,1,5));function mi(z){const ee=new s.Group;ee.position.y=Rr-ti,Ce.add(ee);const j=new s.InstancedMesh(Li,te,pi);j.castShadow=!1,j.frustumCulled=!1;for(let ue=0;ue<pi;ue++){const fe=(ue+.5)/pi*2-1,ye=fe*.4,Se=-.1*fe*fe,ve=(.09+.05*(1-Math.abs(fe)))*(.85+.3*ru(ue,z?3:7)),Oe=.074+.024*(1-Math.abs(fe));em.set(ye,Se+(z?-ve*.5:ve*.5),0),nm.set(z?Math.PI:0,0,fe*.1),tm.setFromEuler(nm),sm.set(Oe,ve,Oe),im.compose(em,tm,sm),j.setMatrixAt(ue,im)}return j.instanceMatrix.needsUpdate=!0,ee.add(j),ee}const Tn=mi(!0),gi=mi(!1);Tn.visible=!1,gi.visible=!1;let _t=0,Yt=0,Dt=0,En=0,Nn=0,Nt=0,us=-1;function T(){const z=_t<=0?0:Math.pow(_t,.78),ee=1.15+2.4*_t+1.4*Nt,j=.07*_t*(.5+.5*Math.sin(Dt*ee*2)),ue=.2*_t*Nt*(.5+.5*Math.sin(Dt*(4+6*_t))),fe=Yn(Yt+j+ue);be&&(be[GA]=z,be[HA]=fe);const ye=$A*z;_n.brow.rotation.z=-ye,Gn.brow.rotation.z=ye;const Se=.03*z;_n.brow.position.x=-Hi+Se,Gn.brow.position.x=Hi-Se,_n.brow.position.y=nn-.055*z,Gn.brow.position.y=_n.brow.position.y,_n.brow.position.z=-.085*z,Gn.brow.position.z=_n.brow.position.z,_n.brow.rotation.x=-.1*z,Gn.brow.rotation.x=_n.brow.rotation.x;const ve=kt(.25,.78,fe)*(.35+.65*z),Oe=ve>.02;if(Tn.visible=Oe,gi.visible=Oe,Oe){const et=om.jawDrop*fe*.86,Ee=Rr-ti,ft=-.455-.055*fe;Tn.position.set(0,Ee+et,ft),gi.position.set(0,Ee-et,ft),Tn.scale.setScalar(ve),gi.scale.setScalar(ve)}const st=kt(.42,1,_t),nt=1+.22*Math.sin(Dt*(3+8*Nt))*(.3+.7*Nt);K.opacity=Yn(st*(.22+.4*Nt)*nt),k.emissiveIntensity=st*.85*nt;const it=1+.18*st+.12*Nt;if(_n.glow.scale.set(it,it,1),Gn.glow.scale.set(it,it,1),us<0||Math.abs(_t-us)>.004){us=_t;const et=kt(.1,1,_t);Ue.color.copy(NA.copy(V).lerp(re,et)),Fe.color.copy(UA.copy(se).lerp(_e,et));const Ee=.13*kt(.55,1,_t);Ue.emissive.setRGB(Ee*Ae.r,Ee*Ae.g*.35,Ee*Ae.b*.3),Fe.emissive.copy(Ue.emissive)}}function Q(z){_t=Yn(typeof z=="number"?z:0),T()}function xe(z){Yt=Yn(typeof z=="number"?z:0),T()}function pe(z,ee){const j=ee||FA,ue=z>0?z<.1?z:.1:0;typeof j.time=="number"?Dt=j.time:Dt+=ue,typeof j.anger=="number"&&(_t=Yn(j.anger)),typeof j.proximity=="number"&&(Nt=Yn(j.proximity));const fe=Nt,ye=typeof j.speed=="number"&&j.speed>0?j.speed:0;Nn=OA(Nn,ye,6,ue);const Se=Yn(Nn/1.8);En+=yr*(.55+Nn/YA)*ue,En>yr&&(En-=yr*Math.floor(En/yr));const ve=Math.sin(En),Oe=(.3+.26*Se)*(.35+.65*Se);We.hip.rotation.x=ve*Oe,Tt.hip.rotation.x=-ve*Oe,We.knee.rotation.x=-(.1+Math.max(0,-ve)*.85*Se),Tt.knee.rotation.x=-(.1+Math.max(0,ve)*.85*Se),We.foot.rotation.x=-(We.hip.rotation.x+We.knee.rotation.x)+Math.max(0,ve)*.22*Se,Tt.foot.rotation.x=-(Tt.hip.rotation.x+Tt.knee.rotation.x)+Math.max(0,-ve)*.22*Se;const st=.35+.65*Se;Re.position.y=-(.5-.5*Math.cos(En*2))*qA*st,Re.rotation.z=ve*.055*st+Math.sin(Dt*.7)*.018*(1-Se),Ce.rotation.x=-(WA+XA*_t+.09*Se+.07*fe),Ce.rotation.y=Math.sin(Dt*.43)*.1*(1-.85*fe),Ce.rotation.z=-ve*.035*st;const nt=1.15+2.4*_t+1.4*fe,it=Math.sin(Dt*nt),et=.009+.018*_t;ge.scale.set(1+it*et,1+it*et*.2,1+it*et*1.25);const Ee=kt(.45,.9,fe),ft=.26+.3*Se,ht=.06+.3*_t,St=$i(-ve*ft,1.15,Ee),Ut=$i(ve*ft,1.15,Ee);lt.shoulder.rotation.x=St,ot.shoulder.rotation.x=Ut,lt.shoulder.rotation.z=-ht-.22*Ee,ot.shoulder.rotation.z=ht+.22*Ee,lt.elbow.rotation.x=$i(.18+Math.max(0,-ve)*.3,-.85,Ee),ot.elbow.rotation.x=$i(.18+Math.max(0,ve)*.3,-.85,Ee);const Qt=.065*_t+.02*it;lt.shoulder.position.y=am-ti+Qt,ot.shoulder.position.y=lt.shoulder.position.y,lt.shoulder.position.z=-.02-.05*_t,ot.shoulder.position.z=lt.shoulder.position.z,T()}function me(){for(let z=0;z<i.length;z++)i[z].dispose();for(let z=0;z<r.length;z++)r[z].dispose();i.length=0,r.length=0}return T(),{group:ce,height:BA,setAnger:Q,setMouthOpen:xe,update:pe,dispose:me}}const cm=Math.PI*2,JA=1/12,lm=[0,.3,-.3,.6,-.6,.95,-.95,1.35,-1.35,1.75,-1.75],hm=1,um=.55,dm=.06,KA=.25,jA=-.25,QA=1.4,fm=5,Wi=13,eT=2.5,tT=.35,nT=.7,cu=.8,iT=1.1,pm=55,sT=45,rT=1.35,lu=.85,hu=3.4,uu=.7,aT=2.4,dc=.002,oT=1.6,cT=2.2,Mr=new I,br=new I,fc=[],Cs=[],Xi=s=>s<0?0:s>1?1:s,lT=(s,e,t)=>s+(e-s)*t,pc=(s,e,t,n)=>s+(e-s)*(1-Math.exp(-t*n));function Sr(s){let e=(s+Math.PI)%cm;return e<0&&(e+=cm),e-Math.PI}const mm=(s,e)=>Math.atan2(-s,-e);function gm(s,e,t,n,i,r,a,o){let c=i;for(let l=0;l<o.length;l++){const h=o[l];if(h.max.y<=a)continue;const d=h.min.x-r,u=h.max.x+r,f=h.min.z-r,p=h.max.z+r,x=s<d?d:s>u?u:s,m=e<f?f:e>p?p:e;let g=s-x,v=e-m;const b=Math.sqrt(g*g+v*v);if(b<=KA){if(b<1e-4){let S=s-d;g=-1,v=0,u-s<S&&(S=u-s,g=1,v=0),e-f<S&&(S=e-f,g=0,v=-1),p-e<S&&(g=0,v=1)}else g/=b,v/=b;if(t*g+n*v>jA)continue;return 0}let y=0,w=c;if(t>-1e-6&&t<1e-6){if(s<d||s>u)continue}else{const S=1/t;let C=(d-s)*S,_=(u-s)*S;if(C>_){const E=C;C=_,_=E}if(C>y&&(y=C),_<w&&(w=_),y>w)continue}if(n>-1e-6&&n<1e-6){if(e<f||e>p)continue}else{const S=1/n;let C=(f-e)*S,_=(p-e)*S;if(C>_){const E=C;C=_,_=E}if(C>y&&(y=C),_<w&&(w=_),y>w)continue}y<c&&(c=y)}return c}function hT(s){const e=s.state,t=s.bus,n=He.monster,i=ZA(so,He),r=new ri;r.name="monster",r.add(i.group);const a=s.engine&&s.engine.PORTRAIT_LAYER||1;i.group.traverse(D=>D.layers.enable(a)),s.engine&&s.engine.setPortraitSubject&&s.engine.setPortraitSubject(i.group,{height:2.55}),s.scene&&s.scene.add(r);let o=0,c=0,l=0,h=Wi,d=Wi,u=Wi,f=!1,p=0,x=0,m=1,g=!1,v=n.roarInterval,b=0,y=0,w=0,S=0;function C(D){const H=e.player.pos,W=e.monster,B=[0,.26,-.26,.52,-.52,.85,-.85,1.3,-1.3],$=[n.spawnDistance,Math.max(n.minSpawnDistance,n.spawnDistance*.8)],X=lu*Math.max(1,W.scale);let he=H.x,ie=H.z+n.spawnDistance;if(D&&typeof D.queryAABB=="function"){let Y=!1;for(let O=0;O<$.length&&!Y;O++)for(let U=0;U<B.length;U++){const J=B[U],ne=H.x+Math.sin(J)*$[O],V=H.z+Math.cos(J)*$[O],re=He.world.groundY+uu*W.scale;if(Mr.set(ne-X,re,V-X),br.set(ne+X,re+hu*W.scale,V+X),D.queryAABB(Mr,br,Cs).length===0){he=ne,ie=V,Y=!0;break}}}const ae=D&&typeof D.sampleGroundY=="function"?D.sampleGroundY(he,ie):He.world.groundY;W.pos.set(he,ae+n.heightOffset,ie),W.vel.set(0,0,0),o=mm(H.x-he,H.z-ie),c=o,W.yaw=o,W.distanceToPlayer=Math.hypot(H.x-he,H.z-ie),W.proximity=Xi(1-W.distanceToPlayer/30)}C(null);function _(D,H,W){const B=e.monster,$=B.scale,X=lu*$,he=B.pos.y+uu*$;let ie=B.speed*QA;ie<fm&&(ie=fm),ie>Wi&&(ie=Wi),W>1&&ie>W&&(ie=W),u=ie;const ae=ie+X;if(Mr.set(B.pos.x-ae,he,B.pos.z-ae),br.set(B.pos.x+ae,he+hu*$,B.pos.z+ae),D.queryAABB(Mr,br,fc),fc.length===0){c=H,h=ie,d=ie;return}const Y=1/ie;d=gm(B.pos.x,B.pos.z,-Math.sin(H),-Math.cos(H),ie,X,he,fc);let O=d*Y*hm+um-Math.abs(Sr(H-o))*dm,U=H,J=d,ne=0,V=0;for(let re=0;re<lm.length;re++){const se=lm[re],_e=o+se,Ae=-Math.sin(_e),Pe=-Math.cos(_e),Ue=gm(B.pos.x,B.pos.z,Ae,Pe,ie,X,he,fc);se>.5?Ue>ne&&(ne=Ue):se<-.5&&Ue>V&&(V=Ue);const Fe=Ue*Y*hm+Math.cos(Sr(_e-H))*um-Math.abs(se)*dm;Fe>O&&(O=Fe,U=_e,J=Ue)}x<=0&&(m=ne>=V?1:-1),c=Sr(U),h=J}function E(D,H){const W=D;if(!(W>0))return;const B=H&&H.world||s.world;if(!B)return;const $=e.monster,X=e.player.pos;$.scale=pc($.scale,e.level.scale||n.baseScale,cT,W);let he=X.x-$.pos.x,ie=X.z-$.pos.z,ae=Math.hypot(he,ie),Y=e.level.speed||n.baseSpeed;ae>pm&&(Y*=1+Math.min(1,(ae-pm)/sT)*(rT-1)),$.speed=pc($.speed,Y,oT,W);const O=ae>.001?mm(he,ie):o;l-=W,l<=0&&(l+=JA,_(B,O,ae));let U=ae<4?O:c;x>0&&(U=Sr(U+m*iT*(x/cu)));const J=Sr(U-o),ne=n.turnRate*W;o=Sr(o+(J>ne?ne:J<-ne?-ne:J));const V=$.scale,re=lu*V,se=uu*V,_e=$.pos.y+se;let Ae=$.speed;const Pe=Math.min(re*eT,u);(f||d<Pe||h<Pe)&&(Ae*=n.obstacleSlowdown);const Ue=-Math.sin(o),Fe=-Math.cos(o);let F=Ue*Ae,N=Fe*Ae;if(x>0){const te=x/cu*n.stuckUnstickForce*m;F+=Fe*te,N+=-Ue*te;const ce=Math.hypot(F,N),Re=$.speed*1.5;if(ce>Re&&ce>1e-4){const Ce=Re/ce;F*=Ce,N*=Ce}x-=W}const G=$.pos.x,k=$.pos.z;let q=G+F*W,de=k+N*W;const oe=Math.min(G,q)-re,Me=Math.max(G,q)+re,we=Math.min(k,de)-re,L=Math.max(k,de)+re;Mr.set(oe,_e,we),br.set(Me,_e+hu*V,L),B.queryAABB(Mr,br,Cs);let Ke=!1;if(Cs.length>0){for(let te=0;te<Cs.length;te++){const ce=Cs[te];ce.max.y<=_e||q+re<=ce.min.x||q-re>=ce.max.x||k+re<=ce.min.z||k-re>=ce.max.z||(F>0?q=Math.min(q,ce.min.x-re-dc):F<0&&(q=Math.max(q,ce.max.x+re+dc)),Ke=!0)}for(let te=0;te<Cs.length;te++){const ce=Cs[te];ce.max.y<=_e||q+re<=ce.min.x||q-re>=ce.max.x||de+re<=ce.min.z||de-re>=ce.max.z||(N>0?de=Math.min(de,ce.min.z-re-dc):N<0&&(de=Math.max(de,ce.max.z+re+dc)),Ke=!0)}}f=Ke,$.pos.x=q,$.pos.z=de,$.pos.y=B.sampleGroundY(q,de)+n.heightOffset,$.vel.set((q-G)/W,0,(de-k)/W),$.yaw=o;const qe=Math.hypot(q-G,de-k),R=Ae*W;x<=0&&qe<R*tT?(p+=W,p>nT&&(p=0,x=cu,l=0)):p>0&&(p=Math.max(0,p-W*2)),he=X.x-$.pos.x,ie=X.z-$.pos.z,ae=Math.hypot(he,ie),$.distanceToPlayer=ae,$.proximity=Xi(1-ae/30),v-=W,v<=0&&(v=lT(n.roarInterval,n.roarIntervalMin,Xi(e.dread))*(.85+Math.random()*.3),t.emit("roar",{intensity:Xi(.18+.82*$.proximity)}),b=1);const K=e.player.pos.y-$.pos.y<=aT*V;!g&&e.phase==="playing"&&ae<n.catchRadius&&K&&(g=!0,t.emit("caught",{score:e.score}))}function A(D,H){const W=D>0?D:0;S+=W;const B=e.monster,$=Xi(e.dread),X=Xi(B.proximity);r.position.copy(B.pos),r.rotation.y=B.yaw,r.scale.setScalar(B.scale);const he=e.phase==="playing"?Math.hypot(B.vel.x,B.vel.z):0;w=pc(w,he,6,W);const ie=Xi($*.72+X*.46);b=b>0?Math.max(0,b-W*1.6):0;const ae=X>.55?(X-.55)/.45:0;y=pc(y,Xi(Math.max(b,ae)),8,W),i.setAnger(ie),i.setMouthOpen(y),i.update(W,{anger:ie,proximity:X,speed:w,time:S})}function P(){const D=e.monster;D.speed=n.baseSpeed,D.scale=n.baseScale,C(s.world),g=!1,f=!1,p=0,x=0,m=1,l=0,h=Wi,d=Wi,u=Wi,v=n.roarInterval*.6,w=0,b=0,y=0,i.setAnger(0),i.setMouthOpen(0),i.update(0,{anger:0,proximity:0,speed:0,time:S}),r.position.copy(D.pos),r.rotation.y=D.yaw,r.scale.setScalar(D.scale)}return{group:r,fixedUpdate:E,update:A,reset:P}}const Ye="emtc",xa=14,gg=20,uT=[{act:"up",label:"Move up"},{act:"left",label:"Move left"},{act:"right",label:"Move right"},{act:"down",label:"Move down"}],xm='<svg class="'+Ye+'-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4.2 L20.4 18.6 Q20.8 19.6 19.8 19.3 L12 16.4 L4.2 19.3 Q3.2 19.6 3.6 18.6 Z"/></svg>',dT=`
.${Ye}-layer{
  position:absolute; inset:0; z-index:2;
  --${Ye}-a:76px;            /* arrow button edge  */
  --${Ye}-g:8px;             /* gap inside the cross */
  --${Ye}-j:104px;           /* jump disc diameter */
  --${Ye}-edge:18px;         /* inset from the safe-area edges */
  opacity:1; visibility:visible;
  transition:opacity 170ms ease;
  touch-action:none;
  -webkit-user-select:none; user-select:none;
  -webkit-touch-callout:none;
  font:600 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
/* Hidden with visibility+opacity rather than display, so the buttons keep
   their boxes and the cached hit rects stay valid across a hide/show. */
.${Ye}-layer.${Ye}-off{ opacity:0; visibility:hidden; }
.${Ye}-layer.${Ye}-off .${Ye}-btn{ pointer-events:none; }

.${Ye}-pad{
  position:absolute;
  left:calc(var(--safe-l,0px) + var(--${Ye}-edge));
  bottom:calc(var(--safe-b,0px) + var(--${Ye}-edge));
  display:grid;
  grid-template-columns:repeat(3,var(--${Ye}-a));
  grid-template-rows:repeat(3,var(--${Ye}-a));
  gap:var(--${Ye}-g);
}

.${Ye}-btn{
  position:relative;
  display:flex; align-items:center; justify-content:center;
  pointer-events:auto; touch-action:none;
  color:#fff;
  /* Dark translucent, not light: the world behind runs from a bright blue sky
     at level 0 to near-black at THE END, and a dark chip with a white rim is
     the only fill that stays legible across both ends of that ramp. */
  background:rgba(16,10,24,.32);
  border:2px solid rgba(255,255,255,.5);
  border-radius:20px;
  /* Static shadow, never animated: it lifts the chip off the bright level-0
     grass, where a flat translucent square otherwise dissolves into the world. */
  box-shadow:0 2px 10px rgba(0,0,0,.32);
  transition:background-color 70ms linear,border-color 70ms linear,transform 70ms ease;
  will-change:transform;
}
/* The real thumb target: a transparent overlay wider than the art. Thumbs are
   imprecise and the visual button is only the part you can see. */
.${Ye}-btn::before{
  content:""; position:absolute; inset:calc(-1 * var(--${Ye}-pad));
}
.${Ye}-btn.${Ye}-down{
  background:rgba(255,255,255,.9);
  border-color:#fff;
  transform:scale(.93);
}
/* Pressed inverts the glyph too - a fill change alone is easy to miss under a
   thumb, and the press has to be unmistakable at arm's length in daylight. */
.${Ye}-btn.${Ye}-down .${Ye}-ico{ fill:#140c1e; opacity:1; }
/* No drop-shadow/backdrop filter on the glyph on purpose: the button scales on
   press, and a filtered child forces a re-raster on every step of that tween. */
.${Ye}-ico{ width:46%; height:46%; fill:#fff; opacity:.95; }

.${Ye}-a-up   { grid-area:1 / 2 / 2 / 3; --${Ye}-pad:${xa}px; }
.${Ye}-a-left { grid-area:2 / 1 / 3 / 2; --${Ye}-pad:${xa}px; }
.${Ye}-a-right{ grid-area:2 / 3 / 3 / 4; --${Ye}-pad:${xa}px; }
.${Ye}-a-down { grid-area:3 / 2 / 4 / 3; --${Ye}-pad:${xa}px; }
.${Ye}-a-down  .${Ye}-ico{ transform:rotate(180deg); }
.${Ye}-a-left  .${Ye}-ico{ transform:rotate(-90deg); }
.${Ye}-a-right .${Ye}-ico{ transform:rotate(90deg); }

.${Ye}-jump{
  position:absolute;
  right:calc(var(--safe-r,0px) + var(--${Ye}-edge));
  bottom:calc(var(--safe-b,0px) + var(--${Ye}-edge) + 4px);
  width:var(--${Ye}-j); height:var(--${Ye}-j);
  border-radius:50%;
  flex-direction:column; gap:3px;
  --${Ye}-pad:${gg}px;
  background:rgba(38,20,4,.38);
  border-color:rgba(255,206,110,.72);
  color:#ffd88a;
}
.${Ye}-jump .${Ye}-ico{ width:30%; height:30%; fill:#ffd88a; }
.${Ye}-jump .${Ye}-lbl{ font-weight:800; font-size:14px; letter-spacing:.14em; }
.${Ye}-jump.${Ye}-down{
  background:rgba(255,205,90,.95);
  border-color:#fff3d0;
  color:#1a1004;
  transform:scale(.94);
}
.${Ye}-jump.${Ye}-down .${Ye}-ico{ fill:#1a1004; }

/* Very short viewports (small landscape phones) would otherwise have the cross
   eating half the screen. The S25U is ~480 CSS px tall and stays full size. */
@media (max-height:400px){
  .${Ye}-layer{ --${Ye}-a:62px; --${Ye}-j:86px; --${Ye}-edge:12px; }
  .${Ye}-jump .${Ye}-lbl{ font-size:12px; }
}
`,fT=Object.assign(Object.create(null),{ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",Space:"jump"}),pT=Object.assign(Object.create(null),{ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",W:"up",s:"down",S:"down",a:"left",A:"left",d:"right",D:"right"," ":"jump",Spacebar:"jump"});function mT(s,e){const{state:t,bus:n}=e,i=typeof document<"u"&&typeof window<"u",r=Object.assign(Object.create(null),{up:new Set,down:new Set,left:new Set,right:new Set,jump:new Set}),a=new Map,o=Object.create(null),c=[];let l=!0,h=!1;const d=[];function u(U,J,ne,V){!U||typeof U.addEventListener!="function"||(U.addEventListener(J,ne,V),d.push(()=>U.removeEventListener(J,ne,V)))}function f(){h||(t.input.x=(r.right.size?1:0)-(r.left.size?1:0),t.input.z=(r.up.size?1:0)-(r.down.size?1:0),t.input.jump=r.jump.size>0)}function p(U,J){const ne=r[U];if(!ne||ne.has(J))return;const V=ne.size===0;ne.add(J),V&&(o[U]&&o[U].classList.add(`${Ye}-down`),U==="jump"&&t.phase==="playing"&&(t.input.jumpPressed=!0)),f()}function x(U,J){const ne=r[U];!ne||!ne.delete(J)||(ne.size===0&&o[U]&&o[U].classList.remove(`${Ye}-down`),f())}function m(){if(a.size!==0){for(const[U,J]of a)J&&x(J,"p"+U);a.clear()}}function g(){for(const U of Object.keys(r))for(const J of Array.from(r[U]))J[0]==="k"&&x(U,J)}function v(){m(),g(),f()}function b(){c.length=0;for(const U of Object.keys(o)){const J=o[U];if(!J||typeof J.getBoundingClientRect!="function")continue;const ne=J.getBoundingClientRect();if(!ne.width&&!ne.height)continue;const V=U==="jump"?gg:xa;c.push({act:U,x0:ne.left-V,y0:ne.top-V,x1:ne.right+V,y1:ne.bottom+V,cx:(ne.left+ne.right)*.5,cy:(ne.top+ne.bottom)*.5})}l=!1}function y(U,J){l&&b();let ne=null,V=1/0;for(let re=0;re<c.length;re++){const se=c[re];if(U<se.x0||U>se.x1||J<se.y0||J>se.y1)continue;const _e=U-se.cx,Ae=J-se.cy,Pe=_e*_e+Ae*Ae;Pe<V&&(V=Pe,ne=se.act)}return ne}let w=null,S=null,C=!1;if(i&&s&&typeof s.appendChild=="function"){const U=`${Ye}-style`;S=document.getElementById(U),S||(S=document.createElement("style"),S.id=U,S.textContent=dT,(document.head||document.documentElement).appendChild(S),C=!0),w=document.createElement("div"),w.className=`${Ye}-layer`,w.style.pointerEvents="none";const J=document.createElement("div");J.className=`${Ye}-pad`;for(const{act:V,label:re}of uT){const se=document.createElement("div");se.className=`${Ye}-btn ${Ye}-a-${V}`,se.setAttribute("role","button"),se.setAttribute("aria-label",re),se.innerHTML=xm,o[V]=se,J.appendChild(se)}const ne=document.createElement("div");ne.className=`${Ye}-btn ${Ye}-jump`,ne.setAttribute("role","button"),ne.setAttribute("aria-label","Jump"),ne.innerHTML=xm+`<span class="${Ye}-lbl">JUMP</span>`,o.jump=ne,w.appendChild(J),w.appendChild(ne),s.appendChild(w)}function _(U){const J=U.currentTarget&&U.currentTarget.dataset?U.currentTarget.dataset[`${Ye}Act`]:null;if(!J||U.pointerType==="mouse"&&U.button!==0)return;U.cancelable&&U.preventDefault();try{U.currentTarget.setPointerCapture(U.pointerId)}catch{}l&&b();const ne=a.get(U.pointerId);ne&&x(ne,"p"+U.pointerId),a.set(U.pointerId,J),p(J,"p"+U.pointerId)}function E(U){if(!a.has(U.pointerId))return;U.cancelable&&U.preventDefault();const J=a.get(U.pointerId),ne=y(U.clientX,U.clientY);if(ne===J)return;const V="p"+U.pointerId;J&&x(J,V),ne&&p(ne,V),a.set(U.pointerId,ne)}function A(U){if(!a.has(U.pointerId))return;const J=a.get(U.pointerId);a.delete(U.pointerId),J&&x(J,"p"+U.pointerId)}function P(U){U.cancelable&&U.preventDefault()}function D(U){U.cancelable&&U.preventDefault()}if(w){for(const U of Object.keys(o)){const J=o[U];J.dataset[`${Ye}Act`]=U,u(J,"pointerdown",_),u(J,"touchstart",D,{passive:!1}),u(J,"touchmove",D,{passive:!1}),u(J,"contextmenu",P),u(J,"dragstart",P)}u(w,"selectstart",P),u(w,"lostpointercapture",A)}i&&(u(window,"pointermove",E,{passive:!1}),u(window,"pointerup",A),u(window,"pointercancel",A),u(window,"pointerleave",A));function H(U){return fT[U.code]||pT[U.key]||null}function W(U){const J=U.target;if(!J||!J.tagName)return!1;const ne=J.tagName;return ne==="INPUT"||ne==="TEXTAREA"||ne==="SELECT"||J.isContentEditable===!0}function B(U){if(U.repeat||U.ctrlKey||U.metaKey||U.altKey||W(U))return;const J=H(U);J&&(U.cancelable&&U.preventDefault(),p(J,"k"+(U.code||U.key)))}function $(U){const J=H(U);J&&(U.cancelable&&U.preventDefault(),x(J,"k"+(U.code||U.key)))}i&&(u(window,"keydown",B,{passive:!1}),u(window,"keyup",$,{passive:!1}));function X(){v()}function he(){typeof document<"u"&&document.visibilityState==="hidden"&&v()}function ie(){l=!0}i&&(u(window,"blur",X),u(document,"visibilitychange",he),u(window,"resize",ie),u(window,"orientationchange",ie),window.visualViewport&&(u(window.visualViewport,"resize",ie),u(window.visualViewport,"scroll",ie)));function ae(U){w&&w.classList.toggle(`${Ye}-off`,!U)}function Y(){ae(!0),l=!0,m(),i&&typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{h||f()})}function O(){ae(!1),m(),f()}return ae(t.phase==="playing"),d.push(n.on("start",Y)),d.push(n.on("restart",Y)),d.push(n.on("caught",O)),{destroy(){if(!h){v(),h=!0;for(const U of d)try{U()}catch{}d.length=0,w&&w.parentNode&&w.parentNode.removeChild(w),C&&S&&S.parentNode&&S.parentNode.removeChild(S),w=null,S=null,c.length=0,a.clear();for(const U of Object.keys(r))r[U].clear();for(const U of Object.keys(o))delete o[U]}}}}const _m="emhud-style",du=Math.PI*2,gT=["IT IS WATCHING","IT HAS NOTICED YOU","IT IS HUNTING NOW","FASTER. ANGRIER.","IT IS STARVING","DO NOT LOOK BACK","IT IS ALMOST ON YOU","RUN."],xT=[16731482,16757821,4054148,5088255,12872703,16773227];function _a(s){return s>0?s<1?s:1:0}function wr(s,e,t){if(e===s)return t<s?0:1;const n=_a((t-s)/(e-s));return n*n*(3-2*n)}function _T(s){return"#"+(s>>>0&16777215).toString(16).padStart(6,"0")}const yT=`
.emhud-root{
  position:absolute; inset:0; overflow:hidden;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  color:#fff; z-index:60;
}
/* #ui-root > * forces pointer-events:auto with id specificity - out-specify it
   so the HUD never eats a tap meant for the D-pad underneath. */
#ui-root > .emhud-root{ pointer-events:none; }

/* ------------------------------------------------------------- vignette -- */
.emhud-vig{
  position:absolute; inset:-2px; opacity:0; pointer-events:none;
  will-change:opacity; contain:paint;
}
.emhud-vig-a{
  background:radial-gradient(ellipse 76% 64% at 50% 54%,
    rgba(120,0,14,0) 34%, rgba(126,2,16,.50) 74%, rgba(48,0,6,.94) 100%);
}
.emhud-vig-b{
  background:radial-gradient(ellipse 60% 50% at 50% 54%,
    rgba(255,26,26,0) 16%, rgba(255,30,26,.40) 66%, rgba(150,0,0,.96) 100%);
}

/* ----------------------------------------------------------- hud layer --- */
.emhud-layer{
  position:absolute; inset:0; pointer-events:none;
  transition:opacity .28s ease;
}
.emhud-layer.emhud-off{ opacity:0; }

.emhud-score{
  position:absolute;
  top:calc(var(--safe-t,0px) + 10px);
  left:calc(var(--safe-l,0px) + 16px);
  display:flex; align-items:center; gap:9px;
  transform-origin:left center; will-change:transform;
}
.emhud-chip{
  position:relative; flex:none;
  width:clamp(15px,3.6vh,22px); height:clamp(15px,3.6vh,22px);
  border-radius:50%;
  /* Glossy candy button: hot specular top-left, saturated body, dark rim. */
  background:radial-gradient(circle at 33% 27%,
    #ffffff 0%, rgba(255,255,255,.9) 7%, #ffa24d 30%, #ff4152 74%, #c11d38 100%);
  box-shadow:0 1px 3px rgba(0,0,0,.55), inset 0 -2px 4px rgba(110,0,20,.55);
}
.emhud-scorewrap{ position:relative; display:flex; align-items:baseline; }
.emhud-scoreglow{
  position:absolute; inset:-14% -22%; border-radius:40%; opacity:0;
  background:radial-gradient(ellipse at center, rgba(255,214,120,.85) 0%, rgba(255,150,60,0) 70%);
  will-change:opacity; pointer-events:none;
}
.emhud-scorenum{
  position:relative;
  font-size:clamp(28px,8vh,46px); font-weight:800; line-height:1;
  letter-spacing:-.02em; font-variant-numeric:tabular-nums;
  text-shadow:0 2px 0 rgba(0,0,0,.45), 0 0 14px rgba(255,180,90,.35);
}

.emhud-best{
  position:absolute;
  top:calc(var(--safe-t,0px) + 13px);
  right:calc(var(--safe-r,0px) + 16px);
  font-size:clamp(10px,2.6vh,14px); font-weight:700;
  letter-spacing:.16em; text-transform:uppercase;
  color:rgba(255,255,255,.62); font-variant-numeric:tabular-nums;
  text-shadow:0 1px 2px rgba(0,0,0,.6);
}
.emhud-best b{ color:rgba(255,255,255,.92); font-weight:800; letter-spacing:.06em; }

/* --------------------------------------------------------- threat meter -- */
.emhud-threat{
  position:absolute;
  top:calc(var(--safe-t,0px) + 9px);
  left:50%; transform:translateX(-50%);
  width:min(320px,38vw); min-width:168px;
  display:flex; flex-direction:column; align-items:center; gap:5px;
}
.emhud-tname{
  font-size:clamp(10px,2.7vh,14px); font-weight:800;
  letter-spacing:.28em; text-transform:uppercase; white-space:nowrap;
  color:rgba(255,236,236,.9); text-shadow:0 1px 3px rgba(0,0,0,.75);
}
.emhud-bar{
  position:relative; width:100%; height:clamp(7px,1.7vh,10px);
  border-radius:99px; overflow:hidden;
  background:rgba(10,4,10,.55);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14), 0 2px 6px rgba(0,0,0,.45);
}
.emhud-fill{
  position:absolute; inset:0; border-radius:99px;
  transform:scaleX(0); transform-origin:left center;
  will-change:transform;
}
.emhud-fill-warm{ position:absolute; inset:0; background:linear-gradient(90deg,#ffe066,#ffa72e); }
.emhud-fill-hot{ position:absolute; inset:0; opacity:0; background:linear-gradient(90deg,#ff7a2e,#ff1f2e); will-change:opacity; }
.emhud-barglow{
  position:absolute; inset:-4px; border-radius:99px; opacity:0; pointer-events:none;
  box-shadow:0 0 14px 3px rgba(255,40,40,.9); will-change:opacity;
}

/* -------------------------------------------------------- levelup banner - */
.emhud-banner{
  position:absolute; left:50%; top:34%; transform:translate(-50%,-50%);
  text-align:center; pointer-events:none; visibility:hidden; opacity:0;
  width:max-content; max-width:90vw;
}
.emhud-banner-in{ will-change:transform; }
.emhud-banner-name{
  font-size:clamp(26px,9vh,54px); font-weight:900; line-height:1;
  letter-spacing:.06em; text-transform:uppercase;
  color:#fff; text-shadow:0 0 24px rgba(255,40,40,.85), 0 3px 0 rgba(90,0,10,.7);
}
.emhud-banner-sub{
  margin-top:6px;
  font-size:clamp(10px,2.8vh,15px); font-weight:700;
  letter-spacing:.3em; text-transform:uppercase; color:#ffb3ae;
  text-shadow:0 1px 6px rgba(0,0,0,.8);
}

/* ---------------------------------------------------------- overlays ----- */
.emhud-ov{
  position:absolute; inset:0; pointer-events:auto;
  display:flex; align-items:center; justify-content:center;
  padding:calc(var(--safe-t,0px) + 10px) calc(var(--safe-r,0px) + 20px)
          calc(var(--safe-b,0px) + 10px) calc(var(--safe-l,0px) + 20px);
  opacity:1; visibility:visible;
  transition:opacity .26s ease, visibility 0s linear 0s;
  overflow:hidden;
}
.emhud-ov.emhud-off{
  opacity:0; visibility:hidden; pointer-events:none;
  transition:opacity .26s ease, visibility 0s linear .26s;
}
.emhud-ov.emhud-off .emhud-card{ transform:translateY(14px) scale(.97); }
.emhud-ov.emhud-off .emhud-btn{ animation-play-state:paused; }
.emhud-scrim{
  position:absolute; inset:0;
  background:
    radial-gradient(ellipse 70% 90% at 50% 42%, rgba(52,10,58,.62) 0%, rgba(8,3,14,.9) 68%, rgba(4,1,8,.97) 100%);
  backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px);
}
.emhud-card{
  position:relative; text-align:center; max-width:640px;
  transform:translateY(0) scale(1);
  transition:transform .3s cubic-bezier(.2,.9,.28,1.1);
}

.emhud-title{
  font-size:clamp(38px,15vh,92px); font-weight:900; line-height:.92;
  letter-spacing:.02em; margin:0;
  filter:drop-shadow(0 4px 0 rgba(0,0,0,.45)) drop-shadow(0 0 26px rgba(255,120,60,.35));
}
.emhud-title span{ display:inline-block; }
.emhud-hook{
  margin:clamp(8px,2vh,14px) 0 0;
  font-size:clamp(12px,3.1vh,18px); font-weight:600; color:rgba(255,255,255,.9);
  text-shadow:0 1px 4px rgba(0,0,0,.7);
}
.emhud-hint{
  margin:clamp(5px,1.4vh,10px) 0 0;
  font-size:clamp(9px,2.2vh,12px); font-weight:600;
  letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.5);
}
.emhud-startbest{
  margin:clamp(5px,1.4vh,10px) 0 0;
  font-size:clamp(9px,2.2vh,12px); font-weight:800;
  letter-spacing:.18em; text-transform:uppercase; color:rgba(255,214,120,.85);
}

.emhud-dead{
  font-size:clamp(30px,12vh,72px); font-weight:900; line-height:1; margin:0;
  letter-spacing:.14em; color:#ff3b39;
  text-shadow:0 0 30px rgba(255,30,30,.6), 0 3px 0 rgba(70,0,6,.8);
}
.emhud-tomb{ margin-top:clamp(4px,1.2vh,9px); font-size:clamp(9px,2.2vh,12px);
  letter-spacing:.24em; text-transform:uppercase; color:rgba(255,180,180,.6); font-weight:700; }
/* --- the Protector's portrait, left edge ------------------------------- */
.emhud-port{
  /* Top-RIGHT, under the best score. The left side belongs to the D-pad, and
     the jump button owns the bottom right, so this corner is the one piece of
     the screen no thumb ever covers. */
  position:absolute; right:calc(var(--safe-r, 0px) + 10px);
  top:calc(var(--safe-t, 0px) + 52px);
  display:flex; flex-direction:column; align-items:center; gap:5px;
  pointer-events:none;
}
.emhud-portframe{
  position:relative; width:104px; height:104px; border-radius:14px;
  /* The border is the threat readout: it heats up as he closes. */
  border:2px solid rgba(255,255,255,.22);
  box-shadow:0 4px 18px rgba(0,0,0,.45);
  /* No fill. The renderer scissors the live portrait into this exact rectangle
     of the canvas UNDERNEATH, so any background here paints over it - which is
     precisely what made the panel render as a black square. */
  background:transparent;
  transition:border-color .25s linear, box-shadow .25s linear;
}
/* The hole is genuinely empty - the renderer scissors the live portrait into
   exactly this rectangle, so nothing may be painted over it. */
.emhud-porthole{ position:absolute; inset:0; border-radius:12px; overflow:hidden; }
.emhud-portring{
  position:absolute; inset:-13px; border-radius:20px; pointer-events:none;
}
/* A needle on the ring, pointing where he is relative to the way you face.
   Straight up means dead ahead; straight down means directly behind you. */
.emhud-needle{
  position:absolute; left:50%; top:50%; width:0; height:0;
  transform-origin:0 0; will-change:transform;
  /* An explicit resting colour: the needle is tinted from JS only when
     proximity MOVES, so at the start of a run it would otherwise inherit
     whatever currentColor happened to be. */
  color:#fff;
}
.emhud-needle::before{
  content:''; position:absolute; left:-7px; top:-72px;
  border-left:7px solid transparent; border-right:7px solid transparent;
  border-bottom:13px solid currentColor;
  filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));
}
.emhud-portdist{
  font:700 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
  letter-spacing:.06em; color:#fff; opacity:.78;
  text-shadow:0 1px 3px rgba(0,0,0,.7); font-variant-numeric:tabular-nums;
}
@media (max-height:400px){
  .emhud-portframe{ width:82px; height:82px; }
  .emhud-needle::before{ top:-60px; }
}

.emhud-delta{
  position:absolute; left:100%; top:-2px; margin-left:6px;
  font:800 20px/1 system-ui,-apple-system,sans-serif;
  letter-spacing:-.01em; white-space:nowrap; opacity:0;
  text-shadow:0 2px 6px rgba(0,0,0,.65); pointer-events:none;
  font-variant-numeric:tabular-nums;
}
.emhud-score{ position:relative; }

.emhud-scores{
  display:flex; align-items:flex-end; justify-content:center;
  gap:clamp(18px,6vw,44px); margin-top:clamp(8px,2.4vh,18px);
}
.emhud-stat{ display:flex; flex-direction:column; align-items:center; gap:2px; }
.emhud-stat-k{
  font-size:clamp(8px,2vh,11px); font-weight:800; letter-spacing:.22em;
  text-transform:uppercase; color:rgba(255,255,255,.45);
}
.emhud-stat-v{
  font-size:clamp(26px,8.5vh,52px); font-weight:900; line-height:1;
  font-variant-numeric:tabular-nums; text-shadow:0 2px 0 rgba(0,0,0,.5);
}
.emhud-stat-v.is-best{ color:rgba(255,255,255,.6); font-size:clamp(20px,6.4vh,38px); }
.emhud-newbest{
  display:inline-block; margin-top:clamp(6px,1.8vh,12px);
  padding:4px 14px; border-radius:99px;
  font-size:clamp(9px,2.2vh,12px); font-weight:900; letter-spacing:.2em;
  color:#2a1400; background:linear-gradient(90deg,#ffe066,#ffa72e);
  box-shadow:0 3px 12px rgba(255,170,40,.45);
  animation:emhud-flourish 1.1s ease-in-out infinite;
}
.emhud-newbest[hidden]{ display:none; }
@keyframes emhud-flourish{
  0%,100%{ transform:scale(1) rotate(-1.4deg); }
  50%{ transform:scale(1.07) rotate(1.4deg); }
}

.emhud-btn{
  -webkit-appearance:none; appearance:none; border:0; cursor:pointer;
  margin-top:clamp(10px,3vh,22px);
  padding:clamp(10px,2.6vh,17px) clamp(30px,8vw,62px);
  border-radius:99px; touch-action:manipulation; pointer-events:auto;
  font-family:inherit; font-size:clamp(15px,4vh,24px); font-weight:900;
  letter-spacing:.14em; text-transform:uppercase; color:#2a0d00;
  background:linear-gradient(180deg,#fff0b8 0%,#ffc63d 42%,#ff8a2e 100%);
  box-shadow:0 5px 0 #b3500f, 0 10px 26px rgba(255,140,40,.4),
             inset 0 2px 0 rgba(255,255,255,.75);
  transform:translateY(0);
  transition:transform .07s ease, box-shadow .07s ease;
  animation:emhud-breathe 2.4s ease-in-out infinite;
}
.emhud-btn:active{
  transform:translateY(4px);
  box-shadow:0 1px 0 #b3500f, 0 4px 12px rgba(255,140,40,.35),
             inset 0 2px 0 rgba(255,255,255,.6);
}
@keyframes emhud-breathe{
  0%,100%{ filter:brightness(1); }
  50%{ filter:brightness(1.12); }
}

@media (prefers-reduced-motion: reduce){
  .emhud-btn, .emhud-newbest{ animation:none; }
}
`;function vT(s,e){const t=()=>{};if(typeof document>"u"||!s||typeof s.appendChild!="function")return{update:t,showStart:t,showGameOver:t,hideOverlays:t};const n=e&&e.CONFIG||{},i=e&&e.bus||null,r=e&&e.state||null,a=n.palette&&n.palette.emeems||xT;let o=!1;try{o=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)}catch{}if(!document.getElementById(_m)){const je=document.createElement("style");je.id=_m,je.textContent=yT,(document.head||document.documentElement).appendChild(je)}const c=(je,lt,ot,Vt)=>{const hn=document.createElement(je);return lt&&(hn.className=lt),Vt!=null&&(hn.textContent=Vt),ot&&ot.appendChild(hn),hn},l=c("div","emhud-root",s),h=c("div","emhud-vig emhud-vig-a",l),d=c("div","emhud-vig emhud-vig-b",l),u=c("div","emhud-layer emhud-off",l),f=c("div","emhud-score",u);c("div","emhud-chip",f);const p=c("div","emhud-scorewrap",f),x=c("div","emhud-scoreglow",p),m=c("div","emhud-scorenum",p,"0"),g=c("div","emhud-delta",f,""),v=c("div","emhud-port",u),b=c("div","emhud-portframe",v),y=c("div","emhud-porthole",b),w=c("div","emhud-portring",b),S=c("div","emhud-needle",w),C=c("div","emhud-portdist",v,"--m"),_=c("div","emhud-best",u);_.appendChild(document.createTextNode("Best "));const E=c("b",null,_,"0"),A=c("div","emhud-threat",u),P=c("div","emhud-tname",A,"Watching"),D=c("div","emhud-bar",A),H=c("div","emhud-fill",D);c("div","emhud-fill-warm",H);const W=c("div","emhud-fill-hot",H),B=c("div","emhud-barglow",D),$=c("div","emhud-banner",l),X=c("div","emhud-banner-in",$),he=c("div","emhud-banner-name",X,""),ie=c("div","emhud-banner-sub",X,""),ae=c("div","emhud-ov emhud-off",l);c("div","emhud-scrim",ae);const Y=c("div","emhud-card",ae),O=c("h1","emhud-title",Y),U="EMEEM";for(let je=0;je<U.length;je++){const lt=c("span",null,O,U[je]);lt.style.color=_T(a[je%a.length])}c("p","emhud-hook",Y,"Catch the emeems. Do not let him catch you."),c("p","emhud-hint",Y,"Pad to run · tap JUMP to hop · run into an emeem to pinch it");const J=c("p","emhud-startbest",Y,""),ne=c("button","emhud-btn",Y,"Play");ne.type="button",ne.setAttribute("aria-label","Play Emeem");const V=c("div","emhud-ov emhud-off",l);c("div","emhud-scrim",V);const re=c("div","emhud-card",V);c("h1","emhud-dead",re,"Caught"),c("div","emhud-tomb",re,"The Protector got you");const se=c("div","emhud-scores",re),_e=c("div","emhud-stat",se);c("div","emhud-stat-k",_e,"Emeems");const Ae=c("div","emhud-stat-v",_e,"0"),Pe=c("div","emhud-stat",se);c("div","emhud-stat-k",Pe,"Best");const Ue=c("div","emhud-stat-v is-best",Pe,"0"),Fe=c("div","emhud-newbest",re,"New best!");Fe.hidden=!0;const F=c("button","emhud-btn",re,"Run again");F.type="button",F.setAttribute("aria-label","Run again");const N=je=>{let lt=!0;return ot=>{ot&&ot.preventDefault&&ot.preventDefault(),lt&&(lt=!1,setTimeout(()=>{lt=!0},350),je())}};ne.addEventListener("click",N(()=>{ze(),i&&i.emit("start")})),F.addEventListener("click",N(()=>{ze(),i&&i.emit("restart")}));const G=je=>{let lt=null;return ot=>{ot!==lt&&(lt=ot,je.textContent=ot)}},k=je=>{let lt=-1;return ot=>{const Vt=Math.round(_a(ot)*200)/200;Vt!==lt&&(lt=Vt,je.style.opacity=Vt)}},q=G(m),de=G(E),oe=G(P),Me=G(he),we=G(ie),L=k(h),Ke=k(d),qe=k(W),R=k(B),M=k(x),K=k($);let te=-1,ce=-1,Re="",Ce=!1,ge=!1,be=-1,Le=-1,Ze=0,Ne=0,Be=0,Je=0;const rt=2.2,ct=.3;function Z(je,lt){Me(String(je||"Danger").toUpperCase()),we(String(lt||"The monster is faster").toUpperCase()),Je=rt}i&&(i.on("collect",je=>{const lt=je&&typeof je.points=="number"?je.points:1,ot=lt<0;g.textContent=(lt>0?"+":"")+lt,g.style.color=ot?"#ff5a48":je&&je.kind==="runner"?"#ffd15c":"#eaf5ea";try{g.animate(ot?[{opacity:1,transform:"translate(0,0) scale(1.15)"},{opacity:1,transform:"translate(3px,7px) scale(1)"},{opacity:0,transform:"translate(-2px,18px) scale(.95)"}]:[{opacity:1,transform:"translate(0,4px) scale(.85)"},{opacity:1,transform:"translate(0,-6px) scale(1.2)"},{opacity:0,transform:"translate(0,-20px) scale(1)"}],{duration:ot?900:700,easing:"cubic-bezier(.2,.8,.3,1)"}),ot&&m.animate([{transform:"translateX(0)",color:"#ff5a48"},{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)",color:"#fff"}],{duration:380,easing:"ease-out"})}catch{}}),i.on("levelup",je=>{const lt=je&&je.level||r&&r.level||null,ot=je&&typeof je.index=="number"?je.index:r?r.levelIndex:0;Z(lt&&lt.name?lt.name:"Danger",gT[ot])}));function De(){V.classList.add("emhud-off");const je=r?r.best|0:0;J.textContent=je>0?"Best "+je:"",ae.classList.remove("emhud-off")}function le(je,lt){const ot=Number.isFinite(je)?je|0:0,Vt=Number.isFinite(lt)?lt|0:0;Ae.textContent=String(ot),Ue.textContent=String(Vt),Fe.hidden=!(ot>0&&ot>=Vt),Je=0,ae.classList.add("emhud-off"),V.classList.remove("emhud-off")}function ze(){ae.classList.add("emhud-off"),V.classList.add("emhud-off"),Je=0,Ze=0,ce!==1&&(ce=1,f.style.transform="scale(1)"),M(0)}let Ge=1e9,Te=-1,Qe=-1,We=0;function Tt(je,lt){const ot=lt&&lt.state||r;if(!ot)return;const Vt=Number.isFinite(je)?Math.min(Math.max(je,0),.1):0,hn=ot.phase==="playing";if(We-=Vt,We<=0){We=.25;const _t=lt&&lt.engine;if(_t&&_t.setPortraitRect)if(hn){const Yt=y.getBoundingClientRect();_t.setPortraitRect({x:Yt.left,y:Yt.top,w:Yt.width,h:Yt.height})}else _t.setPortraitRect(null)}if(hn){const _t=ot.monster.pos.x-ot.player.pos.x,Yt=ot.monster.pos.z-ot.player.pos.z,Dt=Math.atan2(_t,-Yt)*180/Math.PI;Math.abs(Dt-Ge)>.8&&(Ge=Dt,S.style.transform=`rotate(${Dt.toFixed(1)}deg)`);const En=Math.hypot(_t,Yt),Nn=En<100?Math.round(En):99;Nn!==Te&&(Te=Nn,C.textContent=`${Nn}m`);const Nt=_a(ot.monster.proximity);if(Math.abs(Nt-Qe)>.02){Qe=Nt;const us=Math.round(24+231*Nt),T=Math.round(255-210*Nt),Q=`rgb(${us>255,255},${T},${T})`;b.style.borderColor=Nt>.02?`rgba(255,${T},${T},${(.24+.66*Nt).toFixed(2)})`:"rgba(255,255,255,.22)",b.style.boxShadow=`0 4px 18px rgba(0,0,0,.45), 0 0 ${Math.round(26*Nt)}px rgba(255,60,40,${(.55*Nt).toFixed(2)})`,S.style.color=Q}}const fi=ot.score|0;fi!==be&&(be>=0&&fi>be&&(Ze=1),be=fi,q(String(fi)));const An=ot.best|0;if(An!==Le&&(Le=An,de(String(An))),Ze>0){Ze=Math.max(0,Ze-Vt/ct);const _t=Ze*(2-Ze),Yt=1+.34*_t,Dt=Math.round(Yt*400)/400;Dt!==ce&&(ce=Dt,f.style.transform="scale("+Dt+")"),M(_t*.9)}const Pi=ot.level||null;oe(Pi&&Pi.name?Pi.name:"Watching");const _n=hn?_a(ot.monster?ot.monster.proximity:0):0,Gn=1-Math.exp(-12*Vt);Be+=(_n-Be)*Gn;const nn=_a(Be),pi=.04+nn*.96,Li=Math.round(pi*400)/400;Li!==te&&(te=Li,H.style.transform="scaleX("+Li+")"),qe(wr(.32,.92,nn)),o||(Ne+=Vt*du*(.9+nn*3.1),Ne>du&&(Ne-=du));const mi=Math.sin(Ne),Tn=o?.5:mi>0?mi*mi:0,gi=wr(.18,1,nn);if(L(gi*(.55+.45*Tn)),Ke(wr(.62,1,nn)*(.25+.75*Tn)),R(wr(.55,1,nn)*(.2+.8*Tn)),Je>0){Je-=Vt;const _t=Math.max(0,Je),Yt=wr(0,.18,rt-_t),Dt=wr(0,.55,_t);Ce||(Ce=!0,$.style.visibility="visible"),K(Yt*Dt);const En=.82+.18*Yt+.06*(1-Dt),Nn=(1-Yt)*22-(1-Dt)*16,Nt="translateY("+Math.round(Nn*10)/10+"px) scale("+Math.round(En*200)/200+")";Nt!==Re&&(Re=Nt,X.style.transform=Nt),Je<=0&&(Ce=!1,$.style.visibility="hidden")}else Ce&&(Ce=!1,K(0),$.style.visibility="hidden");hn!==ge&&(ge=hn,u.classList.toggle("emhud-off",!hn))}return{update:Tt,showStart:De,showGameOver:le,hideOverlays:ze}}const fu=typeof window<"u"&&(window.AudioContext||window.webkitAudioContext)||null,qi=(s,e,t)=>s>=e?s<=t?s:t:e,pu=s=>Math.pow(2,s/12),Yi=1e-4,MT=.28;function ym(s,e=1024){const t=new Float32Array(e),n=Math.tanh(s)||1;for(let i=0;i<e;i++){const r=i/(e-1)*2-1;t[i]=Math.tanh(r*s)/n}return t}function bT(s){const e=s&&s.state||null;let t=null,n=null,i=null,r=null,a=null,o=null,c=null,l=null,h=null,d=null,u=!1,f=!1,p=!1,x=0,m=0,g=null,v=null,b=-1,y=-1,w=null,S=0,C=0,_=-10,E=-10,A=-10,P=-10;function D(F){u=!0,!f&&typeof console<"u"&&console.warn&&(f=!0,console.warn("[emeem/audio] disabled:",F&&F.message?F.message:F))}function H(F){++m>6&&D(F)}const W=()=>!!t&&!u;function B(F,N,G,k,q,de=0){const oe=t.createGain(),Me=Math.max(N,Yi*2);return oe.gain.setValueAtTime(Yi,F),oe.gain.exponentialRampToValueAtTime(Me,F+G),de>0&&oe.gain.setValueAtTime(Me,F+G+de),oe.gain.exponentialRampToValueAtTime(Yi,F+k),oe.gain.setValueAtTime(0,F+k+.005),oe.connect(q),oe}function $(F,N,G=1){const k=t.createBufferSource();return k.buffer=l,k.loop=!0,k.playbackRate.value=G,k.start(F,Math.random()*(l.duration-.25)),k.stop(F+N+.01),k}function X(F){if(!t.createStereoPanner)return null;const N=t.createStereoPanner();return N.pan.value=qi(F,-1,1),N}function he(F,N=.55,G=7){if(!F||!e||!e.player)return 0;const k=F.x-e.player.pos.x;return Number.isFinite(k)?qi(k/G,-1,1)*N:0}function ie(){n=t.createGain(),n.gain.value=He.audio.masterVolume,i=t.createDynamicsCompressor(),i.threshold.value=-15,i.knee.value=22,i.ratio.value=6,i.attack.value=.004,i.release.value=.22,n.connect(i),i.connect(t.destination),r=t.createGain(),r.gain.value=1,r.connect(n),a=t.createGain(),a.gain.value=1,a.connect(r),o=t.createGain(),o.gain.value=1,o.connect(r),c=t.createGain(),c.gain.value=1,c.connect(n);const F=Math.floor(t.sampleRate*2.5);l=t.createBuffer(1,F,t.sampleRate);const N=l.getChannelData(0);for(let G=0;G<F;G++)N[G]=Math.random()*2-1;h=ym(2.2),d=ym(5.5),ae(),w=t.createGain(),w.gain.value=1,w.connect(o)}function ae(){v=t.createGain(),v.gain.value=0,v.connect(o),g=t.createBiquadFilter(),g.type="lowpass",g.frequency.value=110,g.Q.value=3,g.connect(v);const F=[43.65,65.41,43.95],N=["sawtooth","sawtooth","triangle"],G=[.5,.26,.4],k=[];for(let oe=0;oe<3;oe++){const Me=t.createOscillator();Me.type=N[oe],Me.frequency.value=F[oe];const we=t.createGain();we.gain.value=G[oe],Me.connect(we),we.connect(g),Me.start(),k.push(Me)}const q=t.createOscillator();q.type="sine",q.frequency.value=.055;const de=t.createGain();de.gain.value=8,q.connect(de),de.connect(k[0].detune),q.start()}function Y(){if(p||typeof document>"u"||!document.addEventListener)return;p=!0;const F=()=>{if(W())try{if(t.state!=="running"){const N=t.resume();N&&typeof N.catch=="function"&&N.catch(()=>{})}S=t.currentTime+.2}catch{}};document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&F()}),typeof window<"u"&&window.addEventListener&&(window.addEventListener("pageshow",F),window.addEventListener("focus",F))}function O(){if(!u)try{if(!t){if(!fu){u=!0;return}try{t=new fu({latencyHint:"interactive"})}catch{t=new fu}ie(),Y()}if(t.state!=="running"){const N=t.resume();N&&typeof N.catch=="function"&&N.catch(()=>{})}const F=t.currentTime;r.gain.cancelScheduledValues(F),r.gain.setValueAtTime(1,F),C=0,_=-10,S=F+.25,x=0,m=0}catch(F){D(F)}}function U(){if(W())try{const F=t.currentTime+.002;C=0,_=0;const N=t.createGain();N.gain.setValueAtTime(1e-4,F),N.gain.exponentialRampToValueAtTime(.5,F+.012),N.gain.exponentialRampToValueAtTime(1e-4,F+.42);const G=t.createBiquadFilter();G.type="lowpass",G.frequency.setValueAtTime(900,F),G.frequency.exponentialRampToValueAtTime(180,F+.38),G.connect(N).connect(n);for(const[k,q]of[[1,0],[.707,7]]){const de=t.createOscillator();de.type="sawtooth",de.frequency.setValueAtTime(196*k,F),de.frequency.exponentialRampToValueAtTime(72*k,F+.4),de.detune.setValueAtTime(q,F),de.connect(G),de.start(F),de.stop(F+.44)}}catch{}}function J(F){if(W()){if(F&&(F.kind==="amaam"||typeof F.points=="number"&&F.points<0)){U();return}try{const N=t.currentTime+.002;if(N-_<.02)return;C=N-_>.95?0:C+1,_=N;const G=[0,3,5,7,10,12,15,17,19,22,24],k=G[Math.min(C,G.length-1)],de=(F&&F.kind==="runner"?933.33:622.25)*pu(k);let oe=a;const Me=X(he(F&&F.position));Me&&(Me.connect(a),oe=Me);const we=t.createOscillator();we.type="sine",we.frequency.setValueAtTime(de*.84,N),we.frequency.exponentialRampToValueAtTime(de,N+.03),we.connect(B(N,.3,.004,.22,oe)),we.start(N),we.stop(N+.25);const L=t.createOscillator();L.type="triangle",L.frequency.value=de*2.008,L.connect(B(N,.12,.003,.13,oe)),L.start(N),L.stop(N+.16);const Ke=t.createOscillator();Ke.type="triangle",Ke.frequency.value=de*3.02,Ke.connect(B(N,.055,.002,.08,oe)),Ke.start(N),Ke.stop(N+.1);const qe=$(N,.05),R=t.createBiquadFilter();R.type="bandpass",R.frequency.value=4600+Math.min(C,8)*220,R.Q.value=1.1,qe.connect(R),R.connect(B(N,.085,.0015,.045,oe))}catch(N){H(N)}}}function ne(){if(W())try{const F=t.currentTime+.002,N=t.createOscillator();N.type="triangle",N.frequency.setValueAtTime(230,F),N.frequency.exponentialRampToValueAtTime(820,F+.16);const G=t.createBiquadFilter();G.type="lowpass",G.frequency.setValueAtTime(1400,F),G.frequency.exponentialRampToValueAtTime(3600,F+.16),N.connect(G),G.connect(B(F,.2,.006,.2,a)),N.start(F),N.stop(F+.22);const k=$(F,.18),q=t.createBiquadFilter();q.type="bandpass",q.frequency.setValueAtTime(700,F),q.frequency.exponentialRampToValueAtTime(2800,F+.17),q.Q.value=.9,k.connect(q),q.connect(B(F,.075,.01,.18,a))}catch(F){H(F)}}function V(F){if(W())try{const N=t.currentTime+.002;if(N-P<.05)return;P=N;const G=Math.abs(Number(F&&F.impact!=null?F.impact:4))||0,k=Math.sqrt(qi(G/Math.abs(He.player.maxFallSpeed),0,1));let q=a;const de=X(he(F&&F.position,.35));de&&(de.connect(a),q=de);const oe=.16+.16*k,Me=t.createOscillator();Me.type="sine",Me.frequency.setValueAtTime(150+70*k,N),Me.frequency.exponentialRampToValueAtTime(46,N+oe*.8),Me.connect(B(N,.1+.34*k,.005,oe+.06,q)),Me.start(N),Me.stop(N+oe+.1);const we=$(N,.11),L=t.createBiquadFilter();L.type="lowpass",L.frequency.setValueAtTime(700+900*k,N),L.frequency.exponentialRampToValueAtTime(200,N+.1),we.connect(L),L.connect(B(N,.05+.13*k,.003,.1,q))}catch(N){H(N)}}function re(F){if(W())try{const N=t.currentTime+.005;if(N-E<.3)return;E=N;const G=qi(Number(F&&F.intensity!=null?F.intensity:e?e.dread:0)||0,0,1),k=1.15+.8*G,q=.24+.4*G,de=t.createWaveShaper();de.curve=d,de.oversample="2x";const oe=t.createBiquadFilter();oe.type="lowpass",oe.frequency.setValueAtTime(420+2600*G,N),oe.frequency.exponentialRampToValueAtTime(170+420*G,N+k),oe.Q.value=1.5;const Me=t.createGain();Me.gain.setValueAtTime(Yi,N),Me.gain.exponentialRampToValueAtTime(q,N+.11),Me.gain.setValueAtTime(q,N+k*.5),Me.gain.exponentialRampToValueAtTime(Yi,N+k),Me.gain.setValueAtTime(0,N+k+.01);const we=t.createGain();we.gain.value=1,de.connect(oe),oe.connect(we),we.connect(Me),Me.connect(a);const L=t.createOscillator();L.type="sine",L.frequency.setValueAtTime(27-13*G,N),L.frequency.linearRampToValueAtTime(18-8*G,N+k);const Ke=t.createGain();Ke.gain.value=.4,L.connect(Ke),Ke.connect(we.gain),L.start(N),L.stop(N+k+.05);const qe=t.createOscillator();qe.type="sine",qe.frequency.value=5.5+3.5*G;const R=t.createGain();R.gain.value=20+34*G,qe.connect(R),qe.start(N),qe.stop(N+k+.05);const M=58-13*G,K=[1,1.005,.5],te=[0,12,-18],ce=[.45,.38,.6];for(let be=0;be<3;be++){const Le=t.createOscillator();Le.type="sawtooth",Le.detune.value=te[be],R.connect(Le.detune);const Ze=M*K[be];Le.frequency.setValueAtTime(Ze*1.42,N),Le.frequency.exponentialRampToValueAtTime(Ze*.6,N+k);const Ne=t.createGain();Ne.gain.value=ce[be],Le.connect(Ne),Ne.connect(de),Le.start(N),Le.stop(N+k+.05)}const Re=$(N,k),Ce=t.createBiquadFilter();Ce.type="bandpass",Ce.frequency.setValueAtTime(1500+800*G,N),Ce.frequency.exponentialRampToValueAtTime(230,N+k*.9),Ce.Q.value=2.2,Re.connect(Ce),Ce.connect(B(N,.1+.17*G,.14,k,oe,k*.35));const ge=t.createOscillator();ge.type="sine",ge.frequency.setValueAtTime(90,N),ge.frequency.exponentialRampToValueAtTime(34,N+.22),ge.connect(B(N,.16+.2*G,.008,.3,a)),ge.start(N),ge.stop(N+.34)}catch(N){H(N)}}function se(F,N,G,k){const q=t.createBiquadFilter();q.type="lowpass",q.frequency.setValueAtTime(2200,F),q.frequency.exponentialRampToValueAtTime(700,F+k),q.Q.value=2.4,q.connect(B(F,G,.012,k,a));const de=[{type:"sawtooth",mult:1,detune:-7,level:.5},{type:"triangle",mult:.5,detune:9,level:.42}];for(let oe=0;oe<de.length;oe++){const Me=de[oe],we=t.createOscillator();we.type=Me.type,we.frequency.value=N*Me.mult,we.detune.value=Me.detune;const L=t.createGain();L.gain.value=Me.level,we.connect(L),L.connect(q),we.start(F),we.stop(F+k+.05)}}function _e(F){if(W())try{const N=t.currentTime+.005;if(N-A<.15)return;A=N;const G=Math.max(1,He.levels.length-1),k=Number(F&&F.index!=null?F.index:e?e.levelIndex:0)||0,q=qi(k/G,0,1),de=146.83*pu(-2*q);se(N,de,.3,.22),se(N+.15,de*pu(8),.28,.26);const oe=N+.36,Me=t.createOscillator();Me.type="sine",Me.frequency.setValueAtTime(96,oe),Me.frequency.exponentialRampToValueAtTime(30,oe+.45),Me.connect(B(oe,.38+.14*q,.006,.8,a)),Me.start(oe),Me.stop(oe+.9);const we=$(oe,.3),L=t.createWaveShaper();L.curve=h;const Ke=t.createBiquadFilter();Ke.type="lowpass",Ke.frequency.setValueAtTime(1800,oe),Ke.frequency.exponentialRampToValueAtTime(220,oe+.28),we.connect(L),L.connect(Ke),Ke.connect(B(oe,.16,.004,.3,a))}catch(N){H(N)}}function Ae(){if(W())try{const F=t.currentTime+.005;r.gain.cancelScheduledValues(F),r.gain.setValueAtTime(r.gain.value,F),r.gain.linearRampToValueAtTime(.1,F+.05),r.gain.setValueAtTime(.1,F+1.1),r.gain.linearRampToValueAtTime(1,F+2.6);const N=$(F,.5),G=t.createWaveShaper();G.curve=d;const k=t.createBiquadFilter();k.type="lowpass",k.frequency.setValueAtTime(3200,F),k.frequency.exponentialRampToValueAtTime(260,F+.42),k.Q.value=1.2,N.connect(G),G.connect(k),k.connect(B(F,.5,.003,.46,c));const q=$(F,.07),de=t.createBiquadFilter();de.type="bandpass",de.frequency.value=1900,de.Q.value=5.5,q.connect(de),de.connect(B(F,.3,.001,.06,c));const oe=t.createOscillator();oe.type="sawtooth",oe.frequency.setValueAtTime(330,F+.03),oe.frequency.exponentialRampToValueAtTime(27,F+1.45);const Me=t.createWaveShaper();Me.curve=h;const we=t.createBiquadFilter();we.type="lowpass",we.frequency.setValueAtTime(1700,F),we.frequency.exponentialRampToValueAtTime(130,F+1.4),oe.connect(Me),Me.connect(we),we.connect(B(F+.03,.34,.02,1.6,c,.5)),oe.start(F+.03),oe.stop(F+1.7);const L=t.createOscillator();L.type="sine",L.frequency.setValueAtTime(140,F),L.frequency.exponentialRampToValueAtTime(22,F+1.5),L.connect(B(F,.42,.01,1.7,c,.3)),L.start(F),L.stop(F+1.8),S=F+3}catch(F){H(F)}}function Pe(F,N,G,k,q){const de=t.createOscillator();de.type="sine",de.frequency.setValueAtTime(G,F),de.frequency.exponentialRampToValueAtTime(k,F+q*.7);const oe=t.createGain();oe.gain.setValueAtTime(Yi,F),oe.gain.exponentialRampToValueAtTime(Math.max(N,Yi*2),F+.012),oe.gain.exponentialRampToValueAtTime(Yi,F+q),oe.gain.setValueAtTime(0,F+q+.005),de.connect(oe),oe.connect(w),de.start(F),de.stop(F+q+.02);const Me=t.createOscillator();if(Me.type="triangle",Me.frequency.setValueAtTime(G*2.7,F),Me.frequency.exponentialRampToValueAtTime(k*2.4,F+q*.5),Me.connect(B(F,N*.3,.008,q*.6,w)),Me.start(F),Me.stop(F+q),N>.08){const we=$(F,.08),L=t.createBiquadFilter();L.type="lowpass",L.frequency.value=380,we.connect(L),L.connect(B(F,N*.34,.004,.08,w))}}function Ue(F,N,G){const k=qi(G*.3,.13,.26);Pe(F,N,66,33,.24),Pe(F+k,N*.72,56,29,.2)}function Fe(F,N){if(!W())return;const G=N&&N.state||e;if(G)try{const k=t.currentTime,q=G.phase==="playing",de=qi(Number(G.dread)||0,0,1);C>0&&k-_>.95&&(C=0);const oe=q?.014+de*.2:0,Me=110+de*de*900;Math.abs(oe-b)>.004&&(b=oe,v.gain.setTargetAtTime(oe,k,q?.5:.1)),Math.abs(Me-y)>12&&(y=Me,g.frequency.setTargetAtTime(Me,k,.6));const we=q?qi(Number(G.monster.proximity)||0,0,1):0,L=we*we*(.28+.22*de),qe=60/(52+Math.pow(we,1.4)*112);if(!q||L<.004)S=k+.12;else for(S<k&&(S=k+.05);S<k+MT;)Ue(S,L,qe),S+=qe;x=0}catch(k){++x>10&&D(k)}}return{resume:O,update:Fe,collect:J,penalty:U,jump:ne,land:V,roar:re,levelup:_e,caught:Ae}}const ST=document.getElementById("game-canvas"),Td=document.getElementById("ui-root");function wT(){try{return!!document.createElement("canvas").getContext("webgl2")}catch{return!1}}if(!wT())throw Td.innerHTML='<div style="position:fixed;inset:0;display:grid;place-content:center;gap:10px;text-align:center;padding:28px;background:#0b0510;color:#f2c4b3;font:600 17px/1.5 system-ui,-apple-system,sans-serif"><div style="font-size:34px">🤏</div><div>Emeem needs WebGL2, which this browser does not support.</div><div style="opacity:.62;font-weight:500;font-size:14px">On iPhone that means iOS 15 or newer; on Android, Chrome or Firefox.</div></div>',new Error("WebGL2 unavailable");const Sn=pw(),oi=yw(ST),wt={THREE:so,CONFIG:He,state:$e,bus:Sn,scene:oi.scene,camera:oi.camera,renderer:oi.renderer,engine:oi,world:null,audio:null,addScore:s=>fw(Sn,s)};wt.audio=bT(wt);wt.world=Cw(wt);const fl=gA(wt),pl=DA(wt),ml=hT(wt),ih=vT(Td,wt);mT(Td,wt);Sn.on("collect",s=>{wt.audio.collect(s),(!s||typeof s.points!="number"||s.points>0)&&$e.stats.emeems++});Sn.on("jump",s=>{wt.audio.jump(s),$e.stats.jumps++});Sn.on("land",s=>wt.audio.land(s));Sn.on("roar",s=>wt.audio.roar(s));Sn.on("levelup",s=>{wt.audio.levelup(s),Sn.emit("shake",{amount:.7})});Sn.on("shake",s=>{$e.camera.shake=Math.min(1.6,$e.camera.shake+(s?.amount??.4))});Sn.on("caught",()=>{if($e.phase==="playing"){$e.phase="dead",$e.best=Math.max($e.best,$e.score);try{localStorage.setItem("emeem.best",String($e.best))}catch{}wt.audio.caught(),Sn.emit("shake",{amount:1.6}),ih.showGameOver($e.score,$e.best)}});function Ed(){dw(),wt.audio.resume(),wt.world.reset(),fl.reset(),ml.reset(),pl.reset(),oi.reset(),ih.hideOverlays()}Sn.on("start",Ed);Sn.on("restart",Ed);try{$e.best=Number(localStorage.getItem("emeem.best"))||0}catch{}let vm=performance.now(),mc=0;const gc=1/120;function xg(s){requestAnimationFrame(xg);let e=(s-vm)/1e3;if(vm=s,(!Number.isFinite(e)||e<0)&&(e=0),e=Math.min(e,He.render.maxDelta),$e.dt=e,oi.update(e,wt),$e.phase==="playing"){for($e.time+=e,$e.stats.runTime=$e.time,mc=Math.min(mc+e,.25);mc>=gc&&(fl.fixedUpdate(gc,wt),ml.fixedUpdate(gc,wt),mc-=gc,$e.phase==="playing"););wt.world.update(e,wt),pl.update(e,wt)}fl.update(e,wt),ml.update(e,wt),$e.phase!=="playing"&&pl.update(e,wt),ih.update(e,wt),wt.audio.update(e,wt),oi.render()}window.addEventListener("resize",()=>oi.resize());oi.resize();ih.showStart();requestAnimationFrame(xg);window.__EMEEM__={ctx:wt,state:$e,bus:Sn,startRun:Ed,engine:oi,world:wt.world,player:fl,monster:ml,emeems:pl};
