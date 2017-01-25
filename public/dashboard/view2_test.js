'use strict';

describe('myApp.dashboard module', function() {

  beforeEach(module('myApp.view2'));

  describe('dashboard controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view2Ctrl = $controller('View2Ctrl');
      expect(view2Ctrl).toBeDefined();
    }));

  });
});