function Chords( $, functions, save, toolbar, resizer )
{
  'use strict';
  if ( Chords.prototype._instance )
  {
    return Chords.prototype._instance;
  }
  Chords.prototype._instance = this;

  var PLUGIN_ID = "01", DEFAULT_FORMAT = 0;

  var CONFIG = {
    CHORDS_COUNT_LENGTH : 1,
    CHORD_BEAT_COUNT_LENGTH : 1,
    CHORDITEMS_COUNT_LENGTH : 1,
    TEXTITEMS_COUNT_LENGTH : 1,
    TIME_SIGNATURE_LENGTH : 1,
    DEFAULT_TIME_SIGNATURE : 4
  };

  var $SINGLE_BARLINE = $( '<li class="symbol item-barline"><img class="barline" src="images/single-barline.svg" alt="|"></li>' );
  var $PARENT = $( '#items' );
  var $TIME_SIGNATURE = $( '#time-signature' );
  var $LI = $( '<li class="item" />' );
  var $HANDLE = $( '<div class="handle"><i class="icon-move" title="move"></i><i class="icon-pushpin" title="select/unselect"></i></div>' );
  var $INPUT = $( '<input class="chord-text resize-trigger" type="text" title="Add a chord" placeholder="Chord…" />' );
  var $CHORD = $( '<div class="chord"/>' );

  var beatsHandler = new Beats( $TIME_SIGNATURE, save );

  var postRenderers = [];
  var contentExtractors = [];

  var format = DEFAULT_FORMAT;
  var data = null;

  registerContentExtractor( extract );

  toolbar.registerChordsModule( {
    "getExtracts" : getExtracts,
    "createFromExtracts" : createFromExtracts
  } );

  functions.bindButton( "#add-chord", createItem );

  save.addStructureChangeListener( handleStructureChange );

  save.addTextChangeListener( function( event )
  {
    if ( event.data && event.data.item )
    {
      resizer.performResize( $( event.data.item ) );
    }
  } );

  function setData( inputFormat, inputData )
  {
    format = inputFormat;
    data = inputData;
  }

  function addPostRenderer( renderer )
  {
    postRenderers.push( renderer );
  }

  function render()
  {
    $PARENT.empty();
    if ( !data )
    {
      return;
    }
    if ( format !== DEFAULT_FORMAT )
    {
      throw "Unknown chords data format.";
    }
    var deserializedData = deserialize( data );
    var chordItems = deserializedData.chordItems;
    var timeSignature = deserializedData.timeSignature;
    var hasText = chordItems && chordItems[0] && chordItems[0].lyrics !== undefined;
    if ( hasText )
    {
      $PARENT.addClass( 'has-text' );
    }
    var beatsSum = 0;
    $.each( chordItems, function()
    {
      createItem( this );
      beatsSum += this.beats;
      if ( beatsSum % timeSignature === 0 )
      {
        $SINGLE_BARLINE.clone().appendTo( $PARENT );
      }
    } );
    $TIME_SIGNATURE.val( "" + deserializedData.timeSignature );
    $.each( postRenderers, function()
    {
      this();
    } );
    $PARENT.children( 'li.item' ).each( function()
    {
      resizer.performResize( $( this ) );
    } );
  }

  function deserialize( input )
  {
    var chords = [];
    var chordBeats = [];
    var chordItems = [];
    var timeSignature = CONFIG.DEFAULT_TIME_SIGNATURE;
    try
    {
      var currentPos = 0;

      timeSignature = functions.getNumber( input.substr( currentPos++, CONFIG.TIME_SIGNATURE_LENGTH ) );

      var read = functions.readStringArray( {
        'data' : input,
        'currentPos' : currentPos,
        'countSize' : CONFIG.CHORDS_COUNT_LENGTH
      } );
      chords = read.array;
      currentPos = read.position;

      var numberOfChordBeats = functions.getNumber( input.substr( currentPos++, CONFIG.CHORD_BEAT_COUNT_LENGTH ) );
      for ( var i = 0; i < numberOfChordBeats; i++ )
      {
        var chord = functions.getNumber( input.charAt( currentPos++ ) );
        var beats = functions.getNumber( input.charAt( currentPos++ ) );
        chordBeats.push( new ChordBeat( chord, beats ) );
      }

      var numberOfChordItems = functions.getNumber( input.substr( currentPos++, CONFIG.CHORDITEMS_COUNT_LENGTH ) );
      for ( var i = 0; i < numberOfChordItems; i++ )
      {
        var chordBeat = chordBeats[functions.getNumber( input.charAt( currentPos++ ) )];
        var chordText = chords[chordBeat.chord];
        chordItems.push( new ChordData( chordText, chordBeat.beats ) );
      }
    }
    catch ( err )
    {
      console.log( err );
    }
    return {
      "chordItems" : chordItems,
      "timeSignature" : timeSignature
    };
  }

  function ChordBeat( chord, beats )
  {
    this.chord = chord;
    this.beats = beats;
  }

  function ChordData( chord, beats, lyrics )
  {
    this.chord = chord;
    this.beats = beats;
    this.lyrics = lyrics;
  }

  function serialize()
  {
    var result = PLUGIN_ID + DEFAULT_FORMAT;
    var state = getData();
    var chordItems = state.chordItems;
    var chordBeatsItems = state.chordBeatsItems;
    var chordBeatsCollection = state.chordBeatsCollection;

    result += functions.getCharacters( state.timeSignature, CONFIG.TIME_SIGNATURE_LENGTH );

    result += functions.getCharacters( chordItems.length, CONFIG.CHORDS_COUNT_LENGTH );
    for ( var i = 0; i < chordItems.length; i++ )
    {
      var serializedChord = functions.encode( chordItems[i] );
      result += functions.getCharacters( serializedChord.length, 1 );
      result += serializedChord;
    }

    result += functions.getCharacters( chordBeatsItems.length, CONFIG.CHORDITEMS_COUNT_LENGTH );
    for ( var i = 0; i < chordBeatsItems.length; i++ )
    {
      var chordBeatsItem = chordBeatsItems[i];
      result += functions.getCharacters( chordBeatsItem.chord, 1 );
      result += functions.getCharacters( chordBeatsItem.beats, 1 );
    }

    result += functions.getCharacters( chordBeatsCollection.length, CONFIG.CHORDITEMS_COUNT_LENGTH );
    for ( var i = 0; i < chordBeatsCollection.length; i++ )
    {
      result += functions.getCharacters( chordBeatsCollection[i], 1 );
    }
    return result.length > 7 ? result : '';
  }

  function handleStructureChange( event )
  {
    updateBarlines();
  }

  function getData()
  {
    var chords = {}, chordNo = 0;
    var chordDataItems = [];
    var chordValues = [];
    var chordBeatsKeys = {}, chordBeatsNo = 0;
    var chordBeatsValues = [];
    var chordBeatsCollection = [];
    var timeSignature = $TIME_SIGNATURE.val();
    $PARENT.children( 'li.item' ).each( function( index )
    {
      var chordData = getChordData( this );
      chordDataItems.push( chordData );
      var val = chordData.chord;
      if ( typeof ( chords[val] ) === 'undefined' )
      {
        chords[val] = chordNo;
        chordNo++;
        chordValues.push( val );
      }
      var beatsVal = chordData.beats;
      var chordBeatsLookup = "" + chords[val] + "=" + beatsVal;
      if ( typeof ( chordBeatsKeys[chordBeatsLookup] ) === 'undefined' )
      {
        chordBeatsKeys[chordBeatsLookup] = chordBeatsNo;
        chordBeatsNo++;
        chordBeatsValues.push( new ChordBeat( chords[val], beatsVal ) );
      }
      chordBeatsCollection.push( chordBeatsKeys[chordBeatsLookup] );
    } );
    return {
      'chordItems' : chordValues,
      'chordBeatsItems' : chordBeatsValues,
      'chordBeatsCollection' : chordBeatsCollection,
      'timeSignature' : timeSignature
    };
  }

  function updateBarlines()
  {
    $PARENT.children( 'li.item-barline' ).remove();
    var timeSignature = $TIME_SIGNATURE.val();
    var beatsSum = 0;
    $PARENT.children( 'li.item' ).each( function( index )
    {
      var chordData = getChordData( this );
      beatsSum += chordData.beats;
      if ( beatsSum % timeSignature === 0 )
      {
        $SINGLE_BARLINE.clone().insertAfter( this );
      }
    } );
  }

  function registerContentExtractor( extractor )
  {
    contentExtractors.push( extractor );
  }

  function extract( li )
  {
    var chord = $( $( 'input.chord-text', li ).get( 0 ) ).val();
    var beats = $( $( 'div.duration > a', li ).get( 0 ) ).text();
    return function( theItem )
    {
      $( 'input.chord-text', theItem ).val( chord );
      $( 'div.duration > a', theItem ).text( beats );
    };
  }

  function getExtracts( li )
  {
    var extracts = [];
    for ( var i = 0; i < contentExtractors.length; i++ )
    {
      extracts.push( contentExtractors[i]( li ) );
    }
    return extracts;
  }

  function createFromExtracts( extracts )
  {
    var li = createItem();
    for ( var i = 0; i < extracts.length; i++ )
    {
      extracts[i]( li );
    }
  }

  function getChordData( li )
  {
    var wrapper = $( li );
    var chord = $( 'input.chord-text', wrapper ).get( 0 );
    var beats = $( 'div.duration > a', wrapper ).get( 0 );
    var chordText = $( chord ).val();
    var beatCount = $( beats ).text().length;
    var lyrics = undefined;
    if ( $PARENT.hasClass( 'has-text' ) )
    {
      lyrics = $( $( 'input.song-text', wrapper ).get( 0 ) ).val() || '';
    }
    return new ChordData( chordText, beatCount, lyrics );
  }

  function createItem( chordData )
  {
    var chordText = undefined;
    var beats = undefined;
    if ( typeof chordData !== 'undefined' )
    {
      chordText = chordData.chord;
      beats = chordData.beats;
    }
    var wrapper = $LI.clone().append( $HANDLE.clone() );
    var input = $INPUT.clone();
    if ( chordText )
    {
      input.val( chordText );
    }
    var div = $CHORD.clone();
    input.appendTo( div );
    wrapper.append( div );
    // wrapper.append( more );
    wrapper.appendTo( $PARENT );

    beatsHandler.createBeats( beats, wrapper );

    $( input ).keydown( functions.handleInputKeyEvent ).blur( {
      'item' : wrapper
    }, function( event )
    {
      input.val( transformChordString( input.val() ) );
      save.changedText( event );
    } );

    addPinEvents( wrapper );

    resizer.prepareResize( wrapper );
    if ( chordData === undefined )
    {
      // create a blank item
      input.focus();
      save.changedStructure( 'chords/new' );
    }

    return wrapper;
  }

  function setCharAt( str, index, chr )
  {
    if ( index > str.length - 1 )
    {
      return str;
    }
    return str.substr( 0, index ) + chr + str.substr( index + 1 );
  }

  function transformChordString( string )
  {
    var inputContent = $.trim( string );
    if ( inputContent.length > 1 )
    {
      var secondChar = inputContent.charAt( 1 );
      if ( secondChar === 'b' )
      {
        inputContent = setCharAt( inputContent, 1, '♭' );
      }
      else if ( secondChar === '#' )
      {
        inputContent = setCharAt( inputContent, 1, '♯' );
      }
    }
    return inputContent;
  }

  function checkAbsentKey( key )
  {
    return key !== undefined && key == false;
  }

  return {
    "render" : render,
    "serialize" : serialize,
    "setData" : setData,
    "ChordData" : ChordData,
    "registerContentExtractor" : registerContentExtractor,
    "addPostRenderer" : addPostRenderer
  };
}

function Beats( $TIME_SIGNATURE, save )
{
  'use strict';
  var MAX_BULLETS = 16;
  var $BEATS_WRAPPER = $( '<div class="btn-group duration">' );
  var $BEATS_LINK = $( '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#" title="Beats for this chord"/>' );
  var $BEATS_LIST = $( '<ul class="dropdown-menu"/>' );
  var BULLET_STRING = '••••••••••••••••';
  var BULLETS = [];
  for ( var len = 0; len <= MAX_BULLETS; len++ )
  {
    BULLETS.push( BULLET_STRING.substr( 0, len ) );
  }

  function createBeats( beats, wrapper )
  {

    var defaultBeats = parseInt( $TIME_SIGNATURE.val() );
    var num = defaultBeats;
    if ( typeof beats !== 'undefined' )
    {
      num = beats;
    }
    var beatsWrapper = $BEATS_WRAPPER.clone();
    var currentBeats = $BEATS_LINK.clone();
    currentBeats.appendTo( beatsWrapper );
    currentBeats.text( BULLETS[num] );
    currentBeats.dropdown();
    var list = $BEATS_LIST.clone();
    list.appendTo( beatsWrapper );

    for ( var len = defaultBeats; len > 0; len-- )
    {
      var beatString = BULLETS[len];
      var option = $( '<li><a href="#">' + beatString + '</a></li>' );
      option.appendTo( list );
      option.click( {
        'beatString' : beatString
      }, function( event )
      {
        currentBeats.dropdown( 'toggle' );
        if ( currentBeats.text() !== event.data.beatString )
        {
          currentBeats.text( event.data.beatString );
          currentBeats.blur();
          save.changedStructure( "chords/beats" );
        }
        return false;
      } );
    }

    beatsWrapper.appendTo( wrapper );
  }

  return {
    'createBeats' : createBeats
  };
}

function addPinEvents( wrapper )
{
  'use strict';
  $( '.icon-pushpin', wrapper ).mousedown( function( event )
  {
    event.stopImmediatePropagation();
    if ( wrapper.hasClass( 'ui-selected' ) )
    {
      wrapper.removeClass( 'ui-selected' );
    }
    else
    {
      wrapper.addClass( 'ui-selected' );
    }
    return false;
  } );
}

define( "chords", [ "plugins", "jquery", "functions", "save", "toolbar", "resizer" ], function( plugins, $, functions,
    save, toolbar, resizer )
{
  'use strict';
  plugins.register( {
    "name" : "chords",
    "instance" : new Chords( $, functions, save, toolbar, resizer ),
    "render" : true,
    "serialize" : true
  } );
} );
