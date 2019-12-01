const assert = require( 'assert' );
const parseGoalsFromMarkdown = require( '../index' );

describe('split into goals', function() {

	const goals = parseGoalsFromMarkdown( __dirname + '/fixture/data.md' )

	console.log( goals );
	it('should return 2 goals', function() {
		assert.equal( Object.keys(goals).length, 2 );
	});

	it('should assign subgoals', function(){
		assert.equal( goals['0'].subgoals['1'].title, 'Sub goal 1\n' );
	});

});