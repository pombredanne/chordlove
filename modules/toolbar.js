/**
 * Behavior of the toolbar.
 * 
 * @module toolbar
 * @requires jquery
 * @requires functions
 * @requires share
 */

function Toolbar( $, functions, share )
{
  'use strict';
  if ( Toolbar.prototype._instance )
  {
    return Toolbar.prototype._instance;
  }
  Toolbar.prototype._instance = this;

  var PARENT = $( '#items' );
  var chords = null;

  /**
   * Register the chords module so it can be used for copy-paste operations.
   * 
   * @method
   * @name module:toolbar.registerChordsModule
   * @param {Chords}
   *          chordsModule The chords module to use.
   */
  function registerChordsModule( chordsModule )
  {
    chords = chordsModule;
  }

  function prepareCpanel()
  {
    // TODO this is a backwards compat hack.
    var bindButton = functions.bindButton;

    function getSelectedItems()
    {
      return $( 'li.ui-selected', PARENT );
    }

    function deleteItems()
    {
      getSelectedItems().remove();
      share.changedStructure( 'toolbar/delete' );
    }

    var copiedItems = [];

    function cutItems()
    {
      copyItems();
      getSelectedItems().remove();
      share.changedStructure( 'toolbar/cut' );
    }

    function copyItems()
    {
      copiedItems = [];
      getSelectedItems().each( function()
      {
        copiedItems.push( chords.getExtracts( this ) );
      } );
    }

    function pasteItems()
    {
      $( copiedItems ).each( function()
      {
        chords.createFromExtracts( this );
      } );
      share.changedStructure( 'toolbar/paste' );
      $( 'li.ui-selected', PARENT ).removeClass( 'ui-selected' );
    }

    function editMode()
    {
      var currentState = $( '#edit' ).hasClass( 'active' );
      setEditMode( !currentState );
    }

    function clear()
    {
      PARENT.empty();
      PARENT.removeClass( 'has-text' );
      $( '#title' ).val( '' ).focus();
      share.changedStructure( 'toolbar/clear' );
      return false;
    }

    bindButton( '#cut', cutItems );
    bindButton( '#copy', copyItems );
    bindButton( '#paste', pasteItems );
    bindButton( '#delete', deleteItems );
    bindButton( '#edit', editMode );
    bindButton( '#clear', clear );

    $( '#time-signature' ).change( function()
    {
      share.changedStructure( 'toolbar/timesignature' );
    } );
  }

  prepareCpanel();

  /**
   * Set the edit mode to use.
   * 
   * @method
   * @name module:toolbar.setEditMode
   * @param {boolean}
   *          mode Set to <code>true</code> to enable editing.
   */
  function setEditMode( mode )
  {
    if ( mode === true )
    {
      $( 'body' ).addClass( 'edit-mode' );
      $( '#edit' ).addClass( 'active' );
      hideOrShow( 'show' );
    }
    else
    {
      $( 'body' ).removeClass( 'edit-mode' );
      $( '#edit' ).removeClass( 'active' );
      hideOrShow( 'hide' );
    }
  }

  /**
   * Hide or show empty input elements. Make all input elements read-only in the case of hiding.
   * 
   * @method
   * @name module:toolbar.hideOrShow
   * @param {string}
   *          action Choose action by using <code>show</code> or <code>hide</code> as the value.
   */
  function hideOrShow( action )
  {
    $( '#items input, #title' ).each( function()
    {
      var element = $( this );
      if ( element.val() === '' )
      {
        element[action]();
      }
      else
      {
        element.prop( 'readonly', action === 'hide' );
      }
    } );
  }

  return {
    'hideOrShow' : hideOrShow,
    'setEditMode' : setEditMode,
    'registerChordsModule' : registerChordsModule
  };
}

define( 'toolbar', [ 'jquery', 'functions', 'share' ], function( $, functions, share )
{
  'use strict';
  return new Toolbar( $, functions, share );
} );
