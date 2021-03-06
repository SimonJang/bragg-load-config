'use strict';
module.exports = ctx => {
	const functionArn = ctx.context.invokedFunctionArn;

	if (functionArn.indexOf(':') === -1) {
		// Do not check if we are not running an alias
		return;
	}

	// Extract the alias name
	const alias = functionArn.split(':').pop().toLowerCase();

	const seperatorIndex = alias.indexOf('-');

	return seperatorIndex !== -1 && alias.slice(0, seperatorIndex);
};
