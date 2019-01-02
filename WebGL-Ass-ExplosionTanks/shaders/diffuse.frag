varying vec3 fPosition;
varying vec3 fNormal;

void main()
{
    //The directional light source -- what direction light is coming from
    vec3 light = vec3(0, 1, 0);
    //Calculate the lambertian reflectance term
    float lambert = dot(normalize(fNormal), normalize(light));
    //Calculate ambient light
    vec3 ambient = vec3(1,0, 0) * 0.5;
    //And set the final output color
    gl_FragColor = vec4(ambient + lambert * vec3(1, 0, 0), 1.0);  
}
