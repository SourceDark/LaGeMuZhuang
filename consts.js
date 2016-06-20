ConditionNodeType = {
	Smaller: 0,
	Greater: 1,
	Qidian: 2,
	Number: 3,
	And: 4,
	Or: 5,
};
Xishu = {
	Huixinxishu : 41.43,
	Huixiaoxishu : 15.06,
	Pofangxishu : 36.34,
	Mingzhongxishu : 34.25,
	Wushuangxishu : 25.69,
};

DEFENSE_BREAK_COEF = 36.34;
MAX_QIDIAN = 10;

function randBetween(a, b) {
	return a + (b - a) * Math.random();
}