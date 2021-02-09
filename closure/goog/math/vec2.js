/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Defines a 2-element vector class that can be used for
 * coordinate math, useful for animation systems and point manipulation.
 *
 * Vec2 objects inherit from goog.math.Coordinate and may be used wherever a
 * Coordinate is required. Where appropriate, Vec2 functions accept both Vec2
 * and Coordinate objects as input.
 */

goog.provide('goog.math.Vec2');

goog.require('goog.math');
goog.require('goog.math.Coordinate');



/**
 * Class for a two-dimensional vector object and assorted functions useful for
 * manipulating points.
 *
 * @param {number} x The x coordinate for the vector.
 * @param {number} y The y coordinate for the vector.
 * @struct
 * @constructor
 * @extends {goog.math.Coordinate}
 */
goog.math.Vec2 = function(x, y) {
  'use strict';
  /**
   * X-value
   * @type {number}
   */
  this.x = x;

  /**
   * Y-value
   * @type {number}
   */
  this.y = y;
};
goog.inherits(goog.math.Vec2, goog.math.Coordinate);


/**
 * @return {!goog.math.Vec2} A random unit-length vector.
 */
goog.math.Vec2.randomUnit = function() {
  'use strict';
  var angle = Math.random() * Math.PI * 2;
  return new goog.math.Vec2(Math.cos(angle), Math.sin(angle));
};


/**
 * @return {!goog.math.Vec2} A random vector inside the unit-disc.
 */
goog.math.Vec2.random = function() {
  'use strict';
  var mag = Math.sqrt(Math.random());
  var angle = Math.random() * Math.PI * 2;

  return new goog.math.Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
};


/**
 * Returns a new Vec2 object from a given coordinate.
 * @param {!goog.math.Coordinate} a The coordinate.
 * @return {!goog.math.Vec2} A new vector object.
 */
goog.math.Vec2.fromCoordinate = function(a) {
  'use strict';
  return new goog.math.Vec2(a.x, a.y);
};


/**
 * @return {!goog.math.Vec2} A new vector with the same coordinates as this one.
 * @override
 */
goog.math.Vec2.prototype.clone = function() {
  'use strict';
  return new goog.math.Vec2(this.x, this.y);
};


/**
 * Returns the magnitude of the vector measured from the origin.
 * @return {number} The length of the vector.
 */
goog.math.Vec2.prototype.magnitude = function() {
  'use strict';
  return Math.sqrt(this.x * this.x + this.y * this.y);
};


/**
 * Returns the squared magnitude of the vector measured from the origin.
 * NOTE(brenneman): Leaving out the square root is not a significant
 * optimization in JavaScript.
 * @return {number} The length of the vector, squared.
 */
goog.math.Vec2.prototype.squaredMagnitude = function() {
  'use strict';
  return this.x * this.x + this.y * this.y;
};


/**
 * @param {number} sx The scale factor to use for the x dimension.
 * @param {number=} opt_sy The scale factor to use for the y dimension.
 * @return {!goog.math.Vec2} This vector after scaling.
 * @override
 */
// Since the implementation of Coordinate.scale() returns "this", we
// can reuse that implementation here, and just recast the return type.
goog.math.Vec2.prototype.scale =
    /** @type {function(number, number=):!goog.math.Vec2} */
    (goog.math.Coordinate.prototype.scale);


/**
 * Reverses the sign of the vector. Equivalent to scaling the vector by -1.
 * @return {!goog.math.Vec2} The inverted vector.
 */
goog.math.Vec2.prototype.invert = function() {
  'use strict';
  this.x = -this.x;
  this.y = -this.y;
  return this;
};


/**
 * Normalizes the current vector to have a magnitude of 1.
 * @return {!goog.math.Vec2} The normalized vector.
 */
goog.math.Vec2.prototype.normalize = function() {
  'use strict';
  return this.scale(1 / this.magnitude());
};


/**
 * Adds another vector to this vector in-place.
 * @param {!goog.math.Coordinate} b The vector to add.
 * @return {!goog.math.Vec2}  This vector with `b` added.
 */
goog.math.Vec2.prototype.add = function(b) {
  'use strict';
  this.x += b.x;
  this.y += b.y;
  return this;
};


/**
 * Subtracts another vector from this vector in-place.
 * @param {!goog.math.Coordinate} b The vector to subtract.
 * @return {!goog.math.Vec2} This vector with `b` subtracted.
 */
goog.math.Vec2.prototype.subtract = function(b) {
  'use strict';
  this.x -= b.x;
  this.y -= b.y;
  return this;
};


/**
 * Rotates this vector in-place by a given angle, specified in radians.
 * @param {number} angle The angle, in radians.
 * @return {!goog.math.Vec2} This vector rotated `angle` radians.
 */
goog.math.Vec2.prototype.rotate = function(angle) {
  'use strict';
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var newX = this.x * cos - this.y * sin;
  var newY = this.y * cos + this.x * sin;
  this.x = newX;
  this.y = newY;
  return this;
};


/**
 * Rotates a vector by a given angle, specified in radians, relative to a given
 * axis rotation point. The returned vector is a newly created instance - no
 * in-place changes are done.
 * @param {!goog.math.Vec2} v A vector.
 * @param {!goog.math.Vec2} axisPoint The rotation axis point.
 * @param {number} angle The angle, in radians.
 * @return {!goog.math.Vec2} The rotated vector in a newly created instance.
 */
goog.math.Vec2.rotateAroundPoint = function(v, axisPoint, angle) {
  'use strict';
  var res = v.clone();
  return res.subtract(axisPoint).rotate(angle).add(axisPoint);
};


/** @override */
goog.math.Vec2.prototype.equals = function(b) {
  'use strict';
  if (this === b) {
    return true;
  }
  return b instanceof goog.math.Vec2 && !!b && this.x == b.x && this.y == b.y;
};


/**
 * Returns the distance between two vectors.
 * @param {!goog.math.Coordinate} a The first vector.
 * @param {!goog.math.Coordinate} b The second vector.
 * @return {number} The distance.
 */
goog.math.Vec2.distance = goog.math.Coordinate.distance;


/**
 * Returns the squared distance between two vectors.
 * @param {!goog.math.Coordinate} a The first vector.
 * @param {!goog.math.Coordinate} b The second vector.
 * @return {number} The squared distance.
 */
goog.math.Vec2.squaredDistance = goog.math.Coordinate.squaredDistance;


/**
 * Compares vectors for equality.
 * @param {!goog.math.Coordinate} a The first vector.
 * @param {!goog.math.Coordinate} b The second vector.
 * @return {boolean} Whether the vectors have the same x and y coordinates.
 */
goog.math.Vec2.equals = goog.math.Coordinate.equals;


/**
 * Returns the sum of two vectors as a new Vec2.
 * @param {!goog.math.Coordinate} a The first vector.
 * @param {!goog.math.Coordinate} b The second vector.
 * @return {!goog.math.Vec2} The sum vector.
 */
goog.math.Vec2.sum = function(a, b) {
  'use strict';
  return new goog.math.Vec2(a.x + b.x, a.y + b.y);
};


/**
 * Returns the difference between two vectors as a new Vec2.
 * @param {!goog.math.Coordinate} a The first vector.
 * @param {!goog.math.Coordinate} b The second vector.
 * @return {!goog.math.Vec2} The difference vector.
 */
goog.math.Vec2.difference = function(a, b) {
  'use strict';
  return new goog.math.Vec2(a.x - b.x, a.y - b.y);
};


/**
 * Returns the dot-product of two vectors.
 * @param {!goog.math.Coordinate} a The first vector.
 * @param {!goog.math.Coordinate} b The second vector.
 * @return {number} The dot-product of the two vectors.
 */
goog.math.Vec2.dot = function(a, b) {
  'use strict';
  return a.x * b.x + a.y * b.y;
};


/**
 * Returns the determinant of two vectors.
 * @param {!goog.math.Vec2} a The first vector.
 * @param {!goog.math.Vec2} b The second vector.
 * @return {number} The determinant of the two vectors.
 */
goog.math.Vec2.determinant = function(a, b) {
  'use strict';
  return a.x * b.y - a.y * b.x;
};


/**
 * Returns a new Vec2 that is the linear interpolant between vectors a and b at
 * scale-value x.
 * @param {!goog.math.Coordinate} a Vector a.
 * @param {!goog.math.Coordinate} b Vector b.
 * @param {number} x The proportion between a and b.
 * @return {!goog.math.Vec2} The interpolated vector.
 */
goog.math.Vec2.lerp = function(a, b, x) {
  'use strict';
  return new goog.math.Vec2(
      goog.math.lerp(a.x, b.x, x), goog.math.lerp(a.y, b.y, x));
};


/**
 * Returns a new Vec2 that is a copy of the vector a, but rescaled by a factors
 * sx and sy in the x and y directions. If only sx is specified, then y is
 * scaled by the same factor as x.
 * @param {!goog.math.Coordinate} a Vector a.
 * @param {number} sx X scale factor.
 * @param {number=} sy Y scale factor (optional).
 * @return {!goog.math.Vec2} A new rescaled vector.
 */
goog.math.Vec2.rescaled = function(a, sx, sy = sx) {
  return new goog.math.Vec2(a.x * sx, a.y * sy);
};
