var ConditionNodeType = {
	Smaller: 0,
	Greater: 1,
	Qidian: 2,
	Number: 3,
	And: 4,
	Or: 5,
	NoBuff: 6,
};

function parseConditionText(conditionText) {
	//console.log(conditionText);
	if (conditionText == null) {
		return null;
	}
	if (conditionText.indexOf('&') != -1) {
		return null;
	}
	if (conditionText.indexOf('|') != -1) {
		return null;
	}
	if (conditionText.indexOf('>') != -1) {
		return {
			type: ConditionNodeType.Greater,
			left: parseConditionText(conditionText.substring(0, conditionText.indexOf('>'))),
			right: parseConditionText(conditionText.substring(conditionText.indexOf('>') + 1, conditionText.length))
		}
	}
	if (conditionText == "qidian") {
		return {
			type: ConditionNodeType.Qidian
		}
	}
	if (conditionText.indexOf(':') != -1) {
		var leftText = conditionText.substring(0, conditionText.indexOf(':'));
		var rightText = conditionText.substring(conditionText.indexOf(':') + 1, conditionText.length);
		if (leftText == "nobuff") {
			return {
				type: ConditionNodeType.NoBuff,
				buffname: rightText,
			}
		}
	}
	return {
		type: ConditionNodeType.Number,
		value: parseInt(conditionText)
	}
}

function evalConditionNode(conditionNode, avatar, target) {
	if (conditionNode == null) return true;
	if (conditionNode.type == ConditionNodeType.Number) {
		return conditionNode.value;
	}
	if (conditionNode.type == ConditionNodeType.Qidian) {
		return avatar.attributes.qidian;
	}
	if (conditionNode.type == ConditionNodeType.Greater) {
		return evalConditionNode(conditionNode.left, avatar, target) > evalConditionNode(conditionNode.right, avatar, target);
	}
	if (conditionNode.type == ConditionNodeType.Smaller) {
		return evalConditionNode(conditionNode.left, avatar, target) < evalConditionNode(conditionNode.right, avatar, target);
	}
	if (conditionNode.type == ConditionNodeType.And) {
		return evalConditionNode(conditionNode.left, avatar, target) && evalConditionNode(conditionNode.right, avatar, target);
	}
	if (conditionNode.type == ConditionNodeType.Or) {
		return evalConditionNode(conditionNode.left, avatar, target) || evalConditionNode(conditionNode.right, avatar, target);
	}
	if (conditionNode.type == ConditionNodeType.NoBuff) {
		return (avatar.getBuffByName(conditionNode.buffname) == null);
	}
	return true;
}