const nodePersist = require('node-persist');

exports.get = async function (key) {
	return nodePersist.getItem(key);
};
exports.set = async function (key, item) {
	await nodePersist.setItem(key, item);
}

;
(async () => {
	await nodePersist.init(/* options ... */);

	if (!await nodePersist.getItem('initialized')) {
		await nodePersist.setItem('initialized', true);
		console.log('Storage has been successfully initialized.');
	} else {
		console.log('Storage already initialized.');
	}
})();
