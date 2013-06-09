/* 
 * Chordlove is a tool for sharing song chords and lyrics.
 * Copyright (C) 2013 NA Konsult AB
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * The MIT License (MIT)

 Copyright (c) 2011 Justin D'Arcangelo

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * Database of chords.
 * 
 * Initial data set is thanks to https://github.com/justindarc/raphael.chord.js (c) 2011 Justin D'Arcangelo released
 * under the MIT license.
 * 
 * @module chorddata
 */
function ChordData()
{
  'use strict';
  if ( ChordData.prototype._instance )
  {
    return ChordData.prototype._instance;
  }
  ChordData.prototype._instance = this;

  var aliases = null, notes = null, data = null;

  function get( rootNote, chordName )
  {
    if ( !rootNote )
    {
      throw new "Root note must be defined.";
    }

    if ( !( rootNote in notes ) )
    {
      throw new 'Invalid root note: "' + rootNote + '".';
    }
    var root = notes[rootNote];

    var chord = chordName || 'maj';

    if ( chord in aliases )
    {
      chord = aliases[chord];
    }

    if ( root in data && chord in data[root] )
    {
      return data[root][chord];
    }
    else
    {
      return [];
    }
  }

  aliases = {
    'M' : 'maj',
    'm' : 'min',
    'm6' : 'min6',
    'm7' : 'min7',
    'm9' : 'min9',
    'm11' : 'min11',
    'm13' : 'min13',
    'm(maj7)' : 'min(maj7)',
    '+' : 'aug',
    'o' : 'dim',
    'sus' : 'sus4'
  };

  notes = {
    'A' : 'A',
    'A#' : 'A#',
    'A♯' : 'A#',
    'Bb' : 'A#',
    'B♭' : 'A#',
    'B' : 'B',
    'H' : 'B',
    'C' : 'C',
    'C#' : 'C#',
    'C♯' : 'C#',
    'Db' : 'C#',
    'D♭' : 'C#',
    'D' : 'D',
    'D#' : 'D#',
    'D♯' : 'D#',
    'Eb' : 'D#',
    'E♭' : 'D#',
    'E' : 'E',
    'F' : 'F',
    'F#' : 'F#',
    'F♯' : 'F#',
    'Gb' : 'F#',
    'G♭' : 'F#',
    'G' : 'G',
    'G#' : 'G#',
    'G♯' : 'G#',
    'Ab' : 'G#',
    'A♭' : 'G#'
  };

  data = {
    'A' : {
      'maj' : [ [ -1, 0, 2, 2, 2, 0 ], [ 5, 4, 2, 2, 2, -1 ], [ 5, 7, 7, 6, 5, 5 ], [ 9, -1, 7, 9, 10, -1 ],
          [ -1, -1, 7, 9, 10, 9 ], [ 12, -1, 11, 9, 10, -1 ], [ -1, 12, 11, 9, 10, 9 ] ],
      '5' : [ [ -1, 0, 2, 2, -1, -1 ], [ -1, 0, 2, 2, 5, 5 ], [ 5, 7, 7, -1, -1, -1 ], [ -1, -1, 7, 9, 10, -1 ] ],
      '6' : [ [ -1, 0, 2, 2, 2, 2 ], [ 5, -1, 4, 6, 2, -1 ], [ 5, 7, -1, 6, 7, 5 ] ],
      '7' : [ [ -1, 0, 2, 0, 2, 0 ], [ -1, 0, 2, 2, 2, 1 ], [ 5, 7, 5, 6, 5, 5 ], [ 5, 7, -1, 6, 8, -1 ],
          [ -1, -1, 7, 9, 8, 9 ], [ -1, 10, -1, 9, 10, 9 ] ],
      'maj7' : [ [ -1, 0, 2, 1, 2, 0 ], [ -1, 0, 2, 2, 2, 4 ], [ -1, -1, 7, 6, 5, 4 ], [ -1, 12, 11, 9, 9, 9 ] ],
      '9' : [ [ -1, 0, 2, 4, 2, 3 ], [ 5, 4, 5, 4, 5, -1 ], [ 5, 7, 5, 6, 5, 7 ], [ -1, 12, 11, 12, 12, 12 ] ],
      'maj9' : [ [ -1, 0, 2, 4, 2, 4 ], [ 5, -1, 6, 6, -1, 7 ] ],
      '11' : [ [ -1, 0, 0, 0, 2, 0 ], [ 5, 5, 5, 6, 5, 7 ], [ -1, -1, 7, 7, 8, 9 ], [ -1, 12, 11, 12, 10, 10 ] ],
      '13' : [ [ -1, 0, 2, 0, 2, 2 ], [ -1, -1, 5, 2, 2, 2 ], [ 5, 7, 5, 6, 7, 5 ] ],
      'maj13' : [ [ -1, 0, 2, 1, 2, 2 ], [ 5, 4, 4, 4, 5, 4 ] ],
      'min' : [ [ -1, 0, 2, 2, 1, 0 ], [ -1, 3, 2, 2, 5, -1 ], [ 5, 7, 7, 5, 5, 5 ], [ -1, -1, 7, 5, 5, 8 ],
          [ -1, 7, 10, 9, 10, -1 ], [ -1, -1, 7, 9, 10, 8 ], [ -1, 12, 10, 9, 10, -1 ] ],
      'min6' : [ [ -1, 0, 2, 2, 1, 2 ], [ 5, -1, 4, 5, 5, 5 ], [ -1, -1, 7, 9, 7, 8 ], [ -1, 12, -1, 11, 13, 12 ] ],
      'min7' : [ [ -1, 0, 2, 0, 1, 0 ], [ 5, 7, 5, 5, 8, 5 ], [ 5, -1, 5, 5, 5, -1 ], [ -1, 12, 10, 12, 10, 12 ] ],
      'min9' : [ [ 5, 3, 2, 0, 0, 0 ], [ -1, 0, 2, 4, 1, 0 ], [ -1, 0, 5, 5, 0, 0 ], [ 5, -1, 5, 5, 5, 7 ] ],
      'min11' : [ [ -1, 0, 0, 0, 1, 0 ], [ -1, 7, 7, 7, 8, 8 ] ],
      'min13' : [ [ -1, 0, 2, 0, 1, 2 ], [ 5, 7, 5, 5, 7, 5 ] ],
      'min(maj7)' : [ [ -1, 0, 2, 2, 1, 4 ], [ 5, 7, 6, 5, 5, 5 ] ],
      'sus2' : [ [ -1, 0, 2, 2, 0, 0 ], [ 5, -1, -1, 4, 5, 5 ], [ -1, -1, 7, 9, 10, 7 ], [ -1, 12, 9, 9, 10, -1 ] ],
      'sus4' : [ [ -1, 0, 2, 2, 3, 0 ], [ 5, 7, 7, 7, 5, 5 ], [ -1, 7, 7, 7, 10, 10 ] ],
      'dim' : [ [ -1, 0, 1, 2, 1, 2 ], [ 5, -1, 4, 5, 4, -1 ] ],
      'aug' : [ [ -1, 0, 3, 2, 2, 1 ], [ 5, -1, 7, 6, 6, -1 ], [ -1, -1, 11, 10, 10, 9 ], [ -1, 12, 11, 10, 10, -1 ] ],
      '6/9' : [ [ -1, 0, 4, 4, 2, 0 ], [ 5, 2, 2, 2, 2, 2 ], [ 5, 7, -1, 6, 7, 7 ], [ -1, 9, 9, 9, 10, 9 ] ],
      '7sus4' : [ [ -1, 0, 2, 0, 3, 0 ], [ 5, 7, 5, 7, 5, 5 ] ],
      '7b5' : [ [ -1, 0, 1, 2, 2, 3 ], [ -1, 6, 7, 6, 8, -1 ] ],
      '7b9' : [ [ 5, 4, -1, 3, 5, 3 ], [ 5, 7, 8, 6, 5, 5 ], [ 5, 7, 5, 6, 5, 6 ], [ 0, 12, 11, 12, 11, 12 ] ],
      '9sus4' : [ [ 5, -1, 5, 4, 3, -1 ], [ -1, -1, 7, 7, 8, 7 ], [ -1, 12, -1, 12, 12, 10 ],
          [ -1, 12, 12, 12, 12, 12 ] ],
      'add9' : [ [ -1, 0, 2, 4, 2, 0 ], [ -1, -1, 7, 6, 5, 7 ], [ -1, -1, 9, 9, 10, 9 ], [ -1, 12, 11, 9, 12, -1 ] ],
      'aug9' : [ [ 5, -1, 5, 6, 6, 7 ], [ -1, 10, 9, 10, 10, 11 ] ]
    },
    'A#' : {
      'maj' : [ [ -1, 1, 3, 3, 3, 1 ], [ 6, 5, 3, 3, 3, -1 ], [ -1, -1, 3, 3, 3, 6 ], [ 6, 8, 8, 7, 6, 6 ],
          [ 10, -1, 8, 10, 11, -1 ], [ -1, -1, 8, 10, 11, 10 ], [ -1, 13, 12, 10, 11, 10 ] ],
      '5' : [ [ -1, 1, 3, 3, -1, -1 ], [ -1, -1, 3, 3, 6, 6 ], [ 6, 8, 8, -1, -1, -1 ], [ -1, -1, 8, 10, 11, -1 ] ],
      '6' : [ [ -1, 1, 3, 3, 3, 3 ], [ 6, 5, 3, 3, 3, 3 ], [ 6, -1, 5, 7, 6, -1 ], [ 6, 8, -1, 7, 8, 6 ] ],
      '7' : [ [ -1, 1, 3, 1, 3, 1 ], [ 4, -1, 3, 3, 3, -1 ], [ -1, 1, 3, 3, 3, 4 ], [ 6, 8, 6, 7, 6, 6 ],
          [ 6, 8, -1, 7, 9, -1 ], [ -1, -1, 8, 10, 9, 10 ] ],
      'maj7' : [ [ -1, 1, 3, 2, 3, 1 ], [ -1, -1, 8, 7, 6, 5 ], [ 6, -1, 7, 7, 6, -1 ], [ -1, -1, 8, 10, 10, 10 ] ],
      '9' : [ [ -1, 1, 0, 1, 1, 1 ], [ 6, -1, 6, 5, 3, -1 ], [ 6, 8, 6, 7, 6, 8 ], [ 10, -1, 8, 10, 9, 8 ] ],
      'maj9' : [ [ -1, 1, 0, 2, 1, 1 ], [ 6, -1, 7, 7, -1, 8 ] ],
      '11' : [ [ -1, 1, 1, 1, 3, 1 ], [ 6, 6, 6, 7, 6, 8 ], [ -1, -1, 8, 8, 9, 10 ], [ 10, -1, -1, 10, 9, 11 ] ],
      '13' : [ [ -1, 1, -1, 1, 3, 3 ], [ 6, 8, 6, 7, 8, 6 ], [ 6, -1, 6, 7, 8, 8 ] ],
      'maj13' : [ [ -1, 1, -1, 2, 3, 3 ], [ 6, -1, 7, 7, 8, 8 ] ],
      'min' : [ [ -1, 1, 3, 3, 2, 1 ], [ -1, -1, 3, 6, 6, 6 ], [ -1, 4, 3, 3, 6, -1 ], [ 6, 8, 8, 6, 6, 6 ],
          [ -1, -1, 8, 6, 6, 9 ], [ -1, -1, 8, 10, 11, 9 ], [ -1, 13, 11, 10, 11, -1 ] ],
      'min6' : [ [ -1, 1, 3, 0, 2, -1 ], [ 6, -1, 5, 6, 6, -1 ], [ 6, 8, 8, 6, 8, 6 ], [ -1, -1, 11, 12, 11, 13 ] ],
      'min7' : [ [ -1, 1, 3, 1, 2, 1 ], [ 6, 8, 6, 6, 9, 6 ], [ 6, -1, 6, 6, 6, -1 ], [ -1, -1, 8, 10, 9, 9 ] ],
      'min9' : [ [ 6, -1, 6, 6, 6, 8 ], [ -1, 13, 11, 13, 13, -1 ] ],
      'min11' : [ [ -1, 1, 1, 1, 2, 1 ], [ -1, 8, 8, 8, 9, 9 ] ],
      'min13' : [ [ -1, 1, -1, 1, 2, 3 ], [ 6, 8, 6, 6, 8, 6 ] ],
      'min(maj7)' : [ [ -1, 1, 3, 2, 2, 1 ], [ -1, -1, 8, 10, 10, 9 ] ],
      'sus2' : [ [ -1, 1, 3, 3, 1, 1 ], [ 6, -1, -1, 5, 6, 6 ], [ -1, -1, 8, 10, 11, 8 ], [ -1, 13, 10, 10, 11, -1 ] ],
      'sus4' : [ [ -1, 1, 1, 3, 4, 1 ], [ 6, 8, 8, 8, 6, 6 ], [ -1, 8, 8, 8, 11, 11 ], [ -1, -1, 13, 10, 11, 13 ] ],
      'dim' : [ [ 6, -1, 5, 6, 5, -1 ], [ 6, 7, 8, 6, 8, 6 ] ],
      'aug' : [ [ -1, 1, 0, 3, 3, 2 ], [ 6, -1, 8, 7, 7, -1 ], [ -1, -1, 8, 7, 7, 6 ], [ -1, -1, 8, 7, 7, 10 ] ],
      '6/9' : [ [ -1, 1, 0, 0, 1, 1 ], [ 6, 3, 3, 3, 3, 3 ], [ -1, 5, 5, 5, 6, 6 ], [ -1, 10, 10, 10, 11, 10 ] ],
      '7sus4' : [ [ -1, 1, 3, 1, 4, 1 ], [ -1, -1, 8, 10, 9, 11 ] ],
      '7b5' : [ [ -1, 1, 0, 1, 3, 0 ], [ -1, -1, 8, 9, 9, 10 ] ],
      '7b9' : [ [ -1, 1, 0, 1, 0, 1 ], [ 6, 5, -1, 4, 6, 4 ], [ 6, 8, 9, 7, 6, 6 ], [ 6, 8, 9, 7, -1, -1 ],
          [ 6, 8, 6, 7, 6, 7 ], [ -1, 13, -1, 13, 12, 10 ], [ -1, 13, 12, 13, 12, 13 ] ],
      '9sus4' : [ [ -1, 1, 1, 1, 1, 1 ], [ 6, -1, 6, 5, 4, -1 ], [ 6, 8, 6, 8, 6, 8 ], [ -1, 13, -1, 13, 13, 12 ] ],
      'add9' : [ [ -1, 1, 1, 1, 1, -1 ], [ -1, 1, 3, 5, 3, 1 ], [ -1, -1, 8, 7, 6, 8 ], [ -1, -1, 10, 10, 11, 10 ] ],
      'aug9' : [ [ -1, 1, 0, 1, 1, 2 ], [ 6, -1, 6, 7, 7, 8 ] ]
    },
    'B' : {
      'maj' : [ [ -1, 2, 4, 4, 4, 2 ], [ 7, 6, 4, 4, 4, -1 ], [ -1, -1, 4, 4, 4, 7 ], [ 7, 9, 9, 8, 7, 7 ],
          [ 11, -1, 9, 11, 12, -1 ], [ -1, -1, 9, 11, 12, 11 ] ],
      '5' : [ [ -1, 2, 4, 4, -1, -1 ], [ -1, -1, 4, 4, 7, 7 ], [ 7, 9, 9, -1, -1, -1 ], [ -1, -1, 9, 11, 12, -1 ] ],
      '6' : [ [ 2, 2, 1, 1, 0, -1 ], [ -1, 2, 4, 4, 4, 4 ], [ 7, -1, 6, 8, 7, -1 ], [ 7, 9, -1, 8, 9, 7 ] ],
      '7' : [ [ -1, 2, 1, 2, 0, 2 ], [ -1, 2, 4, 4, 4, 5 ], [ -1, 2, 4, 2, 4, 2 ], [ 7, 9, 7, 8, 7, 7 ],
          [ 7, 9, 7, 8, 10, 7 ], [ -1, -1, 9, 11, 10, 11 ] ],
      'maj7' : [ [ 2, 2, 1, 3, 0, -1 ], [ -1, 2, 4, 3, 4, 2 ], [ -1, -1, 9, 8, 7, 6 ], [ 7, -1, 8, 8, 7, -1 ] ],
      '9' : [ [ -1, 2, 1, 2, 2, 2 ], [ 7, -1, 7, 6, 4, -1 ], [ 7, 6, 7, 6, -1, -1 ], [ 7, 9, 7, 8, 7, 9 ] ],
      'maj9' : [ [ -1, 2, 1, 3, 2, 2 ], [ 7, -1, 8, 8, -1, 9 ] ],
      '11' : [ [ -1, 2, 1, 2, 2, 0 ], [ -1, 1, 1, 1, 3, 1 ], [ 7, 7, 7, 8, 7, 9 ], [ -1, -1, 9, 9, 10, 11 ] ],
      '13' : [ [ -1, 2, 1, 2, 2, 4 ], [ -1, 2, -1, 2, 4, 4 ], [ 7, -1, 7, 8, 9, -1 ], [ -1, 12, 13, 13, 12, -1 ] ],
      'maj13' : [ [ -1, 2, -1, 3, 4, 4 ], [ 7, -1, 8, 8, 9, -1 ] ],
      'min' : [ [ -1, 2, 4, 4, 3, 2 ], [ -1, 5, 4, 4, 3, -1 ], [ -1, 5, 4, 4, 7, -1 ], [ 7, 9, 9, 7, 7, 7 ],
          [ -1, 9, 12, 11, 12, -1 ], [ -1, -1, 9, 11, 12, 10 ], [ 10, -1, 9, 11, 12, -1 ] ],
      'min6' : [ [ -1, 2, -1, 1, 3, 2 ], [ -1, 2, 4, -1, 3, 4 ], [ 7, -1, 6, 7, 7, 7 ], [ 7, 9, 9, 7, 9, 7 ] ],
      'min7' : [ [ -1, 2, 0, 2, 0, 2 ], [ -1, 2, 4, 2, 3, 2 ], [ 7, -1, 7, 7, 7, -1 ], [ 7, 9, 7, 7, 10, 7 ] ],
      'min9' : [ [ -1, 2, 0, 2, 2, 2 ], [ 7, -1, 7, 7, 7, 10 ] ],
      'min11' : [ [ -1, 2, 2, 2, 3, 2 ], [ 7, 7, 7, 7, 7, 7 ] ],
      'min13' : [ [ -1, 2, -1, 2, 3, 4 ], [ 7, 9, 7, 7, 9, 7 ] ],
      'min(maj7)' : [ [ -1, 2, -1, 3, 3, 2 ], [ 7, 9, 8, 7, 7, 7 ] ],
      'sus2' : [ [ -1, 2, 4, 4, 2, 2 ], [ 7, -1, -1, 6, 7, 7 ], [ -1, -1, 9, 11, 12, 9 ], [ -1, 14, 11, 11, 12, -1 ] ],
      'sus4' : [ [ -1, 2, 4, 4, 5, 2 ], [ 7, 9, 9, 9, 7, 7 ], [ -1, -1, 9, 9, 7, 7 ], [ -1, -1, 9, 11, 12, 12 ] ],
      'dim' : [ [ -1, 2, 3, 1, 3, -1 ], [ 7, 8, 9, 7, 9, 7 ] ],
      'aug' : [ [ -1, 2, 1, 0, 0, 3 ], [ 7, -1, 9, 8, 8, -1 ], [ -1, -1, 9, 8, 8, 7 ], [ -1, -1, 9, 8, 8, 11 ] ],
      '6/9' : [ [ -1, 2, 1, 1, 2, 2 ], [ 7, 4, 4, 4, 4, 4 ], [ 7, 6, 6, 6, 7, -1 ], [ 7, 9, -1, 8, 9, 9 ] ],
      '7sus4' : [ [ -1, 2, 4, 2, 5, 2 ], [ 7, 9, 7, 9, 7, 7 ] ],
      '7b5' : [ [ -1, 2, 3, 2, 4, -1 ], [ 7, 8, 7, 8, -1, -1 ] ],
      '7b9' : [ [ -1, 2, 1, 2, 1, 2 ], [ 7, 6, -1, 5, 7, 5 ], [ 7, 9, 10, 8, 7, 7 ], [ 7, 9, 7, 8, 7, 8 ] ],
      '9sus4' : [ [ -1, 2, 2, 2, 2, 2 ], [ 7, -1, 7, 6, 5, -1 ], [ -1, 9, 9, 9, 10, 9 ] ],
      'add9' : [ [ -1, 4, 4, 4, 4, -1 ], [ -1, 2, 4, 6, 4, 2 ], [ -1, -1, 9, 8, 7, 9 ], [ -1, -1, 11, 11, 12, 11 ] ],
      'aug9' : [ [ -1, 2, 1, 2, 2, 3 ], [ 7, -1, 7, 8, 8, 9 ] ]
    },
    'C' : {
      'maj' : [ [ -1, 3, 2, 0, 1, 0 ], [ 3, 3, 2, 0, 1, 0 ], [ 3, 3, 5, 5, 5, 3 ], [ 8, 7, 5, 5, 5, -1 ],
          [ -1, -1, 5, 5, 5, 8 ], [ 8, 10, 10, 9, 8, 8 ], [ 12, -1, 10, 12, 13, -1 ] ],
      '5' : [ [ -1, 3, 5, 5, -1, -1 ], [ -1, -1, 5, 5, 8, 8 ], [ 8, 10, 10, -1, -1, -1 ], [ -1, -1, 10, 12, 13, -1 ] ],
      '6' : [ [ 3, -1, 2, 2, 1, -1 ], [ -1, 3, 5, 5, 5, 5 ], [ 8, -1, 7, 9, 8, -1 ], [ 8, 10, -1, 9, 10, 8 ] ],
      '7' : [ [ -1, 3, 2, 3, 1, 0 ], [ -1, 3, 5, 3, 5, 3 ], [ 8, 10, -1, 9, 11, -1 ], [ 8, 10, 8, 9, 8, 8 ],
          [ 12, -1, 10, 12, 11, -1 ], [ -1, -1, 10, 12, 11, 12 ] ],
      'maj7' : [ [ -1, 3, 2, 0, 0, 0 ], [ -1, 3, 5, 4, 5, 3 ], [ -1, -1, 10, 9, 8, 7 ], [ 8, 10, -1, 9, 12, 12 ] ],
      '9' : [ [ -1, 3, 2, 3, 3, 3 ], [ 8, -1, 8, 7, 5, -1 ], [ 8, 10, 8, 9, 8, 10 ], [ -1, -1, 10, 9, 11, 10 ] ],
      'maj9' : [ [ -1, 3, 5, 4, 3, 0 ], [ -1, 7, 10, 7, 8, 7 ] ],
      '11' : [ [ -1, 3, 2, 3, 1, 1 ], [ -1, 3, 3, 3, 5, 3 ], [ -1, 7, -1, 5, 6, 6 ], [ -1, -1, 10, 10, 11, 12 ] ],
      '13' : [ [ -1, 1, 2, 2, 1, -1 ], [ 8, -1, 8, 7, 5, 5 ], [ -1, -1, 8, 9, 10, 7 ], [ 8, -1, 8, 9, 10, -1 ] ],
      'maj13' : [ [ -1, 3, -1, 4, 5, 5 ], [ 8, 7, 7, 7, 8, 7 ] ],
      'min' : [ [ -1, 3, 1, 0, 1, -1 ], [ -1, 3, 5, 5, 4, 3 ], [ -1, 6, 5, 5, 4, -1 ], [ -1, -1, 5, 8, 8, 8 ],
          [ -1, 6, 5, 5, 8, -1 ], [ 8, 10, 10, 8, 8, 8 ], [ 11, -1, 10, 12, 13, -1 ] ],
      'min6' : [ [ -1, 0, 1, 0, 1, 3 ], [ -1, 3, -1, 2, 4, 3 ], [ 8, -1, 7, 8, 8, -1 ], [ 8, 10, 10, 8, 10, 8 ] ],
      'min7' : [ [ -1, -1, 1, 3, 1, 3 ], [ -1, 3, 5, 3, 4, 3 ], [ 8, -1, 8, 8, 8, -1 ], [ 11, -1, 10, 12, 11, -1 ] ],
      'min9' : [ [ -1, 3, 1, 3, 3, -1 ], [ -1, 6, 8, 7, 8, 8 ] ],
      'min11' : [ [ -1, 3, 3, 3, 4, 3 ], [ 8, -1, 8, 8, 6, -1 ] ],
      'min13' : [ [ -1, 3, -1, 3, 4, 5 ], [ 8, 10, 8, 8, 10, 8 ] ],
      'min(maj7)' : [ [ -1, 3, 5, 4, 4, 3 ], [ 8, -1, 9, 8, 8, -1 ] ],
      'sus2' : [ [ -1, 3, 0, 0, 1, 3 ], [ -1, 3, 5, 7, -1, -1 ], [ -1, 5, 5, 5, 8, 8 ], [ -1, -1, 10, 7, 8, 10 ] ],
      'sus4' : [ [ -1, 3, 3, 0, 1, -1 ], [ -1, 3, 5, 5, 6, 3 ], [ 8, 10, 10, 10, 8, 8 ] ],
      'dim' : [ [ -1, -1, 1, 2, 1, 2 ], [ -1, 3, -1, 2, 4, 2 ] ],
      'aug' : [ [ -1, 3, 2, 1, 1, -1 ], [ -1, 3, -1, 5, 5, 4 ], [ -1, -1, 6, 5, 5, 8 ], [ -1, -1, 10, 9, 9, 8 ] ],
      '6/9' : [ [ -1, 3, 2, 2, 3, 3 ], [ 8, -1, 5, 7, 5, 5 ], [ -1, 7, 7, 7, 8, 8 ], [ -1, 10, 10, 9, 10, 10 ] ],
      '7sus4' : [ [ 3, -1, 3, 3, 1, -1 ], [ -1, 3, 5, 3, 6, 3 ] ],
      '7b5' : [ [ -1, 3, 4, 3, 5, -1 ], [ 8, -1, 8, 9, 7, -1 ] ],
      '7b9' : [ [ -1, 3, 2, 3, 2, 0 ], [ -1, 5, 4, 5, 4, 5 ], [ 8, 7, -1, 6, 8, 6 ], [ 8, 10, 11, 9, 8, 8 ],
          [ 8, 10, 8, 9, 8, 9 ], [ -1, -1, 10, 9, 11, 9 ] ],
      '9sus4' : [ [ -1, 3, -1, 3, 3, 1 ], [ -1, 3, 3, 3, 3, 3 ], [ 8, -1, 8, 7, 6, -1 ], [ -1, 10, 10, 10, 11, 10 ] ],
      'add9' : [ [ -1, 3, 2, 0, 3, 3 ], [ -1, 3, 5, 7, 5, 3 ], [ -1, 5, 5, 5, 5, -1 ], [ -1, 7, -1, 7, 8, 8 ] ],
      'aug9' : [ [ 0, 1, 0, 1, 1, 0 ], [ 8, 7, 8, 7, 9, -1 ] ]
    },
    'C#' : {
      'maj' : [ [ -1, 4, 3, 1, 2, 1 ], [ -1, 4, 6, 6, 6, 4 ], [ 9, 8, 6, 6, 6, -1 ], [ -1, -1, 6, 6, 6, 9 ],
          [ 9, 11, 11, 10, 9, 9 ] ],
      '5' : [ [ -1, -1, -1, 1, 2, 4 ], [ -1, 4, 6, 6, -1, -1 ], [ -1, -1, 6, 6, 9, 9 ], [ 9, 11, 11, -1, -1, -1 ] ],
      '6' : [ [ -1, -1, 3, 3, 2, 4 ], [ -1, 4, 6, 6, 6, 6 ], [ 9, -1, 8, 10, 9, -1 ], [ -1, -1, 11, 13, 11, 13 ] ],
      '7' : [ [ -1, 4, 3, 4, 2, -1 ], [ -1, 4, 6, 4, 6, 4 ], [ -1, 4, 6, 6, 6, 7 ], [ 9, 11, 9, 10, 9, 9 ] ],
      'maj7' : [ [ -1, 4, 3, 1, 1, 1 ], [ -1, 4, 6, 5, 6, 4 ], [ -1, -1, 11, 10, 9, 8 ], [ 9, -1, 10, 10, 9, -1 ] ],
      '9' : [ [ -1, 4, 3, 4, 4, 4 ], [ 9, -1, 9, 8, 6, -1 ], [ 9, 8, 9, 8, -1, -1 ], [ 9, 11, 9, 10, 9, 11 ] ],
      'maj9' : [ [ -1, 4, 1, 1, 1, 1 ], [ 9, -1, 10, 10, -1, 11 ] ],
      '11' : [ [ -1, 4, 3, 4, 2, 2 ], [ -1, 4, 4, 4, 6, 4 ], [ 9, -1, 9, 10, 7, -1 ], [ -1, 9, 9, 10, 9, 9 ] ],
      '13' : [ [ -1, 4, 3, 4, 4, 6 ], [ 9, -1, 9, 8, 6, 6 ], [ -1, -1, 9, 10, 11, 9 ], [ 9, -1, 9, 10, 11, -1 ] ],
      'maj13' : [ [ -1, 4, -1, 5, 6, 6 ], [ 9, 8, 8, 8, 9, 8 ] ],
      'min' : [ [ -1, 4, 2, 1, 2, -1 ], [ -1, -1, 2, 1, 2, 0 ], [ -1, 4, 6, 6, 5, 4 ], [ -1, 7, 6, 6, 9, -1 ],
          [ 9, 11, 11, 9, 9, 9 ], [ -1, -1, 11, 9, 9, 12 ] ],
      'min6' : [ [ -1, 4, -1, 3, 5, 4 ], [ -1, 4, 2, 3, 2, 4 ], [ 9, -1, 8, 9, 9, -1 ], [ 9, 11, 11, 9, 11, 9 ] ],
      'min7' : [ [ -1, 4, 2, 1, 0, 0 ], [ -1, 4, -1, 4, 5, 4 ], [ 9, -1, 9, 9, 9, -1 ], [ 9, 11, 9, 9, 12, 9 ] ],
      'min9' : [ [ -1, 4, 2, 4, 4, -1 ], [ 9, -1, 9, 9, 9, 11 ] ],
      'min11' : [ [ -1, 4, 1, 4, 4, 1 ], [ -1, 4, 4, 4, 5, 4 ] ],
      'min13' : [ [ -1, 1, -1, 1, 2, 3 ], [ 9, 11, 9, 9, 11, 9 ] ],
      'min(maj7)' : [ [ -1, 4, 6, 5, 5, 4 ], [ 9, 11, 10, 9, 9, 9 ] ],
      'sus2' : [ [ -1, -1, 1, 1, 2, -1 ], [ -1, 4, 6, 6, 4, 4 ], [ -1, 6, 6, 6, 9, 9 ], [ 9, -1, -1, 8, 10, -1 ] ],
      'sus4' : [ [ -1, 4, 6, 6, 7, -1 ], [ -1, -1, 6, 6, 4, 7 ], [ -1, 4, 6, 6, 7, 4 ], [ 9, 11, 11, 11, 9, 9 ] ],
      'dim' : [ [ -1, -1, 2, 3, 2, 3 ], [ 9, -1, 8, 9, 8, -1 ] ],
      'aug' : [ [ -1, 4, 3, 2, 2, -1 ], [ -1, 4, -1, 6, 6, 5 ], [ -1, -1, 7, 6, 6, 9 ], [ -1, -1, 11, 10, 10, 9 ] ],
      '6/9' : [ [ -1, 1, 1, 1, 2, 1 ], [ 9, -1, 6, 8, 6, 6 ], [ 9, 8, 8, 8, 9, 9 ], [ -1, 11, 11, 10, 11, 11 ] ],
      '7sus4' : [ [ 4, -1, 4, 4, 2, -1 ], [ -1, 4, 6, 4, 7, 4 ] ],
      '7b5' : [ [ 3, -1, 3, 4, 2, -1 ], [ 9, -1, 9, 10, 8, -1 ] ],
      '7b9' : [ [ -1, 4, -1, 4, 3, 1 ], [ -1, 4, 3, 4, 3, 4 ], [ -1, 4, 3, 4, 3, -1 ], [ 9, 8, -1, 7, 9, 7 ],
          [ 9, 11, 12, 10, 9, 9 ], [ 9, 11, 9, 10, 9, 10 ] ],
      '9sus4' : [ [ -1, 4, -1, 4, 4, 2 ], [ -1, 4, 4, 4, 4, 4 ], [ 9, -1, 9, 8, 7, -1 ], [ -1, 11, 11, 11, 12, 11 ] ],
      'add9' : [ [ -1, 4, 3, 1, 4, -1 ], [ -1, 4, 6, 8, 6, -1 ], [ -1, 6, 6, 6, 6, -1 ], [ -1, 8, -1, 8, 9, 9 ] ],
      'aug9' : [ [ -1, 4, 3, 4, 4, 5 ], [ 9, 8, 9, 8, 10, -1 ] ]
    },
    'D' : {
      'maj' : [ [ -1, -1, 0, 2, 3, 2 ], [ -1, -1, 4, 2, 4, 5 ], [ -1, 5, 4, 2, 3, 2 ], [ -1, 5, 7, 7, 7, 5 ],
          [ 10, 9, 7, 7, 7, -1 ], [ -1, -1, 7, 7, 7, 10 ], [ 10, 12, 12, 11, 10, 10 ] ],
      '5' : [ [ -1, -1, 0, 2, 3, -1 ], [ -1, 5, 7, 7, -1, -1 ], [ -1, -1, 7, 7, 10, 10 ], [ 10, 12, 12, -1, -1, -1 ] ],
      '6' : [ [ -1, -1, 0, 2, 0, 2 ], [ -1, 5, 7, 7, 7, 7 ], [ 10, -1, 9, 11, 10, -1 ], [ 10, 12, -1, 11, 12, 10 ] ],
      '7' : [ [ -1, -1, 0, 2, 1, 2 ], [ -1, 5, 4, 5, 3, -1 ], [ -1, -1, 4, 5, 3, 5 ], [ -1, 5, 7, 7, 7, 8 ],
          [ -1, 5, 7, 5, 7, 5 ], [ 10, 12, 10, 11, 10, 10 ] ],
      'maj7' : [ [ -1, 5, 4, 2, 2, 2 ], [ -1, 5, 7, 6, 7, 5 ], [ -1, -1, 7, 7, 7, 9 ], [ -1, -1, 12, 11, 10, 9 ] ],
      '9' : [ [ -1, 5, 4, 2, 1, 0 ], [ -1, 5, 4, 5, 5, 5 ], [ 10, -1, 10, 9, 7, -1 ], [ 10, 12, 10, 11, 10, 12 ] ],
      'maj9' : [ [ -1, 5, 2, 2, 2, 2 ], [ 10, -1, 11, 11, -1, 12 ] ],
      '11' : [ [ -1, -1, 0, 0, 1, 2 ], [ -1, 5, 4, 5, 3, 3 ], [ -1, 5, 5, 5, 7, 5 ], [ -1, 9, -1, 7, 8, 8 ] ],
      '13' : [ [ -1, 3, 4, 4, 3, -1 ], [ -1, 5, -1, 5, 7, 7 ], [ -1, -1, 10, 7, 7, 7 ], [ 10, -1, 10, 11, 12, 12 ] ],
      'maj13' : [ [ -1, 5, -1, 6, 7, 7 ], [ 10, 9, 9, 9, 10, 9 ] ],
      'min' : [ [ -1, -1, 0, 2, 3, 1 ], [ -1, 5, 3, 2, 3, -1 ], [ -1, 5, 7, 7, 6, 5 ], [ -1, 8, 7, 7, 6, -1 ],
          [ -1, 8, 7, 7, 10, -1 ], [ -1, -1, 7, 10, 10, 10 ], [ 10, 12, 12, 10, 10, 10 ] ],
      'min6' : [ [ -1, -1, 0, 2, 0, 1 ], [ -1, 5, 3, 4, 3, 5 ], [ -1, 5, 7, -1, 6, 8 ], [ 10, -1, 9, 10, 10, -1 ] ],
      'min7' : [ [ -1, -1, 0, 2, 1, 1 ], [ -1, 5, 7, 5, 6, 5 ], [ -1, -1, 7, 7, 6, 8 ], [ 10, -1, 10, 10, 10, -1 ] ],
      'min9' : [ [ -1, 5, 3, 5, 5, -1 ], [ 10, -1, 10, 10, 10, 12 ] ],
      'min11' : [ [ -1, -1, 0, 0, 1, 1 ], [ -1, 5, 5, 5, 6, 5 ] ],
      'min13' : [ [ -1, -1, 0, 4, 1, 1 ], [ 10, 12, 10, 10, 12, 10 ] ],
      'min(maj7)' : [ [ -1, -1, 0, 2, 2, 1 ], [ -1, 5, 7, 6, 6, 5 ] ],
      'sus2' : [ [ -1, -1, 0, 2, 3, 0 ], [ -1, 5, 7, 7, 5, 5 ], [ -1, 7, 7, 9, 10, 10 ], [ -1, -1, 12, 9, 10, 12 ] ],
      'sus4' : [ [ -1, -1, 0, 2, 3, 3 ], [ -1, 5, 7, 7, 8, 5 ], [ -1, -1, 7, 7, 8, 10 ], [ 10, 12, 12, 12, 10, 10 ] ],
      'dim' : [ [ -1, -1, 0, 1, 0, 1 ], [ -1, 5, -1, 4, 6, 4 ] ],
      'aug' : [ [ -1, -1, 0, 3, 3, 2 ], [ -1, 5, 4, 3, 3, -1 ], [ -1, 5, -1, 7, 7, 6 ], [ -1, -1, 8, 7, 7, 10 ] ],
      '6/9' : [ [ -1, 5, 4, 2, 0, 0 ], [ -1, 5, 4, 4, 5, 5 ], [ 10, -1, 7, 9, 7, 7 ], [ -1, 9, 9, 9, 10, 10 ] ],
      '7sus4' : [ [ -1, -1, 0, 2, 1, 3 ], [ 10, 12, 10, 12, 13, 10 ] ],
      '7b5' : [ [ -1, -1, 0, 1, 1, 2 ], [ -1, 5, 6, 5, 7, -1 ] ],
      '7b9' : [ [ -1, -1, 0, 5, 4, 2 ], [ -1, 5, 4, 5, 4, 5 ], [ -1, 5, 4, 5, 4, -1 ], [ 10, 9, -1, 8, 10, 8 ],
          [ 10, 12, 13, 11, 10, 10 ], [ 10, 12, 10, 11, 10, 11 ], [ -1, -1, 12, 11, 13, 11 ] ],
      '9sus4' : [ [ -1, 5, -1, 5, 5, 3 ], [ -1, 5, 5, 5, 5, 5 ], [ 10, -1, 10, 9, 8, -1 ], [ -1, 12, 12, 12, 13, 12 ] ],
      'add9' : [ [ -1, -1, 4, 2, 3, 0 ], [ 5, -1, 4, 7, 5, -1 ], [ -1, 7, 7, 7, 7, -1 ], [ -1, 9, -1, 9, 10, 10 ] ],
      'aug9' : [ [ 2, 3, 2, 3, 3, 2 ], [ 10, 9, 10, 9, 11, -1 ] ]
    },
    'D#' : {
      'maj' : [ [ -1, -1, 1, 3, 4, 3 ], [ -1, 6, 5, 3, 4, 3 ], [ -1, -1, 5, 3, 4, 6 ], [ -1, 6, 8, 8, 8, 6 ],
          [ -1, -1, 8, 8, 8, 11 ], [ 11, 10, 8, 8, 8, -1 ], [ 11, 13, 13, 12, 11, 11 ] ],
      '5' : [ [ -1, -1, 1, 3, 4, -1 ], [ -1, 6, 8, 8, -1, -1 ], [ -1, -1, 8, 8, 11, 11 ], [ 11, 13, 13, -1, -1, -1 ] ],
      '6' : [ [ -1, -1, 1, 3, 1, 3 ], [ -1, 6, 8, 8, 8, 8 ], [ -1, 10, 10, 8, 11, -1 ], [ 11, -1, 10, 12, 11, -1 ] ],
      '7' : [ [ -1, -1, 1, 3, 2, 3 ], [ -1, 4, -1, 3, 4, 3 ], [ -1, 6, 8, 6, 8, 6 ], [ -1, 6, 8, 8, 8, 9 ],
          [ -1, 10, 11, 8, 11, -1 ], [ 11, 13, 11, 12, 11, 11 ] ],
      'maj7' : [ [ -1, -1, 1, 3, 3, 3 ], [ -1, 6, 5, 3, 3, 3 ], [ -1, 6, 8, 7, 8, 6 ], [ -1, -1, 13, 12, 11, 10 ] ],
      '9' : [ [ -1, -1, 1, 0, 2, 1 ], [ -1, 6, 5, 6, 6, 6 ], [ -1, -1, 10, 9, 8, 10 ], [ 11, 13, 11, 12, 11, 13 ] ],
      'maj9' : [ [ -1, -1, 1, 0, 3, 1 ], [ -1, 6, 3, 3, 3, 3 ] ],
      '11' : [ [ -1, -1, 1, 1, 2, 3 ], [ 4, 4, 5, 6, 4, 4 ], [ -1, 6, 5, 6, 4, 4 ], [ -1, 6, 6, 6, 8, 6 ] ],
      '13' : [ [ -1, 4, 5, 5, 4, -1 ], [ -1, 6, 5, 6, 6, 8 ], [ -1, -1, 11, 8, 8, 8 ], [ 11, -1, 11, 12, 13, -1 ] ],
      'maj13' : [ [ -1, 2, 1, 3, 4, 4 ], [ 11, 10, 10, 10, 11, 10 ] ],
      'min' : [ [ 2, -1, 1, 3, 4, -1 ], [ -1, 1, 4, 3, 4, -1 ], [ -1, 6, 4, 3, 4, -1 ], [ -1, 6, 8, 8, 7, 6 ],
          [ -1, 9, 8, 8, 7, -1 ], [ -1, -1, 8, 11, 11, 11 ], [ 11, 13, 13, 11, 11, 11 ] ],
      'min6' : [ [ -1, -1, 1, 3, 1, 2 ], [ -1, 3, 4, 3, 4, -1 ], [ -1, 6, -1, 5, 7, 6 ], [ 11, -1, 10, 11, 11, -1 ] ],
      'min7' : [ [ -1, -1, 1, 3, 2, 2 ], [ -1, 4, 4, 3, 4, -1 ], [ -1, 6, 8, 6, 7, 6 ], [ 11, -1, 11, 11, 11, -1 ] ],
      'min9' : [ [ 2, -1, 1, 3, 2, 1 ], [ 11, -1, 11, 11, 11, 13 ] ],
      'min11' : [ [ -1, 1, 1, 1, 2, 2 ], [ 11, 11, 11, 11, 11, 11 ] ],
      'min13' : [ [ -1, 6, -1, 6, 7, 8 ], [ 11, 13, 11, 11, 13, 11 ] ],
      'min(maj7)' : [ [ -1, -1, 1, 3, 3, 2 ], [ -1, 6, 8, 7, 7, 6 ] ],
      'sus2' : [ [ -1, -1, 1, 3, 4, 1 ], [ -1, 6, 8, 8, 6, 6 ], [ -1, 8, 8, 10, 11, 11 ], [ 11, -1, 8, 10, 11, -1 ] ],
      'sus4' : [ [ -1, -1, 1, 3, 4, 4 ], [ -1, -1, 8, 8, 9, 6 ], [ -1, 6, 8, 8, 9, 6 ], [ 11, 13, 13, 13, 11, 11 ] ],
      'dim' : [ [ -1, -1, 1, 2, 1, 2 ], [ -1, 6, 7, 5, 7, -1 ] ],
      'aug' : [ [ -1, -1, 1, 0, 0, 3 ], [ -1, -1, 5, 4, 4, 3 ], [ -1, 6, 5, 4, 4, -1 ], [ -1, 6, -1, 8, 8, 7 ] ],
      '6/9' : [ [ -1, 3, 3, 3, 4, 3 ], [ -1, 6, 5, 5, 6, 6 ], [ 11, 8, 8, 8, 8, 8 ], [ 11, -1, 8, 10, 8, 8 ] ],
      '7sus4' : [ [ -1, -1, 1, 1, 2, -1 ], [ -1, 6, 8, 6, 9, -1 ] ],
      '7b5' : [ [ -1, -1, 1, 2, 2, 3 ], [ -1, 6, 7, 6, 8, -1 ] ],
      '7b9' : [ [ -1, 6, -1, 6, 5, 3 ], [ -1, 6, 5, 6, 5, 6 ], [ -1, 6, 5, 6, 5, -1 ], [ 11, 10, -1, 9, 11, 9 ],
          [ 11, 13, 11, 12, 11, 12 ], [ 11, 13, 14, 12, 11, 11 ], [ 11, 13, 14, 12, -1, -1 ] ],
      '9sus4' : [ [ -1, -1, 1, 1, 2, 1 ], [ -1, 6, -1, 6, 6, 4 ], [ -1, 6, 6, 6, 6, 6 ], [ 11, -1, 11, 10, 9, -1 ] ],
      'add9' : [ [ -1, -1, 3, 3, 4, 3 ], [ -1, 6, 5, 3, 6, -1 ], [ -1, 8, 8, 8, 8, -1 ], [ -1, 10, -1, 10, 11, 11 ] ],
      'aug9' : [ [ 3, 4, 3, 4, 4, 3 ], [ 11, 10, 11, 10, 12, -1 ] ]
    },
    'E' : {
      'maj' : [ [ 0, 2, 2, 1, 0, 0 ], [ 0, 2, 2, 4, 5, 4 ], [ -1, 7, 6, 4, 5, 4 ], [ -1, -1, 6, 4, 5, 7 ],
          [ -1, 7, 9, 9, 9, 7 ], [ 12, 11, 9, 9, 9, -1 ], [ -1, -1, 9, 9, 9, 12 ] ],
      '5' : [ [ 0, 2, 2, -1, -1, -1 ], [ -1, -1, 2, 4, 5, -1 ], [ -1, 7, 9, 9, -1, -1 ], [ -1, -1, 9, 9, 12, 12 ] ],
      '6' : [ [ -1, -1, 2, 4, 2, 4 ], [ 0, 2, 2, 1, 2, 0 ], [ -1, 7, 9, 9, 9, 9 ], [ -1, 11, 11, 9, 12, -1 ] ],
      '7' : [ [ 0, 2, 0, 1, 0, 0 ], [ 0, 2, 2, 1, 3, 0 ], [ 4, -1, 2, 4, 3, -1 ], [ -1, 7, 6, 7, 5, -1 ],
          [ -1, 7, 9, 7, 9, 7 ], [ -1, 7, 9, 9, 9, 10 ] ],
      'maj7' : [ [ 0, 2, 1, 1, 0, 0 ], [ -1, 7, 6, 4, 4, 4 ], [ -1, -1, 9, 9, 9, 11 ] ],
      '9' : [ [ 4, -1, 2, 4, 3, 2 ], [ 0, 2, 0, 1, 0, 2 ], [ -1, 7, 6, 7, 7, 7 ], [ 12, -1, 12, 11, 9, -1 ] ],
      'maj9' : [ [ 0, 2, 4, 4, 4, 4 ], [ -1, 7, 4, 4, 4, 4 ] ],
      '11' : [ [ 0, 0, 2, 1, 3, 2 ], [ -1, -1, 2, 2, 3, 4 ], [ -1, 7, 6, 7, 5, 5 ], [ -1, 7, 7, 7, 9, 7 ] ],
      '13' : [ [ 0, 2, 0, 1, 2, 2 ], [ -1, 5, 6, 6, 5, -1 ], [ -1, 7, -1, 7, 9, 9 ] ],
      'maj13' : [ [ 0, 2, 1, 1, 2, 2 ], [ 12, 11, 11, 11, 12, 11 ] ],
      'min' : [ [ 0, 2, 2, 0, 0, 0 ], [ -1, -1, 2, 4, 5, 3 ], [ -1, -1, 5, 4, 5, 3 ], [ -1, 7, 5, 4, 5, -1 ],
          [ -1, 7, 9, 9, 8, 7 ], [ -1, 10, 9, 9, 8, -1 ], [ -1, -1, 9, 12, 12, 12 ] ],
      'min6' : [ [ 0, 2, 2, 0, 2, 0 ], [ -1, 7, 5, 6, 5, 7 ], [ -1, 7, -1, 6, 8, 7 ], [ 12, -1, 11, 12, 12, -1 ] ],
      'min7' : [ [ 0, 2, 0, 0, 0, 0 ], [ 0, 2, 2, 0, 3, 0 ], [ -1, 7, 9, 7, 8, 7 ], [ -1, 7, -1, 7, 8, 7 ] ],
      'min9' : [ [ 0, 2, 0, 0, 0, 2 ], [ -1, 7, 5, 7, 7, -1 ] ],
      'min11' : [ [ 0, 0, 0, 0, 0, 0 ], [ -1, 7, 7, 7, 8, 7 ] ],
      'min13' : [ [ 0, 2, 0, 0, 2, 2 ], [ -1, 7, -1, 7, 8, 9 ] ],
      'min(maj7)' : [ [ 0, 2, 1, 0, 0, 0 ], [ -1, 7, 5, 4, 4, -1 ] ],
      'sus2' : [ [ -1, -1, 2, 4, 5, 2 ], [ -1, -1, 4, 4, 5, 7 ], [ -1, 7, 9, 9, 7, 7 ], [ -1, 9, 9, 9, 12, 12 ] ],
      'sus4' : [ [ 0, 2, 2, 2, 0, 0 ], [ -1, -1, 2, 4, 5, 5 ], [ -1, 7, 7, 9, 10, 7 ], [ -1, 7, 9, 9, 10, -1 ] ],
      'dim' : [ [ -1, -1, 2, 3, 2, 3 ], [ 12, -1, 11, 12, 11, -1 ] ],
      'aug' : [ [ -1, -1, 2, 1, 1, 0 ], [ 4, -1, -1, 5, 5, 4 ], [ -1, 7, 6, 5, 5, -1 ], [ -1, 7, -1, 9, 9, 8 ] ],
      '6/9' : [ [ 0, 2, -1, 1, 2, 2 ], [ -1, 4, 4, 4, 5, 4 ], [ -1, 11, 11, 11, 12, 12 ], [ 12, 11, 11, 11, 12, 12 ] ],
      '7sus4' : [ [ -1, 2, 2, 2, 3, -1 ], [ -1, 7, 9, 7, 10, -1 ] ],
      '7b5' : [ [ -1, -1, 2, 3, 3, 4 ], [ -1, 7, 8, 7, 9, -1 ] ],
      '7b9' : [ [ 0, 2, 3, 1, 3, -1 ], [ -1, 7, 6, 7, 6, 7 ], [ -1, 7, 6, 7, 6, -1 ], [ 12, 11, -1, 10, 13, 10 ],
          [ 12, 14, 15, 13, 12, 12 ], [ 12, 14, 12, 13, 12, 13 ] ],
      '9sus4' : [ [ -1, 2, 2, 2, 3, 2 ], [ -1, 7, -1, 7, 7, 5 ], [ -1, 7, 7, 7, 7, 7 ], [ 12, -1, 12, 11, 10, -1 ] ],
      'add9' : [ [ -1, -1, 4, 4, 5, 4 ], [ 0, 2, 2, 1, 0, 2 ], [ 7, -1, 6, 9, 7, -1 ], [ -1, 9, 9, 9, 9, -1 ] ],
      'aug9' : [ [ 0, 3, 0, 1, 1, 2 ], [ -1, 7, 6, 7, 7, 8 ] ]
    },
    'F' : {
      'maj' : [ [ 1, 3, 3, 2, 1, 1 ], [ 5, -1, 3, 5, 6, -1 ], [ -1, 8, 7, 5, 6, 5 ], [ 8, -1, 7, 5, 6, -1 ],
          [ -1, -1, 7, 5, 6, 8 ], [ -1, 8, 10, 10, 10, 8 ], [ -1, -1, 10, 10, 10, 13 ] ],
      '5' : [ [ 1, 3, 3, -1, -1, -1 ], [ -1, -1, 3, 5, 6, -1 ], [ -1, 8, 10, 10, -1, -1 ], [ -1, -1, 10, 10, 13, 13 ] ],
      '6' : [ [ 1, 3, -1, 2, 3, -1 ], [ -1, -1, 3, 5, 3, 5 ], [ -1, 8, 10, 7, 10, -1 ], [ -1, 12, 12, 10, 13, -1 ] ],
      '7' : [ [ 1, 3, 1, 2, 1, 1 ], [ 1, 3, -1, 2, 4, -1 ], [ -1, -1, 3, 5, 4, 5 ], [ -1, 8, 7, 8, 6, -1 ],
          [ -1, 8, 10, 8, 10, 8 ], [ -1, 8, 10, 10, 10, 11 ] ],
      'maj7' : [ [ 1, -1, 2, 2, 1, -1 ], [ -1, -1, 3, 5, 5, 5 ], [ -1, 8, 7, 5, 5, 5 ], [ -1, 8, 10, 9, 10, 8 ] ],
      '9' : [ [ 1, 3, 1, 2, 1, 3 ], [ -1, 8, 7, 8, 8, 8 ], [ 13, -1, 13, 12, 10, -1 ], [ -1, 12, 13, 12, 13, 13 ] ],
      'maj9' : [ [ 1, 0, 2, 0, 1, -1 ], [ -1, 8, 5, 5, 5, 5 ] ],
      '11' : [ [ 1, 1, 1, 2, 1, 3 ], [ -1, -1, 3, 3, 4, 5 ], [ 6, 6, 7, 8, 6, 6 ], [ -1, 8, 7, 8, 6, 6 ] ],
      '13' : [ [ 1, 3, 1, 2, 3, 1 ], [ -1, 8, 7, 8, 8, 10 ], [ 13, -1, 13, 12, 10, 10 ] ],
      'maj13' : [ [ 1, -1, 2, 2, 3, -1 ] ],
      'min' : [ [ 1, 3, 3, 1, 1, 1 ], [ -1, -1, 3, 5, 6, 4 ], [ -1, -1, 6, 5, 6, 4 ], [ -1, 8, 6, 5, 6, -1 ],
          [ -1, 8, 10, 10, 9, 8 ], [ -1, 11, 10, 10, 9, -1 ], [ -1, 11, 10, 10, 13, -1 ] ],
      'min6' : [ [ -1, -1, 0, 1, 1, 1 ], [ -1, -1, 3, 5, 3, 4 ], [ -1, 8, -1, 7, 9, 8 ] ],
      'min7' : [ [ 1, 3, 3, 1, 4, 1 ], [ -1, 8, 6, 5, 4, -1 ], [ -1, -1, 6, 8, 6, 8 ], [ -1, 8, 10, 8, 9, 8 ] ],
      'min9' : [ [ 1, -1, 1, 1, 1, 3 ], [ -1, 8, 6, 8, 8, -1 ] ],
      'min11' : [ [ 1, 1, 1, 1, 1, 1 ], [ -1, 8, 6, 8, 8, 6 ] ],
      'min13' : [ [ 1, 3, 1, 1, 3, 1 ], [ -1, 8, 6, 8, 8, 10 ] ],
      'min(maj7)' : [ [ 1, 3, 2, 1, 1, 1 ], [ -1, 8, 6, 5, 5, -1 ] ],
      'sus2' : [ [ -1, -1, 3, 0, 1, 1 ], [ -1, -1, 3, 5, 6, 3 ], [ -1, 8, 5, 5, 6, -1 ], [ -1, 8, 10, 10, 8, 8 ] ],
      'sus4' : [ [ 1, 3, 3, 3, 1, 1 ], [ -1, -1, 3, 5, 6, 6 ], [ -1, 8, 8, 10, 11, 8 ], [ -1, -1, 10, 10, 11, 13 ] ],
      'dim' : [ [ -1, -1, 3, 4, 3, 4 ], [ -1, 8, 9, 7, 9, -1 ] ],
      'aug' : [ [ -1, -1, 3, 2, 2, 1 ], [ -1, 4, -1, 6, 6, 5 ], [ -1, 8, 7, 6, 6, -1 ], [ 9, -1, 11, 10, 10, -1 ] ],
      '6/9' : [ [ 1, 3, -1, 2, 3, 3 ], [ -1, 5, 5, 5, 6, 5 ], [ 13, 10, 10, 10, 10, 10 ] ],
      '7sus4' : [ [ 1, 3, 1, 3, 1, 1 ], [ -1, 8, 10, 8, 11, -1 ] ],
      '7b5' : [ [ 1, -1, 1, 2, 0, -1 ], [ -1, 8, 9, 8, 10, -1 ] ],
      '7b9' : [ [ 1, 3, 4, 2, 1, 1 ], [ 1, 3, 1, 2, 1, 2 ], [ -1, -1, 3, 2, 4, 2 ], [ -1, 8, 7, 8, 7, 8 ],
          [ -1, 8, 7, 8, 7, -1 ], [ 13, 12, -1, 11, 13, 11 ] ],
      '9sus4' : [ [ -1, 3, 3, 3, 4, 3 ], [ -1, 8, -1, 8, 8, 6 ], [ -1, 8, 8, 8, 8, 8 ], [ 13, -1, 13, 12, 11, -1 ] ],
      'add9' : [ [ -1, -1, 3, 2, 1, 3 ], [ -1, -1, 5, 5, 6, 5 ], [ 8, -1, 7, 10, 8, -1 ], [ -1, 10, 10, 10, 10, -1 ] ],
      'aug9' : [ [ 1, -1, 1, 2, 2, 3 ], [ -1, 8, 7, 8, 8, 9 ] ]
    },
    'F#' : {
      'maj' : [ [ 2, 4, 4, 3, 2, 2 ], [ 6, -1, 4, 6, 7, -1 ], [ -1, -1, 4, 6, 7, 6 ], [ 9, -1, 8, 6, 7, -1 ],
          [ -1, 9, 8, 6, 7, 6 ], [ -1, 9, 11, 11, 11, 9 ] ],
      '5' : [ [ 2, 4, 4, -1, -1, -1 ], [ -1, -1, 4, 6, 7, -1 ], [ -1, 9, 11, 11, -1, -1 ], [ -1, -1, 11, 11, 14, 14 ] ],
      '6' : [ [ 2, 4, -1, 3, 4, -1 ], [ 2, -1, 1, 3, 2, -1 ], [ -1, 9, 11, 8, 11, -1 ], [ -1, 9, 11, 11, 11, 11 ] ],
      '7' : [ [ -1, -1, 4, 3, 2, 0 ], [ 2, 4, 2, 3, 2, 2 ], [ 2, 4, -1, 3, 5, -1 ], [ -1, -1, 4, 6, 5, 6 ],
          [ -1, 9, 11, 11, 11, 12 ], [ -1, 9, 11, 9, 11, 9 ] ],
      'maj7' : [ [ -1, -1, 4, 3, 2, 1 ], [ 2, -1, 3, 3, 2, -1 ], [ -1, 9, 8, 6, 6, 6 ], [ -1, 9, 11, 10, 11, 9 ] ],
      '9' : [ [ -1, -1, 4, 3, 5, 4 ], [ -1, 1, 2, 1, 2, 2 ], [ -1, 9, 8, 9, 9, 9 ] ],
      'maj9' : [ [ 2, -1, 3, 3, -1, 4 ], [ -1, 9, 6, 6, 6, 6 ] ],
      '11' : [ [ 2, 2, 2, 3, 2, 4 ], [ -1, -1, 4, 4, 5, 6 ], [ 7, 7, 8, 9, 7, 7 ], [ -1, 9, 8, 9, 7, 7 ] ],
      '13' : [ [ -1, -1, 2, 3, 4, 2 ], [ 2, -1, 2, 3, 4, 4 ], [ 2, 4, 2, 3, 4, 2 ] ],
      'maj13' : [ [ 2, 1, 1, 1, 2, 1 ], [ -1, 9, -1, 10, 11, 11 ] ],
      'min' : [ [ 2, 4, 4, 2, 2, 2 ], [ -1, -1, 4, 2, 2, 5 ], [ 5, -1, 4, 6, 7, -1 ], [ -1, -1, 4, 6, 7, 5 ],
          [ -1, 9, 7, 6, 7, -1 ], [ -1, 9, 11, 11, 10, 9 ], [ -1, 12, 11, 11, 10, -1 ] ],
      'min6' : [ [ 2, -1, 1, 2, 2, 2 ], [ -1, -1, 4, 6, 4, 5 ], [ -1, -1, 7, 8, 7, 9 ], [ -1, -1, 11, 11, 10, 11 ] ],
      'min7' : [ [ 2, -1, 2, 2, 2, -1 ], [ -1, -1, 4, 6, 5, 5 ], [ -1, -1, 7, 9, 7, 9 ], [ -1, 9, 11, 9, 10, 12 ] ],
      'min9' : [ [ 2, 0, 2, 1, 2, -1 ], [ -1, 9, 7, 9, 9, -1 ] ],
      'min11' : [ [ 2, 2, 2, 2, 2, 2 ], [ -1, 9, 9, 9, 10, 9 ] ],
      'min13' : [ [ 2, 4, 2, 2, 4, 2 ], [ -1, 9, -1, 9, 10, 11 ] ],
      'min(maj7)' : [ [ 2, 4, 3, 2, 2, 2 ], [ -1, -1, 4, 6, 6, 5 ] ],
      'sus2' : [ [ 2, -1, -1, 1, 2, 2 ], [ -1, -1, 4, 6, 7, 4 ], [ -1, 9, 6, 6, 7, -1 ], [ -1, 9, 11, 11, 9, 9 ] ],
      'sus4' : [ [ 2, 4, 4, 4, 2, 2 ], [ -1, -1, 4, 6, 7, 7 ], [ -1, -1, 9, 6, 7, 9 ], [ -1, 9, 9, 11, 12, 9 ] ],
      'dim' : [ [ 2, -1, 1, 2, 1, -1 ], [ -1, 6, 7, 5, 7, -1 ] ],
      'aug' : [ [ -1, -1, 0, 3, 3, 2 ], [ -1, 5, -1, 7, 7, 6 ], [ -1, 9, 8, 7, 7, -1 ], [ 10, -1, 12, 11, 11, -1 ] ],
      '6/9' : [ [ 2, 1, 1, 1, 2, 2 ], [ -1, 4, 4, 3, 4, 4 ], [ -1, 9, 8, 8, 9, 9 ] ],
      '7sus4' : [ [ 2, 4, 2, 4, 2, 2 ], [ -1, -1, 4, 6, 5, 7 ] ],
      '7b5' : [ [ 2, -1, 2, 3, 1, -1 ], [ 8, -1, 8, 9, 7, -1 ] ],
      '7b9' : [ [ 2, 4, 5, 3, 2, 2 ], [ 2, 4, 2, 3, 2, 3 ], [ -1, -1, 4, 3, 5, 3 ], [ -1, 9, 8, 9, 8, 9 ],
          [ 14, 13, -1, 12, 14, 12 ] ],
      '9sus4' : [ [ -1, 4, 4, 4, 5, 4 ], [ -1, 9, -1, 9, 9, 7 ], [ -1, 9, 9, 9, 9, 9 ] ],
      'add9' : [ [ -1, -1, 4, 3, 2, 4 ], [ -1, -1, 6, 6, 7, 6 ], [ -1, 9, 8, 6, 9, 6 ], [ -1, 11, 11, 11, 11, -1 ] ],
      'aug9' : [ [ 2, -1, 2, 3, 3, 4 ], [ -1, 9, 8, 9, 9, 10 ] ]
    },
    'G' : {
      'maj' : [ [ 3, 2, 0, 0, 0, 3 ], [ 3, 5, 5, 4, 3, 3 ], [ 7, -1, 5, 7, 8, -1 ], [ -1, -1, 5, 7, 8, 7 ],
          [ -1, 10, 9, 7, 8, 7 ], [ 10, -1, 9, 7, 8, -1 ], [ -1, 10, 12, 12, 12, 10 ] ],
      '5' : [ [ -1, -1, 0, 0, 3, 3 ], [ 3, 5, 5, -1, -1, -1 ], [ -1, -1, 5, 7, 8, -1 ], [ -1, 10, 12, 12, -1, -1 ] ],
      '6' : [ [ 3, 2, 0, 0, 0, 0 ], [ -1, -1, 5, 4, 3, 0 ], [ 3, 5, -1, 4, 5, 3 ], [ -1, 10, 12, 12, 12, 12 ] ],
      '7' : [ [ 3, 2, 0, 0, 0, 1 ], [ 3, -1, 3, 4, 3, 0 ], [ 3, 5, 3, 4, 3, 3 ], [ -1, -1, 5, 7, 6, 7 ],
          [ 7, -1, 5, 7, 6, -1 ], [ -1, 10, 12, 10, 12, 10 ] ],
      'maj7' : [ [ 3, 2, 0, 0, 0, 2 ], [ -1, -1, 5, 4, 3, 2 ], [ -1, -1, 5, 7, 7, 7 ], [ -1, 10, 12, 11, 12, 10 ] ],
      '9' : [ [ 3, -1, 0, 2, 0, 1 ], [ 3, -1, 3, 2, 0, 3 ], [ 3, 5, 3, 4, 3, 5 ], [ -1, 10, 9, 10, 10, 10 ] ],
      'maj9' : [ [ 3, -1, 0, 2, 0, 2 ], [ -1, 10, 7, 7, 7, 7 ] ],
      '11' : [ [ 3, 2, 0, 2, 1, 1 ], [ 3, 3, 3, 4, 3, 5 ], [ -1, -1, 5, 5, 6, 7 ], [ -1, 10, 9, 10, 8, 8 ] ],
      '13' : [ [ -1, -1, 3, 0, 0, 0 ], [ 3, 5, 3, 4, 5, 3 ], [ -1, -1, 3, 4, 5, 3 ], [ -1, 10, 9, 10, 10, 12 ] ],
      'maj13' : [ [ 3, 2, 2, 2, 3, 2 ], [ -1, 10, -1, 11, 12, 12 ] ],
      'min' : [ [ 3, 1, 0, 0, 3, 3 ], [ 3, 5, 5, 3, 3, 3 ], [ -1, -1, 5, 3, 3, 6 ], [ -1, -1, 5, 7, 8, 6 ],
          [ -1, -1, 8, 7, 8, 6 ], [ -1, 10, 8, 7, 8, -1 ], [ -1, 10, 12, 12, 11, 10 ] ],
      'min6' : [ [ -1, -1, 2, 3, 3, 3 ], [ 3, 5, 5, 3, 5, 3 ], [ -1, 7, 8, 7, 8, -1 ], [ -1, 10, 12, 9, 11, -1 ] ],
      'min7' : [ [ -1, 1, 3, 0, 3, -1 ], [ 3, -1, 3, 3, 3, -1 ], [ 3, 5, 3, 3, 6, 3 ], [ -1, 10, -1, 10, 11, 10 ] ],
      'min9' : [ [ 3, -1, 3, 3, 3, 5 ], [ -1, 10, 8, 10, 10, -1 ] ],
      'min11' : [ [ 3, 3, 3, 3, 3, 3 ], [ -1, 10, 10, 10, 11, 10 ] ],
      'min13' : [ [ 3, 5, 3, 3, 5, 3 ], [ -1, 10, -1, 10, 11, 12 ] ],
      'min(maj7)' : [ [ 3, 5, 4, 3, 3, 3 ], [ -1, 10, 8, 7, 7, -1 ] ],
      'sus2' : [ [ 3, 0, 0, 2, 3, 3 ], [ -1, -1, 5, 7, 8, 5 ], [ -1, 10, 7, 7, 8, -1 ], [ -1, 10, 12, 12, 10, 10 ] ],
      'sus4' : [ [ 3, 5, 5, 5, 3, 3 ], [ -1, -1, 10, 7, 8, 10 ], [ -1, -1, 12, 12, 13, 10 ] ],
      'dim' : [ [ 3, -1, 2, 3, 2, -1 ], [ -1, -1, 5, 6, 5, 6 ] ],
      'aug' : [ [ 3, 2, 1, 0, 0, 3 ], [ 3, -1, 5, 4, 4, -1 ], [ -1, 6, -1, 8, 8, 7 ], [ -1, 10, 9, 8, 8, -1 ] ],
      '6/9' : [ [ 3, 2, 2, 2, 3, 3 ], [ 3, 5, -1, 4, 5, 5 ], [ -1, 5, 5, 4, 5, 5 ], [ -1, 7, 7, 7, 8, 7 ] ],
      '7sus4' : [ [ 3, 5, 3, 5, 3, 3 ], [ -1, -1, 5, 7, 6, 8 ] ],
      '7b5' : [ [ 3, -1, 3, 4, 2, -1 ], [ -1, -1, 5, 6, 6, 7 ] ],
      '7b9' : [ [ 3, 2, -1, 1, 3, 1 ], [ 3, 5, 6, 4, 3, 3 ], [ 3, 5, 6, 4, -1, -1 ], [ 3, 5, 3, 4, 3, 4 ],
          [ -1, -1, 5, 4, 6, 4 ], [ -1, 10, 9, 10, 9, -1 ], [ -1, 10, 9, 10, 9, 10 ] ],
      '9sus4' : [ [ 3, -1, 3, 2, 1, 1 ], [ -1, -1, 5, 5, 6, 5 ], [ -1, 10, -1, 10, 10, 8 ], [ -1, 10, 10, 10, 10, 10 ] ],
      'add9' : [ [ 3, 0, 0, 2, 0, 3 ], [ -1, -1, 5, 4, 3, 5 ], [ -1, -1, 7, 7, 8, 7 ], [ -1, 10, 9, 7, 10, 7 ] ],
      'aug9' : [ [ 3, -1, 3, 4, 4, 5 ], [ -1, 10, 9, 10, 10, 11 ] ]
    },
    'G#' : {
      'maj' : [ [ 4, 3, 1, 1, 1, -1 ], [ -1, -1, 1, 1, 1, 4 ], [ 4, 6, 6, 5, 4, 4 ], [ 8, -1, 6, 7, 8, -1 ],
          [ -1, -1, 6, 8, 9, 8 ], [ -1, 11, 10, 8, 9, -1 ], [ -1, -1, 10, 8, 9, 11 ] ],
      '5' : [ [ -1, -1, 1, 1, 4, 4 ], [ 4, 6, 6, -1, -1, -1 ], [ -1, -1, 6, 8, 9, -1 ], [ -1, 11, 13, 14, -1, -1 ] ],
      '6' : [ [ -1, -1, 1, 1, 1, 1 ], [ 4, 6, -1, 5, 6, 4 ], [ -1, -1, 6, 8, 6, 8 ], [ -1, 11, 13, 10, 13, -1 ] ],
      '7' : [ [ -1, -1, 1, 1, 1, 2 ], [ 4, 6, 4, 5, 4, 4 ], [ 4, 6, -1, 5, 7, -1 ], [ 4, -1, 4, 5, 4, -1 ],
          [ -1, -1, 6, 8, 7, 8 ], [ -1, 11, 13, 11, 13, 11 ] ],
      'maj7' : [ [ -1, -1, 1, 1, 1, 3 ], [ -1, -1, 6, 5, 4, 3 ], [ 4, 6, 5, 5, 4, 4 ], [ -1, 11, 10, 8, 8, 8 ] ],
      '9' : [ [ 4, -1, 4, 3, 1, -1 ], [ 4, 6, 4, 5, 4, 6 ], [ -1, -1, 6, 5, 7, 6 ], [ -1, 11, 10, 11, 11, 11 ] ],
      'maj9' : [ [ 4, 3, 5, 3, 4, -1 ], [ -1, 3, 6, 3, 4, 3 ] ],
      '11' : [ [ -1, 3, 1, 1, 2, 2 ], [ 4, 4, 4, 5, 4, 6 ], [ -1, -1, 6, 6, 7, 8 ], [ -1, 11, 10, 11, 9, 9 ] ],
      '13' : [ [ 4, -1, 4, 3, 1, 1 ], [ 4, -1, 4, 5, 6, -1 ], [ 4, 6, 4, 5, 6, 6 ], [ -1, 11, -1, 11, 13, 13 ] ],
      'maj13' : [ [ 4, 3, 3, 3, 4, 3 ], [ -1, 11, -1, 12, 13, 13 ] ],
      'min' : [ [ -1, 2, 1, 1, 4, 4 ], [ 4, 6, 6, 4, 4, 4 ], [ 7, -1, 6, 4, 4, 4 ], [ -1, -1, 6, 8, 9, 7 ],
          [ -1, -1, 9, 8, 9, 7 ], [ -1, 11, 9, 8, 9, -1 ], [ -1, 11, 13, 13, 12, 11 ] ],
      'min6' : [ [ 4, -1, 3, 4, 4, -1 ], [ 4, 6, 6, 4, 6, 4 ], [ -1, -1, 6, 8, 6, 7 ], [ -1, 11, -1, 10, 12, 11 ] ],
      'min7' : [ [ 4, -1, 4, 4, 4, -1 ], [ 4, 6, 4, 4, 7, 4 ], [ -1, 11, 9, 8, 7, -1 ], [ -1, 11, 13, 11, 12, 11 ] ],
      'min9' : [ [ -1, 2, 4, 3, 4, 4 ], [ 4, -1, 4, 4, 4, 6 ] ],
      'min11' : [ [ 4, 4, 4, 4, 4, 4 ], [ -1, 11, 11, 11, 12, 11 ] ],
      'min13' : [ [ 4, -1, 4, 4, 6, -1 ] ],
      'min(maj7)' : [ [ 4, 6, 5, 4, 4, 4 ], [ -1, -1, 6, 8, 8, 7 ] ],
      'sus2' : [ [ -1, 1, 1, 1, 4, 4 ], [ -1, -1, 6, 8, 9, 6 ], [ -1, 11, 8, 8, 9, -1 ], [ -1, 11, 13, 13, 11, 11 ] ],
      'sus4' : [ [ -1, -1, 1, 1, 2, 4 ], [ 4, 6, 6, 6, 4, 4 ], [ -1, -1, 6, 8, 9, 9 ] ],
      'dim' : [ [ 4, -1, 3, 4, 3, -1 ], [ -1, -1, 6, 7, 6, 7 ] ],
      'aug' : [ [ 0, 3, 2, 1, 1, 0 ], [ 4, -1, 6, 5, 5, -1 ], [ -1, -1, 10, 9, 9, 8 ], [ -1, 11, 10, 9, 9, -1 ] ],
      '6/9' : [ [ 4, 3, 3, 3, 4, -1 ], [ 4, 6, -1, 5, 6, 6 ], [ -1, 6, 6, 5, 6, 6 ], [ -1, 11, 10, 10, 11, 11 ] ],
      '7sus4' : [ [ -1, -1, 1, 1, 2, 2 ], [ 4, 6, 4, 6, 4, 4 ] ],
      '7b5' : [ [ 4, -1, 4, 5, 3, -1 ], [ -1, -1, 6, 7, 7, 8 ] ],
      '7b9' : [ [ 4, 3, -1, 2, 4, 2 ], [ 4, 6, 7, 5, 4, 4 ], [ -1, 11, 10, 11, 10, 11 ], [ -1, 11, 10, 11, 10, -1 ] ],
      '9sus4' : [ [ 4, -1, 4, 3, 2, -1 ], [ -1, 6, 6, 6, 7, 6 ], [ -1, 11, -1, 11, 11, 9 ], [ -1, 11, 11, 11, 11, 11 ] ],
      'add9' : [ [ 4, 3, 1, 3, 1, -1 ], [ -1, -1, 6, 5, 4, 6 ], [ -1, -1, 8, 8, 9, 8 ], [ -1, 11, 10, 8, 11, -1 ] ],
      'aug9' : [ [ 4, 3, 4, 3, 5, -1 ], [ 4, -1, 4, 5, 5, 6 ] ]
    }
  };

  return {
    'get' : get
  };
}

define( 'chorddata', [], function()
{
  'use strict';
  return new ChordData();
} );
