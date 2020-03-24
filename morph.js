const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true,
  dimensions: [800, 600],
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  varying vec2 vUv;

  float random2d(vec2 coord){
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main () {
    vec2 st = vUv * .06;
    st -= time + vec2(cos(st.x), sin(st.y));

    float rand01 = fract(random2d(floor(st)) + time / 60.0);
    float rand02 = fract(random2d(floor(st)) + time / 40.0);

    rand01 *= 0.5 - length(fract(st));

    gl_FragColor = vec4(rand01 * 5.0 , rand02 * rand01 * 8.0, 0.0, 1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time
    }
  });
};

canvasSketch(sketch, settings);
