/**
 * An application class which provides advanced configuration for special character flags which modify an Actor
 * @extends {BaseEntitySheet}
 */
export default class ActorSheetFlags extends BaseEntitySheet {
  static get defaultOptions() {
    const options = super.defaultOptions;
    return mergeObject(options, {
      id: "actor-flags",
	    classes: ["kryx_rpg"],
      template: "systems/kryx_rpg/templates/apps/actor-flags.html",
      width: 500,
      closeOnSubmit: true
    });
  }

  /* -------------------------------------------- */

  /**
   * Configure the title of the special traits selection window to include the Actor name
   * @type {String}
   */
  get title() {
    return `${game.i18n.localize('KRYX_RPG.FlagsTitle')}: ${this.object.name}`;
  }

  /* -------------------------------------------- */

  /**
   * Prepare data used to render the special Actor traits selection UI
   * @return {Object}
   */
  getData() {
    const data = super.getData();
    data.actor = this.object;
    data.flags = this._getFlags();
    data.bonuses = this._getBonuses();
    return data;
  }

  /* -------------------------------------------- */

  /**
   * Prepare an object of flags data which groups flags by section
   * Add some additional data for rendering
   * @return {Object}
   */
  _getFlags() {
    const flags = {};
    for ( let [k, v] of Object.entries(CONFIG.KRYX_RPG.characterFlags) ) {
      if ( !flags.hasOwnProperty(v.section) ) flags[v.section] = {};
      let flag = duplicate(v);
      flag.type = v.type.name;
      flag.isCheckbox = v.type === Boolean;
      flag.isSelect = v.hasOwnProperty('choices');
      flag.value = this.entity.getFlag("kryx_rpg", k);
      flags[v.section][`flags.kryx_rpg.${k}`] = flag;
    }
    return flags;
  }

  /* -------------------------------------------- */

  /**
   * Get the bonuses fields and their localization strings
   * @return {Array}
   * @private
   */
  _getBonuses() {
    const bonuses = [
      {name: "data.bonuses.mwak.attack", label: "KRYX_RPG.BonusMWAttack"},
      {name: "data.bonuses.mwak.damage", label: "KRYX_RPG.BonusMWDamage"},
      {name: "data.bonuses.rwak.attack", label: "KRYX_RPG.BonusRWAttack"},
      {name: "data.bonuses.rwak.damage", label: "KRYX_RPG.BonusRWDamage"},
      {name: "data.bonuses.msak.attack", label: "KRYX_RPG.BonusMSAttack"},
      {name: "data.bonuses.msak.damage", label: "KRYX_RPG.BonusMSDamage"},
      {name: "data.bonuses.rsak.attack", label: "KRYX_RPG.BonusRSAttack"},
      {name: "data.bonuses.rsak.damage", label: "KRYX_RPG.BonusRSDamage"},
      {name: "data.bonuses.abilities.check", label: "KRYX_RPG.BonusAbilityCheck"},
      {name: "data.bonuses.abilities.save", label: "KRYX_RPG.BonusAbilitySave"},
      {name: "data.bonuses.abilities.skill", label: "KRYX_RPG.BonusAbilitySkill"},
      {name: "data.bonuses.spell.dc", label: "KRYX_RPG.BonusSpellDC"}
    ];
    for ( let b of bonuses ) {
      b.value = getProperty(this.object.data, b.name) || "";
    }
    return bonuses;
  }

  /* -------------------------------------------- */

  /**
   * Update the Actor using the configured flags
   * Remove/unset any flags which are no longer configured
   */
  async _updateObject(event, formData) {
    const actor = this.object;
    const updateData = expandObject(formData);

    // Unset any flags which are "false"
    let unset = false;
    const flags = updateData.flags.kryx_rpg;
    for ( let [k, v] of Object.entries(flags) ) {
      if ( [undefined, null, "", false, 0].includes(v) ) {
        delete flags[k];
        if ( hasProperty(actor.data.flags, `kryx_rpg.${k}`) ) {
          unset = true;
          flags[`-=${k}`] = null;
        }
      }
    }

    // Apply the changes
    await actor.update(updateData, {diff: false});
  }
}
