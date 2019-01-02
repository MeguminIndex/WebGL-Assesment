

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fuv;

uniform sampler2D mainTexture;
uniform vec3 lightDir;
void main()
{
  
    //Calculate the lambertian reflectance term
    float lambert = dot(normalize(fNormal), normalize(lightDir));
    //Calculate ambient light
    vec3 ambient = texture2D(mainTexture,fuv).rgb;
    //And set the final output color
    gl_FragColor = vec4(ambient  , 1.0);  
}
