import * as THREE from 'three';

export function initModelViewer(modelName) {

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
 
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
  
  const container = document.createElement('div');
  container.id = 'model-viewer-container';
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.zIndex = '1000';
  container.style.border = '2px solid #3a86ff';
  container.style.borderRadius = '10px';
  container.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
  container.appendChild(renderer.domElement);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.padding = '5px 10px';
  closeBtn.style.background = '#3a86ff';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '5px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => document.body.removeChild(container);
  container.appendChild(closeBtn);
  

  document.body.appendChild(container);
  
  loadModel(modelName, scene);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
  });
}

function loadModel(modelName, scene) {
  let geometry, material, mesh;
  
  switch(modelName) {
    case 'heart':
      geometry = new THREE.SphereGeometry(1, 32, 32);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        flatShading: true
      });
      mesh = new THREE.Mesh(geometry, material);
      break;
      
    case 'brain':
      geometry = new THREE.BoxGeometry(1.5, 1, 1.2);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xffcc00,
        flatShading: true
      });
      mesh = new THREE.Mesh(geometry, material);
      break;
      
    case 'skin':
      geometry = new THREE.PlaneGeometry(2, 1.5);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xffaa66,
        side: THREE.DoubleSide
      });
      mesh = new THREE.Mesh(geometry, material);
      break;
      
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
      material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      mesh = new THREE.Mesh(geometry, material);
  }
  
  scene.add(mesh);
}