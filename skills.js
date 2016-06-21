SkillType = {
    Normal: 0,
    Auto: 1,
    Qidian: 2,
    Qixue: 3,
    Casting: 4,
};
SkillTarget = {
    Enemy: 0,
    Self: 1
};
HitType = {
    Miss: 0,
    Hit: 1,
    Critical: 2,
    Block: 3
}
var SkillFactory = {
	skills : [
        {
        	type: SkillType.Normal,
            name: "三环套月",
            target: SkillTarget.Enemy,
            cdRest: 0,
            gcdLevel: 0,
            getColdTime: function(avatar, target) {
                return 2;
            },
            getWeaponCoef: function(avatar, target) {
                return 1.0;
            },
            getSkillCoef: function(avatar, target) {
                return 0.925;
            },
            getBasicDamage: function(avatar, target) {
                return randBetween(123, 136);
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower + avatar.attributes.basicAttackPower * avatar.getExtraAttributes().basicAttckPowerMultiply;
            },
            getCriticalHitChance: function(avatar, target) {
                // 奇穴：心固 + 秘籍
                return avatar.attributes.criticalHitChance + avatar.getExtraAttributes().criticalHitChance + 0.02 + 0.03 + 0.04 + 0.1;
            },
            getCriticalHitDamage: function(avatar, target) {
                // 奇穴：心固
                return avatar.attributes.criticalHitDamage + avatar.getExtraAttributes().criticalHitDamage + 0.1;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel * (1 + avatar.getExtraAttributes().defenseBreakMultiply) / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                // 秘籍
                return 1.05;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, hitType) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                // 奇穴：深埋
                if (hitType == HitType.Critical) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
            }
        },
        {
            type: SkillType.Auto,
            name: "三柴剑法",
            target: SkillTarget.Enemy,
            cdRest: 0,
            getColdTime: function(avatar, target) {
                return 1.3125;
            },
            getWeaponCoef: function(avatar, target) {
                return 1.2;
            },
            getSkillCoef: function(avatar, target) {
                return 0.1572265625;
            },
            getBasicDamage: function(avatar, target) {
                return 0;
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower + avatar.attributes.basicAttackPower * avatar.getExtraAttributes().basicAttckPowerMultiply;
            },
            getCriticalHitChance: function(avatar, target) {
                return avatar.attributes.criticalHitChance + avatar.getExtraAttributes().criticalHitChance;
            },
            getCriticalHitDamage: function(avatar, target) {
                return avatar.attributes.criticalHitDamage + avatar.getExtraAttributes().criticalHitDamage;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel * (1 + avatar.getExtraAttributes().defenseBreakMultiply) / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                return 1.0;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, hitType) {
                // 奇穴：深埋
                if (hitType == HitType.Critical) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
            }
        },
        {
        	type: SkillType.Qidian,
        	name: "无我无剑",
            target: SkillTarget.Enemy,
            cdRest: 0,
        	gcdLevel: 0,
            getColdTime: function(avatar, target) {
                return 0;
            },
            getWeaponCoef: function(avatar, target) {
                return 2.0;
            },
            getSkillCoef: function(avatar, target) {
                var skillCoefQidian1 = 0.3376;
                var skillCoefQidian10 = 1.63125;
                return skillCoefQidian1 + (skillCoefQidian10 - skillCoefQidian1) / 9 * (avatar.attributes.qidian - 1);
            },
            getBasicDamage: function(avatar, target) {
                var basicDamageLeftQidian1 = 22;
                var basicDamageLeftQidian10 = 224;
                var basicDamageLeft = basicDamageLeftQidian1 + (basicDamageLeftQidian10 - basicDamageLeftQidian1) / 9 * (avatar.attributes.qidian - 1);
                var basicDamageRightQidian1 = 24;
                var basicDamageRightQidian10 = 247;
                var basicDamageRight = basicDamageRightQidian1 + (basicDamageRightQidian10 - basicDamageRightQidian1) / 9 * (avatar.attributes.qidian - 1);
                return randBetween(basicDamageLeft, basicDamageRight);
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower + avatar.attributes.basicAttackPower * avatar.getExtraAttributes().basicAttckPowerMultiply;
            },
            getCriticalHitChance: function(avatar, target) {
                // 秘籍
                return avatar.attributes.criticalHitChance + avatar.getExtraAttributes().criticalHitChance + 0.03 + 0.04;
            },
            getCriticalHitDamage: function(avatar, target) {
                return avatar.attributes.criticalHitDamage + avatar.getExtraAttributes().criticalHitDamage;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel * (1 + avatar.getExtraAttributes().defenseBreakMultiply) / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                // 秘籍 + 套装效果
                return 1 + 0.09 + 0.1;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, hitType) {
                avatar.attributes.qidian = 0;
                // 奇穴：深埋
                if (hitType == HitType.Critical) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
                // 奇穴：叠刃
                if (hitType == HitType.Critical) {
                    //target.addBuff("叠刃", 1, avatar.attributes);
                }
            }
        },
        {
            type: SkillType.Auto,
            name: "被动回豆",
            target: SkillTarget.Self,
            cdRest: 0,
            getColdTime: function(avatar, target) {
                return 1;
            },
            after: function(avatar, target) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 1);
            }
        },
        {
            type: SkillType.Normal,
            name: "八荒归元",
            target: SkillTarget.Enemy,
            cdRest: 0,
            gcdLevel: 0,
            getColdTime: function(avatar, target) {
                return 15;
            },
            getWeaponCoef: function(avatar, target) {
                return 2.0;
            },
            getSkillCoef: function(avatar, target) {
                var skillCoefHP0 = 2;
                var skillCoefHP100 = 1.1876;
                return skillCoefHP0 + (skillCoefHP100 - skillCoefHP0) * (target.attributes.currentHp / target.attributes.hp);
            },
            getBasicDamage: function(avatar, target) {
                var basicDamageLeftHP0 = 690;
                var basicDamageLeftHP100 = 23;
                var basicDamageLeft = basicDamageLeftHP0 + (basicDamageLeftHP100 - basicDamageLeftHP0) * (target.attributes.currentHp / target.attributes.hp);
                var basicDamageRightHP0 = 760;
                var basicDamageRightHP100 = 25;
                var basicDamageRight = basicDamageRightHP0 + (basicDamageRightHP100 - basicDamageRightHP0) * (target.attributes.currentHp / target.attributes.hp);
                return randBetween(basicDamageLeft, basicDamageRight);
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower + avatar.attributes.basicAttackPower * avatar.getExtraAttributes().basicAttckPowerMultiply;
            },
            getCriticalHitChance: function(avatar, target) {
                return avatar.attributes.criticalHitChance + avatar.getExtraAttributes().criticalHitChance;
            },
            getCriticalHitDamage: function(avatar, target) {
                return avatar.attributes.criticalHitDamage + avatar.getExtraAttributes().criticalHitDamage;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel * (1 + avatar.getExtraAttributes().defenseBreakMultiply) / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                // 秘籍 + 未知二段伤害
                return 1.12 * 1.48;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, hitType) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                // 秘籍
                if (hitType != HitType.Miss) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 1);
                }
                // 奇穴：深埋
                if (hitType == HitType.Critical) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
            }
        },
        {
            type: SkillType.Normal,
            name: "天地无极",
            target: SkillTarget.Enemy,
            cdRest: 0,
            gcdLevel: 0,
            getColdTime: function(avatar, target) {
                // 奇穴：风逝
                return 6;
            },
            getWeaponCoef: function(avatar, target) {
                return 0;
            },
            getSkillCoef: function(avatar, target) {
                return 0.925;
            },
            getBasicDamage: function(avatar, target) {
                return randBetween(129, 142);
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower + avatar.attributes.basicAttackPower * avatar.getExtraAttributes().basicAttckPowerMultiply;
            },
            getCriticalHitChance: function(avatar, target) {
                // 奇穴：风逝
                return avatar.attributes.criticalHitChance + avatar.getExtraAttributes().criticalHitChance + 0.1;
            },
            getCriticalHitDamage: function(avatar, target) {
                return avatar.attributes.criticalHitDamage + avatar.getExtraAttributes().criticalHitDamage;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel * (1 + avatar.getExtraAttributes().defenseBreakMultiply) / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                return 1.00;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, hitType) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                // 奇穴：无欲
                if (hitType == HitType.Critical) {
                    SkillFactory.getSkillByName("八荒归元").cdRest = 0;
                }
                // 奇穴：深埋
                if (hitType == HitType.Critical) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
            }
        },
        {
            type: SkillType.Casting,
            name: "碎星辰",
            target: SkillTarget.Self,
            cdRest: 0,
            gcdLevel: 0,
            getColdTime: function(avatar, target) {
                return 10;
            },
            getCastingDuration:function(avatar, target) {
                return 1;
            },
            after: function(avatar, target) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                avatar.addBuff("碎星辰");
                // 奇穴：期声
                avatar.addBuff("期声");
            }
        },
        {
            type: SkillType.Normal,
            name: "人剑合一",
            target: SkillTarget.Enemy,
            cdRest: 0,
            gcdLevel: 0,
            getColdTime: function(avatar, target) {
                // 秘籍
                return 20 - 3 - 2;
            },
            getWeaponCoef: function(avatar, target) {
                return 0;
            },
            getSkillCoef: function(avatar, target) {
                return 0.1;
            },
            getBasicDamage: function(avatar, target) {
                return 63;
            },
            getWeaponDamage: function(avatar, target) {
                return avatar.attributes.weaponDamage;
            },
            getFinalAttackPower: function(avatar, target) {
                return avatar.attributes.finalAttackPower + avatar.attributes.basicAttackPower * avatar.getExtraAttributes().basicAttckPowerMultiply;
            },
            getCriticalHitChance: function(avatar, target) {
                return avatar.attributes.criticalHitChance + avatar.getExtraAttributes().criticalHitChance;
            },
            getCriticalHitDamage: function(avatar, target) {
                return avatar.attributes.criticalHitDamage + avatar.getExtraAttributes().criticalHitDamage;
            },
            getDefenseBreakRate: function(avatar, target) {
                return avatar.attributes.defenseBreakLevel * (1 + avatar.getExtraAttributes().defenseBreakMultiply) / DEFENSE_BREAK_COEF / 100;
            },
            getGlobalBenefit: function(avatar, target) {
                return 1.00;
            },
            getTargetDefenseRate: function(avatar, target) {
                return target.attributes.defenseRate;
            },
            after: function(avatar, target, hitType) {
                avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                // 奇穴：玄门
                if (avatar.getBuffByName("碎星辰") != null) {
                    avatar.removeBuff("碎星辰");
                    avatar.addBuff("玄门");
                }
                // 奇穴：深埋
                if (hitType == HitType.Critical) {
                    avatar.attributes.qidian = Math.min(MAX_QIDIAN, avatar.attributes.qidian + 2);
                }
            }
        },
    ],
    getSkillByName : function(name) {
        for (var key in this.skills) {
            var skill = this.skills[key];
            if (skill.name === name) {
                return skill;
            }
        }
        return null;
    }
}

/*
 * Determine hit type of a skill
 */
function CalcSkillHitType(skill, avatar, target) {
    // Caculate the table
    var missChance = Math.max(target.attributes.requiredHitChance - avatar.attributes.hitChance, 0);
    var blockChance = Math.min(Math.max(target.attributes.requiredPrecisionChance - avatar.attributes.precisionChance, 0), 1 - missChance);
    var criticalHitChance = Math.min(skill.getCriticalHitChance(avatar, target), 1 - missChance - blockChance);
    var hitChance = 1 - missChance - blockChance - criticalHitChance;
    // Roll once
    var roll = Math.random();
    if (roll < missChance) {
        return HitType.Miss;
    }
    if (roll < missChance + blockChance) {
        return HitType.Block;
    }
    if (roll < missChance + blockChance + criticalHitChance) {
        return HitType.Critical;
    }
    return HitType.Hit;
}

/*
 * Calc damage of a skill
 */
function CalcSkillDamage(skill, avatar, target, hitType) {
    // Miss
    if (hitType == HitType.Miss) {
        return 0;
    }
    // Basic damage
    var weaponDamage = skill.getWeaponCoef(avatar, target) * skill.getWeaponDamage(avatar, target);
    var skillDamage = (skill.getSkillCoef(avatar, target) - skill.getWeaponCoef(avatar, target) / 10) * skill.getFinalAttackPower(avatar, target);
    var damage = skill.getBasicDamage(avatar, target) + weaponDamage + skillDamage;
    // Defense break
    damage = damage * (1 + skill.getDefenseBreakRate(avatar, target));
    // Crit damage
    if (hitType == HitType.Critical) {
        damage = damage * skill.getCriticalHitDamage(avatar, target);
    }
    // Block damage
    if (hitType == HitType.Block) {
        damage = damage / 4;
    }
    // Global benefit
    damage = damage * skill.getGlobalBenefit(avatar, target);
    // Target's defense
    damage = damage * (1 - skill.getTargetDefenseRate(avatar, target));
    // Response
    return damage;
}