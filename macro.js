function parseConditionText(conditionText) {
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
	return true;
}