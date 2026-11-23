/* A continuous, double-sided sheet rendered over the reader's static pages. */
(()=>{
 const THREE=window.originalReaderThree;
 const verticesX=64,verticesY=32;
 const prepared=new WeakMap();
 let renderer;

 function prepare(page,figure){
  if(prepared.has(page)||!THREE)return;
  const canvas=document.createElement('canvas');
  canvas.width=page.width;canvas.height=page.height;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const images=[...figure.querySelectorAll('img')].map(source=>{
   const image=new Image();
   if(location.protocol!=='file:')image.crossOrigin='anonymous';
   image.src=source.src;
   return image;
  });
  const entry={};
  prepared.set(page,entry);
  Promise.all(images.map(image=>image.decode())).then(()=>{
   page.tiles.forEach((tile,index)=>{
    const x=page.columns.slice(0,tile.col).reduce((a,b)=>a+b,0);
    const y=page.rows.slice(0,tile.row).reduce((a,b)=>a+b,0);
    ctx.drawImage(images[index],x,y,tile.width,tile.height);
   });
   // A local browser may disallow WebGL uploads from file-origin images.
   ctx.getImageData(0,0,1,1);
   entry.canvas=canvas;
  }).catch(()=>{});
 }

 function mount({scene,stage,front,back,from,to,clock,corner}){
  const images=[prepared.get(front)?.canvas,prepared.get(back)?.canvas];
  if(!THREE||images.some(image=>!image))return null;
  try {
   renderer??=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
   renderer.setPixelRatio(Math.min(devicePixelRatio,2));
   renderer.setSize(stage.clientWidth,stage.clientHeight,false);
  } catch {return null;}

  const textures=images.map(image=>{
   const texture=new THREE.CanvasTexture(image);
   texture.colorSpace=THREE.SRGBColorSpace;
   texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   return texture;
  });
  const distance=stage.clientHeight*6;
  const fov=2*Math.atan(stage.clientHeight/(2*distance))*180/Math.PI;
  const camera=new THREE.PerspectiveCamera(fov,stage.clientWidth/stage.clientHeight,1,distance*2);
  camera.position.z=distance;
  const geometry=new THREE.PlaneGeometry(1,1,verticesX,verticesY);
  const material=new THREE.ShaderMaterial({
   side:THREE.DoubleSide,
   uniforms:{front:{value:textures[0]},back:{value:textures[1]},motion:{value:0}},
   vertexShader:`
    varying vec2 paperUv;
    varying vec3 paperPosition;
    void main(){
     paperUv=uv;
     paperPosition=(modelViewMatrix*vec4(position,1.)).xyz;
     gl_Position=projectionMatrix*vec4(paperPosition,1.);
    }`,
   fragmentShader:`
    uniform sampler2D front;
    uniform sampler2D back;
    uniform float motion;
    varying vec2 paperUv;
    varying vec3 paperPosition;
    void main(){
     vec2 reverseUv=vec2(1.-paperUv.x,paperUv.y);
     vec4 ink=gl_FrontFacing?texture2D(front,paperUv):texture2D(back,reverseUv);
     vec3 normal=normalize(cross(dFdx(paperPosition),dFdy(paperPosition)));
     float light=abs(dot(normal,normalize(vec3(-.4,.5,1.))));
     float shade=mix(1.,.63+.41*light,motion);
     gl_FragColor=vec4(ink.rgb*shade,1.);
     #include <colorspace_fragment>
    }`
  });
  const world=new THREE.Scene();
  const sheet=new THREE.Mesh(geometry,material);
  sheet.frustumCulled=false;
  world.add(sheet);
  const canvas=renderer.domElement;
  canvas.className='original-paper-mesh';
  const positions=geometry.attributes.position;
  const uv=geometry.attributes.uv;
  let frame;
  function render(){
   const progress=clock.effect.getComputedTiming().progress??0;
   const lift=Math.sin(Math.PI*progress);
   const width=from.right+(to.left-from.right)*progress;
   const height=from.height+(to.height-from.height)*progress;
   const spine=from.spine+(to.spine-from.spine)*progress-stage.clientWidth/2;
   const rotation=Math.PI*progress;
   const cos=Math.cos(rotation),sin=Math.sin(rotation);
   for(let index=0;index<positions.count;index++){
    const x=uv.getX(index),y=uv.getY(index)-.5;
    const bend=1.48*lift*(1+corner*y*.9);
    const angle=bend*x;
    const flat=bend<.0001;
    const reach=width*(flat?x:Math.sin(angle)/bend);
    const curl=width*(flat?0:(1-Math.cos(angle))/bend);
    positions.setXYZ(index,spine+reach*cos-curl*sin,y*height+corner*lift*x*x*height*.035,reach*sin+curl*cos);
   }
   positions.needsUpdate=true;
   material.uniforms.motion.value=lift;
   renderer.render(world,camera);
   frame=requestAnimationFrame(render);
  }
  try {
   render();scene.append(canvas);
  } catch {
   geometry.dispose();material.dispose();textures.forEach(texture=>texture.dispose());
   return null;
  }
  return ()=>{
   cancelAnimationFrame(frame);canvas.remove();
   geometry.dispose();material.dispose();textures.forEach(texture=>texture.dispose());
  };
 }

 window.originalPaperMesh={prepare,mount};
})();
