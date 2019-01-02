/**
 * @file     shader-loader.js
 * @author   Benjamin Williams <bwilliams@lincoln.ac.uk>
 *
 * @brief    Loads shader source code from a file using AJAX.
 * @requires jQuery3.2.1
 *
 * Example usage:
 *  var vertexShaderSource   = ShaderLoader.getShaderSource("shaders/specular.vert");
 *  var fragmentShaderSource = ShaderLoader.getShaderSource("shaders/specular.frag");
 */

/**
 * The static ShaderLoader class
 * @constructor
 */
var ShaderLoader = function() { };


/**
 * Gets the shader source from a URL, and returns it
 * @param  {String} source The URL
 * @return {String}        The shader source
 */
ShaderLoader.getShaderSource = function(source)
{
  //Do a syncronous ajax call -- bad practice, but
  //good for what we want to do
  return $.ajax(
  {
        url: source,
        type: "GET",
        dataType: "html",
        async: false
  }).responseText;
}


/**
 * Alias for getShaderSource
 */
ShaderLoader.load = ShaderLoader.getShaderSource;


/**
 * Gets both a vertex/fragment shader source and returns it in an object.
 * @param  {String} vertexURL   The vertex shader URL
 * @param  {String} fragmentURL The fragment shader URL
 * @return {Object}             An object.
 */
ShaderLoader.getShaders = function(vertexURL, fragmentURL)
{
  //Get fragment and vertex shader source
  var fragment = ShaderLoader.getShaderSource(fragmentURL);
  var vertex   = ShaderLoader.getShaderSource(vertexURL);

  //Return some object
  return (
  {
    vertex:   vertex,
    fragment: fragment
  });
}