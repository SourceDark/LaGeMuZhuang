var ConditionNodeType = {
	Smaller: 0,
	Greater: 1,
	Qidian: 2,
	Number: 3,
	And: 4,
	Or: 5,
	NoBuff: 6,
	BuffTime: 7,
	BuffExist: 8,
	BuffLevel: 9,
};

function parseConditionText(conditionText, fatherType) {
	//console.log(conditionText);
	if (conditionText == null) {
		return null;
	}
	if (conditionText.indexOf('&') != -1) {
		return null;
	}
	if (conditionText.indexOf('|') != -1) {
		return {
			type: ConditionNodeType.Or,
			left: parseConditionText(conditionText.substring(0, conditionText.indexOf('|')), ConditionNodeType.Or),
			right: parseConditionText(conditionText.substring(conditionText.indexOf('|') + 1, conditionText.length), ConditionNodeType.Or)
		}
	}
	if (conditionText.indexOf('>') != -1) {
		return {
			type: ConditionNodeType.Greater,
			left: parseConditionText(conditionText.substring(0, conditionText.indexOf('>')), ConditionNodeType.Greater),
			right: parseConditionText(conditionText.substring(conditionText.indexOf('>') + 1, conditionText.length), ConditionNodeType.Greater)
		}
	}
	if (conditionText.indexOf('<') != -1) {
		return {
			type: ConditionNodeType.Smaller,
			left: parseConditionText(conditionText.substring(0, conditionText.indexOf('<')), ConditionNodeType.Smaller),
			right: parseConditionText(conditionText.substring(conditionText.indexOf('<') + 1, conditionText.length), ConditionNodeType.Smaller)
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
		if (leftText == "bufftime") {
			return {
				type: ConditionNodeType.BuffTime,
				buffname: rightText,
			}
		}
		if (leftText == "buff") {
			if (fatherType == ConditionNodeType.Greater || fatherType == ConditionNodeType.Smaller) {
				return {
					type: ConditionNodeType.BuffLevel,
					buffname: rightText,
				}
			}
			else {
				return {
					type: ConditionNodeType.BuffExist,
					buffname: rightText,
				}	
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
	if (conditionNode.type == ConditionNodeType.BuffTime) {
		if (avatar.getBuffByName(conditionNode.buffname) == null) {
			return 0;
		}
		else {
			return avatar.getBuffByName(conditionNode.buffname).duration;
		}
	}
	if (conditionNode.type == ConditionNodeType.BuffExist) {
		return (avatar.getBuffByName(conditionNode.buffname) != null);
	}
	if (conditionNode.type == ConditionNodeType.BuffLevel) {
		if (avatar.getBuffByName(conditionNode.buffname) == null) {
			return 0;
		}
		else {
			return avatar.getBuffByName(conditionNode.buffname).level;
		}
	}
	return true;
}