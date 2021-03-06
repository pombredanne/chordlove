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

/**
 * Database of chords.
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

  var aliases = null, notes = null, noteNumbers = null, numberNotesSharp = null, numberNotesFlat = null, baseTuning = null, vexData = null;

  /**
   * Get chord renderers for a chord.
   * 
   * @method
   * @name module:chorddata.get
   * @param {string}
   *          name The name of the chord.
   * @returns {Array} ChordShape items are returned.
   */
  function get( name )
  {
    var realName = ( name in aliases ) ? aliases[name] : name;
    if ( realName in vexData )
    {
      var chordShapes = vexData[realName];
      for ( var i = 0; i < chordShapes.length; i++ )
      {
        var chordShape = chordShapes[i];
        chordShape.setChordName( realName );
        chordShape.setChordNumber( i );
      }
      return chordShapes;
    }
    else
    {
      return [];
    }
  }

  function barre( from, to, fret )
  {
    return {
      'from_string' : from,
      'to_string' : to,
      'fret' : fret
    };
  }

  /**
   * Renderer for a chord. Renders chord in different positions. Also ranks chords according to difficulty.
   */
  function ChordShape( rootNote, rootPosition, fretsString, barresString, rootPrio, otherPrio )
  {
    var frets = stringToFrets( fretsString );
    var barres = barresString ? stringToBarres( barresString ) : [];
    var bars = barres;
    var root = rootNote;
    var rootNoteNumber = noteNumber( root );
    var position = rootPosition;
    var rootPositionPrio = rootPrio || 3;
    rootPositionPrio *= ( rootPositionPrio < 3 ) ? 0.5 : 1;
    var otherPositionPrio = otherPrio || 3;
    otherPositionPrio *= ( otherPositionPrio > 3 ) ? 2 : 1;
    var min = 24;
    var max = 0;
    var calcFrets = [];
    var calcBars = [];
    var calcRoot;
    var width;
    var chordName = '';
    var chordNumber = undefined;

    function setChordName( name )
    {
      chordName = name;
    }

    function setChordNumber( number )
    {
      chordNumber = number;
    }

    for ( var i = 0; i < frets.length; i++ )
    {
      var currentFret = frets[i][1];
      if ( currentFret !== 'x' )
      {
        if ( currentFret < min )
        {
          min = currentFret;
        }
        if ( currentFret > max )
        {
          max = currentFret;
        }
      }
    }
    for ( var i = 0; i < bars.length; i++ )
    {
      var barPos = bars[i]['fret'];
      if ( barPos < min )
      {
        min = barPos;
      }
      if ( barPos > max )
      {
        max = barPos;
      }
    }
    width = max - min;

    var calcPosition = ( width < 4 ? 2 : 1 ) - min;
    calcFrets = moveFrets( frets, calcPosition );
    calcBars = moveBarres( bars, calcPosition );
    calcRoot = rootPosition + calcPosition;

    function getChordForNote( note )
    {
      var realNote = normalizeNote( note );
      var diff = noteNumber( realNote ) - rootNoteNumber;
      var realPosition = ( position + diff + 12 ) % 12;
      var renderPosition = undefined;
      var realMin = realPosition + min - position;
      if ( realMin < 0 )
      {
        // can't reach below fret zero.
        realPosition += 12;
        realMin += 12;
      }
      if ( realMin >= 12 )
      {
        // this fits in a lower position
        realPosition -= 12;
        realMin -= 12;
      }
      var realMax = realPosition + max - position;
      var realChord = [];
      var realBarre = [];
      var positionPosition = calcRoot - 1;
      if ( realMin < 7 && realMax < 7 )
      {
        diff = realPosition - position;
        realChord = moveFrets( frets, diff );
        realBarre = moveBarres( bars, diff );
      }
      else
      {
        renderPosition = realPosition;
        realBarre = calcBars;
        realChord = calcFrets;
        // don't put the root position number outside the fretboard
        // TODO this could be done in a better way
        if ( positionPosition < 0 )
        {
          positionPosition += 2;
          renderPosition += 2;
        }
      }

      var transformedBarres = barresToOpenStrings( realBarre, realChord );
      realBarre = transformedBarres.barres;
      realChord = transformedBarres.chords;

      var cachedStringNotes = undefined;
      function render( chordBox )
      {
        chordBox.setChord( realChord, renderPosition, realBarre, positionPosition );
        if ( cachedStringNotes === undefined )
        {
          cachedStringNotes = getStringNotes( note, chordName, frets, barres, diff );
        }
        return cachedStringNotes;
      }

      var cachedRank = undefined;
      function rank()
      {
        if ( cachedRank === undefined )
        {
          var stringFactor = 0;
          for ( var i = 0; i < realChord.length; i++ )
          {
            var fret = realChord[i][1];
            if ( fret === 0 )
            {
              stringFactor += 0.5;
            }
            else if ( fret !== 'x' )
            {
              stringFactor++;
            }
          }
          cachedRank = rankChord( realPosition, width, realBarre.length, stringFactor );
          cachedRank *= ( rootNote === realNote ) ? rootPositionPrio : otherPositionPrio;
        }
        return cachedRank;
      }

      function getChordNumber()
      {
        return chordNumber;
      }

      return {
        'render' : render,
        'rank' : rank,
        'getChordNumber' : getChordNumber
      };
    }

    return {
      'getChordForNote' : getChordForNote,
      'setChordName' : setChordName,
      'setChordNumber' : setChordNumber
    };
  }

  function normalizeNote( note )
  {
    if ( note && note in notes )
    {
      return notes[note];
    }
    throw new Exception( 'Unknown note: "' + note + '".' );
  }

  function noteNumber( note )
  {
    return noteNumbers[note];
  }

  function moveFrets( originalFrets, distance )
  {
    if ( distance === 0 )
    {
      return originalFrets;
    }
    var movedFrets = [];
    for ( var i = 0; i < originalFrets.length; i++ )
    {
      var currentFret = originalFrets[i];
      if ( currentFret[1] !== 'x' )
      {
        movedFrets.push( [ currentFret[0], currentFret[1] + distance ] );
      }
      else
      {
        movedFrets.push( [ currentFret[0], 'x' ] );
      }
    }
    return movedFrets;
  }

  function moveBarres( originalBars, distance )
  {
    if ( distance === 0 )
    {
      return originalBars;
    }
    var newBars = [];
    for ( var i = 0; i < originalBars.length; i++ )
    {
      var bar = originalBars[i];
      newBars.push( barre( bar['from_string'], bar['to_string'], bar['fret'] + distance ) );
    }
    return newBars;
  }

  function barresToOpenStrings( originalBarres, originalChords )
  {
    var newBarres = [];
    var newChords = originalChords;
    for ( var barIndex = 0; barIndex < originalBarres.length; barIndex++ )
    {
      var realBar = originalBarres[barIndex];
      if ( realBar['fret'] === 0 )
      {
        for ( var string = realBar['to_string']; string <= realBar['from_string']; string++ )
        {
          var found = false;
          for ( var fretIndex = 0; fretIndex < originalChords.length; fretIndex++ )
          {
            if ( originalChords[fretIndex][0] === string )
            {
              found = true;
              break;
            }
          }
          if ( !found )
          {
            newChords.push( [ string, 0 ] );
          }
        }
      }
      else
      {
        newBarres.push( realBar );
      }
    }
    return {
      'barres' : newBarres,
      'chords' : newChords
    };
  }

  function rankChord( chordPosition, chordWidth, barresLength, chordLength )
  {
    var POSITION_WEIGHT = 0.7;
    var BARRES_WEIGTH = 2.0;
    var WIDTH_WEIGHT = 1.5;
    var STRINGS_WEIGHT = 1.0;
    var compensatedWidth = chordWidth;
    if ( chordPosition === 0 )
    {
      compensatedWidth--;
    }
    // TODO barres + high width should add extra points
    var value = chordPosition * POSITION_WEIGHT + compensatedWidth * WIDTH_WEIGHT + barresLength * BARRES_WEIGTH
        + chordLength * STRINGS_WEIGHT;
    // console.log( chordPosition, chordPosition * POSITION_WEIGHT, chordWidth,
    // compensatedWidth * WIDTH_WEIGHT,
    // barresLength, barresLength * BARRES_WEIGTH, chordLength, chordLength *
    // STRINGS_WEIGHT, value );
    return value;
  }

  function getStringNotes( note, chordName, frets, barres, diff )
  {
    var stringMax = [];
    for ( var i = 0; i < frets.length; i++ )
    {
      var stringData = frets[i];
      var actualStringData = stringData[1];
      stringMax[stringData[0]] = actualStringData;
    }
    for ( i = 0; i < barres.length; i++ )
    {
      var barreData = barres[i];
      var barreFret = barreData.fret;
      for ( var j = barreData.to_string; j <= barreData.from_string; j++ )
      {
        if ( stringMax[j] === undefined || ( stringMax[j] !== 'x' && barreFret > stringMax[j] ) )
        {
          stringMax[j] = barreFret;
        }
      }
    }
    var tuning = [];
    var numberNotes = getNumberNotes( note, chordName );
    for ( i = 6; i > 0; i-- )
    {
      var noteNumber = stringMax[i];
      if ( noteNumber === undefined || noteNumber === 'x' )
      {
        tuning.push( '' );
      }
      else
      {
        var stringNote = numberNotes[( noteNumber + diff + baseTuning[6 - i] + 12 ) % 12];
        tuning.push( stringNote );
      }
    }
    return tuning;
  }

  function getNumberNotes( note, chord )
  {
    var numberNotes = numberNotesFlat;
    if ( note.length > 1 )
    {
      if ( note.charAt( 1 ) === '♯' )
      {
        numberNotes = numberNotesSharp;
      }
    }
    else if ( chord.length > 0 && ( chord.charAt( 0 ) === 'm' && ( chord.length === 1 || chord.charAt( 1 ) !== 'a' ) ) )
    {
      // minors
      if ( 'EABH'.indexOf( note ) !== -1 )
      {
        numberNotes = numberNotesSharp;
      }
    }
    else
    {
      // majors
      if ( 'GDAEBH'.indexOf( note ) !== -1 )
      {
        numberNotes = numberNotesSharp;
      }
    }
    return numberNotes;
  }

  function getRealNote( note )
  {
    var realNote = note;
    if ( note in notes )
    {
      realNote = notes[note];
    }
    return realNote;
  }

  function getTransposed( chords, shift )
  {
    var numberNotes = numberNotesSharp;
    var endChord = chords[chords.length - 1];
    var splitName = splitChord( endChord );
    var i = undefined;
    if ( splitName.note in notes )
    {
      var realEndNote = notes[splitName.note];
      var endNoteNumber = noteNumbers[realEndNote];
      var newEndNoteNumber = ( endNoteNumber + shift + 12 ) % 12;
      var newRealEndNote = numberNotesFlat[newEndNoteNumber];
      if ( newRealEndNote.length === 1 )
      {
        numberNotes = getNumberNotes( newRealEndNote, splitName.name );
      }
      else
      {
        // C# D# F# G# A#
        // major / minor
        if ( splitName.name.length > 0 && splitName.name.charAt( 0 ) === 'm'
            && ( splitName.name.length === 1 || splitName.name.charAt( 1 ) !== 'a' ) )
        {
          // E F# A B Db (corresponding major keys to the minor ones)
          // # # # # b
          if ( newRealEndNote === 'A#' )
          {
            numberNotes = numberNotesFlat;
          }
          else
          {
            numberNotes = numberNotesSharp;
          }
        }
        else
        {
          // C# D# F# G# A# (major keys)
          // b b # b b
          if ( newRealEndNote === 'F#' )
          {
            numberNotes = numberNotesSharp;
          }
          else
          {
            numberNotes = numberNotesFlat;
          }
        }
      }
    }
    var newChords = [];
    for ( i = 0; i < chords.length; i++ )
    {
      var chord = chords[i];
      var newChord = chord;
      var split = splitChord( chord, true );
      var note = split.note;
      var name = split.name;
      var realNote = getRealNote( note );
      if ( realNote in noteNumbers )
      {
        var sourceNumber = noteNumbers[realNote];
        var targetNumber = sourceNumber + shift;
        targetNumber = ( targetNumber + 12 ) % 12;
        newChord = numberNotes[targetNumber] + name;
      }
      newChords.push( newChord );
    }
    return newChords;
  }

  function splitChord( chord, preserveWhitespace )
  {
    if ( !chord.length )
    {
      return null;
    }
    var note = chord.charAt( 0 );
    var chordName = '';
    if ( chord.length > 1 )
    {
      var secondChar = chord.charAt( 1 );
      if ( secondChar === '♯' || secondChar === '♭' )
      {
        note += secondChar;
      }
    }
    if ( chord.length > note.length )
    {
      var rawChordName = chord.substr( note.length );
      chordName = preserveWhitespace ? rawChordName : $.trim( rawChordName );
    }
    return {
      'note' : note,
      'name' : chordName
    };
  }

  function stringToFrets( fretString )
  {
    if ( fretString.length !== 6 )
    {
      throw 'Chord string definition must have six characters.';
    }
    var frets = [];
    for ( var i = 0; i < 6; i++ )
    {
      var fret = fretString.charAt( i );
      if ( fret !== '-' )
      {
        if ( fret === 'x' )
        {
          frets.push( [ 6 - i, 'x' ] );
        }
        else
        {
          frets.push( [ 6 - i, parseInt( fret, 16 ) ] );
        }
      }
    }
    return frets;
  }

  function stringToBarres( barreString )
  {
    if ( barreString.length === 0 )
    {
      return [];
    }
    if ( barreString.length !== 6 )
    {
      throw 'Barre string definition must have six or zero characters.';
    }
    var barres = [];
    var seen = {};
    for ( var i = 0; i < 6; i++ )
    {
      var fret = barreString.charAt( i );
      if ( fret !== '-' )
      {
        var fretNum = parseInt( fret, 16 );
        if ( seen[fret] )
        {
          seen[fret]['to_string'] = 6 - i;
        }
        else
        {
          seen[fret] = {
            'from_string' : 6 - i,
            'fret' : fretNum
          };
        }
      }
    }
    for ( var fretName in seen )
    {
      var barre = seen[fretName];
      if ( !( 'to_string' in barre ) )
      {
        throw 'Invalid barre definition, all barres must end: ' + barreString;
      }
      barres.push( barre );
    }
    return barres;
  }

  function chordFunc( noteName )
  {
    return function( rootPosition, frets, barres, rootPrio, otherPrio )
    {
      return new ChordShape( noteName, rootPosition, frets, barres, rootPrio, otherPrio );
    };
  }

  var A = chordFunc( 'A' ), C = chordFunc( 'C' ), D = chordFunc( 'D' ), E = chordFunc( 'E' ), F = chordFunc( 'F' ), G = chordFunc( 'G' );

  aliases = {
    '' : 'maj',
    'M' : 'maj',
    'M9' : 'maj9',
    'M11' : 'maj11',
    'M13' : 'maj13',
    'm' : 'min',
    'm6' : 'min6',
    'm7' : 'min7',
    'm9' : 'min9',
    'm11' : 'min11',
    'm13' : 'min13',
    'm(maj7)' : 'min(maj7)',
    '+' : 'aug',
    'o' : 'dim',
    'sus' : 'sus4',
    '6add9' : '6/9',
    '6add9-5' : '6/9b5',
    '6add9b5' : '6/9b5',
    '6/9-5' : '6/9b5',
    '7-5' : '7b5',
    'm7-5' : 'm7b5',
    '7-9' : '7b9',
    '7+9' : '7#9',
    '7+5' : '7#5',
    '7aug5' : '7#5',
    '7aug' : '7#5',
    'aug7' : '7#5'
  };

  notes = {
    'A' : 'A',
    'A#' : 'A#',
    'A♯' : 'A#',
    'Bb' : 'A#',
    'B♭' : 'A#',
    'B' : 'B',
    'H' : 'B',
    'C♭' : 'B',
    'Cb' : 'B',
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
    'F♭' : 'E',
    'Fb' : 'E',
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

  noteNumbers = {
    'A' : 0,
    'A#' : 1,
    'B' : 2,
    'C' : 3,
    'C#' : 4,
    'D' : 5,
    'D#' : 6,
    'E' : 7,
    'F' : 8,
    'F#' : 9,
    'G' : 10,
    'G#' : 11
  };

  numberNotesSharp = [ 'A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯' ];
  numberNotesFlat = [ 'A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭' ];

  baseTuning = [ noteNumbers['E'], noteNumbers['A'], noteNumbers['D'], noteNumbers['G'], noteNumbers['B'],
      noteNumbers['E'] ];

  /*
   * Note: Don't alter the order of the chord variants, it's used for persisting chord choices. New variants should be
   * added at the end.
   */
  vexData = {
    'maj' : [ A( 0, 'x-222-', '-0---0', 1, 2 ), A( 5, '54---x', '--222-' ), G( 3, '32---3', '--000-', 1 ),
        E( 0, '-221--', '0----0', 1, 2 ), D( 0, 'xx0232', '', 1 ), D( 0, 'xxx232', '', 4, 4 ),
        C( 3, 'x32-1-', '---0-0', 1 ), C( 3, '3x2-1-', '---0-0' ), C( 3, 'x3201x' ) ],
    '5' : [ E( 0, '0--xxx', '-22---' ), A( 0, 'x0----', '--2255' ), A( 0, 'x0----', '--22--' ), D( 0, 'xx023x', '' ) ],
    '6' : [ A( 0, 'x0----', '--2222', 1 ), G( 3, '32----', '--0000', 1 ), E( 0, '-2212-', '0----0', 1 ),
        E( 0, 'x2212x' ), D( 0, 'xx-2-2', '--0--0', 1 ), D( 5, 'x5443x', '' ) ],
    '7' : [ D( 0, 'xx0212', '', 1 ), D( 0, 'xxx212', '', 4, 4 ), A( 0, 'x-2-2-', '-0---0', 1 ), C( 3, 'x3231x', '' ),
        E( 0, '-2-1--', '0----0', 1 ), E( 0, '-2213-', '0----0', 1 ), E( 0, 'xx-1--', '--0--0' ),
        G( 3, '32---1', '--0-0-', 1 ), G( 3, '3234xx', '' ) ],
    'maj7' : [ E( 0, '0-----', '-224-4' ), A( 0, 'x-212-', '-0---0', 1 ), A( 0, 'x0---4', '--222-' ),
        A( 0, 'xx---4', '--222-', 4, 4 ), D( 0, 'xx0---', '---2-2' ), F( 3, 'xx3210', '', 2 ),
        E( 7, 'x76---', '---444' ), A( 0, 'x0212x' ), G( 0, '3x443x' ) ],
    '9' : [ E( 0, '-2-1-2', '0---0-' ), E( 0, 'xx2132', '' ), C( 3, 'x3233x', '' ), C( 3, 'x32---', '---3-3' ),
        A( 0, 'x0-4-3', '--2222' ), A( 0, 'xx-4-3', '--2222' ) ],
    'maj9' : [ E( 2, 'xx2142', '' ), E( 0, '-211-2', '0----0' ), C( 3, 'x3243x', '' ), G( 3, '3242xx', '' ),
        G( 3, '3-4-3-', '-22222' ), A( 0, 'x-21-x', '-0000-' ), A( 0, 'x-21--', '-00000' ), C( 3, 'x3----', '--0000' ) ],
    '11' : [ C( 3, 'x323--', '----11' ), G( 3, '3235xx', '' ), G( 3, '32----', '--0011' ), A( 0, 'x-----', '-00000' ),
        G( 3, '3x321x', '' ), G( 3, '3x32--', '----11' ), D( 0, 'xx0213', '' ), D( 0, 'xx--1-', '--0000' ) ],
    '13' : [ A( 0, 'x-2-22', '-000--' ), E( 0, '0x012x', '' ), E( 0, '-2-12-', '000000' ), E( 0, '---12-', '000000' ),
        E( 0, '0x01--', '----22' ), C( 3, 'x32--5', '---33-' ), G( 3, '3x32--', '----00' ), A( 5, '545---', '---777' ),
        C( 3, 'x323--', '----55' ) ],
    'maj13' : [ A( 0, 'x021--', '----22' ), A( 0, 'xx21--', '----22' ), E( 0, '0x112x', '' ),
        E( 0, '0x11--', '----22' ), G( 3, '3---3-', '-22222' ), C( 3, 'x3220x', '' ), C( 3, 'x3x4--', '----55' ),
        C( 3, 'x3x435', '' ) ],
    'min' : [ A( 0, 'x-221-', '-0---0', 1, 2 ), E( 0, '-22---', '0----0', 1, 2 ), D( 0, 'xx0231', '', 1 ),
        G( 3, 'x1--3x', '--00--' ), G( 3, 'xx0---', '---333' ), D( 0, 'xx3231', '' ), E( 2, 'xx2---', '---000' ),
        E( 2, 'xx2--3', '---00-' ), E( 2, '3x245x', '' ), E( 5, 'x2545x', '' ), A( 2, 'x3221x', '' ),
        C( 3, 'x3101x', '', 1 ) ],
    'min6' : [ A( 0, 'x02212', '', 1 ), A( 2, 'xx2212', '' ), E( 0, '-22-2-', '0----0', 1 ), A( 5, '5x455x', '' ),
        A( 5, '5x4---', '---555' ), D( 0, 'xx-2-1', '--000-', 1 ), D( 3, 'xx-4-5', '--333-' ),
        C( 3, 'x31213', '--111-' ), D( 0, '1x-2-x', '--000-' ) ],
    'min7' : [ E( 0, '-22-3-', '000000', 1, 2 ), A( 0, 'x02213', '', 1 ), A( 0, 'x-2-1-', '-00000', 3, 2 ),
        D( 0, 'xx02--', '----11', 1 ), E( 0, '-2--3-', '000000' ), A( 5, '53----', '--5555' ),
        A( 5, 'xx----', '--5555', 4, 4 ), D( 5, 'x5-5-5', '--333-' ) ],
    'min9' : [ A( 5, '53---7', '--555-' ), E( 0, '-2---2', '00000-', 1 ), E( 0, 'xx---2', '--000-', 4 ),
        A( 0, 'x-241-', '-00000' ), D( 5, 'x53---', '---555' ) ],
    'min11' : [ A( 0, 'x---1-', '-00000' ), E( 2, 'xx----', '--2233' ), A( 5, '5x553x', '' ), E( 0, '-----2', '00000-' ) ],
    'min13' : [ A( 0, 'x-2-12', '-000--' ), A( 0, 'x0x012', '' ), E( 0, '-2--2-', '000000' ) ],
    'min(maj7)' : [ A( 0, 'x-211-', '-00000' ), E( 0, '-21---', '000000' ), C( 3, 'x31--x', '---00-' ),
        D( 0, 'xx0221', '' ) ],
    'sus2' : [ A( 0, 'x-22--', '-00000' ), A( 5, '5xx455', '' ), D( 0, 'xx-23-', '--0000' ), C( 3, 'x3--1x', '--00--' ) ],
    'sus4' : [ A( 0, 'x-223-', '-0---0' ), E( 0, '-222--', '0----0' ), D( 0, 'xx02--', '----33' ) ],
    'dim' : [ D( 0, 'xx0-3-', '---111' ), G( 3, '3xx323', '' ), A( 2, 'x3124x', '' ) ],
    'dim7' : [ D( 5, 'x5646x', '' ), D( 5, 'x56-6-', '---444' ), D( 0, 'xx0101', '' ), G( 3, '3x232x', '' ),
        G( 3, 'x4x-5-', '---333' ), G( 5, 'xx5656', '' ) ],
    'aug' : [ E( 2, 'xx2110', '' ), A( 0, 'x03221', '' ), G( 3, '3x544x', '' ), C( 3, 'x32--x', '---11-' ),
        E( 5, 'xx6554', '' ) ],
    '6/9' : [ A( 0, 'x-442-', '-00000', 1, 5 ), F( 1, '1---11', '-000--', 2 ), E( 0, '0--122' ),
        C( 1, 'x---1-', '-00000' ), G( 3, 'x554--', '----55' ), C( 3, 'x3--33', '--22--' ), C( 3, 'x3--3x', '--22--' ) ],
    '6/9b5' : [ C( 3, 'x3--3-', '--2222' ) ],
    '7sus4' : [ E( 0, '-2-2--', '000000', 2 ), A( 0, 'x-2-3-', '-00000', 2 ) ],
    '7b5' : [ A( 0, 'x01--3', '---22-', 2, 4 ), A( 0, 'x-1-2-', '-000--' ), D( 0, 'xx0112' ) ],
    '7#5' : [ E( 0, '0x011x' ) ],
    'm7b5' : [ G( 3, '3x332x', '' ), A( 0, 'x0101x' ), A( 0, 'x0-2-3', '--111-', 1, 5 ), D( 0, 'xx0---', '---111' ),
        D( 3, 'x3313x' ) ],
    '7b9' : [ A( 0, 'x0-3-3', '--222-', 2, 5 ), G( 5, 'xx5-6-', '---444' ), C( 3, 'x3-3-3', '--222-' ),
        A( 5, '5x532x' ), E( 0, '-231--', '000000' ), E( 0, '-2-1-1', '00000-' ), C( 3, 'x3232-' ) ],
    '7#9' : [ C( 3, 'x3234-' ) ],
    '9sus4' : [ A( 5, '5x543x' ), D( 0, 'xx--1-', '--0000' ), A( 0, 'x-----', '-00000' ), G( 3, 'x3x331' ),
        C( 3, 'x3x331' ), A( 0, 'x02433', '', 1, 5 ), E( 0, '-2-2-2', '00000-', 2, 4 ) ],
    'add9' : [ A( 0, 'x02420', '', 1, 5 ), G( 5, 'xx5435' ), C( 3, 'x3203x' ), G( 0, 'x----x', '-0000-' ),
        C( 1, 'xx--1-', '--0000' ) ],
    'aug9' : [ E( 0, '0x0--2', '---11-' ), E( 0, 'xx0--2', '---11-' ), C( 3, 'x32--4', '---33-' ) ],
    'xyz' : [ E( 0, '------', '000000' ) ]
  };

  return {
    'get' : get,
    'splitChord' : splitChord,
    'getTransposed' : getTransposed
  };
}

define( 'chorddata', [], function()
{
  'use strict';
  return new ChordData();
} );
