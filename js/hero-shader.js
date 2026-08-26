(function () {
  var GOLD   = '#C9A84C';
  var DGOLD  = '#3a2800';
  var BLACK  = '#000000';

  var vertexShader = [
    'uniform float time;',
    'uniform float intensity;',
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  vec3 pos = position;',
    '  pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;',
    '  pos.x += cos(pos.y *  8.0 + time * 1.5) * 0.05 * intensity;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
    '}'
  ].join('\n');

  var fragmentShader = [
    'uniform float time;',
    'uniform float intensity;',
    'uniform vec3  color1;',
    'uniform vec3  color2;',
    'varying vec2  vUv;',
    'void main() {',
    '  vec2 uv = vUv;',
    '  float n = sin(uv.x * 20.0 + time)       * cos(uv.y * 15.0 + time * 0.8);',
    '  n += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;',
    '  vec3 col = mix(color1, color2, n * 0.5 + 0.5);',
    '  col = mix(col, vec3(1.0, 0.85, 0.3), pow(abs(n), 2.0) * intensity * 0.35);',
    '  float glow = max(0.0, 1.0 - length(uv - 0.5) * 2.0);',
    '  glow = pow(glow, 2.0);',
    '  gl_FragColor = vec4(col * glow, glow * 0.38);',
    '}'
  ].join('\n');

  function init() {
    var hero = document.querySelector('.hero');
    if (!hero || typeof THREE === 'undefined') return;

    /* ── canvas ── */
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;' +
      'z-index:0;pointer-events:none;display:block;';

    var lionWm = hero.querySelector('.lion-watermark');
    if (lionWm) hero.insertBefore(canvas, lionWm);
    else hero.appendChild(canvas);

    /* ── renderer ── */
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, premultipliedAlpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.z = 3;

    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    /* ── shader planes ── */
    function makeShaderPlane(px, py, pz, c1, c2) {
      var uniforms = {
        time:      { value: 0 },
        intensity: { value: 1.0 },
        color1:    { value: new THREE.Color(c1) },
        color2:    { value: new THREE.Color(c2) }
      };
      var mat = new THREE.ShaderMaterial({
        uniforms:       uniforms,
        vertexShader:   vertexShader,
        fragmentShader: fragmentShader,
        transparent:    true,
        side:           THREE.DoubleSide,
        depthWrite:     false
      });
      var geo  = new THREE.PlaneGeometry(2, 2, 32, 32);
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(px, py, pz);
      scene.add(mesh);
      return uniforms;
    }

    /* right-side glow (behind logo / score bar area) */
    var planes = [
      makeShaderPlane( 1.6,  0.1,  0,   GOLD,  DGOLD),
      makeShaderPlane(-1.0,  0.3, -0.4, DGOLD, BLACK)
    ];

    /* ── loop ── */
    var rafId;
    var clock = new THREE.Clock();

    function animate() {
      rafId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      planes.forEach(function (u, i) {
        u.time.value      = t + i * 2.5;
        u.intensity.value = 1.0 + Math.sin(t * 2 + i) * 0.3;
      });

      renderer.render(scene, camera);
    }

    resize();
    animate();

    /* resize observer — hero height can change on orientation change */
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(hero);
    } else {
      window.addEventListener('resize', resize);
    }

    /* pause when tab hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(rafId);
      else animate();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
