const fs = require( 'fs' );
const marked = require( 'marked' );

function stripTags( string ) {
	return string.replace(/<\/?[^>]+(>|$)/g, "");
}

function Goal( id, title, subgoals = {}) {
	return {
		id: id,
		title: title,
		subgoals: subgoals
	}
}

module.exports = function parseGoalsFromMarkdown( filePath ) {

	const data = fs.readFileSync( filePath, 'utf8' );
	const html = marked( data, { headerIds: false } );

	let entries = html.match( /.*\n/g );
	let goals = {};
	let currentGoalId;
	let subgoalCount = 0;
	let mainGoalCount = 0;
	let taskCount = 0;


	for (let i = 0; i < entries.length; i++) {
		const element = entries[i];

		if ( element.includes( '<h1>' ) ) {
			
			// Reset subgoal count
			subgoalCount = 0;
			
			goals[mainGoalCount] = new Goal( 
				id = mainGoalCount, 
				title = stripTags(element)
			);
			
			currentGoalId = mainGoalCount;
			mainGoalCount++;

		}

		if ( element.includes( '<h3>' ) ) {

			// Reset tasks
			taskCount = 0;

			goals[currentGoalId].subgoals[subgoalCount] = new Goal(
				id = subgoalCount,
				title = stripTags(element)
			);
			
			subgoalCount++;
		}

		if ( element.includes( '<strong>' ) ) {
			if ( goals[currentGoalId].subgoals.length ) {
				goals[currentGoalId].subgoals[subgoalCount].subgoals[taskCount] = new Goal(
					id = taskCount,
					title = stripTags(element)
				);
			}
			taskCount++;
		}
	}

	return goals;

}